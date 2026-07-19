import type { NewsItem } from "../news/news-data";
import { articleItems } from "../articles/article-data";
import { SiteFooter, SiteHeader } from "./SiteChrome";

function Paragraphs({ text }: { text: string }) {
  return <>{text.split(/\n\s*\n/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</>;
}

function relatedKnowledge(item: NewsItem) {
  const newsText = `${item.category} ${item.title} ${item.summary} ${item.impact} ${item.action} ${(item.keywords ?? []).join(" ")}`.toLowerCase();
  const categories = item.category.toLowerCase().split(/[\s/・]+/).filter(Boolean);
  return articleItems.map((article) => {
    let score = (article.tags ?? []).reduce((total, tag) => total + (newsText.includes(tag.toLowerCase()) ? 3 : 0), 0);
    score += categories.some((category) => article.category.toLowerCase().includes(category) || category.includes(article.category.toLowerCase())) ? 2 : 0;
    score += newsText.includes(article.category.toLowerCase()) ? 1 : 0;
    return { article, score };
  }).sort((a, b) => b.score - a.score).slice(0, 3).map(({ article }) => article);
}

export default function NewsArticle({ item }: { item: NewsItem }) {
  const points = item.quickSummary ?? [item.summary, item.impact, item.action];
  const sources = item.sources?.length ? item.sources : [{ name: item.sourceName, url: item.sourceUrl }];
  const related = relatedKnowledge(item);

  return <main className="article-page news-article-page">
    <SiteHeader current="news" />
    <article className="news-detail news-detail--simple">
      <p className="breadcrumb"><a href="/">トップ</a> / <a href="/news">Webニュース</a> / {item.category}</p>
      <header className="news-article-header"><div className="news-detail-meta"><span>{item.category}</span><time>{item.date}</time>{item.serviceName && <em>{item.serviceName}</em>}</div><h1>{item.title}</h1></header>

      <section className="news-conclusion">
        <span className="section-kicker" aria-hidden="true">CONCLUSION</span>
        <h2>結論</h2>
        <p>{item.summary}</p>
      </section>

      <section className="news-points">
        <span className="section-kicker" aria-hidden="true">KEY POINTS</span>
        <h2>今回のポイント</h2>
        <ul>{points.slice(0, 4).map((point) => <li key={point}><mark>{point}</mark></li>)}</ul>
      </section>

      <section className="news-body-section">
        <span className="section-kicker" aria-hidden="true">DETAILS</span>
        <h2>発表内容を詳しく解説</h2>
        <Paragraphs text={item.whatHappened ?? item.summary} />
      </section>

      <aside className="news-important">
        <small>IMPORTANT</small>
        <strong>重要なポイント</strong>
        <Paragraphs text={item.impact} />
      </aside>

      <section className="news-body-section">
        <span className="section-kicker" aria-hidden="true">PRACTICE</span>
        <h2>実務で確認すること</h2>
        <Paragraphs text={item.action} />
      </section>

      <aside className="source-box"><b>参考リンク</b><p>判断・実装の前に、リンク先の原文と最新情報も確認してください。</p>{sources.map((source) => <p key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.name} ↗</a></p>)}</aside>
      <section className="related-knowledge news-related-knowledge" aria-labelledby="news-related-title"><span className="section-kicker" aria-hidden="true">RELATED KNOWLEDGE</span><h2 id="news-related-title">関連ナレッジ</h2><div>{related.map((article) => <a href={`/articles/${article.slug}`} key={article.slug}><small>{article.category}</small><b>{article.title}</b><span>読む →</span></a>)}</div></section>
      <div className="news-back"><a className="button button--secondary" href="/news">← Webニュース一覧へ</a></div>
    </article>
    <SiteFooter />
  </main>;
}
