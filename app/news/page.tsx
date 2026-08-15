import type { Metadata } from "../astro-compat";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import NewsList from "./NewsList";

export const metadata: Metadata = { title: "ニュース｜Wani san Web", description: "Web、AI、SEO、マーケティング、セキュリティなどの最新情報を簡潔に整理します。" };

export default function NewsPage() {
  return <main className="archive-page news-page"><SiteHeader current="news" /><section className="archive-hero news-hero"><span className="section-kicker" aria-hidden="true">NEWS</span><h1>ニュース</h1></section><section className="archive-main"><NewsList /></section><SiteFooter /></main>;
}
