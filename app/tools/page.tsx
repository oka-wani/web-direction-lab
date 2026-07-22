import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { tools } from "../platform-data";

export const metadata: Metadata = {
  title: "ツール・テンプレート｜Web Direction Lab",
  description: "Web担当者の確認・制作・改善を支える無料ツール、テンプレート、AIプロンプトを提供します。",
};

export default function ToolsPage() {
  return <main className="platform-page"><SiteHeader current="tools" />
    <section className="platform-hero platform-hero--tools"><span className="section-kicker" aria-hidden="true">TOOLS</span><h1>Webの仕事を、<br />もっと速く、確実に。</h1><p>確認作業や定型業務を助ける無料ツール、テンプレート、AIプロンプトを順次公開します。</p></section>
    <section className="platform-section"><div className="platform-section-heading"><span>TOOL LIBRARY</span><h2>公開予定のツール</h2><p>初期は無料ツールと実務テンプレートを中心に整備します。</p></div><div className="tool-grid">{tools.map((tool, index) => <article className="tool-card" key={tool.title}><div><span>{String(index + 1).padStart(2, "0")}</span><small>{tool.category}</small></div><em>{tool.type}</em><h2>{tool.title}</h2><p>{tool.summary}</p><b>{tool.status}</b></article>)}</div></section>
    <section className="platform-note"><div><span className="section-kicker" aria-hidden="true">PRODUCT ROADMAP</span><h2>無料ツールから、プロダクトへ。</h2></div><p>まずは日々の業務で使える小さなツールを公開し、利用状況を見ながらテンプレート販売、AIエージェント、SaaSへ発展させます。</p></section>
    <SiteFooter />
  </main>;
}

