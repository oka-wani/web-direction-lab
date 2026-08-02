import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { getService, services } from "../../platform-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const service = getService((await params).slug);
  return service ? { title: `${service.title}｜Wani san Web`, description: service.summary } : {};
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const service = getService((await params).slug);
  if (!service) notFound();
  return <main className="platform-page service-detail"><SiteHeader current="services" />
    <div className="platform-breadcrumb"><a href="/">トップ</a><span>›</span><a href="/services">サービス</a><span>›</span><span>{service.title}</span></div>
    <section className="service-detail-hero"><div><span>{service.group} / {service.label}</span><h1>{service.title}</h1><p>{service.description}</p><div className="hero-actions"><a className="button button--primary" href="/contact">このサービスを相談する <b>→</b></a><a className="button button--secondary" href="/services#pricing">料金の目安を見る <b>→</b></a></div></div><dl><div><dt>料金の目安</dt><dd>{service.price}</dd></div><div><dt>納期・期間の目安</dt><dd>{service.period}</dd></div></dl></section>
    <section className="service-detail-section service-detail-section--tint"><div><span>RECOMMENDED FOR</span><h2>このような方におすすめ</h2></div><ul className="check-panel">{service.recommendedFor.map((item) => <li key={item}>{item}</li>)}</ul></section>
    <section className="service-detail-section"><div><span>SOLUTIONS</span><h2>解決できる課題</h2></div><ul className="number-list">{service.solvedIssues.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b></li>)}</ul></section>
    <section className="service-detail-section"><div><span>DELIVERABLES</span><h2>対応内容</h2></div><ul className="number-list">{service.deliverables.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b></li>)}</ul></section>
    <section className="service-detail-section"><div><span>PROCESS</span><h2>進め方</h2></div><ol className="process-list">{service.steps.map((step, index) => <li key={step}><span>STEP {String(index + 1).padStart(2, "0")}</span><b>{step}</b></li>)}</ol></section>
    <section className="service-detail-section service-detail-section--tint"><div><span>FAQ</span><h2>よくある質問</h2></div><div className="faq-list">{service.faq.map((faq, index) => <details key={faq.question} open={index === 0}><summary><span>Q</span>{faq.question}<i aria-hidden="true">＋</i></summary><div><span>A</span><p>{faq.answer}</p></div></details>)}</div></section>
    <section className="platform-wide-band"><div><span className="section-kicker" aria-hidden="true">CONTACT</span><h2>まずは現状をお聞かせください。</h2><p>内容を確認し、対応可否と次の進め方をご案内します。</p></div><a className="button button--primary" href="/contact">相談内容を送る <b>→</b></a></section>
    <SiteFooter />
  </main>;
}
