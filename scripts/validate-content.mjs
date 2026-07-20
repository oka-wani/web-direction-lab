import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const folders = ["automation/drafts", "automation/approved"];
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const knowledgeCategories = new Set([
  "SEO", "Web制作", "アクセス解析", "システム", "AI活用",
  "マーケティング", "UX", "Webディレクション",
]);
const newsCategories = new Set([
  "AI", "検索・SEO", "アクセス解析・広告", "ブラウザ・Web標準",
  "Web制作・CMS", "クラウド・インフラ", "セキュリティ・プライバシー", "Webサービス",
]);
const columnCategories = new Set(["Webの仕事術", "AI活用", "サイト改善", "キャリア・学習"]);

let failures = 0;
const knowledgeIndex = JSON.parse(await readFile("content/knowledge/articles.json", "utf8"));
const newsIndex = JSON.parse(await readFile("content/news/news.json", "utf8"));
const columnIndex = JSON.parse(await readFile("content/column/columns.json", "utf8"));

function isText(value, min = 1) {
  return typeof value === "string" && value.trim().length >= min;
}

function isHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !["localhost", "127.0.0.1"].includes(url.hostname);
  } catch {
    return false;
  }
}

function validateSources(sources, label, { requirePrimary = false } = {}) {
  const errors = [];
  if (!Array.isArray(sources) || sources.length === 0) return [`${label} requires sources`];
  const urls = new Set();

  for (const [index, source] of sources.entries()) {
    const path = `${label}.sources[${index}]`;
    if (!isText(source?.name)) errors.push(`${path} requires a name`);
    if (!isHttpsUrl(source?.url)) errors.push(`${path} requires an HTTPS URL`);
    if (!isText(source?.publishedAt)) errors.push(`${path} requires publishedAt`);
    if (urls.has(source?.url)) errors.push(`${path} duplicates a source URL`);
    urls.add(source?.url);
  }

  if (requirePrimary && !sources.some((source) => source?.isPrimary === true && isHttpsUrl(source.url))) {
    errors.push(`${label} requires a primary HTTPS source`);
  }
  return errors;
}

function validateArticleBody(body, label) {
  const errors = [];
  for (const key of ["conclusion", "definition", "importance", "practice", "mistakes", "example"]) {
    if (!isText(body?.[key], 40)) errors.push(`${label}.body.${key} is too short or missing`);
  }
  if (!Array.isArray(body?.highlights) || body.highlights.length < 3) errors.push(`${label} requires at least 3 highlights`);
  if (!Array.isArray(body?.glossary) || body.glossary.length < 5) errors.push(`${label} requires at least 5 glossary terms`);
  if (!isText(body?.quiz?.question) || !Array.isArray(body?.quiz?.choices) || body.quiz.choices.length < 3) {
    errors.push(`${label} requires a complete quiz`);
  }
  if (!isText(body?.quiz?.answer) || !body?.quiz?.choices?.includes(body.quiz.answer)) {
    errors.push(`${label} quiz answer must match a choice`);
  }
  return errors;
}

function validateIndex(index, label) {
  const errors = [];
  const slugs = new Set();
  for (const [position, item] of index.entries()) {
    if (!slugPattern.test(item?.slug ?? "")) errors.push(`${label}[${position}] has an invalid slug`);
    if (!isText(item?.title)) errors.push(`${label}[${position}] requires a title`);
    if (slugs.has(item?.slug)) errors.push(`${label} contains duplicate slug ${item.slug}`);
    slugs.add(item?.slug);
  }
  return errors;
}

function validateNoCollision(post, index, label) {
  const errors = [];
  const sameSlug = index.find((item) => item.slug === post?.slug);
  const sameTitle = index.find((item) => item.title === post?.title);
  if (sameSlug && sameSlug.title !== post?.title) errors.push(`${label} slug already belongs to another title`);
  if (sameTitle && sameTitle.slug !== post?.slug) errors.push(`${label} title already belongs to another slug`);
  return errors;
}

