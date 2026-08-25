import { WorkflowEntrypoint, WorkflowStep } from "cloudflare:workers";
import type { WorkflowEvent } from "cloudflare:workers";
import { generateProposalPdf } from "./proposal-pdf";

type Row = [string, string];
type ProposalParams = {
  hearingId: string;
  accessId: string;
  hearing: Record<string, any>;
  rows: Row[];
};
export type WorkflowEnv = {
  PROPOSALS: R2Bucket;
  OPENAI_API_KEY: string;
  CONTACT_FROM_EMAIL: string;
  RESEND_API_KEY: string;
};

export const SITE_URL = "https://www.wani-san.com";
export const ADMIN_EMAIL = "contact@wani-san.com";
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[c]!);
const safeSlug = (s: unknown) => String(s || "page").toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "page";

function outputText(result: any) {
  if (typeof result.output_text === "string" && result.output_text) return result.output_text;
  for (const item of result.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === "output_text" && typeof content.text === "string") return content.text;
    }
  }
  return "";
}

export async function sendMail(env: WorkflowEnv, payload: Record<string, unknown>, idempotencyKey: string = crypto.randomUUID()) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Resend ${response.status}: ${await response.text()}`);
}

const BASE_CSS = `*{box-sizing:border-box}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Yu Gothic",sans-serif;color:#14201b;background:#f2f3ef;line-height:1.75}.topbar{position:sticky;top:0;background:#222720;color:#fff;z-index:10}.topbar>div{max-width:1180px;margin:auto;padding:13px 22px;display:flex;justify-content:space-between;gap:20px}.topbar a{color:#fff;text-decoration:none}.doc{max-width:1180px;margin:auto;padding:28px 22px 72px}.sheet{background:#fff;border:1px solid #d7ddd8;padding:32px;margin-bottom:18px}.eyebrow{font-size:11px;letter-spacing:.16em;color:#08704a;font-weight:800}.sheet h1{font-size:40px;line-height:1.3;margin:8px 0 12px}.sheet h2{font-size:25px;margin:0 0 20px;padding-bottom:11px;border-bottom:1px solid #d9ded9}.summary{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#dce2dd;border:1px solid #dce2dd}.summary div{background:#fff;padding:15px;min-height:92px}.summary span{display:block;font-size:10px;color:#69766f;margin-bottom:5px}.summary b{font-size:14px}.grid2{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.card{border:1px solid #d7ded9;background:#fbfcfa;padding:18px}.card h3{margin:0 0 8px;font-size:17px}.card p{margin:0}.flow{display:flex;overflow:auto}.flow>div{flex:1;min-width:180px;border:1px solid #d7ded9;padding:17px;background:#fff;position:relative}.flow>div:not(:last-child):after{content:'→';position:absolute;right:-10px;top:50%;background:#f2f3ef;padding:2px;z-index:2}.tree{padding:22px;border:1px solid #d7ded9;background:#f8faf8;overflow:auto}.tree-root{text-align:center;margin-bottom:24px}.tree-root a{display:inline-block;background:#222720;color:#fff;text-decoration:none;padding:11px 34px;font-weight:800}.tree-children{display:flex;justify-content:center;align-items:flex-start;gap:12px;position:relative;min-width:720px}.tree-children:before{content:'';position:absolute;left:8%;right:8%;top:-12px;border-top:1px solid #97a29b}.tree-node{width:180px;position:relative}.tree-node:before{content:'';position:absolute;left:50%;top:-12px;height:12px;border-left:1px solid #97a29b}.tree-node a{display:block;background:#fff;border:1px solid #aeb8b2;padding:12px;text-align:center;text-decoration:none}.tree-node b,.tree-node span{display:block}.tree-node span{font-size:10px;color:#68746e;margin-top:4px}.page-links{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.page-links a{display:block;background:#fff;border:1px solid #ccd5cf;padding:16px;text-decoration:none}.page-links span{display:block;font-size:11px;color:#68746e;margin-top:5px}.design-list{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.design-list div{border-left:4px solid #08704a;background:#f5f8f5;padding:15px}.muted{color:#65716c}@media(max-width:760px){.summary,.grid2,.grid3,.page-links,.design-list{grid-template-columns:1fr}.sheet{padding:22px}.sheet h1{font-size:30px}.doc{padding:16px 12px 50px}}`;

