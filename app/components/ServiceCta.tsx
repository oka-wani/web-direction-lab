type Props = {
  category?: string;
  title?: string;
  compact?: boolean;
};

function selectCta(category = "", title = "") {
  const text = `${category} ${title}`.toLowerCase();
  if (/llmo|ai検索|生成ai検索/.test(text)) return {
    label: "LLMO・AI検索対策を見る",
    title: "AI検索にも伝わる、信頼できる情報基盤を整えます。",
    body: "SEOと切り離さず、サービス情報、構造化データ、一次情報、運営者情報を確認します。",
    href: "/services/seo-support",
  };
  if (/instagram|インスタ|sns/.test(text)) return {
    label: "Instagram運用支援を見る",
    title: "投稿からWebサイト・相談につながる導線を設計します。",
    body: "発信テーマ、プロフィール、カルーセル・リール、Webサイトへの導線を整理します。",
    href: "/services/instagram-support",
  };
  if (/広告|リスティング|cpc|cpa|roas/.test(text)) return {
    label: "Web広告相談を見る",
    title: "広告を出す前に、目的・予算・遷移先を整理します。",
    body: "少額から判断できる計測方法と、広告の受け皿となるページを確認します。",
    href: "/services/instagram-support",
  };
  if (/seo|検索|title|core web vitals|lcp|インデックス|クロール|アクセス解析/.test(text)) return {
    label: "SEO・アクセス解析を見る",
    title: "検索と成果につながる改善点を、優先順位から整理します。",
    body: "検索設定だけでなく、導線、コンテンツ、アクセス解析を含めて現在の課題を確認します。",
    href: "/services/seo-support",
  };
  if (/cms|movable|wordpress|webrelease|microcms|運用|更新/.test(text)) return {
    label: "更新・運用サービスを見る",
    title: "自社更新できる仕組みと、公開後の運用を支援します。",
    body: "管理画面付きサイトの制作から、日々の更新、品質確認、改善まで必要な範囲を整理します。",
    href: "/services/web-production",
  };
  if (/ai|chatgpt|自動|効率|仕事術|csv|excel|api/.test(text)) return {
    label: "自動化ツール開発を見る",
    title: "繰り返し作業を、小さなツールと仕組みで改善します。",
    body: "現在の手順を確認し、効果が見込める範囲から自動化の方法を整理します。",
    href: "/services/automation-tools",
  };
  if (/アクセシビリティ|ui|ux|導線|デザイン|フォーム|改善/.test(text)) return {
    label: "Webサイト改善を見る",
    title: "既存サイトの改善点を、優先順位から整理します。",
    body: "導線、コンテンツ、スマートフォン表示、技術品質を横断して確認します。",
    href: "/services/web-production",
  };
  if (/制作|ホームページ|webサイト/.test(text)) return {
    label: "Webサイト制作を見る",
    title: "掲載内容の整理から、問い合わせにつながるサイトを制作します。",
    body: "初めてのサイト制作でも、ページ構成、デザイン、公開まで必要な範囲を支援します。",
    href: "/services/web-production",
  };
  return {
    label: "AI・業務改善相談",
    title: "何から始めるべきか分からない方へ。",
    body: "現在の課題と目的を伺い、制作、改善、運用、自動化の選択肢を整理します。",
    href: "/services/automation-tools",
  };
}

export default function ServiceCta({ category, title, compact = false }: Props) {
  const cta = selectCta(category, title);
  return <aside className={`service-cta${compact ? " service-cta--compact" : ""}`} aria-label="関連サービス">
    <div><span>RELATED SERVICE</span><h2>{cta.title}</h2><p>{cta.body}</p></div>
    <div className="service-cta-actions"><a className="button button--primary" href={cta.href}>{cta.label} <b>→</b></a><a className="service-cta-link" href="/contact">この内容について相談する</a></div>
  </aside>;
}
