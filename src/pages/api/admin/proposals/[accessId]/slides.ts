import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { createProposalSlides, googleSlidesConfigured } from "../../../../../google-slides";
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

  const [proposal, hearing, status] = await Promise.all([
    readJson<any>(runtime.PROPOSALS, `proposals/${accessId}/proposal.json`),
    readJson<any>(runtime.PROPOSALS, `proposals/${accessId}/hearing.json`),
    readJson<any>(runtime.PROPOSALS, `proposals/${accessId}/status.json`),
  ]);
  if (!proposal || !hearing) return Response.json({ message: "提案書データがまだ生成されていません。" }, { status: 409 });

  try {
    const record = await createProposalSlides(runtime, proposal, hearing, status?.hearingId || accessId,);
    await writeJson(runtime.PROPOSALS, `proposals/${accessId}/slides.json`, record);
    await updateProposalStatus(runtime.PROPOSALS, accessId, { message: "編集用Googleスライドを生成しました。" });
    return Response.json({ message: "Googleスライドを生成しました。", editUrl: record.editUrl });
  } catch (error) {
    const message = safeError(error);
    await updateProposalStatus(runtime.PROPOSALS, accessId, { message: "Googleスライド生成でエラーが発生しました。", slidesError: message }).catch(() => undefined);
    return Response.json({ message }, { status: 502 });
  }
};

export const ALL: APIRoute = () => new Response("Method Not Allowed", { status: 405 });

