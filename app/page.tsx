import { useEffect } from "react";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { HomeHero } from "./components/HomeHero";
import { columnItems } from "./column/column-data";
import { newsItems } from "./news/news-data";
import { faqs } from "./platform-data";

const qualityAxes = [
  { label: "ACCESSIBILITY", title: "アクセシビリティ", text: "WCAG 2.2 Level A相当を標準目標として、読みやすさ・操作しやすさを設計します。" },
  { label: "RESPONSIVE", title: "レスポンシブ", text: "スマートフォン、タブレット、PCを前提に、画面幅に応じて崩れにくい設計にします。" },
  { label: "SEO", title: "基本SEO", text: "HTML構造、title、description、見出し、canonical、OGP、sitemapなどを標準で確認します。" },
  { label: "PERFORMANCE", title: "パフォーマンス", text: "AstroとCloudflareを基本に、不要なJavaScriptを抑えた軽量なサイトを目指します。" },
  { label: "SECURITY", title: "セキュリティ", text: "HTTPS、Cloudflare、Bot対策、セキュリティヘッダーなどを案件条件に応じて設計します。" },
  { label: "MAINTAINABILITY", title: "保守しやすさ", text: "GitHubと共通モジュールを使い、公開後も修正・改善しやすい構成にします。" },
];

const processSteps = [
  ["01", "お問い合わせ", "ご相談内容を送信"],
  ["02", "方針整理", "ヒアリング＋打ち合わせ"],
  ["03", "構成・デザイン", "サイト構成と見た目を確認"],
  ["04", "サイト制作", "承認内容をもとに実装"],
  ["05", "公開", "最終確認後に本番反映"],
] as const;

function HomeMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".order-home");
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    root.classList.add("is-motion-ready");
    const targets = Array.from(root.querySelectorAll<HTMLElement>([
      ".order-section-heading",
      ".order-strength-grid > article",
      ".order-efficiency-note",
      ".order-demo-grid > *",
      ".order-quality-card",
      ".order-process > li",
      ".simple-column-grid > a",
      ".order-news-item",
      ".faq-list > details",
      ".order-final-cta",
    ].join(",")));

    targets.forEach((target, index) => {
      target.dataset.reveal = "";
      target.style.setProperty("--reveal-order", String(index % 6));
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -9%", threshold: .12 });

    targets.forEach((target) => observer.observe(target));

    const hero = root.querySelector<HTMLElement>(".wsw-mv");
    const updateHeroDepth = (event: PointerEvent) => {
      if (!hero || event.pointerType === "touch") return;
      const bounds = hero.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
      const y = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
      hero.style.setProperty("--mv-x", x.toFixed(3));
      hero.style.setProperty("--mv-y", y.toFixed(3));
    };
    const resetHeroDepth = () => {
      hero?.style.setProperty("--mv-x", "0");
      hero?.style.setProperty("--mv-y", "0");
    };
    hero?.addEventListener("pointermove", updateHeroDepth);
    hero?.addEventListener("pointerleave", resetHeroDepth);

    return () => {
      observer.disconnect();
      hero?.removeEventListener("pointermove", updateHeroDepth);
      hero?.removeEventListener("pointerleave", resetHeroDepth);
      root.classList.remove("is-motion-ready");
    };
  }, []);

  return null;
}

