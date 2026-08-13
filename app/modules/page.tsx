import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "共通モジュール一覧｜Wani san Web",
  description: "Wani san Webで使用する共通UIモジュールの確認ページです。",
  robots: { index: false, follow: false },
};

const moduleSections = [
  { number: "01", label: "FOUNDATION", title: "見出し・ラベル", description: "各ページで共通して使うセクション見出しです。" },
  { number: "02", label: "ACTIONS", title: "ボタン・テキストリンク", description: "問い合わせや詳細ページへの遷移に使います。" },
  { number: "03", label: "CARDS", title: "カード", description: "サービスや記事など、まとまりのある情報を並べます。" },
  { number: "04", label: "CONTENT", title: "記事内モジュール", description: "ナレッジ詳細で使う見出しや要点ボックスです。" },
  { number: "05", label: "DISCLOSURE", title: "よくある質問", description: "質問を選ぶと回答が開くアコーディオンです。" },
] as const;

type ModuleSection = (typeof moduleSections)[number];

export default function ModulesPage() {
  return <main className="module-catalog-page">
    <SiteHeader />
    <header className="module-catalog-hero">
      <p>UI MODULES</p>
      <h1>共通モジュール一覧</h1>
      <span>サイトで使用している見出し、カード、ボタンなどの表示確認用ページです。</span>
    </header>

    <div className="module-catalog">
      <section className="module-catalog-section">
        <ModuleHeader {...moduleSections[0]} />
        <div className="module-preview module-preview--heading">
          <div className="platform-section-heading"><span>KNOWLEDGE</span><h2>知ることから、改善を始める。</h2><p>見出しに短い説明を添えて、次に読む内容を伝えます。</p></div>
        </div>
      </section>

      <section className="module-catalog-section" id="buttons">
        <ModuleHeader {...moduleSections[1]} />
        <div className="module-preview module-action-row">
          <a className="button button--primary" href="#buttons">無料で相談する <b>→</b></a>
          <a className="button button--secondary" href="#buttons">料金を見る <b>→</b></a>
          <a className="text-link" href="#buttons">詳しく見る →</a>
        </div>
      </section>

      <section className="module-catalog-section" id="cards">
        <ModuleHeader {...moduleSections[2]} />
        <div className="home-knowledge-category-grid module-card-grid">
          <a href="#cards"><small>WEB PRODUCTION</small><h3>Web制作</h3><p>目的と予算に合わせて、必要な規模からWebサイトを制作します。</p><span>詳しく見る →</span></a>
          <a href="#cards"><small>SEO &amp; LLMO</small><h3>SEO解析</h3><p>検索とアクセスデータをもとに、改善の優先順位を整理します。</p><span>詳しく見る →</span></a>
          <a href="#cards"><small>BUSINESS &amp; TOOLS</small><h3>業務改善</h3><p>手作業を整理し、AIや小さなツールで負担を減らします。</p><span>詳しく見る →</span></a>
        </div>
      </section>

      <section className="module-catalog-section">
        <ModuleHeader {...moduleSections[3]} />
        <div className="module-preview module-article-preview">
          <div className="knowledge-detail-sections">
            <section>
              <p className="chapter">01</p>
              <h2>基本と仕組み</h2>
              <div className="section-body"><p>記事内の章見出しは、淡いラベルと短いアクセントラインで内容の区切りを示します。</p></div>
            </section>
          </div>
          <section className="key-highlights knowledge-key-points">
            <span className="section-kicker">KEY POINTS</span>
            <h2>最初に押さえるポイント</h2>
            <ul><li><mark>重要な内容を短くまとめて伝えます。</mark></li><li><mark>本文を読む前に全体像をつかめます。</mark></li></ul>
          </section>
        </div>
      </section>

      <section className="module-catalog-section">
        <ModuleHeader {...moduleSections[4]} />
        <div className="faq-list module-faq-preview">
          <details open><summary><span>Q</span>何を依頼すべきか決まっていなくても相談できますか？<i aria-hidden="true">＋</i></summary><div><span>A</span><p>はい。現在のお悩みを伺い、必要な対応と優先順位から一緒に整理します。</p></div></details>
          <details><summary><span>Q</span>小さな修正だけでも依頼できますか？<i aria-hidden="true">＋</i></summary><div><span>A</span><p>はい。小規模なご相談から対応します。</p></div></details>
        </div>
      </section>
    </div>
    <SiteFooter />
  </main>;
}

function ModuleHeader({ number, label, title, description }: ModuleSection) {
  return <header className="module-catalog-section-header">
    <div><span>{number}</span><small>{label}</small></div>
    <h2>{title}</h2>
    <p>{description}</p>
  </header>;
}
