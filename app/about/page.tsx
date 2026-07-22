import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = { title:"このサイトについて｜Web Direction Lab", description:"Web Direction Labの目的、提供する知識・ツール・サービス、記事作成・編集方針、AI利用、プライバシーについてご案内します。" };

const sections = [
  { id:"site", number:"01", title:"サイトについて", body:<><p>Web Direction Labは、<mark>Webで成果を出すための知識・ツール・サービスを提供するプラットフォーム</mark>です。情報を発信するだけでなく、学ぶ、使う、相談するまでを一つにつなげます。</p><dl><div><dt>サイトの目的</dt><dd>Web制作・SEO・AI・業務改善の知識を、実際の判断と改善へつなげること。</dd></div><div><dt>対象となる方</dt><dd>中小企業、個人事業主、社内Web担当者、Webディレクター、制作担当者。</dd></div><div><dt>提供すること</dt><dd>実務ナレッジ、無料ツール・テンプレート、Webサイト診断・改善・制作・運用支援。</dd></div></dl></> },
  { id:"contents", number:"02", title:"提供内容について", body:<><p>WDLでは、3つの入口を用意します。</p><dl><div><dt>学ぶ</dt><dd>Webガイド、ナレッジ、コラム、ニュースを通じて、基礎から最新情報、実務の考え方まで整理します。</dd></div><div><dt>使う</dt><dd>確認作業や業務改善を支える無料ツール、テンプレート、AIプロンプトを順次公開します。</dd></div><div><dt>相談する</dt><dd>Webサイト簡易診断、改善提案、SEO、CMS、AI導入、制作・運用のご相談を承ります。</dd></div><div><dt>更新方針</dt><dd>ニュース・ナレッジ・コラムを継続的に追加し、公開済みの内容も必要に応じて見直します。</dd></div></dl></> },
  { id:"editorial", number:"03", title:"記事作成・編集方針", body:<ul><li>正確性を重視し、可能な限り公式発表・仕様書などの一次情報を確認します。</li><li>事実と解釈を分け、読者が判断できる情報を提示します。</li><li>公開前に内容を確認し、必要な修正を行います。</li><li>誤りや情報の更新を確認した場合は、随時修正します。</li></ul> },
  { id:"ai", number:"04", title:"AI利用について", body:<><p>テーマ整理、情報の分類、構成案、文章の下書き、校正、画像制作などにAIを活用する場合があります。</p><p><mark>AIの出力をそのまま公開せず、内容を確認・編集したうえで公開します。</mark> 最新情報は公式情報を優先し、重要な判断は人が行います。</p></> },
  { id:"advertising", number:"05", title:"広告・商品紹介について", body:<><p>広告、アフィリエイト、WDLが提供する商品・サービスを掲載する場合は、その関係が分かるよう明示します。</p><p>広告掲載や販売の有無によって、サービスや製品への評価を変更することはありません。</p></> },
  { id:"copyright", number:"06", title:"著作権について", body:<><p>当サイトに掲載する文章・編集画像・構成などの著作権は、権利者から許諾を得たものを除き、当サイト運営者に帰属します。無断転載・無断複製はご遠慮ください。</p><p>外部情報を引用する場合は、引用部分を明確にし、出典と参照リンクを掲載します。</p></> },
  { id:"disclaimer", number:"07", title:"免責事項", body:<><p>掲載内容の正確性・安全性・最新性には注意を払いますが、完全性を保証するものではありません。当サイトの情報を利用したことによって生じた損害について、運営者は責任を負いかねます。</p><p>料金・仕様・制度などは変更される場合があります。重要な判断を行う際は、必ず公式情報もご確認ください。</p></> },
  { id:"contact", number:"08", title:"お問い合わせ", body:<><p>記事の誤記・修正依頼に加え、Webサイト診断、改善、制作、SEO、CMS、AI導入、運用についてご相談いただけます。</p><p className="about-note">お問い合わせフォームは現在、受付機能を準備中です。画面と入力項目は<a href="/contact">お問い合わせページ</a>でご確認いただけます。</p></> },
  { id:"privacy", number:"09", title:"プライバシーポリシー", body:<><p>当サイトでは、アクセス状況の把握とサイト改善のためにアクセス解析ツールを利用する場合があります。取得する情報には、通常、個人を直接特定する情報は含まれません。</p><p>お問い合わせで取得した情報は、回答および必要な連絡のためにのみ利用し、法令に基づく場合を除いて第三者へ提供しません。</p></> },
];

// Editorial policies are maintained on this page.
export default function AboutPage() {
  return <main className="about-page"><SiteHeader current="about" /><section className="about-hero"><span className="section-kicker" aria-hidden="true">ABOUT</span><h1>このサイトについて</h1><p>Webの知識を、使える仕組みと実行できる改善へ。WDLの目的と運営方針をまとめています。</p><nav className="about-anchor-links" aria-label="ページ内ナビゲーション">{sections.map((section)=><a href={`#${section.id}`} key={section.id}><span>{section.number}</span>{section.title}</a>)}</nav></section><div className="about-layout"><div className="about-content">{sections.map((section)=><section id={section.id} key={section.id}><header><span>{section.number}</span><h2>{section.title}</h2></header>{section.body}</section>)}</div></div><SiteFooter /></main>;
}
