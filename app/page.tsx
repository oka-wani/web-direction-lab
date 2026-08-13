import { BrandLogo } from "./components/BrandLogo";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { columnItems } from "./column/column-data";
import { newsItems } from "./news/news-data";
import { faqs, services } from "./platform-data";

const problems = [
  { label: "WEB", title: "Webサイトをつくりたい", text: "企画・制作・公開まで対応。公開後の運用も追加できます。" },
  { label: "SEARCH", title: "検索からの集客を増やしたい", text: "SEOとアクセスデータを分析。LLMOもまとめて改善します。" },
  { label: "SNS / ADS", title: "SNSや広告を活用したい", text: "認知からWebサイト、問い合わせまでの導線を整えます。" },
  { label: "BUSINESS", title: "手作業を減らしたい", text: "業務を整理し、AI・自動化・小さなツールで改善します。" },
];

const steps = [
  { label: "LISTEN", title: "相談する", text: "いま困っていることや、実現したいことを伺います。" },
  { label: "ORGANIZE", title: "整理する", text: "目的・予算・優先順位を整理し、必要な範囲を決めます。" },
  { label: "PROPOSE", title: "提案する", text: "対応内容・料金・進め方を、着手前に明確にします。" },
  { label: "DELIVER", title: "実行・改善する", text: "合意した内容を実行し、公開後も必要に応じて改善します。" },
];

const knowledgeCategories = [
  { label: "FRONTEND", title: "フロント", text: "HTML・CSS・JavaScript、デザイン実装、アクセシビリティ。" },
  { label: "SYSTEM", title: "システム", text: "CMS、サーバー、Cloudflare、API、AI活用。" },
  { label: "SEO", title: "SEO", text: "検索の仕組み、内部対策、解析、コンテンツ改善。" },
  { label: "MARKETING", title: "マーケティング", text: "集客、導線設計、解析、広告、SNS活用。" },
];

export default function Home() {
  return <main>
    <SiteHeader />
    <section className="wsw-minimal-hero">
      <div className="wsw-minimal-hero-inner">
        <BrandLogo />
        <p className="eyebrow">WEB. SIMPLE. WORK.</p>
        <h1><span>考える・動く・伝えるを、</span><span>もっとシンプルに。</span></h1>
        <p className="wsw-minimal-hero-lead">Web集客と日々の業務を、わかりやすく、無理のない形で整える。小さな会社の外部パートナーとして、一緒に考え、実行します。</p>
        <a className="wsw-minimal-hero-link" href="/contact">無料で相談する <span aria-hidden="true">→</span></a>
      </div>
    </section>

    <section className="platform-section home-problems">
      <div className="home-problems-intro"><span>WHERE TO BEGIN</span><h2><span>いま必要なところから、</span><span>一緒に整える。</span></h2><p>依頼するサービスを先に決める必要はありません。現状と目標を伺い、優先順位と無理のない進め方を整理します。</p><a className="text-link" href="/contact">現在の状況を相談する →</a></div>
      <ol>{problems.map((problem, index) => <li key={problem.title}><span>{String(index + 1).padStart(2, "0")} / {problem.label}</span><h3>{problem.title}</h3><p>{problem.text}</p></li>)}</ol>
    </section>

    <section className="platform-section home-services">
      <div className="platform-section-heading platform-section-heading--link"><div><span>SERVICES</span><h2>Webと業務の悩みに、4つの支援。</h2><p>一つだけでも、組み合わせても。いま必要なところから支援します。</p></div><a href="/services">サービスを見る →</a></div>
      <div className="home-service-grid">{services.map((service, index) => <a href={`/services/${service.slug}`} key={service.slug}><span>{String(index + 1).padStart(2, "0")}</span><small>{service.group}</small><h3>{service.title}</h3><p>{service.summary}</p><b>{service.price}</b><i>→</i></a>)}</div>
    </section>

    <section className="platform-section home-process">
      <div className="platform-section-heading platform-section-heading--link"><div><span>HOW WE WORK</span><h2>相談から実行まで、迷わない4段階。</h2><p>範囲と料金を確認し、納得してから始めます。</p></div><a href="/process">詳しい進め方を見る →</a></div>
      <ol>{steps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><small>{step.label}</small><b>{step.title}</b><p>{step.text}</p></li>)}</ol>
    </section>

    <section className="platform-section home-column">
      <div className="platform-section-heading platform-section-heading--link"><div><span>COLUMN</span><h2>コラム</h2><p>集客や業務改善の判断に役立つテーマを、実務の視点から解説します。</p></div><a href="/column">コラムを見る →</a></div>
      {columnItems.length > 0 ? <div className="simple-column-grid">{columnItems.slice(0, 3).map((item) => <a href={`/column/${item.slug}`} key={item.slug}><div style={{ backgroundImage: `url(${item.image})` }} /><small>{item.category}　{item.date}</small><h3>{item.title}</h3><p>{item.summary}</p><b className="card-read-link"><span>続きを読む</span><i>→</i></b></a>)}</div> : <div className="content-reset-note"><span>NEW COLUMNS COMING SOON</span><p>コラムは新しい方針で準備中です。</p></div>}
    </section>

    <section className="platform-section home-knowledge-section">
      <div className="platform-section-heading platform-section-heading--link"><div><span>KNOWLEDGE</span><h2>ナレッジ</h2><p>フロント、システム、SEO、マーケティングの4カテゴリとキーワードから探せます。</p></div><a href="/knowledge">キーワードで探す →</a></div>
      <div className="home-knowledge-category-grid">{knowledgeCategories.map((category) => <a href={`/knowledge?category=${encodeURIComponent(category.title)}#articles`} key={category.title}><small>{category.label}</small><h3>{category.title}</h3><p>{category.text}</p><span>記事を探す →</span></a>)}</div>
    </section>

    <section className="platform-section home-news-section">
      <div className="platform-section-heading platform-section-heading--link"><div><span>NEWS</span><h2>Webニュース</h2><p>Web、SEO、AIの重要な変化を、事業への影響と一緒に整理します。</p></div><a href="/news">ニュースをすべて見る →</a></div>
      <div className="simple-news-list">{newsItems.slice(0, 3).map((item) => <a href={`/news/${item.slug}`} key={item.slug}><time>{item.date}</time><span>{item.category}</span><h3>{item.title}</h3><b>→</b></a>)}</div>
    </section>

    <section className="platform-section home-faq">
      <div className="platform-section-heading platform-section-heading--link"><div><span>FAQ</span><h2>よくある質問</h2></div><a href="/faq">すべて見る →</a></div>
      <div className="faq-list">{faqs.slice(0, 5).map((faq, index) => <details key={faq.question} open={index === 0}><summary><span>Q</span>{faq.question}<i aria-hidden="true">＋</i></summary><div><span>A</span><p>{faq.answer}</p></div></details>)}</div>
    </section>

    <section className="home-final-cta"><span>CONTACT</span><h2>まずは、いまの状況を<br />聞かせてください。</h2><p>何を頼むべきか決まっていなくても大丈夫です。課題と予算に合う、小さな一歩から整理します。</p><div className="hero-actions"><a className="button button--primary" href="/contact">無料で相談する <b>→</b></a><a className="button button--secondary" href="/services#pricing">料金の目安を見る <b>→</b></a></div></section>
    <SiteFooter />
  </main>;
}
