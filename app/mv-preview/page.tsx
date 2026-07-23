import { SiteFooter, SiteHeader } from "../components/SiteChrome";

const concepts = [
  { id: "white-editorial", name: "白 01｜Editorial", note: "余白と大きな文字を主役にした、最も端正な案", tone: "white" },
  { id: "white-split", name: "白 02｜Structured split", note: "濃紺の情報面を右に置き、支援サイトらしさを出す案", tone: "white" },
  { id: "white-orbit", name: "白 03｜Growth orbit", note: "成長の流れを円と線で抽象化した、少し柔らかい案", tone: "white" },
  { id: "navy-editorial", name: "濃紺 01｜Bold editorial", note: "濃紺一色と巨大なWGLで、信頼感を強く出す案", tone: "navy" },
  { id: "navy-signal", name: "濃紺 02｜Growth signal", note: "細いグリッドと上昇ラインで、分析・改善を表す案", tone: "navy" },
  { id: "navy-panel", name: "濃紺 03｜Knowledge panel", note: "白い情報パネルを組み合わせ、内容の豊かさを見せる案", tone: "navy" },
] as const;

export default function MvPreviewPage() {
  return <main className="mv-preview-page"><SiteHeader />
    <header className="mv-preview-intro"><span>MV DESIGN OPTIONS</span><h1>TOP MV デザイン比較</h1><p>白ベース3案、濃紺ベース3案です。装飾を足し合わせず、各案で主役を一つに絞っています。</p></header>
    <div className="mv-concept-list">{concepts.map((concept) => <section className={`mv-concept mv-concept--${concept.id}`} data-tone={concept.tone} key={concept.id}>
      <div className="mv-concept-label"><span>{concept.name}</span><small>{concept.note}</small></div>
      <div className="mv-concept-copy"><p className="eyebrow">WEB GROWTH LAB</p><h2>Webの課題を、<br /><em>知識と実行</em>で解決する。</h2><p>Web制作・SEO・AI・業務改善の情報を分かりやすく届け、必要に応じてサイトの診断・改善・制作まで支援します。</p><div className="hero-actions"><a className="button button--primary" href="/knowledge">ナレッジを見る <b>→</b></a><a className="button button--secondary" href="/services">サービスを見る <b>→</b></a></div></div>
      <div className="mv-concept-art" aria-hidden="true"><strong>WGL</strong><div className="mv-art-steps"><span><b>01</b> KNOWLEDGE</span><span><b>02</b> ANALYSIS</span><span><b>03</b> ACTION</span></div><div className="mv-art-signal"><i /><i /><i /><i /></div><small>LEARN · IMPROVE · GROW</small></div>
    </section>)}</div>
    <SiteFooter />
  </main>;
}
