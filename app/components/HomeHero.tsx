export function HomeHero() {
  return <>
    <section className="wsw-mv">
      <div className="wsw-mv__inner">
        <div className="wsw-mv__copy">
          <p className="wsw-mv__eyebrow">WEB PRODUCTION / WANI SAN WEB</p>
          <h1>考える・動く・伝えるを、<br /><span>もっとシンプルに。</span></h1>
          <i className="wsw-mv__accent" aria-hidden="true" />
          <p className="wsw-mv__lead">Webディレクションの視点で、<br className="wsw-mv__pc" />仕事をわかりやすく、効果的にするWebサイトをつくります。</p>
          <div className="wsw-mv__actions">
            <a className="wsw-mv__primary" href="/contact">無料で相談する <b>→</b></a>
            <a className="wsw-mv__secondary" href="/examples">制作イメージを見る <b>→</b></a>
          </div>
        </div>

        <div className="wsw-mv__devices" aria-label="PCとスマートフォンでのWebサイト表示イメージ">
          <div className="wsw-device wsw-device--desktop">
            <div className="wsw-device__screen">
              <div className="wsw-screen__header"><b>WSW</b><span>Service　Works　About</span></div>
              <div className="wsw-screen__body">
                <div><small>WEB PRODUCTION</small><strong>伝わるWebサイトを、<br />シンプルに。</strong><i /><em>View more　→</em></div>
                <div className="wsw-screen__visual"><span /><span /><span /></div>
              </div>
            </div>
            <div className="wsw-device__base" />
          </div>
          <div className="wsw-device wsw-device--mobile">
            <div className="wsw-device__screen">
              <div className="wsw-screen__header"><b>WSW</b><span>≡</span></div>
              <div className="wsw-screen__mobile-body"><small>WEB PRODUCTION</small><strong>伝わるWebサイトを、<br />シンプルに。</strong><i /><em>View more　→</em><div /></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div className="wsw-mv__proof" aria-label="WANI SAN WEBの特徴">
      <div><span className="wsw-proof-icon">◷</span><p><small>最短</small><b>7営業日〜</b></p></div>
      <div><span className="wsw-proof-icon">¥</span><p><small>制作料金</small><b>¥39,800〜</b></p></div>
      <div><span className="wsw-proof-icon">☆</span><p><small>高品質デザイン</small><b>オリジナル設計</b></p></div>
      <div><span className="wsw-proof-icon">◎</span><p><small>公開後も安心</small><b>サポート</b></p></div>
    </div>
  </>;
}
