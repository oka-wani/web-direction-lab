import type { Metadata } from "../astro-compat";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import InquiryForm from "./InquiryForm";

export const metadata: Metadata = { title: "お問い合わせ｜Wani san Web", description: "Webサイト制作・リニューアル、既存サイトの診断・改善についてご相談ください。要件が固まっていない段階でもご相談いただけます。" };

export default function ContactPage() {
  return <main className="order-page"><SiteHeader current="contact" />
    <section className="order-page-hero"><span>CONTACT</span><h1>まずは、状況をお聞かせください。</h1><p>作りたいサイトの内容が決まっていなくても、どこを改善すべきか分からなくても大丈夫です。現在の状況、目的、予算、希望時期などを確認し、次の進め方をご案内します。</p></section>
    <section className="order-contact-wrap">
      <div className="order-section-heading"><div><span>BEFORE CONTACT</span><h2>相談内容は、まとまっていなくても構いません。</h2></div><div><p>対象サイトがある場合はURLをご記載ください。制作をご希望の場合は、作りたいサイトの用途や参考サイトが分かる範囲であると、その後のご案内がスムーズです。</p><p className="order-contact-response">通常、内容を確認後2〜3営業日以内にご連絡します。</p></div></div>
      <InquiryForm />
    </section>
    <SiteFooter />
  </main>;
}
