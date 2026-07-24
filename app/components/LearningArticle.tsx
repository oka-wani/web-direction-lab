import { SiteFooter, SiteHeader } from "./SiteChrome";
import ServiceCta from "./ServiceCta";

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
  image?: string;
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
  previousLabel?: string;
  previousHref?: string;
  parentLabel?: string;
  parentHref?: string;
  backLabel?: string;
  backHref?: string;
};

function HighlightedBody({ text }: { text: string }) {
  return <>{text.split(/\n\s*\n/).map((paragraph, paragraphIndex) => <p key={`${paragraphIndex}-${paragraph.slice(0, 20)}`}>{paragraph.split(/(\*\*[^*]+\*\*)/).map((part, index) => part.startsWith("**") && part.endsWith("**") ? <mark key={index}>{part.slice(2, -2)}</mark> : part)}</p>)}</>;
}

export default function LearningArticle(p: Props) {
  const keyPoints = p.highlights?.length ? p.highlights : p.summary ?? [];
  return <main className="article-page knowledge-article-page">
    <SiteHeader current="knowledge" />
    <div className="article-shell">
      <article className="article-content">
        <div className="breadcrumbs"><a href="/">トップ</a><span>›</span><a href={p.parentHref ?? `/knowledge?category=${p.category}`}>{p.parentLabel ?? p.category}</a><span>›</span><span>{p.title}</span></div>

        <header className={`knowledge-article-mv knowledge-article-mv--${p.visual}`}>
          <div><span className="category-label">{p.category}</span><h1>{p.title}</h1><p>{p.intro}</p><div className="article-meta"><time>{p.date}</time></div></div>
        </header>

        {keyPoints.length > 0 && <section className="key-highlights knowledge-key-points" aria-labelledby="key-highlights-title"><span className="section-kicker" aria-hidden="true">KEY POINTS</span><h2 id="key-highlights-title">最初に押さえるポイント</h2><ul>{keyPoints.map((item) => <li key={item}><mark>{item}</mark></li>)}</ul></section>}

        <nav className="toc knowledge-agenda" aria-label="記事の目次"><span className="section-kicker" aria-hidden="true">CONTENTS</span><ol><li><a href="#overview">概要</a></li>{p.sections.map((section, index) => <li key={section.title}><a href={`#section-${index + 1}`}>{section.title}</a></li>)}{p.sources && p.sources.length > 0 && <li><a href="#sources">参考サイト</a></li>}</ol></nav>

        <section className="knowledge-overview" id="overview"><span className="section-kicker" aria-hidden="true">OVERVIEW</span><h2>概要と全体像</h2><p>{p.conclusion}</p></section>

        {p.terms && p.terms.length > 0 && <section className="term-section" id="terms"><span className="section-kicker" aria-hidden="true">GLOSSARY</span><h2>用語集</h2><p className="section-introduction">本文を読む前に、記事内で使う重要な用語を確認します。</p><dl className="term-list">{p.terms.map((item) => <div key={item.term}><dt>{item.term}</dt><dd>{item.description}</dd></div>)}</dl></section>}

        <div className="knowledge-detail-sections">{p.sections.map((section, index) => <section id={`section-${index + 1}`} key={section.title}><p className="chapter">{String(index + 1).padStart(2, "0")}</p><h2>{section.title}</h2><div className="section-body"><HighlightedBody text={section.body} /></div>{section.points && <aside className="practice-points"><b>実務で確認するポイント</b><ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul></aside>}</section>)}</div>

        <section id="quiz" className="quiz"><p className="chapter">CHECK</p><h2>理解度チェック</h2><p>{p.quiz.question}</p><ol>{p.quiz.choices.map((choice) => <li key={choice}>{choice}</li>)}</ol><details><summary>答えと解説を見る</summary><p>{p.quiz.answer}</p></details></section>

        {p.sources && p.sources.length > 0 && <aside className="source-box" id="sources"><span className="section-kicker" aria-hidden="true">REFERENCES</span><b>参考サイト</b><p>仕様や実務判断では、公式情報と最新の原文も確認してください。</p>{p.sources.map((source) => <p key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.name} ↗</a></p>)}</aside>}

        {p.related && p.related.length > 0 && <section className="related-knowledge" aria-labelledby="related-knowledge-title"><span className="section-kicker" aria-hidden="true">RELATED KNOWLEDGE</span><h2 id="related-knowledge-title">関連ナレッジ</h2><div>{p.related.slice(0, 3).map((item) => <a href={item.href} key={item.href}><small>{item.category}</small><b>{item.title}</b><span>読む →</span></a>)}</div></section>}

        <ServiceCta category={p.category} title={p.title} />

        <footer className="article-end-nav">
          {p.previousHref && <a className="button button--secondary" href={p.previousHref}>← {p.previousLabel ?? "前の記事"}</a>}
          <a className="button button--primary" href={p.backHref ?? "/knowledge"}>{p.backLabel ?? "Webナレッジへ戻る"}</a>
          {p.nextHref && <a className="button button--secondary" href={p.nextHref}>{p.nextLabel ?? "次の記事"} →</a>}
        </footer>
      </article>
    </div>
    <SiteFooter />
  </main>;
}
