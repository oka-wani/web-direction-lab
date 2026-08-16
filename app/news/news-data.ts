export type NewsItem = {
  slug: string;
  category: string;
  date: string;
  title: string;
  summary: string;
  serviceName?: string;
  quickSummary?: string[];
  affected?: string[];
  beforeAfter?: { before: string; after: string };
  actionLevel?: "今すぐ確認" | "今週中に確認" | "把握のみ";
  actions?: string[];
  visual?: { label: string; headline: string; items: string[] };
  keywords?: string[];
  whatHappened?: string;
  impact: string;
  action: string;
  audienceImpact?: number;
  selectionReason?: string;
  sourceName: string;
  sourceUrl: string;
  sources?: { name: string; url: string; isPrimary?: boolean }[];
};

export const newsItems: NewsItem[] = [
  {
    slug: "wsw-service-renewal-20260816",
    category: "サービス",
    date: "2026.08.16",
    title: "WSWをWeb制作・Web改善の受注サイトへリニューアルしました",
    summary: "サービスをWeb制作とWeb改善の2本柱へ整理し、制作イメージや品質・技術の説明を追加しました。",
    impact: "Webサイト制作や既存サイトの改善を検討している方が、サービス内容と進め方を確認しやすい構成へ変更しました。",
    action: "Web制作・Web改善の各サービスページ、制作イメージ、品質・技術ページをご確認ください。",
    sourceName: "Wani san Web",
    sourceUrl: "/news",
  },
  {
    slug: "restaurant-demo-20260816",
    category: "制作イメージ",
    date: "2026.08.16",
    title: "飲食店向けの制作イメージを公開しました",
    summary: "必要な情報、ページ構成、デザイン、追加できる機能まで、依頼前にイメージできる形で紹介しています。",
    impact: "飲食店サイトを依頼する前に、必要な情報や完成イメージを確認できます。",
    action: "制作イメージページから飲食店デモをご覧ください。",
    sourceName: "Wani san Web",
    sourceUrl: "/demo",
  },
  {
    slug: "quality-pages-20260816",
    category: "サイト更新",
    date: "2026.08.16",
    title: "品質・技術・CMS・問い合わせフォームの説明ページを追加しました",
    summary: "WSWの標準技術、アクセシビリティ、SEO、パフォーマンス、セキュリティなどの考え方をまとめました。",
    impact: "制作時にどのような品質や技術を標準としているか、依頼前に確認できます。",
    action: "品質・技術ページから、CMSや問い合わせフォームの詳細もご確認いただけます。",
    sourceName: "Wani san Web",
    sourceUrl: "/quality",
  },
];
