import type { Metadata } from "../astro-compat";
import "../hearing.css";
import "../hearing-fix.css";
import HearingForm from "./HearingForm";

export const metadata: Metadata = {
  title: "Webサイト制作ヒアリング｜Wani san Web",
  description: "約10分で、サイト構成・各ページのラフ案・必要な機能まで整理する制作ヒアリングシートです。",
};

export default function HearingPage(){
  return <main className="hearing-page hearing-sheet-page">
    <header className="hearing-sheet-header"><a href="/">Wani san Web</a><span>Webサイト制作ヒアリング</span></header>
    <div className="hearing-sheet-wrap">
      <section className="hearing-sheet-hero"><span>HEARING SHEET</span><h1>10分で、サイトの素案を。</h1><p>回答をもとに、サイト構成・各ページのラフ案・必要な機能まで整理します。分からない項目は「相談して決めたい」を選択できます。</p><div><b>約10分<small>選択式を中心に回答</small></b><b>自動保存<small>同じ端末から再開</small></b></div></section>
      <section className="hearing-sheet-card"><HearingForm /></section>
    </div>
  </main>;
}
