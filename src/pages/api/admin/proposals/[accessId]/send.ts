import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { exportProposalSlidesPdf, googleSlidesConfigured, type ProposalSlidesRecord } from "../../../../../google-slides";
import { authenticated, readJson, safeError, sameOrigin, unauthorized, updateProposalStatus, validAccessId, writeJson } from "../../../../../proposal-admin";
import { ADMIN_EMAIL, sendMail } from "../../../../../proposal-workflow";

export const prerender = false;
const runtime = env as any;

function base64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, Math.min(offset + 0x8000, bytes.length)));
  }
  return btoa(binary);
}

const esc = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
})[character]!);

export const POST: APIRoute = async ({ request, params }) => {
  if (!runtime.ADMIN_STATUS_PASSWORD) return Response.json({ message: "ADMIN_STATUS_PASSWORDが未設定です。" }, { status: 503 });
  if (!authenticated(request, runtime)) return unauthorized();
  if (!sameOrigin(request)) return Response.json({ message: "不正な送信元です。" }, { status: 403 });
  if (!runtime.PROPOSALS) return Response.json({ message: "R2 binding PROPOSALSが未設定です。" }, { status: 503 });
  if (!googleSlidesConfigured(runtime)) return Response.json({ message: "Googleスライド連携が未設定です。" }, { status: 503 });
  const accessId = validAccessId(params.accessId);
  if (!accessId) return Response.json({ message: "案件IDが正しくありません。" }, { status: 400 });
  const [record, hearing, status] = await Promise.all([
    readJson<ProposalSlidesRecord>(runtime.PROPOSALS, `proposals/${accessId}/slides.json`),
    readJson<any>(runtime.PROPOSALS, `proposals/${accessId}/hearing.json`),
    readJson<any>(runtime.PROPOSALS, `proposals/${accessId}/status.json`),
  ]);
  if (!record?.presentationId) return Response.json({ message: "先にGoogleスライドを生成してください。" }, { status: 409 });
  const recipient = String(hearing?.contact?.email ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) return Response.json({ message: "送付先メールアドレスを確認できません。" }, { status: 409 });

  try {
    const pdf = await exportProposalSlidesPdf(runtime, record.presentationId);
    const sentAt = new Date().toISOString();
    await runtime.PROPOSALS.put(`proposals/${accessId}/proposal-final.pdf`, pdf, {
      httpMetadata: { contentType: "application/pdf", contentDisposition: 'inline; filename="WSW-proposal-final.pdf"' },
    });
    await sendMail(runtime, {
      from: runtime.CONTACT_FROM_EMAIL,
      to: [recipient],
      reply_to: ADMIN_EMAIL,
      subject: `【Wani san Web】Webサイト制作のご提案資料 / ${hearing?.company || ""}`,
      text: `${hearing?.contact?.name || ""}様\n\n先日は制作ヒアリングにご回答いただき、ありがとうございました。\nご回答内容をもとに作成したWebサイト制作のご提案資料をお送りします。\n\nご不明点や修正のご希望がございましたら、このメールへご返信ください。`,
      html: `<p>${esc(hearing?.contact?.name || "")}様</p><p>先日は制作ヒアリングにご回答いただき、ありがとうございました。</p><p>ご回答内容をもとに作成したWebサイト制作のご提案資料をお送りします。</p><p>ご不明点や修正のご希望がございましたら、このメールへご返信ください。</p>`,
      attachments: [{ filename: `WSW-${status?.hearingId || "proposal"}.pdf`, content: base64(pdf) }],
    }, `proposal-final-${status?.hearingId || accessId}-${sentAt.slice(0, 16)}`);
    await writeJson(runtime.PROPOSALS, `proposals/${accessId}/slides.json`, { ...record, status: "sent", exportedAt: sentAt, sentAt, recipient, updatedAt: sentAt });
    await updateProposalStatus(runtime.PROPOSALS, accessId, { message: `最終PDFを${recipient}へ送付しました。` });
    return Response.json({ message: "最終PDFを顧客へ送付しました。", pdfUrl: `/proposals/${accessId}/proposal-final.pdf` });
  } catch (error) {
    const message = safeError(error);
    await updateProposalStatus(runtime.PROPOSALS, accessId, { message: "最終PDFの送付でエラーが発生しました。", sendError: message }).catch(() => undefined);
    return Response.json({ message }, { status: 502 });
  }
};

export const ALL: APIRoute = () => new Response("Method Not Allowed", { status: 405 });

