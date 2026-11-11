import type { Metadata } from "../../astro-compat";
import { notFound } from "../../astro-compat";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import ServiceCta from "../../components/ServiceCta";
import { columnItems, getColumn } from "../column-data";

export function generateStaticParams() { return columnItems.map((item) => ({ slug:item.slug })); }
export async function generateMetadata({ params }: { params:Promise<{slug:string}> }):Promise<Metadata> { const item=getColumn((await params).slug); return item ? {title:`${item.title}｜コラム`,description:item.summary}:{}; }

export default function ColumnDetail({ slug }: { slug:string }) {
  const item=getColumn(slug); if(!item) notFound();
  return <main className="column-page"><SiteHeader current="column" /><article className="column-detail" data-article-slug={item.slug} data-article-category={item.category}><p className="breadcrumb"><a href="/">トップ</a> / <a href="/column">コラム</a> / {item.category}</p><header className="column-detail-mv" style={{ backgroundImage:`linear-gradient(90deg,rgba(6,23,46,.94),rgba(6,23,46,.68) 55%,rgba(6,23,46,.08)),url(${item.image})` }}><div><div className="column-detail-meta"><span>{item.category}</span><time dateTime={item.date.replaceAll('.', '-')}>{item.date}</time></div><p className="column-detail-hook">{item.videoHook}</p><h1>{item.title}</h1><p>{item.lead}</p></div></header><div className="column-detail-body">{item.sections.map((section,index)=><section key={section.title}><small>{String(index+1).padStart(2,"0")}</small><h2>{section.title}</h2><p style={{whiteSpace:"pre-line"}}>{section.body}</p></section>)}{item.sources && <section aria-labelledby="article-sources"><h2 id="article-sources">参考情報</h2><ul>{item.sources.map(source => <li key={source.url}><a href={source.url} rel="noopener noreferrer" target="_blank">{source.name}</a></li>)}</ul></section>}{item.generatedBy && <p className="article-disclosure">この記事は公開情報を参照し、AIを用いて作成しています。個別の事情や最新の仕様は、参考情報とあわせてご確認ください。</p>}<ServiceCta category={item.category} title={item.title} compact /><div className="column-back"><a className="button button--secondary" href="/column">← コラム一覧へ戻る</a></div></div></article><SiteFooter /></main>;
}
