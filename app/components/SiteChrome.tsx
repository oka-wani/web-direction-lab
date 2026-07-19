type Current = "news" | "knowledge" | "column";

export function SiteHeader({ current }: { current?: Current }) {
  return <header className="site-header">
    <a className="logo" href="/" aria-label="Web Direction Lab トップ">Web Direction <span>Lab</span></a>
    <nav aria-label="メインナビゲーション">
      <a href="/news" aria-current={current === "news" ? "page" : undefined}>ニュース</a>
      <a href="/knowledge" aria-current={current === "knowledge" ? "page" : undefined}>Webナレッジ</a>
      <a href="/column" aria-current={current === "column" ? "page" : undefined}>コラム</a>
    </nav>
  </header>;
}

export function SiteFooter() {
  return <footer>
    <a className="logo" href="/">Web Direction <span>Lab</span></a>
    <p>Webの変化を知り、体系的に学び、自分の仕事に生かすためのメディア。</p>
    <small>© 2026 Web Direction Lab</small>
  </footer>;
}
