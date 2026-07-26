"use client";

import { useMemo, useState } from "react";
import { columnItems } from "./column-data";

const columnCategories = ["すべて", "Webサイト制作", "Webサイト改善", "CMS・運用", "SEO・アクセス解析", "業務効率化・AI活用"];

const relatedService: Record<string, { label: string; href: string }> = {
  "Webサイト制作": { label: "小規模Webサイト制作", href: "/services/small-site-production" },
  "Webサイト改善": { label: "既存Webサイト改善", href: "/services/website-improvement" },
  "CMS・運用": { label: "Web運用サポート", href: "/services/website-operation-support" },
  "SEO・アクセス解析": { label: "既存Webサイト改善", href: "/services/website-improvement" },
  "業務効率化・AI活用": { label: "業務効率化ツール制作", href: "/services/business-efficiency-tools" },
};

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
      <div className="column-card-body"><div><time>{item.date}</time><span>WEB COLUMN</span></div><h2><a href={`/column/${item.slug}`}>{item.title}</a></h2><p className="column-card-summary">{item.summary}</p>{relatedService[item.category] && <a className="column-related-service" href={relatedService[item.category].href}>関連サービス：{relatedService[item.category].label}</a>}<a className="text-link card-read-link" href={`/column/${item.slug}`}><span>続きを読む</span><i>→</i></a></div>
    </article>)}</div> : <div className="empty-state"><b>該当するコラムは準備中です</b><p>Web制作・改善・運用・業務効率化に役立つテーマを順次公開します。</p></div>}
    {visibleCount < shown.length && <button className="load-more-button" type="button" onClick={() => setVisibleCount((count) => count + 9)}>もっと見る <span>＋9件</span></button>}
  </>;
}