export default function Home() {
  return <main className="order-home">
    <SiteHeader current="home" />
    <HomeMotion />
    <HomeHero />

    <section className="order-section">
      <div className="order-section-heading"><div><span>WEB PRODUCTION</span><h2>WSWは、Webサイトを作るサービスです。</h2></div><p>店舗、スクール、小規模企業、士業、サービスサイト、LPなどに対応。構成整理からデザイン、実装、公開まで一貫して進めます。</p></div>
      <div className="order-strength-grid"><article><b>01</b><small>FAST</small><h3>早い</h3><p>共通モジュールと標準化した制作フローによって、一般的な制作工程を効率化します。</p></article><article><b>02</b><small>FAIR PRICE</small><h3>手頃</h3><p>毎回ゼロから作る工数を減らし、必要以上に制作費を膨らませません。</p></article><article><b>03</b><small>QUALITY</small><h3>品質</h3><p>レスポンシブ、SEO、アクセシビリティ、速度、安全性を標準品質として設計します。</p></article></div>
      <p className="order-efficiency-note"><strong>品質を削るから安いのではありません。</strong>制作方法を効率化しているから、早く・手頃に提供できます。</p>
      <div className="order-actions"><a className="order-secondary-link" href="/services">サービス・料金を見る <b>→</b></a><a className="order-secondary-link" href="/flow">制作の流れを見る <b>→</b></a></div>
    </section>

    <section className="order-section order-section--tint">
      <div className="order-section-heading"><div><span>SEE BEFORE YOU ORDER</span><h2>依頼する前に、完成形をイメージできる。</h2></div><p>「どんなサイトになるか分からない」を減らすために、業種別・用途別の制作イメージを用意します。必要な情報、ページ構成、デザイン、追加機能まで確認できます。</p></div>
      <div className="order-demo-grid">
        <article className="order-card order-demo-feature" id="restaurant"><small>FIRST PACKAGE / RESTAURANT</small><h3>飲食店サイトなら、こんな形から考えられます。</h3><p>メニュー、店舗情報、予約導線、写真、SNS連携など、来店前に知りたい情報を分かりやすく整理した制作パッケージです。</p><a className="order-card-link" href="/examples/restaurant">飲食店の制作イメージを見る →</a><div className="order-browser" aria-hidden="true"><div className="order-browser-bar"><i /><i /><i /></div><div className="order-browser-body"><small>SMALL RESTAURANT</small><b>今日食べたい、を<br />すぐ見つけられる。</b><div className="order-browser-tags"><span>MENU</span><span>ACCESS</span><span>RESERVATION</span></div></div></div></article>
        <div className="order-demo-side"><article className="order-card"><small>FOR SMALL BUSINESS</small><h3>小規模コーポレート</h3><p>事業内容、強み、会社情報、問い合わせをコンパクトに整理する構成。</p><span className="order-card-link">準備中</span></article><article className="order-card is-muted"><small>NEXT TEMPLATE</small><h3>店舗・スクール</h3><p>料金、コース、アクセス、よくある質問などを中心にした構成を追加予定です。</p></article></div>
      </div>
    </section>

    <section className="order-section">
      <div className="order-section-heading"><div><span>STANDARD QUALITY</span><h2>安価・短納期でも、品質項目は省略しない。</h2></div><p>制作フローと共通モジュールを標準化し、手を動かす時間を減らします。削るのは品質ではなく、毎回ゼロから作る工数です。</p></div>
      <div className="order-quality-grid">{qualityAxes.map((item) => <article className="order-quality-card" key={item.title}><small>{item.label}</small><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      <div className="order-actions"><a className="order-secondary-link" href="/quality">品質・技術・セキュリティを見る <b>→</b></a></div>
    </section>

    <section className="order-section order-section--tint">
      <div className="order-section-heading"><div><span>HOW WE WORK</span><h2 className="order-flow-heading"><span className="order-flow-heading-line"><span>お問い合わせから</span><span>公開まで、</span></span><span className="order-flow-heading-line">5つの工程で進めます。</span></h2></div><p>お問い合わせ後、まずヒアリングフォームへご回答いただきます。その内容をもとに打ち合わせを行い、サイトの方針を確定してから構成・デザインへ進みます。</p></div>
      <ol className="order-process">{processSteps.map(([number, title, text]) => <li key={number}><span>STEP {number}</span><b>{title}</b><p>{text}</p></li>)}</ol>
      <div className="order-actions"><a className="order-secondary-link" href="/flow">詳しい制作フローを見る <b>→</b></a></div>
    </section>

    <section className="order-section">
      <div className="order-section-heading"><div><span>COLUMN</span><h2>ホームページを依頼する前後に、知っておきたいこと。</h2></div><p>費用、制作期間、CMS、SEO、アクセス解析など、将来のお客様が判断するときに役立つテーマへ絞って発信します。</p></div>
      {columnItems.length > 0 ? <div className="simple-column-grid">{columnItems.slice(0, 3).map((item) => <a href={`/column/${item.slug}`} key={item.slug}><div style={{ backgroundImage: `url(${item.image})` }} /><small>{item.category}　{item.date}</small><h3>{item.title}</h3><p>{item.summary}</p><b className="card-read-link"><span>続きを読む</span><i>→</i></b></a>)}</div> : <div className="content-reset-note"><span>NEW COLUMNS COMING SOON</span><p>制作・改善を検討している方に向けたコラムを準備中です。</p></div>}
    </section>

    <section className="order-section">
      <div className="order-section-heading"><div><span>NEWS</span><h2>WSWからのお知らせ</h2></div><p>制作パッケージ、サービス、制作イメージ、サイト更新など、WSW自身のお知らせを掲載します。</p></div>
      <div className="order-news-list">{newsItems.slice(0, 3).map((item) => <article className="order-news-item" key={item.slug}><time>{item.date}</time><span>{item.category}</span><div><h3>{item.title}</h3><p>{item.summary}</p></div></article>)}</div>
      <div className="order-actions"><a className="order-secondary-link" href="/news">お知らせ一覧を見る <b>→</b></a></div>
    </section>

    <section className="order-section">
      <div className="order-section-heading"><div><span>FAQ</span><h2>よくある質問</h2></div><p>制作前に気になりやすい内容をまとめています。</p></div>
      <div className="faq-list">{faqs.slice(0, 5).map((faq, index) => <details key={faq.question} open={index === 0}><summary><span>Q</span>{faq.question}<i aria-hidden="true">＋</i></summary><div><span>A</span><p>{faq.answer}</p></div></details>)}</div>
    </section>

    <section className="order-final-cta"><span>CONTACT</span><h2>作りたいものが固まっていなくても、相談できます。</h2><p>ヒアリングフォームと打ち合わせを通じて、目的・予算・希望時期・必要な機能・デザインの方向性を一緒に整理します。</p><div className="order-actions"><a className="order-primary-link" href="/contact">無料で相談する <b>→</b></a><a className="order-secondary-link" href="/examples">制作イメージを見る <b>→</b></a></div></section>

    <SiteFooter />
  </main>;
}
