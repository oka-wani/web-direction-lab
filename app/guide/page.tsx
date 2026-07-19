import type { Metadata } from "next";
import { guideSteps } from "./guide-data";

export const metadata: Metadata = {
  title: "Webガイド｜Web Direction Lab",
  description: "Webの仕組みから制作、SEO、解析、マーケティングまでを順番に学べる初心者向けガイドです。",
};

export default function GuidePage() {
  return <main className="guide-page guide-page--basics">
    <header className="site-header"><a className="logo" href="/">Web Direction <span>Lab</span></a><nav aria-label="メインナビゲーション"><a href="/news">ニュース</a><a href="/knowledge">ナレッジ</a><a href="/guide" aria-current="page">Webガイド</a></nav></header>

    <section className="guide-hero"><div><p className="section-kicker">WEB GUIDE · BASICS</p><h1>Webの基礎知識を、<br />順番につなげる。</h1><p>用語を個別に暗記するのではなく、Webサイトが動く仕組みから制作・集客・改善までを一つの流れとして学びます。</p></div></section>

    <section className="guide-intro"><p className="section-kicker">LEARNING ROADMAP</p><h2>基礎知識ロードマップ</h2><p>各ステップを選ぶと、その分野で学ぶ基礎記事の一覧を確認できます。基本用語と、実務で使うツール・サービスを一緒に解説します。</p></section>

    <ol className="guide-learning-list">{guideSteps.map((step) => <li key={step.number}><a href={`/guide/${step.slug}`}><span className="guide-step-number">{step.number}</span><div className="guide-step-main"><small>STEP {step.number}</small><h2>{step.title}</h2><p>{step.description}</p><dl><div><dt>学ぶ内容</dt><dd>{step.topics}</dd></div><div><dt>ツール・サービス</dt><dd>{step.tools}</dd></div></dl></div><span className="guide-step-arrow" aria-hidden="true">→</span></a></li>)}</ol>

    <section className="guide-note"><b>用語説明について</b><p>DNS、API、CDN、JSONなどの用語は独立した用語集には分けず、関連する基礎知識の記事内で、仕組みや具体例と一緒に説明します。</p></section>

    <footer><a className="logo" href="/">Web Direction <span>Lab</span></a><p>Webディレクター・Webコンサルを目指す人の実践学習メディア。</p><small>© 2026 Web Direction Lab</small></footer>
  </main>;
}
