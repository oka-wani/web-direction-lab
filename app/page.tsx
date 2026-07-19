import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { guideSteps } from "./guide/guide-data";
import { columnItems } from "./column/column-data";
import { newsItems } from "./news/news-data";

const articles = [
  { category:"SEO", date:"2026.07.18", title:"titleタグとは？ SEOとクリック率を左右する基本", description:"検索結果で選ばれるタイトルの考え方を、実務で使える形に整理します。", href:"/articles/title-tag" },
  { category:"アクセス解析", date:"2026.07.17", title:"GA4で最初に見るべき5つの指標", description:"数字を眺めるだけで終わらせず、改善につなげる確認順を解説します。", href:"/articles/ga4-first-metrics" },
  { category:"Web制作", date:"2026.07.16", title:"成果につながるWebサイト改善の進め方", description:"課題発見から仮説、実装、検証までの流れを一つずつ確認します。", href:"/articles/site-improvement" },
];

const pillars = [
  { number:"01", label:"NEWS", title:"ニュース", text:"Web・AI・SEOなど、いま起きている変化を短時間でつかむ。", href:"/news", link:"最新情報を見る" },
  { number:"02", label:"KNOWLEDGE", title:"Webナレッジ", text:"基礎から実務まで、必要な知識を順番に学び、調べる。", href:"/knowledge", link:"体系的に学ぶ" },
  { number:"03", label:"COLUMN", title:"コラム", text:"比較・検証・試行錯誤から、Webの仕事に役立つ視点を得る。", href:"/column", link:"考え方を読む" },
];

export default function Home() {
  return <main>
    <SiteHeader />
    <section className="hero home-hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">LEARN · THINK · APPLY</p>
        <h1>Webを学び、考え、<br /><span>仕事で使える知識</span>に。</h1>
        <p className="lead">Webディレクター・Webコンサルを目指す人へ。<br className="desktop" />最新情報、体系的な知識、実践から得た視点を一つにつなげます。</p>
        <div className="hero-actions">
          <a className="button button--primary" href="/knowledge">Webナレッジで学ぶ <b>→</b></a>
          <a className="button button--secondary" href="/news">最新ニュースを見る <b>→</b></a>
        </div>
      </div>
      <div className="hero-art" aria-label="知識を整理し改善につなげるイラスト" role="img">
        <div className="art-grid" /><div className="donut" />
        <div className="chart-bars"><i /><i /><i /><i /><i /></div>
        <div className="growth-line"><i /><i /><i /><i /></div>
        <div className="art-panel"><span>WEB KNOWLEDGE</span><b>知る・学ぶ・考える</b><i /></div>
        <div className="dot-field">••••••<br />••••••<br />••••••</div>
      </div>
    </section>

    <section className="section home-pillars">
      <div className="section-heading"><div><p className="section-kicker">THREE CONTENTS</p><h2>3つの入口</h2></div><p>目的に合わせて、読み方を選べます。</p></div>
      <div className="pillar-grid">{pillars.map((item) => <a className="content-pillar" href={item.href} key={item.number}><span>{item.number}</span><small>{item.label}</small><h2>{item.title}</h2><p>{item.text}</p><b>{item.link} →</b></a>)}</div>
    </section>

    <section className="section knowledge-roadmap-home">
      <div className="section-heading"><div><p className="section-kicker">LEARNING ROADMAP</p><h2>Webを順番に学ぶ</h2></div><a href="/knowledge">Webナレッジを見る <span>→</span></a></div>
      <p className="section-lead">用語をばらばらに覚えるのではなく、Webの仕組みから制作・公開・集客・改善・提案までをつなげます。</p>
      <div className="roadmap-link-grid">{guideSteps.map((step) => <a href={`/knowledge/${step.slug}`} key={step.slug}><span>{step.number}</span><div><b>{step.title}</b><small>{step.description}</small></div><i>→</i></a>)}</div>
    </section>

    <section className="section latest">
      <div className="section-heading"><div><p className="section-kicker">LATEST KNOWLEDGE</p><h2>最新のWebナレッジ</h2></div><a href="/knowledge#articles">すべて見る <span>→</span></a></div>
      <div className="home-knowledge-list">{articles.map((article) => <article key={article.title}><div><span>{article.category}</span><time>{article.date}</time></div><h3><a href={article.href}>{article.title}</a></h3><p>{article.description}</p><a className="text-link" href={article.href}>この記事を読む <span>→</span></a></article>)}</div>
    </section>

    <section className="section home-news">
      <div className="section-heading"><div><p className="section-kicker">NEWS</p><h2>押さえておきたい変化</h2></div><a href="/news">ニュースをすべて見る <span>→</span></a></div>
      <div className="home-news-grid">{newsItems.slice(0, 4).map((item) => <article className="home-news-card" key={item.slug}><div><span>{item.category}</span><time>{item.date}</time></div><h3><a href={`/news/${item.slug}`}>{item.title}</a></h3><p>{item.summary}</p><a className="text-link" href={`/news/${item.slug}`}>要点を読む <span>→</span></a></article>)}</div>
    </section>

    <section className="section home-column">
      <div className="section-heading"><div><p className="section-kicker">COLUMN</p><h2>考え方と試行錯誤</h2></div><a href="/column">コラムをすべて見る <span>→</span></a></div>
      <div className="home-column-list">{columnItems.map((item) => <a href={`/column/${item.slug}`} key={item.slug}><div><span>{item.category}</span><time>{item.date}</time></div><h3>{item.title}</h3><p>{item.summary}</p><b>続きを読む →</b></a>)}</div>
    </section>

    <section className="about"><p className="section-kicker">ABOUT THIS LAB</p><h2>知識を集めるだけでなく、使える形へ。</h2><p>ニュースで変化を知り、Webナレッジで仕組みを学び、コラムで判断や試行錯誤に触れる。Webの仕事に必要な知識を、一つの流れとして整理する学習メディアです。</p></section>
    <SiteFooter />
  </main>;
}
