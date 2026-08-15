import type { Metadata } from "../astro-compat";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = { title:"このサイトについて｜Wani san Web", description:"Wani san Webの目的、運営者情報、提供する知識・ツール・サービス、記事作成・編集方針、AI利用、プライバシーについてご案内します。" };

const sections = [
  { id:"site", number:"01", title:"Wani san Webについて", body:<><p>Wani san Webは、<mark>小さな会社の集客と業務を改善するWeb・DXパートナー</mark>です。Web担当者やITに詳しい人がいない会社でも、WebマーケティングとAI・業務改善を気軽に相談できる存在を目指しています。</p><dl><div><dt>ミッション</dt><dd>WebとAIを活用し、小さな会社の売上と利益を増やすこと。</dd></div><div><dt>対象となる方</dt><dd>中小企業、個人事業主、店舗、Web担当者がいない組織。</dd></div><div><dt>支援の考え方</dt><dd>必要以上に複雑な仕組みを提案せず、目的と予算に合う小さな一歩から始めます。</dd></div></dl></> },
  { id:"operator", number:"02", title:"運営者について", body:<><p>Wani san Webは、<mark>Web制作会社でディレクター／プロジェクトマネージャーとして実務に携わる運営者</mark>が、現場で得た知識を整理して運営しています。実名は公開していませんが、責任の所在と経験が伝わるよう、実務領域を明示します。</p><dl><div><dt>主な経験</dt><dd>企業サイトの新規構築・リニューアル・運用改善、大規模案件の進行管理、チームマネジメント。</dd></div><div><dt>対応領域</dt><dd>情報設計、制作ディレクション、CMS・検索・翻訳・クラウドサービス連携、SEO、アクセシビリティ、セキュリティ要件整理。</dd></div><div><dt>記事の視点</dt><dd>机上の説明だけでなく、要件整理・提案・実装・検品・公開・運用で実際に使える判断を重視します。</dd></div></dl></> },
  { id:"contents", number:"03", title:"提供内容について", body:<dl><div><dt>Webマーケティング</dt><dd>Webサイト制作・運用、SEO・LLMO、Instagram運用、Web広告相談、アクセス解析に対応します。</dd></div><div><dt>AI・業務改善</dt><dd>AI活用、業務フロー整理、Excel・CSV処理、API連携、小規模な自動化ツール制作に対応します。</dd></div><div><dt>コラム・ナレッジ</dt><dd>社長や担当者の悩みを起点に、集客と業務改善の判断に役立つ情報を発信します。</dd></div><div><dt>将来のプロダクト</dt><dd>受託で得たノウハウを、テンプレート、AIツール、SaaSとして展開します。</dd></div></dl> },
  { id:"editorial", number:"04", title:"記事作成・編集方針", body:<ul><li>正確性を重視し、可能な限り公式発表・仕様書などの一次情報を確認します。</li><li>事実と解釈を分け、読者が判断できる情報を提示します。</li><li>公開前に内容を確認し、必要な修正を行います。</li><li>誤りや情報の更新を確認した場合は、随時修正します。</li></ul> },
  { id:"ai", number:"05", title:"AI利用について", body:<><p>テーマ整理、情報の分類、構成案、文章の下書き、校正、画像制作などにAIを活用する場合があります。</p><p><mark>AIの出力をそのまま公開せず、内容を確認・編集したうえで公開します。</mark> 最新情報は公式情報を優先し、重要な判断は人が行います。</p></> },
  { id:"advertising", number:"06", title:"広告・商品紹介について", body:<><p>広告、アフィリエイト、Wani san Webが提供する商品・サービスを掲載する場合は、その関係が分かるよう明示します。</p><p>広告掲載や販売の有無によって、サービスや製品への評価を変更することはありません。</p></> },
  { id:"copyright", number:"07", title:"著作権について", body:<><p>当サイトに掲載する文章・編集画像・構成などの著作権は、権利者から許諾を得たものを除き、当サイト運営者に帰属します。無断転載・無断複製はご遠慮ください。</p><p>外部情報を引用する場合は、引用部分を明確にし、出典と参照リンクを掲載します。</p></> },
  { id:"disclaimer", number:"08", title:"免責事項", body:<><p>掲載内容の正確性・安全性・最新性には注意を払いますが、完全性を保証するものではありません。当サイトの情報を利用したことによって生じた損害について、運営者は責任を負いかねます。</p><p>料金・仕様・制度などは変更される場合があります。重要な判断を行う際は、必ず公式情報もご確認ください。</p></> },
  { id:"contact", number:"09", title:"お問い合わせ", body:<><p>記事の誤記・修正依頼に加え、Webサイト、SEO・LLMO、SNS・広告、AI活用、業務自動化についてご相談いただけます。</p><p className="about-note">送信先の設定が完了するまでは入力内容は送信されません。入力項目は<a href="/contact">お問い合わせページ</a>でご確認いただけます。</p></> },
  { id:"privacy", number:"10", title:"プライバシーポリシー", body:<><p>当サイトでは、アクセス状況の把握とサイト改善のためにアクセス解析ツールを利用する場合があります。取得する情報には、通常、個人を直接特定する情報は含まれません。</p><p>お問い合わせで取得した情報は、回答および必要な連絡のためにのみ利用し、法令に基づく場合を除いて第三者へ提供しません。</p></> },
];

// Editorial policies are maintained on this page.
export default function AboutPage() {
  return <main className="about-page"><SiteHeader current="about" /><section className="about-hero"><span className="section-kicker" aria-hidden="true">ABOUT</span><h1>Wani san Webについて</h1><p>小さな会社の集客と業務を改善する。私たちの目的、運営者、サービスと編集方針をまとめています。</p><nav className="about-anchor-links" aria-label="ページ内ナビゲーション">{sections.map((section)=><a href={`#${section.id}`} key={section.id}><span>{section.number}</span>{section.title}</a>)}</nav></section><div className="about-layout"><div className="about-content">{sections.map((section)=><section id={section.id} key={section.id}><header><span>{section.number}</span><h2>{section.title}</h2></header>{section.body}</section>)}</div></div><SiteFooter /></main>;
}
