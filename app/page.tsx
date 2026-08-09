import { BrandLogo } from "./components/BrandLogo";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { columnItems } from "./column/column-data";
import { newsItems } from "./news/news-data";
import { faqs, serviceGroups, services } from "./platform-data";

const problems = [
  { label: "START", title: "Web活用の土台をつくる", text: "サイト制作、情報整理、計測環境まで、最初に必要なものを整理します。" },
  { label: "GROW", title: "集客を成果につなげる", text: "SEO・SNS・広告とサイト内の導線をつなぎ、問い合わせまで改善します。" },
  { label: "IMPROVE", title: "日々の業務を軽くする", text: "更新や集計などの手作業を見直し、AI・自動化を必要な範囲から導入します。" },
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
    <section className="wsw-minimal-hero">
      <div className="wsw-minimal-hero-inner">
        <BrandLogo />
        <p className="eyebrow">WEB. SIMPLE. WORK.</p>
        <h1>考える・動く・伝えるを、<br />もっとシンプルに。</h1>
        <p className="wsw-minimal-hero-lead">Web集客と日々の業務を、わかりやすく、無理のない形で。小さな会社の外部パートナーとして、一緒に整えます。</p>
        <a className="wsw-minimal-hero-link" href="/contact">無料で相談する <span aria-hidden="true">→</span></a>
      </div>
    </section>

    <section className="platform-section home-problems">
      <div className="home-problems-intro"><span>WHERE TO BEGIN</span><h2>いま必要なところから、<br />一緒に整える。</h2><p>依頼するサービスを先に決める必要はありません。現状と目標を伺い、優先順位と無理のない進め方を整理します。</p><a className="text-link" href="/contact">現在の状況を相談する →</a></div>
      <ol>{problems.map((problem, index) => <li key={problem.title}><span>{String(index + 1).padStart(2, "0")} / {problem.label}</span><h3>{problem.title}</h3><p>{problem.text}</p></li>)}</ol>
    </section>

    <section className="platform-section home-services">
      <div className="platform-section-heading platform-section-heading--link"><div><span>SERVICES</span><h2>売上と利益を、2つの軸から支援します。</h2><p>目の前の悩みだけでなく、集客から日々の業務まで一つの相談先で整理できます。</p></div><a href="/services">サービスを比較する →</a></div>
      <div className="wsw-service-axes">{serviceGroups.map((group, index) => <article key={group.title}><span>0{index + 1}</span><small>{index === 0 ? "WEB MARKETING" : "AI & BUSINESS IMPROVEMENT"}</small><h3>{group.title}</h3><b>{group.copy}</b><p>{group.description}</p></article>)}</div>
      <div className="home-service-grid">{services.map((service, index) => <a href={`/services/${service.slug}`} key={service.slug}><span>{String(index + 1).padStart(2, "0")}</span><small>{service.group}</small><h3>{service.title}</h3><p>{service.summary}</p><b>{service.price}</b><i>→</i></a>)}</div>
    </section>

    <section className="platform-section home-process">
      <div className="platform-section-heading platform-section-heading--link"><div><span>PROCESS</span><h2>制作・支援の流れ</h2><p>最初から大きな制作を前提にせず、範囲と料金を確認してから進めます。</p></div><a href="/process">詳しい進め方を見る →</a></div>
      <ol>{steps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><b>{step.title}</b><small>{step.text}</small></li>)}</ol>
    </section>

    <section className="platform-section home-column">
      <div className="platform-section-heading platform-section-heading--link"><div><span>COLUMN</span><h2>集客と業務改善の新着コラム</h2><p>社長や担当者が抱える具体的な悩みから、判断と実践につながる方法を解説します。</p></div><a href="/column">コラムをすべて見る →</a></div>
      <div className="simple-column-grid">{columnItems.slice(0, 3).map((item) => <a href={`/column/${item.slug}`} key={item.slug}><div style={{ backgroundImage: `url(${item.image})` }} /><small>{item.category}　{item.date}</small><h3>{item.title}</h3><p>{item.summary}</p><b className="card-read-link"><span>続きを読む</span><i>→</i></b></a>)}</div>
    </section>

    <section className="platform-section home-news-section">
      <div className="platform-section-heading platform-section-heading--link"><div><span>NEWS</span><h2>Webニュース</h2><p>Web、SEO、AIの重要な変化を、事業への影響と一緒に整理します。</p></div><a href="/news">ニュースをすべて見る →</a></div>
      <div className="simple-news-list">{newsItems.slice(0, 3).map((item) => <a href={`/news/${item.slug}`} key={item.slug}><time>{item.date}</time><span>{item.category}</span><h3>{item.title}</h3><b>→</b></a>)}</div>
    </section>

    <section className="platform-section home-faq">
      <div className="platform-section-heading platform-section-heading--link"><div><span>FAQ</span><h2>よくある質問</h2></div><a href="/faq">すべて見る →</a></div>
      <div className="faq-list">{faqs.slice(0, 5).map((faq, index) => <details key={faq.question} open={index === 0}><summary><span>Q</span>{faq.question}<i aria-hidden="true">＋</i></summary><div><span>A</span><p>{faq.answer}</p></div></details>)}</div>
    </section>

    <section className="home-final-cta"><span>CONTACT</span><h2>集客と業務の悩みを、<br />まず一緒に整理しませんか。</h2><p>何を頼むべきか決まっていなくても大丈夫です。現在の課題と予算に合う、小さな一歩から提案します。</p><div className="hero-actions"><a className="button button--primary" href="/contact">無料で相談する <b>→</b></a><a className="button button--secondary" href="/services#pricing">料金の目安を見る <b>→</b></a></div></section>
    <SiteFooter />
  </main>;
}
