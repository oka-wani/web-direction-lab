import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { CONTACT_GUIDE_TTL_SECONDS, contactGuideKey, type ContactGuideDraft } from "../../contact-guide";

export const prerender = false;

type TurnstileResult = { success: boolean; action?: string; "error-codes"?: string[] };
type GoogleTokenResult = { access_token?: string };
type GoogleFreeBusyResult = { calendars?: Record<string, { busy?: { start: string; end: string }[] }> };
type RuntimeEnv = typeof env & { SESSION?: KVNamespace };

const services = new Set([
  "Webサイトの新規作成",
  "Webサイトのリニューアル",
  "SEO/アクセス解析について",
  "何を依頼すべきか相談したい",
  "その他",
]);
const siteBuildServices = new Set(["Webサイトの新規作成", "Webサイトのリニューアル"]);
const json = (status: number, message: string) => Response.json({ message }, { status });
const get = (data: FormData, key: string) => typeof data.get(key) === "string" ? String(data.get(key)).trim() : "";
const escapeHtml = (input: string) => input.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]!);
const configured = (input: string | undefined) => Boolean(input && !input.startsWith("SET_IN_"));

const ADMIN_EMAIL = "contact@wani-san.com";
const HEARING_URL = "https://www.wani-san.com/hearing/";
const MEETING_START_HOUR = 19;
const MEETING_DURATION_MINUTES = 60;
const MEETING_CANDIDATE_COUNT = 3;
const MEETING_SEARCH_DAYS = 21;
const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

