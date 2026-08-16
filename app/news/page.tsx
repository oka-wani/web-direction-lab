import type { Metadata } from "../astro-compat";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import NewsList from "./NewsList";

export const metadata: Metadata = { title: "お知らせ｜Wani san Web", description: "Wani san Webのサービス、制作イメージ、サイト更新、営業に関するお知らせです。" };

export default function NewsPage() {
  return <main className="archive-page news-page"><SiteHeader current="news" /><section className="archive-hero news-hero"><span className="section-kicker" aria-hidden="true">NEWS</span><h1>お知らせ</h1><p>サービス、制作イメージ、サイト更新など、WSW自身のお知らせを掲載します。</p></section><section className="archive-main"><NewsList /></section><SiteFooter /></main>;
}
