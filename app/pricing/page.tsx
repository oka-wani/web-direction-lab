import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { services } from "../platform-data";

export const metadata: Metadata = { title: "料金｜Web Growth Lab", description: "Web Growth Labの簡易診断、改善提案、制作・運用支援の料金目安をご案内します。" };

export default function PricingPage() {
  return <main className="platform-page"><SiteHeader current="pricing" />
    <section className="platform-hero platform-hero--compact"><span className="section-kicker" aria-hidden="true">PRICING</span><h1>料金</h1><p>小さな相談から始められる入口を用意しています。対象範囲を確認し、作業前に料金をご提示します。</p></section>
    <section className="platform-section pricing-section"><div className="pricing-table" role="table" aria-label="サービス料金"><div className="pricing-row pricing-row--head" role="row"><span role="columnheader">サービス</span><span role="columnheader">料金の目安</span><span role="columnheader">期間の目安</span><span aria-hidden="true" /></div>{services.map((service) => <div className="pricing-row" role="row" key={service.slug}><div role="cell"><small>{service.label}</small><b>{service.title}</b></div><strong role="cell">{service.price}</strong><span role="cell">{service.period}</span><a href={`/services/${service.slug}`} aria-label={`${service.title}の詳細`}>→</a></div>)}</div><div className="pricing-notes"><h2>料金について</h2><ul><li>表示料金は初期の目安です。対象ページ数、調査範囲、制作内容によって変わります。</li><li>ご相談内容を確認した後、作業範囲と料金をご提示します。</li><li>外部サービス利用料、素材購入費などが必要な場合は事前にご案内します。</li></ul></div></section>
    <section className="platform-wide-band"><div><span className="section-kicker" aria-hidden="true">START SMALL</span><h2>まずは簡易診断から。</h2><p>大きな制作を始める前に、現在の課題と優先順位を整理できます。</p></div><a className="button button--primary" href="/services/website-diagnosis">簡易診断を見る <b>→</b></a></section>
    <SiteFooter />
  </main>;
}
