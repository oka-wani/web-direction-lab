import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

type RuntimeEnv = typeof env & {
  SESSION?: KVNamespace;
  PROPOSALS?: R2Bucket;
  OPENAI_API_KEY?: string;
};
type TurnstileResult = { success: boolean; action?: string };
type HearingSession = { name: string; email: string; company?: string; contactUrl?: string; service?: string };

const runtime = env as RuntimeEnv;
const ADMIN_EMAIL = "contact@wani-san.com";
const SITE_URL = "https://www.wani-san.com";
const json = (status: number, message: string) => Response.json({ message }, { status });
const get = (data: FormData, key: string) => typeof data.get(key) === "string" ? String(data.get(key)).trim() : "";
const getAll = (data: FormData, key: string) => data.getAll(key).map(String).map((v) => v.trim()).filter(Boolean);
const configured = (value?: string) => Boolean(value && !value.startsWith("SET_IN_"));
const esc = (input: string) => input.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[c]!);

const known = new Set([
  "token","company","productionType","budget","launch","industry","business","strength","area","primaryCustomer","customerNeeds","primaryGoal","otherGoal","mustHave","structureReference","impression","useColor","avoidColor","designReference","material","cms","function","analytics","domain","server","operation","note","consent","website","cf-turnstile-response",
]);

async function sendMail(payload: Record<string, unknown>) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Resend ${response.status}: ${await response.text()}`);
}

function outputText(result: any) {
  if (typeof result.output_text === "string" && result.output_text) return result.output_text;
  for (const item of result.output ?? []) for (const content of item.content ?? []) if (content.type === "output_text" && typeof content.text === "string") return content.text;
  return "";
}

function proposalHtml(proposal: any, hearing: any) {
  const strategy = (proposal.strategy ?? []).map((item: any) => `<article><h3>${esc(item.title ?? "")}</h3><p>${esc(item.body ?? "")}</p></article>`).join("");
  const sitemap = (proposal.sitemap ?? []).map((page: any) => `<li><b>${esc(page.label ?? page.slug ?? "")}</b><span>${esc(page.role ?? "")}</span></li>`).join("");
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>提案書｜${esc(hearing.company)}</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Yu Gothic",sans-serif;margin:0;background:#f3f5f2;color:#14201b;line-height:1.75}.wrap{max-width:1100px;margin:auto;padding:48px 24px}.hero,.box{background:#fff;border:1px solid #d8e0db;border-radius:16px;padding:34px;margin-bottom:22px}.hero small{color:#08704a;font-weight:800}.hero h1{font-size:38px;margin:8px 0}.summary{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.summary div{background:#f1f7f3;padding:16px;border-radius:10px}.summary span,.summary b{display:block}.summary span{font-size:12px;color:#68736e}.strategy{display:grid;grid-template-columns:1fr 1fr;gap:14px}.strategy article,.sitemap li{border:1px solid #d8e0db;padding:18px;border-radius:10px}.sitemap{list-style:none;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.sitemap span{display:block;font-size:12px;color:#68736e;margin-top:5px}@media(max-width:700px){.summary,.strategy,.sitemap{grid-template-columns:1fr}}</style></head><body><main class="wrap"><section class="hero"><small>WSW / PROPOSAL</small><h1>${esc(proposal.title ?? `${hearing.company} Webサイト提案`)}</h1><p>${esc(proposal.concept ?? "")}</p></section><section class="box"><h2>ヒアリングサマリー</h2><div class="summary"><div><span>業種</span><b>${esc(hearing.industry)}</b></div><div><span>対応エリア</span><b>${esc(hearing.area.join(" / "))}</b></div><div><span>主目的</span><b>${esc(hearing.primaryGoal)}</b></div><div><span>予算</span><b>${esc(hearing.budget)}</b></div><div><span>ターゲット</span><b>${esc(hearing.primaryCustomer)}</b></div><div><span>強み</span><b>${esc(hearing.strength.join(" / "))}</b></div><div><span>CTA</span><b>${esc(proposal.cta ?? "")}</b></div><div><span>公開希望</span><b>${esc(hearing.launch || "未定")}</b></div></div></section><section class="box"><h2>提案方針</h2><div class="strategy">${strategy}</div></section><section class="box"><h2>サイトマップ</h2><ul class="sitemap">${sitemap}</ul></section></main></body></html>`;
}

