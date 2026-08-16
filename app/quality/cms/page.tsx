import type { Metadata } from "../../astro-compat";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";

export const metadata: Metadata = {
  title: "CMSについて｜Wani san Web",
  description: "CMSが必要なケース・不要なケース、Wani san WebでmicroCMSを候補とする理由をご説明します。",
};

export default function CmsPage() {
  return <main className="order-page"><SiteHeader current="quality" />
    <section className="order-page-hero"><span>CMS</span><h1>「自分で更新したい」があるなら、CMSを検討します。</h1><p>CMSは、Webサイトの内容を管理画面から更新するための仕組みです。便利ですが、すべてのサイトに必要なものではありません。更新頻度と運用担当者を確認してから判断します。</p></section>

    <section className="order-section">
      <div className="order-detail-grid"><div><span className="order-kicker">WHEN YOU NEED IT</span><h2>CMSが向いているケース</h2><ul className="order-check-list"><li>お知らせを定期的に追加したい</li><li>ブログ・コラムを継続して更新したい</li><li>実績、商品、店舗、FAQなどを自分で増やしたい</li><li>制作会社へ依頼せず、日々の更新を社内で行いたい</li></ul></div><div><span className="order-kicker">WHEN YOU DO NOT</span><h2>無理に入れなくてよいケース</h2><ul className="order-bullet-list"><li>公開後ほとんど内容が変わらない</li><li>年に数回程度しか更新しない</li><li>更新担当者を置く予定がない</li><li>固定ページだけで十分に目的を達成できる</li></ul></div></div>
    </section>

    <section className="order-section order-section--tint">
      <div className="order-section-heading"><div><span>MICROCMS</span><h2>WSWでは、microCMSを標準候補にします。</h2></div><p>サイト本体と更新画面を分けやすく、Astroとの相性もよいためです。ただし、案件要件に合わなければ別の方法を検討します。</p></div>
      <div className="order-quality-grid"><article className="order-quality-card"><small>UPDATE</small><h3>更新箇所を限定できる</h3><p>お知らせ、実績、商品など、ユーザー自身で触る必要がある箇所だけを管理画面化できます。</p></article><article className="order-quality-card"><small>FRONTEND</small><h3>表示側を自由に設計</h3><p>CMSのテーマに縛られず、Astro側でデザイン・HTML構造・表示速度を設計できます。</p></article><article className="order-quality-card"><small>SECURITY</small><h3>役割を分けて管理</h3><p>サイト公開基盤とCMSを分離し、APIキーなどの秘密情報は環境変数で管理します。</p></article></div>
    </section>

    <section className="order-section">
      <div className="order-section-heading"><div><span>EXAMPLES</span><h2>自分で更新できるようにしやすい情報</h2></div><p>何でもCMS化するのではなく、更新する情報だけを構造化します。</p></div>
      <div className="order-subnav">{["お知らせ", "ブログ・コラム", "実績", "商品・サービス", "店舗情報", "FAQ", "スタッフ情報", "採用情報"].map((item) => <span key={item} style={{ padding: "10px 14px", border: "1px solid #d9e3df", borderRadius: "999px", fontSize: "13px", fontWeight: 700 }}>{item}</span>)}</div>
    </section>

    <section className="order-final-cta"><span>CONTACT</span><h2>CMSが必要かどうかも、ヒアリングから判断します。</h2><p>「更新したい気はするけれど、どこまで必要か分からない」という段階でも大丈夫です。運用頻度と担当者を確認して、最小限の構成をご提案します。</p><div className="order-actions"><a className="order-primary-link" href="/contact">相談する <b>→</b></a><a className="order-secondary-link" href="/quality">品質・技術へ戻る <b>→</b></a></div></section>
    <SiteFooter />
  </main>;
}
