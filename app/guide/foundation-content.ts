import { articleItems } from "../articles/article-data";
import type { GuideArticle, GuideStep } from "./guide-data";

type Source = { name: string; url: string };
type Term = { term: string; description: string };

type StepProfile = {
  importance: string;
  practice: string;
  checks: string[];
  pitfalls: string[];
  terms: Term[];
  sources: Source[];
  categories: string[];
  visual: "website" | "system" | "analytics";
};

const profiles: Record<string, StepProfile> = {
  "web-basics": {
    importance: "Webの通信と表示の流れを理解すると、画面上の不具合を見たときに、ブラウザ・ネットワーク・サーバーのどこを確認すべきか切り分けやすくなります。",
    practice: "ブラウザの開発者ツールを開き、実際のURL、通信、レスポンス、表示結果を対応付けて確認します。",
    checks: ["用語の定義だけでなく、前後の処理とのつながりを確認する", "ブラウザの開発者ツールで実際の通信や表示を観察する", "正常時とエラー時の違いを記録する"],
    pitfalls: ["インターネットとWebを同じ意味で扱う", "画面の問題をすべてHTMLやCSSの問題だと決めつける", "URL・通信・サーバーの関係を分けずに調査する"],
    terms: [{ term:"ブラウザ", description:"Web上の情報を取得・解析し、利用者が操作できる画面として表示するソフトウェアです。" }, { term:"HTTP", description:"ブラウザとWebサーバーが情報をやり取りするための代表的な通信ルールです。" }, { term:"URL", description:"Web上の情報がどこにあり、どの方法で取得するかを示す住所のような情報です。" }],
    sources: [{ name:"MDN Web Docs", url:"https://developer.mozilla.org/ja/docs/Web" }, { name:"HTML Standard（WHATWG）", url:"https://html.spec.whatwg.org/" }],
    categories:["システム", "Web制作"], visual:"system",
  },
  "html-css": {
    importance: "構造・見た目・操作を分けて考えられると、デザインの意図を保ちながら、保守しやすくアクセシブルなページを実装できます。",
    practice: "見出し構造、キーボード操作、画面幅ごとの変化、画像やフォントの読み込みを実際のページで確認します。",
    checks: ["HTMLの意味と見た目の指定を分ける", "PCだけでなくスマートフォンとキーボード操作でも確認する", "再利用と変更のしやすさを考えて実装する"],
    pitfalls: ["見た目だけを合わせて文書構造を崩す", "特定の画面幅やブラウザだけで確認を終える", "共通化しすぎて用途の違いを表現できなくする"],
    terms: [{ term:"セマンティクス", description:"要素の見た目ではなく、見出し・ナビゲーションなど情報の意味を適切に表す考え方です。" }, { term:"レスポンシブ", description:"画面幅や利用環境に応じて、読みやすく操作しやすい表示へ調整する設計です。" }, { term:"アクセシビリティ", description:"年齢や障害、利用環境にかかわらず情報や機能を利用できるようにする考え方です。" }],
    sources: [{ name:"MDN HTML", url:"https://developer.mozilla.org/ja/docs/Web/HTML" }, { name:"W3C WCAG Overview", url:"https://www.w3.org/WAI/standards-guidelines/wcag/" }],
    categories:["Web制作"], visual:"website",
  },
  "javascript-api": {
    importance: "画面上の処理とデータの流れを理解すると、外部サービス連携や動的なUIの要件を、入力・処理・出力・エラーに分けて整理できます。",
    practice: "小さな入力と出力を用意し、成功時だけでなく通信失敗や不正なデータが返った場合の動作も確認します。",
    checks: ["入力・処理・出力を分けて考える", "非同期処理では待機中・成功・失敗の状態を用意する", "外部データをそのまま信用せず形式と権限を確認する"],
    pitfalls: ["成功するケースだけを前提にする", "認証情報を画面側のコードへ直接書く", "ライブラリを目的や依存関係を確認せず追加する"],
    terms: [{ term:"JavaScript", description:"Webページの操作やデータ処理など、動的な振る舞いを実装するプログラミング言語です。" }, { term:"API", description:"別のシステムから機能やデータを利用するために公開された窓口とルールです。" }, { term:"JSON", description:"キーと値の組み合わせでデータを表す、API連携でよく使われる形式です。" }],
    sources: [{ name:"MDN JavaScript", url:"https://developer.mozilla.org/ja/docs/Web/JavaScript" }, { name:"Node.js Documentation", url:"https://nodejs.org/docs/latest/api/" }, { name:"OWASP Top 10", url:"https://owasp.org/www-project-top-ten/" }],
    categories:["システム", "AI活用"], visual:"system",
  },
  "server-cloud": {
    importance: "公開環境の構成を理解すると、表示できない、遅い、更新が反映されないといった問題を、DNS・配信・サーバー・キャッシュに分けて判断できます。",
    practice: "構成図に利用サービス、接続先、データの保存場所、責任範囲を書き出し、変更時の影響を確認します。",
    checks: ["どのサービスが何を担当しているかを構成図にする", "本番・検証・開発環境の違いを確認する", "障害時の確認先と復旧手順を事前に決める"],
    pitfalls: ["クラウドという言葉だけで安全性や可用性を判断する", "DNS・CDN・サーバーの責任範囲を混同する", "バックアップを取得するだけで復旧確認を行わない"],
    terms: [{ term:"DNS", description:"ドメイン名を接続先の情報へ結び付ける仕組みです。" }, { term:"CDN", description:"利用者に近い拠点などからコンテンツを配信し、速度と安定性を高める仕組みです。" }, { term:"クラウド", description:"サーバー、ストレージ、ネットワークなどを必要に応じて利用できるサービス群です。" }],
    sources: [{ name:"Cloudflare Developer Docs", url:"https://developers.cloudflare.com/" }, { name:"Amazon S3 User Guide", url:"https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html" }],
    categories:["システム"], visual:"system",
  },
  "cms-operation": {
    importance: "CMSは画面を作る道具ではなく、誰が・何を・どの手順で更新するかを支える仕組みです。運用要件から考えることで、公開後も安全に改善できるサイトになります。",
    practice: "更新者、承認者、公開担当の役割と、入力・確認・公開・差し戻しの流れを実際の運用に沿って整理します。",
    checks: ["更新する情報を構造化し、入力項目と表示を分ける", "権限・承認・公開・履歴の流れを確認する", "移行、バックアップ、保守まで含めて選定する"],
    pitfalls: ["機能数だけでCMSを選ぶ", "制作時の都合だけで入力画面を設計する", "公開後の権限管理や保守費用を要件から外す"],
    terms: [{ term:"CMS", description:"専門的なコード編集を減らし、コンテンツの作成・管理・公開を支援する仕組みです。" }, { term:"コンテンツモデル", description:"タイトル、本文、画像など、管理する情報の種類と関係を定義したものです。" }, { term:"ワークフロー", description:"下書き、確認、承認、公開などの作業順と担当を定めた流れです。" }],
    sources: [{ name:"WordPress Documentation", url:"https://wordpress.org/documentation/" }, { name:"microCMS Documentation", url:"https://document.microcms.io/" }],
    categories:["Web制作", "システム"], visual:"website",
  },
  "seo-search": {
    importance: "検索エンジンのためだけでなく、利用者が必要な情報を見つけ、内容を理解できる構造を作ることがSEOの土台です。技術・コンテンツ・評価を分けて考える必要があります。",
    practice: "検索結果、Search Console、クロール可能性、ページの内容と内部リンクを確認し、仮説と変更結果を記録します。",
    checks: ["検索意図とページの目的を一致させる", "クロール・インデックス・検索結果表示を分けて確認する", "順位だけでなく流入後の行動と成果を見る"],
    pitfalls: ["キーワードの出現回数だけを増やす", "インデックス登録と上位表示を同じ意味で扱う", "施策前後の条件をそろえず効果を判断する"],
    terms: [{ term:"クロール", description:"検索エンジンがリンクなどをたどってWeb上のページを発見・取得する処理です。" }, { term:"インデックス", description:"取得したページの内容を解析し、検索に利用できる情報として保存する処理です。" }, { term:"検索意図", description:"利用者が検索を通して知りたいこと、比較したいこと、実行したいことです。" }],
    sources: [{ name:"Google Search Central", url:"https://developers.google.com/search/docs" }, { name:"Search Console スタートガイド", url:"https://developers.google.com/search/docs/monitor-debug/search-console-start" }],
    categories:["SEO"], visual:"website",
  },
  "analytics-improvement": {
    importance: "アクセス解析は数字を集めることではなく、事業や利用者に関する問いへ答え、次の改善を判断するために行います。計測条件と比較軸が結果の信頼性を左右します。",
    practice: "目的からKPIと必要なイベントを決め、計測確認、比較、原因仮説、施策、再計測の順で記録します。",
    checks: ["最初に答えたい問いと判断を決める", "指標の定義・期間・対象・計測条件をそろえる", "数値の変化を施策と次の行動へつなげる"],
    pitfalls: ["見やすい数字だけを並べて判断につなげない", "計測設定の変更や欠損を確認しない", "相関だけを見て原因だと断定する"],
    terms: [{ term:"KPI", description:"目標達成までの進み具合を継続的に確認するための重要な指標です。" }, { term:"イベント", description:"ページ閲覧、クリック、送信など、利用者の行動を計測する単位です。" }, { term:"セグメント", description:"条件に合う利用者や訪問を分け、特徴や違いを比較する考え方です。" }],
    sources: [{ name:"Google Analytics Developers", url:"https://developers.google.com/analytics" }, { name:"Google Search Central", url:"https://developers.google.com/search/docs" }],
    categories:["アクセス解析", "マーケティング"], visual:"analytics",
  },
  "marketing-ux": {
    importance: "集客施策と画面改善を別々に考えず、利用者が知る・理解する・比較する・行動するまでの体験として設計すると、成果と使いやすさを両立できます。",
    practice: "対象ユーザー、利用場面、必要な情報、迷いやすい点、期待する行動を整理し、調査と計測で仮説を確認します。",
    checks: ["事業目標とユーザーの目的を両方確認する", "行動だけでなく、その前後の疑問や不安を整理する", "施策の対象・仮説・評価指標をセットにする"],
    pitfalls: ["架空のペルソナを事実のように扱う", "短期的なクリックだけを増やして体験を損なう", "調査せず社内の想像だけでユーザーを決める"],
    terms: [{ term:"UX", description:"サービスを知ってから利用した後までを含む、利用者の体験全体です。" }, { term:"タッチポイント", description:"広告、検索、Webページ、問い合わせなど、利用者とサービスが接する場所です。" }, { term:"コンバージョン", description:"問い合わせ、購入、申込みなど、サイトの目的に対応する行動です。" }],
    sources: [{ name:"W3C Web Accessibility Initiative", url:"https://www.w3.org/WAI/" }, { name:"Google Analytics Developers", url:"https://developers.google.com/analytics" }],
    categories:["マーケティング", "Web制作"], visual:"analytics",
  },
  "ai-consulting": {
    importance: "AIや分析ツールは判断を支援しますが、目的、前提、品質基準、責任範囲を定めるのは人です。課題整理から検証まで一貫して設計することが、実務での価値につながります。",
    practice: "依頼内容、入力情報、期待する出力、確認方法、利用してはいけない情報を明文化し、人が最終判断する工程を残します。",
    checks: ["解決したい課題と成功条件を先に決める", "出力の根拠・最新性・権利・機密性を確認する", "施策の担当・期限・評価指標を明確にする"],
    pitfalls: ["AIの出力を事実確認せず利用する", "手段から考えて本来の課題を見失う", "提案後の実行責任と効果測定を決めない"],
    terms: [{ term:"仮説", description:"観察した事実から考えた原因や改善可能性を、検証できる形で表したものです。" }, { term:"要件", description:"目的を達成するために必要な機能、品質、制約、運用条件です。" }, { term:"ガバナンス", description:"品質・リスク・責任を管理するための方針、役割、ルール、確認体制です。" }],
    sources: [{ name:"NIST AI Risk Management Framework", url:"https://www.nist.gov/itl/ai-risk-management-framework" }, { name:"OWASP Top 10", url:"https://owasp.org/www-project-top-ten/" }],
    categories:["AI活用", "Web制作"], visual:"analytics",
  },
};

