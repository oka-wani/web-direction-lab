"use client";

import { useMemo, useState } from "react";
import { columnItems } from "./column-data";

const columnCategories = ["すべて", "Webの仕事術", "AI活用", "サイト改善", "キャリア・学習"];

export default function ColumnList() {
  const [category, setCategory] = useState("すべて");
  const shown = useMemo(
    () => columnItems.filter((item) => category === "すべて" || item.category === category),
    [category],
  );

  return <>
    <div className="column-filters category-filters" aria-label="カテゴリで絞り込む">
      {columnCategories.map((item) => <button className={category === item ? "active" : ""} type="button" onClick={() => setCategory(item)} key={item}>{item}</button>)}
    </div>
    <p className="result-count"><b>{shown.length}</b> 件のコラム</p>
    {shown.length > 0 ? <div className="column-card-grid">{shown.map((item) => <article className="column-card" key={item.slug}>
      <a className="column-card-visual" href={`/column/${item.slug}`} style={{ backgroundImage:`url(${item.image})` }} aria-label={`${item.title}を読む`}><span>{item.category}</span></a>
      <div className="column-card-body"><div><time>{item.date}</time><span>WEB COLUMN</span></div><p className="column-card-hook">{item.videoHook}</p><h2><a href={`/column/${item.slug}`}>{item.title}</a></h2><a className="text-link" href={`/column/${item.slug}`}>続きを読む <span>→</span></a></div>
    </article>)}</div> : <div className="empty-state"><b>コラムは準備中です</b><p>Webの仕事やサイト改善に役立つテーマを順次公開します。</p></div>}
  </>;
}