function roughIndexHtml(proposal: any, accessId: string) {
  const pages = (proposal.roughPages ?? []).map((page: any) => `<a href="/proposals/${encodeURIComponent(accessId)}/rough/${encodeURIComponent(page.slug)}/"><b>${esc(page.title ?? page.slug ?? "")}</b><span>${esc(page.role ?? "")}</span></a>`).join("");
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>サイト構成・ラフ</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Yu Gothic",sans-serif;background:#f3f5f2;color:#14201b;margin:0}.wrap{max-width:1100px;margin:auto;padding:48px 24px}.map{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.map a{background:#fff;border:1px solid #d8e0db;border-radius:12px;padding:22px;color:inherit;text-decoration:none}.map span{display:block;font-size:12px;color:#68736e;margin-top:8px}@media(max-width:700px){.map{grid-template-columns:1fr}}</style></head><body><main class="wrap"><small>ROUGH / SITE MAP</small><h1>サイト構成・ページラフ</h1><p>ページを選択するとPC/SPラフを確認できます。</p><div class="map">${pages}</div></main></body></html>`;
}

function roughPageHtml(page: any) {
  const sections = (page.sections ?? []).map((section: any, index: number) => `<section><i>${String(index + 1).padStart(2, "0")}</i><small>${esc(section.type ?? "SECTION")}</small><h2>${esc(section.title ?? "")}</h2><p>${esc(section.content ?? "")}</p><aside><b>目的</b>${esc(section.purpose ?? "")}<br><b>確認</b>${esc(section.confirm ?? "")}</aside></section>`).join("");
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${esc(page.title ?? "ページラフ")}</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Yu Gothic",sans-serif;margin:0;background:#eee;color:#222}.top{position:sticky;top:0;background:#202522;color:#fff;padding:14px 22px;display:flex;justify-content:space-between;z-index:2}.top button{padding:7px 14px}.frame{max-width:1000px;margin:28px auto;background:#fff}.frame.sp{max-width:390px}.sitehead{height:58px;border-bottom:1px solid #ddd;padding:0 20px;display:flex;align-items:center;justify-content:space-between;font-size:12px}.frame.sp .sitehead span:last-child{display:none}section{position:relative;padding:42px 34px;border-bottom:1px solid #ddd;min-height:150px}section>i{position:absolute;left:10px;top:10px;font-style:normal;font-size:10px;background:#222;color:#fff;padding:4px 6px}section h2{font-size:25px;margin:8px 0}aside{margin-top:22px;background:#f3f5f2;padding:14px;font-size:12px}.frame.sp section{padding:30px 20px}.frame.sp section h2{font-size:21px}</style></head><body><div class="top"><b>${esc(page.title ?? "")}</b><div><button onclick="document.getElementById('frame').className='frame'">PC</button><button onclick="document.getElementById('frame').className='frame sp'">SP</button></div></div><main id="frame" class="frame"><div class="sitehead"><b>SITE LOGO</b><span>NAVIGATION　[ CTA ]</span></div>${sections}</main></body></html>`;
}

