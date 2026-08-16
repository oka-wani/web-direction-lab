import type { Metadata } from "../astro-compat";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = { title: "ご依頼の流れ｜Wani san Web", description: "問い合わせから初回ミーティング、ヒアリング、要件整理、デザイン、実装、公開、運用までの流れをご案内します。" };

const steps = [
  { number: "01", title: "問い合わせ", text: "サイトから現在の状況、作りたいもの、改善したいことなどをお送りください。" },
  { number: "02", title: "初回ミーティング", text: "WSW、相談内容、進め方、スケジュール、費用感、ヒアリングシートについてご説明します。" },
  { number: "03", title: "ヒアリングシート", text: "目的、ターゲット、必要ページ、デザイン、CMS、フォーム、ドメイン、運用方法などをご回答いただきます。" },
  { number: "04", title: "要件整理・要件定義", text: "回答内容からページ構成、機能、利用サービス、インフラ、解析、セキュリティ、保守範囲を整理してご提示します。" },
  { number: "05", title: "構成・デザイン案", text: "ワイヤーとデザインを細かく分けすぎず、完成イメージが分かるラフ案を2〜3案程度ご提示します。" },
  { number: "06", title: "フィードバック", text: "ご意見を整理して反映します。2〜3回程度の調整を想定し、必要な場合のみ追加で打ち合わせを行います。" },
  { number: "07", title: "サイト実装", text: "承認された案をベースに、標準技術基盤と共通モジュールを使ってサイトを制作します。" },
  { number: "08", title: "デモ環境確認", text: "本番公開前の環境で、表示・内容・フォームなどをご確認いただきます。" },
  { number: "09", title: "最終承認・公開", text: "最終確認後に本番へ公開し、必要なドメイン・解析・検索エンジン向け設定などを反映します。" },
  { number: "10", title: "運用・保守", text: "必要に応じて更新、保守、アクセス解析、SEO改善、軽微な改修、Web改善へつなげます。" },
] as const;

export default function ProcessPage() {
  return <main className="order-page"><SiteHeader />
    <section className="order-page-hero"><span>PROCESS</span><h1>対面しすぎず、任せきりにもしない。</h1><p>最初に一度しっかりお話しし、その後はヒアリングシートと資料を中心に効率よく進めます。確認が必要な場面では、完成イメージが分かる形でご提示します。</p></section>

    <section className="order-section">
      <div className="order-section-heading"><div><span>10 STEPS</span><h2>問い合わせから公開後まで</h2></div><p>制作工程を細かく分断しすぎず、必要な判断を適切なタイミングで確認します。</p></div>
      <ol className="process-timeline">{steps.map((step) => <li key={step.number}><span>{step.number}</span><div><small>STEP {step.number}</small><h2>{step.title}</h2><p>{step.text}</p></div></li>)}</ol>
    </section>

    <section className="order-section order-section--tint">
      <div className="order-detail-grid"><div><span className="order-kicker">HEARING</span><h2>ヒアリングは、デザインだけでなくシステム構成まで判断できる内容にします。</h2><p>サイトの目的や好みだけでは、CMS、フォーム、解析、ドメイン、保守などの必要性を判断できません。公開後の運用まで見据えて必要事項を確認します。</p></div><dl className="order-definition-list"><div><dt>サイト</dt><dd>目的 / ターゲット / 必要ページ / 掲載情報 / 参考サイト</dd></div><div><dt>機能</dt><dd>CMS / フォーム / SNS連携 / その他必要機能</dd></div><div><dt>基盤</dt><dd>独自ドメイン / インフラ / アクセス解析 / セキュリティ</dd></div><div><dt>運用</dt><dd>更新頻度 / 担当者 / 公開後の更新方法 / 保守の有無</dd></div></dl></div>
    </section>

    <section className="order-final-cta"><span>CONTACT</span><h2>まずは初回ミーティングの前段から相談できます。</h2><p>問い合わせ内容を確認し、対応可能な場合に次の進め方をご案内します。まだ要件が固まっていなくても問題ありません。</p><div className="order-actions"><a className="order-primary-link" href="/contact">相談内容を送る <b>→</b></a><a className="order-secondary-link" href="/demo">制作イメージを見る <b>→</b></a></div></section>
    <SiteFooter />
  </main>;
}
