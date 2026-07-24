"use client";

import { useEffect, useMemo, useState } from "react";
import { articleItems, categories, matchesCategory } from "./article-data";
import { getAllGuideArticles, getGuideArticleCategory } from "../guide/guide-data";
import { getFoundationGlossaryTerms } from "../guide/foundation-content";

const foundationItems = getAllGuideArticles().map(({ step, article, href, slug }) => ({
  slug: `${step.slug}-${slug}`,
  category: getGuideArticleCategory(step, article),
  date: "",
  title: article.title,
  description: article.summary,
  level: "基礎",
  minutes: 6,
  image: "/images/web-guide-hero.webp",
  tags: getFoundationGlossaryTerms(step.slug).map(({ term }) => term),
  type: "website" as const,
  href,
}));

const knowledgeItems = [
  ...foundationItems,
  ...articleItems.map((article) => ({ ...article, href: `/articles/${article.slug}` })),
];

export default function ArticlesList() {
  const [category, setCategory] = useState("すべて");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("category");
    if (value && categories.includes(value)) {
      const timer = window.setTimeout(() => setCategory(value), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);
  const shown = useMemo(() => {
    const normalizedQuery = query.toLowerCase().replace(/[#＃]/g, "").trim();
    return knowledgeItems.filter((article) => {
      const searchableText = [article.title, article.description, article.category, ...(article.tags ?? [])].join(" ").toLowerCase();
      return matchesCategory(article, category) && searchableText.includes(normalizedQuery);
    });
  }, [category, query]);
  const visibleItems = shown.slice(0, visibleCount);
  return <>
    <div className="article-tools">
      <div className="category-filters" aria-label="カテゴリで絞り込む">{categories.map((item) => <button className={category === item ? "active" : ""} type="button" onClick={() => { setCategory(item); setVisibleCount(12); }} key={item}>{item}</button>)}</div>
      <label className="article-search"><span className="sr-only">記事を検索</span><input value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(12); }} placeholder="キーワードで記事を検索" /><b>⌕</b></label>
    </div>
    <p className="result-count"><b>{shown.length}</b> 件のナレッジ</p>
    <div className="archive-grid">{visibleItems.map((article) => <article className="archive-card" key={article.slug}>
      <div className="archive-body"><span className="knowledge-category-badge">{article.category}</span><h2><a href={article.href}>{article.title}</a></h2><p>{article.description}</p><ul className="archive-tags knowledge-term-tags" aria-label="記事内の用語集">{(article.tags ?? []).slice(0, 4).map((tag) => <li key={tag}>#{tag}</li>)}</ul><a className="text-link card-read-link" href={article.href}><span>この記事を読む</span><i>→</i></a></div>
    </article>)}</div>
    {visibleCount < shown.length && <button className="load-more-button" type="button" onClick={() => setVisibleCount((count) => count + 9)}>もっと見る <span>＋9件</span></button>}
    {shown.length === 0 && <div className="empty-state"><b>該当する記事がありません</b><p>別のキーワードまたはカテゴリでお試しください。</p></div>}
  </>;
}
