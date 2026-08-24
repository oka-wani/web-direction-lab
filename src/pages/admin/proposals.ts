import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

type RuntimeEnv = typeof env & {
  PROPOSALS?: R2Bucket;
  ADMIN_STATUS_PASSWORD?: string;
};

const runtime = env as RuntimeEnv;
const esc = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[c]!);

function unauthorized() {
  return new Response("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="WSW Proposal Status"' },
  });
}

function authenticated(request: Request) {
  const password = runtime.ADMIN_STATUS_PASSWORD;
  if (!password) return false;
  const header = request.headers.get("authorization") ?? "";
  if (!header.startsWith("Basic ")) return false;
  try {
    const decoded = atob(header.slice(6));
    const separator = decoded.indexOf(":");
    if (separator < 0) return false;
    const username = decoded.slice(0, separator);
    const supplied = decoded.slice(separator + 1);
    return username === "admin" && supplied === password;
  } catch {
    return false;
  }
}

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
  roughReady: boolean;
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

    let hearingData: any = null;
    const hearingObject = await bucket.get(`proposals/${accessId}/hearing.json`);
    if (hearingObject) {
      try { hearingData = await hearingObject.json(); } catch { hearingData = null; }
    }

    const hasHearing = group.keys.has("hearing.json");
    const hasProposalJson = group.keys.has("proposal.json");
    const proposalReady = group.keys.has("proposal.html");
    const roughReady = group.keys.has("rough/index.html");
    const status = statusData?.status ?? "unknown";

    let stage = "受付済み";
    if (status === "error") stage = "エラー";
    else if (status === "completed") stage = "管理メール送信済み";
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
      roughReady,
    } satisfies Job;
  }));
}

export const GET: APIRoute = async ({ request }) => {
  if (!runtime.ADMIN_STATUS_PASSWORD) {
    return new Response("ADMIN_STATUS_PASSWORD is not configured.", { status: 503 });
  }
  if (!authenticated(request)) return unauthorized();
  if (!runtime.PROPOSALS) return new Response("R2 binding PROPOSALS is not configured.", { status: 503 });

  const jobs = await loadJobs(runtime.PROPOSALS);
  const rows = jobs.map((job) => {
    const badgeClass = job.stage === "エラー" ? "bad" : job.stage === "管理メール送信済み" ? "done" : "run";
    const proposalUrl = `/proposals/${encodeURIComponent(job.accessId)}/proposal/`;
    const roughUrl = `/proposals/${encodeURIComponent(job.accessId)}/rough/`;
    return `<tr>
      <td><b>${esc(job.company || "名称未取得")}</b><small>${esc(job.hearingId)}</small></td>
      <td><span class="badge ${badgeClass}">${esc(job.stage)}</span><small>${esc(job.updatedAt)}</small></td>
      <td>${job.proposalReady ? `<a href="${proposalUrl}" target="_blank">提案書</a>` : "—"}</td>
      <td>${job.roughReady ? `<a href="${roughUrl}" target="_blank">ラフ</a>` : "—"}</td>
      <td>${job.error ? `<details><summary>エラーを見る</summary><pre>${esc(job.error)}</pre></details>` : esc(job.message || "—")}</td>
    </tr>`;
  }).join("");

  const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta http-equiv="refresh" content="10"><title>提案書生成ステータス｜WSW</title><style>
  *{box-sizing:border-box}body{margin:0;background:#f3f6f4;color:#16201b;font-family:-apple-system,BlinkMacSystemFont,"Yu Gothic",sans-serif}.wrap{max-width:1200px;margin:auto;padding:32px 20px 70px}header{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:22px}h1{margin:5px 0 0;font-size:30px}header p{margin:0;color:#66736d;font-size:12px}.eyebrow{font-size:10px;letter-spacing:.18em;color:#08704a;font-weight:900}.card{background:#fff;border:1px solid #d8e0db;border-radius:14px;overflow:auto}table{width:100%;border-collapse:collapse;min-width:900px}th,td{text-align:left;padding:15px;border-bottom:1px solid #e1e7e3;vertical-align:top;font-size:13px}th{font-size:11px;background:#f8faf8;color:#52615a}td small{display:block;margin-top:5px;color:#748079;font-size:10px}.badge{display:inline-block;padding:5px 9px;border-radius:999px;font-size:11px;font-weight:900}.badge.run{background:#fff4d8;color:#775500}.badge.done{background:#e2f3e9;color:#086642}.badge.bad{background:#fde9e7;color:#9b332b}a{color:#08704a;font-weight:800}details summary{cursor:pointer;color:#9b332b;font-weight:800}pre{white-space:pre-wrap;max-width:430px;background:#f8f8f8;padding:10px;border-radius:8px;font-size:11px}.empty{padding:30px;color:#68756f}.note{margin-top:12px;color:#68756f;font-size:11px}@media(max-width:700px){header{align-items:flex-start;flex-direction:column}h1{font-size:25px}.wrap{padding:22px 12px}}
  </style></head><body><main class="wrap"><header><div><span class="eyebrow">WSW / PROPOSAL WORKFLOW</span><h1>提案書生成ステータス</h1></div><p>10秒ごとに自動更新</p></header><div class="card">${jobs.length ? `<table><thead><tr><th>案件</th><th>現在地</th><th>提案書</th><th>ラフ</th><th>詳細</th></tr></thead><tbody>${rows}</tbody></table>` : `<div class="empty">まだ生成履歴がありません。</div>`}</div><p class="note">受付済み → AI生成中 → R2保存中 → 管理メール送信中 → 管理メール送信済み の順で進みます。</p></main></body></html>`;

  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
};

export const ALL: APIRoute = () => new Response("Method Not Allowed", { status: 405 });
