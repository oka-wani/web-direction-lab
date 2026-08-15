import type { Metadata } from "../astro-compat";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { priceGroups, services } from "../platform-data";

export const metadata: Metadata = {
  title: "サービス｜Wani san Web",
  description: "Webサイト制作・運用、SEO・LLMO、Instagram・Web広告、AI活用・業務自動化を、課題に合わせて支援します。",
};

export default function ServicesPage() {
  return <main className="platform-page"><SiteHeader current="services" />
    <section className="platform-hero platform-hero--services"><span className="section-kicker" aria-hidden="true">SERVICES</span><h1>サービスは、<br />4つだけ。</h1><p>Web制作、SEO解析、SNS運用・広告、業務改善・ツール開発。悩みに合うものを、必要な範囲から提供します。</p><div className="hero-actions"><a className="button button--primary" href="/contact">無料で相談する <b>→</b></a><a className="button button--secondary" href="#service-menu">4つのサービスを見る <b>↓</b></a></div></section>
    <nav className="service-page-index" aria-label="ページ内メニュー"><a href="#concerns"><span>01</span><b>相談内容</b></a><a href="#service-menu"><span>02</span><b>サービス一覧</b></a><a href="#pricing"><span>03</span><b>料金の目安</b></a><a href="#contact"><span>04</span><b>相談する</b></a></nav>
    <section className="platform-section service-concerns" id="concerns"><div className="platform-section-heading"><span>CHOOSE BY CONCERN</span><h2>悩みから選ぶ</h2></div><ul><li>Webサイトをつくりたい・直したい</li><li>検索からの集客を増やしたい</li><li>SNSや広告を活用したい</li><li>手作業を減らし、仕事を効率化したい</li></ul></section>
    <section className="platform-section" id="service-menu"><div className="platform-section-heading"><span>FOUR SERVICES</span><h2>4つのサービス</h2><p>複雑なプランに分けず、相談内容に合わせて各サービスの対応範囲を調整します。</p></div><div className="service-grid service-grid--simple">{services.map((service, index) => <article className="service-card" key={service.slug}><div><span>{String(index + 1).padStart(2, "0")}</span><small>{service.label}</small></div><h2><a href={`/services/${service.slug}`}>{service.title}</a></h2><p>{service.summary}</p>{service.slug === "web-production" && <p className="service-option"><b>OPTION</b> 更新・保守・アクセス確認などの運用</p>}<dl><div><dt>料金</dt><dd>{service.price}</dd></div><div><dt>期間</dt><dd>{service.period}</dd></div></dl><a className="text-link" href={`/services/${service.slug}`}>詳しく見る <span>→</span></a></article>)}</div></section>
    <section className="platform-section pricing-section services-pricing" id="pricing"><div className="platform-section-heading"><span>PRICING</span><h2>料金の目安</h2><p>小さな更新や診断から、制作・継続支援まで。内容と予算に合わせて必要な範囲を組み立てます。</p></div><div className="price-group-grid">{priceGroups.map((group) => <section key={group.title}><h3>{group.title}</h3><div>{group.items.map((item) => <dl key={item.name}><dt>{item.name}</dt><dd>{item.price}</dd></dl>)}</div></section>)}</div><div className="pricing-notes"><h3>料金について</h3><ul><li>表示料金は初期の目安です。ページ数、機能、調査範囲、素材の準備状況によって変わります。</li><li>対応範囲、成果物、料金、スケジュールを事前に提示し、合意後に着手します。</li><li>外部サービス利用料などの実費が必要な場合は、事前にご案内します。</li></ul></div></section>
    <section className="platform-note"><div><span className="section-kicker" aria-hidden="true">CLEAR PROCESS</span><h2>相談 → 整理 → 提案 → 実行</h2></div><p>サービス名が決まっていなくても大丈夫です。悩みを伺い、必要な支援だけを整理します。<br /><a className="text-link" href="/process">詳しい流れを見る →</a></p></section>
    <section className="platform-wide-band" id="contact"><div><span className="section-kicker" aria-hidden="true">CONTACT</span><h2>どのサービスか迷ったら、悩みをそのままお送りください。</h2><p>現在の状況と実現したいことを伺い、必要な対応と優先順位から整理します。</p></div><a className="button button--primary" href="/contact">今の悩みを相談する <b>→</b></a></section>
    <SiteFooter />
  </main>;
}
