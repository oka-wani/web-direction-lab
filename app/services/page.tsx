import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { services, tools } from "../platform-data";

export const metadata: Metadata = {
  title: "サービス・ツール｜Web Growth Lab",
  description: "Webサイト診断・改善提案、SEO改善支援、小規模サイト・LP制作、運用支援、実務ツール・テンプレートをご案内します。",
};

export default function ServicesPage() {
  return <main className="platform-page"><SiteHeader current="services" />
    <section className="platform-hero platform-hero--services"><span className="section-kicker" aria-hidden="true">SERVICES &amp; TOOLS</span><h1>サービス・ツール</h1><p>Webサイトの診断・改善提案、SEO改善、小規模サイト・LP制作、運用支援と、日々の実務に使えるツールを目的に合わせて選べます。</p></section>
    <nav className="service-page-index" aria-label="ページ内メニュー"><a href="#service-menu"><span>01</span><b>支援サービス</b></a><a href="#tools"><span>02</span><b>ツール・テンプレート</b></a><a href="#contact"><span>03</span><b>相談する</b></a></nav>
    <section className="platform-section" id="service-menu"><div className="platform-section-heading"><span>SERVICE &amp; PRICE</span><h2>支援サービス</h2><p>検索流入を改善するSEO支援と、更新・進行を支える運用支援を分け、目的に合う対応範囲を明確にしています。</p></div><div className="service-grid">{services.map((service, index) => <article className="service-card" key={service.slug}><div><span>{String(index + 1).padStart(2, "0")}</span><small>{service.label}</small></div><h2><a href={`/services/${service.slug}`}>{service.title}</a></h2><p>{service.summary}</p><dl><div><dt>料金</dt><dd>{service.price}</dd></div><div><dt>期間</dt><dd>{service.period}</dd></div></dl><a className="text-link" href={`/services/${service.slug}`}>詳しく見る <span>→</span></a></article>)}</div></section>
    <section className="platform-section service-tools-section" id="tools"><div className="platform-section-heading"><span>TOOLS</span><h2>ツール・テンプレート</h2><p>Web担当者の確認作業や業務改善に使える機能を順次公開します。</p></div><div className="home-tool-grid">{tools.map((tool) => <article key={tool.title}><span>{tool.category}</span><em>{tool.type}</em><h3>{tool.title}</h3><p>{tool.summary}</p><b>{tool.status}</b></article>)}</div></section>
    <section className="platform-wide-band" id="contact"><div><span className="section-kicker" aria-hidden="true">CONTACT</span><h2>依頼内容が決まっていなくても大丈夫です。</h2><p>目的と今のお悩みを伺い、必要な対応と優先順位から整理します。</p></div><a className="button button--primary" href="/contact">まずは相談する <b>→</b></a></section>
    <SiteFooter />
  </main>;
}
