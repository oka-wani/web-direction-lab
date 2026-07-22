import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import InquiryForm from "./InquiryForm";

export const metadata: Metadata = { title: "お問い合わせ｜Web Growth Lab", description: "Webサイト診断、改善、SEO、CMS、AI導入、制作・運用についてご相談ください。" };

export default function ContactPage() {
  return <main className="platform-page"><SiteHeader current="contact" />
    <section className="platform-hero platform-hero--compact"><span className="section-kicker" aria-hidden="true">CONTACT</span><h1>お問い合わせ</h1><p>依頼内容が決まっていなくても大丈夫です。現在のお悩みと、実現したいことをお聞かせください。</p></section>
    <section className="contact-layout"><aside><span>BEFORE CONTACT</span><h2>ご連絡前に</h2><ul><li>通常の返信目安は受付開始時にご案内します。</li><li>URLと現在のお悩みがあると、内容を確認しやすくなります。</li><li>営業・勧誘を目的としたご連絡はご遠慮ください。</li></ul><p>現在はフォームの受付準備中です。画面と入力項目のみ先行公開しています。</p></aside><InquiryForm /></section>
    <SiteFooter />
  </main>;
}
