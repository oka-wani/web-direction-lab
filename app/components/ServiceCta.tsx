type Props = {
  category?: string;
  title?: string;
  compact?: boolean;
};

function selectCta(category = "", title = "") {
  const text = `${category} ${title}`.toLowerCase();
  if (/seo|検索|title|core web vitals|lcp|インデックス|クロール/.test(text)) return {
    label: "SEO・検索流入について相談",
    title: "検索流入が伸びない理由を、一緒に整理しませんか？",
    body: "技術設定だけでなく、検索意図・サイト構造・コンテンツまで確認します。",
    href: "/services/seo-improvement",
  };
  if (/cms|movable|wordpress|webrelease|microcms|運用/.test(text)) return {
    label: "CMS・運用について相談",
    title: "更新しやすいCMSと運用フローを整理します。",
    body: "CMS選定、コンテンツ構造、権限、承認・公開フローまで実務に合わせて設計します。",
    href: "/services/cms-support",
  };
  if (/ai|chatgpt|自動|効率|仕事術/.test(text)) return {
    label: "AI活用について相談",
    title: "AIを、実際の業務で使える仕組みに。",
    body: "業務を分解し、AIへ任せる範囲と人が確認する範囲を整理します。",
    href: "/services/ai-support",
  };
  if (/アクセシビリティ|ui|ux|導線|デザイン|フォーム|改善/.test(text)) return {
    label: "Webサイト改善について相談",
    title: "既存サイトの改善点を、優先順位から整理します。",
    body: "導線・コンテンツ・アクセシビリティ・技術品質を横断して確認します。",
    href: "/services/website-improvement",
  };
  return {
    label: "Webサイト簡易診断",
    title: "何から改善すべきか分からない方へ。",
    body: "サイトURLとお悩みをもとに、優先して確認したいポイントを整理します。",
    href: "/services/website-diagnosis",
  };
}

export default function ServiceCta({ category, title, compact = false }: Props) {
  const cta = selectCta(category, title);
  return <aside className={`service-cta${compact ? " service-cta--compact" : ""}`} aria-label="関連サービス">
    <div><span>WGL SERVICE</span><h2>{cta.title}</h2><p>{cta.body}</p></div>
    <div className="service-cta-actions"><a className="button button--primary" href={cta.href}>{cta.label} <b>→</b></a><a className="service-cta-link" href="/contact">まずは相談する</a></div>
  </aside>;
}
