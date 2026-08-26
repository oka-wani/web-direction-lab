import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { exportProposalSlidesPdf, googleSlidesConfigured, type ProposalSlidesRecord } from "../../../../../google-slides";
import { authenticated, readJson, safeError, sameOrigin, unauthorized, updateProposalStatus, validAccessId, writeJson } from "../../../../../proposal-admin";

export const prerender = false;
const runtime = env as any;

export const POST: APIRoute = async ({ request, params }) => {
  if (!runtime.ADMIN_STATUS_PASSWORD) return Response.json({ message: "ADMIN_STATUS_PASSWORDが未設定です。" }, { status: 503 });
  if (!authenticated(request, runtime)) return unauthorized();
  if (!sameOrigin(request)) return Response.json({ message: "不正な送信元です。" }, { status: 403 });
  if (!runtime.PROPOSALS) return Response.json({ message: "R2 binding PROPOSALSが未設定です。" }, { status: 503 });
  if (!googleSlidesConfigured(runtime)) return Response.json({ message: "Googleスライド連携が未設定です。" }, { status: 503 });
  const accessId = validAccessId(params.accessId);
  if (!accessId) return Response.json({ message: "案件IDが正しくありません。" }, { status: 400 });
  const record = await readJson<ProposalSlidesRecord>(runtime.PROPOSALS, `proposals/${accessId}/slides.json`);
  if (!record?.presentationId) return Response.json({ message: "先にGoogleスライドを生成してください。" }, { status: 409 });

  try {
    const pdf = await exportProposalSlidesPdf(runtime, record.presentationId);
    const exportedAt = new Date().toISOString();
    await runtime.PROPOSALS.put(`proposals/${accessId}/proposal-final.pdf`, pdf, {
      httpMetadata: { contentType: "application/pdf", contentDisposition: 'inline; filename="WSW-proposal-final.pdf"' },
    });
    await writeJson(runtime.PROPOSALS, `proposals/${accessId}/slides.json`, { ...record, status: "pdf_ready", exportedAt, updatedAt: exportedAt });
    await updateProposalStatus(runtime.PROPOSALS, accessId, { message: "Googleスライドの最新版をPDFに書き出しました。" });
    return Response.json({ message: "最新版をPDFに書き出しました。", pdfUrl: `/proposals/${accessId}/proposal-final.pdf` });
  } catch (error) {
    const message = safeError(error);
    await updateProposalStatus(runtime.PROPOSALS, accessId, { message: "PDF書き出しでエラーが発生しました。", exportError: message }).catch(() => undefined);
    return Response.json({ message }, { status: 502 });
  }
};

export const ALL: APIRoute = () => new Response("Method Not Allowed", { status: 405 });

