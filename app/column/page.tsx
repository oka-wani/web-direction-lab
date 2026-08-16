import type { Metadata } from "../astro-compat";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import ColumnList from "./ColumnList";

export const metadata: Metadata = { title:"コラム｜Wani san Web", description:"ホームページ制作の費用・期間・CMS・運用・SEO・アクセス解析など、制作や改善を検討する方に役立つ情報を紹介します。" };

export default function ColumnPage() {
  return <main className="column-page"><SiteHeader current="column" /><section className="column-hero"><span className="section-kicker" aria-hidden="true">COLUMN</span><h1>コラム</h1><p>ホームページを作る前、作った後に迷いやすいことを、依頼する側の目線で分かりやすく整理します。</p></section><section className="column-index"><ColumnList /></section><SiteFooter /></main>;
}