function getApproach(title: string) {
  if (/違い|比較|使い分け/.test(title)) return "比較する対象ごとに、目的・仕組み・管理範囲・費用・リスクの軸をそろえます。優劣を一つに決めるのではなく、案件の条件に合う選択肢を判断します。";
  if (/設計|要件|モデル|構造|ガイドライン/.test(title)) return "目的、利用者、入力、出力、制約、運用、評価方法の順で整理します。設計内容は図や表にし、関係者が同じ前提で判断できる状態にします。";
  if (/セキュリティ|XSS|CSRF|認証|権限|個人情報|同意/.test(title)) return "守る対象と扱うデータを特定し、起こり得る脅威、予防策、検知方法、発生時の対応を分けて考えます。対策は一度設定して終わりにせず、更新と監視を続けます。";
  if (/分析|解析|計測|KPI|KGI|GA4|Search Console|効果測定|レポート/.test(title)) return "最初に答えたい問いを決め、必要な指標、対象、期間、比較条件をそろえます。変化を見つけたら原因候補を分解し、次の施策で検証します。";
  if (/運用|管理|フロー|公開|バックアップ|監視|インシデント/.test(title)) return "担当、作業順、確認条件、承認、記録、異常時の連絡先を明確にします。通常時だけでなく、差し戻しや障害時にも迷わない手順にします。";
  if (/SEO|検索|クロール|インデックス|robots|canonical|リダイレクト|サイトマップ/.test(title)) return "検索する利用者、検索エンジンによる発見・理解、ページ内の情報設計を分けて確認します。変更前後の状態と検索パフォーマンスを記録し、結果から次の改善を決めます。";
  if (/AI|ChatGPT|Claude|Gemini|プロンプト/.test(title)) return "目的と利用範囲を決め、入力してよい情報、期待する出力、検証方法、人が判断する箇所を明文化します。出力は一次情報や実データと照合します。";
  return "定義、目的、構成要素、周辺の仕組みとの関係、実際の利用例の順に確認します。用語を覚えるだけでなく、自分の案件でどこに現れるかまで対応付けます。";
}

