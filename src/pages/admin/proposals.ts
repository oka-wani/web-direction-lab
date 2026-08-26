import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { googleSlidesConfigured, type ProposalSlidesRecord } from "../../google-slides";
import { authenticated, readJson, unauthorized } from "../../proposal-admin";

export const prerender = false;

type RuntimeEnv = typeof env & {
  PROPOSALS?: R2Bucket;
  ADMIN_STATUS_PASSWORD?: string;
  GOOGLE_SERVICE_ACCOUNT_EMAIL?: string;
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?: string;
  GOOGLE_IMPERSONATED_USER?: string;
  GOOGLE_DRIVE_FOLDER_ID?: string;
  GOOGLE_SLIDES_TEMPLATE_ID?: string;
};

const runtime = env as RuntimeEnv;
const esc = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[c]!);

type Job = {
  accessId: string;
  hearingId: string;
  company: string;
  status: string;
  stage: string;
  message: string;
  error: string;
  updatedAt: string;
  proposalReady: boolean;
  pdfReady: boolean;
  roughReady: boolean;
  finalPdfReady: boolean;
  slides: ProposalSlidesRecord | null;
  recipient: string;
};

async function loadJobs(bucket: R2Bucket): Promise<Job[]> {
  const listed = await bucket.list({ prefix: "proposals/", limit: 1000 });
  const groups = new Map<string, { keys: Set<string>; latest: Date }>();

  for (const object of listed.objects) {
    const parts = object.key.split("/");
    const accessId = parts[1];
    if (!accessId) continue;
    const current = groups.get(accessId) ?? { keys: new Set<string>(), latest: object.uploaded };
    current.keys.add(parts.slice(2).join("/"));
    if (object.uploaded > current.latest) current.latest = object.uploaded;
    groups.set(accessId, current);
  }

  const recent = [...groups.entries()]
    .sort((a, b) => b[1].latest.getTime() - a[1].latest.getTime())
    .slice(0, 50);

  return Promise.all(recent.map(async ([accessId, group]) => {
    let statusData: any = null;
    const statusObject = await bucket.get(`proposals/${accessId}/status.json`);
    if (statusObject) {
      try { statusData = await statusObject.json(); } catch { statusData = null; }
    }

    const hearingData = await readJson<any>(bucket, `proposals/${accessId}/hearing.json`);
    const slides = await readJson<ProposalSlidesRecord>(bucket, `proposals/${accessId}/slides.json`);

    const hasHearing = group.keys.has("hearing.json");
    const hasProposalJson = group.keys.has("proposal.json");
    const proposalReady = group.keys.has("proposal.html");
    const pdfReady = group.keys.has("proposal.pdf");
    const roughReady = group.keys.has("rough/index.html");
    const finalPdfReady = group.keys.has("proposal-final.pdf");
    const status = statusData?.status ?? "unknown";

    let stage = "受付済み";
    if (status === "error") stage = "エラー";
    else if (slides?.status === "sent") stage = "顧客送付済み";
    else if (slides?.status === "pdf_ready") stage = "最終PDF確認待ち";
    else if (slides?.status === "editing") stage = "スライド編集中";
    else if (status === "completed") stage = "生成完了";
    else if (roughReady || proposalReady) stage = "管理メール送信中";
    else if (hasProposalJson) stage = "R2保存中";
    else if (hasHearing) stage = "AI生成中";

    return {
      accessId,
      hearingId: statusData?.hearingId ?? accessId.split("-").slice(0, 4).join("-"),
      company: statusData?.company ?? hearingData?.company ?? "",
      status,
      stage,
      message: statusData?.message ?? "",
      error: statusData?.error ?? "",
      updatedAt: statusData?.updatedAt ?? group.latest.toISOString(),
      proposalReady,
      pdfReady,
      roughReady,
      finalPdfReady,
      slides,
      recipient: hearingData?.contact?.email ?? "",
    } satisfies Job;
  }));
}

