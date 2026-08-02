import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { priceGroups, serviceGroups, services } from "../platform-data";

export const metadata: Metadata = {
  title: "サービス｜Wani san Web",
  description: "Webサイト制作・運用、SEO・LLMO、Instagram・Web広告、AI活用・業務自動化を支援します。",
};

export default function ServicesPage() {
  return <main className="platform-page"><SiteHeader current="services" />
    <section className="platform-hero platform-hero--services"><span className="section-kicker" aria-hidden="true">SERVICES</span><h1>集客を増やす。<br />業務を改善する。</h1><p>Webマーケティングで売上を、AI・自動化で利益を増やす。小さな会社に必要な支援を、必要な規模から提供します。</p><div className="hero-actions"><a className="button button--primary" href="/contact">無料で相談する <b>→</b></a><a className="button button--secondary" href="#pricing">料金の目安を見る <b>↓</b></a></div></section>
    <nav className="service-page-index" aria-label="ページ内メニュー"><a href="#concerns"><span>01</span><b>相談内容</b></a><a href="#service-menu"><span>02</span><b>サービス一覧</b></a><a href="#pricing"><span>03</span><b>料金の目安</b></a><a href="#contact"><span>04</span><b>相談する</b></a></nav>
    <section className="platform-section service-concerns" id="concerns"><div className="platform-section-heading"><span>CHOOSE BY CONCERN</span><h2>このような相談に対応します</h2></div><ul><li>初めてのWebサイト制作</li><li>問い合わせが少ないサイトの改善</li><li>SEO・LLMOへの対応</li><li>Instagram・広告の活用</li><li>公開後の更新・集客支援</li><li>AI・自動化による業務改善</li></ul></section>
    <section className="platform-section" id="service-menu"><div className="platform-section-heading"><span>SERVICE &amp; PRICE</span><h2>サービス一覧</h2><p>必要以上に複雑な仕組みを前提にせず、目的、予算、運用体制に合わせて対応範囲を決めます。</p></div>{serviceGroups.map((group) => <section className="service-group" key={group.title}><header><small>{group.title === "Webマーケティング" ? "WEB MARKETING" : "AI & BUSINESS IMPROVEMENT"}</small><h2>{group.title}</h2><p><b>{group.copy}</b>。{group.description}</p></header><div className="service-grid">{services.filter((service) => service.group === group.title).map((service, index) => <article className="service-card" key={service.slug}><div><span>{String(index + 1).padStart(2, "0")}</span><small>{service.label}</small></div><h2><a href={`/services/${service.slug}`}>{service.title}</a></h2><p>{service.summary}</p><dl><div><dt>料金</dt><dd>{service.price}</dd></div><div><dt>期間</dt><dd>{service.period}</dd></div></dl><a className="text-link" href={`/services/${service.slug}`}>対応内容を見る <span>→</span></a></article>)}</div></section>)}</section>
    <section className="platform-section pricing-section services-pricing" id="pricing"><div className="platform-section-heading"><span>PRICING</span><h2>料金の目安</h2><p>小さな更新や診断から、制作・継続支援まで。内容と予算に合わせて必要な範囲を組み立てます。</p></div><div className="price-group-grid">{priceGroups.map((group) => <section key={group.title}><h3>{group.title}</h3><div>{group.items.map((item) => <dl key={item.name}><dt>{item.name}</dt><dd>{item.price}</dd></dl>)}</div></section>)}</div><div className="pricing-notes"><h3>料金について</h3><ul><li>表示料金は初期の目安です。ページ数、機能、調査範囲、素材の準備状況によって変わります。</li><li>対応範囲、成果物、料金、スケジュールを事前に提示し、合意後に着手します。</li><li>外部サービス利用料などの実費が必要な場合は、事前にご案内します。</li></ul></div></section>
    <section className="platform-note"><div><span className="section-kicker" aria-hidden="true">CLEAR PROCESS</span><h2>集客の入口から、日々の業務まで。</h2></div><p>相談内容が決まっていなくても、ヒアリングをもとに課題と必要な範囲を整理します。<br /><a className="text-link" href="/process">制作・支援の流れを見る →</a></p></section>
    <section className="platform-wide-band" id="contact"><div><span className="section-kicker" aria-hidden="true">CONTACT</span><h2>どのサービスか迷ったら、悩みをそのままお送りください。</h2><p>現在の状況と実現したいことを伺い、必要な対応と優先順位から整理します。</p></div><a className="button button--primary" href="/contact">今の悩みを相談する <b>→</b></a></section>
    <SiteFooter />
  </main>;
}
