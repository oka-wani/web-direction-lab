import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { columnItems } from "./column-data";

export const metadata: Metadata = { title:"コラム｜Web Direction Lab", description:"Web制作、SEO、AI活用、学び方について、仕事で使える視点を短い動画にも展開しやすい形でまとめます。" };

export default function ColumnPage() {
  return <main className="column-page"><SiteHeader current="column" /><section className="column-hero"><p className="section-kicker">COLUMN</p><h1>考え方と、<br />試行錯誤の記録。</h1><p>知識を「知っている」で終わらせず、仕事の判断と行動へ変えるための視点をまとめます。</p></section><section className="column-index"><p className="result-count"><b>{columnItems.length}</b> 件のコラム</p><div className="column-card-grid">{columnItems.map((item) => <article className="column-card" key={item.slug}><a className="column-card-visual" href={`/column/${item.slug}`} style={{ backgroundImage:`url(${item.image})` }} aria-label={`${item.title}を読む`}><span>{item.category}</span></a><div className="column-card-body"><div><time>{item.date}</time><span>SHORT VIDEO</span></div><p className="column-card-hook">{item.videoHook}</p><h2><a href={`/column/${item.slug}`}>{item.title}</a></h2><p>{item.summary}</p><a className="text-link" href={`/column/${item.slug}`}>続きを読む <span>→</span></a></div></article>)}</div></section><SiteFooter /></main>;
}
