function FeatureIcon({ type }: { type: "clock" | "yen" | "star" | "support" }) {
  if (type === "clock") return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="19" /><path d="M24 12v13l9 5" /></svg>;
  if (type === "yen") return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="19" /><path d="m16 13 8 11 8-11M17 25h14M17 31h14M24 24v13" /></svg>;
  if (type === "star") return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="m24 6 5.2 10.7 11.8 1.7-8.5 8.3 2 11.7L24 32.9l-10.5 5.5 2-11.7L7 18.4l11.8-1.7L24 6Z" /></svg>;
  return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 27v-5a15 15 0 0 1 30 0v5M9 27v7h6V24H9M39 27v7h-6V24h6M33 37c-2 3-5 4-10 4" /></svg>;
}

export function HomeHero() {
  return <>
    <section className="wsw-mv">
      <div className="wsw-mv__inner">
        <div className="wsw-mv__copy">
          <p className="wsw-mv__eyebrow">WEB PRODUCTION / WANI SAN WEB</p>
          <h1>
            <span className="wsw-mv__headline-line"><span>考える・動く・</span><span>伝えるを、</span></span>
            <span className="wsw-mv__headline-line">もっとシンプルに。</span>
          </h1>
          <i className="wsw-mv__accent" aria-hidden="true" />
          <p className="wsw-mv__lead"><span>Webディレクションの視点で、</span><span>仕事をわかりやすく、効果的にするヒントをお届けします。</span></p>
          <div className="wsw-mv__actions">
            <a className="wsw-mv__primary" href="/contact">無料で相談する <b>→</b></a>
            <a className="wsw-mv__secondary" href="/examples">制作実績を見る <b>→</b></a>
          </div>
        </div>

        <div className="wsw-mv__devices">
          <img src="/images/home/wsw-mv-devices.webp" alt="PCとスマートフォンでのWani san Web表示イメージ" />
        </div>
      </div>
    </section>

    <div className="wsw-mv__proof" aria-label="WANI SAN WEBの特徴">
      <div className="wsw-mv__proof-inner">
        <div><span className="wsw-proof-icon"><FeatureIcon type="clock" /></span><p><small>最短</small><b>7営業日〜</b></p></div>
        <div><span className="wsw-proof-icon"><FeatureIcon type="yen" /></span><p><small>制作料金</small><b>¥39,800〜</b></p></div>
        <div><span className="wsw-proof-icon"><FeatureIcon type="star" /></span><p><small>高品質デザイン</small><b>オリジナル設計</b></p></div>
        <div><span className="wsw-proof-icon"><FeatureIcon type="support" /></span><p><small>公開後も安心</small><b>サポート</b></p></div>
      </div>
    </div>
  </>;
}
