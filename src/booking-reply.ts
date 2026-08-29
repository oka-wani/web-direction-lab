import { CONTACT_GUIDE_TTL_SECONDS, contactGuideKey, type ContactGuideDraft } from "./contact-guide";
import { createMeetingEvent, getGoogleAccessToken, getMeetingEvent, getMeetUrl, isCalendarSlotFree, type CalendarEnv } from "./google-calendar";

type BookingEnv = CalendarEnv & { SESSION?: KVNamespace; RESEND_API_KEY: string; CONTACT_FROM_EMAIL: string; CONTACT_ADMIN_EMAIL?: string };
type ParsedMail = { subject: string; text: string };
const REPLY_DOMAIN = "reply.wani-san.com";
export const SCHEDULE_REPLY_ADDRESS = `schedule@${REPLY_DOMAIN}`;
const FALLBACK_ADMIN_EMAIL = "contact@wani-san.com";
const configured = (value: string | undefined) => Boolean(value && !value.startsWith("SET_IN_"));
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]!);

function splitHeaders(source: string) {
  const index = source.search(/\r?\n\r?\n/);
  const rawHeaders = index >= 0 ? source.slice(0, index) : source;
  const body = index >= 0 ? source.slice(index).replace(/^\r?\n\r?\n/, "") : "";
  const headers = new Map<string, string>();
  for (const line of rawHeaders.replace(/\r?\n[ \t]+/g, " ").split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator > 0) headers.set(line.slice(0, separator).toLowerCase(), line.slice(separator + 1).trim());
  }
  return { headers, body };
}

