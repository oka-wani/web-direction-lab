"use client";

import { useMemo, useState } from "react";
import { newsItems } from "./news-data";

const categories = ["すべて", "サービス", "制作イメージ", "サイト更新", "営業案内"];

export default function NewsList() {
  const [category, setCategory] = useState("すべて");
  const shown = useMemo(() => newsItems.filter((item) => category === "すべて" || item.category === category), [category]);

  return <>
    <div className="category-filters news-category-filters" aria-label="お知らせカテゴリで絞り込む">{categories.map((item) => <button type="button" className={category === item ? "active" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
    <p className="result-count"><b>{shown.length}</b> 件のお知らせ</p>
    <div className="order-news-list">{shown.map((item) => <article className="order-news-item" key={item.slug}><time>{item.date}</time><span>{item.category}</span><div><h2 style={{ margin: "0 0 8px", fontSize: "18px" }}>{item.title}</h2><p>{item.summary}</p></div></article>)}</div>
    {shown.length === 0 && <div className="empty-state"><b>該当するお知らせはまだありません</b><p>別のカテゴリを選択してください。</p></div>}
  </>;
}
