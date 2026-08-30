import { CONTACT_GUIDE_TTL_SECONDS, contactGuideKey, type ContactGuideDraft } from "./contact-guide";
import { createMeetingEvent, getGoogleAccessToken, getMeetingEvent, getMeetUrl, isCalendarSlotFree, type CalendarEnv } from "./google-calendar";

export type BookingEnv = CalendarEnv & { SESSION?: KVNamespace; RESEND_API_KEY: string; CONTACT_FROM_EMAIL: string; CONTACT_ADMIN_EMAIL?: string; PUBLIC_SITE_URL?: string };
type ParsedMail = { subject: string; text: string; messageId: string };
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
  return { subject: headers.get("subject") ?? "", text, messageId: headers.get("message-id") ?? "" };
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
    const match = label.match(/(?:(\d{4})年)?(\d{1,2})[\/.月](\d{1,2})日?[^0-9]{0,12}(\d{1,2}):(\d{2})/);
    if (!match) return [];
    const [, explicitYear, month, day, hour, minute] = match;
    return [{ label, start: `${explicitYear ?? baseYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hour.padStart(2, "0")}:${minute}:00+09:00` }];
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

function meetingPreference(text: string) {
  const locationMatch = text.match(/(?:希望(?:の)?場所|場所|会場|待ち合わせ場所)\s*[:：]?\s*([^\n。]{2,100})/i);
  const inPerson = /対面|直接(?:お会い|会って)|訪問|来社/.test(text) || Boolean(locationMatch);
  return {
    mode: inPerson ? "in-person" as const : "online" as const,
    location: locationMatch?.[1]?.trim() ?? "",
  };
}

async function sendEmail(env: BookingEnv, payload: Record<string, unknown>, key: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": key },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Resend error: ${response.status} ${await response.text()}`);
}

async function notifyBookingApproval(env: BookingEnv, token: string, draft: ContactGuideDraft, notificationId: string, reason?: string) {
  const admin = configured(env.CONTACT_ADMIN_EMAIL) ? env.CONTACT_ADMIN_EMAIL! : FALLBACK_ADMIN_EMAIL;
  const siteUrl = configured(env.PUBLIC_SITE_URL) ? env.PUBLIC_SITE_URL! : "https://www.wani-san.com";
  const approvalUrl = new URL(`/admin/booking/${token}`, siteUrl).toString();
  const selected = draft.bookingSelectedLabel ?? "返信から候補日時を特定できませんでした。確認画面で選択してください。";
  const mode = draft.meetingMode === "in-person" ? `対面${draft.meetingLocation ? `（${draft.meetingLocation}）` : "（場所未確定）"}` : "オンライン（Google Meet）";
  const reasonText = reason ? `\n確認事項: ${reason}\n` : "";
  const text = `お客様から日程の回答が届きました。\n\nお客様: ${draft.customerName}様 <${draft.customerEmail}>\n候補日時: ${selected}\n実施方法: ${mode}${reasonText}\n回答内容:\n${draft.bookingReply ?? ""}\n\n以下の確認画面で内容を確認し、問題なければ確定してください。\n${approvalUrl}`;
  const html = `<p><strong>お客様から日程の回答が届きました。</strong></p><p>お客様: ${escapeHtml(draft.customerName)}様 &lt;${escapeHtml(draft.customerEmail)}&gt;<br>候補日時: ${escapeHtml(selected)}<br>実施方法: ${escapeHtml(mode)}</p>${reason ? `<p><strong>確認事項:</strong> ${escapeHtml(reason)}</p>` : ""}<p><strong>回答内容</strong><br>${escapeHtml(draft.bookingReply ?? "").replace(/\n/g, "<br>")}</p><p><a href="${escapeHtml(approvalUrl)}" style="display:inline-block;padding:12px 20px;border-radius:999px;background:#315b3a;color:#fff;text-decoration:none;font-weight:bold">日程を確認して確定する</a></p>`;
  const idempotencySuffix = notificationId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64) || draft.bookingReplyReceivedAt?.replace(/[^0-9]/g, "") || "received";
  await sendEmail(env, { from: env.CONTACT_FROM_EMAIL, to: [admin], reply_to: draft.customerEmail, subject: `【日程確認】${draft.customerName}様から回答が届きました`, text, html }, `booking-review-${token}-${idempotencySuffix}`);
}

