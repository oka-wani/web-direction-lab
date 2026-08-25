"use client";

import { useState } from "react";
import { BrandLogo } from "./BrandLogo";

type Current = "home" | "learn" | "news" | "knowledge" | "column" | "tools" | "services" | "pricing" | "cases" | "about" | "contact" | "examples" | "flow" | "quality";

const navigation = [
  { href: "/", label: "TOP", current: "home" },
  { href: "/services", label: "サービス", current: "services" },
  { href: "/pricing", label: "料金", current: "pricing" },
  { href: "/flow", label: "制作の流れ", current: "flow" },
  { href: "/examples", label: "制作イメージ", current: "examples" },
  { href: "/column", label: "コラム", current: "column" },
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
    <div className="footer-brand"><a className="logo" href="/"><BrandLogo /></a><p>早く・手頃に・ちゃんとしたWebサイトを。公開後の保守・改善まで分かりやすく支援します。</p></div>
    <div className="footer-nav-groups">
      <nav aria-label="サービス"><b>サービス</b><a href="/services">Webサイト制作</a><a href="/pricing">料金・プラン</a><a href="/flow">制作の流れ</a><a href="/services#support">公開後の保守・改善</a></nav>
      <nav aria-label="制作と品質"><b>制作と品質</b><a href="/examples">制作イメージ</a><a href="/examples/restaurant">飲食店サイト</a><a href="/quality">品質・技術について</a><a href="/quality/cms">CMSについて</a></nav>
      <nav aria-label="Wani san Web"><b>Wani san Web</b><a href="/column">コラム</a><a href="/news">お知らせ</a><a href="/about">WSWについて</a><a href="/contact">お問い合わせ</a></nav>
    </div>
    <div className="footer-policy"><a href="/about#privacy">プライバシーポリシー</a><a href="/about#contact">運営・お問い合わせ</a></div>
    <small>© 2026 Wani san Web</small>
  </footer>;
}
