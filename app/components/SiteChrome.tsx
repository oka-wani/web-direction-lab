"use client";

import { useState } from "react";
import { BrandLogo } from "./BrandLogo";

type Current = "learn" | "news" | "knowledge" | "column" | "tools" | "services" | "pricing" | "cases" | "about" | "contact";

const navigation = [
  { href: "/services", label: "サービス", current: "services" },
  { href: "/knowledge", label: "ナレッジ", current: "knowledge" },
  { href: "/column", label: "コラム", current: "column" },
  { href: "/news", label: "ニュース", current: "news" },
  { href: "/about", label: "Wani san Webについて", current: "about" },
] as const;

// Shared navigation order is consistent across every public page.
export function SiteHeader({ current }: { current?: Current }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return <header className="site-header">
    <a className="logo" href="/" aria-label="Wani san Web トップ" onClick={() => setMenuOpen(false)}><BrandLogo /></a>
    <button className="nav-toggle" type="button" aria-controls="site-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"} onClick={() => setMenuOpen((open) => !open)}>
      <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
    </button>
    <nav id="site-navigation" className={menuOpen ? "is-open" : undefined} aria-label="メインナビゲーション">
      {navigation.map((item) => {
        const selected = current === item.current || (item.current === "services" && current === "tools");
        return <a href={item.href} aria-current={selected ? "page" : undefined} onClick={() => setMenuOpen(false)} key={item.href}>{item.label}</a>;
      })}
      <a className="header-contact" href="/contact" aria-current={current === "contact" ? "page" : undefined} onClick={() => setMenuOpen(false)}>無料で相談する <span>→</span></a>
    </nav>
  </header>;
}

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-brand"><a className="logo" href="/"><BrandLogo /></a><p>小さな会社の集客と業務を改善する。WebとAIを活用し、売上と利益を増やすWeb・DXパートナーです。</p></div>
    <div className="footer-nav-groups">
      <nav aria-label="サービス"><b>サービス</b><a href="/services">サービス・料金</a><a href="/process">制作・支援の流れ</a><a href="/cases">制作・改善事例</a></nav>
      <nav aria-label="コンテンツ"><b>コンテンツ</b><a href="/knowledge">ナレッジ</a><a href="/column">コラム</a><a href="/news">Webニュース</a></nav>
      <nav aria-label="Wani san Web"><b>Wani san Web</b><a href="/about">私たちについて</a><a href="/faq">よくある質問</a><a href="/contact">相談・問い合わせ</a></nav>
    </div>
    <div className="footer-policy"><a href="/about#editorial">記事作成・編集方針</a><a href="/about#privacy">プライバシーポリシー</a></div>
    <small>© 2026 Wani san Web</small>
  </footer>;
}
