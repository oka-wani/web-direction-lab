"use client";

import { useMemo, useState } from "react";
import { articleItems, categories, matchesCategory } from "../articles/article-data";

export default function HomeKnowledgeTabs() {
  const [category, setCategory] = useState("すべて");
  const shown = useMemo(() => articleItems.filter((article) => matchesCategory(article, category)).slice(0, 3), [category]);

  return <>
    <div className="home-knowledge-tabs" aria-label="ナレッジカテゴリを切り替える">{categories.map((item) => <button type="button" className={category === item ? "active" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
    <div className="home-knowledge-list home-knowledge-list--filtered">{shown.map((article) => <article key={article.slug}><div><span>{article.category}</span><time>{article.date}</time></div><h3><a href={`/articles/${article.slug}`}>{article.title}</a></h3><p>{article.description}</p><a className="text-link" href={`/articles/${article.slug}`}>この記事を読む <span>→</span></a></article>)}</div>
    {shown.length === 0 && <p className="home-empty">このカテゴリの記事は準備中です。</p>}
  </>;
}
