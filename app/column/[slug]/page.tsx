import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { columnItems, getColumn } from "../column-data";

export function generateStaticParams() { return columnItems.map((item) => ({ slug:item.slug })); }
export async function generateMetadata({ params }: { params:Promise<{slug:string}> }):Promise<Metadata> { const item=getColumn((await params).slug); return item ? {title:`${item.title}｜コラム`,description:item.summary}:{}; }

export default async function ColumnDetail({ params }: { params:Promise<{slug:string}> }) {
  const item=getColumn((await params).slug); if(!item) notFound();
  return <main className="column-page"><SiteHeader current="column" /><article className="column-detail"><p className="breadcrumb"><a href="/">トップ</a> / <a href="/column">コラム</a> / {item.category}</p><header className="column-detail-mv" style={{ backgroundImage:`linear-gradient(90deg,rgba(6,23,46,.94),rgba(6,23,46,.68) 55%,rgba(6,23,46,.08)),url(${item.image})` }}><div><div className="column-detail-meta"><span>{item.category}</span><time>{item.date}</time></div><p className="column-detail-hook">{item.videoHook}</p><h1>{item.title}</h1><p>{item.lead}</p></div></header><div className="column-detail-body">{item.sections.map((section,index)=><section key={section.title}><small>{String(index+1).padStart(2,"0")}</small><h2>{section.title}</h2><p>{section.body}</p></section>)}<div className="column-back"><a className="button button--secondary" href="/column">← コラム一覧へ戻る</a></div></div></article><SiteFooter /></main>;
}
