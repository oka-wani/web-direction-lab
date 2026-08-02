import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { BrandLogo, WaniMark } from "./components/BrandLogo";
import { columnItems } from "./column/column-data";
import { faqs, priceGroups, serviceGroups, services } from "./platform-data";

function HeroBrandVisual() {
  return <div className="wsw-hero-visual" aria-hidden="true">
    <span className="wsw-hero-orbit wsw-hero-orbit--one" /><span className="wsw-hero-orbit wsw-hero-orbit--two" />
    <div className="wsw-hero-mark"><WaniMark /></div>
    <div className="wsw-hero-card wsw-hero-card--marketing"><small>WEB MARKETING</small><b>集客と売上を増やす</b></div>
    <div className="wsw-hero-card wsw-hero-card--dx"><small>AI &amp; DX</small><b>効率化して利益を増やす</b></div>
    <strong>WSW</strong>
  </div>;
}

const problems = [
  "Webサイトを作りたいが、何から始めればよいか分からない",
  "Web担当者がおらず、何から始めるべきか分からない",
  "今のサイトから問い合わせが来ない",
  "SEO・SNS・広告をどう組み合わせるべきか分からない",
  "公開後の更新や集客もまとめて相談したい",
  "日々の面倒な作業を自動化したい",
];

const features = [
  { title: "小規模な相談から対応", text: "大規模なリニューアルだけでなく、1ページ改善や簡易診断から相談できます。" },
  { title: "制作前の整理から支援", text: "掲載内容やサイト構成が決まっていなくても、必要な情報の整理から対応します。" },
  { title: "制作後も相談できる", text: "公開して終わりではなく、更新、改善、アクセス確認まで継続して支援します。" },
  { title: "集客と業務改善を一緒に考える", text: "WebマーケティングとAI・自動化を分けず、売上と利益の両面から支援します。" },
  { title: "必要以上に複雑にしない", text: "予算と運用体制に合わせて、必要な機能だけを提案します。" },
];

const steps = [
  { title: "お問い合わせ", text: "悩みや実現したいことを共有" },
  { title: "ヒアリング", text: "目的・予算・運用体制を整理" },
  { title: "ご提案", text: "範囲・料金・進め方を明確化" },
  { title: "制作・改善", text: "合意した内容を実行" },
  { title: "公開・運用", text: "確認後に公開し、必要に応じて支援" },
];

