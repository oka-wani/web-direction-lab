import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import ColumnList from "./ColumnList";

export const metadata: Metadata = { title:"コラム｜Web Growth Lab", description:"Webサイト制作、改善、CMS・運用、SEO・アクセス解析、業務効率化・AI活用を、判断と実践につながる形で解説します。" };

export default function ColumnPage() {
  return <main className="column-page"><SiteHeader current="column" /><section className="column-hero"><span className="section-kicker" aria-hidden="true">COLUMN</span><h1>コラム</h1><p>Webサイトを作る、改善する、運用する、業務を効率化するための判断材料と実践方法を紹介します。</p></section><section className="column-index"><ColumnList /></section><SiteFooter /></main>;
}
