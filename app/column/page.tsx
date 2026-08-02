import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import ColumnList from "./ColumnList";

export const metadata: Metadata = { title:"コラム｜Wani san Web", description:"中小企業のWebマーケティングとAI・業務改善を、具体的な悩みから解説します。" };

export default function ColumnPage() {
  return <main className="column-page"><SiteHeader current="column" /><section className="column-hero"><span className="section-kicker" aria-hidden="true">COLUMN</span><h1>コラム</h1><p>「問い合わせが来ない」「同じ作業に時間がかかる」など、小さな会社の悩みを解決する実践方法を紹介します。</p></section><section className="column-index"><ColumnList /></section><SiteFooter /></main>;
}
