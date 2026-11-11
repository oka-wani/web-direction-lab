import { test } from "node:test";
import assert from "node:assert/strict";
import { validateColumn } from "./publish-column.mjs";

const post = {
  slug: "journey-first", date: "2026.11.11", category: "UX・CX",
  title: "顧客の行動を確認して改善する", summary: "あ".repeat(50), lead: "あ".repeat(100), videoHook: "顧客の行動から考えよう",
  sections: [1, 2, 3].map(n => ({ title: `改善の手順${n}`, body: "あ".repeat(500) })),
  sources: [{ name: "一次情報", url: "https://www.nngroup.com/articles/ux-vs-cx/" }],
  image: "/images/og-default.svg", generatedBy: "AI-assisted",
  seo: { metaTitle: "顧客の行動から改善を考える", metaDescription: "あ".repeat(50), keywords: ["UX", "CX", "改善"] },
};
test("complete sourced article passes", () => assert.deepEqual(validateColumn(post), []));
test("duplicate title, slug, and daily publication are blocked", () => {
  assert.match(validateColumn(post, [post]).join(), /Duplicate article/);
  assert.match(validateColumn({ ...post, slug: "different", title: "異なるタイトルの記事です" }, [post]).join(), /Daily article already exists/);
});
test("invalid sources, impossible dates, short bodies are blocked", () => {
  const errors = validateColumn({ ...post, date: "2026.02.30", sources: [{ name: "Source", url: "javascript:alert(1)" }], sections: [] }).join();
  assert.match(errors, /Invalid publication date/);
  assert.match(errors, /HTTPS sources/);
  assert.match(errors, /1,500/);
});
