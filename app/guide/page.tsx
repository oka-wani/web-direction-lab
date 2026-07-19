import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Webガイド｜Web Direction Lab",
  description: "Webの基礎知識、用語、ツール・サービスを初心者が順番に学べるガイドです。",
};

const roadmap = [
  ["01", "Webの基本", "Web、インターネット、Webサイトが表示される仕組み"],
  ["02", "HTML・CSS", "ページの構造と見た目を作る技術"],
  ["03", "JavaScript", "ページに動きや処理を加える仕組み"],
  ["04", "サーバー・インフラ", "サーバー、ドメイン、DNS、HTTP、SSL、CDN"],
  ["05", "CMS", "WordPress、microCMS、Movable Type、WebRelease"],
  ["06", "SEO", "検索、クロール、インデックス、検索意図"],
  ["07", "アクセス解析", "GA4、Search Console、指標の読み方"],
  ["08", "Webマーケティング", "集客、導線、CV、顧客理解"],
  ["09", "Webコンサル", "課題整理、施策、検証、改善提案"],
];

const terms = ["DNS", "CDN", "SEO", "API", "JSON", "SSR", "CSR", "SSG", "CSP", "HSTS", "LCP", "CLS", "S3", "Cloudflare R2"];

const tools = [
  ["AI", "ChatGPT・Claude・Gemini"],
  ["CMS", "WordPress・microCMS・WebRelease・Movable Type"],
  ["SEO・解析", "Search Console・GA4・Ahrefs・Lighthouse"],
  ["デザイン・開発", "Figma・GitHub・VS Code"],
  ["クラウド", "Cloudflare・AWS"],
  ["ホスティング", "Vercel・Netlify"],
];

export default function GuidePage() {
  return <main className="guide-page">
    <header className="site-header"><a className="logo" href="/">Web Direction <span>Lab</span></a><nav aria-label="メインナビゲーション"><a href="/news">ニュース</a><a href="/knowledge">ナレッジ</a><a href="/guide" aria-current="page">Webガイド</a></nav></header>

    <section className="guide-hero"><p className="section-kicker">WEB GUIDE</p><h1>Webを基礎から、<br />順番に学ぶ。</h1><p>知識を調べるだけでなく、初心者がWebの全体像をつかみ、次に学ぶ内容を判断できる学習ガイドです。</p></section>

    <nav className="guide-index" aria-label="Webガイド内メニュー">
      <a href="#basics"><span>01</span><b>基礎知識</b><small>ロードマップで学ぶ</small></a>
      <a href="#glossary"><span>02</span><b>用語集</b><small>言葉の意味を調べる</small></a>
      <a href="#tools"><span>03</span><b>ツール・サービス</b><small>現場のサービスを知る</small></a>
    </nav>

    <section className="guide-section" id="basics"><header><p className="section-kicker">01 · BASICS</p><h2>基礎知識</h2><p>Webの基本から改善提案まで、知識がつながる順番で学びます。</p></header><ol className="guide-roadmap">{roadmap.map(([number, title, description]) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div><em>準備中</em></li>)}</ol></section>

    <section className="guide-section" id="glossary"><header><p className="section-kicker">02 · GLOSSARY</p><h2>用語集</h2><p>Webの仕事で出てくる言葉の意味を、1用語ずつ短く確認できます。</p></header><div className="guide-term-list">{terms.map((term) => <div key={term}><b>{term}</b><small>準備中</small></div>)}</div></section>

    <section className="guide-section" id="tools"><header><p className="section-kicker">03 · TOOLS & SERVICES</p><h2>ツール・サービス</h2><p>サービス紹介ではなく、Web制作・Webコンサルの現場で何に使うのかを理解します。</p></header><div className="guide-tools-list">{tools.map(([category, names]) => <article key={category}><small>{category}</small><h3>{names}</h3><p>概要、できること、料金、メリット・デメリット、関連サービスを整理します。</p><span>準備中</span></article>)}</div></section>

    <footer><a className="logo" href="/">Web Direction <span>Lab</span></a><p>Webディレクター・Webコンサルを目指す人の実践学習メディア。</p><small>© 2026 Web Direction Lab</small></footer>
  </main>;
}
