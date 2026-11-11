import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

export const categories = ["UX・CX", "マーケティング", "ホームページ制作", "運用・改善", "SEO・解析"];
const text = (value, min, max = Infinity) => typeof value === "string" && value.trim().length >= min && value.length <= max;

export function validateColumn(post, existing = []) {
  const errors = [];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post?.slug ?? "")) errors.push("Invalid slug");
  const date = post?.date?.replaceAll(".", "-");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? "") || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) errors.push("Invalid publication date");
  if (!categories.includes(post?.category)) errors.push("Invalid category");
  for (const [key, min, max] of [["title", 8, 90], ["summary", 40, 220], ["lead", 80, 500], ["videoHook", 8, 100]]) {
    if (!text(post?.[key], min, max)) errors.push(`Invalid ${key}`);
  }
  if (!Array.isArray(post?.sections) || post.sections.length < 3 || post.sections.length > 6 || post.sections.some(s => !text(s?.title, 4, 80) || !text(s?.body, 200, 1500))) errors.push("Requires 3–6 complete sections");
  const bodyLength = (post?.lead?.length ?? 0) + (post?.sections ?? []).reduce((n, s) => n + (s.body?.length ?? 0), 0);
  if (bodyLength < 1500 || bodyLength > 5000) errors.push("Article must contain 1,500–5,000 characters");
  if (!text(post?.seo?.metaTitle, 8, 90) || !text(post?.seo?.metaDescription, 40, 220) || !Array.isArray(post?.seo?.keywords) || post.seo.keywords.length < 3) errors.push("Incomplete SEO fields");
  if (!Array.isArray(post?.sources) || post.sources.length < 1 || post.sources.some(s => {
    try { return !text(s?.name, 2) || new URL(s.url).protocol !== "https:"; } catch { return true; }
  })) errors.push("Requires named HTTPS sources");
  if (post?.image !== "/images/og-default.svg") errors.push("Use the existing article artwork");
  if (post?.generatedBy !== "AI-assisted") errors.push("AI disclosure required");
  if (existing.some(p => p.slug === post?.slug || p.title.normalize("NFKC").replace(/\s/g, "") === post?.title?.normalize("NFKC").replace(/\s/g, ""))) errors.push("Duplicate article");
  if (existing.some(p => p.date === post?.date && p.generatedBy === "AI-assisted")) errors.push("Daily article already exists");
  return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const input = process.argv[2];
  if (!input) throw new Error("Usage: node scripts/publish-column.mjs <article.json>");
  const post = JSON.parse(await readFile(input, "utf8"));
  const indexPath = "content/column/columns.json";
  const existing = JSON.parse(await readFile(indexPath, "utf8"));
  const seedSource = await readFile("app/column/column-data.ts", "utf8");
  const errors = validateColumn(post, existing);
  if (seedSource.includes(`slug: "${post.slug}"`)) errors.push("Slug collides with an original article");
  if (errors.length) throw new Error(errors.join("; "));
  await writeFile(indexPath, JSON.stringify([post, ...existing].sort((a, b) => b.date.localeCompare(a.date)), null, 2) + "\n");
  console.log(`Prepared /column/${post.slug}/; publish the validated commit to deploy.`);
}
