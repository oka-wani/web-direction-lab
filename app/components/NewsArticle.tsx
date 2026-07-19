import type { NewsItem } from "../news/news-data";

function Paragraphs({ text }: { text: string }) {
  return <>{text.split(/\n\s*\n/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</>;
}

export default function NewsArticle({ item }: { item: NewsItem }) {
  const quickSummary = item.quickSummary ?? [item.summary, item.impact, item.action];
  const actions = item.actions ?? item.action.split(/\n\s*\n/).slice(0, 3);
  const affected = item.affected ?? ["Web担当者・ディレクター"];
  const sources = item.sources?.length ? item.sources : [{ name: item.sourceName, url: item.sourceUrl }];

  return <main className="archive-page">
    <header className="site-header"><a className="logo" href="/">Web Direction <span>Lab</span></a><nav aria-label="メインナビゲーション"><a href="/knowledge">ナレッジ</a><a href="/news" aria-current="page">Webニュース</a><a href="/roadmap">学習ロードマップ</a><a href="/#topics">カテゴリ</a></nav></header>
    <article className="news-detail">
      <p className="breadcrumb"><a href="/">トップ</a> / <a href="/news">Webニュース</a> / {item.category}</p>
      <div className="news-detail-meta"><span>{item.category}</span><time>{item.date}</time><em>{item.serviceName ?? "WEB UPDATE"}</em></div>
      <h1>{item.title}</h1>
      <p className="news-lead">{item.summary}</p>

      <div className="news-overview">
        <section className="news-snapshot">
          <p className="section-kicker">30-SECOND BRIEF</p>
          <h2>30秒で把握</h2>
          <ol>{quickSummary.slice(0, 3).map((point, index) => <li key={point}><span>0{index + 1}</span><p>{point}</p></li>)}</ol>
        </section>
        <aside className="news-visual" aria-label="ニュースの要点">
          <div><small>{item.visual?.label ?? item.serviceName ?? item.category}</small><b>{item.visual?.headline ?? "変更点を実務目線で整理"}</b></div>
          <ul>{(item.visual?.items ?? affected).slice(0, 4).map((label) => <li key={label}>{label}</li>)}</ul>
        </aside>
      </div>

      <section className="news-decision">
        <div><p className="section-kicker">WHO & WHEN</p><h2>誰に関係する？</h2><div className="news-tags">{affected.map((label) => <span key={label}>{label}</span>)}</div></div>
        <div className="news-action-level"><small>対応目安</small><strong>{item.actionLevel ?? "内容を確認"}</strong></div>
      </section>

      {item.beforeAfter && <section className="news-change"><p className="section-kicker">WHAT CHANGED</p><h2>何が変わった？</h2><div><article><small>変更前</small><p>{item.beforeAfter.before}</p></article><span aria-hidden="true">→</span><article><small>変更後</small><p>{item.beforeAfter.after}</p></article></div></section>}

      <section className="news-actions"><p className="section-kicker">ACTION</p><h2>Web担当者がやること</h2><ul>{actions.map((action) => <li key={action}>{action}</li>)}</ul></section>

      <section className="news-background"><p className="section-kicker">DETAILS</p><h2>発表内容と背景</h2><Paragraphs text={item.whatHappened ?? item.summary} /></section>
      <section className="news-background"><p className="section-kicker">IMPACT</p><h2>実務への影響</h2><Paragraphs text={item.impact} /></section>

      <aside className="source-box"><b>公式情報・参考リンク</b><p>判断・実装の前に、リンク先の原文と最新情報も確認してください。</p>{sources.map((source) => <p key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.name} ↗</a></p>)}</aside>
      <div className="news-back"><a className="button button--secondary" href="/news">← Webニュース一覧へ</a></div>
    </article>
    <footer><a className="logo" href="/">Web Direction <span>Lab</span></a><p>公式情報を、実務で使える判断材料に。</p><small>© 2026 Web Direction Lab</small></footer>
  </main>;
}