export const GET: APIRoute = async ({ request }) => {
  if (!runtime.ADMIN_STATUS_PASSWORD) {
    return new Response("ADMIN_STATUS_PASSWORD is not configured.", { status: 503 });
  }
  if (!authenticated(request, runtime)) return unauthorized();
  if (!runtime.PROPOSALS) return new Response("R2 binding PROPOSALS is not configured.", { status: 503 });

  const jobs = await loadJobs(runtime.PROPOSALS);
  const rows = jobs.map((job) => {
    const badgeClass = job.stage === "エラー" ? "bad" : job.stage === "顧客送付済み" ? "done" : "run";
    const proposalUrl = `/proposals/${encodeURIComponent(job.accessId)}/proposal/`;
    const pdfUrl = `/proposals/${encodeURIComponent(job.accessId)}/proposal.pdf`;
    const roughUrl = `/proposals/${encodeURIComponent(job.accessId)}/rough/`;
    const finalPdfUrl = `/proposals/${encodeURIComponent(job.accessId)}/proposal-final.pdf`;
    const action = job.slides?.editUrl
      ? `<div class="actions"><a class="button secondary" href="${esc(job.slides.editUrl)}" target="_blank" rel="noreferrer">スライドを編集</a><button type="button" data-action="pdf" data-id="${esc(job.accessId)}">PDFを更新</button><button type="button" class="send" data-action="send" data-id="${esc(job.accessId)}" data-recipient="${esc(job.recipient)}">顧客へ送付</button></div>`
      : `<button type="button" data-action="slides" data-id="${esc(job.accessId)}" ${googleSlidesConfigured(runtime) ? "" : "disabled"}>スライドを生成</button>`;
    return `<tr>
      <td><b>${esc(job.company || "名称未取得")}</b><small>${esc(job.hearingId)}</small></td>
      <td><span class="badge ${badgeClass}">${esc(job.stage)}</span><small>${esc(job.updatedAt)}</small></td>
      <td>${job.finalPdfReady ? `<a href="${finalPdfUrl}" target="_blank">最終PDF</a> / ` : ""}${job.pdfReady ? `<a href="${pdfUrl}" target="_blank">自動生成PDF</a>` : "—"}${job.proposalReady ? ` / <a href="${proposalUrl}" target="_blank">Web版</a>` : ""}</td>
      <td>${job.roughReady ? `<a href="${roughUrl}" target="_blank">ラフ</a>` : "—"}</td>
      <td>${action}<small>${job.slides?.sentAt ? `送付済み：${esc(job.slides.sentAt)}` : job.recipient ? `送付先：${esc(job.recipient)}` : "送付先未取得"}</small></td>
      <td>${job.error ? `<details><summary>エラーを見る</summary><pre>${esc(job.error)}</pre></details>` : esc(job.message || "—")}</td>
    </tr>`;
  }).join("");

  const googleNotice = googleSlidesConfigured(runtime)
    ? `<div class="notice ok">Googleスライド連携：設定済み</div>`
    : `<div class="notice warn"><b>Googleスライド連携は未設定です。</b><span>認証情報・保存先フォルダ・テンプレートIDをCloudflareへ設定すると、編集用スライドを生成できます。</span></div>`;
  const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>提案書生成ステータス｜WSW</title><style>
  *{box-sizing:border-box}body{margin:0;background:#f3f6f4;color:#16201b;font-family:-apple-system,BlinkMacSystemFont,"Yu Gothic",sans-serif}.wrap{max-width:1320px;margin:auto;padding:32px 20px 70px}header{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:16px}h1{margin:5px 0 0;font-size:30px}header p{margin:0;color:#66736d;font-size:12px}.eyebrow{font-size:10px;letter-spacing:.18em;color:#08704a;font-weight:900}.notice{display:flex;gap:12px;align-items:center;padding:12px 15px;border-radius:10px;margin-bottom:16px;font-size:12px}.notice span{color:#536159}.notice.ok{background:#e2f3e9;color:#086642}.notice.warn{background:#fff2d8;color:#775500}.card{background:#fff;border:1px solid #d8e0db;border-radius:14px;overflow:auto}table{width:100%;border-collapse:collapse;min-width:1160px}th,td{text-align:left;padding:15px;border-bottom:1px solid #e1e7e3;vertical-align:top;font-size:13px}th{font-size:11px;background:#f8faf8;color:#52615a}td small{display:block;margin-top:5px;color:#748079;font-size:10px}.badge{display:inline-block;padding:5px 9px;border-radius:999px;font-size:11px;font-weight:900}.badge.run{background:#fff4d8;color:#775500}.badge.done{background:#e2f3e9;color:#086642}.badge.bad{background:#fde9e7;color:#9b332b}a{color:#08704a;font-weight:800}.actions{display:flex;flex-wrap:wrap;gap:6px}button,.button{appearance:none;border:0;border-radius:7px;background:#08704a;color:#fff;padding:8px 10px;font:inherit;font-size:11px;font-weight:800;cursor:pointer;text-decoration:none}.button.secondary{background:#e7f1eb;color:#075b3a}.send{background:#c74218}button:disabled{background:#c7ceca;color:#707a75;cursor:not-allowed}details summary{cursor:pointer;color:#9b332b;font-weight:800}pre{white-space:pre-wrap;max-width:430px;background:#f8f8f8;padding:10px;border-radius:8px;font-size:11px}.empty{padding:30px;color:#68756f}.note{margin-top:12px;color:#68756f;font-size:11px}.toast{position:fixed;right:18px;bottom:18px;max-width:420px;background:#16201b;color:#fff;padding:13px 16px;border-radius:9px;box-shadow:0 10px 30px #0002;font-size:13px}.toast.bad{background:#9b332b}@media(max-width:700px){header{align-items:flex-start;flex-direction:column}h1{font-size:25px}.wrap{padding:22px 12px}.notice{align-items:flex-start;flex-direction:column}}
  </style></head><body><main class="wrap"><header><div><span class="eyebrow">WSW / PROPOSAL WORKFLOW</span><h1>提案書生成・確定管理</h1></div><p><button type="button" class="button secondary" onclick="location.reload()">最新状態に更新</button></p></header>${googleNotice}<div class="card">${jobs.length ? `<table><thead><tr><th>案件</th><th>現在地</th><th>提案書</th><th>ラフ</th><th>編集・確定</th><th>詳細</th></tr></thead><tbody>${rows}</tbody></table>` : `<div class="empty">まだ生成履歴がありません。</div>`}</div><p class="note">ヒアリング受付 → 構成案生成 → Googleスライド編集 → 最終PDF確認 → 顧客送付の順で進みます。</p></main><script>
  const show=(message,bad=false)=>{const old=document.querySelector('.toast');if(old)old.remove();const el=document.createElement('div');el.className='toast'+(bad?' bad':'');el.textContent=message;document.body.appendChild(el);setTimeout(()=>el.remove(),6000)};
  document.addEventListener('click',async(event)=>{const button=event.target.closest('button[data-action]');if(!button)return;const action=button.dataset.action;const id=button.dataset.id;if(action==='send'){const recipient=button.dataset.recipient||'送付先未取得';if(!confirm('Googleスライドの最新版をPDF化し、'+recipient+'へ送付します。よろしいですか？'))return}else if(action==='slides'&&!confirm('編集用Googleスライドを生成します。よろしいですか？'))return;button.disabled=true;const original=button.textContent;button.textContent='処理中…';try{const response=await fetch('/api/admin/proposals/'+encodeURIComponent(id)+'/'+action,{method:'POST',headers:{'content-type':'application/json'},body:'{}'});const data=await response.json();if(!response.ok)throw new Error(data.message||'処理に失敗しました。');show(data.message||'完了しました。');if(data.editUrl)window.open(data.editUrl,'_blank','noopener');setTimeout(()=>location.reload(),900)}catch(error){show(error.message||String(error),true);button.disabled=false;button.textContent=original}});
  </script></body></html>`;

  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
};

export const ALL: APIRoute = () => new Response("Method Not Allowed", { status: 405 });
