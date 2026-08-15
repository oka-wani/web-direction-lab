import type { Metadata } from "../astro-compat";
import ArticlesList from "../articles/ArticlesList";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "ナレッジ｜Wani san Web",
  description: "フロント、システム、SEO、マーケティングの実務ナレッジを、カテゴリとキーワードから探せます。",
};

export default function KnowledgePage() {
  return <main className="knowledge-hub"><SiteHeader current="knowledge" />
    <section className="knowledge-hub-hero knowledge-hub-hero--simple"><div><div className="knowledge-hero-copy"><span className="section-kicker" aria-hidden="true">KNOWLEDGE</span><h1>ナレッジ</h1><p className="knowledge-hero-subtitle">必要な知識を、必要なときに。</p><p className="knowledge-hero-description">フロント、システム、SEO、マーケティングの4カテゴリから、実務で確認したいテーマを探せます。</p></div></div></section>
    <section className="knowledge-library knowledge-library--search" id="articles"><header><span className="section-kicker" aria-hidden="true">FIND KNOWLEDGE</span><h2>カテゴリ・キーワードから探す</h2><p>カテゴリで絞り込むか、用語や課題を入力して検索してください。</p></header><ArticlesList /></section>
    <SiteFooter />
  </main>;
}
