import { SiteFooter, SiteHeader } from "../components/SiteChrome";

const concepts = [
  { id: "white-grid-sitemap", name: "白 A-01｜Site blueprint", note: "濃紺の設計図＋黄緑の導線。サイト設計・情報設計を表す案", tone: "white", art: "sitemap" },
  { id: "white-grid-loop", name: "白 A-02｜Improvement loop", note: "濃紺の円形図＋黄緑の軌道。分析から改善までの伴走感を表す案", tone: "white", art: "loop" },
  { id: "white-grid-search", name: "白 A-03｜Search growth", note: "濃紺の検索画面＋黄緑のグラフ。SEOと成果改善を表す案", tone: "white", art: "search" },
  { id: "white-grid-browser", name: "白 A-04｜Web audit", note: "濃紺のブラウザ＋黄緑のチェック。診断・制作・運用を表す案", tone: "white", art: "browser" },
  { id: "white-grid-flow", name: "白 A-05｜Knowledge flow", note: "濃紺のカード＋黄緑の接続線。知識を実行へ変える流れを表す案", tone: "white", art: "flow" },
  { id: "white-editorial", name: "白 01｜Editorial", note: "余白と大きな文字を主役にした、最も端正な案", tone: "white" },
  { id: "white-split", name: "白 02｜Structured split", note: "濃紺の情報面を右に置き、支援サイトらしさを出す案", tone: "white" },
  { id: "white-orbit", name: "白 03｜Growth orbit", note: "成長の流れを円と線で抽象化した、少し柔らかい案", tone: "white" },
  { id: "navy-editorial", name: "濃紺 01｜Bold editorial", note: "濃紺一色と巨大なWGLで、信頼感を強く出す案", tone: "navy" },
  { id: "navy-signal", name: "濃紺 02｜Growth signal", note: "細いグリッドと上昇ラインで、分析・改善を表す案", tone: "navy" },
  { id: "navy-panel", name: "濃紺 03｜Knowledge panel", note: "白い情報パネルを組み合わせ、内容の豊かさを見せる案", tone: "navy" },
] as const;

function GridIllustration({ type }: { type: "sitemap" | "loop" | "search" | "browser" | "flow" }) {
  if (type === "sitemap") return <div className="grid-illustration grid-illustration--sitemap" aria-hidden="true">
    <span className="diagram-caption">SITE ARCHITECTURE</span>
    <div className="site-node site-node--home"><small>01</small><b>TOP</b><i /></div>
    <div className="site-branch" />
    <div className="site-node site-node--knowledge"><small>02</small><b>KNOWLEDGE</b><i /></div>
    <div className="site-node site-node--service"><small>03</small><b>SERVICE</b><i /></div>
    <div className="site-node site-node--contact"><small>04</small><b>CONTACT</b><i /></div>
    <em>STRUCTURE · FLOW · CONVERSION</em>
  </div>;

  if (type === "loop") return <div className="grid-illustration grid-illustration--loop" aria-hidden="true">
    <span className="diagram-caption">IMPROVEMENT CYCLE</span>
    <div className="loop-ring"><i /><i /><i /><strong>GROW</strong></div>
    <div className="loop-label loop-label--one"><b>01</b><span>ANALYZE</span></div>
    <div className="loop-label loop-label--two"><b>02</b><span>DESIGN</span></div>
    <div className="loop-label loop-label--three"><b>03</b><span>IMPROVE</span></div>
    <em>LEARN · TEST · UPDATE</em>
  </div>;

  if (type === "search") return <div className="grid-illustration grid-illustration--search" aria-hidden="true">
    <span className="diagram-caption">SEARCH PERFORMANCE</span>
    <div className="search-window"><div><i /><span>web growth</span><b>⌕</b></div><ol><li><small>01</small><span /><span /></li><li><small>02</small><span /><span /></li><li><small>03</small><span /><span /></li></ol></div>
    <div className="growth-chart"><i /><i /><i /><i /><b>↗</b></div>
    <em>DISCOVER · OPTIMIZE · GROW</em>
  </div>;

  if (type === "browser") return <div className="grid-illustration grid-illustration--browser" aria-hidden="true">
    <span className="diagram-caption">WEB OPERATION</span>
    <div className="browser-window"><header><i /><i /><i /><span>web-direction-lab.jp</span></header><div className="browser-body"><aside><i /><i /><i /></aside><main><b /><span /><span /><div><i /><i /><i /></div></main></div></div>
    <ul className="browser-checks"><li><b>✓</b> SEO</li><li><b>✓</b> UX</li><li><b>✓</b> A11Y</li></ul>
    <em>DESIGN · CHECK · OPERATE</em>
  </div>;

  return <div className="grid-illustration grid-illustration--flow" aria-hidden="true">
    <span className="diagram-caption">KNOWLEDGE TO ACTION</span>
    <div className="flow-path"><i /><i /><i /></div>
    <div className="flow-card flow-card--knowledge"><small>01</small><b>KNOWLEDGE</b><span>LEARN</span></div>
    <div className="flow-card flow-card--analysis"><small>02</small><b>ANALYSIS</b><span>FIND</span></div>
    <div className="flow-card flow-card--action"><small>03</small><b>ACTION</b><span>GROW</span></div>
    <strong className="flow-result">+24%</strong>
    <em>LEARN · ANALYZE · ACT</em>
  </div>;
}

export default function MvPreviewPage() {
  return <main className="mv-preview-page"><SiteHeader />
    <header className="mv-preview-intro"><span>MV DESIGN OPTIONS</span><h1>TOP MV デザイン比較</h1><p>白Aの方眼背景を固定し、右側を濃紺ベース＋黄緑アクセントで作り分けた5案を先頭に掲載しています。</p></header>
    <div className="mv-concept-list">{concepts.map((concept) => <section className={`mv-concept mv-concept--${concept.id}`} data-tone={concept.tone} key={concept.id}>
      <div className="mv-concept-label"><span>{concept.name}</span><small>{concept.note}</small></div>
      <div className="mv-concept-copy"><p className="eyebrow">WEB GROWTH LAB</p><h2>Webの課題を、<br /><em>知識と実行</em>で解決する。</h2><p>Web制作・SEO・AI・業務改善の情報を分かりやすく届け、必要に応じてサイトの診断・改善・制作まで支援します。</p><div className="hero-actions"><a className="button button--primary" href="/knowledge">ナレッジを見る <b>→</b></a><a className="button button--secondary" href="/services">サービスを見る <b>→</b></a></div></div>
      {"art" in concept && concept.art ? <GridIllustration type={concept.art} /> : <div className="mv-concept-art" aria-hidden="true"><strong>WGL</strong><div className="mv-art-steps"><span><b>01</b> KNOWLEDGE</span><span><b>02</b> ANALYSIS</span><span><b>03</b> ACTION</span></div><div className="mv-art-signal"><i /><i /><i /><i /></div><small>LEARN · IMPROVE · GROW</small></div>}
    </section>)}</div>
    <SiteFooter />
  </main>;
}
