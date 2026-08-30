import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { CONTACT_GUIDE_TTL_SECONDS, contactGuideKey, type ContactGuideDraft } from "../../contact-guide";
import { candidateSlots } from "../../booking-reply";

export const prerender = false;

type RuntimeEnv = typeof env & { SESSION?: KVNamespace };

const json = (status: number, message: string) => Response.json({ message }, { status });
const escapeHtml = (input: string) => input.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]!);
const configured = (input: string | undefined) => Boolean(input && !input.startsWith("SET_IN_"));
const candidateFormatter = new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "numeric", day: "numeric", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "Asia/Tokyo" });

function candidatesFromStarts(values: unknown[]) {
  return values.map((value, index) => {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) throw new Error("候補日時をカレンダーから選択してください。");
    const start = new Date(`${value}:00+09:00`);
    if (Number.isNaN(start.getTime()) || start.getTime() <= Date.now()) throw new Error("候補日時には現在より後の日時を選択してください。");
    const [, time = ""] = value.split("T");
    const [hour, minute] = time.split(":").map(Number);
    if (hour < 9 || hour > 18 || (hour === 18 && minute > 0) || ![0, 30].includes(minute)) throw new Error("候補日時は9:00〜19:00の範囲で、30分単位で選択してください。");
    return `第${index + 1}候補：${candidateFormatter.format(start)}〜`;
  });
}

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return json(415, "送信形式が正しくありません。");

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
  const known = new Set(["token", "candidates", "candidateStarts"]);
  if (Object.keys(submission).some((key) => !known.has(key))) return json(400, "想定外の入力項目が含まれています。");

  const token = typeof submission.token === "string" ? submission.token.trim() : "";
  if (!/^[a-f0-9]{32}$/.test(token)) return json(400, "確認URLが正しくありません。");

  let candidates: string[];
  try {
    candidates = Array.isArray(submission.candidateStarts) && submission.candidateStarts.length
      ? candidatesFromStarts(submission.candidateStarts)
      : Array.isArray(submission.candidates)
        ? submission.candidates.filter((value): value is string => typeof value === "string").map((value) => value.trim()).filter(Boolean)
        : [];
  } catch (error) {
    return json(400, error instanceof Error ? error.message : "候補日時を確認してください。");
  }
  if (candidates.length < 1 || candidates.length > 5 || candidates.some((candidate) => candidate.length > 100)) {
    return json(400, "候補日程を1〜5件、各100文字以内で入力してください。");
  }

  const session = (env as RuntimeEnv).SESSION;
  if (!session || !configured(env.RESEND_API_KEY) || !configured(env.CONTACT_FROM_EMAIL)) return json(503, "現在この操作を利用できません。");

  const key = contactGuideKey(token);
  const draft = await session.get<ContactGuideDraft>(key, "json");
  if (!draft) return json(404, "確認URLの有効期限が切れているか、URLが正しくありません。");

  const redirectUrl = new URL(`/admin/contact/${token}`, request.url);
  if (draft.status !== "pending") {
    redirectUrl.searchParams.set("sent", "1");
    return Response.redirect(redirectUrl, 303);
  }

  const candidateText = candidates.join("\n");
  const candidateHtml = candidates.map((candidate) => `<li>${escapeHtml(candidate)}</li>`).join("");
  const scheduleId = token.slice(0, 12);
  const scheduleUrl = new URL(`/schedule/${token}`, request.url).toString();
  const text = `${draft.customerName}様\n\nこの度は、Wani san Webへお問い合わせいただき、誠にありがとうございます。\n\nお問い合わせ内容を拝見し、今後の進め方やご希望を具体的に伺うため、一度初回のお打ち合わせをさせていただければと考えております。\n\n候補日時をご用意しました。以下のページから、ご都合のよい日時を選択してください。\n${scheduleUrl}\n\n${candidateText}\n\nお打ち合わせはGoogle Meetを利用する予定です。会議URLは日程確定後にお送りします。対面をご希望の場合は、回答画面で希望場所をご入力いただけます。\n\nまた、初回のお打ち合わせでWebサイトの方向性をある程度整理したいと考えております。お手数ですが、お打ち合わせの2日前までを目安に、以下のヒアリングシートへ分かる範囲でご記入をお願いいたします。\n\n${draft.hearingUrl}\n\nどうぞよろしくお願いいたします。\n\nWani san Web\n\nWSW-SCHEDULE-ID: ${scheduleId}`;
  const html = `<p>${escapeHtml(draft.customerName)}様</p><p>この度は、Wani san Webへお問い合わせいただき、誠にありがとうございます。</p><p>お問い合わせ内容を拝見し、今後の進め方やご希望を具体的に伺うため、一度初回のお打ち合わせをさせていただければと考えております。</p><p>候補日時をご用意しました。以下のページから、ご都合のよい日時を選択してください。</p><p><a href="${escapeHtml(scheduleUrl)}" style="display:inline-block;padding:13px 22px;border-radius:999px;background:#315b3a;color:#fff;text-decoration:none;font-weight:bold">候補日時を選択する</a></p><ul>${candidateHtml}</ul><p>お打ち合わせはGoogle Meetを利用する予定です。会議URLは日程確定後にお送りします。<br>対面をご希望の場合は、回答画面で希望場所をご入力いただけます。</p><p>また、初回のお打ち合わせでWebサイトの方向性をある程度整理したいと考えております。お手数ですが、<strong>お打ち合わせの2日前まで</strong>を目安に、以下のヒアリングシートへ分かる範囲でご記入をお願いいたします。</p><p><a href="${escapeHtml(draft.hearingUrl)}">ヒアリングシートを開く</a></p><p>どうぞよろしくお願いいたします。</p><p>Wani san Web</p><p style="color:#666;font-size:12px">WSW-SCHEDULE-ID: ${scheduleId}</p>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `contact-guide-${token}`,
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: [draft.customerEmail],
      reply_to: configured(env.CONTACT_ADMIN_EMAIL) ? env.CONTACT_ADMIN_EMAIL : "contact@wani-san.com",
      subject: `【Wani san Web】制作ヒアリングと打ち合わせ候補日のご案内 [WSW-SCHEDULE-ID: ${scheduleId}]`,
      text,
      html,
    }),
  });

  if (!response.ok) {
    console.error(JSON.stringify({ event: "contact_guide_resend_error", status: response.status, body: await response.text() }));
    return json(502, "案内メールを送信できませんでした。時間を置いてもう一度お試しください。");
  }

  const sentAt = new Date().toISOString();
  await session.put(key, JSON.stringify({ ...draft, candidates, candidateSlots: candidateSlots(candidates, draft.createdAt), status: "sent", sentAt } satisfies ContactGuideDraft), { expirationTtl: CONTACT_GUIDE_TTL_SECONDS });
  console.log(JSON.stringify({ event: "contact_guide_sent", service: draft.service, sentAt }));

  redirectUrl.searchParams.set("sent", "1");
  return Response.redirect(redirectUrl, 303);
};

export const ALL: APIRoute = () => json(405, "POSTメソッドのみ利用できます。");
