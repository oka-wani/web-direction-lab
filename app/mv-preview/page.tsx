import { SiteFooter, SiteHeader } from "../components/SiteChrome";

const concepts = [
  { id: "white-grid", name: "白 A｜Growth dashboard", tone: "white" },
  { id: "white-editorial", name: "白 B｜Editorial index", tone: "white" },
  { id: "navy-dashboard", name: "濃紺 A｜Data layers", tone: "navy" },
  { id: "navy-type", name: "濃紺 B｜Bold typography", tone: "navy" },
] as const;

export default function MvPreviewPage() {
  return <main className="mv-preview-page"><SiteHeader />
    <header className="mv-preview-intro"><span>MV DESIGN OPTIONS</span><h1>TOP MV デザイン比較</h1><p>白ベース2案、濃紺ベース2案です。文章と導線は同じまま、第一印象だけを比較できます。</p></header>
    <div className="mv-concept-list">{concepts.map((concept) => <section className={`mv-concept mv-concept--${concept.id}`} data-tone={concept.tone} key={concept.id}>
      <div className="mv-concept-label"><span>{concept.name}</span><small>{concept.id}</small></div>
      <div className="mv-concept-copy"><p className="eyebrow">WEB GROWTH LAB</p><h2>Webの課題を、<br /><em>知識と実行</em>で解決する。</h2><p>Web制作・SEO・AI・業務改善の情報を分かりやすく届け、必要に応じてサイトの診断・改善・制作まで支援します。</p><div className="hero-actions"><a className="button button--primary" href="/knowledge">ナレッジを見る <b>→</b></a><a className="button button--secondary" href="/services">サービスを見る <b>→</b></a></div></div>
      <div className="mv-concept-art" aria-hidden="true"><strong>WGL</strong><i /><i /><i /><span>KNOWLEDGE · ANALYSIS · ACTION</span></div>
    </section>)}</div>
    <SiteFooter />
  </main>;
}
