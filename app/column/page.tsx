import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import ColumnList from "./ColumnList";

export const metadata: Metadata = { title:"コラム｜Web Direction Lab", description:"仕事の効率化と行動経済をテーマに、毎日の仕事で使える考え方と具体策をまとめます。" };

export default function ColumnPage() {
  return <main className="column-page"><SiteHeader current="column" /><section className="column-hero"><span className="section-kicker" aria-hidden="true">COLUMN</span><h1>コラム</h1><p>仕事を前へ進める効率化と、人の行動を読み解く行動経済の視点をまとめます。</p></section><section className="column-index"><ColumnList /></section><SiteFooter /></main>;
}
