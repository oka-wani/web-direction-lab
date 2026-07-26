import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = { title: "制作・改善事例｜Web Growth Lab", description: "Web Growth Labの制作・改善事例を、課題、対応、結果が分かる形で掲載します。" };

export default function CasesPage() {
  return <main className="platform-page"><SiteHeader current="cases" />
    <section className="platform-hero platform-hero--compact"><span className="section-kicker" aria-hidden="true">CASE STUDIES</span><h1>制作・改善・ツール事例</h1><p>ご相談の背景、確認した課題、選んだ対応、結果をまとめて公開します。</p></section>
    <section className="platform-section"><div className="case-type-grid"><article><span>WEB PRODUCTION</span><h2>Webサイト制作事例</h2><p>掲載内容の整理からデザイン、公開までの判断と成果を紹介します。</p><b>準備中</b></article><article><span>IMPROVEMENT</span><h2>Webサイト改善事例</h2><p>問い合わせ導線、スマートフォン表示、SEOなどの改善過程を紹介します。</p><b>準備中</b></article><article><span>AUTOMATION</span><h2>ツール制作事例</h2><p>Excel・CSV処理、登録作業、レポート作成などの効率化を紹介します。</p><b>準備中</b></article></div></section>
    <section className="platform-section cases-empty"><span>HOW WE SHOW RESULTS</span><h2>事例は「なぜその方法を選んだか」まで掲載します。</h2><p>掲載許可を得た事例から、数字だけでなく、予算や運用体制を踏まえた判断が分かる形で追加します。</p><div><span>課題</span><b>→</b><span>判断</span><b>→</b><span>改善</span><b>→</b><span>結果</span></div><a className="button button--primary" href="/contact">同じような課題を相談する <b>→</b></a></section>
    <SiteFooter />
  </main>;
}
