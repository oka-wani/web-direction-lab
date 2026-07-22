import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import ColumnList from "./ColumnList";

export const metadata: Metadata = { title:"コラム｜Web Growth Lab", description:"Webの仕事術とWeb改善をテーマに、思わず理由を知りたくなる疑問を実務の視点で掘り下げます。" };

export default function ColumnPage() {
  return <main className="column-page"><SiteHeader current="column" /><section className="column-hero"><span className="section-kicker" aria-hidden="true">COLUMN</span><h1>コラム</h1><p>仕事の進め方やWeb改善の「なぜ？」を、すぐ試せるヒントと一緒に掘り下げます。</p></section><section className="column-index"><ColumnList /></section><SiteFooter /></main>;
}
