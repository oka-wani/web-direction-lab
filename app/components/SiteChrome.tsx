type Current = "news" | "knowledge" | "column" | "about";

export function SiteHeader({ current }: { current?: Current }) {
  return <header className="site-header">
    <a className="logo" href="/" aria-label="Web Direction Lab トップ">Web Direction <span>Lab</span></a>
    <nav aria-label="メインナビゲーション">
      <a href="/knowledge" aria-current={current === "knowledge" ? "page" : undefined}>Webナレッジ</a>
      <a href="/column" aria-current={current === "column" ? "page" : undefined}>コラム</a>
      <a href="/news" aria-current={current === "news" ? "page" : undefined}>ニュース</a>
      <a href="/about" aria-current={current === "about" ? "page" : undefined}>このサイトについて</a>
    </nav>
  </header>;
}

export function SiteFooter() {
  return <footer className="site-footer">
    <div><a className="logo" href="/">Web Direction <span>Lab</span></a><p>Webの変化を知り、体系的に学び、自分の仕事に生かすためのメディア。</p></div>
    <nav aria-label="フッターナビゲーション"><a href="/about">このサイトについて</a><a href="/about#editorial">記事作成・編集方針</a><a href="/about#contact">お問い合わせ</a><a href="/about#privacy">プライバシーポリシー</a></nav>
    <small>© 2026 Web Direction Lab</small>
  </footer>;
}