function toJstParts(date: Date) {
  const shifted = new Date(date.getTime() + JST_OFFSET_MS);
  return { year: shifted.getUTCFullYear(), month: shifted.getUTCMonth() + 1, day: shifted.getUTCDate(), weekday: shifted.getUTCDay() };
}
function dateOnlyToIso(year: number, month: number, day: number, hour: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:00:00+09:00`;
}
function addJstDays(base: Date, days: number) {
  const shifted = new Date(base.getTime() + JST_OFFSET_MS); shifted.setUTCDate(shifted.getUTCDate() + days); return new Date(shifted.getTime() - JST_OFFSET_MS);
}
function formatCandidate(start: Date, index: number) {
  const formatter = new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric", weekday: "short", timeZone: "Asia/Tokyo" });
  return `第${index + 1}候補：${formatter.format(start)} ${String(MEETING_START_HOUR).padStart(2, "0")}:00〜`;
}
function fallbackMeetingCandidates(base = new Date()) {
  const slots: Date[] = [];
  for (let offset = 1; slots.length < MEETING_CANDIDATE_COUNT && offset <= MEETING_SEARCH_DAYS; offset += 1) {
    const day = addJstDays(base, offset); const parts = toJstParts(day); if (parts.weekday === 0 || parts.weekday === 6) continue;
    slots.push(new Date(dateOnlyToIso(parts.year, parts.month, parts.day, MEETING_START_HOUR)));
  }
  return slots.map(formatCandidate);
}
async function getGoogleAccessToken() {
  if (!configured(env.GOOGLE_CALENDAR_CLIENT_ID) || !configured(env.GOOGLE_CALENDAR_CLIENT_SECRET) || !configured(env.GOOGLE_CALENDAR_REFRESH_TOKEN)) return null;
  const body = new URLSearchParams({ client_id: env.GOOGLE_CALENDAR_CLIENT_ID, client_secret: env.GOOGLE_CALENDAR_CLIENT_SECRET, refresh_token: env.GOOGLE_CALENDAR_REFRESH_TOKEN, grant_type: "refresh_token" });
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body });
  if (!response.ok) throw new Error(`Google token error: ${response.status}`);
  const result = await response.json() as GoogleTokenResult; if (!result.access_token) throw new Error("Google access token missing"); return result.access_token;
}
async function getMeetingCandidates(base = new Date()) {
  try {
    const accessToken = await getGoogleAccessToken(); if (!accessToken) return fallbackMeetingCandidates(base);
    const calendarId = configured(env.GOOGLE_CALENDAR_ID) ? env.GOOGLE_CALENDAR_ID : "primary";
    const queryStart = addJstDays(base, 1); const queryEnd = addJstDays(base, MEETING_SEARCH_DAYS + 1);
    const startParts = toJstParts(queryStart); const endParts = toJstParts(queryEnd);
    const response = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", { method: "POST", headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" }, body: JSON.stringify({ timeMin: dateOnlyToIso(startParts.year, startParts.month, startParts.day, 0), timeMax: dateOnlyToIso(endParts.year, endParts.month, endParts.day, 23), timeZone: "Asia/Tokyo", items: [{ id: calendarId }] }) });
    if (!response.ok) throw new Error(`Google freeBusy error: ${response.status}`);
    const result = await response.json() as GoogleFreeBusyResult; const busy = result.calendars?.[calendarId]?.busy ?? []; const slots: Date[] = [];
    for (let offset = 1; slots.length < MEETING_CANDIDATE_COUNT && offset <= MEETING_SEARCH_DAYS; offset += 1) {
      const day = addJstDays(base, offset); const parts = toJstParts(day); if (parts.weekday === 0 || parts.weekday === 6) continue;
      const slotStart = new Date(dateOnlyToIso(parts.year, parts.month, parts.day, MEETING_START_HOUR)); const slotEnd = new Date(slotStart.getTime() + MEETING_DURATION_MINUTES * 60 * 1000);
      if (!busy.some((window) => new Date(window.start) < slotEnd && new Date(window.end) > slotStart)) slots.push(slotStart);
    }
    return slots.length >= MEETING_CANDIDATE_COUNT ? slots.map(formatCandidate) : fallbackMeetingCandidates(base);
  } catch (error) {
    console.error(JSON.stringify({ event: "calendar_availability_error", message: error instanceof Error ? error.message : String(error) })); return fallbackMeetingCandidates(base);
  }
}

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data") && !contentType.includes("application/x-www-form-urlencoded")) return json(415, "送信形式が正しくありません。");
  const origin = request.headers.get("origin"); if (origin && new URL(origin).host !== new URL(request.url).host) return json(403, "送信元を確認できませんでした。");
  let data: FormData; try { data = await request.formData(); } catch { return json(400, "入力内容を読み取れませんでした。"); }
  const known = new Set(["name", "email", "company", "url", "service", "message", "consent", "website", "cf-turnstile-response"]);
  if ([...data.keys()].some((key) => !known.has(key))) return json(400, "想定外の入力項目が含まれています。");
  if (get(data, "website")) return json(200, "受付しました。");
  const input = { name: get(data, "name"), email: get(data, "email"), company: get(data, "company"), url: get(data, "url"), service: get(data, "service"), message: get(data, "message") };
  if (!input.name || !input.email || !input.service || get(data, "consent") !== "agreed") return json(400, "必須項目を入力してください。");
  if (input.name.length > 100 || input.email.length > 254 || input.company.length > 150 || input.url.length > 500 || input.message.length > 4000) return json(400, "入力文字数が上限を超えています。");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) return json(400, "メールアドレスの形式を確認してください。");
  if (input.url) { try { const parsed = new URL(input.url); if (!["http:", "https:"].includes(parsed.protocol)) throw new Error(); } catch { return json(400, "対象サイトURLの形式を確認してください。"); } }
  if (!services.has(input.service)) return json(400, "選択項目が正しくありません。");

  const token = get(data, "cf-turnstile-response"); if (!token || !env.TURNSTILE_SECRET_KEY) return json(400, "Bot確認を完了してください。");
  const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: request.headers.get("CF-Connecting-IP"), idempotency_key: crypto.randomUUID() }) });
  const turnstile = await verification.json() as TurnstileResult; if (!verification.ok || !turnstile.success || turnstile.action !== "contact") return json(400, "Bot確認に失敗しました。もう一度お試しください。");
  if (!configured(env.RESEND_API_KEY) || !configured(env.CONTACT_FROM_EMAIL)) return json(503, "現在送信を受け付けられません。時間を置いてもう一度お試しください。");

  const rows = [["氏名", input.name], ["メールアドレス", input.email], ["会社名・屋号", input.company || "未入力"], ["対象サイトURL", input.url || "未入力"], ["問い合わせ種別", input.service], ["相談内容", input.message || "未入力"]];
  const text = rows.map(([label, content]) => `${label}: ${content}`).join("\n\n"); const html = rows.map(([label, content]) => `<p><strong>${escapeHtml(label)}</strong><br>${escapeHtml(content).replace(/\n/g, "<br>")}</p>`).join("");
  const sentAt = new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "medium", timeZone: "Asia/Tokyo" }).format(new Date());
  const candidates = await getMeetingCandidates(); const candidateText = candidates.join("\n"); const candidateHtml = candidates.map((candidate) => `<li>${escapeHtml(candidate)}</li>`).join("");
  const shouldGuideHearing = siteBuildServices.has(input.service);

  let hearingUrl = HEARING_URL;
  let guideUrl = "";
  if (shouldGuideHearing) {
    const hearingToken = crypto.randomUUID().replace(/-/g, "");
    const session = (env as RuntimeEnv).SESSION;
    if (!session) return json(503, "現在送信を受け付けられません。時間を置いてもう一度お試しください。");
    await session.put(`hearing:${hearingToken}`, JSON.stringify({ name: input.name, email: input.email, company: input.company, contactUrl: input.url, service: input.service, createdAt: new Date().toISOString() }), { expirationTtl: CONTACT_GUIDE_TTL_SECONDS });
    hearingUrl = `${HEARING_URL}?token=${encodeURIComponent(hearingToken)}`;

    const guideToken = crypto.randomUUID().replace(/-/g, "");
    const draft: ContactGuideDraft = { customerName: input.name, customerEmail: input.email, company: input.company, service: input.service, hearingUrl, candidates, createdAt: new Date().toISOString(), status: "pending" };
    await session.put(contactGuideKey(guideToken), JSON.stringify(draft), { expirationTtl: CONTACT_GUIDE_TTL_SECONDS });
    guideUrl = `https://www.wani-san.com/admin/contact/${guideToken}`;
  }

  const customerText = `${input.name}様\n\nお問い合わせありがとうございました。\n内容を確認のうえ、担当者から改めてご連絡いたします。\n\nWani san Web`;
  const customerHtml = `<p>${escapeHtml(input.name)}様</p><p>お問い合わせありがとうございました。<br>内容を確認のうえ、担当者から改めてご連絡いたします。</p><p>Wani san Web</p>`;
  const guideText = guideUrl ? `\n\nお客様への案内操作:\nそのまま送る: ${guideUrl}\n日程候補を変更する: ${guideUrl}?mode=edit` : "";
  const guideHtml = guideUrl ? `<hr><p><strong>お客様への案内操作</strong></p><p><a href="${guideUrl}" style="display:inline-block;padding:12px 20px;border-radius:999px;background:#315b3a;color:#fff;text-decoration:none;font-weight:bold">そのまま送る</a></p><p><a href="${guideUrl}?mode=edit" style="display:inline-block;padding:12px 20px;border:1px solid #315b3a;border-radius:999px;color:#315b3a;text-decoration:none;font-weight:bold">日程候補を変更する</a></p><p style="color:#667066;font-size:13px">リンク先の確認ページで送信を確定します。</p>` : "";

  const response = await fetch("https://api.resend.com/emails/batch", { method: "POST", headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify([
    { from: env.CONTACT_FROM_EMAIL, to: [ADMIN_EMAIL], reply_to: input.email, subject: `【Wani san Web】${input.name}様からのお問い合わせ`, text: `${text}\n\n送信日時: ${sentAt}\n\n初回打ち合わせ候補日:\n${candidateText}\n\nヒアリングURL: ${hearingUrl}${guideText}`, html: `${html}<p><strong>送信日時</strong><br>${escapeHtml(sentAt)}</p><p><strong>初回打ち合わせ候補日</strong></p><ul>${candidateHtml}</ul><p><strong>ヒアリングURL</strong><br><a href="${hearingUrl}">${hearingUrl}</a></p>${guideHtml}` },
    { from: env.CONTACT_FROM_EMAIL, to: [input.email], reply_to: ADMIN_EMAIL, subject: "【Wani san Web】お問い合わせを受け付けました", text: customerText, html: customerHtml },
  ]) });
  if (!response.ok) { console.error(JSON.stringify({ event: "resend_error", status: response.status, body: await response.text() })); return json(502, "メール送信に失敗しました。時間を置いてもう一度お試しください。"); }
  console.log(JSON.stringify({ event: "contact_sent", service: input.service, sentAt })); return json(200, "受付しました。");
};
export const ALL: APIRoute = () => json(405, "POSTメソッドのみ利用できます。");
