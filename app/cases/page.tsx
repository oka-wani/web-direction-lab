import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = { title: "実績・事例｜Wani san Web", description: "WebマーケティングとAI・業務改善の事例を、課題、対応、結果が分かる形で掲載します。" };

export default function CasesPage() {
  return <main className="platform-page"><SiteHeader current="cases" />
    <section className="platform-hero platform-hero--compact"><span className="section-kicker" aria-hidden="true">CASE STUDIES</span><h1>実績・事例</h1><p>ご相談の背景、確認した課題、選んだ対応、結果をまとめて公開します。</p></section>
    <section className="platform-section"><div className="case-type-grid"><article><span>WEB MARKETING</span><h2>Web集客事例</h2><p>Webサイト、SEO、SNS、広告を組み合わせた判断と成果を紹介します。</p><b>準備中</b></article><article><span>WEB OPERATION</span><h2>制作・運用事例</h2><p>掲載内容の整理から公開、更新、継続改善までを紹介します。</p><b>準備中</b></article><article><span>AI &amp; AUTOMATION</span><h2>業務改善事例</h2><p>Excel・CSV処理、登録作業、レポート作成などの効率化を紹介します。</p><b>準備中</b></article></div></section>
    <section className="platform-section cases-empty"><span>HOW WE SHOW RESULTS</span><h2>事例は「なぜその方法を選んだか」まで掲載します。</h2><p>掲載許可を得た事例から、数字だけでなく、予算や運用体制を踏まえた判断が分かる形で追加します。</p><div><span>課題</span><b>→</b><span>判断</span><b>→</b><span>改善</span><b>→</b><span>結果</span></div><a className="button button--primary" href="/contact">同じような課題を相談する <b>→</b></a></section>
    <SiteFooter />
  </main>;
}
