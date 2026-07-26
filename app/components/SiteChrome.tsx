"use client";

import { useState } from "react";

type Current = "learn" | "news" | "knowledge" | "column" | "tools" | "services" | "pricing" | "cases" | "about" | "contact";

const navigation = [
  { href: "/services", label: "サービス", current: "services" },
  { href: "/pricing", label: "料金", current: "pricing" },
  { href: "/cases", label: "制作・改善事例", current: "cases" },
  { href: "/column", label: "コラム", current: "column" },
  { href: "/knowledge", label: "ナレッジ", current: "knowledge" },
] as const;

// Shared navigation order is consistent across every public page.
export function SiteHeader({ current }: { current?: Current }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return <header className="site-header">
    <a className="logo" href="/" aria-label="Web Growth Lab トップ" onClick={() => setMenuOpen(false)}>Web Growth <span>Lab</span></a>
    <button className="nav-toggle" type="button" aria-controls="site-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"} onClick={() => setMenuOpen((open) => !open)}>
      <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
    </button>
    <nav id="site-navigation" className={menuOpen ? "is-open" : undefined} aria-label="メインナビゲーション">
      {navigation.map((item) => {
        const selected = current === item.current || (item.current === "services" && current === "tools");
        return <a href={item.href} aria-current={selected ? "page" : undefined} onClick={() => setMenuOpen(false)} key={item.href}>{item.label}</a>;
      })}
      <a className="header-contact" href="/contact" aria-current={current === "contact" ? "page" : undefined} onClick={() => setMenuOpen(false)}>相談する <span>→</span></a>
    </nav>
  </header>;
}

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-brand"><a className="logo" href="/">Web Growth <span>Lab</span></a><p>Webサイトと仕組みで、事業の課題を小さく解決する。制作前の整理から、公開後の運用・改善まで支援します。</p></div>
    <div className="footer-nav-groups">
      <nav aria-label="サービス"><b>サービス</b><a href="/services">サービス一覧</a><a href="/pricing">料金の目安</a><a href="/process">制作・支援の流れ</a><a href="/cases">制作・改善事例</a></nav>
      <nav aria-label="コンテンツ"><b>コンテンツ</b><a href="/column">コラム</a><a href="/knowledge">ナレッジ</a><a href="/news">Webニュース</a></nav>
      <nav aria-label="WGL"><b>WGL</b><a href="/about">このサイトについて</a><a href="/faq">よくある質問</a><a href="/contact">相談・問い合わせ</a></nav>
    </div>
    <div className="footer-policy"><a href="/about#editorial">記事作成・編集方針</a><a href="/about#privacy">プライバシーポリシー</a></div>
    <small>© 2026 Web Growth Lab</small>
  </footer>;
}
