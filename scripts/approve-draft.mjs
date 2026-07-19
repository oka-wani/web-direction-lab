import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const runDate =
  process.env.RUN_DATE ||
  new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

const approveKnowledge = process.env.APPROVE_KNOWLEDGE === "true";
const approveNews = process.env.APPROVE_NEWS === "true";
const approvedBy = process.env.APPROVED_BY || "github-actions";

if (!approveKnowledge && !approveNews) {
  throw new Error("Select knowledge, news, or both for approval.");
}

const draftPath = join("automation/drafts", `daily-${runDate}.json`);
const draft = JSON.parse(await readFile(draftPath, "utf8"));
const approvedKinds = [];

function knowledgeType(category) {
  return {
    SEO: "seo",
    "Web制作": "website",
    "アクセス解析": "analytics",
    "システム": "system",
    "AI活用": "ai",
    "マーケティング": "marketing",
    UX: "marketing",
    "Webディレクション": "website",
  }[category] || "website";
}

if (approveKnowledge) {
  const post = {
    ...draft.knowledge,
    status: "published",
    date: runDate.replaceAll("-", "."),
    publishedAt: new Date().toISOString(),
    approvedBy,
  };

  await mkdir("content/knowledge/posts", { recursive: true });
  await writeFile(
    join("content/knowledge/posts", `${post.slug}.json`),
    `${JSON.stringify(post, null, 2)}\n`,
    "utf8",
  );

  const indexPath = "content/knowledge/articles.json";
  const index = JSON.parse(await readFile(indexPath, "utf8"));
  const item = {
    slug: post.slug,
    category: post.category,
    date: post.date,
    title: post.title,
    description: post.summary,
    level: post.level,
    minutes: post.minutes,
    type: knowledgeType(post.category),
  };
  const next = [item, ...index.filter((entry) => entry.slug !== post.slug)];
  await writeFile(indexPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  approvedKinds.push("knowledge");
}

if (approveNews) {
  const post = {
    ...draft.news,
    status: "published",
    date: runDate.replaceAll("-", "."),
    publishedAt: new Date().toISOString(),
    approvedBy,
  };

  await mkdir("content/news/posts", { recursive: true });
  await writeFile(
    join("content/news/posts", `${post.slug}.json`),
    `${JSON.stringify(post, null, 2)}\n`,
    "utf8",
  );

  const indexPath = "content/news/news.json";
  const index = JSON.parse(await readFile(indexPath, "utf8"));
  const primarySource =
    post.sources.find((source) => source.isPrimary) || post.sources[0];
  const item = {
    slug: post.slug,
    category: post.category,
    date: post.date,
    title: post.title,
    summary: post.summary,
    impact: post.impact,
    action: post.action,
    sourceName: primarySource.name,
    sourceUrl: primarySource.url,
  };
  const next = [item, ...index.filter((entry) => entry.slug !== post.slug)];
  await writeFile(indexPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  approvedKinds.push("news");
}

const approved = structuredClone(draft);
approved.approval = {
  approvedKinds,
  approvedAt: new Date().toISOString(),
  approvedBy,
};
if (approveKnowledge) approved.knowledge.status = "approved";
if (approveNews) approved.news.status = "approved";

await mkdir("automation/approved", { recursive: true });
await writeFile(
  join("automation/approved", `daily-${runDate}.json`),
  `${JSON.stringify(approved, null, 2)}\n`,
  "utf8",
);

console.log(`Approved ${approvedKinds.join(" and ")} for ${runDate}.`);
