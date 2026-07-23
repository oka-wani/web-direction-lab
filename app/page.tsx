import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { articleItems } from "./articles/article-data";
import { columnItems } from "./column/column-data";
import { newsItems } from "./news/news-data";
import { services } from "./platform-data";

function HeroPageLayer({ className = "" }: { className?: string }) {
  return <div className={`brand-page ${className}`}><span className="brand-page-bar"><i /><i /><i /></span><b /><em /><em /><div><i /><i /></div></div>;
}

function HeroBrandVisual() {
  return <div className="brand-visual brand-visual--layers simple-home-brand-visual" aria-hidden="true">
    <HeroPageLayer className="brand-page--back" />
    <HeroPageLayer className="brand-page--middle" />
    <HeroPageLayer className="brand-page--front" />
    <span className="brand-route brand-route--one" /><span className="brand-route brand-route--two" />
    <i className="brand-route-dot brand-route-dot--one" /><i className="brand-route-dot brand-route-dot--two" />
    <strong>WGL</strong><small>STRUCTURE / CONNECT / GROW</small>
  </div>;
}

export default function Home() {
  return <main>
    <SiteHeader />
    <section className="simple-home-hero simple-home-hero--white-grid">
      <div className="simple-home-hero-copy">
        <p className="eyebrow">WEB GROWTH LAB</p>
        <h1>Webの課題を、<br /><span>知識と実行</span>で解決する。</h1>
        <p>Web制作・SEO・AI・業務改善の情報を分かりやすく届け、必要に応じてサイトの診断・改善・制作まで支援します。</p>
        <div className="hero-actions"><a className="button button--primary" href="/knowledge">ナレッジを見る <b>→</b></a><a className="button button--navy" href="/services">サービスを見る <b>→</b></a></div>
      </div>
      <HeroBrandVisual />
    </section>

    <section className="simple-home-section simple-home-offer">
      <header><div><span>SERVICE &amp; TOOLS</span><h2>サービス・ツール</h2><p>診断、SEO、制作、運用を目的別に支援。実務に使えるツール・テンプレートも順次公開します。</p></div><a href="/services">すべて見る →</a></header>
      <div className="simple-offer-grid">
        {services.slice(0, 4).map((service) => <a href={`/services/${service.slug}`} key={service.slug}><small>{service.label}</small><h3>{service.title}</h3><p>{service.summary}</p><b>{service.price}</b><span>詳しく見る →</span></a>)}
      </div>
    </section>

    <section className="simple-home-section simple-home-knowledge">
      <header><div><span>KNOWLEDGE</span><h2>ナレッジ</h2><p>Web制作や運用で必要になる知識を、実務で使える形で解説します。</p></div><a href="/knowledge">すべて見る →</a></header>
      <div className="simple-knowledge-grid">{articleItems.slice(0, 3).map((item) => <a href={`/articles/${item.slug}`} key={item.slug}><span className="knowledge-category-badge">{item.category}</span><h3>{item.title}</h3><p>{item.description}</p><ul className="knowledge-term-tags" aria-label="記事内の用語集">{(item.tags ?? []).slice(0, 3).map((tag) => <li key={tag}>#{tag}</li>)}</ul><b className="card-read-link"><span>この記事を読む</span><i>→</i></b></a>)}</div>
    </section>

    <section className="simple-home-section">
      <header><div><span>COLUMN</span><h2>コラム</h2><p>仕事術とAI・効率化の気になる疑問を、動画でも伝わる切り口で掘り下げます。</p></div><a href="/column">すべて見る →</a></header>
      <div className="simple-column-grid">{columnItems.slice(0, 3).map((item) => <a href={`/column/${item.slug}`} key={item.slug}><div style={{ backgroundImage: `url(${item.image})` }} /><small>{item.category}　{item.date}</small><h3>{item.title}</h3><p>{item.summary}</p><b className="card-read-link"><span>読む</span><i>→</i></b></a>)}</div>
    </section>

    <section className="simple-home-section simple-home-news">
      <header><div><span>NEWS</span><h2>ニュース</h2><p>Web・SEO・AIの変化を、実務への影響と一緒に整理します。</p></div><a href="/news">すべて見る →</a></header>
      <div className="simple-news-list">{newsItems.slice(0, 3).map((item) => <a href={`/news/${item.slug}`} key={item.slug}><time>{item.date}</time><span>{item.category}</span><h3>{item.title}</h3><b>→</b></a>)}</div>
    </section>

    <section className="home-final-cta"><span>CONTACT</span><h2>Webサイトの悩みを、<br />一緒に整理しませんか。</h2><p>依頼内容がまだ決まっていなくても大丈夫です。現在の課題から必要な対応を考えます。</p><div className="hero-actions"><a className="button button--primary" href="/contact">お問い合わせ <b>→</b></a><a className="button button--navy" href="/services">サービスを見る <b>→</b></a></div></section>
    <SiteFooter />
  </main>;
}
