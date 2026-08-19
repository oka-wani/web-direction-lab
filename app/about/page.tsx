import type { Metadata } from "../astro-compat";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "WSWについて｜Wani san Web",
  description: "Wani san Webのサービス方針、運営者、品質への考え方、制作体制、プライバシーについてご案内します。",
};

const sections = [
  { id: "site", number: "01", title: "Wani san Webについて", body: <><p>Wani san Web（WSW）は、<mark>Webサイト制作とWeb改善を提供するサービス</mark>です。</p><p>「短期間でも、品質は妥協しない」を基本方針に、制作フロー、共通モジュール、技術基盤を標準化し、毎回ゼロから作る工数を減らしながら、必要な品質を保つことを目指しています。</p></> },
  { id: "services", number: "02", title: "提供するサービス", body: <dl><div><dt>Web制作</dt><dd>新規サイト、リニューアル、LP、小規模コーポレートサイト、店舗・スクール、サービスサイトなどを、構成整理から公開まで制作します。</dd></div><div><dt>Web改善</dt><dd>SEO、Search Console、GA4、アクセシビリティ、ユーザビリティ、パフォーマンス、技術的SEOなどを調査し、改善点を整理します。</dd></div><div><dt>公開後</dt><dd>保守、更新、アクセス解析、SEO改善、軽微な改修などの継続支援にも対応します。</dd></div></dl> },
  { id: "operator", number: "03", title: "運営者について", body: <><p>WSWは、<mark>Web制作・運用に携わる制作者が運営しています。</mark></p><p>制作体制や詳しい進め方については、お問い合わせ後のお打ち合わせにて丁寧にご説明します。運営者情報を必要以上に前面へ出すのではなく、どのような考え方で制作し、どこまで責任を持って対応するかを明確にすることを重視しています。</p></> },
  { id: "quality", number: "04", title: "品質への考え方", body: <><p>安価・短納期だからという理由で、基本品質を省略する考え方にはしません。</p><ul><li>WCAG 2.2 Level A相当を標準目標としたアクセシビリティ</li><li>スマートフォン・タブレット・PCへのレスポンシブ対応</li><li>title、見出し、canonical、OGP、sitemapなどの基本SEO</li><li>AstroとCloudflareを基本にした軽量な構成</li><li>HTTPS、Bot対策、セキュリティヘッダーなどの安全性</li></ul><p><a href="/quality">品質・技術について詳しく見る →</a></p></> },
  { id: "process", number: "05", title: "制作の進め方", body: <><p>完全非対面・完全自動にはせず、最初に一度ミーティングを行います。その後はヒアリングシートと資料を中心に、必要な場面だけ確認を挟みながら効率よく進めます。</p><p>構成とデザインを細かく分けすぎず、完成イメージが分かるラフ案を2〜3案程度提示してから実装へ進むことを基本とします。</p><p><a href="/flow">詳しい制作フローを見る →</a></p></> },
  { id: "contact", number: "06", title: "お問い合わせ・制作体制について", body: <><p>サービス内容、制作可否、費用、制作体制、公開後の運用など、詳しい内容はお問い合わせ後にご説明します。</p><p>ご相談時点で要件が固まっていなくても問題ありません。目的、予算、希望時期から必要な範囲を整理します。</p><p><a href="/contact">お問い合わせページへ →</a></p></> },
  { id: "privacy", number: "07", title: "プライバシーポリシー", body: <><p>当サイトでは、アクセス状況の把握とサイト改善のためにアクセス解析ツールを利用する場合があります。取得する情報には、通常、個人を直接特定する情報は含まれません。</p><p>お問い合わせで取得した情報は、回答、制作相談、必要な連絡のために利用し、法令に基づく場合を除いて第三者へ提供しません。</p><p>当サイトに掲載する文章・編集画像・構成などの著作権は、権利者から許諾を得たものを除き、当サイト運営者に帰属します。</p></> },
];

export default function AboutPage() {
  return <main className="about-page"><SiteHeader current="about" />
    <section className="about-hero"><span className="section-kicker" aria-hidden="true">ABOUT WSW</span><h1>WSWについて</h1><p>Webサイトを作りたい・改善したい方へ、分かりやすく、安心して相談できる制作サービスを目指しています。</p><nav className="about-anchor-links" aria-label="ページ内ナビゲーション">{sections.map((section) => <a href={`#${section.id}`} key={section.id}><span>{section.number}</span>{section.title}</a>)}</nav></section>
    <div className="about-layout"><div className="about-content">{sections.map((section) => <section id={section.id} key={section.id}><header><span>{section.number}</span><h2>{section.title}</h2></header>{section.body}</section>)}</div></div>
    <SiteFooter />
  </main>;
}
