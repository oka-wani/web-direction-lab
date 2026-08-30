import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { recordBookingResponse, type BookingEnv } from "../../booking-reply";
import { contactGuideKey, type ContactGuideDraft } from "../../contact-guide";

export const prerender = false;

type RuntimeEnv = typeof env & BookingEnv & { SESSION?: KVNamespace };
const json = (status: number, message: string) => Response.json({ message }, { status });

export const POST: APIRoute = async ({ request }) => {
  if (!(request.headers.get("content-type") ?? "").includes("application/json")) return json(415, "送信形式が正しくありません。");
  const origin = request.headers.get("origin");
  if (!origin || new URL(origin).host !== new URL(request.url).host) return json(403, "送信元を確認できませんでした。");
  let body: unknown;
  try { body = await request.json(); } catch { return json(400, "入力内容を読み取れませんでした。"); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return json(400, "入力内容が正しくありません。");
  const input = body as Record<string, unknown>;
  const known = new Set(["token", "selectedStart", "meetingMode", "location"]);
  if (Object.keys(input).some((key) => !known.has(key))) return json(400, "想定外の入力項目が含まれています。");
  const token = typeof input.token === "string" ? input.token.trim() : "";
  const selectedStart = typeof input.selectedStart === "string" ? input.selectedStart.trim() : "";
  const meetingMode = input.meetingMode === "online" ? "online" : input.meetingMode === "in-person" ? "in-person" : null;
  const location = typeof input.location === "string" ? input.location.trim() : "";
  if (!/^[a-f0-9]{32}$/.test(token)) return json(400, "回答URLが正しくありません。");
  if (!meetingMode) return json(400, "実施方法を選択してください。");
  if (location.length > 200) return json(400, "場所は200文字以内で入力してください。");
  const runtimeEnv = env as RuntimeEnv;
  if (!runtimeEnv.SESSION) return json(503, "現在この操作を利用できません。");
  const draft = await runtimeEnv.SESSION.get<ContactGuideDraft>(contactGuideKey(token), "json");
  if (!draft) return json(404, "回答URLの有効期限が切れています。");
  try {
    await recordBookingResponse(runtimeEnv, token, draft, { selectedStart, mode: meetingMode, location });
  } catch (error) {
    console.error(JSON.stringify({ event: "contact_booking_web_response_error", token, message: error instanceof Error ? error.message : "unknown" }));
    return json(409, error instanceof Error ? error.message : "回答を送信できませんでした。");
  }
  return Response.redirect(new URL(`/schedule/${token}?submitted=1`, request.url), 303);
};

export const ALL: APIRoute = () => json(405, "POSTメソッドのみ利用できます。");
