import type { Metadata } from "../../astro-compat";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";

export const metadata: Metadata = {
  title: "問い合わせフォームについて｜Wani san Web",
  description: "Cloudflareを利用した問い合わせフォーム、Turnstile、Bot対策、メール通知、自動返信などの考え方をご説明します。",
};

export default function FormQualityPage() {
  return <main className="order-page"><SiteHeader current="quality" />
    <section className="order-page-hero"><span>CONTACT FORM</span><h1>問い合わせフォームも、サイト品質の一部です。</h1><p>フォームは「送れればよい」だけではありません。迷わず入力できること、不正送信を抑えること、必要な通知が届くこと、個人情報を必要以上に持たないことまで含めて設計します。</p></section>

    <section className="order-section">
      <div className="order-section-heading"><div><span>STANDARD APPROACH</span><h2>Cloudflareを標準候補にします。</h2></div><p>WSWの標準公開基盤と合わせやすく、フォーム処理・Bot対策・セキュリティを一つの考え方で組み立てやすいためです。案件によっては外部メールサービスも組み合わせます。</p></div>
      <div className="order-tech-flow"><div><b>Form</b><span>必要な項目だけを分かりやすく入力</span></div><div><b>Cloudflare</b><span>送信処理・保護・レート制御</span></div><div><b>Mail</b><span>担当者通知・必要に応じて自動返信</span></div></div>
    </section>

    <section className="order-section order-section--tint">
      <div className="order-section-heading"><div><span>SECURITY</span><h2>不正送信を減らすための主な対策</h2></div><p>すべての対策を機械的に入れるのではなく、フォームの用途、件数、費用、運用方法を確認して組み合わせます。</p></div>
      <div className="order-quality-grid"><article className="order-quality-card"><small>TURNSTILE</small><h3>Bot対策</h3><p>Cloudflare Turnstileを利用し、自動送信や不審なアクセスを減らします。</p></article><article className="order-quality-card"><small>RATE LIMITING</small><h3>大量送信の抑制</h3><p>同一の送信元などから短時間に大量のリクエストが発生した場合に、制限をかける構成を検討します。</p></article><article className="order-quality-card"><small>VALIDATION</small><h3>入力内容の検証</h3><p>ブラウザ上だけでなく、受信側でも入力値を確認し、不正なデータをそのまま処理しないようにします。</p></article></div>
    </section>

    <section className="order-section">
      <div className="order-detail-grid"><div><span className="order-kicker">MAIL FLOW</span><h2>通知と自動返信を分けて考えます。</h2><p>担当者へ届く問い合わせ通知と、ユーザーへ送る受付完了メールは目的が違います。必要に応じてCloudflareと外部メールサービスを組み合わせ、送信元ドメインやSPF・DKIMなども確認します。</p><ul className="order-check-list"><li>担当者向けの問い合わせ通知</li><li>ユーザー向けの受付完了メール</li><li>送信元・Reply-Toの整理</li><li>SPF・DKIMなどメール認証の確認</li></ul></div><dl className="order-definition-list"><div><dt>個人情報</dt><dd>必要な項目だけを取得し、利用目的を明確にします。</dd></div><div><dt>エラー時</dt><dd>送信できなかった場合に、ユーザーが次の行動を判断できる表示にします。</dd></div><div><dt>確認画面</dt><dd>入力内容や案件要件に応じて、送信前の確認ステップを設けます。</dd></div><div><dt>運用</dt><dd>大量送信や障害時にフォームを止めるなど、緊急時の対応方法も検討します。</dd></div></dl></div>
    </section>

    <section className="order-final-cta"><span>CONTACT</span><h2>フォームが必要か、どこまで対策するかも一緒に整理します。</h2><p>問い合わせ件数、個人情報、通知方法、運用体制を確認し、必要な構成だけをご提案します。</p><div className="order-actions"><a className="order-primary-link" href="/contact">相談する <b>→</b></a><a className="order-secondary-link" href="/quality">品質・技術へ戻る <b>→</b></a></div></section>
    <SiteFooter />
  </main>;
}
