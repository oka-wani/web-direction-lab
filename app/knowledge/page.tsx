import type { Metadata } from "next";
import ArticlesList from "../articles/ArticlesList";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { guideSteps } from "../guide/guide-data";

export const metadata: Metadata = {
  title: "Webナレッジ｜Web Direction Lab",
  description: "Webの仕組み、制作、サーバー、SEO、解析、マーケティング、AI活用を、基礎から実務まで体系的に学べます。",
};

export default function KnowledgePage() {
  return <main className="knowledge-hub">
    <SiteHeader current="knowledge" />
    <section className="knowledge-hub-hero"><div><p className="section-kicker">WEB KNOWLEDGE</p><h1>Webの知識を、<br />基礎から実務まで。</h1><p>初めて学ぶときはロードマップから。必要な情報を確認するときは記事検索から。基礎知識と実務ナレッジを一つの場所にまとめました。</p></div><dl><div><dt>01</dt><dd><b>順番に学ぶ</b><span>9ステップのロードマップ</span></dd></div><div><dt>02</dt><dd><b>テーマから探す</b><span>カテゴリとキーワード検索</span></dd></div><div><dt>03</dt><dd><b>実務で使う</b><span>判断・設計・改善まで解説</span></dd></div></dl></section>

    <section className="knowledge-paths"><header><p className="section-kicker">LEARNING ROADMAP</p><h2>初めて学ぶ人はこちら</h2><p>Webサイトが表示される仕組みから、制作・公開・集客・改善・提案までを順番につなげます。</p></header><ol className="knowledge-path-grid">{guideSteps.map((step) => <li key={step.slug}><a href={`/knowledge/${step.slug}`}><span>{step.number}</span><div><small>STEP {step.number}</small><h3>{step.title}</h3><p>{step.description}</p><em>{step.articles.length}テーマ</em></div><b>→</b></a></li>)}</ol></section>

    <section className="knowledge-library" id="articles"><header><p className="section-kicker">KNOWLEDGE LIBRARY</p><h2>記事から調べる</h2><p>知りたいテーマが決まっている場合は、カテゴリまたはキーワードから探せます。</p></header><ArticlesList /></section>
    <SiteFooter />
  </main>;
}
