import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

type TurnstileResult = { success: boolean; action?: string; "error-codes"?: string[] };
type GoogleTokenResult = { access_token?: string };
type GoogleFreeBusyResult = { calendars?: Record<string, { busy?: { start: string; end: string }[] }> };

const services = new Set([
  "Webサイトを新しく制作したい",
  "Webサイトをリニューアルしたい",
  "既存サイトを診断・改善したい",
  "SEO・アクセス解析を相談したい",
  "アクセシビリティ・表示速度を確認したい",
  "公開後の保守・更新を相談したい",
  "何を依頼すべきか相談したい",
  "その他",
]);
const budgets = new Set(["", "3万円未満", "3〜5万円", "5〜10万円", "10〜30万円", "30万円以上", "まだ決めていない"]);
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
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    weekday: shifted.getUTCDay(),
  };
}

function dateOnlyToIso(year: number, month: number, day: number, hour: number) {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  const hh = String(hour).padStart(2, "0");
  return `${year}-${mm}-${dd}T${hh}:00:00+09:00`;
}

function addJstDays(base: Date, days: number) {
  const shifted = new Date(base.getTime() + JST_OFFSET_MS);
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return new Date(shifted.getTime() - JST_OFFSET_MS);
}

function formatCandidate(start: Date, index: number) {
  const formatter = new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric", weekday: "short", timeZone: "Asia/Tokyo" });
  return `第${index + 1}候補：${formatter.format(start)} ${String(MEETING_START_HOUR).padStart(2, "0")}:00〜`;
}

function fallbackMeetingCandidates(base = new Date()) {
  const slots: Date[] = [];
  for (let offset = 1; slots.length < MEETING_CANDIDATE_COUNT && offset <= MEETING_SEARCH_DAYS; offset += 1) {
    const day = addJstDays(base, offset);
    const parts = toJstParts(day);
    if (parts.weekday === 0 || parts.weekday === 6) continue;
    slots.push(new Date(dateOnlyToIso(parts.year, parts.month, parts.day, MEETING_START_HOUR)));
  }
  return slots.map(formatCandidate);
}

async function getGoogleAccessToken() {
  if (!configured(env.GOOGLE_CALENDAR_CLIENT_ID) || !configured(env.GOOGLE_CALENDAR_CLIENT_SECRET) || !configured(env.GOOGLE_CALENDAR_REFRESH_TOKEN)) return null;
  const body = new URLSearchParams({
    client_id: env.GOOGLE_CALENDAR_CLIENT_ID,
    client_secret: env.GOOGLE_CALENDAR_CLIENT_SECRET,
    refresh_token: env.GOOGLE_CALENDAR_REFRESH_TOKEN,
    grant_type: "refresh_token",
  });
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) throw new Error(`Google token error: ${response.status}`);
  const result = await response.json() as GoogleTokenResult;
  if (!result.access_token) throw new Error("Google access token missing");
  return result.access_token;
}

