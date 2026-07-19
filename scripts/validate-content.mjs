import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const legacyRequired = ["id", "kind", "status", "title", "slug", "category", "summary", "body", "seo", "video", "social", "review"];
const folders = ["automation/drafts", "automation/approved"];
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
let failures = 0;

function validateLegacy(value) {
  const missing = legacyRequired.filter((key) => !(key in value));
  return [
    ...missing.map((key) => `missing ${key}`),
    ...(!slugPattern.test(value.slug ?? "") ? ["invalid slug"] : []),
    ...(value.kind === "news" && !value.sources?.some((source) => source.isPrimary && /^https:\/\//.test(source.url))
      ? ["news requires a primary HTTPS source"]
      : []),
  ];
}

function validateDailyBundle(value) {
  const errors = [];
  if (!value.runDate) errors.push("missing runDate");
  if (!value.knowledge) errors.push("missing knowledge");
  if (!value.news) errors.push("missing news");
  if (!value.shortVideo) errors.push("missing shortVideo");
  if (!value.reviewChecklist) errors.push("missing reviewChecklist");

  if (value.knowledge && !slugPattern.test(value.knowledge.slug ?? "")) {
    errors.push("invalid knowledge slug");
  }
  if (value.news && !slugPattern.test(value.news.slug ?? "")) {
    errors.push("invalid news slug");
  }
  if (
    value.news &&
    !value.news.sources?.some(
      (source) => source.isPrimary && /^https:\/\//.test(source.url),
    )
  ) {
    errors.push("news requires a primary HTTPS source");
  }
  if (value.knowledge?.status !== "draft" || value.news?.status !== "draft") {
    errors.push("generated content must remain draft");
  }
  return errors;
}

for (const folder of folders) {
  const files = (await readdir(folder)).filter((file) => file.endsWith(".json"));
  for (const file of files) {
    const path = join(folder, file);
    const value = JSON.parse(await readFile(path, "utf8"));
    const errors =
      value.runDate || value.knowledge || value.news
        ? validateDailyBundle(value)
        : validateLegacy(value);

    if (errors.length) {
      failures += 1;
      console.error(`${path}: ${errors.join(", ")}`);
    } else {
      console.log(`${path}: valid`);
    }
  }
}

if (failures) process.exit(1);
