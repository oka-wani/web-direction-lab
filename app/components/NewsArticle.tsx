import type { NewsItem } from "../news/news-data";

export default function NewsArticle({ item }: { item: NewsItem }) {
  return <main className="archive-page">
    <header className="site-header"><a className="logo" href="/">Web Direction <span>Lab</span></a><nav aria-label="メインナビゲーション"><a href="/knowledge">ナレッジ</a><a href="/news" aria-current="page">Webニュース</a><a href="/roadmap">学習ロードマップ</a><a href="/#topics">カテゴリ</a></nav></header>
    <article className="news-detail"><p className="breadcrumb"><a href="/">トップ</a> / <a href="/news">Webニュース</a> / {item.category}</p><div className="news-detail-meta"><span>{item.category}</span><time>{item.date}</time><em>3 MIN READ</em></div><h1>{item.title}</h1><p className="news-lead">{item.summary}</p><section><p className="section-kicker">WHAT HAPPENED</p><h2>何が発表された？</h2><p>{item.summary}</p></section><section className="news-point"><p className="section-kicker">IMPACT</p><h2>実務への影響</h2><p>{item.impact}</p></section><section className="news-point news-point--action"><p className="section-kicker">NEXT ACTION</p><h2>今やること</h2><p>{item.action}</p></section><aside className="source-box"><b>一次情報を確認する</b><p>ニュース記事は要約です。判断・実装の前に公式発表も確認してください。</p><a href={item.sourceUrl} target="_blank" rel="noreferrer">{item.sourceName}（公式） ↗</a></aside><a className="button button--secondary" href="/news">← Webニュース一覧へ</a></article>
    <footer><a className="logo" href="/">Web Direction <span>Lab</span></a><p>公式情報を、実務で使える判断材料に。</p><small>© 2026 Web Direction Lab</small></footer>
  </main>;
}
