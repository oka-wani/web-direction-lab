export type Service = {
  slug: string;
  label: string;
  title: string;
  summary: string;
  description: string;
  price: string;
  period: string;
  deliverables: string[];
  recommendedFor: string[];
  steps: string[];
};

export const services: Service[] = [
  {
    slug: "website-diagnosis",
    label: "DIAGNOSIS",
    title: "Webサイト診断・改善提案",
    summary: "サイトの課題と改善案を、優先順位まで含めて整理します。",
    description: "SEO、導線、コンテンツ、アクセシビリティ、技術品質、運用を確認し、課題・改善案・優先順位をレポートにまとめます。確認範囲に応じて簡易診断と詳細診断から選べます。",
    price: "5,000円〜",
    period: "3〜10営業日目安",
    deliverables: ["総合所見", "課題と改善案", "改善優先度", "次に取るべきアクション"],
    recommendedFor: ["何を改善すればよいか分からない", "リニューアル前に課題を整理したい", "制作会社へ渡せる改善案が欲しい"],
    steps: ["URL・目的・お悩みを確認", "対象ページと各評価項目を調査", "課題と改善案を整理", "診断レポートを納品・説明"],
  },
  {
    slug: "seo-improvement-support",
    label: "SEO",
    title: "SEO改善支援",
    summary: "検索状況を確認し、既存ページを中心に改善方針と実行内容を整理します。",
    description: "Search Console・GA4・検索結果をもとに、検索意図、タイトル・見出し、内部リンク、クロール・インデックスなどを確認します。大規模なSEOコンサルティングではなく、既存サイトの課題発見と実行可能な改善を支援します。",
    price: "個別見積り",
    period: "内容に応じてご案内",
    deliverables: ["検索状況の整理", "優先順位付き改善リスト", "ページ別改善指示", "改善後の確認方針"],
    recommendedFor: ["既存ページの検索流入を改善したい", "何からSEO対応すべきか整理したい", "制作会社へ渡せる改善指示が欲しい"],
    steps: ["対象サイト・ページと目標を確認", "検索状況と技術面を調査", "改善内容と優先順位を整理", "実行支援・改善後の確認"],
  },
  {
    slug: "small-site-production",
    label: "PRODUCTION",
    title: "小規模サイト・LP制作",
    summary: "目的と運用に必要な範囲へ絞り、無理のないサイトを制作します。",
    description: "小規模なコーポレートサイト、サービスサイト、ランディングページを対象に、情報設計から公開まで支援します。検索意図、title・description、見出し、内部リンクなどの基本SEOも制作工程に含めます。",
    price: "個別見積り",
    period: "内容に応じてご案内",
    deliverables: ["要件整理", "サイト・ページ設計", "基本SEO設計", "デザイン・実装・公開支援"],
    recommendedFor: ["必要十分な規模で始めたい", "サービスの受け皿を作りたい", "公開後も自分で更新したい"],
    steps: ["目的・予算・納期を確認", "要件と構成を決定", "デザイン・実装", "確認・公開"],
  },
  {
    slug: "website-operation-support",
    label: "OPERATION",
    title: "運用支援",
    summary: "更新管理・制作進行・品質確認を、必要な範囲から継続的に支援します。",
    description: "サイト公開後の更新依頼整理、スケジュール管理、制作会社との調整、原稿・デザイン・実装の確認、CMS登録や公開までを、必要な範囲に絞って支援します。検索流入を主目的とする調査・改善は、SEO改善支援として分けて対応します。",
    price: "個別見積り",
    period: "内容に応じてご案内",
    deliverables: ["運用課題・依頼の整理", "進行・スケジュール管理", "品質確認・検品", "CMS登録・公開支援"],
    recommendedFor: ["更新依頼や確認事項を整理したい", "公開までの抜け漏れを減らしたい", "社内と制作会社の間を整理してほしい"],
    steps: ["運用体制と現在の課題を確認", "対応範囲と役割を整理", "更新・制作進行を支援", "検品・公開と次回対応を整理"],
  },
];

export const tools = [
  { title: "title・description確認", category: "SEO", summary: "検索結果に表示される文字数と内容を確認。", status: "開発予定", type: "無料ツール" },
  { title: "robots.txt生成", category: "TECH", summary: "基本設定を選び、robots.txtのたたき台を生成。", status: "開発予定", type: "無料ツール" },
  { title: "公開前チェックリスト", category: "QUALITY", summary: "公開前に確認したい項目を抜け漏れなく整理。", status: "準備中", type: "テンプレート" },
  { title: "Web担当者向けAIプロンプト", category: "AI", summary: "要件整理・調査・文章作成に使える雛形。", status: "準備中", type: "AIプロンプト" },
  { title: "OGP生成", category: "SOCIAL", summary: "SNS共有時に必要なOGPタグを生成。", status: "開発予定", type: "無料ツール" },
  { title: "リダイレクト生成", category: "MIGRATION", summary: "移行元・移行先URLから設定のたたき台を生成。", status: "開発予定", type: "無料ツール" },
] as const;

export const faqs = [
  { question: "まだ依頼内容が決まっていなくても相談できますか？", answer: "はい。課題が曖昧な段階でも、現在のお悩みと目標を伺い、必要な対応を一緒に整理します。" },
  { question: "制作会社に依頼するほど大きくない相談でも大丈夫ですか？", answer: "はい。簡易診断、1ページの改善、運用上の判断など、小さなご相談から受け付けます。" },
  { question: "診断だけ依頼して、実装は社内や別会社で行えますか？", answer: "可能です。改善内容を社内や制作会社へ共有しやすい形に整理します。" },
  { question: "どのCMSに対応していますか？", answer: "特定製品へ限定せず、更新体制や公開フローを確認して構成を検討します。対応可否は現在の環境を確認したうえでご案内します。" },
  { question: "料金はいつ確定しますか？", answer: "相談内容と対象範囲を確認した後、作業内容と料金をご提示します。合意前に作業を開始することはありません。" },
  { question: "AIだけで診断や制作を行いますか？", answer: "AIは調査・整理・下書きの支援に利用しますが、提案内容と最終成果物は人が確認します。" },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
