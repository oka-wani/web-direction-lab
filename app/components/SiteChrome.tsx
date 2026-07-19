"use client";

import { useState } from "react";

type Current = "news" | "knowledge" | "column" | "about";

const navigation = [
  { href: "/knowledge", label: "Webナレッジ", current: "knowledge" },
  { href: "/column", label: "コラム", current: "column" },
  { href: "/news", label: "ニュース", current: "news" },
  { href: "/about", label: "このサイトについて", current: "about" },
] as const;

// Shared navigation order is consistent across every public page.
export function SiteHeader({ current }: { current?: Current }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return <header className="site-header">
    <a className="logo" href="/" aria-label="Web Direction Lab トップ" onClick={() => setMenuOpen(false)}>Web Direction <span>Lab</span></a>
    <button className="nav-toggle" type="button" aria-controls="site-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"} onClick={() => setMenuOpen((open) => !open)}>
      <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
    </button>
    <nav id="site-navigation" className={menuOpen ? "is-open" : undefined} aria-label="メインナビゲーション">
      {navigation.map((item) => <a href={item.href} aria-current={current === item.current ? "page" : undefined} onClick={() => setMenuOpen(false)} key={item.href}>{item.label}</a>)}
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
