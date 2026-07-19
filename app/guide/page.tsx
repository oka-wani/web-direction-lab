import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Webガイド｜Web Direction Lab",
  description: "Webの仕組みから制作、SEO、解析、マーケティングまでを順番に学べる初心者向けガイドです。",
};

const roadmap = [
  { number: "01", title: "Webとインターネットの基本", description: "Webサイトが表示されるまでの全体像を理解します。", topics: "Web・インターネット・ブラウザ・URL・HTTP", tools: "Chrome・ブラウザ開発者ツール" },
  { number: "02", title: "HTML・CSSとWeb制作", description: "ページの構造と見た目がどのように作られるかを学びます。", topics: "HTML・CSS・レスポンシブ・アクセシビリティ", tools: "VS Code・Figma・GitHub" },
  { number: "03", title: "JavaScript・API・データ", description: "ページの処理と、外部サービスからデータを取得する仕組みを学びます。", topics: "JavaScript・API・JSON・データベース", tools: "Node.js・Postman・GitHub" },
  { number: "04", title: "サーバー・ドメイン・クラウド", description: "Webサイトをインターネットへ公開する仕組みを理解します。", topics: "サーバー・DNS・SSL・CDN・キャッシュ・S3", tools: "Cloudflare・AWS・Vercel・Netlify" },
  { number: "05", title: "CMSとサイト運用", description: "更新しやすいサイトを作り、運用するための仕組みを学びます。", topics: "CMS・静的生成・ヘッドレスCMS・公開フロー", tools: "WordPress・microCMS・Movable Type・WebRelease" },
  { number: "06", title: "SEOと検索の仕組み", description: "検索エンジンに見つけてもらい、適切に評価される考え方を学びます。", topics: "クロール・インデックス・検索意図・Core Web Vitals", tools: "Search Console・Lighthouse・Ahrefs" },
  { number: "07", title: "アクセス解析と改善", description: "ユーザー行動を数字で捉え、改善点を見つける方法を学びます。", topics: "KPI・イベント・流入・CV・ヒートマップ", tools: "GA4・Search Console・Microsoft Clarity" },
  { number: "08", title: "WebマーケティングとUX", description: "集客から成果までの導線を設計し、ユーザー体験を改善します。", topics: "ペルソナ・カスタマージャーニー・広告・LTV・UX", tools: "Figma・GA4・広告管理ツール" },
  { number: "09", title: "AI活用とWebコンサル", description: "知識をつなげ、課題整理・提案・実行・検証に活用します。", topics: "要件整理・仮説・施策・効果検証・AI活用", tools: "ChatGPT・Claude・Gemini" },
];

export default function GuidePage() {
  return <main className="guide-page guide-page--basics">
    <header className="site-header"><a className="logo" href="/">Web Direction <span>Lab</span></a><nav aria-label="メインナビゲーション"><a href="/news">ニュース</a><a href="/knowledge">ナレッジ</a><a href="/guide" aria-current="page">Webガイド</a></nav></header>

    <section className="guide-hero"><div><p className="section-kicker">WEB GUIDE · BASICS</p><h1>Webの基礎知識を、<br />順番につなげる。</h1><p>用語を個別に暗記するのではなく、Webサイトが動く仕組みから制作・集客・改善までを一つの流れとして学びます。</p></div><aside><small>このガイドで学べること</small><ul><li>Webの仕組みと制作技術</li><li>現場で使うツール・サービス</li><li>SEO・解析・マーケティング</li><li>Webコンサルの考え方</li></ul></aside></section>

    <section className="guide-intro"><p className="section-kicker">LEARNING ROADMAP</p><h2>基礎知識ロードマップ</h2><p>各ステップでは、その分野の基本用語と、実務で使うツール・サービスを一緒に解説します。</p></section>

    <ol className="guide-learning-list">{roadmap.map((step) => <li key={step.number}><span className="guide-step-number">{step.number}</span><div className="guide-step-main"><small>STEP {step.number}</small><h2>{step.title}</h2><p>{step.description}</p><dl><div><dt>学ぶ内容</dt><dd>{step.topics}</dd></div><div><dt>ツール・サービス</dt><dd>{step.tools}</dd></div></dl></div><em>準備中</em></li>)}</ol>

    <section className="guide-note"><b>用語説明について</b><p>DNS、API、CDN、JSONなどの用語は独立した用語集には分けず、関連する基礎知識の記事内で、仕組みや具体例と一緒に説明します。</p></section>

    <footer><a className="logo" href="/">Web Direction <span>Lab</span></a><p>Webディレクター・Webコンサルを目指す人の実践学習メディア。</p><small>© 2026 Web Direction Lab</small></footer>
  </main>;
}
