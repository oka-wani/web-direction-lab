"use client";

import { useMemo, useState } from "react";
import { articleItems, categories, matchesCategory } from "../articles/article-data";

export default function HomeKnowledgeTabs() {
  const [category, setCategory] = useState("すべて");
  const shown = useMemo(() => articleItems.filter((article) => matchesCategory(article, category)).slice(0, 3), [category]);

  return <>
    <div className="category-filters home-knowledge-tabs" aria-label="ナレッジカテゴリを切り替える">{categories.map((item) => <button type="button" className={category === item ? "active" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
    <div className="archive-grid home-archive-grid">{shown.map((article) => <article className="archive-card" key={article.slug}>
      <div className="archive-body"><span className="knowledge-category-badge">{article.category}</span><h3><a href={`/articles/${article.slug}`}>{article.title}</a></h3><p>{article.description}</p><ul className="archive-tags knowledge-term-tags" aria-label="記事内の用語集">{(article.tags ?? []).slice(0, 4).map((tag) => <li key={tag}>#{tag}</li>)}</ul><a className="text-link card-read-link" href={`/articles/${article.slug}`}><span>この記事を読む</span><i>→</i></a></div>
    </article>)}</div>
    {shown.length === 0 && <p className="home-empty">このカテゴリの記事は準備中です。</p>}
  </>;
}
