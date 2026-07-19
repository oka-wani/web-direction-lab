"use client";

import { useMemo, useState } from "react";
import { columnItems } from "./column-data";

const columnCategories = ["すべて", "行動経済", "効率化"];

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
      <div className="column-card-body"><div><time>{item.date}</time><span>SHORT VIDEO</span></div><p className="column-card-hook">{item.videoHook}</p><h2><a href={`/column/${item.slug}`}>{item.title}</a></h2><a className="text-link" href={`/column/${item.slug}`}>続きを読む <span>→</span></a></div>
    </article>)}</div> : <div className="empty-state"><b>コラムは準備中です</b><p>「行動経済」と「効率化」のテーマで順次公開します。</p></div>}
  </>;
}
