import { newsItems } from "./news/news-data";

const articles = [
  {
    category: "SEO",
    date: "2026.07.18",
    title: "titleタグとは？ SEOとクリック率を左右する基本",
    description: "検索結果で選ばれるタイトルの考え方を、実務で使える形に整理します。",
    type: "search",
    href: "/articles/title-tag",
  },
  {
    category: "アクセス解析",
    date: "2026.07.17",
    title: "GA4で最初に見るべき5つの指標",
    description: "数字を眺めるだけで終わらせず、改善につなげる確認順を解説します。",
    type: "analytics",
    href: "/articles/ga4-first-metrics",
  },
  {
    category: "Web制作",
    date: "2026.07.16",
    title: "成果につながるWebサイト改善の進め方",
    description: "課題発見から仮説、実装、検証までの流れを一つずつ確認します。",
    type: "website",
    href: "/articles/site-improvement",
  },
];

const topics = [
  { icon: "↗", name: "SEO", text: "検索で見つけてもらう仕組みを学ぶ", count: "2記事", href: "/knowledge?category=SEO" },
  { icon: "◎", name: "アクセス解析", text: "データから改善点を見つける", count: "1記事", href: "/knowledge?category=アクセス解析" },
  { icon: "◇", name: "Web制作", text: "設計・実装・CMSの基礎を固める", count: "1記事", href: "/knowledge?category=Web制作" },
  { icon: "⌘", name: "システム", text: "サーバー・DNS・API・クラウドを理解する", count: "2記事", href: "/knowledge?category=システム" },
  { icon: "✦", name: "AI活用", text: "制作と運用をAIで効率化する", count: "1記事", href: "/knowledge?category=AI活用" },
];

function ArticleVisual({ type }: { type: string }) {
  return (
    <div className={`article-visual article-visual--${type}`} aria-hidden="true">
      {type === "search" && (
        <>
          <div className="browser-card"><b>&lt;title&gt;</b><i /><i /><i /></div>
          <div className="magnifier" />
        </>
      )}
      {type === "analytics" && (
        <>
          <div className="mini-bars"><i /><i /><i /><i /><i /></div>
          <div className="mini-line">●—●—●—●</div>
          <div className="mini-ring" />
        </>
      )}
      {type === "website" && (
        <>
          <div className="wireframe"><b /><span /><span /><i /><i /></div>
          <div className="checks">✓<br />✓</div>
        </>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="logo" href="#top" aria-label="Web Direction Lab トップ">Web Direction <span>Lab</span></a>
        <nav aria-label="メインナビゲーション">
          <a href="/knowledge">ナレッジ</a>
          <a href="/news">Webニュース</a>
          <a href="/roadmap">学習ロードマップ</a>
          <a href="#topics">カテゴリ</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">LEARN · CREATE · IMPROVE</p>
          <h1>Webの知識を、<br /><span>実務で使える力</span>に。</h1>
          <p className="lead">Webディレクター・Webコンサルを目指す人のための、<br className="desktop" />Web制作・SEO・システム・マーケティング学習メディア。</p>
          <div className="hero-actions">
            <a className="button button--primary" href="#articles"><span className="book-icon">▤</span> 最新ナレッジを読む <b>→</b></a>
            <a className="button button--secondary" href="/roadmap"><span>⌁</span> 学習ロードマップを見る <b>→</b></a>
          </div>
          <p className="hero-note">毎日の学習と実務経験を、提案や改善に使える知識として整理します。</p>
        </div>

        <div className="hero-art" aria-label="学習と成長を表すグラフのイラスト" role="img">
          <div className="art-grid" />
          <div className="donut" />
          <div className="chart-bars"><i /><i /><i /><i /><i /></div>
          <div className="growth-line"><i /><i /><i /><i /></div>
          <div className="art-panel"><span>LEARNING</span><b>知識を積み上げる</b><i /></div>
          <div className="dot-field">••••••<br />••••••<br />••••••</div>
        </div>
      </section>

      <section className="section latest" id="articles">
        <div className="section-heading">
          <div><p className="section-kicker">NEW KNOWLEDGE</p><h2>最新ナレッジ</h2></div>
          <a href="/knowledge">ナレッジをすべて見る <span>→</span></a>
        </div>
        <div className="article-grid">
          {articles.map((article) => (
            <article className="article-card" key={article.title}>
              <div className="visual-wrap"><span className="category-badge">{article.category}</span><ArticleVisual type={article.type} /></div>
              <div className="article-body">
                <time>{article.date}</time>
                <h3><a href={article.href}>{article.title}</a></h3>
                <p>{article.description}</p>
                <a className="text-link" href={article.href}>この記事を読む <span>→</span></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section home-news">
        <div className="section-heading">
          <div><p className="section-kicker">WEB NEWS</p><h2>押さえておきたい変化</h2></div>
          <a href="/news">Webニュースをすべて見る <span>→</span></a>
        </div>
        <div className="home-news-grid">
          {newsItems.map((item) => <article className="home-news-card" key={item.slug}>
            <div><span>{item.category}</span><time>{item.date}</time></div>
            <h3><a href={`/news/${item.slug}`}>{item.title}</a></h3>
            <p>{item.summary}</p>
            <a className="text-link" href={`/news/${item.slug}`}>3分で要点をつかむ <span>→</span></a>
          </article>)}
        </div>
      </section>

      <section className="section topics" id="topics">
        <div className="section-heading">
          <div><p className="section-kicker">LEARNING TOPICS</p><h2>テーマから学ぶ</h2></div>
          <p>気になる領域から、基礎と実務を順番に学べます。</p>
        </div>
        <div className="topic-grid">
          {topics.map((topic) => (
            <a className="topic-card" href={topic.href} key={topic.name}>
              <span className="topic-icon">{topic.icon}</span>
              <span><b>{topic.name}</b><small>{topic.text}</small></span>
              <em>{topic.count}</em><i>→</i>
            </a>
          ))}
        </div>
      </section>

      <section className="section roadmap" id="roadmap">
        <div className="roadmap-copy">
          <p className="section-kicker">LEARNING ROADMAP</p>
          <h2>何から学べばいいか、<br />迷わないための道しるべ。</h2>
          <p>Webの基礎からSEO、アクセス解析、改善提案まで。知識がつながる順番で学習テーマをまとめています。</p>
          <a className="button button--primary" href="/roadmap">ロードマップをはじめる <b>→</b></a>
        </div>
        <ol className="roadmap-steps">
          <li><span>01</span><div><b>Webの仕組みを知る</b><small>HTML・CSS・サーバー・CMS</small></div></li>
          <li><span>02</span><div><b>見つけてもらう</b><small>SEO・コンテンツ・検索意図</small></div></li>
          <li><span>03</span><div><b>数字から改善する</b><small>GA4・Search Console・UX</small></div></li>
          <li><span>04</span><div><b>成果につなげる</b><small>仮説・施策・検証・提案</small></div></li>
        </ol>
      </section>

      <section className="about" id="about">
        <p className="section-kicker">ABOUT THIS LAB</p>
        <h2>Webの仕事に必要な知識を、一つずつ。</h2>
        <p>このサイトは、Webディレクター・Webコンサルを目指す人に向けて、Web制作、SEO、アクセス解析、マーケティング、システムの知識を実務目線で整理する学習メディアです。</p>
      </section>

      <footer><a className="logo" href="#top">Web Direction <span>Lab</span></a><p>Webディレクター・Webコンサルを目指す人の実践学習メディア。</p><small>© 2026 Web Direction Lab</small></footer>
    </main>
  );
}
