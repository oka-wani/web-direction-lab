import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { priceGroups } from "../platform-data";

export const metadata: Metadata = { title: "料金｜Web Growth Lab", description: "Web Growth Labの簡易診断、改善提案、制作・運用支援の料金目安をご案内します。" };

export default function PricingPage() {
  return <main className="platform-page"><SiteHeader current="pricing" />
    <section className="platform-hero platform-hero--compact"><span className="section-kicker" aria-hidden="true">PRICING</span><h1>料金の目安</h1><p>小さな診断や更新から、サイト制作、業務効率化ツールまで。依頼の規模を判断できる開始価格を掲載しています。</p><div className="hero-actions"><a className="button button--primary" href="/contact">予算に合う方法を相談する <b>→</b></a></div></section>
    <section className="platform-section pricing-section"><div className="price-group-grid">{priceGroups.map((group) => <section key={group.title}><h2>{group.title}</h2><div>{group.items.map((item) => <dl key={item.name}><dt>{item.name}</dt><dd>{item.price}</dd></dl>)}</div></section>)}</div><div className="pricing-notes"><h2>料金について</h2><ul><li>表示料金は初期の目安です。ページ数、機能、調査範囲、素材の準備状況によって変わります。</li><li>ご相談内容を確認した後、対応範囲、成果物、料金、スケジュールをご提示します。</li><li>外部サービス利用料、素材購入費、ドメインなどの実費が必要な場合は事前にご案内します。</li><li>合意前に作業を開始したり、追加料金が発生したりすることはありません。</li></ul></div></section>
    <section className="platform-wide-band"><div><span className="section-kicker" aria-hidden="true">START SMALL</span><h2>予算と優先順位に合わせて、小さく始められます。</h2><p>いきなり全面リニューアルを行わず、簡易診断や1ページ改善、スポット更新から始めることも可能です。</p></div><a className="button button--primary" href="/contact">今の悩みと予算を相談する <b>→</b></a></section>
    <SiteFooter />
  </main>;
}
