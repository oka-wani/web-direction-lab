import type { Metadata } from "next";
import ArticlesList from "../articles/ArticlesList";

export const metadata: Metadata = {
  title: "ナレッジ一覧｜Web Direction Lab",
  description: "Web制作、SEO、アクセス解析、システム、AI活用を、基礎から実務目線で学べるナレッジ一覧です。",
};

export default function KnowledgePage() {
  return <main className="archive-page">
    <header className="site-header"><a className="logo" href="/">Web Direction <span>Lab</span></a><nav aria-label="メインナビゲーション"><a href="/knowledge" aria-current="page">ナレッジ</a><a href="/news">Webニュース</a><a href="/roadmap">学習ロードマップ</a><a href="/#topics">カテゴリ</a></nav></header>
    <section className="archive-hero"><p className="section-kicker">KNOWLEDGE</p><h1>ナレッジ</h1><p>時間がたっても役立つ基礎知識を、実務で使える形に整理しています。</p></section>
    <section className="archive-main"><ArticlesList /></section>
    <footer><a className="logo" href="/">Web Direction <span>Lab</span></a><p>Webディレクター・Webコンサルを目指す人の実践学習メディア。</p><small>© 2026 Web Direction Lab</small></footer>
  </main>;
}