function validateDailyBundle(value, folder, file) {
  const errors = [];
  const expectedDate = file.match(/^daily-(\d{4}-\d{2}-\d{2})\.json$/)?.[1];
  if (!datePattern.test(value?.runDate ?? "")) errors.push("missing or invalid runDate");
  if (expectedDate && value.runDate !== expectedDate) errors.push("runDate does not match filename");

  const knowledge = value?.knowledge;
  const news = value?.news;
  const column = value?.column;
  if (!knowledge) errors.push("missing knowledge");
  if (!news) errors.push("missing news");
  if (!value?.reviewChecklist) errors.push("missing reviewChecklist");

  if (knowledge) {
    if (!slugPattern.test(knowledge.slug ?? "")) errors.push("invalid knowledge slug");
    if (!knowledgeCategories.has(knowledge.category)) errors.push("invalid knowledge category");
    if (!isText(knowledge.title, 8) || !isText(knowledge.summary, 40)) errors.push("knowledge title or summary is too short");
    if (!Number.isInteger(knowledge.minutes) || knowledge.minutes < 5 || knowledge.minutes > 30) errors.push("invalid knowledge reading time");
    if (!Array.isArray(knowledge?.seo?.keywords) || knowledge.seo.keywords.length < 3) errors.push("knowledge requires SEO keywords");
    errors.push(...validateArticleBody(knowledge.body, "knowledge"));
    errors.push(...validateSources(knowledge.sources, "knowledge"));
    errors.push(...validateNoCollision(knowledge, knowledgeIndex, "knowledge"));
  }

  if (news) {
    if (!slugPattern.test(news.slug ?? "")) errors.push("invalid news slug");
    if (!newsCategories.has(news.category)) errors.push("invalid news category");
    if (!isText(news.title, 8) || !isText(news.summary, 40)) errors.push("news title or summary is too short");
    if (!Array.isArray(news.quickSummary) || news.quickSummary.length !== 3) errors.push("news requires exactly 3 quick summaries");
    if (!isText(news.whatHappened, 100) || !isText(news.impact, 100) || !isText(news.action, 100)) {
      errors.push("news explanation is incomplete");
    }
    if (!Number.isInteger(news.urgency) || news.urgency < 1 || news.urgency > 5) errors.push("invalid news urgency");
    if (!Number.isInteger(news.audienceImpact) || news.audienceImpact < 1 || news.audienceImpact > 5) errors.push("invalid news audience impact");
    errors.push(...validateSources(news.sources, "news", { requirePrimary: true }));
    errors.push(...validateNoCollision(news, newsIndex, "news"));
  }

  if (column) {
    if (!slugPattern.test(column.slug ?? "")) errors.push("invalid column slug");
    if (!columnCategories.has(column.category)) errors.push("invalid column category");
    if (!isText(column.title, 8) || !isText(column.summary, 40)) errors.push("column title or summary is too short");
    if (!isText(column.videoHook, 8) || !isText(column.lead, 80)) errors.push("column hook or lead is too short");
    if (!Array.isArray(column.sections) || column.sections.length < 3 || column.sections.some((section) => !isText(section?.title) || !isText(section?.body, 200))) {
      errors.push("column requires at least 3 complete sections");
    }
    if (!Array.isArray(column?.seo?.keywords) || column.seo.keywords.length < 3) errors.push("column requires SEO keywords");
    errors.push(...validateNoCollision(column, columnIndex, "column"));
  }

  if (knowledge?.slug === news?.slug) errors.push("knowledge and news slugs must differ");
  if (column && [knowledge?.slug, news?.slug].includes(column.slug)) errors.push("column slug must differ from other daily content");

  if (folder === "automation/drafts") {
    if (knowledge?.status !== "draft" || news?.status !== "draft" || (column && column.status !== "draft")) errors.push("generated content must remain draft");
    for (const key of ["factChecked", "primarySourcesChecked", "duplicateChecked", "seoChecked"]) {
      if (value.reviewChecklist?.[key] !== false) errors.push(`draft reviewChecklist.${key} must be false`);
    }
    if (value.reviewChecklist?.approvedBy !== null) errors.push("draft must not have an approver");
  } else {
    const kinds = value?.approval?.approvedKinds;
    if (!Array.isArray(kinds) || kinds.length === 0) errors.push("missing approved kinds");
    if (!isText(value?.approval?.approvedAt) || !isText(value?.approval?.approvedBy)) errors.push("missing approval metadata");
    for (const kind of ["knowledge", "news"]) {
      const expected = kinds?.includes(kind) ? "approved" : "draft";
      if (value?.[kind]?.status !== expected) errors.push(`${kind} status must be ${expected}`);
    }
    if (value.column) {
      const expected = kinds?.includes("column") ? "approved" : "draft";
      if (value.column.status !== expected) errors.push(`column status must be ${expected}`);
    }
  }
  return errors;
}

for (const error of [
  ...validateIndex(knowledgeIndex, "content/knowledge/articles.json"),
  ...validateIndex(newsIndex, "content/news/news.json"),
  ...validateIndex(columnIndex, "content/column/columns.json"),
]) {
  failures += 1;
  console.error(error);
}

for (const folder of folders) {
  const files = (await readdir(folder)).filter((file) => file.endsWith(".json"));
  for (const file of files) {
    const path = join(folder, file);
    try {
      const value = JSON.parse(await readFile(path, "utf8"));
      if (!value.runDate || !value.knowledge || !value.news) {
        console.log(`${path}: skipped legacy single-item draft`);
        continue;
      }
      const errors = validateDailyBundle(value, folder, file);
      if (errors.length) {
        failures += 1;
        console.error(`${path}: ${errors.join(", ")}`);
      } else {
        console.log(`${path}: valid`);
      }
    } catch (error) {
      failures += 1;
      console.error(`${path}: ${error.message}`);
    }
  }
}

if (failures) process.exit(1);
