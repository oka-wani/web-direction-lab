"use client";

import { useMemo, useState } from "react";
import { columnItems } from "./column-data";

const columnCategories = ["すべて", "仕事術", "AI・効率化"];

export default function ColumnList() {
  const [category, setCategory] = useState("すべて");
  const [visibleCount, setVisibleCount] = useState(12);
  const shown = useMemo(
    () => columnItems.filter((item) => category === "すべて" || item.category === category),
    [category],
  );
  const visibleItems = shown.slice(0, visibleCount);

  return <>
    <div className="column-filters category-filters" aria-label="カテゴリで絞り込む">
      {columnCategories.map((item) => <button className={category === item ? "active" : ""} type="button" onClick={() => { setCategory(item); setVisibleCount(12); }} key={item}>{item}</button>)}
    </div>
    <p className="result-count"><b>{shown.length}</b> 件のコラム</p>
    {shown.length > 0 ? <div className="column-card-grid">{visibleItems.map((item) => <article className="column-card" key={item.slug}>
      <a className="column-card-visual" href={`/column/${item.slug}`} style={{ backgroundImage:`url(${item.image})` }} aria-label={`${item.title}を読む`}><span>{item.category}</span></a>
      <div className="column-card-body"><div><time>{item.date}</time><span>WEB COLUMN</span></div><p className="column-card-hook">{item.videoHook}</p><h2><a href={`/column/${item.slug}`}>{item.title}</a></h2><a className="text-link card-read-link" href={`/column/${item.slug}`}><span>続きを読む</span><i>→</i></a></div>
    </article>)}</div> : <div className="empty-state"><b>コラムは準備中です</b><p>仕事術やAI・効率化に役立つテーマを順次公開します。</p></div>}
    {visibleCount < shown.length && <button className="load-more-button" type="button" onClick={() => setVisibleCount((count) => count + 9)}>もっと見る <span>＋9件</span></button>}
  </>;
}