async function getMeetingCandidates(base = new Date()) {
  try {
    const accessToken = await getGoogleAccessToken();
    if (!accessToken) return fallbackMeetingCandidates(base);

    const calendarId = configured(env.GOOGLE_CALENDAR_ID) ? env.GOOGLE_CALENDAR_ID : "primary";
    const queryStart = addJstDays(base, 1);
    const queryEnd = addJstDays(base, MEETING_SEARCH_DAYS + 1);
    const startParts = toJstParts(queryStart);
    const endParts = toJstParts(queryEnd);
    const timeMin = dateOnlyToIso(startParts.year, startParts.month, startParts.day, 0);
    const timeMax = dateOnlyToIso(endParts.year, endParts.month, endParts.day, 23);

    const response = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timeMin,
        timeMax,
        timeZone: "Asia/Tokyo",
        items: [{ id: calendarId }],
      }),
    });
    if (!response.ok) throw new Error(`Google freeBusy error: ${response.status}`);
    const result = await response.json() as GoogleFreeBusyResult;
    const busy = result.calendars?.[calendarId]?.busy ?? [];

    const slots: Date[] = [];
    for (let offset = 1; slots.length < MEETING_CANDIDATE_COUNT && offset <= MEETING_SEARCH_DAYS; offset += 1) {
      const day = addJstDays(base, offset);
      const parts = toJstParts(day);
      if (parts.weekday === 0 || parts.weekday === 6) continue;
      const slotStart = new Date(dateOnlyToIso(parts.year, parts.month, parts.day, MEETING_START_HOUR));
      const slotEnd = new Date(slotStart.getTime() + MEETING_DURATION_MINUTES * 60 * 1000);
      const overlaps = busy.some((window) => new Date(window.start) < slotEnd && new Date(window.end) > slotStart);
      if (!overlaps) slots.push(slotStart);
    }
    return slots.length >= MEETING_CANDIDATE_COUNT ? slots.map(formatCandidate) : fallbackMeetingCandidates(base);
  } catch (error) {
    console.error(JSON.stringify({ event: "calendar_availability_error", message: error instanceof Error ? error.message : String(error) }));
    return fallbackMeetingCandidates(base);
  }
}

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data") && !contentType.includes("application/x-www-form-urlencoded")) return json(415, "送信形式が正しくありません。");
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) return json(403, "送信元を確認できませんでした。");

  let data: FormData;
  try { data = await request.formData(); } catch { return json(400, "入力内容を読み取れませんでした。"); }
  const known = new Set(["name", "email", "company", "url", "service", "budget", "schedule", "message", "consent", "website", "cf-turnstile-response"]);
  if ([...data.keys()].some((key) => !known.has(key))) return json(400, "想定外の入力項目が含まれています。");
  if (get(data, "website")) return json(200, "受付しました。");

  const input = { name: get(data, "name"), email: get(data, "email"), company: get(data, "company"), url: get(data, "url"), service: get(data, "service"), budget: get(data, "budget"), schedule: get(data, "schedule"), message: get(data, "message") };
  if (!input.name || !input.email || !input.service || !input.message || get(data, "consent") !== "agreed") return json(400, "必須項目を入力してください。");
  if (input.name.length > 100 || input.email.length > 254 || input.company.length > 150 || input.url.length > 500 || input.schedule.length > 100 || input.message.length > 4000) return json(400, "入力文字数が上限を超えています。");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) return json(400, "メールアドレスの形式を確認してください。");
  if (input.url) { try { const parsed = new URL(input.url); if (!["http:", "https:"].includes(parsed.protocol)) throw new Error(); } catch { return json(400, "対象サイトURLの形式を確認してください。"); } }
  if (!services.has(input.service) || !budgets.has(input.budget)) return json(400, "選択項目が正しくありません。");

  const token = get(data, "cf-turnstile-response");
  if (!token || !env.TURNSTILE_SECRET_KEY) return json(400, "Bot確認を完了してください。");
  const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: request.headers.get("CF-Connecting-IP"), idempotency_key: crypto.randomUUID() }) });
  const turnstile = await verification.json() as TurnstileResult;
  if (!verification.ok || !turnstile.success || turnstile.action !== "contact") return json(400, "Bot確認に失敗しました。もう一度お試しください。");

  if (!configured(env.RESEND_API_KEY) || !configured(env.CONTACT_FROM_EMAIL)) {
    console.error(JSON.stringify({ event: "contact_config_missing" }));
    return json(503, "現在送信を受け付けられません。時間を置いてもう一度お試しください。");
  }

  const rows = [["氏名", input.name], ["メールアドレス", input.email], ["会社名・屋号", input.company || "未入力"], ["対象サイトURL", input.url || "未入力"], ["問い合わせ種別", input.service], ["予算感", input.budget || "未選択"], ["希望時期", input.schedule || "未入力"], ["相談内容", input.message]];
  const text = rows.map(([label, content]) => `${label}: ${content}`).join("\n\n");
  const html = rows.map(([label, content]) => `<p><strong>${escapeHtml(label)}</strong><br>${escapeHtml(content).replace(/\n/g, "<br>")}</p>`).join("");
  const sentAt = new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "medium", timeZone: "Asia/Tokyo" }).format(new Date());
  const candidates = await getMeetingCandidates();
  const candidateText = candidates.join("\n");
  const candidateHtml = candidates.map((candidate) => `<li>${escapeHtml(candidate)}</li>`).join("");

  const customerIntroText = `${input.name}様\n\nお問い合わせありがとうございます。以下の内容で受け付けました。\n\n次のステップとして、初回打ち合わせと制作ヒアリングをお願いいたします。\n\n【初回打ち合わせ候補日】\n${candidateText}\n\nご都合のよい候補を、このメールへの返信でお知らせください。上記で難しい場合は、ご希望日時を2〜3候補お送りください。\n\n【制作ヒアリング】\n${HEARING_URL}\n\n打ち合わせ前に分かる範囲でご回答いただくと、その後のご案内がスムーズです。`;
  const customerIntroHtml = `<p>${escapeHtml(input.name)}様</p><p>お問い合わせありがとうございます。以下の内容で受け付けました。</p><h2 style="font-size:18px">次のステップ</h2><p>初回打ち合わせと制作ヒアリングをお願いいたします。</p><p><strong>初回打ち合わせ候補日</strong></p><ul>${candidateHtml}</ul><p>ご都合のよい候補を、このメールへの返信でお知らせください。上記で難しい場合は、ご希望日時を2〜3候補お送りください。</p><p><strong>制作ヒアリング</strong><br><a href="${HEARING_URL}">${HEARING_URL}</a></p><p>打ち合わせ前に分かる範囲でご回答いただくと、その後のご案内がスムーズです。</p>`;

  const response = await fetch("https://api.resend.com/emails/batch", { method: "POST", headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify([
    { from: env.CONTACT_FROM_EMAIL, to: [ADMIN_EMAIL], reply_to: input.email, subject: `【Wani san Web】${input.name}様からのお問い合わせ`, text: `${text}\n\n送信日時: ${sentAt}\n\n初回打ち合わせ候補日:\n${candidateText}\n\nヒアリングURL: ${HEARING_URL}`, html: `${html}<p><strong>送信日時</strong><br>${escapeHtml(sentAt)}</p><p><strong>初回打ち合わせ候補日</strong></p><ul>${candidateHtml}</ul><p><strong>ヒアリングURL</strong><br><a href="${HEARING_URL}">${HEARING_URL}</a></p>` },
    { from: env.CONTACT_FROM_EMAIL, to: [input.email], reply_to: ADMIN_EMAIL, subject: "【Wani san Web】お問い合わせありがとうございます｜次のご案内", text: `${customerIntroText}\n\n--- お問い合わせ内容 ---\n${text}`, html: `${customerIntroHtml}<hr><h2 style="font-size:18px">お問い合わせ内容</h2>${html}` },
  ]) });
  if (!response.ok) { console.error(JSON.stringify({ event: "resend_error", status: response.status, body: await response.text() })); return json(502, "メール送信に失敗しました。時間を置いてもう一度お試しください。"); }
  console.log(JSON.stringify({ event: "contact_sent", service: input.service, sentAt }));
  return json(200, "受付しました。");
};

export const ALL: APIRoute = () => json(405, "POSTメソッドのみ利用できます。");
