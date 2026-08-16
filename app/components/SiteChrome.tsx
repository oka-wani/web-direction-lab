"use client";

import { useState } from "react";
import { BrandLogo } from "./BrandLogo";

type Current = "learn" | "news" | "knowledge" | "column" | "tools" | "services" | "pricing" | "cases" | "about" | "contact" | "demo" | "quality";

const navigation = [
  { href: "/services", label: "サービス", current: "services" },
  { href: "/demo", label: "制作イメージ", current: "demo" },
  { href: "/column", label: "コラム", current: "column" },
  { href: "/news", label: "お知らせ", current: "news" },
  { href: "/about", label: "WSWについて", current: "about" },
] as const;

export function SiteHeader({ current }: { current?: Current }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return <header className="site-header">
    <a className="logo" href="/" aria-label="Wani san Web トップ" onClick={() => setMenuOpen(false)}><BrandLogo /></a>
    <button className="nav-toggle" type="button" aria-controls="site-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"} onClick={() => setMenuOpen((open) => !open)}>
      <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
    </button>
    <nav id="site-navigation" className={menuOpen ? "is-open" : undefined} aria-label="メインナビゲーション">
      {navigation.map((item) => {
        const selected = current === item.current;
        return <a href={item.href} aria-current={selected ? "page" : undefined} onClick={() => setMenuOpen(false)} key={item.href}>{item.label}</a>;
      })}
      <a className="header-contact" href="/contact" aria-current={current === "contact" ? "page" : undefined} onClick={() => setMenuOpen(false)}>相談する <span>→</span></a>
    </nav>
  </header>;
}

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-brand"><a className="logo" href="/"><BrandLogo /></a><p>短期間でも、品質は妥協しない。Webサイト制作とWeb改善を、分かりやすく提供します。</p></div>
    <div className="footer-nav-groups">
      <nav aria-label="サービス"><b>サービス</b><a href="/services/web-production">Web制作</a><a href="/services/web-improvement">Web改善</a><a href="/process">ご依頼の流れ</a></nav>
      <nav aria-label="制作と品質"><b>制作と品質</b><a href="/demo">制作イメージ</a><a href="/quality">品質・技術について</a><a href="/quality/cms">CMSについて</a><a href="/quality/form">問い合わせフォームについて</a></nav>
      <nav aria-label="Wani san Web"><b>Wani san Web</b><a href="/column">コラム</a><a href="/news">お知らせ</a><a href="/about">WSWについて</a><a href="/contact">お問い合わせ</a></nav>
    </div>
    <div className="footer-policy"><a href="/about#privacy">プライバシーポリシー</a><a href="/about#contact">運営・お問い合わせ</a></div>
    <small>© 2026 Wani san Web</small>
  </footer>;
}
