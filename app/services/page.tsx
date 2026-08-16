import type { Metadata } from "../astro-compat";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { priceGroups, services } from "../platform-data";

export const metadata: Metadata = {
  title: "サービス｜Wani san Web",
  description: "Wani san Webは、Web制作とWeb改善の2つを中心に提供します。小規模サイト制作は3万円〜、既存サイトの診断・改善も対応します。",
};

export default function ServicesPage() {
  return <main className="order-page"><SiteHeader current="services" />
    <section className="order-page-hero"><span>SERVICES</span><h1>作る。調べる。改善する。</h1><p>WSWのサービスは「Web制作」と「Web改善」の2本柱です。必要以上にメニューを増やさず、相談内容に合わせて必要な範囲を組み立てます。</p><div className="order-actions"><a className="order-primary-link" href="/contact">まず相談する <b>→</b></a><a className="order-secondary-link" href="#pricing">料金の目安を見る <b>↓</b></a></div></section>

    <section className="order-section">
      <div className="order-section-heading"><div><span>TWO SERVICES</span><h2>2つの入口から選べます。</h2></div><p>新しくサイトを作るならWeb制作。すでにサイトを持っていて課題を整理したいならWeb改善です。迷う場合は、相談内容からこちらで整理します。</p></div>
      <div className="order-service-grid">{services.map((service, index) => <article className="order-service-card" key={service.slug}><span className="order-number">0{index + 1}</span><small>{service.label}</small><h3>{service.title}</h3><p>{service.description}</p><ul>{service.deliverables.map((item) => <li key={item}>{item}</li>)}</ul><div><b>{service.price}</b><span> / {service.period}</span></div><a className="order-card-link" href={`/services/${service.slug}`}>サービス詳細を見る →</a></article>)}</div>
    </section>

    <section className="order-section order-section--tint" id="pricing">
      <div className="order-section-heading"><div><span>PRICING</span><h2>料金の目安</h2></div><p>最初から大きな契約にするのではなく、必要な範囲から始められる形を基本にします。正式な料金はヒアリング後、作業範囲と一緒にご提示します。</p></div>
      <div className="price-group-grid">{priceGroups.map((group) => <section key={group.title}><h3>{group.title}</h3><div>{group.items.map((item) => <dl key={item.name}><dt>{item.name}</dt><dd>{item.price}</dd></dl>)}</div></section>)}</div>
      <div className="pricing-notes"><h3>料金について</h3><ul><li>Web制作の3万円〜は小規模制作の入口価格です。ページ数、機能、CMS、フォーム、素材準備などにより変わります。</li><li>外部サービスの有料プランやドメイン等の実費が必要な場合は、事前にご案内します。</li><li>対応範囲、成果物、料金、スケジュールを確認いただいてから着手します。</li></ul></div>
    </section>

    <section className="order-section">
      <div className="order-detail-grid"><div><span className="order-kicker">STANDARDIZED PRODUCTION</span><h2>毎回ゼロから作らないから、品質を保ちながら制作時間を減らせます。</h2><p>Astro・GitHub・Cloudflareを基本構成とし、見出し、ボタン、カード、FAQ、フォームなどの共通モジュールを整備します。案件ごとに変えるのはデザインと必要な機能。構造・品質・基本挙動はできるだけ標準化します。</p><div className="order-actions"><a className="order-secondary-link" href="/quality">品質・技術について見る <b>→</b></a></div></div><dl className="order-definition-list"><div><dt>標準技術</dt><dd>Astro / GitHub / Cloudflare</dd></div><div><dt>必要に応じて追加</dt><dd>microCMS / GTM / GA4 / Search Console / Clarity / Looker Studio</dd></div><div><dt>制作方式</dt><dd>共通構造 × 案件ごとのデザイン</dd></div><div><dt>公開後</dt><dd>保守・更新・解析・SEO・Web改善へ継続可能</dd></div></dl></div>
    </section>

    <section className="order-final-cta"><span>CONTACT</span><h2>どちらのサービスか決まっていなくても大丈夫です。</h2><p>現在のサイトの有無、目的、予算、希望時期を伺い、Web制作とWeb改善のどちらから始めるべきか整理します。</p><div className="order-actions"><a className="order-primary-link" href="/contact">相談内容を送る <b>→</b></a><a className="order-secondary-link" href="/process">進め方を見る <b>→</b></a></div></section>
    <SiteFooter />
  </main>;
}
