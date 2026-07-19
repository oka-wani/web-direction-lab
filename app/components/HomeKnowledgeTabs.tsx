"use client";

import { useMemo, useState } from "react";
import { articleItems, categories, matchesCategory, type ArticleItem } from "../articles/article-data";

function visualLabel(article: ArticleItem) {
  if (article.type === "system") return "DNS / API";
  if (article.type === "analytics") return "DATA";
  if (article.type === "website") return "WEB";
  if (article.type === "ai") return "AI";
  return "SEARCH";
}

export default function HomeKnowledgeTabs() {
  const [category, setCategory] = useState("すべて");
  const shown = useMemo(() => articleItems.filter((article) => matchesCategory(article, category)).slice(0, 3), [category]);

  return <>
    <div className="category-filters home-knowledge-tabs" aria-label="ナレッジカテゴリを切り替える">{categories.map((item) => <button type="button" className={category === item ? "active" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
    <div className="archive-grid home-archive-grid">{shown.map((article) => <article className="archive-card" key={article.slug}>
      <a className={`archive-visual archive-visual--${article.type}`} href={`/articles/${article.slug}`} aria-label={`${article.title}を読む`}><span>{article.category}</span><div><b>{visualLabel(article)}</b><i /><i /><i /></div></a>
      <div className="archive-body"><div className="archive-meta"><time>{article.date}</time><span>{article.level}</span><span>{article.minutes}分</span></div><h3><a href={`/articles/${article.slug}`}>{article.title}</a></h3><p>{article.description}</p><a className="text-link" href={`/articles/${article.slug}`}>この記事を読む <span>→</span></a></div>
    </article>)}</div>
    {shown.length === 0 && <p className="home-empty">このカテゴリの記事は準備中です。</p>}
  </>;
}
