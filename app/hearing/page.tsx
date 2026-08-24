import type { Metadata } from "../astro-compat";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import HearingForm from "./HearingForm";

export const metadata: Metadata = {
  title: "制作ヒアリング｜Wani san Web",
  description: "Webサイト制作に必要な目的、ターゲット、掲載内容、デザイン、機能、運用についてご回答いただく専用ヒアリングシートです。",
};

export default function HearingPage() {
  return <main className="order-page hearing-page">
    <SiteHeader />
    <section className="order-page-hero hearing-hero">
      <span>PROJECT HEARING</span>
      <h1>サイト制作に必要なことを、<br />順番に整理します。</h1>
      <p>分からない項目は「おまかせ」「未定」で問題ありません。いただいた回答をもとに、サイトの目的・ターゲット・構成・ラフ案を整理します。</p>
    </section>

    <section className="order-section hearing-intro">
      <div className="order-section-heading">
        <div><span>ABOUT THIS SHEET</span><h2>回答内容は、そのままラフ設計の入力になります。</h2></div>
        <p>目的、ターゲット、伝えたいこと、掲載内容、デザイン、必要機能を整理し、後工程のサイトマップ・ページ構成・CTA設計に利用します。</p>
      </div>
      <div className="hearing-flow">
        <div><b>01</b><span>ヒアリング回答</span></div>
        <div><b>02</b><span>要件・訴求整理</span></div>
        <div><b>03</b><span>サイトマップ作成</span></div>
        <div><b>04</b><span>ページラフ作成</span></div>
      </div>
    </section>

    <section className="order-section hearing-form-section">
      <HearingForm />
    </section>
    <SiteFooter />
  </main>;
}
