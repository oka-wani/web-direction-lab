import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { newsItems } from "./news-data";

export const metadata: Metadata = { title: "ニュース｜Web Direction Lab", description: "Web、AI、SEO、マーケティング、セキュリティなどの最新情報を簡潔に整理します。" };

export default function NewsPage() {
  return <main className="archive-page"><SiteHeader current="news" /><section className="archive-hero news-hero"><p className="section-kicker">NEWS</p><h1>ニュース</h1><p>Web・AI・SEO・マーケティングなどの最新情報を、重要なポイントと実務への影響に絞って整理します。</p></section><section className="archive-main"><p className="result-count"><b>{newsItems.length}</b> 件のニュース</p><div className="news-list">{newsItems.map((item) => <article className="news-list-item" key={item.slug}><div className="news-list-meta"><time>{item.date}</time><span>{item.category}</span></div><div className="news-list-body"><h2><a href={`/news/${item.slug}`}>{item.title}</a></h2><p>{item.summary}</p></div><a className="news-list-arrow" href={`/news/${item.slug}`} aria-label={`${item.title}を読む`}>→</a></article>)}</div></section><SiteFooter /></main>;
}
