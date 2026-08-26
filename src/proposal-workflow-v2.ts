import { ADMIN_EMAIL, ProposalWorkflow, SITE_URL, sendMail } from "./proposal-workflow";

const statusKey = (accessId: string) => `proposals/${accessId}/status.json`;

async function writeStatus(bucket: R2Bucket, accessId: string, payload: Record<string, unknown>) {
  await bucket.put(
    statusKey(accessId),
    JSON.stringify({ ...payload, updatedAt: new Date().toISOString() }, null, 2),
    { httpMetadata: { contentType: "application/json; charset=utf-8" } },
  );
}

const escapeHtml = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;",
})[character]!);

function safeErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return message
    .replace(/Bearer\s+[^\s"']+/gi, "Bearer [REDACTED]")
    .replace(/\bsk-[A-Za-z0-9_-]+\b/g, "[REDACTED]")
    .slice(0, 3000);
}

export class ProposalWorkflowV2 extends ProposalWorkflow {
  async run(event: any, step: any) {
    const { hearingId, accessId, hearing } = event.payload ?? {};

    await writeStatus(this.env.PROPOSALS, accessId, {
      hearingId,
      accessId,
      company: hearing?.company ?? "",
      status: "running",
      message: "受付済み。提案書生成を開始しました。",
      startedAt: new Date().toISOString(),
    });

    try {
      const result = await super.run(event, step);
      await writeStatus(this.env.PROPOSALS, accessId, {
        hearingId,
        accessId,
        company: hearing?.company ?? "",
        status: "completed",
        message: "提案書・Web版ラフ生成と管理メール送信が完了しました。Googleスライドがある場合は編集・確定へ進んでください。",
        completedAt: new Date().toISOString(),
      });
      return result;
    } catch (error) {
      const message = safeErrorMessage(error);
      await writeStatus(this.env.PROPOSALS, accessId, {
        hearingId,
        accessId,
        company: hearing?.company ?? "",
        status: "error",
        message: "提案書生成でエラーが発生しました。",
        error: message,
        failedAt: new Date().toISOString(),
      }).catch((statusError) => {
        console.error(JSON.stringify({
          event: "proposal_failure_status_write_error",
          hearingId,
          message: safeErrorMessage(statusError),
        }));
      });

      try {
        await step.do("send admin failure mail", { retries: { limit: 3, delay: "5 seconds", backoff: "linear" } }, async () => {
          const statusUrl = `${SITE_URL}/admin/proposals`;
          await sendMail(this.env, {
            from: this.env.CONTACT_FROM_EMAIL,
            to: [ADMIN_EMAIL],
            subject: `【WSW 提案書生成失敗】${hearing?.company || "会社名未取得"} / ${hearingId}`,
            text: `ヒアリング受付後の提案書生成でエラーが発生しました。\n\n受付ID：${hearingId}\n会社・組織名：${hearing?.company || "未取得"}\nエラー：${message}\n\n管理画面：${statusUrl}\n\n回答者への受付メールは送信済みですが、提案書の生成完了メールは送信されていません。`,
            html: `<h2>提案書生成でエラーが発生しました</h2><p><strong>受付ID</strong><br>${escapeHtml(hearingId)}</p><p><strong>会社・組織名</strong><br>${escapeHtml(hearing?.company || "未取得")}</p><p><strong>エラー</strong><br>${escapeHtml(message).replace(/\n/g, "<br>")}</p><p><a href="${statusUrl}">提案書生成の管理画面を確認する</a></p><p>回答者への受付メールは送信済みですが、提案書の生成完了メールは送信されていません。</p>`,
          }, `proposal-failed-${hearingId}`);
          return { ok: true };
        });
      } catch (notificationError) {
        console.error(JSON.stringify({
          event: "proposal_failure_mail_error",
          hearingId,
          message: safeErrorMessage(notificationError),
        }));
      }
      throw error;
    }
  }
}
