import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

type TurnstileResult = { success: boolean; action?: string };
type HearingSession = { name: string; email: string; company?: string; contactUrl?: string; service?: string };
type ProposalWorkflowBinding = {
  create(options: { id?: string; params: Record<string, unknown> }): Promise<{ id: string }>;
};
type RuntimeEnv = typeof env & {
  SESSION?: KVNamespace;
  PROPOSALS?: R2Bucket;
  PROPOSAL_WORKFLOW?: ProposalWorkflowBinding;
};

const runtime = env as RuntimeEnv;
const ADMIN_EMAIL = "contact@wani-san.com";
const json = (status: number, message: string) => Response.json({ message }, { status });
const get = (data: FormData, key: string) => typeof data.get(key) === "string" ? String(data.get(key)).trim() : "";
const getAll = (data: FormData, key: string) => data.getAll(key).map(String).map((value) => value.trim()).filter(Boolean);
const configured = (value?: string) => Boolean(value && !value.startsWith("SET_IN_"));
const esc = (input: string) => input.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;",
})[character]!);

const known = new Set([
  "token","company","productionType","budget","launch","industry","business","strength","area","primaryCustomer","customerNeeds","primaryGoal","otherGoal","mustHave","structureReference","impression","useColor","avoidColor","designReference","material","cms","function","analytics","domain","server","operation","note","consent","website","cf-turnstile-response",
]);

