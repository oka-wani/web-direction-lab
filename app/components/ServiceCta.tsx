type Props = {
  category?: string;
  title?: string;
  compact?: boolean;
};

function selectCta(category = "", title = "") {
  const text = `${category} ${title}`.toLowerCase();
  if (/seo|検索|title|core web vitals|lcp|インデックス|クロール/.test(text)) return {
    label: "サイト診断について見る",
    title: "検索やサイト構造の課題を、診断から整理します。",
    body: "検索設定だけに限定せず、導線・コンテンツ・技術品質を含めて改善点を確認します。",
    href: "/services/website-diagnosis",
  };
  if (/cms|movable|wordpress|webrelease|microcms|運用/.test(text)) return {
    label: "進行支援について見る",
    title: "CMSを含む制作・リニューアルの進行を支援します。",
    body: "要件整理、制作会社への指示、検品、公開までの確認事項を整理します。",
    href: "/services/project-support",
  };
  if (/ai|chatgpt|自動|効率|仕事術/.test(text)) return {
    label: "サイト診断について見る",
    title: "Webの課題を、まずは診断から整理します。",
    body: "現在のサイトとお悩みを確認し、優先して着手する改善点をまとめます。",
    href: "/services/website-diagnosis",
  };
  if (/アクセシビリティ|ui|ux|導線|デザイン|フォーム|改善/.test(text)) return {
    label: "Webサイト改善について相談",
    title: "既存サイトの改善点を、優先順位から整理します。",
    body: "導線・コンテンツ・アクセシビリティ・技術品質を横断して確認します。",
    href: "/services/website-improvement",
  };
  return {
    label: "Webサイト診断・改善提案",
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
