type Source = { name: string; url: string };
type Term = { term: string; description: string };
type Section = { title: string; body: string; points?: string[] };
type Hero = { label: string; headline: string; items: string[] };

type Props = {
  category: string;
  title: string;
  intro: string;
  date: string;
  minutes: number;
  level?: string;
  visual: string;
  hero?: Hero;
  conclusion: string;
  highlights?: string[];
  terms?: Term[];
  sections: Section[];
  quiz: { question: string; choices: string[]; answer: string };
  summary: string[];
  sources?: Source[];
  nextLabel?: string;
  nextHref?: string;
};

export default function LearningArticle(p: Props) {
  return (
    <main className="article-page">
      <header className="site-header">
        <a className="logo" href="/">Web Direction <span>Lab</span></a>
        <nav aria-label="メインナビゲーション">
          <a href="/knowledge">ナレッジ</a>
          <a href="/news">Webニュース</a>
          <a href="/roadmap">学習ロードマップ</a>
          <a href="/#topics">カテゴリ</a>
          <a href="/#about">このサイトについて</a>
        </nav>
      </header>
      <div className="article-shell">
        <article className="article-content">
          <div className="breadcrumbs">
            <a href="/">トップ</a><span>›</span>
            <a href={`/knowledge?category=${p.category}`}>{p.category}</a><span>›</span>
            <span>{p.title}</span>
          </div>
          <header className="article-header">
            <span className="category-label">{p.category}</span>
            <h1>{p.title}</h1>
            <p className="article-intro">{p.intro}</p>
            <div className="article-meta"><time>{p.date}</time><span>読了目安 {p.minutes}分</span><span>{p.level || "初級"}</span></div>
          </header>
          {p.hero ? (
            <div className={`article-hero-knowledge article-hero-knowledge--${p.visual}`} aria-label={`${p.title}の要点図`}>
              <div className="hero-knowledge-heading"><small>{p.hero.label}</small><strong>{p.hero.headline}</strong></div>
              <div className="hero-knowledge-flow">
                {p.hero.items.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b></div>)}
              </div>
            </div>
          ) : (
            <div className={`article-hero-generic article-hero-generic--${p.visual}`} aria-hidden="true">
              <div><small>WEB DIRECTION LAB</small><b>{p.visual === "system" ? "SYSTEM MAP" : p.visual === "analytics" ? "DATA ANALYSIS" : "WEB IMPROVEMENT"}</b><i/><i/><i/></div>
            </div>
          )}

          <nav className="toc" aria-label="記事の目次">
            <b>この記事で学べること</b>
            <ol>
              {p.terms && p.terms.length > 0 && <li><a href="#terms">重要用語</a></li>}
              {p.sections.map((section, index) => <li key={section.title}><a href={`#section-${index + 1}`}>{section.title}</a></li>)}
              <li><a href="#quiz">理解度クイズ</a></li>
            </ol>
          </nav>

          <aside className="conclusion"><b>この記事の概要</b><p>{p.conclusion}</p></aside>

          {p.highlights && p.highlights.length > 0 && (
            <section className="key-highlights" aria-labelledby="key-highlights-title">
              <p className="section-kicker">KEY POINTS</p>
              <h2 id="key-highlights-title">ここだけは押さえる</h2>
              <ul>{p.highlights.map((item) => <li key={item}><mark>{item}</mark></li>)}</ul>
            </section>
          )}

          {p.terms && p.terms.length > 0 && (
            <section className="term-section" id="terms">
              <p className="section-kicker">KEY WORDS</p>
              <h2>最初に知っておきたい用語</h2>
              <dl className="term-list">
                {p.terms.map((item) => <div key={item.term}><dt>{item.term}</dt><dd>{item.description}</dd></div>)}
              </dl>
            </section>
          )}

          {p.sections.map((section, index) => (
            <section id={`section-${index + 1}`} key={section.title}>
              <p className="chapter">{String(index + 1).padStart(2, "0")}</p>
              <h2>{section.title}</h2>
              <p className="section-body">{section.body}</p>
              {section.points && <ul className="check-list">{section.points.map((point) => <li key={point}>{point}</li>)}</ul>}
            </section>
          ))}

          <section id="quiz" className="quiz">
            <p className="chapter">QUIZ</p><h2>今日の理解度チェック</h2><p>{p.quiz.question}</p>
            <ol>{p.quiz.choices.map((choice) => <li key={choice}>{choice}</li>)}</ol>
            <details><summary>答えを見る</summary><p>{p.quiz.answer}</p></details>
          </section>

          {p.sources && p.sources.length > 0 && (
            <aside className="source-box"><b>参考情報</b><p>内容の確認や実務判断では、リンク先の原文も確認してください。</p>{p.sources.map((source) => <p key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.name} ↗</a></p>)}</aside>
          )}

          <footer className="article-summary">
            <p className="section-kicker">TODAY&apos;S SUMMARY</p><h2>今日のまとめ</h2>
            <ul>{p.summary.map((item) => <li key={item}>{item}</li>)}</ul>
            <a className="button button--primary" href="/knowledge">ナレッジ一覧に戻る <b>→</b></a>
          </footer>
        </article>
      </div>
    </main>
  );
}