export default function Home() {
  return <main>
    <SiteHeader />
    <section className="simple-home-hero simple-home-hero--white-grid">
      <div className="simple-home-hero-copy">
        <p className="eyebrow">SMALL BUSINESS, SMART GROWTH.</p>
        <h1>小さな会社の、<br /><span>集客と業務</span>を改善する。</h1>
        <p>Webサイト、SEO、SNS、広告で売上を増やす。AIと自動化で無駄な作業を減らし、利益を増やす。Web担当者がいない会社の外部パートナーとして支援します。</p>
        <div className="hero-actions"><a className="button button--primary" href="/contact">無料で相談する <b>→</b></a><a className="button button--secondary" href="/services">サービスを見る <b>→</b></a></div>
        <BrandLogo className="hero-inline-brand" />
      </div>
      <HeroBrandVisual />
    </section>

    <section className="platform-section home-problems">
      <div className="platform-section-heading"><span>YOUR CONCERNS</span><h2>このようなお悩みはありませんか？</h2><p>依頼内容が固まっていなくても、現在の課題から必要な対応を整理します。</p></div>
      <ul>{problems.map((problem) => <li key={problem}>{problem}</li>)}</ul>
      <p><a className="text-link" href="/contact">悩みから相談する →</a></p>
    </section>

    <section className="platform-section home-services">
      <div className="platform-section-heading platform-section-heading--link"><div><span>SERVICES</span><h2>売上と利益を、2つの軸から支援します。</h2><p>目の前の悩みだけでなく、集客から日々の業務まで一つの相談先で整理できます。</p></div><a href="/services">サービスを比較する →</a></div>
      <div className="wsw-service-axes">{serviceGroups.map((group, index) => <article key={group.title}><span>0{index + 1}</span><small>{index === 0 ? "WEB MARKETING" : "AI & BUSINESS IMPROVEMENT"}</small><h3>{group.title}</h3><b>{group.copy}</b><p>{group.description}</p></article>)}</div>
      <div className="home-service-grid">{services.map((service, index) => <a href={`/services/${service.slug}`} key={service.slug}><span>{String(index + 1).padStart(2, "0")}</span><small>{service.group}</small><h3>{service.title}</h3><p>{service.summary}</p><b>{service.price}</b><i>→</i></a>)}</div>
    </section>

    <section className="platform-section home-features">
      <div className="platform-section-heading"><span>WHY WANI SAN WEB</span><h2>小さく始めて、必要な分だけ育てる。</h2><p>制作前の整理から公開後の集客・改善まで、事業と運用に無理のない進め方を大切にします。</p></div>
      <div className="home-feature-grid">{features.map((feature, index) => <article key={feature.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div>
    </section>

    <section className="platform-section home-process">
      <div className="platform-section-heading platform-section-heading--link"><div><span>PROCESS</span><h2>制作・支援の流れ</h2><p>最初から大きな制作を前提にせず、範囲と料金を確認してから進めます。</p></div><a href="/process">詳しい進め方を見る →</a></div>
      <ol>{steps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><b>{step.title}</b><small>{step.text}</small></li>)}</ol>
    </section>

    <section className="home-price-overview">
      <div className="platform-section">
        <div className="platform-section-heading platform-section-heading--link"><div><span>PRICE GUIDE</span><h2>料金の目安</h2><p>依頼の規模を判断しやすいよう、主なメニューの開始価格を掲載しています。</p></div><a href="/pricing">料金をすべて見る →</a></div>
        <div className="home-price-grid">{priceGroups.map((group) => <article key={group.title}><h3>{group.title}</h3>{group.items.slice(0, 2).map((item) => <dl key={item.name}><dt>{item.name}</dt><dd>{item.price}</dd></dl>)}</article>)}</div>
      </div>
    </section>

    <section className="platform-section home-cases-preview">
      <div className="platform-section-heading platform-section-heading--link"><div><span>CASE STUDIES</span><h2>制作・改善事例</h2><p>課題、判断、対応内容、結果が分かる形で順次掲載します。</p></div><a href="/cases">事例を見る →</a></div>
      <div className="case-preview-panel"><div><span>PREPARING</span><h3>公開できる事例を準備しています。</h3><p>守秘義務に配慮しながら、Webサイト制作・改善・ツール制作の考え方と成果を紹介します。</p></div><ol><li>課題</li><li>判断</li><li>改善</li><li>結果</li></ol></div>
    </section>

    <section className="platform-section home-column">
      <div className="platform-section-heading platform-section-heading--link"><div><span>COLUMN</span><h2>集客と業務改善の新着コラム</h2><p>社長や担当者が抱える具体的な悩みから、判断と実践につながる方法を解説します。</p></div><a href="/column">コラムをすべて見る →</a></div>
      <div className="simple-column-grid">{columnItems.slice(0, 3).map((item) => <a href={`/column/${item.slug}`} key={item.slug}><div style={{ backgroundImage: `url(${item.image})` }} /><small>{item.category}　{item.date}</small><h3>{item.title}</h3><p>{item.summary}</p><b className="card-read-link"><span>続きを読む</span><i>→</i></b></a>)}</div>
    </section>

    <section className="platform-section home-faq">
      <div className="platform-section-heading platform-section-heading--link"><div><span>FAQ</span><h2>よくある質問</h2></div><a href="/faq">すべて見る →</a></div>
      <div className="faq-list">{faqs.slice(0, 5).map((faq, index) => <details key={faq.question} open={index === 0}><summary><span>Q</span>{faq.question}<i aria-hidden="true">＋</i></summary><div><span>A</span><p>{faq.answer}</p></div></details>)}</div>
    </section>

    <section className="home-final-cta"><span>CONTACT</span><h2>集客と業務の悩みを、<br />まず一緒に整理しませんか。</h2><p>何を頼むべきか決まっていなくても大丈夫です。現在の課題と予算に合う、小さな一歩から提案します。</p><div className="hero-actions"><a className="button button--primary" href="/contact">無料で相談する <b>→</b></a><a className="button button--secondary" href="/pricing">料金の目安を見る <b>→</b></a></div></section>
    <SiteFooter />
  </main>;
}
