import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import ColumnList from "./ColumnList";

export const metadata: Metadata = { title:"コラム｜Web Direction Lab", description:"Webの仕事、AI活用、サイト改善、キャリアをテーマに、実務で役立つ視点と具体策をまとめます。" };

export default function ColumnPage() {
  return <main className="column-page"><SiteHeader current="column" /><section className="column-hero"><span className="section-kicker" aria-hidden="true">COLUMN</span><h1>コラム</h1><p>Webの現場で起きる悩みや変化を、実務へつなげる視点で分かりやすく掘り下げます。</p></section><section className="column-index"><ColumnList /></section><SiteFooter /></main>;
}
