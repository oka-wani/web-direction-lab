import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import NewsList from "./NewsList";

export const metadata: Metadata = { title: "ニュース｜Web Direction Lab", description: "Web、AI、SEO、マーケティング、セキュリティなどの最新情報を簡潔に整理します。" };

export default function NewsPage() {
  return <main className="archive-page news-page"><SiteHeader current="news" /><section className="archive-hero news-hero"><p className="section-kicker">NEWS</p><h1>ニュース</h1></section><section className="archive-main"><NewsList /></section><SiteFooter /></main>;
}
