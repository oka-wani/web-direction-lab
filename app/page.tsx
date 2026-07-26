import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { columnItems } from "./column/column-data";
import { faqs, priceGroups, services } from "./platform-data";

function HeroPageLayer({ className = "" }: { className?: string }) {
  return <div className={`brand-page ${className}`}><span className="brand-page-bar"><i /><i /><i /></span><b /><em /><em /><div><i /><i /></div></div>;
}

function HeroBrandVisual() {
  return <div className="brand-visual brand-visual--layers simple-home-brand-visual" aria-hidden="true">
    <HeroPageLayer className="brand-page--back" />
    <HeroPageLayer className="brand-page--middle" />
    <HeroPageLayer className="brand-page--front" />
    <span className="brand-route brand-route--one" /><span className="brand-route brand-route--two" />
    <i className="brand-route-dot brand-route-dot--one" /><i className="brand-route-dot brand-route-dot--two" />
    <strong>WGL</strong><small>CREATE / IMPROVE / AUTOMATE</small>
  </div>;
}

const problems = [
  "Webサイトを作りたいが、何から始めればよいか分からない",
  "制作会社へ依頼するほどの予算はない",
  "今のサイトから問い合わせが来ない",
  "お知らせや実績を自分たちで更新したい",
  "公開後も更新や改善を手伝ってほしい",
  "日々の面倒な作業を自動化したい",
];

const features = [
  { title: "小規模な相談から対応", text: "大規模なリニューアルだけでなく、1ページ改善や簡易診断から相談できます。" },
  { title: "制作前の整理から支援", text: "掲載内容やサイト構成が決まっていなくても、必要な情報の整理から対応します。" },
  { title: "制作後も相談できる", text: "公開して終わりではなく、更新、改善、アクセス確認まで継続して支援します。" },
  { title: "Web以外の業務改善にも対応", text: "日々の作業を効率化する小規模ツールや自動化も相談できます。" },
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
        <p className="eyebrow">WEB GROWTH LAB</p>
        <h1>Webサイトと仕組みで、<br /><span>事業の課題</span>を小さく解決する。</h1>
        <p>小規模なWebサイト制作から、既存サイトの改善、更新代行、業務効率化ツールまで。必要なものを必要な規模で提案します。</p>
        <div className="hero-actions"><a className="button button--primary" href="/contact">Web制作について相談する <b>→</b></a><a className="button button--navy" href="/services">サービスを見る <b>→</b></a></div>
      </div>
      <HeroBrandVisual />
    </section>

    <section className="platform-section home-problems">
      <div className="platform-section-heading"><span>YOUR CONCERNS</span><h2>このようなお悩みはありませんか？</h2><p>依頼内容が固まっていなくても、現在の課題から必要な対応を整理します。</p></div>
      <ul>{problems.map((problem) => <li key={problem}>{problem}</li>)}</ul>
      <p><a className="text-link" href="/contact">悩みから相談する →</a></p>
    </section>

    <section className="platform-section home-services">
      <div className="platform-section-heading platform-section-heading--link"><div><span>SERVICES</span><h2>対応できること</h2><p>技術名ではなく、解決したい課題からサービスを選べます。</p></div><a href="/services">サービスを比較する →</a></div>
      <div className="home-service-grid">{services.map((service, index) => <a href={`/services/${service.slug}`} key={service.slug}><span>{String(index + 1).padStart(2, "0")}</span><small>{service.label}</small><h3>{service.title}</h3><p>{service.summary}</p><b>{service.price}</b><i>→</i></a>)}</div>
    </section>

    <section className="platform-section home-features">
      <div className="platform-section-heading"><span>WHY WGL</span><h2>小さく始めて、必要な分だけ育てる。</h2><p>制作前の整理から公開後の改善まで、事業と運用に無理のない進め方を大切にします。</p></div>
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
      <div className="platform-section-heading platform-section-heading--link"><div><span>COLUMN</span><h2>事業に役立つ新着コラム</h2><p>Web制作、改善、運用、SEO、業務効率化を、判断と実践につながる形で解説します。</p></div><a href="/column">コラムをすべて見る →</a></div>
      <div className="simple-column-grid">{columnItems.slice(0, 3).map((item) => <a href={`/column/${item.slug}`} key={item.slug}><div style={{ backgroundImage: `url(${item.image})` }} /><small>{item.category}　{item.date}</small><h3>{item.title}</h3><p>{item.summary}</p><b className="card-read-link"><span>続きを読む</span><i>→</i></b></a>)}</div>
    </section>

    <section className="platform-section home-faq">
      <div className="platform-section-heading platform-section-heading--link"><div><span>FAQ</span><h2>よくある質問</h2></div><a href="/faq">すべて見る →</a></div>
      <div className="faq-list">{faqs.slice(0, 5).map((faq, index) => <details key={faq.question} open={index === 0}><summary><span>Q</span>{faq.question}<i aria-hidden="true">＋</i></summary><div><span>A</span><p>{faq.answer}</p></div></details>)}</div>
    </section>

    <section className="home-final-cta"><span>CONTACT</span><h2>何を頼むべきか、<br />決まっていなくても大丈夫です。</h2><p>Webサイト、運用、業務効率化について、現在の課題と予算に合う方法から一緒に整理します。</p><div className="hero-actions"><a className="button button--primary" href="/contact">今の悩みを相談する <b>→</b></a><a className="button button--navy" href="/pricing">料金の目安を見る <b>→</b></a></div></section>
    <SiteFooter />
  </main>;
}