async function sendMail(payload: Record<string, unknown>) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": crypto.randomUUID(),
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Resend ${response.status}: ${await response.text()}`);
}

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data") && !contentType.includes("application/x-www-form-urlencoded")) return json(415, "送信形式が正しくありません。");

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return json(400, "入力内容を読み取れませんでした。");
  }

  if ([...data.keys()].some((key) => !known.has(key))) return json(400, "想定外の入力項目が含まれています。");
  if (get(data, "website")) return json(200, "受付しました。");

  const token = get(data, "token");
  if (!token || !runtime.SESSION) return json(400, "ヒアリングURLを確認してください。お問い合わせメールに記載されたURLからアクセスしてください。");

  const sessionRaw = await runtime.SESSION.get(`hearing:${token}`);
  if (!sessionRaw) return json(400, "ヒアリングURLの有効期限が切れているか、URLが正しくありません。");
  const session = JSON.parse(sessionRaw) as HearingSession;

  const hearing = {
    company: get(data, "company"),
    productionType: get(data, "productionType"),
    budget: get(data, "budget"),
    launch: get(data, "launch"),
    industry: get(data, "industry"),
    business: get(data, "business"),
    strength: getAll(data, "strength"),
    area: getAll(data, "area"),
    primaryCustomer: get(data, "primaryCustomer"),
    customerNeeds: get(data, "customerNeeds"),
    primaryGoal: get(data, "primaryGoal"),
    otherGoal: getAll(data, "otherGoal"),
    mustHave: get(data, "mustHave"),
    structureReference: get(data, "structureReference"),
    impression: getAll(data, "impression"),
    useColor: get(data, "useColor"),
    avoidColor: get(data, "avoidColor"),
    designReference: get(data, "designReference"),
    material: getAll(data, "material"),
    cms: get(data, "cms"),
    function: getAll(data, "function"),
    analytics: getAll(data, "analytics"),
    domain: get(data, "domain"),
    server: get(data, "server"),
    operation: getAll(data, "operation"),
    note: get(data, "note"),
    contact: {
      name: session.name,
      email: session.email,
      initialCompany: session.company || "",
      initialUrl: session.contactUrl || "",
      service: session.service || "",
    },
  };

  const missing: string[] = [];
  if (!hearing.company) missing.push("会社・店舗・組織名");
  if (!hearing.productionType) missing.push("今回の制作内容");
  if (!hearing.budget) missing.push("想定予算");
  if (!hearing.industry) missing.push("業種");
  if (!hearing.business) missing.push("事業・サービス内容");
  if (hearing.strength.length === 0) missing.push("特に伝えたい強み");
  if (hearing.area.length === 0) missing.push("対応エリア");
  if (!hearing.primaryCustomer) missing.push("最も来てほしいお客様");
  if (!hearing.primaryGoal) missing.push("サイトの一番の目的");
  if (hearing.impression.length === 0) missing.push("希望するサイトの印象");
  if (!hearing.cms) missing.push("CMS");
  if (!hearing.domain) missing.push("ドメインの状況");
  if (get(data, "consent") !== "agreed") missing.push("個人情報の取り扱いへの同意");
  if (missing.length) return json(400, `必須項目を確認してください：${missing.join("、")}`);

  const turnstileToken = get(data, "cf-turnstile-response");
  if (!turnstileToken || !env.TURNSTILE_SECRET_KEY) return json(400, "Bot確認を完了してください。");

  const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      secret: env.TURNSTILE_SECRET_KEY,
      response: turnstileToken,
      remoteip: request.headers.get("CF-Connecting-IP"),
      idempotency_key: crypto.randomUUID(),
    }),
  });
  const turnstile = await verification.json() as TurnstileResult;
  if (!verification.ok || !turnstile.success || turnstile.action !== "hearing") return json(400, "Bot確認に失敗しました。もう一度お試しください。");

  if (!configured(env.RESEND_API_KEY) || !configured(env.CONTACT_FROM_EMAIL)) return json(503, "現在送信を受け付けられません。");

  const hearingId = `H-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const accessId = `${hearingId}-${crypto.randomUUID().slice(0, 12)}`;

  const rows: [string, string][] = [
    ["受付ID", hearingId],
    ["会社・店舗・組織名", hearing.company],
    ["今回の制作内容", hearing.productionType],
    ["想定予算", hearing.budget],
    ["公開希望時期", hearing.launch || "未入力"],
    ["業種", hearing.industry],
    ["事業・サービス内容", hearing.business],
    ["強み", hearing.strength.join(" / ")],
    ["対応エリア", hearing.area.join(" / ")],
    ["最も来てほしいお客様", hearing.primaryCustomer],
    ["お客様の悩み・期待", hearing.customerNeeds || "未入力"],
    ["主目的", hearing.primaryGoal],
    ["その他の目的", hearing.otherGoal.join(" / ") || "未選択"],
    ["必ず掲載したい情報", hearing.mustHave || "未入力"],
    ["構成参考", hearing.structureReference || "未入力"],
    ["サイトの印象", hearing.impression.join(" / ")],
    ["使いたい色", hearing.useColor || "未入力"],
    ["避けたい色", hearing.avoidColor || "未入力"],
    ["デザイン参考", hearing.designReference || "未入力"],
    ["素材", hearing.material.join(" / ") || "未選択"],
    ["CMS", hearing.cms],
    ["必要機能", hearing.function.join(" / ") || "未選択"],
    ["解析・計測", hearing.analytics.join(" / ") || "未選択"],
    ["ドメイン", hearing.domain],
    ["サーバー・公開環境", hearing.server || "未選択"],
    ["公開後の運用", hearing.operation.join(" / ") || "未選択"],
    ["補足", hearing.note || "未入力"],
  ];

  try {
    await sendMail({
      from: env.CONTACT_FROM_EMAIL,
      to: [session.email],
      reply_to: ADMIN_EMAIL,
      subject: "【Wani san Web】制作ヒアリングを受け付けました",
      text: `${session.name}様\n\n制作ヒアリングへのご回答ありがとうございます。\n受付ID：${hearingId}\n\n回答内容を受け付けました。`,
      html: `<p>${esc(session.name)}様</p><p>制作ヒアリングへのご回答ありがとうございます。</p><p>受付ID：<strong>${esc(hearingId)}</strong></p><p>回答内容を受け付けました。</p>`,
    });
  } catch {
    return json(502, "サンクスメールを送信できませんでした。");
  }

  if (runtime.PROPOSALS) {
    await runtime.PROPOSALS.put(
      `proposals/${accessId}/status.json`,
      JSON.stringify({
        hearingId,
        accessId,
        company: hearing.company,
        status: "accepted",
        message: "受付済み。Workflowの起動待ちです。",
        updatedAt: new Date().toISOString(),
      }, null, 2),
      { httpMetadata: { contentType: "application/json; charset=utf-8" } },
    ).catch((error) => console.error(JSON.stringify({ event: "proposal_status_init_error", hearingId, message: error instanceof Error ? error.message : String(error) })));
  }

  if (!runtime.PROPOSAL_WORKFLOW) {
    console.error(JSON.stringify({ event: "proposal_workflow_binding_missing", hearingId }));
  } else {
    try {
      const instance = await runtime.PROPOSAL_WORKFLOW.create({
        id: hearingId,
        params: { hearingId, accessId, hearing, rows },
      });
      console.log(JSON.stringify({ event: "proposal_workflow_started", hearingId, instanceId: instance.id }));
    } catch (error) {
      console.error(JSON.stringify({ event: "proposal_workflow_start_error", hearingId, message: error instanceof Error ? error.message : String(error) }));
      if (runtime.PROPOSALS) {
        await runtime.PROPOSALS.put(
          `proposals/${accessId}/status.json`,
          JSON.stringify({
            hearingId,
            accessId,
            company: hearing.company,
            status: "error",
            message: "Workflowを起動できませんでした。",
            error: error instanceof Error ? error.message : String(error),
            updatedAt: new Date().toISOString(),
          }, null, 2),
          { httpMetadata: { contentType: "application/json; charset=utf-8" } },
        ).catch(() => undefined);
      }
      await sendMail({
        from: env.CONTACT_FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `【WSW】提案書生成ジョブの起動に失敗しました / ${hearing.company}`,
        text: `受付ID：${hearingId}\nWorkflowを起動できませんでした。Cloudflare Workflowsの状態を確認してください。`,
      }).catch(() => undefined);
    }
  }

  await runtime.SESSION.delete(`hearing:${token}`);
  return Response.json({ message: "受付しました。", hearingId }, { status: 200 });
};

export const ALL: APIRoute = () => json(405, "POSTメソッドのみ利用できます。");
