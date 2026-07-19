export type GuideArticle = { title: string; summary: string; href?: string };
export type GuideStep = {
  number: string;
  slug: string;
  title: string;
  description: string;
  topics: string;
  tools: string;
  articles: GuideArticle[];
};

export const guideSteps: GuideStep[] = [
  { number:"01", slug:"web-basics", title:"Webとインターネットの基本", description:"Webサイトが表示されるまでの全体像を理解します。", topics:"Web・インターネット・ブラウザ・URL・HTTP", tools:"Chrome・ブラウザ開発者ツール", articles:[
    {title:"Webとは何か",summary:"Webとインターネットの違いから、Webの役割を理解します。"},
    {title:"Webサイトが表示される仕組み",summary:"URL入力からページ表示までの通信の流れを追います。"},
    {title:"ブラウザの役割",summary:"HTMLの取得・解析・描画をブラウザがどう行うか学びます。"},
    {title:"URLとドメインの基本",summary:"URLを構成する要素と、それぞれの意味を整理します。"},
    {title:"HTTPリクエストとレスポンス",summary:"ブラウザとサーバーが情報をやり取りする基本です。"},
    {title:"HTTPステータスコード",summary:"200、301、403、404、500、503などを実務目線で確認します。",href:"/articles/http-status-code-basics-for-web-directors"},
  ]},
  { number:"02", slug:"html-css", title:"HTML・CSSとWeb制作", description:"ページの構造と見た目がどのように作られるかを学びます。", topics:"HTML・CSS・レスポンシブ・アクセシビリティ", tools:"VS Code・Figma・GitHub", articles:[
    {title:"HTMLの役割と基本構造",summary:"見出し、段落、リンクなど、文書構造の基本を学びます。"},
    {title:"CSSの役割と適用方法",summary:"見た目を制御する仕組みと、スタイルの優先順位を理解します。"},
    {title:"レスポンシブWebデザイン",summary:"画面幅に応じてレイアウトを変える考え方を学びます。"},
    {title:"セマンティックHTML",summary:"意味に合った要素を使う理由と実務上の効果を整理します。"},
    {title:"Webアクセシビリティ入門",summary:"多様な利用者が使えるWebサイトの基本を理解します。"},
    {title:"Figmaから実装へ渡す情報",summary:"デザインデータを制作工程へ正しく引き継ぐ方法を学びます。"},
  ]},
  { number:"03", slug:"javascript-api", title:"JavaScript・API・データ", description:"ページの処理と、外部サービスからデータを取得する仕組みを学びます。", topics:"JavaScript・API・JSON・データベース", tools:"Node.js・Postman・GitHub", articles:[
    {title:"JavaScriptとは",summary:"HTML・CSSとの違いと、ブラウザ上での役割を理解します。"},
    {title:"DOMとイベント",summary:"ページ要素を取得し、クリックなどの操作に反応する仕組みです。"},
    {title:"APIとは",summary:"サービス同士が機能やデータをやり取りする仕組みを学びます。",href:"/articles/api-basics"},
    {title:"JSONの読み方",summary:"APIやCMSで頻繁に扱うデータ形式の基本です。"},
    {title:"データベースの役割",summary:"情報を保存・検索・更新する基本的な考え方を学びます。"},
    {title:"フロントエンドとバックエンド",summary:"Webシステムを構成する役割の違いを整理します。"},
  ]},
  { number:"04", slug:"server-cloud", title:"サーバー・ドメイン・クラウド", description:"Webサイトをインターネットへ公開する仕組みを理解します。", topics:"サーバー・DNS・SSL・CDN・キャッシュ・S3", tools:"Cloudflare・AWS・Vercel・Netlify", articles:[
    {title:"Webサーバーとは",summary:"ファイルや処理結果をブラウザへ返すサーバーの役割です。"},
    {title:"DNSと名前解決",summary:"ドメイン名から接続先を特定する仕組みを学びます。",href:"/articles/dns-basics"},
    {title:"HTTPSとSSL/TLS",summary:"通信を暗号化し、接続先を証明する仕組みを理解します。"},
    {title:"CDNとキャッシュ",summary:"コンテンツを高速・安定して配信する仕組みを学びます。"},
    {title:"クラウドとは",summary:"AWSなどのクラウドサービスが提供する機能を整理します。"},
    {title:"S3とオブジェクトストレージ",summary:"ファイルをAPIで保存・取得するストレージの考え方です。"},
    {title:"Cloudflareの基本",summary:"DNS、CDN、セキュリティなど主要機能の関係を理解します。"},
    {title:"VercelとWebホスティング",summary:"GitHubと連携したデプロイやプレビューの仕組みを学びます。"},
  ]},
  { number:"05", slug:"cms-operation", title:"CMSとサイト運用", description:"更新しやすいサイトを作り、運用するための仕組みを学びます。", topics:"CMS・静的生成・ヘッドレスCMS・公開フロー", tools:"WordPress・microCMS・Movable Type・WebRelease", articles:[
    {title:"CMSとは",summary:"CMSを導入する目的と、静的サイトとの違いを理解します。"},
    {title:"動的CMSと静的CMS",summary:"ページ生成のタイミングによる特徴の違いを整理します。"},
    {title:"ヘッドレスCMSとは",summary:"コンテンツ管理と画面表示を分離する構成を学びます。"},
    {title:"WordPressの特徴",summary:"利用範囲が広いCMSの構成・利点・注意点を整理します。"},
    {title:"microCMSの特徴",summary:"APIベースでコンテンツを配信する国産CMSを理解します。"},
    {title:"Movable TypeとWebRelease",summary:"静的出力型CMSと企業サイト運用の関係を学びます。"},
    {title:"CMSの公開承認フロー",summary:"下書き、確認、承認、公開の役割と設計を整理します。"},
  ]},
  { number:"06", slug:"seo-search", title:"SEOと検索の仕組み", description:"検索エンジンに見つけてもらい、適切に評価される考え方を学びます。", topics:"クロール・インデックス・検索意図・Core Web Vitals", tools:"Search Console・Lighthouse・Ahrefs", articles:[
    {title:"検索エンジンの仕組み",summary:"クロール、インデックス、ランキングの流れを理解します。"},
    {title:"titleタグの役割",summary:"検索結果とページ内容をつなぐタイトル設計を学びます。",href:"/articles/title-tag"},
    {title:"検索意図とは",summary:"ユーザーが検索した目的をコンテンツへ反映する考え方です。",href:"/articles/search-intent"},
    {title:"内部リンクとサイト構造",summary:"ページ同士をつなぎ、情報を見つけやすくする設計です。"},
    {title:"Core Web Vitals",summary:"表示速度と操作性を測る主要指標を理解します。"},
    {title:"Search Consoleの基本",summary:"検索パフォーマンスとインデックス状況の確認方法を学びます。"},
    {title:"SEO調査ツールの使い分け",summary:"LighthouseやAhrefsなどの役割を整理します。"},
  ]},
  { number:"07", slug:"analytics-improvement", title:"アクセス解析と改善", description:"ユーザー行動を数字で捉え、改善点を見つける方法を学びます。", topics:"KPI・イベント・流入・CV・ヒートマップ", tools:"GA4・Search Console・Microsoft Clarity", articles:[
    {title:"アクセス解析とは",summary:"数値を収集する目的と改善につなげる基本を理解します。"},
    {title:"GA4の基本構造",summary:"ユーザー、セッション、イベントの関係を整理します。",href:"/articles/ga4-first-metrics"},
    {title:"KPIとKGIの設定",summary:"事業目標とWebサイトの指標をつなげる方法を学びます。"},
    {title:"コンバージョン設計",summary:"成果とみなすユーザー行動を定義し、計測します。"},
    {title:"流入経路の読み方",summary:"検索、広告、SNS、参照元などの違いを理解します。"},
    {title:"ヒートマップの見方",summary:"クリックやスクロールから改善仮説を作る方法です。"},
  ]},
  { number:"08", slug:"marketing-ux", title:"WebマーケティングとUX", description:"集客から成果までの導線を設計し、ユーザー体験を改善します。", topics:"ペルソナ・カスタマージャーニー・広告・LTV・UX", tools:"Figma・GA4・広告管理ツール", articles:[
    {title:"Webマーケティングとは",summary:"集客、接客、成果、継続の全体像を理解します。"},
    {title:"ペルソナの考え方",summary:"対象ユーザーを具体化し、判断基準をそろえます。"},
    {title:"カスタマージャーニー",summary:"認知から利用までの行動・感情・接点を整理します。",href:"/articles/customer-journey"},
    {title:"UXとUIの違い",summary:"体験全体と画面設計の関係を理解します。"},
    {title:"コンバージョン改善",summary:"課題発見から仮説、施策、検証までの流れを学びます。",href:"/articles/site-improvement"},
    {title:"LTV・CPA・ROAS",summary:"マーケティング施策の費用対効果を判断する指標です。"},
  ]},
  { number:"09", slug:"ai-consulting", title:"AI活用とWebコンサル", description:"知識をつなげ、課題整理・提案・実行・検証に活用します。", topics:"要件整理・仮説・施策・効果検証・AI活用", tools:"ChatGPT・Claude・Gemini", articles:[
    {title:"生成AIの基本",summary:"大規模言語モデルの特徴と、得意・不得意を理解します。"},
    {title:"ChatGPT・Claude・Geminiの違い",summary:"代表的な生成AIサービスの特徴と使い分けを整理します。"},
    {title:"Web制作でのAI活用",summary:"調査、構成、実装、検品、運用での使い方を学びます。",href:"/articles/ai-content-workflow"},
    {title:"Webサイトの課題整理",summary:"現状、原因、施策を分けて考える方法を学びます。"},
    {title:"改善提案の組み立て方",summary:"根拠・優先順位・効果測定を含む提案へ整理します。"},
    {title:"Webコンサルの業務",summary:"調査、戦略、実行支援、検証の役割を理解します。"},
  ]},
];

export function getGuideStep(slug: string) { return guideSteps.find((step) => step.slug === slug); }
