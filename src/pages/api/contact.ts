import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

type TurnstileResult = { success: boolean; action?: string; "error-codes"?: string[] };
const services = new Set(["何を依頼すべきか相談したい", "Webサイトを制作・改善したい", "Webサイトの運用を依頼したい", "SEO・アクセス解析を相談したい", "LLMO・AI検索対策を相談したい", "Instagram運用を相談したい", "Web広告を相談したい", "AI・業務改善を相談したい", "自動化ツールを制作したい", "その他"]);
const budgets = new Set(["", "1万円未満", "1〜5万円", "5〜10万円", "10〜30万円", "30万円以上", "まだ決めていない"]);
const json = (status: number, message: string) => Response.json({ message }, { status });
const get = (data: FormData, key: string) => typeof data.get(key) === "string" ? String(data.get(key)).trim() : "";
const escapeHtml = (input: string) => input.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]!);
const configured = (input: string | undefined) => Boolean(input && !input.startsWith("SET_IN_"));

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

  if (!configured(env.RESEND_API_KEY) || !configured(env.CONTACT_ADMIN_EMAIL) || !configured(env.CONTACT_FROM_EMAIL)) {
    console.error(JSON.stringify({ event: "contact_config_missing" }));
    return json(503, "現在送信を受け付けられません。時間を置いてもう一度お試しください。");
  }
  const rows = [["氏名", input.name], ["メールアドレス", input.email], ["会社名・屋号", input.company || "未入力"], ["対象サイトURL", input.url || "未入力"], ["問い合わせ種別", input.service], ["予算感", input.budget || "未選択"], ["希望時期", input.schedule || "未入力"], ["相談内容", input.message]];
  const text = rows.map(([label, content]) => `${label}: ${content}`).join("\n\n");
  const html = rows.map(([label, content]) => `<p><strong>${escapeHtml(label)}</strong><br>${escapeHtml(content).replace(/\n/g, "<br>")}</p>`).join("");
  const sentAt = new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "medium", timeZone: "Asia/Tokyo" }).format(new Date());
  const response = await fetch("https://api.resend.com/emails/batch", { method: "POST", headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify([
    { from: env.CONTACT_FROM_EMAIL, to: [env.CONTACT_ADMIN_EMAIL], reply_to: input.email, subject: `【Wani san Web】${input.name}様からのお問い合わせ`, text: `${text}\n\n送信日時: ${sentAt}`, html: `${html}<p><strong>送信日時</strong><br>${escapeHtml(sentAt)}</p>` },
    { from: env.CONTACT_FROM_EMAIL, to: [input.email], reply_to: env.CONTACT_ADMIN_EMAIL, subject: "【Wani san Web】お問い合わせを受け付けました", text: `${input.name}様\n\nお問い合わせありがとうございます。以下の内容で受け付けました。内容を確認後、2〜3営業日以内を目安にご連絡します。\n\n${text}`, html: `<p>${escapeHtml(input.name)}様</p><p>お問い合わせありがとうございます。以下の内容で受け付けました。内容を確認後、2〜3営業日以内を目安にご連絡します。</p>${html}` },
  ]) });
  if (!response.ok) { console.error(JSON.stringify({ event: "resend_error", status: response.status, body: await response.text() })); return json(502, "メール送信に失敗しました。時間を置いてもう一度お試しください。"); }
  console.log(JSON.stringify({ event: "contact_sent", service: input.service, sentAt }));
  return json(200, "受付しました。");
};

export const ALL: APIRoute = () => json(405, "POSTメソッドのみ利用できます。");