export async function recordBookingResponse(env: BookingEnv, token: string, draft: ContactGuideDraft, input: { selectedStart: string; mode: "online" | "in-person"; location: string }) {
  if (!env.SESSION || !configured(env.RESEND_API_KEY) || !configured(env.CONTACT_FROM_EMAIL)) throw new Error("Booking response environment is not configured");
  if (draft.status === "booked") throw new Error("この日程はすでに確定しています。");
  const slots = draft.candidateSlots?.length ? draft.candidateSlots : candidateSlots(draft.candidates, draft.createdAt);
  const selected = slots.find((slot) => slot.start === input.selectedStart);
  if (!selected) throw new Error("選択された候補日時が正しくありません。");
  const location = input.location.trim();
  if (input.mode === "in-person" && !location) throw new Error("対面をご希望の場合は場所を入力してください。");

  const replyReceivedAt = new Date().toISOString();
  const bookingReply = input.mode === "in-person"
    ? `日程回答画面から回答\n${selected.label}\n対面希望\n希望場所: ${location}`
    : `日程回答画面から回答\n${selected.label}\nオンライン（Google Meet）`;
  const updated = {
    ...draft,
    status: "awaiting-approval" as const,
    bookingReply,
    bookingReplyReceivedAt: replyReceivedAt,
    bookingSelectedLabel: selected.label,
    bookingSelectedStart: selected.start,
    meetingMode: input.mode,
    meetingLocation: input.mode === "in-person" ? location : undefined,
  } satisfies ContactGuideDraft;
  await env.SESSION.put(contactGuideKey(token), JSON.stringify(updated), { expirationTtl: CONTACT_GUIDE_TTL_SECONDS });
  try {
    await notifyBookingApproval(env, token, updated, `web-${selected.start}-${input.mode}`);
  } catch (error) {
    await env.SESSION.put(contactGuideKey(token), JSON.stringify(draft), { expirationTtl: CONTACT_GUIDE_TTL_SECONDS });
    throw error;
  }
  console.log(JSON.stringify({ event: "contact_booking_web_response_received", token, selected: selected.start, mode: input.mode }));
  return updated;
}

export async function notifyBookingReplyFailure(message: ForwardableEmailMessage, env: BookingEnv, reason: string, reply = "") {
  if (!configured(env.RESEND_API_KEY) || !configured(env.CONTACT_FROM_EMAIL)) throw new Error("Booking reply notification environment is not configured");
  const admin = configured(env.CONTACT_ADMIN_EMAIL) ? env.CONTACT_ADMIN_EMAIL! : FALLBACK_ADMIN_EMAIL;
  const subject = message.headers.get("subject") ?? "件名なし";
  const notificationId = (message.headers.get("message-id") ?? `${message.from}-${message.to}`).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80) || "unmatched";
  const text = `日程返信を受信しましたが、自動で問い合わせ情報と紐付けできませんでした。\n\n返信元: ${message.from}\n返信先: ${message.to}\n件名: ${subject}\n確認事項: ${reason}\n\n返信内容:\n${reply || "本文を抽出できませんでした。元の返信メールをご確認ください。"}`;
  const html = `<p><strong>日程返信を受信しましたが、自動で問い合わせ情報と紐付けできませんでした。</strong></p><p>返信元: ${escapeHtml(message.from)}<br>返信先: ${escapeHtml(message.to)}<br>件名: ${escapeHtml(subject)}<br>確認事項: ${escapeHtml(reason)}</p><p><strong>返信内容</strong><br>${escapeHtml(reply || "本文を抽出できませんでした。元の返信メールをご確認ください。").replace(/\n/g, "<br>")}</p>`;
  await sendEmail(env, { from: env.CONTACT_FROM_EMAIL, to: [admin], reply_to: message.from, subject: "【要確認】お客様から日程返信が届きました", text, html }, `booking-unmatched-${notificationId}`);
  console.error(JSON.stringify({ event: "contact_booking_reply_unmatched", from: message.from, to: message.to, reason }));
}

