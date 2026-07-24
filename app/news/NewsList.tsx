"use client";

import { useMemo, useState } from "react";
import { newsItems, type NewsItem } from "./news-data";

const categories = ["すべて", "SEO", "Web制作", "デザイン・UX", "マーケティング・解析", "システム", "AI活用", "Webディレクション", "その他"];

function matchesNewsCategory(item: NewsItem, category: string) {
  return category === "すべて" || item.category === category;
}

export default function NewsList() {
  const [category, setCategory] = useState("すべて");
  const shown = useMemo(() => newsItems.filter((item) => matchesNewsCategory(item, category)), [category]);
  return <>
    <div className="category-filters news-category-filters" aria-label="ニュースカテゴリで絞り込む">{categories.map((item) => <button type="button" className={category === item ? "active" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
    <p className="result-count"><b>{shown.length}</b> 件のニュース</p>
    <div className="news-list">{shown.map((item) => <article className="news-list-item" key={item.slug}><div className="news-list-meta"><time>{item.date}</time><span>{item.category}</span></div><div className="news-list-body"><h2><a href={`/news/${item.slug}`}>{item.title}</a></h2></div><a className="news-list-arrow" href={`/news/${item.slug}`} aria-label={`${item.title}を読む`}>→</a></article>)}</div>
    {shown.length === 0 && <div className="empty-state"><b>該当するニュースはまだありません</b><p>別のカテゴリを選択してください。</p></div>}
  </>;
}
