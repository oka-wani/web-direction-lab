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
    slug: "website-improvement",
    label: "IMPROVEMENT",
    title: "Webサイト改善",
    summary: "既存サイトを生かしながら、ページ・導線・コンテンツを改善します。",
    description: "全面リニューアルに限定せず、優先度の高いページや導線から段階的に改善します。要件整理から制作進行、公開後の確認まで一貫して支援します。",
    price: "個別見積り",
    period: "内容に応じてご案内",
    deliverables: ["改善方針", "画面・コンテンツ改善", "実装または制作指示", "公開後チェック"],
    recommendedFor: ["問い合わせを増やしたい", "既存サイトを大きく作り直したくない", "改善の進行をまとめて任せたい"],
    steps: ["現状と目標を確認", "改善範囲と優先順位を決定", "設計・制作・実装", "公開と効果確認"],
  },
  {
    slug: "small-site-production",
    label: "PRODUCTION",
    title: "小規模サイト・LP制作",
    summary: "目的と運用に必要な範囲へ絞り、無理のないサイトを制作します。",
    description: "小規模なコーポレートサイト、サービスサイト、ランディングページを対象に、情報設計から公開まで支援します。更新方法と公開後の運用も考慮します。",
    price: "個別見積り",
    period: "内容に応じてご案内",
    deliverables: ["要件整理", "サイト・ページ設計", "デザインと実装", "公開支援"],
    recommendedFor: ["必要十分な規模で始めたい", "サービスの受け皿を作りたい", "公開後も自分で更新したい"],
    steps: ["目的・予算・納期を確認", "要件と構成を決定", "デザイン・実装", "確認・公開"],
  },
  {
    slug: "project-support",
    label: "PROJECT",
    title: "Web制作・リニューアル進行支援",
    summary: "要件・スケジュール・確認事項を整理し、制作プロジェクトを前へ進めます。",
    description: "サイト制作やリニューアルで発生する要件整理、関係者との合意形成、制作会社への指示、検品、公開までを実務目線で支援します。",
    price: "個別見積り",
    period: "内容に応じてご案内",
    deliverables: ["要件・課題整理", "進行計画", "制作指示・確認事項", "検品・公開支援"],
    recommendedFor: ["社内だけでは進行をまとめにくい", "制作会社へ正確に要望を伝えたい", "公開までの抜け漏れを減らしたい"],
    steps: ["目的・体制・現状を確認", "要件と役割を整理", "制作進行とレビューを支援", "検品・公開を支援"],
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
