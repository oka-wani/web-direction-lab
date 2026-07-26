import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { services } from "../platform-data";

export const metadata: Metadata = {
  title: "サービス｜Web Growth Lab",
  description: "小規模Webサイト制作、更新できるサイト制作、既存サイト改善、Web運用、業務効率化ツール、Web・AI活用相談をご案内します。",
};

export default function ServicesPage() {
  return <main className="platform-page"><SiteHeader current="services" />
    <section className="platform-hero platform-hero--services"><span className="section-kicker" aria-hidden="true">SERVICES</span><h1>悩みと必要な規模から選べるサービス</h1><p>Webサイトを新しく作る、今のサイトを改善する、公開後の運用を任せる、毎日の作業を自動化する。何を依頼すべきか分からない段階から相談できます。</p><div className="hero-actions"><a className="button button--primary" href="/contact">サービスについて相談する <b>→</b></a><a className="button button--secondary" href="/pricing">料金の目安を見る <b>→</b></a></div></section>
    <nav className="service-page-index" aria-label="ページ内メニュー"><a href="#concerns"><span>01</span><b>悩みから選ぶ</b></a><a href="#service-menu"><span>02</span><b>サービス一覧</b></a><a href="#contact"><span>03</span><b>相談する</b></a></nav>
    <section className="platform-section service-concerns" id="concerns"><div className="platform-section-heading"><span>CHOOSE BY CONCERN</span><h2>このような相談に対応します</h2></div><ul><li>初めてのWebサイト制作</li><li>自社更新できるサイトへの変更</li><li>問い合わせが少ないサイトの改善</li><li>公開後の更新・改善の外注</li><li>Excel・CSV・登録作業の自動化</li><li>Web・AI・IT活用の進め方整理</li></ul></section>
    <section className="platform-section" id="service-menu"><div className="platform-section-heading"><span>SERVICE &amp; PRICE</span><h2>サービス一覧</h2><p>必要以上に複雑な仕組みを前提にせず、目的、予算、運用体制に合わせて対応範囲を決めます。</p></div><div className="service-grid">{services.map((service, index) => <article className="service-card" key={service.slug}><div><span>{String(index + 1).padStart(2, "0")}</span><small>{service.label}</small></div><h2><a href={`/services/${service.slug}`}>{service.title}</a></h2><p>{service.summary}</p><dl><div><dt>料金</dt><dd>{service.price}</dd></div><div><dt>期間</dt><dd>{service.period}</dd></div></dl><a className="text-link" href={`/services/${service.slug}`}>対応内容を見る <span>→</span></a></article>)}</div></section>
    <section className="platform-note"><div><span className="section-kicker" aria-hidden="true">CLEAR PROCESS</span><h2>制作前の整理から、公開後の運用まで。</h2></div><p>掲載内容や仕様が決まっていなくても、ヒアリングをもとに必要な範囲を整理します。<br /><a className="text-link" href="/process">制作・支援の流れを見る →</a></p></section>
    <section className="platform-wide-band" id="contact"><div><span className="section-kicker" aria-hidden="true">CONTACT</span><h2>どのサービスか迷ったら、悩みをそのままお送りください。</h2><p>現在の状況と実現したいことを伺い、必要な対応と優先順位から整理します。</p></div><a className="button button--primary" href="/contact">今の悩みを相談する <b>→</b></a></section>
    <SiteFooter />
  </main>;
}
