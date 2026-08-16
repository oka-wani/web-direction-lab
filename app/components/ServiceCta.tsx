type Props = {
  category?: string;
  title?: string;
  compact?: boolean;
};

function selectCta(category = "", title = "") {
  const text = `${category} ${title}`.toLowerCase();
  if (/制作|ホームページ|webサイト|cms|新規|lp/.test(text)) return {
    label: "Web制作を見る",
    title: "必要な情報を整理して、公開後まで扱いやすいWebサイトを制作します。",
    body: "小規模サイトから、CMS・フォーム・アクセス解析を含む構成まで、必要な範囲を整理してご提案します。",
    href: "/services/web-production",
  };
  return {
    label: "Web改善を見る",
    title: "いまあるサイトの課題を、優先順位から整理します。",
    body: "SEO、アクセス解析、アクセシビリティ、導線、表示速度、技術面を確認し、必要に応じて改修まで対応します。",
    href: "/services/web-improvement",
  };
}

export default function ServiceCta({ category, title, compact = false }: Props) {
  const cta = selectCta(category, title);
  return <aside className={`service-cta${compact ? " service-cta--compact" : ""}`} aria-label="関連サービス">
    <div><span>RELATED SERVICE</span><h2>{cta.title}</h2><p>{cta.body}</p></div>
    <div className="service-cta-actions"><a className="button button--primary" href={cta.href}>{cta.label} <b>→</b></a><a className="service-cta-link" href="/contact">この内容について相談する</a></div>
  </aside>;
}
