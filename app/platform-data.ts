export type Service = {
  slug: string;
  group: "Web制作" | "SEO解析" | "SNS運用・広告" | "業務改善・ツール開発";
  label: string;
  title: string;
  summary: string;
  description: string;
  price: string;
  period: string;
  deliverables: string[];
  recommendedFor: string[];
  solvedIssues: string[];
  steps: string[];
  faq: { question: string; answer: string }[];
};

export const services: Service[] = [
  {
    slug: "web-production", group: "Web制作", label: "WEB PRODUCTION", title: "Web制作",
    summary: "事業内容が伝わり、問い合わせにつながるWebサイトを企画から公開まで制作します。公開後の運用も追加できます。",
    description: "小規模企業、個人事業主、店舗、士業を対象に、掲載内容の整理、構成、デザイン、実装、公開まで一貫して対応します。更新、保守、アクセス確認などの公開後の運用は、必要に応じてオプションとして追加できます。",
    price: "80,000円〜", period: "3週間〜3か月目安",
    deliverables: ["目的・ターゲット・掲載内容の整理", "サイト構成・導線・デザイン・実装", "スマートフォン対応・基本SEO", "オプション：更新・保守・アクセス確認"],
    recommendedFor: ["何を掲載すべきか分からない", "小さな予算からWebサイトを始めたい", "今のサイトから問い合わせが来ない"],
    solvedIssues: ["事業内容と強みが伝わる", "相談・問い合わせまでの導線が整う", "公開後も必要な範囲で運用を任せられる"],
    steps: ["目的・予算・希望時期を確認", "掲載内容とページ構成を整理", "デザイン・実装・確認", "公開・計測設定・運用案内"],
    faq: [
      { question: "原稿や写真がなくても相談できますか？", answer: "はい。必要な掲載項目を整理し、準備する原稿や素材を明確にします。" },
      { question: "公開後の更新も依頼できますか？", answer: "はい。更新、保守、アクセス確認などをオプションとして追加できます。" },
    ],
  },
  {
    slug: "seo-support", group: "SEO解析", label: "SEO & LLMO", title: "SEO解析",
    summary: "検索・アクセスデータを分析し、集客と問い合わせを増やす改善策を整理します。LLMOにも一体で対応します。",
    description: "検索順位、検索意図、ページ内容、内部リンク、問い合わせ導線、Search Console・GA4のデータを確認し、改善の優先順位を整理します。AI検索で正しく理解・参照されるためのLLMOも、SEOと分けずに必要な施策へ含めます。",
    price: "19,800円〜", period: "5営業日〜",
    deliverables: ["検索・アクセス状況の分析", "キーワードと検索意図の整理", "ページ・導線・基本SEOの改善案", "LLMO・構造化データ・情報設計の確認"],
    recommendedFor: ["ブログを書いても問い合わせが増えない", "検索流入を増やしたい", "GA4やSearch Consoleを活用できていない"],
    solvedIssues: ["改善すべきページが分かる", "検索流入と問い合わせ導線がつながる", "SEOとLLMOを一つの方針で進められる"],
    steps: ["目標と対象サイトを確認", "検索結果・データ・ページを調査", "課題と優先順位を提示", "改善実施・効果確認"],
    faq: [
      { question: "診断だけ依頼できますか？", answer: "はい。改善提案レポートのみのご依頼にも対応します。" },
      { question: "LLMOはSEOと別に依頼する必要がありますか？", answer: "いいえ。共通する基盤が多いため、SEO解析の中で必要なLLMO対応を一緒に整理します。" },
    ],
  },
  {
    slug: "instagram-support", group: "SNS運用・広告", label: "SNS & ADVERTISING", title: "SNS運用・広告",
    summary: "SNSの発信とWeb広告を、認知だけで終わらずWebサイトや相談につながる形で運用します。",
    description: "目的、ターゲット、投稿テーマ、プロフィール、広告予算、遷移先、計測方法を整理します。SNS運用とWeb広告を別々に考えず、認知からWebサイト、問い合わせまで一つの導線として設計します。",
    price: "個別見積もり", period: "月単位・スポット相談可",
    deliverables: ["ターゲット・媒体・導線の整理", "投稿テーマと運用ルールの設計", "広告の目的・予算・遷移先の整理", "投稿・広告の数値確認と改善提案"],
    recommendedFor: ["何を発信すべきか決まらない", "SNSや広告から問い合わせにつながらない", "少額から広告を試したい"],
    solvedIssues: ["発信テーマと運用方針が定まる", "広告費の判断基準ができる", "認知から相談までの導線がつながる"],
    steps: ["目的・ターゲット・予算を確認", "媒体・テーマ・導線を設計", "投稿・広告運用を開始", "数値を確認し改善"],
    faq: [
      { question: "投稿作成だけ依頼できますか？", answer: "対応範囲は個別に調整できます。まず目的と運用体制を確認します。" },
      { question: "広告だけの相談もできますか？", answer: "はい。目的、予算、遷移先、計測方法を確認し、実施すべきかも含めて整理します。" },
    ],
  },
  {
    slug: "automation-tools", group: "業務改善・ツール開発", label: "BUSINESS & TOOLS", title: "業務改善・ツール開発",
    summary: "手作業を整理し、AI・自動化・小さな専用ツールで時間とミスを減らします。",
    description: "時間がかかる作業、重複入力、Excel・CSV加工、Webサイトへの登録、情報収集、レポート作成などを整理します。既存ツールの活用から小規模な専用ツール開発まで、効果が見込める範囲から改善します。",
    price: "30,000円〜", period: "1〜4週間目安",
    deliverables: ["現状業務・手順・例外の整理", "既存ツール・AI・自動化の比較", "小規模Webツール・データ変換ツール", "API連携・定型レポート生成"],
    recommendedFor: ["同じ作業を毎回繰り返している", "ExcelやCSV処理に時間がかかる", "自社の業務に合う小さなツールがほしい"],
    solvedIssues: ["手作業の時間と入力ミスを減らす", "既製品に業務を無理に合わせない", "必要な機能だけを小さく導入する"],
    steps: ["現在の作業手順とデータを確認", "自動化する範囲と例外を整理", "試作・確認・調整", "納品・操作説明・運用確認"],
    faq: [
      { question: "どの作業が自動化できるか分かりません。", answer: "実際の作業手順を確認し、効果が見込める部分と人の判断を残す部分を整理します。" },
      { question: "既存サービスとのAPI連携もできますか？", answer: "利用可能な連携手段と規約を確認したうえで、対応可否をご案内します。" },
    ],
  },
];

