import type { Metadata } from "../astro-compat";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = { title: "ご依頼の流れ｜Wani san Web", description: "相談、整理、提案、実行の4段階で進めます。" };

const steps = [
  { number: "01", title: "相談", text: "現在の悩み、実現したいこと、予算、希望時期をお聞かせください。" },
  { number: "02", title: "整理", text: "サイトや業務の現状を確認し、課題と優先順位を整理します。" },
  { number: "03", title: "提案", text: "対応範囲、成果物、料金、スケジュールを分かりやすく提示します。" },
  { number: "04", title: "実行", text: "合意した内容を制作・改善し、必要に応じて公開後も支援します。" },
] as const;

export default function ProcessPage() {
  return <main className="platform-page"><SiteHeader />
    <section className="platform-hero platform-hero--compact"><span className="section-kicker" aria-hidden="true">PROCESS</span><h1>4段階で、<br />シンプルに進めます。</h1><p>どのサービスを選ぶか決まっていなくても、悩みを伺うところから始めます。</p></section>
    <section className="platform-section"><ol className="process-timeline">{steps.map((step) => <li key={step.number}><span>{step.number}</span><div><small>STEP {step.number}</small><h2>{step.title}</h2><p>{step.text}</p></div></li>)}</ol></section>
    <section className="platform-note"><div><span className="section-kicker" aria-hidden="true">CLEAR SCOPE</span><h2>始める前に、範囲と料金を明確に。</h2></div><p>ヒアリング後に作業内容、成果物、料金、スケジュールをご提示し、合意してから着手します。</p></section>
    <SiteFooter />
  </main>;
}
