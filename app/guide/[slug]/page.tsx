import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuideStep, guideSteps } from "../guide-data";

export function generateStaticParams() { return guideSteps.map((step) => ({ slug: step.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const step = getGuideStep((await params).slug);
  return step ? { title: `${step.title}｜Webガイド`, description: step.description } : {};
}

export default async function GuideStepPage({ params }: { params: Promise<{ slug: string }> }) {
  const step = getGuideStep((await params).slug);
  if (!step) notFound();
  return <main className="guide-page guide-step-page">
    <header className="site-header"><a className="logo" href="/">Web Direction <span>Lab</span></a><nav aria-label="メインナビゲーション"><a href="/news">ニュース</a><a href="/knowledge">ナレッジ</a><a href="/guide" aria-current="page">Webガイド</a></nav></header>
    <section className="guide-step-hero"><p className="breadcrumb"><a href="/">トップ</a> / <a href="/guide">Webガイド</a> / STEP {step.number}</p><span>STEP {step.number}</span><h1>{step.title}</h1><p>{step.description}</p><dl><div><dt>学ぶ内容</dt><dd>{step.topics}</dd></div><div><dt>ツール・サービス</dt><dd>{step.tools}</dd></div></dl></section>
    <section className="guide-article-index"><header><p className="section-kicker">CONTENTS</p><h2>このステップで学ぶこと</h2><p>{step.articles.length}件の基礎コンテンツを、上から順番に学びます。</p></header><ol>{step.articles.map((article, index) => <li key={article.title}>{article.href ? <a href={article.href}><span>{String(index + 1).padStart(2,"0")}</span><div><h3>{article.title}</h3><p>{article.summary}</p></div><b>読む →</b></a> : <div className="guide-article-pending"><span>{String(index + 1).padStart(2,"0")}</span><div><h3>{article.title}</h3><p>{article.summary}</p></div><b>準備中</b></div>}</li>)}</ol><a className="button button--secondary" href="/guide">← ロードマップへ戻る</a></section>
    <footer><a className="logo" href="/">Web Direction <span>Lab</span></a><p>Webディレクター・Webコンサルを目指す人の実践学習メディア。</p><small>© 2026 Web Direction Lab</small></footer>
  </main>;
}
