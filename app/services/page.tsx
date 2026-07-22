import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { services } from "../platform-data";

export const metadata: Metadata = {
  title: "サービス｜Web Direction Lab",
  description: "Webサイト簡易診断、改善提案、SEO、CMS、AI導入、制作・運用のご相談を承ります。",
};

export default function ServicesPage() {
  return <main className="platform-page"><SiteHeader current="services" />
    <section className="platform-hero platform-hero--services"><span className="section-kicker" aria-hidden="true">SERVICES</span><h1>作る前も、作った後も。<br />Webの課題を整理します。</h1><p>「何を改善すればよいか分からない」という段階から、診断・提案・制作・運用まで必要な範囲で支援します。</p><div className="hero-actions"><a className="button button--primary" href="/services/website-diagnosis">簡易診断を見る <b>→</b></a><a className="button button--secondary" href="/contact">相談する <b>→</b></a></div></section>
    <section className="platform-section"><div className="platform-section-heading"><span>SERVICE MENU</span><h2>提供サービス</h2><p>小さな診断から、継続的な運用支援まで。</p></div><div className="service-grid">{services.map((service, index) => <article className="service-card" key={service.slug}><div><span>{String(index + 1).padStart(2, "0")}</span><small>{service.label}</small></div><h2><a href={`/services/${service.slug}`}>{service.title}</a></h2><p>{service.summary}</p><dl><div><dt>料金</dt><dd>{service.price}</dd></div><div><dt>期間</dt><dd>{service.period}</dd></div></dl><a className="text-link" href={`/services/${service.slug}`}>詳しく見る <span>→</span></a></article>)}</div></section>
    <section className="platform-wide-band"><div><span className="section-kicker" aria-hidden="true">NOT SURE WHERE TO START?</span><h2>依頼内容が決まっていなくても大丈夫です。</h2><p>目的と今のお悩みを伺い、必要な対応と優先順位から整理します。</p></div><a className="button button--primary" href="/contact">まずは相談する <b>→</b></a></section>
    <SiteFooter />
  </main>;
}

