"use client";

import { useMemo, useState } from "react";
import { categories } from "../articles/article-data";
import { newsItems, type NewsItem } from "./news-data";

function matchesNewsCategory(item: NewsItem, category: string) {
  if (category === "すべて") return true;
  const text = `${item.category} ${item.title} ${item.summary}`;
  if (category === "SEO") return text.includes("SEO") || text.includes("検索");
  if (category === "Web制作") return text.includes("Web制作") || text.includes("Web Platform") || text.includes("ブラウザ");
  if (category === "デザイン・UX") return text.includes("デザイン") || text.includes("UX") || text.includes("UI") || text.includes("アクセシビリティ");
  if (category === "マーケティング・解析") return text.includes("マーケティング") || text.includes("解析") || text.includes("GA4") || text.includes("広告");
  if (category === "システム") return ["システム", "セキュリティ", "クラウド", "CMS", "サーバー", "API"].some((word) => text.includes(word));
  if (category === "AI活用") return text.includes("AI") || text.includes("生成");
  return !["SEO", "検索", "Web制作", "Web Platform", "ブラウザ", "デザイン", "UX", "UI", "アクセシビティ", "マーケティング", "解析", "GA4", "広告", "システム", "セキュリティ", "クラウド", "CMS", "サーバー", "API", "AI", "生成"].some((word) => text.includes(word));
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