function decodeBody(body: string, encoding: string) {
  if (/base64/i.test(encoding)) {
    const bytes = Uint8Array.from(atob(body.replace(/\s/g, "")), (character) => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
  if (/quoted-printable/i.test(encoding)) {
    const value = body.replace(/=\r?\n/g, "");
    const bytes: number[] = [];
    for (let index = 0; index < value.length;) {
      const match = value.slice(index).match(/^=([0-9A-F]{2})/i);
      if (match) { bytes.push(Number.parseInt(match[1], 16)); index += 3; continue; }
      const character = value[index];
      bytes.push(...new TextEncoder().encode(character));
      index += character.length;
    }
    return new TextDecoder().decode(new Uint8Array(bytes));
  }
  return body;
}

function findTextPart(source: string): { text: string; html: boolean } | null {
  const { headers, body } = splitHeaders(source);
  const contentType = headers.get("content-type") ?? "text/plain";
  const boundary = contentType.match(/boundary=(?:"([^"]+)"|([^;\s]+))/i)?.slice(1).find(Boolean);
  if (/multipart\//i.test(contentType) && boundary) {
    const parts = body.split(`--${boundary}`).slice(1).filter((part) => !part.startsWith("--"));
    const parsed = parts.map(findTextPart).filter((part): part is { text: string; html: boolean } => Boolean(part));
    return parsed.find((part) => !part.html) ?? parsed[0] ?? null;
  }
  if (!/text\/(plain|html)/i.test(contentType)) return null;
  return { text: decodeBody(body, headers.get("content-transfer-encoding") ?? ""), html: /text\/html/i.test(contentType) };
}

function parseMail(raw: string): ParsedMail {
  const { headers } = splitHeaders(raw);
  const part = findTextPart(raw);
  const text = part?.html ? part.text.replace(/<br\s*\/?\s*>/gi, "\n").replace(/<[^>]+>/g, " ") : part?.text ?? "";
  return { subject: headers.get("subject") ?? "", text };
}

function visibleReply(text: string) {
  return text
    .split(/\r?\n/)
    .filter((line) => !/^\s*>/.test(line))
    .join("\n")
    .split(/(?:\nOn .+wrote:|\n20\d{2}[\/年].+のメール|\n-{2,}\s*Original Message)/i)[0]
    .trim()
    .slice(0, 3000);
}

export function candidateSlots(candidates: string[], createdAt: string) {
  const created = new Date(createdAt);
  const baseYear = Number.isNaN(created.getTime()) ? new Date().getFullYear() : Number(new Intl.DateTimeFormat("en", { year: "numeric", timeZone: "Asia/Tokyo" }).format(created));
  return candidates.flatMap((label) => {
    const match = label.match(/(\d{1,2})[\/.月](\d{1,2})日?[^0-9]{0,12}(\d{1,2}):(\d{2})/);
    if (!match) return [];
    const [, month, day, hour, minute] = match;
    return [{ label, start: `${baseYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hour.padStart(2, "0")}:${minute}:00+09:00` }];
  });
}

function chooseSlot(text: string, slots: { label: string; start: string }[]) {
  const indexMatch = text.match(/(?:第\s*)?([1-5一二三四五])\s*(?:候補|番)/) ?? text.match(/[①②③④⑤]/);
  if (indexMatch) {
    const source = indexMatch[1] ?? indexMatch[0];
    const index = ({ "1": 0, "一": 0, "①": 0, "2": 1, "二": 1, "②": 1, "3": 2, "三": 2, "③": 2, "4": 3, "四": 3, "④": 3, "5": 4, "五": 4, "⑤": 4 } as Record<string, number>)[source];
    if (slots[index]) return slots[index];
  }
  const requested = [...text.matchAll(/(\d{1,2})[\/.月](\d{1,2})日?[^0-9]{0,12}(\d{1,2}):(\d{2})/g)];
  const matches = slots.filter((slot) => {
    const date = new Date(slot.start);
    const parts = new Intl.DateTimeFormat("en-US", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "Asia/Tokyo" }).formatToParts(date);
    const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
    return requested.some((match) => Number(match[1]) === get("month") && Number(match[2]) === get("day") && Number(match[3]) === get("hour") && Number(match[4]) === get("minute"));
  });
  return matches.length === 1 ? matches[0] : null;
}

async function sendEmail(env: BookingEnv, payload: Record<string, unknown>, key: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": key },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Resend error: ${response.status} ${await response.text()}`);
}

async function notifyReview(env: BookingEnv, token: string, draft: ContactGuideDraft, reason: string, reply: string) {
  const admin = configured(env.CONTACT_ADMIN_EMAIL) ? env.CONTACT_ADMIN_EMAIL! : FALLBACK_ADMIN_EMAIL;
  const text = `日程返信を自動確定できませんでした。\n\n理由: ${reason}\nお客様: ${draft.customerName}様 <${draft.customerEmail}>\n\n返信内容:\n${reply}\n\n候補日時:\n${draft.candidates.join("\n")}`;
  await sendEmail(env, { from: env.CONTACT_FROM_EMAIL, to: [admin], subject: `【要確認】${draft.customerName}様の日程返信`, text, html: `<p><strong>日程返信を自動確定できませんでした。</strong></p><p>理由: ${escapeHtml(reason)}</p><p>お客様: ${escapeHtml(draft.customerName)}様 &lt;${escapeHtml(draft.customerEmail)}&gt;</p><p><strong>返信内容</strong><br>${escapeHtml(reply).replace(/\n/g, "<br>")}</p><p><strong>候補日時</strong><br>${draft.candidates.map(escapeHtml).join("<br>")}</p>` }, `booking-review-${token}`);
}

export async function handleBookingReply(message: ForwardableEmailMessage, env: BookingEnv) {
  const recipient = message.to.toLowerCase();
  const legacyToken = recipient.match(new RegExp(`^schedule\\+([a-f0-9]{32})@${REPLY_DOMAIN.replace(/\./g, "\\.")}$`))?.[1];
  if (recipient !== SCHEDULE_REPLY_ADDRESS && !legacyToken) { message.setReject("Unknown scheduling address"); return; }
  if (!env.SESSION || !configured(env.RESEND_API_KEY) || !configured(env.CONTACT_FROM_EMAIL)) throw new Error("Booking reply environment is not configured");
  if (message.rawSize > 1_000_000) { message.setReject("Message is too large"); return; }

  const raw = new TextDecoder().decode(await new Response(message.raw).arrayBuffer());
  const mail = parseMail(raw);
  const scheduleId = legacyToken ?? `${mail.subject}\n${mail.text}`.match(/WSW-SCHEDULE-ID:\s*([a-f0-9]{12,32})/i)?.[1]?.toLowerCase();
  if (!scheduleId) { message.setReject("Scheduling request ID was not found"); return; }

  let token = scheduleId;
  if (scheduleId.length < 32) {
    const matches = await env.SESSION.list({ prefix: contactGuideKey(scheduleId), limit: 2 });
    if (matches.keys.length !== 1) { message.setReject("Scheduling request ID is invalid or ambiguous"); return; }
    token = matches.keys[0].name.slice(contactGuideKey("").length);
  }

  const key = contactGuideKey(token);
  const draft = await env.SESSION.get<ContactGuideDraft>(key, "json");
  if (!draft) { message.setReject("Scheduling request has expired"); return; }
  if (draft.status === "booked") return;
  const reply = visibleReply(mail.text);
  if (message.from.toLowerCase() !== draft.customerEmail.toLowerCase()) {
    await notifyReview(env, token, draft, "登録されたお客様と返信元アドレスが一致しません。", reply);
    return;
  }

  const slots = draft.candidateSlots?.length ? draft.candidateSlots : candidateSlots(draft.candidates, draft.createdAt);
  const selected = chooseSlot(reply, slots);
  if (!selected) {
    await env.SESSION.put(key, JSON.stringify({ ...draft, status: "needs-review" } satisfies ContactGuideDraft), { expirationTtl: CONTACT_GUIDE_TTL_SECONDS });
    await notifyReview(env, token, draft, "候補日時を1件に特定できませんでした。", reply);
    return;
  }

  const start = new Date(selected.start);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const accessToken = await getGoogleAccessToken(env);
  const existingEvent = await getMeetingEvent(env, accessToken, token);
  if (!existingEvent && !await isCalendarSlotFree(env, accessToken, start, end)) {
    await env.SESSION.put(key, JSON.stringify({ ...draft, status: "needs-review" } satisfies ContactGuideDraft), { expirationTtl: CONTACT_GUIDE_TTL_SECONDS });
    await notifyReview(env, token, draft, "選択された時間に別の予定が入りました。", reply);
    return;
  }

  const event = existingEvent ?? await createMeetingEvent(env, accessToken, { token, customerName: draft.customerName, customerEmail: draft.customerEmail, company: draft.company, start, end });
  const meetUrl = getMeetUrl(event);
  if (!meetUrl) throw new Error("Google Meet URL was not created");
  const dateLabel = new Intl.DateTimeFormat("ja-JP", { dateStyle: "full", timeStyle: "short", timeZone: "Asia/Tokyo" }).format(start);
  const confirmationText = `${draft.customerName}様\n\n日程のご返信ありがとうございます。\n${dateLabel}より承りました。\n\nGoogle Meet\n${meetUrl}\n\n当日は上記URLよりご参加ください。\nどうぞよろしくお願いいたします。\n\nWani san Web`;
  await sendEmail(env, { from: env.CONTACT_FROM_EMAIL, to: [draft.customerEmail], reply_to: configured(env.CONTACT_ADMIN_EMAIL) ? env.CONTACT_ADMIN_EMAIL : FALLBACK_ADMIN_EMAIL, subject: "【Wani san Web】初回お打ち合わせ日程確定のご案内", text: confirmationText, html: `<p>${escapeHtml(draft.customerName)}様</p><p>日程のご返信ありがとうございます。<br>${escapeHtml(dateLabel)}より承りました。</p><p><strong>Google Meet</strong><br><a href="${escapeHtml(meetUrl)}">${escapeHtml(meetUrl)}</a></p><p>当日は上記URLよりご参加ください。<br>どうぞよろしくお願いいたします。</p><p>Wani san Web</p>` }, `booking-confirm-${token}`);
  const bookedAt = new Date().toISOString();
  await env.SESSION.put(key, JSON.stringify({ ...draft, status: "booked", bookedAt, bookedStart: selected.start, calendarEventId: event.id, meetUrl } satisfies ContactGuideDraft), { expirationTtl: CONTACT_GUIDE_TTL_SECONDS });
  console.log(JSON.stringify({ event: "contact_booking_confirmed", token, eventId: event.id, bookedStart: selected.start }));
}
