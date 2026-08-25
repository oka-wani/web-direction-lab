import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { CONTACT_GUIDE_TTL_SECONDS, contactGuideKey, type ContactGuideDraft } from "../../contact-guide";

export const prerender = false;

type RuntimeEnv = typeof env & { SESSION?: KVNamespace };

const ADMIN_EMAIL = "contact@wani-san.com";
const json = (status: number, message: string) => Response.json({ message }, { status });
const get = (data: FormData, key: string) => typeof data.get(key) === "string" ? String(data.get(key)).trim() : "";
const escapeHtml = (input: string) => input.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]!);
const configured = (input: string | undefined) => Boolean(input && !input.startsWith("SET_IN_"));

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/x-www-form-urlencoded") && !contentType.includes("multipart/form-data")) return json(415, "送信形式が正しくありません。");

  const origin = request.headers.get("origin");
  if (!origin || new URL(origin).host !== new URL(request.url).host) return json(403, "送信元を確認できませんでした。");

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return json(400, "入力内容を読み取れませんでした。");
  }

  const known = new Set(["token", "candidate"]);
  if ([...data.keys()].some((key) => !known.has(key))) return json(400, "想定外の入力項目が含まれています。");

  const token = get(data, "token");
  if (!/^[a-f0-9]{32}$/.test(token)) return json(400, "確認URLが正しくありません。");

  const candidates = data.getAll("candidate").map(String).map((value) => value.trim()).filter(Boolean);
  if (candidates.length < 1 || candidates.length > 5 || candidates.some((candidate) => candidate.length > 100)) {
    return json(400, "候補日程を1〜5件、各100文字以内で入力してください。");
  }

  const session = (env as RuntimeEnv).SESSION;
  if (!session || !configured(env.RESEND_API_KEY) || !configured(env.CONTACT_FROM_EMAIL)) return json(503, "現在この操作を利用できません。");

  const key = contactGuideKey(token);
  const draft = await session.get<ContactGuideDraft>(key, "json");
  if (!draft) return json(404, "確認URLの有効期限が切れているか、URLが正しくありません。");

  const redirectUrl = new URL(`/admin/contact/${token}`, request.url);
  if (draft.status === "sent") {
    redirectUrl.searchParams.set("sent", "1");
    return Response.redirect(redirectUrl, 303);
  }

  const candidateText = candidates.join("\n");
  const candidateHtml = candidates.map((candidate) => `<li>${escapeHtml(candidate)}</li>`).join("");
  const text = `${draft.customerName}様\n\n先日はお問い合わせいただき、ありがとうございます。\nWebサイト制作について、以下のヒアリングフォームへ分かる範囲でご回答ください。\n\n${draft.hearingUrl}\n\n初回打ち合わせの候補日時は以下のとおりです。\n${candidateText}\n\nご都合のよい候補を、このメールへの返信でお知らせください。\n\nWani san Web`;
  const html = `<p>${escapeHtml(draft.customerName)}様</p><p>先日はお問い合わせいただき、ありがとうございます。<br>Webサイト制作について、以下のヒアリングフォームへ分かる範囲でご回答ください。</p><p><a href="${escapeHtml(draft.hearingUrl)}">ヒアリングフォームを開く</a></p><p><strong>初回打ち合わせの候補日時</strong></p><ul>${candidateHtml}</ul><p>ご都合のよい候補を、このメールへの返信でお知らせください。</p><p>Wani san Web</p>`;

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
      reply_to: ADMIN_EMAIL,
      subject: "【Wani san Web】制作ヒアリングと打ち合わせ候補日のご案内",
      text,
      html,
    }),
  });

  if (!response.ok) {
    console.error(JSON.stringify({ event: "contact_guide_resend_error", status: response.status, body: await response.text() }));
    return json(502, "案内メールを送信できませんでした。時間を置いてもう一度お試しください。");
  }

  const sentAt = new Date().toISOString();
  await session.put(key, JSON.stringify({ ...draft, candidates, status: "sent", sentAt } satisfies ContactGuideDraft), { expirationTtl: CONTACT_GUIDE_TTL_SECONDS });
  console.log(JSON.stringify({ event: "contact_guide_sent", service: draft.service, sentAt }));

  redirectUrl.searchParams.set("sent", "1");
  return Response.redirect(redirectUrl, 303);
};

export const ALL: APIRoute = () => json(405, "POSTメソッドのみ利用できます。");
