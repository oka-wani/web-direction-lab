import { SiteFooter, SiteHeader } from "../components/SiteChrome";

const includedItems = [
  ["5ページまでの制作", "トップページを含む5ページまで。6ページ目以降は、1ページにつき2,000円で追加できます。"],
  ["標準モジュール", "見出し、画像、カード、リスト、表、Q&Aなどを組み合わせ、内容に合ったページを制作します。"],
  ["レスポンシブ対応", "スマートフォン、タブレット、PCの画面幅に合わせて、読みやすく使いやすい表示へ調整します。"],
  ["SEO基本設定", "title、description、OGP、見出し構造、サイトマップなど、検索の土台となる設定を行います。"],
  ["アクセシビリティ", "見出し構造、代替テキスト、キーボード操作、コントラストなどに配慮して制作します。"],
  ["表示速度・品質確認", "画像の最適化、基本的な軽量化、主要ブラウザでの表示、リンク切れなどを確認します。"],
  ["セキュリティ・公開", "HTTPS、Cloudflare、基本的なセキュリティ設定を行い、本番環境へ公開します。"],
  ["デザイン調整・修正", "標準デザインをもとに配色・文字・画像を調整し、方針確定後の修正2回まで対応します。"],
] as const;

const options = [
  ["ページ追加", "6ページ目以降のページ制作。", "2,000円／1ページ"],
  ["お問い合わせフォーム", "送信、管理者通知、自動返信、Bot対策を含むフォーム。", "個別見積"],
  ["CMS・更新機能", "お知らせ、実績、商品、FAQなどをお客様側で更新できる仕組み。", "個別見積"],
  ["独自モジュール・動き", "標準にないレイアウト、アニメーション、JavaScriptを使った機能。", "個別見積"],
  ["アクセス解析", "GTM、GA4、Search Console、Clarityなどの初期設定。", "個別見積"],
  ["原稿・画像・ロゴ制作", "原稿作成、図版や画像の加工、ロゴ制作などの素材準備。", "個別見積"],
  ["外部サービス連携", "予約、決済、地図、SNS、多言語など外部サービスとの連携。", "個別見積"],
  ["公開後の保守・更新", "公開後の軽微な修正、情報更新、技術メンテナンス。", "個別見積"],
] as const;

const moduleGroups = [
  ["文章を伝える", ["見出し", "本文・リード文", "注釈", "注意・警告表示"]],
  ["情報を整理する", ["カード", "ボックス", "箇条書き", "番号・ステップ", "Q&A", "テーブル"]],
  ["行動につなげる", ["ボタン", "リンク", "お問い合わせ案内", "ダウンロード案内", "SNSリンク"]],
  ["見せ方を整える", ["画像・動画", "バッジ", "複数カラム", "画像＋テキスト", "ページ内ナビゲーション"]],
] as const;

export default function PricingPage() {
  return <main className="order-page package-page"><SiteHeader current="pricing" />
    <div className="platform-breadcrumb"><a href="/">トップ</a><span>›</span><span>料金・プラン</span></div>

    <section className="package-hero" id="basic-package">
      <div className="package-hero-copy"><span>PRICING</span><h1>料金・プラン</h1><p>まずは5ページまでの基本制作パッケージ。必要なページや機能だけを、追加オプションとして組み合わせます。</p><div className="order-actions"><a className="order-primary-link" href="/contact">無料で相談する <b>→</b></a><a className="order-secondary-link" href="#options">オプションを見る <b>↓</b></a></div></div>
      <dl className="package-price-panel"><div><dt>基本制作パッケージ</dt><dd><strong>30,000</strong><span>円</span></dd></div><div><dt>制作ページ数</dt><dd><strong>5</strong><span>ページまで</span></dd></div><div><dt>ページ追加</dt><dd><strong>2,000</strong><span>円／ページ</span></dd></div></dl>
    </section>

    <section className="order-section order-section--tint" id="options"><div className="order-section-heading"><div><span>OPTIONS</span><h2>追加オプション</h2></div><p>基本パッケージに必要なものだけを追加できます。金額が未確定の項目は、内容を確認して発注前にお見積もりします。</p></div>
      <dl className="pricing-option-table">{options.map(([title, text, price]) => <div key={title}><dt>{title}</dt><dd>{text}</dd><strong>{price}</strong></div>)}</dl>
      <p className="package-note"><strong>追加料金の判断基準</strong><span>新しいHTML構造、CSS、JavaScript、外部サービス連携、素材制作が必要になるものを、原則としてオプション扱いとします。</span></p>
    </section>

    <section className="order-section" id="included"><div className="order-section-heading"><div><span>WHAT&apos;S INCLUDED</span><h2>基本料金に含まれること</h2></div><p>低価格を理由に、公開に必要な品質を省略しません。標準化した設計とモジュールを活用して、制作工数を抑えます。</p></div>
      <div className="package-included-list">{includedItems.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
    </section>

    <section className="order-section order-section--tint"><div className="order-section-heading"><div><span>STANDARD MODULES</span><h2>組み合わせて使える標準モジュール</h2></div><p>掲載内容に合ったパーツを選び、配色・文字・画像を調整します。同じモジュールを複数回使っても追加料金はかかりません。</p></div>
      <div className="package-module-groups">{moduleGroups.map(([title, items]) => <section key={title}><h3>{title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>)}</div>
      <p className="package-note"><strong>標準対応の考え方</strong><span>既存モジュールの組み合わせ、テキスト・画像の差し替え、配色・余白・カラムの調整は基本料金に含まれます。</span></p>
    </section>

    <section className="order-section"><div className="order-section-heading"><div><span>EXAMPLE</span><h2>5ページの構成例</h2></div><p>業種や目的に合わせて、必要なページをヒアリング後に整理します。</p></div>
      <ol className="package-page-example"><li><span>01</span><b>トップ</b></li><li><span>02</span><b>サービス紹介</b></li><li><span>03</span><b>会社・店舗情報</b></li><li><span>04</span><b>よくある質問</b></li><li><span>05</span><b>お問い合わせ案内</b></li></ol>
      <p className="package-page-rule">原則として、1つのURLを1ページとして数えます。通常より情報量が多いページや、独自構成が必要な場合は事前に料金をご案内します。</p>
    </section>

    <section className="order-final-cta"><span>CONTACT</span><h2>必要なページとオプションを、一緒に整理できます。</h2><p>まだ内容が固まっていなくても大丈夫です。目的や事業内容を伺い、基本パッケージで対応できる範囲をご案内します。</p><div className="order-actions"><a className="order-primary-link" href="/contact">無料で相談する <b>→</b></a><a className="order-secondary-link" href="/flow">制作の流れを見る <b>→</b></a></div></section>
    <SiteFooter />
  </main>;
}
