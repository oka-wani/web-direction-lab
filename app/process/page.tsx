import type { Metadata } from "../astro-compat";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = { title: "制作の流れ｜Wani san Web", description: "お問い合わせ、方針整理、構成・デザイン、サイト制作、公開までの5工程をご案内します。" };

const steps = [
  { number: "01", title: "お問い合わせ", customer: "現在の状況や作りたいサイトについて、分かる範囲でお送りください。", wsw: "内容を確認し、対応可否と次の進め方をご案内します。" },
  { number: "02", title: "方針整理", customer: "最初にヒアリングフォームへご回答ください。その内容をもとにした打ち合わせで、ご希望や不明点を確認します。", wsw: "目的・ターゲット・掲載内容・必要機能・デザインの方向性・制作範囲を整理し、サイト方針を確定します。" },
  { number: "03", title: "構成・デザイン", customer: "サイトマップ、各ページの構成、PC・スマートフォンの見え方、デザイン案をご確認ください。", wsw: "確定した方針をもとに、サイト構成と完成イメージが分かるデザイン案を作成します。" },
  { number: "04", title: "サイト制作", customer: "必要な原稿や画像をご支給いただき、確認用サイトで内容・表示・動作をご確認ください。", wsw: "承認された構成・デザインをもとにサイトを実装し、公開前の品質確認と調整を行います。" },
  { number: "05", title: "公開", customer: "確認用サイトをご確認いただき、最終承認をお願いします。", wsw: "ドメイン、解析、検索エンジン向け設定を確認して本番公開します。" },
] as const;

export default function ProcessPage() {
  return <main className="order-page"><SiteHeader current="flow" />
    <section className="order-page-hero"><span>PRODUCTION FLOW</span><h1>お問い合わせから公開まで、<br />5つの工程で進めます。</h1><p>最初にヒアリングフォームへご回答いただき、その内容をもとに打ち合わせで方針を確定してから、構成・デザイン、サイト制作へ進みます。</p></section>

    <section className="order-section">
      <div className="order-section-heading"><div><span>5 STEPS</span><h2>制作の流れ</h2></div><p>お問い合わせ、方針整理、構成・デザイン、サイト制作、公開の順に進めます。</p></div>
      <ol className="process-timeline">{steps.map((step) => <li key={step.number}><span>{step.number}</span><div><small>STEP {step.number}</small><h2>{step.title}</h2><div className="process-roles"><section><b>お客様にお願いすること</b><p>{step.customer}</p></section><section><b>WSWが行うこと</b><p>{step.wsw}</p></section></div></div></li>)}</ol>
    </section>

    <section className="order-section order-section--tint">
      <div className="order-detail-grid"><div><span className="order-kicker">DIRECTION SETTING</span><h2>フォーム回答と打ち合わせで、サイト方針を確定します。</h2><p>最初にヒアリングフォームへご回答いただきます。その内容を整理したうえで打ち合わせを行い、目的、ターゲット、掲載内容、必要ページ、機能、デザイン、運用方法まで認識を合わせます。</p></div><dl className="order-definition-list"><div><dt>目的・ターゲット</dt><dd>目的 / 課題 / 商圏 / 見てほしい人 / 最終的な行動</dd></div><div><dt>掲載内容</dt><dd>必要ページ / 特に伝えたいこと / 素材 / 参考サイト</dd></div><div><dt>機能・基盤</dt><dd>CMS / フォーム / SNS連携 / ドメイン / その他必要機能</dd></div><div><dt>デザイン・運用</dt><dd>希望する印象 / 色 / 更新内容 / 更新方法 / 公開後の運用イメージ</dd></div></dl></div>
    </section>

    <section className="order-final-cta"><span>CONTACT</span><h2>まだ要件が固まっていなくても、相談できます。</h2><p>ヒアリングフォームへの回答内容をもとに、打ち合わせでサイト方針を一緒に整理します。</p><div className="order-actions"><a className="order-primary-link" href="/contact">無料で相談する <b>→</b></a><a className="order-secondary-link" href="/examples">制作イメージを見る <b>→</b></a></div></section>
    <SiteFooter />
  </main>;
}
