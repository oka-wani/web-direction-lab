"use client";

import { useEffect, useMemo, useState } from "react";
import { articleItems, categories, matchesCategory } from "./article-data";
import { getAllGuideArticles } from "../guide/guide-data";

const foundationItems = getAllGuideArticles().map(({ step, article, href, slug }) => ({
  slug: `${step.slug}-${slug}`,
  category: "基礎知識",
  date: `STEP ${step.number}`,
  title: article.title,
  description: article.summary,
  level: "基礎",
  minutes: 6,
  image: "/images/web-guide-hero.webp",
  tags: [step.title],
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
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("category");
    if (value && categories.includes(value)) {
      const timer = window.setTimeout(() => setCategory(value), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);
  const shown = useMemo(() => knowledgeItems.filter((article) =>
    (article.category === "基礎知識" ? category === "すべて" || category === "基礎知識" : matchesCategory(article, category)) &&
    (article.title + article.description + article.category).toLowerCase().includes(query.toLowerCase())
  ), [category, query]);
  return <>
    <div className="article-tools">
      <div className="category-filters" aria-label="カテゴリで絞り込む">{categories.map((item) => <button className={category === item ? "active" : ""} type="button" onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
      <label className="article-search"><span className="sr-only">記事を検索</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="キーワードで記事を検索" /><b>⌕</b></label>
    </div>
    <p className="result-count"><b>{shown.length}</b> 件のナレッジ</p>
    <div className="archive-grid">{shown.map((article) => <article className="archive-card" key={article.slug}>
      <a className="archive-visual archive-visual--image" href={article.href} aria-label={`${article.title}を読む`} style={{ backgroundImage:`url(${article.image ?? "/images/web-knowledge-hero-v2.webp"})` }}><span>{article.category}</span></a>
      <div className="archive-body"><div className="archive-meta"><span>{article.date}</span></div><h2><a href={article.href}>{article.title}</a></h2><p>{article.description}</p><ul className="archive-tags" aria-label="記事内の主な用語">{(article.tags ?? []).slice(0, 4).map((tag) => <li key={tag}>#{tag}</li>)}</ul><a className="text-link" href={article.href}>この記事を読む <span>→</span></a></div>
    </article>)}</div>
    {shown.length === 0 && <div className="empty-state"><b>該当する記事がありません</b><p>別のキーワードまたはカテゴリでお試しください。</p></div>}
  </>;
}
