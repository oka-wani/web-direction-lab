import { SiteFooter, SiteHeader } from "../components/SiteChrome";

const concepts = [
  { id: "white-grid-layers", name: "白 B-01｜Connected layers", note: "立体的に重なるWebページを、一本の黄緑の導線がつなぐ案", tone: "white", art: "layers" },
  { id: "white-grid-monogram", name: "白 B-02｜WGL monogram", note: "大きなWの造形とページレイヤーを融合した、ブランド性の強い案", tone: "white", art: "monogram" },
  { id: "white-grid-cascade", name: "白 B-03｜Forward cascade", note: "斜めに展開するページ群で、改善が前へ進む印象をつくる案", tone: "white", art: "cascade" },
  { id: "white-grid-rebuild", name: "白 B-04｜Reframe", note: "一枚のWebページが分解・再構成される、課題解決を抽象化した案", tone: "white", art: "rebuild" },
  { id: "white-editorial", name: "白 01｜Editorial", note: "余白と大きな文字を主役にした、最も端正な案", tone: "white" },
  { id: "white-split", name: "白 02｜Structured split", note: "濃紺の情報面を右に置き、支援サイトらしさを出す案", tone: "white" },
  { id: "white-orbit", name: "白 03｜Growth orbit", note: "成長の流れを円と線で抽象化した、少し柔らかい案", tone: "white" },
  { id: "navy-editorial", name: "濃紺 01｜Bold editorial", note: "濃紺一色と巨大なWGLで、信頼感を強く出す案", tone: "navy" },
  { id: "navy-signal", name: "濃紺 02｜Growth signal", note: "細いグリッドと上昇ラインで、分析・改善を表す案", tone: "navy" },
  { id: "navy-panel", name: "濃紺 03｜Knowledge panel", note: "白い情報パネルを組み合わせ、内容の豊かさを見せる案", tone: "navy" },
] as const;

type BrandArt = "layers" | "monogram" | "cascade" | "rebuild";

function PageLayer({ className = "" }: { className?: string }) {
  return <div className={`brand-page ${className}`}><span className="brand-page-bar"><i /><i /><i /></span><b /><em /><em /><div><i /><i /></div></div>;
}

function BrandIllustration({ type }: { type: BrandArt }) {
  if (type === "layers") return <div className="brand-visual brand-visual--layers" aria-hidden="true">
    <PageLayer className="brand-page--back" />
    <PageLayer className="brand-page--middle" />
    <PageLayer className="brand-page--front" />
    <span className="brand-route brand-route--one" /><span className="brand-route brand-route--two" />
    <i className="brand-route-dot brand-route-dot--one" /><i className="brand-route-dot brand-route-dot--two" />
    <strong>WGL</strong><small>STRUCTURE / CONNECT / GROW</small>
  </div>;

  if (type === "monogram") return <div className="brand-visual brand-visual--monogram" aria-hidden="true">
    <strong>W</strong>
    <PageLayer className="brand-page--mono-one" />
    <PageLayer className="brand-page--mono-two" />
    <span className="brand-mono-line" /><i className="brand-mono-dot" />
    <small>WEB GROWTH LAB</small>
  </div>;

  if (type === "cascade") return <div className="brand-visual brand-visual--cascade" aria-hidden="true">
    <PageLayer className="brand-page--cascade-one" />
    <PageLayer className="brand-page--cascade-two" />
    <PageLayer className="brand-page--cascade-three" />
    <span className="brand-cascade-line" /><i className="brand-cascade-arrow">→</i>
    <small>MOVE THE WEB FORWARD</small>
  </div>;

  return <div className="brand-visual brand-visual--rebuild" aria-hidden="true">
    <div className="brand-frame"><span /><span /><span /><span /></div>
    <div className="brand-piece brand-piece--one" /><div className="brand-piece brand-piece--two" /><div className="brand-piece brand-piece--three" />
    <span className="brand-rebuild-line" /><i className="brand-rebuild-dot" />
    <strong>RE:WEB</strong><small>ANALYZE / DESIGN / IMPROVE</small>
  </div>;
}

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
    <header className="mv-preview-intro"><span>MV DESIGN OPTIONS</span><h1>TOP MV デザイン比較</h1><p>白い方眼背景と左側のコピーを固定し、右側を一枚のブランドビジュアルとして作り直した4案を先頭に掲載しています。</p></header>
    <div className="mv-concept-list">{concepts.map((concept) => <section className={`mv-concept mv-concept--${concept.id}`} data-tone={concept.tone} key={concept.id}>
      <div className="mv-concept-label"><span>{concept.name}</span><small>{concept.note}</small></div>
      <div className="mv-concept-copy"><p className="eyebrow">WEB GROWTH LAB</p><h2>Webの課題を、<br /><em>知識と実行</em>で解決する。</h2><p>Web制作・SEO・AI・業務改善の情報を分かりやすく届け、必要に応じてサイトの診断・改善・制作まで支援します。</p><div className="hero-actions"><a className="button button--primary" href="/knowledge">ナレッジを見る <b>→</b></a><a className="button button--secondary" href="/services">サービスを見る <b>→</b></a></div></div>
      {"art" in concept && concept.art && ["layers", "monogram", "cascade", "rebuild"].includes(concept.art)
        ? <BrandIllustration type={concept.art as BrandArt} />
        : "art" in concept && concept.art
          ? <GridIllustration type={concept.art as "sitemap" | "loop" | "search" | "browser" | "flow"} />
          : <div className="mv-concept-art" aria-hidden="true"><strong>WGL</strong><div className="mv-art-steps"><span><b>01</b> KNOWLEDGE</span><span><b>02</b> ANALYSIS</span><span><b>03</b> ACTION</span></div><div className="mv-art-signal"><i /><i /><i /><i /></div><small>LEARN · IMPROVE · GROW</small></div>}
    </section>)}</div>
    <SiteFooter />
  </main>;
}
