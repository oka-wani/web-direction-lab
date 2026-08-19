import type { Metadata } from "../astro-compat";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = { title: "ご依頼の流れ｜Wani san Web", description: "問い合わせから初回ミーティング、ヒアリング、要件整理、デザイン、実装、公開、運用までの流れをご案内します。" };

const steps = [
  { number: "01", title: "お問い合わせ", customer: "現在の状況や作りたいサイトについて、分かる範囲でお送りください。", wsw: "内容を確認し、対応可否と次の進め方をご案内します。" },
  { number: "02", title: "初回打ち合わせ", customer: "目的、予算、希望時期などをお聞かせください。", wsw: "制作の進め方、費用感、スケジュール、ヒアリング方法をご説明します。" },
  { number: "03", title: "ヒアリング", customer: "専用シートに目的、掲載情報、デザイン、必要機能などをご回答ください。", wsw: "不足している情報を整理し、追加確認が必要な項目をご案内します。" },
  { number: "04", title: "要件整理", customer: "ページ構成や機能、制作範囲をご確認ください。", wsw: "CMS、フォーム、ドメイン、解析、セキュリティ、保守を含めて要件を整理します。" },
  { number: "05", title: "ラフ案のご提示", customer: "完成イメージに近い案を選び、ご意見をお聞かせください。", wsw: "構成とデザインを統合したラフ案を2〜3案程度ご提示します。" },
  { number: "06", title: "調整", customer: "文言、写真、デザインなどの修正希望をご確認ください。", wsw: "ご意見を整理し、2〜3回程度を目安に案へ反映します。" },
  { number: "07", title: "サイト制作", customer: "必要な原稿や画像をご支給ください。", wsw: "承認された案をもとに、標準品質に沿ってサイトを実装します。" },
  { number: "08", title: "デモ確認", customer: "公開前環境で内容・表示・動作をご確認ください。", wsw: "確認用環境をご用意し、修正事項へ対応します。" },
  { number: "09", title: "公開", customer: "最終承認をお願いします。", wsw: "ドメイン、解析、検索エンジン向け設定を含めて本番公開します。" },
  { number: "10", title: "保守・改善", customer: "必要な更新や改善についていつでもご相談ください。", wsw: "保守、更新、アクセス解析、SEO改善、軽微な改修を継続支援します。" },
] as const;

export default function ProcessPage() {
  return <main className="order-page"><SiteHeader current="flow" />
    <section className="order-page-hero"><span>PRODUCTION FLOW</span><h1>お問い合わせから公開まで、<br />やることが分かる。</h1><p>「問い合わせたら、その後どうなる？」という不安を減らすために、お客様にお願いすることとWSWが行うことを工程ごとに分けてご案内します。</p></section>

    <section className="order-section">
      <div className="order-section-heading"><div><span>10 STEPS</span><h2>問い合わせから公開後まで</h2></div><p>制作工程を細かく分断しすぎず、必要な判断を適切なタイミングで確認します。</p></div>
      <ol className="process-timeline">{steps.map((step) => <li key={step.number}><span>{step.number}</span><div><small>STEP {step.number}</small><h2>{step.title}</h2><div className="process-roles"><section><b>お客様にお願いすること</b><p>{step.customer}</p></section><section><b>WSWが行うこと</b><p>{step.wsw}</p></section></div></div></li>)}</ol>
    </section>

    <section className="order-section order-section--tint">
      <div className="order-detail-grid"><div><span className="order-kicker">HEARING</span><h2>ヒアリングは、デザインだけでなくシステム構成まで判断できる内容にします。</h2><p>サイトの目的や好みだけでは、CMS、フォーム、解析、ドメイン、保守などの必要性を判断できません。公開後の運用まで見据えて必要事項を確認します。</p></div><dl className="order-definition-list"><div><dt>サイト</dt><dd>目的 / ターゲット / 必要ページ / 掲載情報 / 参考サイト</dd></div><div><dt>機能</dt><dd>CMS / フォーム / SNS連携 / その他必要機能</dd></div><div><dt>基盤</dt><dd>独自ドメイン / インフラ / アクセス解析 / セキュリティ</dd></div><div><dt>運用</dt><dd>更新頻度 / 担当者 / 公開後の更新方法 / 保守の有無</dd></div></dl></div>
    </section>

    <section className="order-final-cta"><span>CONTACT</span><h2>最初に必要なのは、作りたいという気持ちだけです。</h2><p>まだ要件が固まっていなくても問題ありません。最初の打ち合わせで一緒に整理します。</p><div className="order-actions"><a className="order-primary-link" href="/contact">無料で相談する <b>→</b></a><a className="order-secondary-link" href="/examples">制作イメージを見る <b>→</b></a></div></section>
    <SiteFooter />
  </main>;
}
