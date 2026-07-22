import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = { title: "制作・改善の進め方｜Web Direction Lab", description: "お問い合わせからヒアリング、診断、提案、制作、公開、運用までの進め方をご案内します。" };

const steps = [
  { number: "01", title: "お問い合わせ", text: "対象サイト、現在のお悩み、希望する支援内容をお送りください。" },
  { number: "02", title: "ヒアリング", text: "目的、背景、体制、予算、希望時期を確認し、課題を整理します。" },
  { number: "03", title: "診断・調査", text: "必要に応じてサイト、競合、計測状況、運用フローを確認します。" },
  { number: "04", title: "ご提案・お見積り", text: "対応範囲、優先順位、進め方、料金、スケジュールをご提示します。" },
  { number: "05", title: "制作・改善", text: "合意した内容に沿って設計、制作、実装、レビューを進めます。" },
  { number: "06", title: "確認・公開", text: "表示、動作、内容を確認し、必要な手順に沿って公開します。" },
  { number: "07", title: "運用・効果確認", text: "公開後のデータと利用状況を確認し、次の改善へつなげます。" },
] as const;

export default function ProcessPage() {
  return <main className="platform-page"><SiteHeader />
    <section className="platform-hero platform-hero--compact"><span className="section-kicker" aria-hidden="true">PROCESS</span><h1>制作・改善の進め方</h1><p>ご相談内容に合わせて範囲を調整します。最初から大きな制作を前提にはしません。</p></section>
    <section className="platform-section"><ol className="process-timeline">{steps.map((step) => <li key={step.number}><span>{step.number}</span><div><small>STEP {step.number}</small><h2>{step.title}</h2><p>{step.text}</p></div></li>)}</ol></section>
    <section className="platform-note"><div><span className="section-kicker" aria-hidden="true">CLEAR SCOPE</span><h2>始める前に、範囲と料金を明確に。</h2></div><p>ヒアリング後に作業内容、成果物、料金、スケジュールをご提示し、合意してから着手します。</p></section>
    <SiteFooter />
  </main>;
}

