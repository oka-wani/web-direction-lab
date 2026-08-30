import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { confirmBooking, type BookingEnv } from "../../booking-reply";
import { contactGuideKey, type ContactGuideDraft } from "../../contact-guide";

export const prerender = false;

type RuntimeEnv = typeof env & BookingEnv & { SESSION?: KVNamespace };

const json = (status: number, message: string) => Response.json({ message }, { status });

export const POST: APIRoute = async ({ request }) => {
  if (!(request.headers.get("content-type") ?? "").includes("application/json")) return json(415, "送信形式が正しくありません。");
  const origin = request.headers.get("origin");
  if (!origin || new URL(origin).host !== new URL(request.url).host) return json(403, "送信元を確認できませんでした。");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, "入力内容を読み取れませんでした。");
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return json(400, "入力内容が正しくありません。");
  const submission = body as Record<string, unknown>;
  const known = new Set(["token", "selectedStart", "meetingMode", "location"]);
  if (Object.keys(submission).some((key) => !known.has(key))) return json(400, "想定外の入力項目が含まれています。");

  const token = typeof submission.token === "string" ? submission.token.trim() : "";
  const selectedStart = typeof submission.selectedStart === "string" ? submission.selectedStart.trim() : "";
  const meetingMode = submission.meetingMode === "in-person" ? "in-person" : submission.meetingMode === "online" ? "online" : null;
  const location = typeof submission.location === "string" ? submission.location.trim() : "";
  if (!/^[a-f0-9]{32}$/.test(token)) return json(400, "確認URLが正しくありません。");
  if (!meetingMode) return json(400, "実施方法を選択してください。");
  if (location.length > 200) return json(400, "場所は200文字以内で入力してください。");

  const runtimeEnv = env as RuntimeEnv;
  if (!runtimeEnv.SESSION) return json(503, "現在この操作を利用できません。");
  const draft = await runtimeEnv.SESSION.get<ContactGuideDraft>(contactGuideKey(token), "json");
  if (!draft) return json(404, "確認URLの有効期限が切れているか、URLが正しくありません。");
  if (!draft.bookingReply && draft.status !== "booked") return json(409, "お客様からの日程返信を確認できません。");

  try {
    await confirmBooking(runtimeEnv, token, draft, { selectedStart, mode: meetingMode, location });
  } catch (error) {
    console.error(JSON.stringify({ event: "contact_booking_confirmation_error", token, message: error instanceof Error ? error.message : "unknown" }));
    return json(409, error instanceof Error ? error.message : "日程を確定できませんでした。");
  }

  const redirectUrl = new URL(`/admin/booking/${token}`, request.url);
  redirectUrl.searchParams.set("confirmed", "1");
  return Response.redirect(redirectUrl, 303);
};

export const ALL: APIRoute = () => json(405, "POSTメソッドのみ利用できます。");
