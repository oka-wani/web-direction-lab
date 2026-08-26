const text = (value: unknown) => String(value ?? "").trim();

export type ProposalSectionType =
  | "HERO"
  | "LEAD"
  | "3-COLUMN"
  | "CARD-GRID"
  | "LIST"
  | "COMPARISON"
  | "STEP-FLOW"
  | "FAQ"
  | "CTA"
  | "FORM"
  | "PROFILE"
  | "GALLERY"
  | "ACCESS";

export type BlueprintKey =
  | "top"
  | "service"
  | "about"
  | "works"
  | "price"
  | "flow"
  | "faq"
  | "access"
  | "contact"
  | "utility"
  | "generic";

export type BlueprintSlot = {
  type: ProposalSectionType;
  heading: string;
  intent: string;
  itemCount?: number;
};

export const PAGE_BLUEPRINTS: Record<BlueprintKey, BlueprintSlot[]> = {
  top: [
    { type: "HERO", heading: "第一印象と主な価値", intent: "対象者に、自分に関係するサイトだと短時間で理解してもらう" },
    { type: "3-COLUMN", heading: "選ばれる理由", intent: "代表的な強みを3点に整理して比較しやすくする", itemCount: 3 },
    { type: "CARD-GRID", heading: "サービス・商品の入口", intent: "詳細ページへ進むための選択肢を視覚的に示す", itemCount: 3 },
    { type: "PROFILE", heading: "人・実績による信頼", intent: "担当者や実績を示し、問い合わせ前の不安を減らす" },
    { type: "STEP-FLOW", heading: "利用・相談の流れ", intent: "相談後の進み方を見せて行動のハードルを下げる", itemCount: 4 },
    { type: "CTA", heading: "お問い合わせへの導線", intent: "ページを理解した人が迷わず次の行動へ進めるようにする" },
  ],
  service: [
    { type: "HERO", heading: "サービスの概要", intent: "誰に何を提供するサービスかを最初に明確にする" },
    { type: "LEAD", heading: "悩みと提供価値", intent: "対象者の課題とサービスが解決できることをつなぐ" },
    { type: "3-COLUMN", heading: "特徴・強み", intent: "比較検討で重要な特徴を3点に整理する", itemCount: 3 },
    { type: "LIST", heading: "内容・対応範囲", intent: "提供内容と対象範囲を具体的に確認できるようにする", itemCount: 4 },
    { type: "STEP-FLOW", heading: "利用の流れ", intent: "利用開始までの手順を具体化する", itemCount: 4 },
    { type: "CTA", heading: "相談・申し込み", intent: "サービス理解後の行動先を明確にする" },
  ],
  about: [
    { type: "HERO", heading: "私たちについて", intent: "組織や事業の存在意義を簡潔に伝える" },
    { type: "LEAD", heading: "考え方・方針", intent: "大切にしている姿勢を言葉で伝える" },
    { type: "PROFILE", heading: "代表・チーム紹介", intent: "誰が対応するかを見せて安心感をつくる" },
    { type: "LIST", heading: "組織・事業情報", intent: "検討に必要な基本情報を読みやすく整理する", itemCount: 4 },
    { type: "CTA", heading: "お問い合わせへの導線", intent: "共感や信頼を次の行動につなげる" },
  ],
  works: [
    { type: "HERO", heading: "実績・事例", intent: "どのような成果物や支援実績があるかを示す" },
    { type: "GALLERY", heading: "事例一覧", intent: "複数の事例を視覚的に比較できるようにする", itemCount: 4 },
    { type: "LIST", heading: "事例の詳細", intent: "背景・対応内容・結果を順序立てて説明する", itemCount: 3 },
    { type: "CTA", heading: "相談への導線", intent: "近い事例を見た人が相談へ進めるようにする" },
  ],
  price: [
    { type: "HERO", heading: "料金・プラン", intent: "料金ページで確認できる内容を明確にする" },
    { type: "COMPARISON", heading: "プラン比較", intent: "価格と含まれる内容の違いを比較しやすくする", itemCount: 3 },
    { type: "LIST", heading: "料金に含まれる内容", intent: "見積もり前に基本範囲を確認できるようにする", itemCount: 4 },
    { type: "FAQ", heading: "料金に関する質問", intent: "追加費用などの不安を事前に解消する", itemCount: 3 },
    { type: "CTA", heading: "見積もり・相談", intent: "条件を確認した人の相談先を示す" },
  ],
  flow: [
    { type: "HERO", heading: "ご利用の流れ", intent: "依頼から完了までを確認できるページだと伝える" },
    { type: "STEP-FLOW", heading: "お申し込みから完了まで", intent: "各段階の行動と準備事項を順番で示す", itemCount: 5 },
    { type: "FAQ", heading: "進行に関する質問", intent: "期間や準備に関する不安を解消する", itemCount: 3 },
    { type: "CTA", heading: "最初の相談", intent: "流れを理解した人が開始できるようにする" },
  ],
  faq: [
    { type: "HERO", heading: "よくある質問", intent: "検討中の疑問をまとめて確認できると伝える" },
    { type: "FAQ", heading: "ご相談前の質問", intent: "問い合わせ前に生じやすい疑問を解消する", itemCount: 5 },
    { type: "CTA", heading: "解決しない場合の相談", intent: "個別質問の問い合わせ先を示す" },
  ],
  access: [
    { type: "HERO", heading: "アクセス", intent: "所在地と来訪方法を確認できると伝える" },
    { type: "ACCESS", heading: "所在地・交通案内", intent: "地図・住所・交通手段を一か所にまとめる" },
    { type: "LIST", heading: "営業時間・来訪時の案内", intent: "訪問前に必要な情報を整理する", itemCount: 3 },
    { type: "CTA", heading: "予約・お問い合わせ", intent: "来訪前の連絡先を明確にする" },
  ],
  contact: [
    { type: "LEAD", heading: "お問い合わせ前の案内", intent: "回答目安や注意事項を伝えて安心して入力できるようにする" },
    { type: "FORM", heading: "お問い合わせフォーム", intent: "必要十分な項目で相談内容を受け付ける", itemCount: 5 },
    { type: "FAQ", heading: "送信前の補足", intent: "返信や個人情報に関する疑問を解消する", itemCount: 2 },
  ],
  utility: [
    { type: "LEAD", heading: "方針の概要", intent: "このページに記載する方針の対象を明確にする" },
    { type: "LIST", heading: "方針・規定本文", intent: "必要な項目を見出し単位で読みやすく整理する", itemCount: 5 },
  ],
  generic: [
    { type: "HERO", heading: "ページの概要", intent: "ページで得られる情報を最初に伝える" },
    { type: "LEAD", heading: "背景・導入", intent: "読み手の課題と掲載内容をつなぐ" },
    { type: "3-COLUMN", heading: "主なポイント", intent: "重要な内容を3点に整理する", itemCount: 3 },
    { type: "LIST", heading: "詳細情報", intent: "検討に必要な情報を具体的に示す", itemCount: 4 },
    { type: "CTA", heading: "次の行動", intent: "読了後に進む先を明確にする" },
  ],
};

