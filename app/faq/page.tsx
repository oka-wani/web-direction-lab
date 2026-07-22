import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { faqs } from "../platform-data";

export const metadata: Metadata = { title: "よくある質問｜Web Growth Lab", description: "Webサイト診断・改善・制作・運用のご相談に関するよくある質問をまとめています。" };

export default function FaqPage() {
  return <main className="platform-page"><SiteHeader />
    <section className="platform-hero platform-hero--compact"><span className="section-kicker" aria-hidden="true">FAQ</span><h1>よくある質問</h1><p>ご相談前に確認されることの多い内容をまとめています。</p></section>
    <section className="platform-section faq-section"><div className="faq-list">{faqs.map((faq, index) => <details key={faq.question} open={index === 0}><summary><span>Q</span>{faq.question}<i aria-hidden="true">＋</i></summary><div><span>A</span><p>{faq.answer}</p></div></details>)}</div></section>
    <section className="platform-wide-band"><div><span className="section-kicker" aria-hidden="true">CONTACT</span><h2>解決しないことは、直接ご相談ください。</h2><p>依頼内容が固まっていなくても、現在のお悩みから整理します。</p></div><a className="button button--primary" href="/contact">お問い合わせ <b>→</b></a></section>
    <SiteFooter />
  </main>;
}
