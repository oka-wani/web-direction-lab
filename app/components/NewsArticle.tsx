import type { NewsItem } from "../news/news-data";
import { SiteFooter, SiteHeader } from "./SiteChrome";

function Paragraphs({ text }: { text: string }) {
  return <>{text.split(/\n\s*\n/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</>;
}

export default function NewsArticle({ item }: { item: NewsItem }) {
  const points = item.quickSummary ?? [item.summary, item.impact, item.action];
  const sources = item.sources?.length ? item.sources : [{ name: item.sourceName, url: item.sourceUrl }];

  return <main className="archive-page">
    <SiteHeader current="news" />
    <article className="news-detail news-detail--simple">
      <p className="breadcrumb"><a href="/">トップ</a> / <a href="/news">Webニュース</a> / {item.category}</p>
      <div className="news-detail-meta"><span>{item.category}</span><time>{item.date}</time>{item.serviceName && <em>{item.serviceName}</em>}</div>
      <h1>{item.title}</h1>

      <section className="news-conclusion">
        <p className="section-kicker">CONCLUSION</p>
        <h2>結論</h2>
        <p>{item.summary}</p>
      </section>

      <section className="news-points">
        <p className="section-kicker">KEY POINTS</p>
        <h2>今回のポイント</h2>
        <ul>{points.slice(0, 4).map((point) => <li key={point}><mark>{point}</mark></li>)}</ul>
      </section>

      <section className="news-body-section">
        <p className="section-kicker">DETAILS</p>
        <h2>発表内容を詳しく解説</h2>
        <Paragraphs text={item.whatHappened ?? item.summary} />
      </section>

      <aside className="news-important">
        <small>IMPORTANT</small>
        <strong>重要なポイント</strong>
        <Paragraphs text={item.impact} />
      </aside>

      <section className="news-body-section">
        <p className="section-kicker">PRACTICE</p>
        <h2>実務で確認すること</h2>
        <Paragraphs text={item.action} />
      </section>

      <aside className="source-box"><b>参考リンク</b><p>判断・実装の前に、リンク先の原文と最新情報も確認してください。</p>{sources.map((source) => <p key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.name} ↗</a></p>)}</aside>
      <div className="news-back"><a className="button button--secondary" href="/news">← Webニュース一覧へ</a></div>
    </article>
    <SiteFooter />
  </main>;
}
