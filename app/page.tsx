import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { articleItems } from "./articles/article-data";
import { guideSteps } from "./guide/guide-data";
import { columnItems } from "./column/column-data";
import { newsItems } from "./news/news-data";
import { faqs, services, tools } from "./platform-data";

export default function Home() {
  return <main>
    <SiteHeader />
    <section className="platform-home-hero" id="top"><div className="platform-home-copy"><p className="eyebrow">LEARN · USE · CONSULT</p><h1>Webで成果を出すための、<br /><span>知識と実践</span>を。</h1><p>Web制作・SEO・AI・業務改善を、学ぶだけで終わらせない。使えるツールと、実行につなげる改善支援を一つの場所に。</p><div className="hero-actions"><a className="button button--primary" href="/services">サービスを見る <b>→</b></a><a className="button button--secondary" href="/knowledge">Webを学ぶ <b>→</b></a></div></div><div className="platform-hero-art" aria-hidden="true"><div className="hero-dashboard"><span>WDL / WEB IMPROVEMENT</span><div className="hero-dashboard-score"><b>82</b><small>SITE SCORE</small></div><div className="hero-dashboard-bars"><i /><i /><i /><i /><i /><i /></div><div className="hero-dashboard-tags"><span>SEO</span><span>UX</span><span>AI</span></div></div><div className="hero-orbit hero-orbit--one" /><div className="hero-orbit hero-orbit--two" /></div></section>

    <section className="home-value-rail" aria-label="WDLでできること"><a href="/learn"><span>01</span><div><small>LEARN</small><b>学ぶ</b><p>実務で使えるWeb知識</p></div><i>→</i></a><a href="/tools"><span>02</span><div><small>USE</small><b>使う</b><p>ツールとテンプレート</p></div><i>→</i></a><a href="/services"><span>03</span><div><small>CONSULT</small><b>相談する</b><p>診断・改善・制作支援</p></div><i>→</i></a></section>

    <section className="platform-section home-problems"><div className="platform-section-heading"><span>WEB CHALLENGES</span><h2>こんなお悩みはありませんか？</h2></div><ul><li>Webサイトから問い合わせが来ない</li><li>SEOで何をすべきか分からない</li><li>改善点の優先順位が決められない</li><li>Web担当者が一人しかいない</li><li>AIを業務へ取り入れたい</li><li>日々の運用を効率化したい</li></ul><p>WDLは、情報を渡すだけでなく、課題の整理から実行までを支援します。</p></section>

    <section className="platform-section home-services"><div className="platform-section-heading platform-section-heading--link"><div><span>SERVICES</span><h2>Webの課題を、実行できる形に。</h2></div><a href="/services">サービスをすべて見る →</a></div><div className="home-service-grid">{services.slice(0, 4).map((service, index) => <a href={`/services/${service.slug}`} key={service.slug}><span>{String(index + 1).padStart(2, "0")}</span><small>{service.label}</small><h3>{service.title}</h3><p>{service.summary}</p><b>{service.price}</b><i>→</i></a>)}</div></section>

    <section className="platform-section home-tools"><div className="platform-section-heading platform-section-heading--link"><div><span>TOOLS</span><h2>日々のWeb業務を、軽くする。</h2></div><a href="/tools">ツールをすべて見る →</a></div><div className="home-tool-grid">{tools.slice(0, 4).map((tool) => <article key={tool.title}><span>{tool.category}</span><em>{tool.type}</em><h3>{tool.title}</h3><p>{tool.summary}</p><b>{tool.status}</b></article>)}</div></section>

    <section className="platform-section home-learn"><div className="platform-section-heading"><span>LEARN</span><h2>知識を、判断できる力に。</h2></div><div className="home-learn-layout"><div className="home-guide-panel"><span>WEB GUIDE</span><h3>体系的に学ぶ</h3><p>Webサイトが表示される仕組みから、制作・公開・集客・改善までを順番に。</p><ol>{guideSteps.slice(0, 5).map((step) => <li key={step.slug}><a href={`/knowledge/${step.slug}`}><span>{step.number}</span>{step.title}<b>→</b></a></li>)}</ol><a className="button button--primary" href="/knowledge#basics">Webガイドを見る <b>→</b></a></div><div className="home-knowledge-panel"><span>KNOWLEDGE</span><h3>テーマから調べる</h3>{articleItems.slice(0, 3).map((item) => <a href={`/articles/${item.slug}`} key={item.slug}><small>{item.category}</small><b>{item.title}</b><span>#{item.tags?.[0] ?? item.category}</span></a>)}<a className="text-link" href="/knowledge#articles">ナレッジをすべて見る <span>→</span></a></div></div></section>

    <section className="platform-section home-latest"><div className="platform-section-heading platform-section-heading--link"><div><span>LATEST INSIGHTS</span><h2>最新記事</h2></div><a href="/learn">学ぶコンテンツ一覧 →</a></div><div className="home-latest-grid"><div>{columnItems.slice(0, 2).map((item) => <article key={item.slug}><a className="home-latest-image" href={`/column/${item.slug}`} style={{ backgroundImage: `url(${item.image})` }} aria-label={`${item.title}を読む`} /><div><span>{item.category}</span><time>{item.date}</time><h3><a href={`/column/${item.slug}`}>{item.title}</a></h3><a className="text-link" href={`/column/${item.slug}`}>コラムを読む <span>→</span></a></div></article>)}</div><div className="home-latest-news"><span>WEB NEWS</span>{newsItems.slice(0, 4).map((item) => <a href={`/news/${item.slug}`} key={item.slug}><div><time>{item.date}</time><span>{item.category}</span></div><b>{item.title}</b><i>→</i></a>)}<a className="text-link" href="/news">ニュースをすべて見る <span>→</span></a></div></div></section>

    <section className="home-entry-product"><div><span>STARTER SERVICE</span><h2>まずは、Webサイト簡易診断から。</h2><p>URLとお悩みをもとに、SEO・導線・コンテンツ・アクセシビリティ・技術品質を確認。優先して改善したいポイントを整理します。</p><ul><li>何を直すべきか分かる</li><li>優先順位が分かる</li><li>次のアクションが分かる</li></ul></div><div><small>料金の目安</small><strong>5,000<em>円〜</em></strong><span>3〜5営業日目安</span><a className="button button--primary" href="/services/website-diagnosis">簡易診断を見る <b>→</b></a></div></section>

    <section className="platform-section home-process"><div className="platform-section-heading platform-section-heading--link"><div><span>PROCESS</span><h2>相談から改善まで。</h2></div><a href="/process">詳しい進め方を見る →</a></div><ol><li><span>01</span><b>相談</b><small>悩みと目標を確認</small></li><li><span>02</span><b>診断</b><small>現状と課題を整理</small></li><li><span>03</span><b>提案</b><small>優先順位を決定</small></li><li><span>04</span><b>改善</b><small>制作・実装を支援</small></li><li><span>05</span><b>運用</b><small>データから継続改善</small></li></ol></section>

    <section className="platform-section home-faq"><div className="platform-section-heading platform-section-heading--link"><div><span>FAQ</span><h2>よくある質問</h2></div><a href="/faq">すべて見る →</a></div><div className="faq-list">{faqs.slice(0, 3).map((faq, index) => <details key={faq.question} open={index === 0}><summary><span>Q</span>{faq.question}<i aria-hidden="true">＋</i></summary><div><span>A</span><p>{faq.answer}</p></div></details>)}</div></section>

    <section className="home-final-cta"><span>CONTACT</span><h2>Webの悩みを、<br />次に進める相談へ。</h2><p>まだ依頼内容が決まっていなくても大丈夫です。現在のお悩みから、一緒に整理します。</p><div className="hero-actions"><a className="button button--primary" href="/contact">まずは相談する <b>→</b></a><a className="button button--secondary" href="/pricing">料金を見る <b>→</b></a></div></section>
    <SiteFooter />
  </main>;
}
