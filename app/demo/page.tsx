import type { Metadata } from "../astro-compat";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = { title: "制作イメージ｜Wani san Web", description: "業種や目的から、完成するWebサイトのイメージをご覧いただけます。" };
const coming = [["店舗・美容室", "メニュー、スタッフ、アクセス、予約導線"], ["スクール", "コース、料金、講師、体験申込"], ["士業", "取扱業務、強み、相談の流れ、問い合わせ"], ["小規模企業", "事業内容、会社情報、採用、問い合わせ"], ["サービスサイト", "特徴、料金、導入の流れ、FAQ"], ["LP", "課題、価値、根拠、申込を一つのページに"]] as const;

export default function DemoPage() {
  return <main className="order-page"><SiteHeader current="examples" />
    <section className="order-page-hero"><span>PRODUCTION EXAMPLES</span><h1>自分の業種なら、<br />どんなサイトになる？</h1><p>業種や目的から、完成するWebサイトのイメージをご覧いただけます。実績ではなく、依頼前に構成・機能・デザインの方向性を具体化するための制作イメージです。</p></section>
    <section className="order-section"><div className="order-section-heading"><div><span>FIRST PACKAGE</span><h2>飲食店サイト</h2></div><p>料理の魅力、店舗情報、アクセス、予約方法を、来店前のスマートフォンで迷わず確認できる構成です。</p></div><a className="example-feature" href="/examples/restaurant"><div><small>RESTAURANT WEBSITE</small><h3>今日食べたい、を<br />すぐ見つけられる。</h3><p>デザインイメージ、想定ページ、基本プラン、追加機能までご覧いただけます。</p><b>飲食店サイトの制作イメージを見る →</b></div><div className="order-browser" aria-hidden="true"><div className="order-browser-bar"><i /><i /><i /></div><div className="order-browser-body"><small>SMALL RESTAURANT</small><b>MENU / STORY / ACCESS</b><div className="order-browser-tags"><span>MENU</span><span>MAP</span><span>RESERVE</span></div></div></div></a></section>
    <section className="order-section order-section--tint"><div className="order-section-heading"><div><span>COMING NEXT</span><h2>制作イメージは順次追加します。</h2></div><p>単なる色違いではなく、業種ごとに必要な情報と導線を考えた構成例として整備します。</p></div><div className="order-quality-grid">{coming.map(([title, text]) => <article className="order-quality-card is-coming" key={title}><small>COMING SOON</small><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="order-final-cta"><span>CONTACT</span><h2>近いイメージがなくても、相談できます。</h2><p>業種、目的、好きな雰囲気を伺い、必要な構成から一緒に考えます。</p><div className="order-actions"><a className="order-primary-link" href="/contact">無料で相談する <b>→</b></a><a className="order-secondary-link" href="/flow">制作の流れを見る <b>→</b></a></div></section><SiteFooter />
  </main>;
}