export async function confirmBooking(env: BookingEnv, token: string, draft: ContactGuideDraft, input: { selectedStart: string; mode: "online" | "in-person"; location: string }) {
  if (!env.SESSION || !configured(env.RESEND_API_KEY) || !configured(env.CONTACT_FROM_EMAIL)) throw new Error("Booking environment is not configured");
  if (draft.status === "booked") return draft;

  const slots = draft.candidateSlots?.length ? draft.candidateSlots : candidateSlots(draft.candidates, draft.createdAt);
  const selected = slots.find((slot) => slot.start === input.selectedStart);
  if (!selected) throw new Error("選択された候補日時が正しくありません。");
  if (input.mode === "in-person" && !input.location.trim()) throw new Error("対面の場合は場所を入力してください。");

  const start = new Date(selected.start);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const accessToken = await getGoogleAccessToken(env);
  const existingEvent = await getMeetingEvent(env, accessToken, token);
  if (!existingEvent && !await isCalendarSlotFree(env, accessToken, start, end)) throw new Error("選択された時間に別の予定があります。候補日時を確認してください。");

  const event = existingEvent ?? await createMeetingEvent(env, accessToken, { token, customerName: draft.customerName, customerEmail: draft.customerEmail, company: draft.company, start, end, mode: input.mode, location: input.location.trim() });
  const meetUrl = input.mode === "online" ? getMeetUrl(event) : undefined;
  if (input.mode === "online" && !meetUrl) throw new Error("Google Meet URLを発行できませんでした。");

  const dateLabel = new Intl.DateTimeFormat("ja-JP", { dateStyle: "full", timeStyle: "short", timeZone: "Asia/Tokyo" }).format(start);
  const placeText = input.mode === "online" ? `Google Meet\n${meetUrl}` : `場所\n${input.location.trim()}`;
  const placeHtml = input.mode === "online" ? `<strong>Google Meet</strong><br><a href="${escapeHtml(meetUrl!)}">${escapeHtml(meetUrl!)}</a>` : `<strong>場所</strong><br>${escapeHtml(input.location.trim())}`;
  const confirmationText = `${draft.customerName}様\n\n日程のご返信ありがとうございます。\n以下の内容で初回のお打ち合わせを承りました。\n\n日時\n${dateLabel}\n\n${placeText}\n\n当日はどうぞよろしくお願いいたします。\n\nWani san Web`;
  await sendEmail(env, { from: env.CONTACT_FROM_EMAIL, to: [draft.customerEmail], reply_to: configured(env.CONTACT_ADMIN_EMAIL) ? env.CONTACT_ADMIN_EMAIL : FALLBACK_ADMIN_EMAIL, subject: "【Wani san Web】初回お打ち合わせ日程確定のご案内", text: confirmationText, html: `<p>${escapeHtml(draft.customerName)}様</p><p>日程のご返信ありがとうございます。<br>以下の内容で初回のお打ち合わせを承りました。</p><p><strong>日時</strong><br>${escapeHtml(dateLabel)}</p><p>${placeHtml}</p><p>当日はどうぞよろしくお願いいたします。</p><p>Wani san Web</p>` }, `booking-confirm-${token}`);

  const bookedAt = new Date().toISOString();
  const booked = { ...draft, status: "booked" as const, bookedAt, bookedStart: selected.start, bookingSelectedLabel: selected.label, bookingSelectedStart: selected.start, meetingMode: input.mode, meetingLocation: input.mode === "in-person" ? input.location.trim() : undefined, calendarEventId: event.id, meetUrl } satisfies ContactGuideDraft;
  await env.SESSION.put(contactGuideKey(token), JSON.stringify(booked), { expirationTtl: CONTACT_GUIDE_TTL_SECONDS });
  console.log(JSON.stringify({ event: "contact_booking_confirmed", token, eventId: event.id, bookedStart: selected.start, mode: input.mode }));
  return booked;
}

