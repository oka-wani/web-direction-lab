import type { Metadata } from "../../astro-compat";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import ConfirmForm from "./ConfirmForm";

export const metadata: Metadata = { title: "お問い合わせ内容の確認｜Wani san Web", description: "お問い合わせ内容の確認ページです。" };

export default function ContactConfirmPage() {
  return <main className="order-page"><SiteHeader current="contact" />
    <section className="order-section order-contact-wrap" style={{ paddingTop: "72px" }}>
      <ConfirmForm />
    </section>
    <SiteFooter />
  </main>;
}