function renderTree(proposal: any, accessId: string) {
  const children = (proposal.sitemap ?? []).filter((p: any) => safeSlug(p.slug) !== "top");
  return `<div class="tree"><div class="tree-root"><a href="${SITE_URL}/proposals/${encodeURIComponent(accessId)}/rough/top/">TOP</a></div><div class="tree-children">${children.map((p:any)=>`<div class="tree-node"><a href="${SITE_URL}/proposals/${encodeURIComponent(accessId)}/rough/${encodeURIComponent(safeSlug(p.slug))}/"><b>${esc(p.label || p.slug)}</b><span>${esc(p.role || "")}</span></a></div>`).join("")}</div></div>`;
}

function proposalHtml(proposal: any, hearing: any, accessId: string) {
  const target = proposal.targetAnalysis ?? {};
  const issues = (proposal.issues ?? []).map((x:any)=>`<article class="card"><h3>${esc(x.title)}</h3><p>${esc(x.body)}</p></article>`).join("");
  const priorities = (proposal.priorities ?? []).map((x:any)=>`<article class="card"><h3>${esc(x.title)}</h3><p>${esc(x.reason)}</p></article>`).join("");
  const flow = (proposal.userFlow ?? []).map((x:any,i:number)=>`<div><span class="eyebrow">STEP ${i+1}</span><h3>${esc(x.title)}</h3><p class="muted">${esc(x.body)}</p></div>`).join("");
  const pages = (proposal.roughPages ?? []).map((p:any)=>`<a href="${SITE_URL}/proposals/${encodeURIComponent(accessId)}/rough/${encodeURIComponent(safeSlug(p.slug))}/"><b>${esc(p.title || p.slug)}</b><span>${esc(p.role || "")}</span></a>`).join("");
  const design = proposal.designDirection ?? {};
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${esc(hearing.company)}｜サイト構成・提案書</title><style>${BASE_CSS}</style></head><body><header class="topbar"><div><b>WSW / SITE PROPOSAL</b><a href="${SITE_URL}/proposals/${encodeURIComponent(accessId)}/rough/">サイトラフを見る →</a></div></header><main class="doc">
<section class="sheet"><span class="eyebrow">01 / HEARING SUMMARY</span><h1>${esc(proposal.title || `${hearing.company} Webサイト制作提案`)}</h1><p>${esc(proposal.concept || "")}</p><div class="summary"><div><span>業種</span><b>${esc(hearing.industry)}</b></div><div><span>エリア</span><b>${esc((hearing.area ?? []).join(" / "))}</b></div><div><span>公開希望</span><b>${esc(hearing.launch || "未定")}</b></div><div><span>制作内容</span><b>${esc(hearing.productionType)}</b></div><div><span>主な目的</span><b>${esc(hearing.primaryGoal)}</b></div><div><span>ターゲット</span><b>${esc(hearing.primaryCustomer)}</b></div><div><span>メインCTA</span><b>${esc(proposal.cta || "")}</b></div><div><span>更新・運用</span><b>${esc((hearing.operation ?? []).join(" / ") || "未定")}</b></div></div></section>
<section class="sheet"><span class="eyebrow">02 / TARGET & STRATEGY</span><h2>ターゲットとサイト方針</h2><div class="grid3"><article class="card"><h3>ターゲットの特徴</h3><p>${esc(target.profile || hearing.primaryCustomer)}</p></article><article class="card"><h3>悩み・期待</h3><p>${esc(target.needs || hearing.customerNeeds || "")}</p></article><article class="card"><h3>サイト上で重視すること</h3><p>${esc(target.behavior || "")}</p></article></div><h3>解決すべき課題</h3><div class="grid2">${issues}</div><h3>優先して伝える内容</h3><div class="grid3">${priorities}</div></section>
<section class="sheet"><span class="eyebrow">03 / USER FLOW</span><h2>想定する閲覧・行動フロー</h2><div class="flow">${flow}</div></section>
<section class="sheet"><span class="eyebrow">04 / SITE MAP</span><h2>サイトマップ</h2><p class="muted">各ページをクリックすると、そのページのラフへ移動します。</p>${renderTree(proposal, accessId)}</section>
<section class="sheet"><span class="eyebrow">05 / PAGE ROUGH</span><h2>全ページの構成ラフ</h2><p class="muted">各ページでPC / SPを切り替えられます。</p><div class="page-links">${pages}</div></section>
<section class="sheet"><span class="eyebrow">06 / DESIGN DIRECTION</span><h2>デザイン方向性</h2><div class="design-list"><div><span class="eyebrow">TONE</span><b>${esc(design.tone || "")}</b></div><div><span class="eyebrow">COLOR</span><b>${esc(design.colors || "")}</b></div><div><span class="eyebrow">VISUAL</span><b>${esc(design.visual || "")}</b></div><div><span class="eyebrow">REFERENCE</span><b>${esc(design.referenceReflection || "")}</b></div></div><p class="muted">${esc(design.note || "")}</p></section>
</main></body></html>`;
}

function roughPageHtml(page: any, accessId: string) {
  const sections = (page.sections ?? []).map((s:any,i:number)=>`<section class="wire-section"><div class="wire-main"><span class="section-no">${String(i+1).padStart(2,"0")}</span><span class="type">${esc(s.type || "SECTION")}</span><h2>${esc(s.heading || s.title || "")}</h2>${s.body?`<p>${esc(s.body)}</p>`:""}${Array.isArray(s.items)&&s.items.length?`<ul>${s.items.map((x:any)=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}${s.ctaLabel?`<button>${esc(s.ctaLabel)}</button>`:""}</div><aside class="memo"><div><b>掲載する内容</b><p>${esc(s.content || "")}</p></div><div><b>このエリアの目的</b><p>${esc(s.purpose || "")}</p></div><div><b>確認いただきたいこと</b><p>${esc(s.confirm || "")}</p></div></aside></section>`).join("");
  const css = `*{box-sizing:border-box}body{margin:0;background:#e9eae7;color:#18201d;font-family:-apple-system,BlinkMacSystemFont,"Yu Gothic",sans-serif}.bar{position:sticky;top:0;z-index:20;background:#222720;color:#fff;padding:11px 18px;display:flex;justify-content:space-between;align-items:center}.bar a{color:#fff;text-decoration:none}.bar button{background:#fff;border:0;padding:8px 13px;margin-left:5px;cursor:pointer}.stage{max-width:1180px;margin:24px auto;padding:0 14px}.frame{background:#fff;border:1px solid #cfd2ce;margin:auto}.frame.sp{max-width:390px}.fake-head{height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 24px;border-bottom:1px solid #ddd;font-size:12px}.frame.sp .fake-head span{display:none}.wire-section{display:grid;grid-template-columns:minmax(0,2fr) minmax(260px,1fr);border-bottom:1px solid #ddd}.wire-main{position:relative;padding:34px;min-height:190px}.wire-main h2{font-size:27px;margin:9px 0}.wire-main p{max-width:620px}.wire-main button{padding:10px 18px;background:#222;border:0;color:#fff}.section-no{position:absolute;left:9px;top:9px;font-size:10px;background:#222;color:#fff;padding:4px 6px}.type{font-size:10px;letter-spacing:.14em;color:#68746e}.memo{background:#f4f5f2;border-left:1px solid #ddd;padding:16px}.memo div+div{border-top:1px solid #d9ddd8;padding-top:12px;margin-top:12px}.memo b{font-size:11px}.memo p{font-size:11px;margin:5px 0 0;line-height:1.6}.frame.sp .wire-section{grid-template-columns:1fr}.frame.sp .memo{border-left:0;border-top:1px dashed #bbb}.frame.sp .wire-main{padding:30px 20px}.frame.sp .wire-main h2{font-size:22px}@media(max-width:760px){.wire-section{grid-template-columns:1fr}.memo{border-left:0;border-top:1px dashed #bbb}}`;
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${esc(page.title || "ページラフ")}</title><style>${css}</style></head><body><div class="bar"><a href="${SITE_URL}/proposals/${encodeURIComponent(accessId)}/rough/">← サイトマップ</a><b>${esc(page.title || page.slug)}</b><div><button onclick="document.getElementById('frame').className='frame'">PC</button><button onclick="document.getElementById('frame').className='frame sp'">SP</button></div></div><main class="stage"><div id="frame" class="frame"><div class="fake-head"><b>SITE LOGO</b><span>NAVIGATION / CTA</span></div>${sections}</div></main></body></html>`;
}

function roughIndexHtml(proposal: any, accessId: string) {
  const links = (proposal.roughPages ?? []).map((p:any)=>`<a href="${SITE_URL}/proposals/${encodeURIComponent(accessId)}/rough/${encodeURIComponent(safeSlug(p.slug))}/"><b>${esc(p.title || p.slug)}</b><span>${esc(p.role || "")}</span></a>`).join("");
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>サイト構成・ラフ</title><style>${BASE_CSS}</style></head><body><header class="topbar"><div><b>WSW / PAGE ROUGH</b><a href="${SITE_URL}/proposals/${encodeURIComponent(accessId)}/proposal/">提案書を見る →</a></div></header><main class="doc"><section class="sheet"><span class="eyebrow">SITE MAP / ROUGH</span><h1>サイト構成・全ページラフ</h1>${renderTree(proposal, accessId)}</section><section class="sheet"><h2>ページ一覧</h2><div class="page-links">${links}</div></section></main></body></html>`;
}

