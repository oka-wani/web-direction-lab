"use client";

import { useEffect, useMemo, useState } from "react";
import { articleItems, categories } from "./article-data";

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
  const shown = useMemo(() => articleItems.filter((article) =>
    (category === "すべて" || article.category === category) &&
    (article.title + article.description + article.category).toLowerCase().includes(query.toLowerCase())
  ), [category, query]);
  return <>
    <div className="article-tools">
      <div className="category-filters" aria-label="カテゴリで絞り込む">{categories.map((item) => <button className={category === item ? "active" : ""} type="button" onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
      <label className="article-search"><span className="sr-only">記事を検索</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="キーワードで記事を検索" /><b>⌕</b></label>
    </div>
    <p className="result-count"><b>{shown.length}</b> 件のナレッジ</p>
    <div className="archive-grid">{shown.map((article) => <article className="archive-card" key={article.slug}>
      <a className={`archive-visual archive-visual--${article.type}`} href={`/articles/${article.slug}`} aria-label={`${article.title}を読む`}><span>{article.category}</span><div><b>{article.type === "system" ? "DNS / API" : article.type === "analytics" ? "DATA" : article.type === "website" ? "WEB" : article.type === "ai" ? "AI" : "SEARCH"}</b><i /><i /><i /></div></a>
      <div className="archive-body"><div className="archive-meta"><time>{article.date}</time><span>{article.level}</span><span>{article.minutes}分</span></div><h2><a href={`/articles/${article.slug}`}>{article.title}</a></h2><p>{article.description}</p><a className="text-link" href={`/articles/${article.slug}`}>この記事を読む <span>→</span></a></div>
    </article>)}</div>
    {shown.length === 0 && <div className="empty-state"><b>該当する記事がありません</b><p>別のキーワードまたはカテゴリでお試しください。</p></div>}
  </>;
}
