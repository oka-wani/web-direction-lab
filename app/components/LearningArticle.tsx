import { SiteFooter, SiteHeader } from "./SiteChrome";

type Source = { name: string; url: string };
type Term = { term: string; description: string };
type Section = { title: string; body: string; points?: string[] };
type Hero = { label: string; headline: string; items: string[] };
type Related = { title: string; category: string; href: string };

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
  summary?: string[];
  sources?: Source[];
  related?: Related[];
  nextLabel?: string;
  nextHref?: string;
};

function HighlightedBody({ text }: { text: string }) {
  return <>{text.split(/\n\s*\n/).map((paragraph, paragraphIndex) => <p key={`${paragraphIndex}-${paragraph.slice(0, 20)}`}>{paragraph.split(/(\*\*[^*]+\*\*)/).map((part, index) => part.startsWith("**") && part.endsWith("**") ? <mark key={index}>{part.slice(2, -2)}</mark> : part)}</p>)}</>;
}

export default function LearningArticle(p: Props) {
  return <main className="article-page knowledge-article-page">
    <SiteHeader current="knowledge" />
    <div className="article-shell">
      <article className="article-content">
        <div className="breadcrumbs"><a href="/">トップ</a><span>›</span><a href={`/knowledge?category=${p.category}`}>{p.category}</a><span>›</span><span>{p.title}</span></div>

        <header className={`knowledge-article-mv knowledge-article-mv--${p.visual}`}>
          <div><span className="category-label">{p.category}</span><h1>{p.title}</h1><p>{p.intro}</p><div className="article-meta"><time>{p.date}</time><span>読了目安 {p.minutes}分</span><span>{p.level || "初級"}</span></div></div>
        </header>

        {p.highlights && p.highlights.length > 0 && <section className="key-highlights knowledge-key-points" aria-labelledby="key-highlights-title"><p className="section-kicker">KEY POINTS</p><h2 id="key-highlights-title">最初に押さえるポイント</h2><ul>{p.highlights.map((item) => <li key={item}><mark>{item}</mark></li>)}</ul></section>}

        <nav className="toc knowledge-agenda" aria-label="記事のアジェンダ"><p className="section-kicker">AGENDA</p><b>この記事のアジェンダ</b><ol><li><a href="#overview">概要と全体像</a></li>{p.terms && p.terms.length > 0 && <li><a href="#terms">重要用語</a></li>}{p.sections.map((section, index) => <li key={section.title}><a href={`#section-${index + 1}`}>{section.title}</a></li>)}<li><a href="#quiz">理解度チェック</a></li>{p.sources && p.sources.length > 0 && <li><a href="#sources">参考サイト</a></li>}</ol></nav>

        <section className="knowledge-overview" id="overview"><p className="section-kicker">OVERVIEW</p><h2>概要と全体像</h2><p>{p.conclusion}</p>{p.hero && <div className="article-topic-map"><header><small>{p.hero.label}</small><strong>{p.hero.headline}</strong></header><ol>{p.hero.items.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b></li>)}</ol></div>}</section>

        {p.terms && p.terms.length > 0 && <section className="term-section" id="terms"><p className="section-kicker">GLOSSARY</p><h2>用語集</h2><p className="section-introduction">本文を読む前に、記事内で使う重要な用語を確認します。</p><dl className="term-list">{p.terms.map((item) => <div key={item.term}><dt>{item.term}</dt><dd>{item.description}</dd></div>)}</dl></section>}

        <div className="knowledge-detail-sections">{p.sections.map((section, index) => <section id={`section-${index + 1}`} key={section.title}><p className="chapter">{String(index + 1).padStart(2, "0")}</p><h2>{section.title}</h2><div className="section-body"><HighlightedBody text={section.body} /></div>{section.points && <aside className="practice-points"><b>実務で確認するポイント</b><ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul></aside>}</section>)}</div>

        <section id="quiz" className="quiz"><p className="chapter">CHECK</p><h2>理解度チェック</h2><p>{p.quiz.question}</p><ol>{p.quiz.choices.map((choice) => <li key={choice}>{choice}</li>)}</ol><details><summary>答えと解説を見る</summary><p>{p.quiz.answer}</p></details></section>

        {p.sources && p.sources.length > 0 && <aside className="source-box" id="sources"><p className="section-kicker">REFERENCES</p><b>参考サイト</b><p>仕様や実務判断では、公式情報と最新の原文も確認してください。</p>{p.sources.map((source) => <p key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.name} ↗</a></p>)}</aside>}

        {p.related && p.related.length > 0 && <section className="related-knowledge" aria-labelledby="related-knowledge-title"><p className="section-kicker">RELATED KNOWLEDGE</p><h2 id="related-knowledge-title">関連ナレッジ</h2><div>{p.related.slice(0, 3).map((item) => <a href={item.href} key={item.href}><small>{item.category}</small><b>{item.title}</b><span>読む →</span></a>)}</div></section>}

        <footer className="article-end-nav"><a className="button button--primary" href="/knowledge">Webナレッジへ戻る</a></footer>
      </article>
    </div>
    <SiteFooter />
  </main>;
}
