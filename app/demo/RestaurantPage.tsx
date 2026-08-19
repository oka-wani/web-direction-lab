import { SiteFooter, SiteHeader } from "../components/SiteChrome";

const pages = ["TOP", "メニュー", "店舗情報", "コンセプト", "お知らせ"];
const basics = ["5ページ", "スマートフォン対応", "基本SEO設定", "問い合わせ・予約導線", "Googleマップ", "SNSリンク", "お知らせ表示"];
const options = ["microCMS", "予約サービス連携", "Instagram連携", "多店舗対応", "GA4", "Search Console", "写真撮影相談"];

export default function RestaurantPage() {
  return <main className="order-page"><SiteHeader current="examples" />
    <section className="order-page-hero"><span>RESTAURANT WEBSITE</span><h1>飲食店サイトなら、<br />こんな形から。</h1><p>「どんなお店か」「何が食べられるか」「どこにあるか」「どう予約するか」を、来店前に迷わず確認できる制作イメージです。</p><div className="order-actions"><a className="order-primary-link" href="/contact">このイメージで相談する <b>→</b></a><a className="order-secondary-link" href="#plan">プランを見る <b>↓</b></a></div></section>
    <section className="order-section"><div className="order-demo-site" aria-label="飲食店サイトのデザインイメージ"><div className="order-demo-site-nav"><b>Restaurant Name</b><div><span>MENU</span><span>ABOUT</span><span>ACCESS</span><span>RESERVE</span></div></div><div className="order-demo-site-hero"><div><small>SMALL RESTAURANT / TOKYO</small><h3>今日食べたい、を<br />すぐ見つけられる。</h3><p>料理の魅力とお店の空気感を伝えながら、メニュー・アクセス・予約へ短い導線でつなぎます。</p></div></div><div className="order-demo-site-sections"><div><span>01 / MENU</span><b>写真と価格がすぐ分かる</b></div><div><span>02 / STORY</span><b>お店のこだわりを伝える</b></div><div><span>03 / ACCESS</span><b>営業時間・地図・予約へ</b></div></div></div></section>
    <section className="order-section order-section--tint"><div className="order-section-heading"><div><span>PAGE STRUCTURE</span><h2>想定ページ構成</h2></div><p>来店前に必要な情報へ短い導線で到達できる、5ページの基本構成です。</p></div><ol className="restaurant-pages">{pages.map((page, index) => <li key={page}><span>{String(index + 1).padStart(2, "0")}</span><b>{page}</b></li>)}</ol></section>
    <section className="order-section" id="plan"><div className="order-section-heading"><div><span>BASIC PLAN</span><h2>基本プラン</h2></div><p>まず必要になりやすい構成と品質をまとめたプランです。店舗に合わせて内容を調整します。</p></div><div className="restaurant-plan"><ul>{basics.map((item) => <li key={item}>{item}</li>)}</ul><div><small>PRICE</small><strong>30,000<em>円〜</em></strong><p>正式な料金は素材、機能、制作範囲を確認後にご提示します。</p></div></div></section>
    <section className="order-section order-section--tint"><div className="order-section-heading"><div><span>OPTIONS</span><h2>追加できる機能</h2></div><p>お知らせ更新、予約、分析、多店舗展開など、運用に必要なものだけ追加できます。</p></div><div className="option-chips">{options.map((item) => <span key={item}>{item}</span>)}</div></section>
    <section className="order-final-cta"><span>CONTACT</span><h2>このような飲食店サイトを作りたい。</h2><p>その一言から相談できます。お店の雰囲気や必要な機能を伺い、最適な形に調整します。</p><div className="order-actions"><a className="order-primary-link" href="/contact">無料で相談する <b>→</b></a><a className="order-secondary-link" href="/examples">ほかの制作イメージ <b>→</b></a></div></section><SiteFooter />
  </main>;
}
