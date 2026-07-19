import type { Metadata } from "next";
import { newsItems } from "./news-data";

export const metadata: Metadata = { title: "ニュース｜Web Direction Lab", description: "Web、AI、SEO、マーケティング、セキュリティなどの最新情報を簡潔に整理します。" };

export default function NewsPage() {
  return <main className="archive-page">
    <header className="site-header"><a className="logo" href="/">Web Direction <span>Lab</span></a><nav aria-label="メインナビゲーション"><a href="/news" aria-current="page">ニュース</a><a href="/knowledge">ナレッジ</a><a href="/guide">Webガイド</a></nav></header>
    <section className="archive-hero news-hero"><p className="section-kicker">NEWS</p><h1>ニュース</h1><p>Web・AI・SEO・マーケティングなどの最新情報を、重要なポイントと実務への影響に絞って整理します。</p></section>
    <section className="archive-main"><p className="result-count"><b>{newsItems.length}</b> 件のニュース</p><div className="news-list">{newsItems.map((item) => <article className="news-list-item" key={item.slug}><div className="news-list-meta"><time>{item.date}</time><span>{item.category}</span></div><div className="news-list-body"><h2><a href={`/news/${item.slug}`}>{item.title}</a></h2><p>{item.summary}</p></div><a className="news-list-arrow" href={`/news/${item.slug}`} aria-label={`${item.title}を読む`}>→</a></article>)}</div></section>
    <footer><a className="logo" href="/">Web Direction <span>Lab</span></a><p>公式情報を、実務で使える判断材料に。</p><small>© 2026 Web Direction Lab</small></footer>
  </main>;
}
