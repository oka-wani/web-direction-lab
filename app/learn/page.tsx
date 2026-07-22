import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "学ぶ｜Web Direction Lab",
  description: "Webガイド、ナレッジ、コラム、ニュースから、Web制作・SEO・AI・業務改善を目的に合わせて学べます。",
};

const contents = [
  { number: "01", label: "WEB GUIDE", title: "Webガイド", text: "Webの仕組みから制作・公開・集客・改善までを、学習順にたどれます。", href: "/knowledge#basics", action: "体系的に学ぶ" },
  { number: "02", label: "KNOWLEDGE", title: "ナレッジ", text: "実務で確認したい用語やテーマを、カテゴリとキーワードから探せます。", href: "/knowledge#articles", action: "テーマから探す" },
  { number: "03", label: "COLUMN", title: "コラム", text: "Web担当者の仕事術、AI活用、業務改善を実践の視点で整理します。", href: "/column", action: "考え方を深める" },
  { number: "04", label: "NEWS", title: "ニュース", text: "Google、AI、ブラウザ、SEOの変化を、実務への影響とともに解説します。", href: "/news", action: "最新情報を知る" },
] as const;

export default function LearnPage() {
  return <main className="platform-page"><SiteHeader current="learn" />
    <section className="platform-hero"><span className="section-kicker" aria-hidden="true">LEARN</span><h1>Webで成果を出すために、<br />必要なことを学ぶ。</h1><p>基礎から最新情報、実務の考え方まで。知るだけで終わらず、判断や改善に使える形で整理しています。</p></section>
    <section className="platform-section"><div className="platform-section-heading"><span>CONTENTS</span><h2>目的に合わせて選ぶ</h2></div><div className="learn-grid">{contents.map((item) => <a href={item.href} className="learn-card" key={item.title}><span>{item.number}</span><small>{item.label}</small><h2>{item.title}</h2><p>{item.text}</p><b>{item.action} →</b></a>)}</div></section>
    <section className="platform-wide-band"><div><span className="section-kicker" aria-hidden="true">FROM KNOWLEDGE TO ACTION</span><h2>学んだ内容を、改善や業務へ。</h2><p>記事で理解したあと、そのまま使えるツールやテンプレート、個別の改善相談へ進めます。</p></div><div className="platform-inline-actions"><a className="button button--primary" href="/tools">ツールを見る <b>→</b></a><a className="button button--secondary" href="/services">サービスを見る <b>→</b></a></div></section>
    <SiteFooter />
  </main>;
}

