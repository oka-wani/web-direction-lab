import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { articleItems } from "./articles/article-data";
import { columnItems } from "./column/column-data";
import { newsItems } from "./news/news-data";
import { services, tools } from "./platform-data";

export default function Home() {
  return <main>
    <SiteHeader />
    <section className="simple-home-hero">
      <div>
        <p className="eyebrow">WEB DIRECTION LAB</p>
        <h1>Webの課題を、<br /><span>知識と実行</span>で解決する。</h1>
        <p>Web制作・SEO・AI・業務改善の情報を分かりやすく届け、必要に応じてサイトの診断・改善・制作まで支援します。</p>
        <div className="hero-actions"><a className="button button--primary" href="/knowledge">ナレッジを見る <b>→</b></a><a className="button button--secondary" href="/services">サービスを見る <b>→</b></a></div>
      </div>
    </section>

    <section className="simple-home-section simple-home-offer">
      <header><div><span>SERVICE</span><h2>サービス・料金・ツール</h2></div><p>相談したい方も、自分で改善したい方も。必要なものを一つのページにまとめています。</p><a href="/services">すべて見る →</a></header>
      <div className="simple-offer-grid">
        {services.slice(0, 3).map((service) => <a href={`/services/${service.slug}`} key={service.slug}><small>{service.label}</small><h3>{service.title}</h3><p>{service.summary}</p><b>{service.price}</b><span>詳しく見る →</span></a>)}
        <a className="simple-tool-card" href="/services#tools"><small>TOOLS</small><h3>ツール・テンプレート</h3><p>{tools[0].title}など、Web業務を助ける機能を順次公開します。</p><b>{tools.length}件を準備中</b><span>ツールを見る →</span></a>
      </div>
    </section>

    <section className="simple-home-section simple-home-knowledge">
      <header><div><span>KNOWLEDGE</span><h2>ナレッジ</h2></div><p>Web制作や運用で必要になる知識を、実務で使える形で解説します。</p><a href="/knowledge">すべて見る →</a></header>
      <div className="simple-content-list">{articleItems.slice(0, 3).map((item) => <a href={`/articles/${item.slug}`} key={item.slug}><div><span>{item.category}</span><time>{item.date}</time></div><h3>{item.title}</h3><p>{item.description}</p><b>→</b></a>)}</div>
    </section>

    <section className="simple-home-section">
      <header><div><span>COLUMN</span><h2>コラム</h2></div><p>Web担当者の仕事、AI活用、業務改善について、実践の視点で考えます。</p><a href="/column">すべて見る →</a></header>
      <div className="simple-column-grid">{columnItems.slice(0, 3).map((item) => <a href={`/column/${item.slug}`} key={item.slug}><div style={{ backgroundImage: `url(${item.image})` }} /><small>{item.category}　{item.date}</small><h3>{item.title}</h3><p>{item.summary}</p><b>読む →</b></a>)}</div>
    </section>

    <section className="simple-home-section simple-home-news">
      <header><div><span>NEWS</span><h2>ニュース</h2></div><p>Web・SEO・AIの変化を、実務への影響と一緒に整理します。</p><a href="/news">すべて見る →</a></header>
      <div className="simple-news-list">{newsItems.slice(0, 3).map((item) => <a href={`/news/${item.slug}`} key={item.slug}><time>{item.date}</time><span>{item.category}</span><h3>{item.title}</h3><b>→</b></a>)}</div>
    </section>

    <section className="home-final-cta"><span>CONTACT</span><h2>Webサイトの悩みを、<br />一緒に整理しませんか。</h2><p>依頼内容がまだ決まっていなくても大丈夫です。現在の課題から必要な対応を考えます。</p><div className="hero-actions"><a className="button button--primary" href="/contact">お問い合わせ <b>→</b></a><a className="button button--secondary" href="/services">サービスを見る <b>→</b></a></div></section>
    <SiteFooter />
  </main>;
}
