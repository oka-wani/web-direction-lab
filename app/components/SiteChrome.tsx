"use client";

import { useState } from "react";

type Current = "learn" | "news" | "knowledge" | "column" | "tools" | "services" | "pricing" | "cases" | "about" | "contact";

const navigation = [
  { href: "/learn", label: "学ぶ", current: "learn" },
  { href: "/tools", label: "ツール", current: "tools" },
  { href: "/services", label: "サービス", current: "services" },
  { href: "/pricing", label: "料金", current: "pricing" },
  { href: "/cases", label: "改善事例", current: "cases" },
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
      {navigation.map((item) => {
        const selected = current === item.current || (item.current === "learn" && ["news", "knowledge", "column"].includes(current ?? ""));
        return <a href={item.href} aria-current={selected ? "page" : undefined} onClick={() => setMenuOpen(false)} key={item.href}>{item.label}</a>;
      })}
      <a className="header-contact" href="/contact" aria-current={current === "contact" ? "page" : undefined} onClick={() => setMenuOpen(false)}>お問い合わせ <span>→</span></a>
    </nav>
  </header>;
}

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-brand"><a className="logo" href="/">Web Direction <span>Lab</span></a><p>Webで成果を出すための知識・ツール・サービスを提供するプラットフォーム。</p></div>
    <div className="footer-nav-groups">
      <nav aria-label="学ぶ"><b>学ぶ</b><a href="/knowledge#basics">Webガイド</a><a href="/knowledge#articles">ナレッジ</a><a href="/column">コラム</a><a href="/news">ニュース</a></nav>
      <nav aria-label="サービス"><b>サービス</b><a href="/services">サービス一覧</a><a href="/pricing">料金</a><a href="/process">進め方</a><a href="/faq">よくある質問</a></nav>
      <nav aria-label="WDL"><b>WDL</b><a href="/tools">ツール</a><a href="/cases">改善事例</a><a href="/about">このサイトについて</a><a href="/contact">お問い合わせ</a></nav>
    </div>
    <div className="footer-policy"><a href="/about#editorial">記事作成・編集方針</a><a href="/about#privacy">プライバシーポリシー</a></div>
    <small>© 2026 Web Direction Lab</small>
  </footer>;
}
