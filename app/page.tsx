import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import HomeKnowledgeTabs from "./components/HomeKnowledgeTabs";
import { guideSteps } from "./guide/guide-data";
import { columnItems } from "./column/column-data";
import { newsItems } from "./news/news-data";

// Top page order: column, knowledge, basics, then current news.
export default function Home() {
  return <main>
    <SiteHeader />
    <section className="home-main-hero" id="top"><div><p className="eyebrow">LEARN · THINK · APPLY</p><h1>Webを学び、考え、<br /><span>仕事で使える知識</span>に。</h1><p>Webディレクター・Webコンサルを目指す人へ。最新情報、体系的な知識、実践から得た視点を一つにつなげます。</p><div className="hero-actions"><a className="button button--primary" href="/knowledge">Webナレッジで学ぶ <b>→</b></a><a className="button button--secondary" href="/news">最新ニュースを見る <b>→</b></a></div></div></section>

    <section className="section home-column home-column--latest"><div className="section-heading"><div><span className="section-kicker" aria-hidden="true">LATEST COLUMN</span><h2>最新コラム</h2></div><a href="/column">コラムをすべて見る <span>→</span></a></div><div className="column-card-grid column-card-grid--home">{columnItems.slice(0, 3).map((item) => <article className="column-card" key={item.slug}><a className="column-card-visual" href={`/column/${item.slug}`} style={{ backgroundImage:`url(${item.image})` }} aria-label={`${item.title}を読む`}><span>{item.category}</span></a><div className="column-card-body"><div><time>{item.date}</time><span>SHORT VIDEO</span></div><p className="column-card-hook">{item.videoHook}</p><h3><a href={`/column/${item.slug}`}>{item.title}</a></h3><p>{item.summary}</p><a className="text-link" href={`/column/${item.slug}`}>続きを読む <span>→</span></a></div></article>)}</div></section>

    <section className="section home-knowledge-section" id="knowledge"><div className="section-heading"><div><span className="section-kicker" aria-hidden="true">KNOWLEDGE</span><h2>ナレッジ</h2></div><a href="/knowledge#articles">ナレッジをすべて見る <span>→</span></a></div><HomeKnowledgeTabs /></section>

    <section className="section home-basics-section knowledge-paths--compact" id="basics"><div className="section-heading"><div><span className="section-kicker" aria-hidden="true">BASIC KNOWLEDGE</span><h2>基礎知識</h2></div></div><ol className="knowledge-path-grid home-knowledge-path-grid">{guideSteps.map((step) => <li key={step.slug}><a href={`/knowledge/${step.slug}`}><span>{step.number}</span><div><small>STEP {step.number}</small><h3>{step.title}</h3><p>{step.description}</p><em>{step.articles.length}テーマ</em></div><b>→</b></a></li>)}</ol></section>

    <section className="section home-news-section"><div className="section-heading"><div><span className="section-kicker" aria-hidden="true">NEWS</span><h2>ニュース</h2></div><a href="/news">ニュースをすべて見る <span>→</span></a></div><div className="news-list home-news-list">{newsItems.slice(0, 3).map((item) => <article className="news-list-item" key={item.slug}><div className="news-list-meta"><time>{item.date}</time><span>{item.category}</span></div><div className="news-list-body"><h3><a href={`/news/${item.slug}`}>{item.title}</a></h3></div><a className="news-list-arrow" href={`/news/${item.slug}`} aria-label={`${item.title}を読む`}>→</a></article>)}</div></section>
    <SiteFooter />
  </main>;
}
