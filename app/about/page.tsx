import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = { title:"このサイトについて｜Web Direction Lab", description:"Web Direction Labの目的、コンテンツ、記事作成・編集方針、AI利用、広告、著作権、免責事項、プライバシーについてご案内します。" };

const sections = [
  { id:"site", number:"01", title:"サイトについて", body:<><p>Web Direction Labは、Webディレクター・Webコンサルタントを目指す人が、Webの知識を基礎から実務までつなげて学ぶためのメディアです。</p><dl><div><dt>サイトの目的</dt><dd>Web制作・SEO・解析・マーケティング・AI活用を、仕事で判断できる知識として整理すること。</dd></div><div><dt>対象となる方</dt><dd>Webディレクター、Web制作会社の担当者、マーケター、Webコンサルを目指す方。</dd></div><div><dt>学べること</dt><dd>Webの仕組み、制作、公開、集客、分析、改善、提案までの一連の知識。</dd></div></dl></> },
  { id:"contents", number:"02", title:"コンテンツについて", body:<><p>目的に合わせて、3種類のコンテンツを掲載します。</p><dl><div><dt>ニュース</dt><dd>Web・AI・SEOなどの最新情報を、実務への影響が分かる形で整理します。</dd></div><div><dt>ナレッジ</dt><dd>個別テーマを基礎から実務レベルまで深く解説します。</dd></div><div><dt>基礎知識（Webガイド）</dt><dd>Webサイトが動く仕組みから改善・提案までを、学習順にまとめます。</dd></div><div><dt>更新方針</dt><dd>ニュースとコラムは継続的に追加し、基礎知識とナレッジは必要に応じて追記・更新します。</dd></div></dl></> },
  { id:"editorial", number:"03", title:"記事作成・編集方針", body:<ul><li>正確性を重視し、可能な限り公式発表・仕様書などの一次情報を確認します。</li><li>事実と解釈を分け、読者が判断できる情報を提示します。</li><li>公開前に内容を確認し、必要な修正を行います。</li><li>誤りや情報の更新を確認した場合は、随時修正します。</li></ul> },
  { id:"ai", number:"04", title:"AI利用について", body:<><p>テーマ整理、情報の分類、構成案、文章の下書き、校正、画像制作などにAIを活用する場合があります。</p><p><mark>AIの出力をそのまま公開せず、内容を確認・編集したうえで公開します。</mark> 最新情報は公式情報を優先し、重要な判断は人が行います。</p></> },
  { id:"advertising", number:"05", title:"広告・アフィリエイトについて", body:<><p>現在、広告およびアフィリエイトリンクは掲載していません。将来導入する場合は、広告・PR・アフィリエイトであることが分かるよう明示します。</p><p>広告掲載の有無によって、サービスや製品への評価を変更することはありません。</p></> },
  { id:"copyright", number:"06", title:"著作権について", body:<><p>当サイトに掲載する文章・編集画像・構成などの著作権は、権利者から許諾を得たものを除き、当サイト運営者に帰属します。無断転載・無断複製はご遠慮ください。</p><p>外部情報を引用する場合は、引用部分を明確にし、出典と参照リンクを掲載します。</p></> },
  { id:"disclaimer", number:"07", title:"免責事項", body:<><p>掲載内容の正確性・安全性・最新性には注意を払いますが、完全性を保証するものではありません。当サイトの情報を利用したことによって生じた損害について、運営者は責任を負いかねます。</p><p>料金・仕様・制度などは変更される場合があります。重要な判断を行う際は、必ず公式情報もご確認ください。</p></> },
  { id:"contact", number:"08", title:"お問い合わせ", body:<><p>記事の誤記、情報の更新、修正依頼などがありましたらお知らせください。</p><p className="about-note">お問い合わせフォームは現在準備中です。公開後、このページからご案内します。</p></> },
  { id:"privacy", number:"09", title:"プライバシーポリシー", body:<><p>当サイトでは、アクセス状況の把握とサイト改善のためにアクセス解析ツールを利用する場合があります。取得する情報には、通常、個人を直接特定する情報は含まれません。</p><p>お問い合わせで取得した情報は、回答および必要な連絡のためにのみ利用し、法令に基づく場合を除いて第三者へ提供しません。</p></> },
];

// Editorial policies are maintained on this page.
export default function AboutPage() {
  return <main className="about-page"><SiteHeader current="about" /><section className="about-hero"><span className="section-kicker" aria-hidden="true">ABOUT</span><h1>このサイトについて</h1><p>運営方針と、安心して情報を利用していただくための考え方をまとめています。</p><nav className="about-anchor-links" aria-label="ページ内ナビゲーション">{sections.map((section)=><a href={`#${section.id}`} key={section.id}><span>{section.number}</span>{section.title}</a>)}</nav></section><div className="about-layout"><div className="about-content">{sections.map((section)=><section id={section.id} key={section.id}><header><span>{section.number}</span><h2>{section.title}</h2></header>{section.body}</section>)}</div></div><SiteFooter /></main>;
}
