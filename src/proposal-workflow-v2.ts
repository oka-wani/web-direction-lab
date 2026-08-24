import { ProposalWorkflow } from "./proposal-workflow";

const statusKey = (accessId: string) => `proposals/${accessId}/status.json`;

async function writeStatus(bucket: R2Bucket, accessId: string, payload: Record<string, unknown>) {
  await bucket.put(
    statusKey(accessId),
    JSON.stringify({ ...payload, updatedAt: new Date().toISOString() }, null, 2),
    { httpMetadata: { contentType: "application/json; charset=utf-8" } },
  );
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
        message: "提案書・ラフ生成と管理メール送信が完了しました。",
        completedAt: new Date().toISOString(),
      });
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await writeStatus(this.env.PROPOSALS, accessId, {
        hearingId,
        accessId,
        company: hearing?.company ?? "",
        status: "error",
        message: "提案書生成でエラーが発生しました。",
        error: message,
        failedAt: new Date().toISOString(),
      });
      throw error;
    }
  }
}
