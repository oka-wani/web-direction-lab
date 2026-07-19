import type { Metadata } from "next";
import ArticlesList from "../articles/ArticlesList";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { guideSteps } from "../guide/guide-data";

export const metadata: Metadata = { title:"Webナレッジ｜Web Direction Lab", description:"Webの仕組み、制作、サーバー、SEO、解析、マーケティング、AI活用を、基礎から実務まで体系的に学べます。" };

export default function KnowledgePage() {
  return <main className="knowledge-hub"><SiteHeader current="knowledge" />
    <section className="knowledge-hub-hero knowledge-hub-hero--simple"><div><p className="section-kicker">WEB KNOWLEDGE</p><h1>Webナレッジ</h1><p className="knowledge-hero-subtitle">Webの知識を、基礎から実務まで。</p><p className="knowledge-hero-description">基礎知識は学習順に、ナレッジはカテゴリやキーワードから。目的に合わせて二つの入口を使い分けられます。</p><nav className="knowledge-entry-links" aria-label="Webナレッジ内のコンテンツ"><a href="#basics"><span>01</span><div><b>基礎知識</b><small>順番に学ぶ</small></div><i>↓</i></a><a href="#articles"><span>02</span><div><b>ナレッジ</b><small>テーマから探す</small></div><i>↓</i></a></nav></div></section>

    <section className="knowledge-paths knowledge-paths--compact" id="basics"><header><p className="section-kicker">BASIC KNOWLEDGE</p><h2>基礎知識</h2><p>Webサイトが表示される仕組みから、制作・公開・集客・改善・提案までを順番に学びます。</p></header><ol className="knowledge-path-grid">{guideSteps.map((step) => <li key={step.slug}><a href={`/knowledge/${step.slug}`}><span>{step.number}</span><div><small>STEP {step.number}</small><h3>{step.title}</h3><p>{step.description}</p><em>{step.articles.length}テーマ</em></div><b>→</b></a></li>)}</ol></section>

    <section className="knowledge-library" id="articles"><header><p className="section-kicker">KNOWLEDGE</p><h2>ナレッジ</h2><p>実務で確認したいテーマを、カテゴリまたはキーワードから探せます。</p></header><ArticlesList /></section><SiteFooter />
  </main>;
}
