import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import HomeKnowledgeTabs from "./components/HomeKnowledgeTabs";
import { guideSteps } from "./guide/guide-data";
import { columnItems } from "./column/column-data";
import { newsItems } from "./news/news-data";

export default function Home() {
  return <main>
    <SiteHeader />
    <section className="home-main-hero" id="top"><div><p className="eyebrow">LEARN · THINK · APPLY</p><h1>Webを学び、考え、<br /><span>仕事で使える知識</span>に。</h1><p>Webディレクター・Webコンサルを目指す人へ。最新情報、体系的な知識、実践から得た視点を一つにつなげます。</p><div className="hero-actions"><a className="button button--primary" href="/knowledge">Webナレッジで学ぶ <b>→</b></a><a className="button button--secondary" href="/news">最新ニュースを見る <b>→</b></a></div></div></section>

    <section className="section home-column home-column--latest"><div className="section-heading"><div><p className="section-kicker">LATEST COLUMN</p><h2>最新コラム</h2></div><a href="/column">コラムをすべて見る <span>→</span></a></div><div className="home-column-list">{columnItems.slice(0, 3).map((item) => <a href={`/column/${item.slug}`} key={item.slug}><div><span>{item.category}</span><time>{item.date}</time></div><h3>{item.title}</h3><p>{item.summary}</p><b>続きを読む →</b></a>)}</div></section>

    <section className="section home-knowledge-section" id="knowledge"><div className="section-heading"><div><p className="section-kicker">KNOWLEDGE</p><h2>ナレッジ</h2></div><a href="/knowledge#articles">ナレッジをすべて見る <span>→</span></a></div><p className="section-lead">実務で確認したいテーマをカテゴリで切り替え、最新3件を確認できます。</p><HomeKnowledgeTabs /></section>

    <section className="section home-basics-section" id="basics"><div className="section-heading"><div><p className="section-kicker">BASIC KNOWLEDGE</p><h2>基礎知識</h2></div><a href="/knowledge#basics">基礎知識をすべて見る <span>→</span></a></div><p className="section-lead">Webの仕組みから制作・公開・集客・改善まで、必要な知識を順番に学びます。</p><div className="roadmap-link-grid">{guideSteps.map((step) => <a href={`/knowledge/${step.slug}`} key={step.slug}><span>{step.number}</span><div><b>{step.title}</b><small>{step.description}</small></div><i>→</i></a>)}</div></section>

    <section className="section home-news-section"><div className="section-heading"><div><p className="section-kicker">NEWS</p><h2>ニュース</h2></div><a href="/news">ニュースをすべて見る <span>→</span></a></div><div className="home-news-vertical">{newsItems.slice(0, 3).map((item) => <article key={item.slug}><div><time>{item.date}</time><span>{item.category}</span></div><h3><a href={`/news/${item.slug}`}>{item.title}</a></h3><p>{item.summary}</p><a href={`/news/${item.slug}`} aria-label={`${item.title}を読む`}>→</a></article>)}</div></section>
    <SiteFooter />
  </main>;
}