export class ProposalWorkflow extends WorkflowEntrypoint<WorkflowEnv, ProposalParams> {
  async run(event: WorkflowEvent<ProposalParams>, step: WorkflowStep) {
    const { hearingId, accessId, hearing, rows } = event.payload;

    await step.do("save hearing", async () => {
      await this.env.PROPOSALS.put(`proposals/${accessId}/hearing.json`, JSON.stringify(hearing, null, 2), { httpMetadata: { contentType: "application/json; charset=utf-8" } });
      return { ok: true };
    });

    const proposal = await step.do("generate proposal with OpenAI", { retries: { limit: 2, delay: "10 seconds", backoff: "linear" } }, async () => {
      const prompt = `あなたはWeb制作会社WSWのシニアWebディレクターです。以下のヒアリング回答から、クライアント確認用の提案書と全ページワイヤー設計を作成してください。必ずJSONのみを返してください。\n\n必要なJSON形式:\n{\n  "title":"",\n  "concept":"",\n  "cta":"",\n  "targetAnalysis":{"profile":"","needs":"","behavior":""},\n  "issues":[{"title":"","body":""}],\n  "priorities":[{"title":"","reason":""}],\n  "userFlow":[{"title":"認知","body":""},{"title":"理解","body":""},{"title":"比較・納得","body":""},{"title":"行動","body":""}],\n  "sitemap":[{"slug":"top","label":"TOP","role":""}],\n  "roughPages":[{"slug":"top","title":"TOP","role":"ページの役割","purpose":"ページの目的","contentFlow":"導入 → 理解 → 比較 → 行動","sections":[{"type":"HERO または 3-COLUMN または LIST または FAQ または FORM","title":"","heading":"","body":"","items":[],"ctaLabel":"","content":"掲載する内容","purpose":"このエリアの目的","confirm":"確認いただきたいこと"}]}],\n  "designDirection":{"tone":"","colors":"","palette":["#0D473A","#177B63","#EAF4EF","#D84A1B","#F5F6F3"],"informationRank":3,"motionRank":2,"visual":"","referenceReflection":"","note":""}\n}\n\n条件:\n- TOPを必ず含める。\n- sitemapとroughPagesは完全一致。\n- ページ数は予算・目的・必要情報から現実的に決める。\n- 各ページにrole（役割）、purpose（目的）、contentFlow（閲覧順に矢印でつないだ流れ）を入れる。\n- 各ページ3〜8セクション。TOPは主要4エリアを優先し、詳細は下に続く前提でよい。\n- ラフは単なる箱ではなく、HERO、3-COLUMN、LIST、FAQ、FORMなど具体的な表示形式をtypeで指定し、見出し、本文、リスト、CTAまで具体化する。\n- 各セクションに掲載内容・目的・確認事項を必ず入れる。\n- ヒアリングにない事実は断定せず、確認事項として扱う。\n- デザイン方向性は2軸のみ。informationRankは1=情報量・説明重視、5=視覚・印象重視。motionRankは1=シンプル・静的、5=アクティブ・動的。各1〜5の整数にする。\n- paletteは希望色・避けたい色・コントラストを考慮した#RRGGBBを5色。\n\nヒアリングJSON:${JSON.stringify(hearing)}`;
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { Authorization: `Bearer ${this.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-5.6", input: prompt }),
      });
      if (!response.ok) throw new Error(`OpenAI API ${response.status}: ${await response.text()}`);
      const result = await response.json<any>();
      const raw = outputText(result).trim().replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      if (!raw) throw new Error("OpenAI APIから提案書データが返りませんでした。");
      return JSON.parse(raw);
    });

    await step.do("save proposal files", async () => {
      const pdf = await generateProposalPdf(proposal, hearing);
      await this.env.PROPOSALS.put(`proposals/${accessId}/proposal.json`, JSON.stringify(proposal, null, 2), { httpMetadata: { contentType: "application/json; charset=utf-8" } });
      await this.env.PROPOSALS.put(`proposals/${accessId}/proposal.html`, proposalHtml(proposal, hearing, accessId), { httpMetadata: { contentType: "text/html; charset=utf-8" } });
      await this.env.PROPOSALS.put(`proposals/${accessId}/proposal.pdf`, pdf, { httpMetadata: { contentType: "application/pdf", contentDisposition: `inline; filename="WSW-${hearingId}.pdf"` } });
      await this.env.PROPOSALS.put(`proposals/${accessId}/rough/index.html`, roughIndexHtml(proposal, accessId), { httpMetadata: { contentType: "text/html; charset=utf-8" } });
      for (const page of proposal.roughPages ?? []) {
        const slug = safeSlug(page.slug);
        await this.env.PROPOSALS.put(`proposals/${accessId}/rough/${slug}.html`, roughPageHtml(page, accessId), { httpMetadata: { contentType: "text/html; charset=utf-8" } });
      }
      return { ok: true, pages: (proposal.roughPages ?? []).length };
    });

    await step.do("send admin completion mail", { retries: { limit: 3, delay: "5 seconds", backoff: "linear" } }, async () => {
      const proposalUrl = `${SITE_URL}/proposals/${accessId}/proposal.pdf`;
      const webProposalUrl = `${SITE_URL}/proposals/${accessId}/proposal/`;
      const roughUrl = `${SITE_URL}/proposals/${accessId}/rough/`;
      const answersText = rows.map(([label, value]) => `${label}: ${value}`).join("\n\n");
      const answersHtml = rows.map(([label, value]) => `<p><strong>${esc(label)}</strong><br>${esc(value).replace(/\n/g, "<br>")}</p>`).join("");
      await sendMail(this.env, {
        from: this.env.CONTACT_FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `【WSW 提案書生成完了】${hearing.company}`,
        text: `${answersText}\n\n提案書PDF：${proposalUrl}\nWeb版提案書：${webProposalUrl}\nサイト構成・ラフ：${roughUrl}`,
        html: `<h2>提案書PDF・サイトラフを生成しました</h2>${answersHtml}<p><a href="${proposalUrl}">提案書PDFを確認する</a></p><p><a href="${webProposalUrl}">Web版提案書を確認する</a></p><p><a href="${roughUrl}">サイト構成・全ページラフを確認する</a></p>`,
      }, `proposal-completed-${hearingId}`);
      return { ok: true };
    });

    return { hearingId, accessId, status: "completed" };
  }
}
