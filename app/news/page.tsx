import type { Metadata } from "next";
import { newsItems } from "./news-data";

export const metadata: Metadata = { title: "Webニュース｜Web Direction Lab", description: "SEO、Web制作、AIに関する公式発表を、要点・影響・次のアクションに分けて短く解説します。" };

export default function NewsPage() {
  return <main className="archive-page">
    <header className="site-header"><a className="logo" href="/">Web Direction <span>Lab</span></a><nav aria-label="メインナビゲーション"><a href="/knowledge">ナレッジ</a><a href="/news" aria-current="page">Webニュース</a><a href="/roadmap">学習ロードマップ</a><a href="/#topics">カテゴリ</a></nav></header>
    <section className="archive-hero news-hero"><p className="section-kicker">WEB NEWS</p><h1>Webニュース</h1><p>変化の早いWeb業界の公式発表を、「何が変わるか」「何をすべきか」まで短く整理します。</p><div className="content-difference"><span><b>ナレッジ</b> 基礎をじっくり学ぶ</span><i>＋</i><span><b>Webニュース</b> 最新の変化をつかむ</span></div></section>
    <section className="archive-main"><p className="result-count"><b>{newsItems.length}</b> 件のニュース</p><div className="news-grid">{newsItems.map((item) => <article className="news-card" key={item.slug}><div className="news-card-top"><span>{item.category}</span><time>{item.date}</time></div><h2><a href={`/news/${item.slug}`}>{item.title}</a></h2><p>{item.summary}</p><dl><div><dt>IMPACT</dt><dd>{item.impact}</dd></div><div><dt>NEXT ACTION</dt><dd>{item.action}</dd></div></dl><a className="text-link" href={`/news/${item.slug}`}>3分で読む <span>→</span></a></article>)}</div></section>
    <footer><a className="logo" href="/">Web Direction <span>Lab</span></a><p>公式情報を、実務で使える判断材料に。</p><small>© 2026 Web Direction Lab</small></footer>
  </main>;
}
