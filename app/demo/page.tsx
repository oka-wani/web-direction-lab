import type { Metadata } from "../astro-compat";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "制作イメージ｜Wani san Web",
  description: "飲食店など業種別のWebサイト制作イメージを、必要情報・構成・デザイン・追加機能と一緒に紹介します。",
};

const pages = ["トップ", "メニュー", "店舗情報・アクセス", "こだわり・コンセプト", "お知らせ", "お問い合わせ・予約導線"];
const required = ["店名・ロゴ", "店舗写真・料理写真", "営業時間・住所", "メニュー・価格", "予約方法", "SNSアカウント（任意）"];
const options = ["Instagram連携", "Googleマップ", "お知らせ更新CMS", "予約サービスへの導線", "GA4 / Search Console", "問い合わせフォーム"];

export default function DemoPage() {
  return <main className="order-page"><SiteHeader current="demo" />
    <section className="order-page-hero"><span>PRODUCTION IMAGE</span><h1>依頼する前に、完成イメージを見る。</h1><p>業種や用途ごとに「必要な情報」「ページ構成」「デザインの方向性」「追加できる機能」をまとめています。丸ごと同じものを作るテンプレート販売ではなく、完成形を想像しやすくするための制作イメージです。</p></section>

    <section className="order-section" id="restaurant-demo">
      <div className="order-section-heading"><div><span>DEMO 01 / RESTAURANT</span><h2>飲食店サイト</h2></div><p>来店前に知りたい「どんなお店か」「何が食べられるか」「どこにあるか」「どう予約するか」を、迷わず確認できる構成を想定します。</p></div>
      <div className="order-demo-site" aria-label="飲食店サイトのデザインイメージ">
        <div className="order-demo-site-nav"><b>Restaurant Name</b><div><span>MENU</span><span>ABOUT</span><span>ACCESS</span><span>RESERVE</span></div></div>
        <div className="order-demo-site-hero"><div><small>SMALL RESTAURANT / TOKYO</small><h3>今日食べたい、を<br />すぐ見つけられる。</h3><p>料理の魅力とお店の空気感を伝えながら、メニュー・アクセス・予約へ短い導線でつなぎます。</p></div></div>
        <div className="order-demo-site-sections"><div><span>01 / MENU</span><b>写真と価格がすぐ分かる</b></div><div><span>02 / STORY</span><b>お店のこだわりを伝える</b></div><div><span>03 / ACCESS</span><b>営業時間・地図・予約へ</b></div></div>
      </div>
    </section>

    <section className="order-section order-section--tint">
      <div className="order-detail-grid"><div><span className="order-kicker">WHAT WE NEED</span><h2>制作時にご用意いただきたい情報</h2><p>すべて揃っていなくても相談できます。ヒアリングで不足している情報を整理し、何を準備すればよいか明確にします。</p><ul className="order-check-list">{required.map((item) => <li key={item}>{item}</li>)}</ul></div><div><span className="order-kicker">PAGE STRUCTURE</span><h2>想定ページ構成</h2><ol className="order-bullet-list">{pages.map((item, index) => <li key={item}>{String(index + 1).padStart(2, "0")}　{item}</li>)}</ol></div></div>
    </section>

    <section className="order-section">
      <div className="order-section-heading"><div><span>DESIGN &amp; FUNCTION</span><h2>デザインと機能は、案件に合わせて変えます。</h2></div><p>共通化するのは品質や構造です。色、写真の見せ方、余白、フォント、世界観は、店舗の雰囲気や客層に合わせて調整します。</p></div>
      <div className="order-quality-grid"><article className="order-quality-card"><small>DESIGN</small><h3>店舗らしさ</h3><p>高級感、親しみ、和、カフェ、ファミリー向けなど、ターゲットに合わせて見た目を調整します。</p></article><article className="order-quality-card"><small>MOBILE FIRST</small><h3>来店前のスマホ利用</h3><p>営業時間、アクセス、メニュー、予約など、外出中に見られやすい情報を特に確認しやすくします。</p></article><article className="order-quality-card"><small>CONVERSION</small><h3>予約・来店導線</h3><p>電話、予約サービス、問い合わせ、SNSなど、実際の来店につながる導線を分かりやすく設置します。</p></article></div>
      <h3 style={{ marginTop: "48px" }}>追加できる主な機能</h3><div className="order-subnav">{options.map((item) => <span key={item} style={{ padding: "10px 14px", border: "1px solid #d9e3df", borderRadius: "999px", fontSize: "13px", fontWeight: 700 }}>{item}</span>)}</div>
    </section>

    <section className="order-section order-section--tint">
      <div className="order-section-heading"><div><span>NEXT DEMOS</span><h2>制作イメージは順次追加します。</h2></div><p>業種ごとに必要な情報や導線が異なるため、単なる色違いではなく、それぞれの用途に合わせた構成例として整備します。</p></div>
      <div className="order-quality-grid"><article className="order-card"><small>SMALL CORPORATE</small><h3>小規模コーポレート</h3><p>事業内容、強み、会社情報、採用・問い合わせなどをコンパクトに整理。</p></article><article className="order-card"><small>SHOP / SCHOOL</small><h3>店舗・スクール</h3><p>料金、コース、講師・スタッフ、アクセス、FAQ、体験申込などを中心に設計。</p></article><article className="order-card"><small>SERVICE / LP</small><h3>サービスサイト・LP</h3><p>課題、価値、特徴、料金、事例、FAQ、問い合わせを一つのストーリーで構成。</p></article></div>
    </section>

    <section className="order-final-cta"><span>CONTACT</span><h2>このイメージをベースに、自分のサイトを相談できます。</h2><p>「飲食店デモに近い」「もっとシンプルにしたい」など、完成イメージを起点に相談いただいて大丈夫です。</p><div className="order-actions"><a className="order-primary-link" href="/contact">制作について相談する <b>→</b></a><a className="order-secondary-link" href="/services/web-production">Web制作の詳細 <b>→</b></a></div></section>
    <SiteFooter />
  </main>;
}