async function generateProposal(hearingId: string, accessId: string, hearing: any, rows: [string,string][]) {
  try {
    if (!runtime.PROPOSALS) throw new Error("R2 binding PROPOSALS が設定されていません。");
    if (!configured(runtime.OPENAI_API_KEY)) throw new Error("OPENAI_API_KEY が設定されていません。");

    await runtime.PROPOSALS.put(`proposals/${accessId}/hearing.json`, JSON.stringify(hearing, null, 2), { httpMetadata: { contentType: "application/json; charset=utf-8" } });

    const prompt = `あなたはWeb制作会社WSWのWebディレクターです。以下のヒアリング回答から、クライアント確認用の提案書と全ページのワイヤーラフ設計をJSONで作成してください。JSON以外は返さないでください。形式:{"title":"","concept":"","cta":"","strategy":[{"title":"","body":""}],"sitemap":[{"slug":"top","label":"TOP","role":""}],"roughPages":[{"slug":"top","title":"TOP","role":"","sections":[{"type":"HERO","title":"","content":"掲載する内容","purpose":"このエリアの目的","confirm":"クライアントに確認したいこと"}]}]}。TOPは必須。sitemapとroughPagesは一致。各ページ3〜7セクション。ヒアリング:${JSON.stringify(hearing)}`;
    const ai = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { Authorization: `Bearer ${runtime.OPENAI_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: "gpt-5.6", input: prompt }) });
    if (!ai.ok) throw new Error(`OpenAI API ${ai.status}: ${await ai.text()}`);
    const result = await ai.json() as any;
    const raw = outputText(result).trim().replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    if (!raw) throw new Error("OpenAI APIから提案書データが返りませんでした。");
    const proposal = JSON.parse(raw);

    await runtime.PROPOSALS.put(`proposals/${accessId}/proposal.json`, JSON.stringify(proposal, null, 2), { httpMetadata: { contentType: "application/json; charset=utf-8" } });
    await runtime.PROPOSALS.put(`proposals/${accessId}/proposal.html`, proposalHtml(proposal, hearing), { httpMetadata: { contentType: "text/html; charset=utf-8" } });
    await runtime.PROPOSALS.put(`proposals/${accessId}/rough/index.html`, roughIndexHtml(proposal, accessId), { httpMetadata: { contentType: "text/html; charset=utf-8" } });
    for (const page of proposal.roughPages ?? []) {
      const slug = String(page.slug || "page").replace(/[^a-z0-9-]/gi, "-").toLowerCase();
      await runtime.PROPOSALS.put(`proposals/${accessId}/rough/${slug}.html`, roughPageHtml(page), { httpMetadata: { contentType: "text/html; charset=utf-8" } });
    }

    const proposalUrl = `${SITE_URL}/proposals/${accessId}/proposal/`;
    const roughUrl = `${SITE_URL}/proposals/${accessId}/rough/`;
    const answersHtml = rows.map(([label,value]) => `<p><strong>${esc(label)}</strong><br>${esc(value).replace(/\n/g,"<br>")}</p>`).join("");
    const answersText = rows.map(([label,value]) => `${label}: ${value}`).join("\n\n");
    await sendMail({ from: env.CONTACT_FROM_EMAIL, to: [ADMIN_EMAIL], subject: `【WSW 提案書生成完了】${hearing.company}`, text: `${answersText}\n\n提案書：${proposalUrl}\nサイト構成・ラフ：${roughUrl}`, html: `<h2>提案書・サイトラフを生成しました</h2>${answersHtml}<p><a href="${proposalUrl}">提案書を確認する</a></p><p><a href="${roughUrl}">サイト構成・全ページラフを確認する</a></p>` });
  } catch (error) {
    console.error(JSON.stringify({ event: "proposal_generation_error", hearingId, message: error instanceof Error ? error.message : String(error) }));
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data") && !contentType.includes("application/x-www-form-urlencoded")) return json(415, "送信形式が正しくありません。");
  let data: FormData;
  try { data = await request.formData(); } catch { return json(400, "入力内容を読み取れませんでした。"); }
  if ([...data.keys()].some((key) => !known.has(key))) return json(400, "想定外の入力項目が含まれています。");
  if (get(data, "website")) return json(200, "受付しました。");

  const token = get(data, "token");
  if (!token || !runtime.SESSION) return json(400, "ヒアリングURLを確認してください。お問い合わせメールに記載されたURLからアクセスしてください。");
  const sessionRaw = await runtime.SESSION.get(`hearing:${token}`);
  if (!sessionRaw) return json(400, "ヒアリングURLの有効期限が切れているか、URLが正しくありません。");
  const session = JSON.parse(sessionRaw) as HearingSession;

  const hearing = {
    company:get(data,"company"), productionType:get(data,"productionType"), budget:get(data,"budget"), launch:get(data,"launch"), industry:get(data,"industry"), business:get(data,"business"), strength:getAll(data,"strength"), area:getAll(data,"area"), primaryCustomer:get(data,"primaryCustomer"), customerNeeds:get(data,"customerNeeds"), primaryGoal:get(data,"primaryGoal"), otherGoal:getAll(data,"otherGoal"), mustHave:get(data,"mustHave"), structureReference:get(data,"structureReference"), impression:getAll(data,"impression"), useColor:get(data,"useColor"), avoidColor:get(data,"avoidColor"), designReference:get(data,"designReference"), material:getAll(data,"material"), cms:get(data,"cms"), function:getAll(data,"function"), analytics:getAll(data,"analytics"), domain:get(data,"domain"), server:get(data,"server"), operation:getAll(data,"operation"), note:get(data,"note"), contact:{name:session.name,email:session.email,initialCompany:session.company||"",initialUrl:session.contactUrl||"",service:session.service||""},
  };

  const missing:string[]=[];
  if(!hearing.company)missing.push("会社・店舗・組織名"); if(!hearing.productionType)missing.push("今回の制作内容"); if(!hearing.budget)missing.push("想定予算"); if(!hearing.industry)missing.push("業種"); if(!hearing.business)missing.push("事業・サービス内容"); if(hearing.strength.length===0)missing.push("特に伝えたい強み"); if(hearing.area.length===0)missing.push("対応エリア"); if(!hearing.primaryCustomer)missing.push("最も来てほしいお客様"); if(!hearing.primaryGoal)missing.push("サイトの一番の目的"); if(hearing.impression.length===0)missing.push("希望するサイトの印象"); if(!hearing.cms)missing.push("CMS"); if(!hearing.domain)missing.push("ドメインの状況"); if(get(data,"consent")!=="agreed")missing.push("個人情報の取り扱いへの同意");
  if(missing.length)return json(400,`必須項目を確認してください：${missing.join("、")}`);

  const turnstileToken=get(data,"cf-turnstile-response");
  if(!turnstileToken||!env.TURNSTILE_SECRET_KEY)return json(400,"Bot確認を完了してください。");
  const verification=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({secret:env.TURNSTILE_SECRET_KEY,response:turnstileToken,remoteip:request.headers.get("CF-Connecting-IP"),idempotency_key:crypto.randomUUID()})});
  const turnstile=await verification.json() as TurnstileResult;
  if(!verification.ok||!turnstile.success||turnstile.action!=="hearing")return json(400,"Bot確認に失敗しました。もう一度お試しください。");
  if(!configured(env.RESEND_API_KEY)||!configured(env.CONTACT_FROM_EMAIL))return json(503,"現在送信を受け付けられません。");

  const hearingId=`H-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
  const accessId=`${hearingId}-${crypto.randomUUID().slice(0,12)}`;
  const rows:[string,string][]=[
    ["受付ID",hearingId],["会社・店舗・組織名",hearing.company],["今回の制作内容",hearing.productionType],["想定予算",hearing.budget],["公開希望時期",hearing.launch||"未入力"],["業種",hearing.industry],["事業・サービス内容",hearing.business],["強み",hearing.strength.join(" / ")],["対応エリア",hearing.area.join(" / ")],["最も来てほしいお客様",hearing.primaryCustomer],["お客様の悩み・期待",hearing.customerNeeds||"未入力"],["主目的",hearing.primaryGoal],["その他の目的",hearing.otherGoal.join(" / ")||"未選択"],["必ず掲載したい情報",hearing.mustHave||"未入力"],["構成参考",hearing.structureReference||"未入力"],["サイトの印象",hearing.impression.join(" / ")],["使いたい色",hearing.useColor||"未入力"],["避けたい色",hearing.avoidColor||"未入力"],["デザイン参考",hearing.designReference||"未入力"],["素材",hearing.material.join(" / ")||"未選択"],["CMS",hearing.cms],["必要機能",hearing.function.join(" / ")||"未選択"],["解析・計測",hearing.analytics.join(" / ")||"未選択"],["ドメイン",hearing.domain],["サーバー・公開環境",hearing.server||"未選択"],["公開後の運用",hearing.operation.join(" / ")||"未選択"],["補足",hearing.note||"未入力"],
  ];

  try {
    await sendMail({ from:env.CONTACT_FROM_EMAIL, to:[session.email], reply_to:ADMIN_EMAIL, subject:"【Wani san Web】制作ヒアリングを受け付けました", text:`${session.name}様\n\n制作ヒアリングへのご回答ありがとうございます。\n受付ID：${hearingId}\n\n回答内容を受け付けました。`, html:`<p>${esc(session.name)}様</p><p>制作ヒアリングへのご回答ありがとうございます。</p><p>受付ID：<strong>${esc(hearingId)}</strong></p><p>回答内容を受け付けました。</p>` });
  } catch { return json(502,"サンクスメールを送信できませんでした。"); }

  await runtime.SESSION.delete(`hearing:${token}`);
  const task=generateProposal(hearingId,accessId,hearing,rows);
  const cfContext=(locals as any).cfContext;
  if(cfContext?.waitUntil)cfContext.waitUntil(task); else console.error(JSON.stringify({event:"proposal_background_context_missing",hearingId}));

  return Response.json({message:"受付しました。",hearingId},{status:200});
};

export const ALL: APIRoute = () => json(405,"POSTメソッドのみ利用できます。");
