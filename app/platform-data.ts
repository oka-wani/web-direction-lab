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
    label: "STARTER",
    title: "Webサイト簡易診断",
    summary: "URLとお悩みをもとに、優先して改善すべき点を整理します。",
    description: "SEO、導線、コンテンツ、アクセシビリティ、技術品質、運用の基本項目を確認し、最初に着手すべき改善を分かりやすくお返しする入口サービスです。",
    price: "5,000円〜",
    period: "3〜5営業日目安",
    deliverables: ["総合所見", "良い点と改善点", "改善優先度", "次に取るべきアクション"],
    recommendedFor: ["何を改善すればよいか分からない", "まず小さく相談したい", "制作会社へ依頼する前に課題を整理したい"],
    steps: ["フォームからURLとお悩みを送信", "対象ページと基本項目を確認", "内容をレビューして診断結果を納品"],
  },
  {
    slug: "improvement-report",
    label: "REPORT",
    title: "改善提案レポート",
    summary: "現状・課題・改善案・優先順位を、実行しやすいレポートにまとめます。",
    description: "簡易診断よりも詳しくサイトを確認し、課題ごとの改善案、期待効果、優先順位、進め方を整理します。社内共有や制作会社への依頼にも使いやすい形でご提供します。",
    price: "20,000円〜",
    period: "5〜10営業日目安",
    deliverables: ["現状分析", "課題と改善案", "優先順位", "概算の進め方"],
    recommendedFor: ["改善施策を社内で説明したい", "リニューアル前に課題を整理したい", "優先順位を決めたい"],
    steps: ["目的と対象範囲をヒアリング", "サイトと競合を調査", "改善レポートを作成・レビュー", "オンラインで内容をご説明"],
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
    slug: "seo-improvement",
    label: "SEO",
    title: "SEO改善",
    summary: "検索意図・技術基盤・コンテンツを横断して改善方針を作ります。",
    description: "titleや内部リンクなどの基本設定だけでなく、検索意図、サイト構造、コンテンツの役割まで確認し、実行可能なSEO施策へ落とし込みます。",
    price: "個別見積り",
    period: "内容に応じてご案内",
    deliverables: ["SEO課題一覧", "検索意図の整理", "技術改善案", "コンテンツ改善案"],
    recommendedFor: ["検索流入が伸びない", "記事を増やしても成果が出ない", "SEOの進め方を社内で整理したい"],
    steps: ["目標と計測状況を確認", "検索・技術・構造を調査", "改善計画を策定", "実施と効果確認を支援"],
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
    slug: "cms-support",
    label: "CMS",
    title: "CMS導入・運用設計",
    summary: "更新する人と業務フローに合わせて、無理のないCMS構成を設計します。",
    description: "CMS選定、コンテンツモデル、権限、承認、公開フローを整理します。機能だけで選ばず、実際の運用に合う構成を一緒に考えます。",
    price: "個別見積り",
    period: "内容に応じてご案内",
    deliverables: ["CMS要件", "コンテンツ構造", "権限・承認設計", "運用ルール"],
    recommendedFor: ["更新が属人化している", "CMSの選び方が分からない", "公開・承認フローを見直したい"],
    steps: ["現在の更新業務を確認", "CMS要件と候補を整理", "構造・権限・フローを設計", "導入・移行を支援"],
  },
  {
    slug: "ai-support",
    label: "AI",
    title: "AI導入支援",
    summary: "業務を分解し、AIを安全かつ継続的に使える仕組みへ整えます。",
    description: "記事作成、調査、レポート、定型作業などを対象に、AIを使う範囲、人が確認する範囲、運用ルールを設計します。",
    price: "個別見積り",
    period: "内容に応じてご案内",
    deliverables: ["対象業務の整理", "AI活用フロー", "プロンプト・テンプレート", "確認・運用ルール"],
    recommendedFor: ["AIをどこから導入すべきか分からない", "定型作業を効率化したい", "品質を落とさず自動化したい"],
    steps: ["対象業務をヒアリング", "自動化範囲とリスクを整理", "試作と検証", "運用へ定着"],
  },
  {
    slug: "operations-support",
    label: "OPERATIONS",
    title: "Web運用・相談",
    summary: "日々の判断、制作会社との調整、改善の優先順位付けを支援します。",
    description: "専任のWeb担当者がいない、判断を相談できる相手がいないといった状況に対し、必要なときに実務目線で伴走します。",
    price: "個別見積り",
    period: "単発・継続どちらも対応",
    deliverables: ["定例相談", "課題整理", "制作・運用レビュー", "改善計画"],
    recommendedFor: ["社内Web担当者が一人", "制作会社との調整に困っている", "継続的に改善を進めたい"],
    steps: ["相談内容と頻度を確認", "支援範囲を決定", "相談・レビューを実施", "課題と次の対応を整理"],
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