export function classifyPage(page: any): BlueprintKey {
  const key = `${text(page?.slug)} ${text(page?.label)} ${text(page?.title)}`.toLowerCase();
  if (page?.pageType === "utility" || /privacy|policy|terms|legal|プライバシー|個人情報|利用規約/.test(key)) return "utility";
  if (/^top\b|\bhome\b|トップ|ホーム/.test(key)) return "top";
  if (/contact|inquiry|otoiawase|お問い合わせ|お問合せ|ご相談/.test(key)) return "contact";
  if (/price|pricing|fee|plan|料金|価格|プラン/.test(key)) return "price";
  if (/works|case|portfolio|gallery|実績|事例|制作例/.test(key)) return "works";
  if (/about|company|profile|staff|team|私たち|会社|組織|代表|スタッフ/.test(key)) return "about";
  if (/service|menu|product|course|サービス|商品|メニュー|事業/.test(key)) return "service";
  if (/flow|process|guide|流れ|ご利用方法|進め方/.test(key)) return "flow";
  if (/faq|question|よくある質問/.test(key)) return "faq";
  if (/access|location|shop|アクセス|店舗|所在地/.test(key)) return "access";
  return "generic";
}

export function blueprintSummary() {
  return (Object.entries(PAGE_BLUEPRINTS) as [BlueprintKey, BlueprintSlot[]][])
    .map(([key, slots]) => `${key}: ${slots.map((slot) => `${slot.type}「${slot.heading}」`).join(" → ")}`)
    .join("\n");
}

