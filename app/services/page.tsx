import type { Metadata } from "../astro-compat";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = { title: "Webサイト制作・料金｜Wani san Web", description: "短期間・手頃な価格でも品質は妥協しないWebサイト制作。小規模サイト3万円〜。公開後の保守・解析・改善まで対応します。" };

const siteTypes = [
  ["店舗・飲食店", "メニュー、店舗情報、アクセス、予約導線を分かりやすく整理。"],
  ["スクール・教室", "コース、料金、講師、体験申込、FAQを中心に設計。"],
  ["小規模企業・士業", "事業内容、強み、会社・事務所情報、問い合わせを信頼感のある形に。"],
  ["サービスサイト・LP", "課題、価値、特徴、料金、FAQ、問い合わせを一つの流れで構成。"],
] as const;
const standards = [
  ["レスポンシブ", "スマートフォン・タブレット・PCに対応"], ["基本SEO", "HTML構造、title、description、OGP、sitemap等"],
  ["アクセシビリティ", "WCAG 2.2 Level A相当を標準目標に設計"], ["パフォーマンス", "不要なJavaScriptを抑えた軽量な構成"],
  ["セキュリティ", "HTTPS、Cloudflare、セキュリティヘッダー等"], ["公開・運用", "ドメイン設定、公開作業、更新方法のご案内"],
] as const;
const options = [
  ["CMS・更新機能", "microCMSを使ったお知らせ、実績、商品、FAQ等の更新機能"], ["問い合わせフォーム", "Turnstile、Bot対策、通知、自動返信を含む安全なフォーム"],
  ["アクセス解析", "GTM、GA4、Search Console、Clarity、Looker Studio"], ["外部サービス連携", "予約サービス、SNS、Googleマップなど必要な機能のみ追加"],
] as const;

export default function ServicesPage() {
  return <main className="order-page"><SiteHeader current="services" />
    <section className="order-page-hero"><span>WEB PRODUCTION</span><h1>Webサイト制作を、<br />もっと頼みやすく。</h1><p>短期間・手頃な価格でも、品質は妥協しません。制作方法を効率化し、必要なものを分かりやすく組み立てます。</p><div className="order-actions"><a className="order-primary-link" href="/contact">無料で相談する <b>→</b></a><a className="order-secondary-link" href="#pricing">料金を見る <b>↓</b></a></div></section>

    <section className="order-section"><div className="order-section-heading"><div><span>THREE STRENGTHS</span><h2>早い・手頃・品質。</h2></div><p>安いから品質を削るのではありません。共通モジュールと標準化した制作フローで、毎回ゼロから作る工数を減らします。</p></div>
      <div className="order-strength-grid"><article><b>01</b><small>FAST</small><h3>早い</h3><p>必要な判断と確認のタイミングを整理し、一般的な制作工程を効率化。完成イメージを早い段階で共有します。</p></article><article><b>02</b><small>FAIR PRICE</small><h3>手頃</h3><p>構造や基本機能を標準化し、重複する作業を削減。必要以上に制作費を膨らませません。</p></article><article><b>03</b><small>QUALITY</small><h3>品質</h3><p>レスポンシブ、SEO、アクセシビリティ、速度、セキュリティを標準品質として設計します。</p></article></div>
      <p className="order-efficiency-note"><strong>削るのは品質ではなく、毎回ゼロから作る工数です。</strong> 共通構造 × 案件ごとのデザインで、店舗やサービスの個性もきちんと表現します。</p></section>

    <section className="order-section order-section--tint"><div className="order-section-heading"><div><span>WHAT WE BUILD</span><h2>対応できるサイト</h2></div><p>小〜中規模のWebサイトを中心に、目的と予算に合わせて必要なページ・機能を整理します。</p></div><div className="order-quality-grid">{siteTypes.map(([title, text]) => <article className="order-quality-card" key={title}><h3>{title}</h3><p>{text}</p></article>)}</div><div className="order-actions"><a className="order-secondary-link" href="/examples">業種別の制作イメージを見る <b>→</b></a></div></section>

    <section className="order-section"><div className="order-section-heading"><div><span>STANDARD</span><h2>標準品質・標準機能</h2></div><p>短納期・低価格を理由に、公開に必要な基本品質を省略しません。</p></div><div className="order-quality-grid">{standards.map(([title, text]) => <article className="order-quality-card" key={title}><h3>{title}</h3><p>{text}</p></article>)}</div><div className="order-actions"><a className="order-secondary-link" href="/quality">品質・技術について詳しく見る <b>→</b></a></div></section>

    <section className="order-section order-section--tint" id="pricing"><div className="order-section-heading"><div><span>PRICING</span><h2>料金の目安</h2></div><p>小規模な制作は3万円〜。ヒアリング後に、対応範囲・成果物・料金・スケジュールを明確にしてから着手します。</p></div><div className="order-price-feature"><div><small>SMALL WEBSITE</small><h3>小規模Webサイト制作</h3><p>必要なページと機能を絞った、初めてのホームページや小規模リニューアル向け。</p></div><strong>30,000<small>円〜</small></strong></div><div className="pricing-notes"><h3>料金が変わる主な条件</h3><ul><li>ページ数、情報量、デザインの作り込み</li><li>CMS、問い合わせフォーム、外部サービス連携</li><li>原稿・写真・ロゴなど素材準備の範囲</li><li>ドメイン、外部サービス等の実費</li></ul></div></section>

    <section className="order-section"><div className="order-section-heading"><div><span>OPTIONS</span><h2>必要な機能だけ、追加できます。</h2></div><p>標準機能として詰め込みすぎず、更新頻度や運用体制を確認して必要なものだけをご提案します。</p></div><div className="order-option-list">{options.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>

    <section className="order-section order-section--tint" id="support"><div className="order-detail-grid"><div><span className="order-kicker">AFTER LAUNCH</span><h2>公開後の保守・改善まで、続けて相談できます。</h2><p>Webサイトは公開して終わりではありません。必要に応じて、日々の更新から数値分析、課題整理、実際の改修まで支援します。</p><div className="order-actions"><a className="order-secondary-link" href="/contact">保守・改善について相談する <b>→</b></a></div></div><dl className="order-definition-list"><div><dt>保守・更新</dt><dd>軽微な修正 / コンテンツ更新 / 技術メンテナンス</dd></div><div><dt>分析</dt><dd>GA4 / Search Console / Clarity / アクセスレポート</dd></div><div><dt>診断</dt><dd>SEO / アクセシビリティ / ユーザビリティ / 表示速度</dd></div><div><dt>改善</dt><dd>課題整理 / 優先順位づけ / 改善提案 / 改修</dd></div></dl></div></section>

    <section className="order-final-cta"><span>CONTACT</span><h2>作りたいサイトのイメージから、相談できます。</h2><p>要件が固まっていなくても大丈夫です。目的・予算・希望時期を伺い、必要なページと機能を整理します。</p><div className="order-actions"><a className="order-primary-link" href="/contact">無料で相談する <b>→</b></a><a className="order-secondary-link" href="/flow">制作の流れを見る <b>→</b></a></div></section><SiteFooter />
  </main>;
}
