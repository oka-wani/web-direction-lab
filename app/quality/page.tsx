import type { Metadata } from "../astro-compat";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "品質・技術について｜Wani san Web",
  description: "Wani san Webの標準技術、アクセシビリティ、SEO、パフォーマンス、セキュリティ、共通モジュールの考え方をご説明します。",
};

const qualities = [
  ["ACCESSIBILITY", "アクセシビリティ", "WCAG 2.2 Level A相当を標準目標として、キーボード操作、見出し構造、代替テキスト、フォームなどの基本品質を確認します。"],
  ["RESPONSIVE", "レスポンシブ", "スマートフォン・タブレット・PCを前提に、コンテンツの優先順位を保ったまま画面幅へ対応します。"],
  ["SEO", "基本SEO", "title、description、見出し、canonical、OGP、sitemap、robotsなど、公開時に必要な基本設定を確認します。"],
  ["PERFORMANCE", "パフォーマンス", "Astroの静的生成とCloudflare配信を基本に、不要なJavaScriptや重い処理を抑えます。"],
  ["SECURITY", "セキュリティ", "HTTPS、Cloudflare、CSPやセキュリティヘッダー、Bot対策、APIキー管理などを案件条件に合わせて設計します。"],
  ["MAINTENANCE", "保守性", "GitHubでソースコードを管理し、共通モジュール化によって公開後の修正や機能追加を行いやすくします。"],
] as const;

const modules = ["見出し", "本文", "リスト", "注釈", "ボタン", "リンク", "カード", "CTA", "FAQ", "テーブル", "アコーディオン", "タブ", "画像", "ギャラリー", "パンくず", "ページネーション", "フォーム", "MV", "セクションレイアウト"];

export default function QualityPage() {
  return <main className="order-page"><SiteHeader current="quality" />
    <section className="order-page-hero"><span>QUALITY &amp; TECHNOLOGY</span><h1>短く作るために、品質を削らない。</h1><p>WSWでは、毎案件ゼロから考える部分を減らし、制作基盤・共通モジュール・チェック項目を標準化します。短納期や低価格を、品質項目を省略する理由にはしません。</p></section>

    <section className="order-section">
      <div className="order-section-heading"><div><span>STANDARD STACK</span><h2>基本構成は、Astro・GitHub・Cloudflare。</h2></div><p>必要な理由がない限り、案件ごとに技術を大きく変えません。同じ基盤を繰り返し使うことで、制作速度と保守性を安定させます。</p></div>
      <div className="order-tech-flow"><div><b>Astro</b><span>静的サイトを中心に、軽量なフロントを構築</span></div><div><b>GitHub</b><span>ソースコード・変更履歴を管理</span></div><div><b>Cloudflare</b><span>配信・DNS・セキュリティ・フォーム基盤</span></div></div>
      <p style={{ marginTop: "24px", color: "#5b6d68", lineHeight: 1.9 }}>更新機能が必要な場合はmicroCMS、計測が必要な場合はGTM・GA4・Search Console・Microsoft Clarity・Looker Studioなどを必要に応じて追加します。すべてを最初から詰め込むのではなく、運用方法から必要性を判断します。</p>
    </section>

    <section className="order-section order-section--tint">
      <div className="order-section-heading"><div><span>STANDARD QUALITY</span><h2>WSWが標準で意識する品質</h2></div><p>見た目だけではなく、読みやすさ、検索、速度、安全性、公開後の直しやすさまで含めてWebサイトの品質と考えます。</p></div>
      <div className="order-quality-grid">{qualities.map(([label, title, text]) => <article className="order-quality-card" key={title}><small>{label}</small><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>

    <section className="order-section">
      <div className="order-detail-grid"><div><span className="order-kicker">SECURITY</span><h2>フォームや外部サービスも含めて、安全な構成を考えます。</h2><p>Webサイト本体だけでなく、フォーム、CMS、分析タグ、APIなども攻撃面になり得ます。案件に応じてCloudflareの保護機能、Turnstile、Rate Limiting、CSP、セキュリティヘッダー、APIキー管理などを組み合わせます。</p><ul className="order-check-list"><li>HTTPSを前提とした公開</li><li>DDoS・Bot・大量送信への対策を検討</li><li>外部スクリプトを必要以上に増やさない</li><li>CMS・APIキーをソースコードへ直接埋め込まない</li><li>GitHubで変更履歴を管理</li></ul></div><dl className="order-definition-list"><div><dt>DDoS / Bot</dt><dd>Cloudflareのネットワーク・セキュリティ機能を活用します。</dd></div><div><dt>フォーム</dt><dd>TurnstileやRate Limitingなどを組み合わせ、不正送信を抑えます。</dd></div><div><dt>ブラウザ保護</dt><dd>CSPや各種セキュリティヘッダーを案件条件に応じて検討します。</dd></div><div><dt>秘密情報</dt><dd>APIキー・メール送信キーなどは環境変数として管理します。</dd></div></dl></div>
    </section>

    <section className="order-section order-section--tint">
      <div className="order-section-heading"><div><span>COMMON MODULES</span><h2>共通構造 × 案件ごとのデザイン</h2></div><p>同じ役割のUIを毎回作り直さず、HTML構造、アクセシビリティ、基本挙動、レスポンシブ、コンポーネントAPIを標準化します。デザインテーマだけを案件に合わせて変更できる形を目指します。</p></div>
      <div className="order-subnav">{modules.map((module) => <span key={module} style={{ padding: "10px 14px", border: "1px solid #d9e3df", borderRadius: "999px", background: "#fff", fontSize: "13px", fontWeight: 700 }}>{module}</span>)}</div>
    </section>

    <section className="order-section">
      <div className="order-section-heading"><div><span>MORE DETAILS</span><h2>更新機能やフォームも、必要性から説明します。</h2></div><p>技術名を並べるだけではなく、「何のために使うのか」「使わない方がよい場合はあるか」まで分かるようにします。</p></div>
      <div className="order-service-grid"><article className="order-service-card"><small>CMS</small><h3>CMSについて</h3><p>自分でお知らせ、実績、商品などを更新したい場合に使う仕組みです。更新しないサイトに無理に導入することはありません。</p><a className="order-card-link" href="/quality/cms">CMSの考え方を見る →</a></article><article className="order-service-card"><small>CONTACT FORM</small><h3>問い合わせフォーム</h3><p>Cloudflareを標準候補にし、Turnstile、Bot対策、メール通知、自動返信などを必要に応じて組み合わせます。</p><a className="order-card-link" href="/quality/form">フォームの考え方を見る →</a></article></div>
    </section>

    <section className="order-final-cta"><span>CONTACT</span><h2>必要な機能だけを、必要な理由と一緒にご提案します。</h2><p>CMS、アクセス解析、問い合わせフォームなど、何を入れるべきか分からない場合もヒアリングから整理します。</p><div className="order-actions"><a className="order-primary-link" href="/contact">制作について相談する <b>→</b></a><a className="order-secondary-link" href="/services">サービスを見る <b>→</b></a></div></section>
    <SiteFooter />
  </main>;
}