export async function handleBookingReply(message: ForwardableEmailMessage, env: BookingEnv) {
  const recipient = message.to.toLowerCase();
  const legacyToken = recipient.match(new RegExp(`^schedule\\+([a-f0-9]{32})@${REPLY_DOMAIN.replace(/\./g, "\\.")}$`))?.[1];
  if (recipient !== SCHEDULE_REPLY_ADDRESS && !legacyToken) { message.setReject("Unknown scheduling address"); return; }
  if (!env.SESSION || !configured(env.RESEND_API_KEY) || !configured(env.CONTACT_FROM_EMAIL)) throw new Error("Booking reply environment is not configured");
  if (message.rawSize > 1_000_000) { await notifyBookingReplyFailure(message, env, "メールサイズが大きいため本文を処理できませんでした。"); return; }

  const raw = new TextDecoder().decode(await new Response(message.raw).arrayBuffer());
  const mail = parseMail(raw);
  const reply = visibleReply(mail.text);
  const scheduleId = legacyToken ?? `${mail.subject}\n${mail.text}`.match(/WSW-SCHEDULE-ID:\s*([a-f0-9]{12,32})/i)?.[1]?.toLowerCase();
  if (!scheduleId) { await notifyBookingReplyFailure(message, env, "日程管理IDをメールから読み取れませんでした。", reply); return; }

  let token = scheduleId;
  if (scheduleId.length < 32) {
    const matches = await env.SESSION.list({ prefix: contactGuideKey(scheduleId), limit: 2 });
    if (matches.keys.length !== 1) { await notifyBookingReplyFailure(message, env, "日程管理IDに対応する問い合わせを特定できませんでした。", reply); return; }
    token = matches.keys[0].name.slice(contactGuideKey("").length);
  }

  const key = contactGuideKey(token);
  const draft = await env.SESSION.get<ContactGuideDraft>(key, "json");
  if (!draft) { await notifyBookingReplyFailure(message, env, "問い合わせ情報の有効期限が切れていました。", reply); return; }
  if (draft.status === "booked") return;
  const slots = draft.candidateSlots?.length ? draft.candidateSlots : candidateSlots(draft.candidates, draft.createdAt);
  const selected = chooseSlot(reply, slots);
  const preference = meetingPreference(reply);
  const replyReceivedAt = new Date().toISOString();
  const updated = {
    ...draft,
    status: selected ? "awaiting-approval" as const : "needs-review" as const,
    bookingReply: reply,
    bookingReplyReceivedAt: replyReceivedAt,
    bookingSelectedLabel: selected?.label,
    bookingSelectedStart: selected?.start,
    meetingMode: preference.mode,
    meetingLocation: preference.location || undefined,
  } satisfies ContactGuideDraft;
  await env.SESSION.put(key, JSON.stringify(updated), { expirationTtl: CONTACT_GUIDE_TTL_SECONDS });

  const reasons = [
    message.from.toLowerCase() !== draft.customerEmail.toLowerCase() ? "登録されたお客様と返信元アドレスが一致しません。" : "",
    !selected ? "候補日時を1件に特定できませんでした。" : "",
    preference.mode === "in-person" && !preference.location ? "対面希望ですが、場所を特定できませんでした。" : "",
  ].filter(Boolean);
  await notifyBookingApproval(env, token, updated, mail.messageId, reasons.join(" ") || undefined);
  console.log(JSON.stringify({ event: "contact_booking_reply_received", token, selected: selected?.start ?? null, mode: preference.mode, needsReview: reasons.length > 0 }));
}
