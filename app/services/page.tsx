import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { priceGroups, serviceGroups, services } from "../platform-data";

export const metadata: Metadata = {
  title: "サービス｜Wani san Web",
  description: "Webサイト制作・運用、SEO・LLMO、Instagram・Web広告、AI活用・業務自動化を、課題に合わせて支援します。",
};

const servicePaths = [
  {
    number: "01",
    label: "WEB SITE",
    title: "サイトを作る・改善する",
    text: "新規制作、リニューアル、更新、問い合わせ導線の改善。",
    links: [
      { title: "Webサイト制作・改善", href: "/services/web-production" },
      { title: "Webサイト運用", href: "/services/web-operation" },
    ],
  },
  {
    number: "02",
    label: "ATTRACT",
    title: "集客を増やす",
    text: "SEO、AI検索、Instagram、Web広告をサイトの成果へつなげる。",
    links: [
      { title: "SEO・アクセス解析", href: "/services/seo-support" },
      { title: "集客サービスを比較", href: "#service-menu" },
    ],
  },
  {
    number: "03",
    label: "IMPROVE",
    title: "業務を軽くする",
    text: "AI活用や自動化で、繰り返し作業と入力ミスを減らす。",
    links: [
      { title: "AI活用・業務改善", href: "/services/ai-business-improvement" },
      { title: "自動化ツール開発", href: "/services/automation-tools" },
    ],
  },
] as const;

export default function ServicesPage() {
  return <main className="platform-page services-page"><SiteHeader current="services" />
    <section className="platform-hero platform-hero--services"><span className="section-kicker" aria-hidden="true">SERVICES</span><h1>悩みから選べる、<br />Webと業務改善の支援。</h1><p>サービス名を決めてから相談する必要はありません。「サイトを作りたい」「集客を増やしたい」「作業を減らしたい」のどこからでも始められます。</p><div className="hero-actions"><a className="button button--primary" href="#choose">悩みから選ぶ <b>↓</b></a><a className="button button--secondary" href="/contact">相談する <b>→</b></a></div></section>

    <nav className="service-page-index" aria-label="ページ内メニュー"><a href="#choose"><span>01</span><b>悩みから選ぶ</b></a><a href="#service-menu"><span>02</span><b>サービスを比較</b></a><a href="#pricing"><span>03</span><b>料金の目安</b></a><a href="#contact"><span>04</span><b>相談する</b></a></nav>

    <section className="platform-section service-chooser" id="choose"><div className="platform-section-heading"><span>CHOOSE BY PURPOSE</span><h2>いま一番近い悩みを選ぶ</h2><p>複数に当てはまっても問題ありません。相談後に優先順位を整理します。</p></div><div className="service-choice-grid">{servicePaths.map((path) => <article key={path.title}><div><span>{path.number}</span><small>{path.label}</small></div><h3>{path.title}</h3><p>{path.text}</p><ul>{path.links.map((link) => <li key={link.href}><a href={link.href}>{link.title}<span>→</span></a></li>)}</ul></article>)}</div></section>

    <section className="platform-section service-comparison" id="service-menu"><div className="platform-section-heading"><span>ALL SERVICES</span><h2>対応内容と料金を比較する</h2><p>必要以上に複雑な仕組みを前提にせず、目的、予算、運用体制に合わせて対応範囲を決めます。</p></div>{serviceGroups.map((group) => <section className="service-group" key={group.title}><header><small>{group.title === "Webマーケティング" ? "WEB MARKETING" : "AI & BUSINESS IMPROVEMENT"}</small><h2>{group.title}</h2><p><b>{group.copy}</b>。{group.description}</p></header><div className="service-grid">{services.filter((service) => service.group === group.title).map((service, index) => <article className="service-card" key={service.slug}><div><span>{String(index + 1).padStart(2, "0")}</span><small>{service.label}</small></div><h3><a href={`/services/${service.slug}`}>{service.title}</a></h3><p>{service.summary}</p><dl><div><dt>料金</dt><dd>{service.price}</dd></div><div><dt>期間</dt><dd>{service.period}</dd></div></dl><a className="text-link" href={`/services/${service.slug}`}>対応内容を見る <span>→</span></a></article>)}</div></section>)}</section>

    <section className="platform-section pricing-section services-pricing" id="pricing"><div className="platform-section-heading"><span>PRICING</span><h2>料金の目安</h2><p>小さな更新や診断から、制作・継続支援まで。内容と予算に合わせて必要な範囲を組み立てます。</p></div><div className="price-group-grid">{priceGroups.map((group) => <section key={group.title}><h3>{group.title}</h3><div>{group.items.map((item) => <dl key={item.name}><dt>{item.name}</dt><dd>{item.price}</dd></dl>)}</div></section>)}</div><div className="pricing-notes"><h3>料金について</h3><ul><li>表示料金は初期の目安です。ページ数、機能、調査範囲、素材の準備状況によって変わります。</li><li>対応範囲、成果物、料金、スケジュールを事前に提示し、合意後に着手します。</li><li>外部サービス利用料などの実費が必要な場合は、事前にご案内します。</li></ul></div></section>

    <section className="platform-wide-band service-contact-band" id="contact"><div><span className="section-kicker" aria-hidden="true">CONTACT</span><h2>どれを選ぶか迷ったら、悩みをそのままお送りください。</h2><p>現在の状況と実現したいことを伺い、必要な対応と優先順位から整理します。</p></div><a className="button button--primary" href="/contact">今の悩みを相談する <b>→</b></a></section>
    <SiteFooter />
  </main>;
}