export const priceGroups = [
  { title: "Web制作", items: [
    { name: "ランディングページ", price: "80,000円〜" }, { name: "小規模Webサイト", price: "150,000円〜" },
    { name: "更新機能付きWebサイト", price: "250,000円〜" }, { name: "運用オプション", price: "月額9,800円〜" },
  ] },
  { title: "SEO解析", items: [
    { name: "SEO・アクセス解析", price: "19,800円〜" }, { name: "LLMO対応", price: "SEO解析に包括" },
  ] },
  { title: "SNS運用・広告", items: [
    { name: "SNS運用支援", price: "個別見積もり" }, { name: "Web広告運用・相談", price: "個別見積もり" },
  ] },
  { title: "業務改善・ツール開発", items: [
    { name: "初回相談", price: "無料" }, { name: "小規模ツール", price: "30,000円〜" },
    { name: "自動化・API連携", price: "個別見積もり" },
  ] },
] as const;

export const tools = [
  { title: "title・description確認", category: "SEO", summary: "検索結果に表示される文字数と内容を確認。", status: "開発予定", type: "無料ツール" },
  { title: "robots.txt生成", category: "TECH", summary: "基本設定を選び、robots.txtのたたき台を生成。", status: "開発予定", type: "無料ツール" },
  { title: "公開前チェックリスト", category: "QUALITY", summary: "公開前に確認したい項目を抜け漏れなく整理。", status: "準備中", type: "テンプレート" },
  { title: "Web担当者向けAIプロンプト", category: "AI", summary: "要件整理・調査・文章作成に使える雛形。", status: "準備中", type: "AIプロンプト" },
] as const;

export const faqs = [
  { question: "何を依頼すべきか決まっていなくても相談できますか？", answer: "はい。現在のお悩み、実現したいこと、予算感を伺い、必要な対応と優先順位を一緒に整理します。" },
  { question: "小さな修正や相談だけでも依頼できますか？", answer: "はい。スポット更新、簡易診断、広告やAI活用の相談など、小規模なご相談から対応します。" },
  { question: "Webサイトに掲載する内容も考えてもらえますか？", answer: "事業内容とユーザーが知りたい情報を確認し、ページ構成と掲載項目の整理から支援します。" },
  { question: "制作後の更新や集客も依頼できますか？", answer: "はい。公開後の更新、アクセス解析、SEO、SNSや広告の相談まで継続して支援します。" },
  { question: "AIや自動化に詳しくなくても相談できますか？", answer: "専門知識は不要です。現在行っている作業を伺い、効果が見込める方法から整理します。" },
  { question: "料金はいつ確定しますか？", answer: "相談内容と対象範囲を確認後、作業内容、料金、スケジュールをご提示します。合意前に作業を開始することはありません。" },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
