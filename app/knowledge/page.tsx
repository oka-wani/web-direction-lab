import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = { title:"ナレッジ｜Wani san Web", description:"SEO、業務効率化、Webマーケティングの判断と改善に役立つ実践ナレッジを発信します。" };

const categories = [
  { number: "01", label: "SEO", title: "SEO", text: "検索で見つかり、サービスへの相談につなげるための考え方と改善方法。" },
  { number: "02", label: "EFFICIENCY", title: "効率化", text: "AI・自動化・運用設計を使い、日々の作業と判断の負担を減らす方法。" },
  { number: "03", label: "MARKETING", title: "マーケティング", text: "サイト・SNS・広告をつなぎ、認知から問い合わせまでを設計する方法。" },
] as const;

export default function KnowledgePage() {
  return <main className="knowledge-hub"><SiteHeader current="knowledge" />
    <section className="knowledge-hub-hero knowledge-hub-hero--simple"><div><div className="knowledge-hero-copy"><span className="section-kicker" aria-hidden="true">KNOWLEDGE</span><h1>ナレッジ</h1><p className="knowledge-hero-subtitle">知るだけで終わらない、成果につなげるWebの知識。</p><p className="knowledge-hero-description">SEO、効率化、マーケティングを中心に、小さな会社が次の一手を判断できる実践的な内容を発信します。</p></div></div></section>
    <section className="knowledge-reset"><header><span className="section-kicker" aria-hidden="true">CATEGORIES</span><h2>3つのテーマから探す</h2></header><div className="knowledge-reset-grid">{categories.map((category) => <article key={category.title}><span>{category.number}</span><small>{category.label}</small><h3>{category.title}</h3><p>{category.text}</p></article>)}</div><div className="knowledge-reset-empty"><span>NEW CONTENT COMING SOON</span><h2>新しい方針で、ナレッジを準備しています。</h2><p>集客や業務改善の相談につながるテーマから、順次公開します。</p></div></section>
    <SiteFooter />
  </main>;
}