export function getFoundationContent(step: GuideStep, article: GuideArticle) {
  const profile = profiles[step.slug];
  const approach = getApproach(article.title);
  const related = articleItems
    .filter((item) => profile.categories.includes(item.category))
    .slice(0, article.href ? 2 : 3)
    .map((item) => ({ title:item.title, category:item.category, href:`/articles/${item.slug}` }));

  if (article.href && !related.some((item) => item.href === article.href)) {
    related.unshift({ title:`${article.title}を詳しく読む`, category:"関連ナレッジ", href:article.href });
  }

  return {
    visual: profile.visual,
    highlights: [article.summary, `「${article.title}」を${step.title}全体の中で捉える`, "目的・前提・確認方法をセットで実務へつなげる"],
    hero: { label:`STEP ${step.number}`, headline:`${article.title}の学習ポイント`, items:["役割と基本用語を理解する", "周辺の仕組みとの関係を整理する", "実務での確認方法を身に付ける"] },
    conclusion: `${article.summary} このページでは、用語の暗記で終わらず、${step.title}の中での位置付けと、実務で確認・判断するときの流れまで整理します。`,
    terms: profile.terms,
    sections: [
      { title:"まず理解したいこと", body:`${article.summary}\n\n**最初に確認するのは、この仕組みや考え方が何のためにあるかです。** 名称だけを覚えるのではなく、入力されるもの、行われる処理、得られる結果、関係する担当者やサービスを整理します。` },
      { title:"全体の中での位置付け", body:`${profile.importance}\n\n「${article.title}」だけを切り離して考えず、前後の工程や他の技術との関係を図にすると、判断が必要な箇所と確認先が分かりやすくなります。` },
      { title:"実務での確認手順", body:`${approach}\n\n${profile.practice}`, points:profile.checks },
      { title:"よくある失敗と対策", body:"知っている用語が増えても、目的や条件を確認せずに適用すると判断を誤ります。次の失敗例を自分の案件に置き換え、事前に確認できる項目へ変えておきます。", points:profile.pitfalls },
      { title:"仕事で使える形にする", body:`学んだ内容を、**説明できる・確認できる・判断できる**の3段階で残します。まず「${article.title}」を一文で説明し、次に実際のサイトや管理画面で該当箇所を探し、最後に条件が変わった場合の選択肢を比較します。\n\n調査結果には参照した資料、確認日、前提条件を残します。仕様やサービスは更新されるため、実務ではこのページだけで判断せず、下記の公式情報も確認してください。` },
    ],
    quiz: {
      question:`「${article.title}」を実務で扱うとき、最初に確認することはどれですか？`,
      choices:["目的と前提条件、周辺の仕組みとの関係", "画面の見た目だけ", "使われているツールの知名度だけ"],
      answer:"答えは「目的と前提条件、周辺の仕組みとの関係」です。手段だけで判断せず、何を解決し、どの工程や担当に影響するかを整理します。",
    },
    sources: profile.sources,
    related: related.slice(0, 3),
  };
}

export function getFoundationGlossaryTerms(stepSlug: string) {
  return profiles[stepSlug]?.terms ?? [];
}
