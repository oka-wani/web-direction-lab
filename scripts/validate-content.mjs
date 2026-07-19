import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const required = ["id", "kind", "status", "title", "slug", "category", "summary", "body", "seo", "video", "social", "review"];
const folders = ["automation/drafts", "automation/approved"];
let failures = 0;

for (const folder of folders) {
  const files = (await readdir(folder)).filter((file) => file.endsWith(".json"));
  for (const file of files) {
    const path = join(folder, file);
    const value = JSON.parse(await readFile(path, "utf8"));
    const missing = required.filter((key) => !(key in value));
    const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug ?? "");
    const newsHasPrimarySource = value.kind !== "news" || value.sources?.some((source) => source.isPrimary && /^https:\/\//.test(source.url));
    const errors = [...missing.map((key) => `missing ${key}`), ...(!validSlug ? ["invalid slug"] : []), ...(!newsHasPrimarySource ? ["news requires a primary HTTPS source"] : [])];
    if (errors.length) { failures += 1; console.error(`${path}: ${errors.join(", ")}`); }
    else console.log(`${path}: valid`);
  }
}

if (failures) process.exit(1);
