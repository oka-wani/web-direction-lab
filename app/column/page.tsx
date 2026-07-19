import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { columnItems } from "./column-data";

export const metadata: Metadata = { title:"コラム｜Web Direction Lab", description:"Web制作、SEO、AI活用、学び方について、比較・検証・試行錯誤から得た視点をまとめます。" };

export default function ColumnPage() {
  return <main className="column-page"><SiteHeader current="column" /><section className="column-hero"><p className="section-kicker">COLUMN</p><h1>考え方と、<br />試行錯誤の記録。</h1><p>知識の解説だけでは伝わらない、比較したこと、試したこと、判断した理由をまとめます。</p></section><section className="column-index"><p className="result-count"><b>{columnItems.length}</b> 件のコラム</p><div className="column-list">{columnItems.map((item) => <article key={item.slug}><div><span>{item.category}</span><time>{item.date}</time></div><h2><a href={`/column/${item.slug}`}>{item.title}</a></h2><p>{item.summary}</p><a href={`/column/${item.slug}`} aria-label={`${item.title}を読む`}>続きを読む →</a></article>)}</div></section><SiteFooter /></main>;
}
