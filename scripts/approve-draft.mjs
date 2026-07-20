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

const requestKnowledge = process.env.APPROVE_KNOWLEDGE === "true";
const requestNews = process.env.APPROVE_NEWS === "true";
const requestColumn = process.env.APPROVE_COLUMN === "true";
const approvedBy = process.env.APPROVED_BY || "github-actions";

if (!requestKnowledge && !requestNews && !requestColumn) throw new Error("Select knowledge, news, column, or a combination for approval.");

const draftPath = join("automation/drafts", `daily-${runDate}.json`);
const draft = JSON.parse(await readFile(draftPath, "utf8"));
const approvedAt = new Date().toISOString();
const approvalPath = join("automation/approved", `daily-${runDate}.json`);
const publicationPath = join("automation/published", `daily-${runDate}.json`);

async function readJsonIfPresent(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

const previousApproval = await readJsonIfPresent(approvalPath);
const previousPublication = await readJsonIfPresent(publicationPath);
const approvedKinds = [...new Set(previousApproval?.approval?.approvedKinds ?? [])];
const approveKnowledge = requestKnowledge && !approvedKinds.includes("knowledge");
const approveNews = requestNews && !approvedKinds.includes("news");
const approveColumn = requestColumn && !approvedKinds.includes("column");

if (!approveKnowledge && !approveNews && !approveColumn) {
  console.log(`Requested content for ${runDate} is already published.`);
  process.exit(0);
}

if (draft.runDate !== runDate) {
  throw new Error(`Draft runDate ${draft.runDate} does not match requested date ${runDate}.`);
}

function assertNoCollision(index, post, kind) {
  const sameSlug = index.find((entry) => entry.slug === post.slug);
  if (sameSlug && sameSlug.title !== post.title) {
    throw new Error(`${kind} slug ${post.slug} is already used by a different title.`);
  }

  const sameTitle = index.find((entry) => entry.title === post.title);
  if (sameTitle && sameTitle.slug !== post.slug) {
    throw new Error(`${kind} title is already published with slug ${sameTitle.slug}.`);
  }
}

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
  const indexPath = "content/knowledge/articles.json";
  const index = JSON.parse(await readFile(indexPath, "utf8"));
  assertNoCollision(index, draft.knowledge, "Knowledge");
  const post = {...draft.knowledge, status: "published", date: runDate.replaceAll("-", "."), publishedAt: approvedAt, approvedBy};
  await mkdir("content/knowledge/posts", { recursive: true });
  await writeFile(join("content/knowledge/posts", `${post.slug}.json`), `${JSON.stringify(post, null, 2)}\n`, "utf8");

  const item = {
    slug: post.slug,
    category: post.category,
    date: post.date,
    title: post.title,
    description: post.summary,
    level: post.level,
    minutes: post.minutes,
    type: knowledgeType(post.category),
    keywords: post.seo?.keywords ?? [],
  };
  await writeFile(indexPath, `${JSON.stringify([item, ...index.filter((entry) => entry.slug !== post.slug)], null, 2)}\n`, "utf8");
  approvedKinds.push("knowledge");
}

if (approveNews) {
  const indexPath = "content/news/news.json";
  const index = JSON.parse(await readFile(indexPath, "utf8"));
  assertNoCollision(index, draft.news, "News");
  const post = {...draft.news, status: "published", date: runDate.replaceAll("-", "."), publishedAt: approvedAt, approvedBy};
  await mkdir("content/news/posts", { recursive: true });
  await writeFile(join("content/news/posts", `${post.slug}.json`), `${JSON.stringify(post, null, 2)}\n`, "utf8");

  const primarySource = post.sources.find((source) => source.isPrimary) || post.sources[0];
  const item = {
    slug: post.slug, category: post.category, date: post.date, title: post.title,
    summary: post.summary, whatHappened: post.whatHappened, impact: post.impact,
    action: post.action, audienceImpact: post.audienceImpact,
    selectionReason: post.selectionReason, sourceName: primarySource.name, sourceUrl: primarySource.url,
    serviceName: post.serviceName, quickSummary: post.quickSummary, affected: post.affected,
    beforeAfter: post.beforeAfter, actionLevel: post.actionLevel, actions: post.actions,
    visual: post.visual, keywords: post.keywords,
  };
  await writeFile(indexPath, `${JSON.stringify([item, ...index.filter((entry) => entry.slug !== post.slug)], null, 2)}\n`, "utf8");
  approvedKinds.push("news");
}

if (approveColumn) {
  if (!draft.column) throw new Error(`Draft for ${runDate} does not contain a column.`);
  const indexPath = "content/column/columns.json";
  const index = JSON.parse(await readFile(indexPath, "utf8"));
  assertNoCollision(index, draft.column, "Column");
  const image = {
    "Webの仕事術": "/images/column/web-system-learning.webp",
    "AI活用": "/images/column/ai-human-judgement.webp",
    "サイト改善": "/images/column/news-to-action.webp",
    "キャリア・学習": "/images/column/web-system-learning.webp",
  }[draft.column.category] || "/images/column/web-system-learning.webp";
  const post = {
    ...draft.column,
    status: "published",
    date: runDate.replaceAll("-", "."),
    image,
    publishedAt: approvedAt,
    approvedBy,
  };
  await writeFile(indexPath, `${JSON.stringify([post, ...index.filter((entry) => entry.slug !== post.slug)], null, 2)}\n`, "utf8");
  approvedKinds.push("column");
}

const approved = structuredClone(draft);
approved.reviewChecklist = {
  factChecked: true,
  primarySourcesChecked: true,
  duplicateChecked: true,
  seoChecked: true,
  approvedBy,
};
approved.approval = {approvedKinds, approvedAt, approvedBy};
if (approvedKinds.includes("knowledge")) approved.knowledge.status = "approved";
if (approvedKinds.includes("news")) approved.news.status = "approved";
if (approvedKinds.includes("column") && approved.column) approved.column.status = "approved";

await mkdir("automation/approved", { recursive: true });
await writeFile(approvalPath, `${JSON.stringify(approved, null, 2)}\n`, "utf8");

const published = {
  runDate,
  publishedAt: previousPublication?.publishedAt ?? approvedAt,
  updatedAt: approvedAt,
  publishedBy: approvedBy,
  publishedKinds: approvedKinds,
  urls: {
    knowledge: approvedKinds.includes("knowledge") ? `/articles/${draft.knowledge.slug}` : null,
    news: approvedKinds.includes("news") ? `/news/${draft.news.slug}` : null,
    column: approvedKinds.includes("column") ? `/column/${draft.column.slug}` : null,
  },
};
await mkdir("automation/published", { recursive: true });
await writeFile(publicationPath, `${JSON.stringify(published, null, 2)}\n`, "utf8");
console.log(`Approved ${approvedKinds.join(" and ")} for ${runDate}.`);
