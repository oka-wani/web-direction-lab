import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = { title: "制作・改善事例｜Web Growth Lab", description: "Web Growth Labの制作・改善事例を、課題、対応、結果が分かる形で掲載します。" };

export default function CasesPage() {
  return <main className="platform-page"><SiteHeader current="cases" />
    <section className="platform-hero platform-hero--compact"><span className="section-kicker" aria-hidden="true">CASE STUDIES</span><h1>制作・改善事例</h1><p>ご相談の背景、確認した課題、対応内容、結果をまとめて公開します。</p></section>
    <section className="platform-section cases-empty"><span>PREPARING</span><h2>事例は現在準備中です。</h2><p>掲載許可を得た事例から、数字だけでなく「なぜその改善を選んだか」が分かる形で追加します。</p><div><span>課題</span><b>→</b><span>判断</span><b>→</b><span>改善</span><b>→</b><span>結果</span></div><a className="button button--secondary" href="/knowledge">実務ナレッジを見る <b>→</b></a></section>
    <SiteFooter />
  </main>;
}
