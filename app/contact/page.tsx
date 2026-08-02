import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import InquiryForm from "./InquiryForm";

export const metadata: Metadata = { title: "無料相談・お問い合わせ｜Wani san Web", description: "Webサイト、SEO・LLMO、Instagram・Web広告、AI活用・業務自動化についてご相談ください。" };

export default function ContactPage() {
  return <main className="platform-page"><SiteHeader current="contact" />
    <section className="platform-hero platform-hero--compact"><span className="section-kicker" aria-hidden="true">CONTACT</span><h1>無料相談・お問い合わせ</h1><p>何を依頼すべきか決まっていなくても大丈夫です。集客や業務の悩みを、そのままお聞かせください。</p></section>
    <section className="contact-layout"><aside><span>BEFORE CONTACT</span><h2>まずは状況を<br />お聞かせください。</h2><ul><li>WebサイトのURLがあると確認がスムーズです。</li><li>現在困っていることを、箇条書きでも構いません。</li><li>予算や時期が未定でも相談できます。</li></ul><p>送信先の設定が完了するまでは、入力内容は送信・保存されません。</p></aside><InquiryForm /></section>
    <SiteFooter />
  </main>;
}
