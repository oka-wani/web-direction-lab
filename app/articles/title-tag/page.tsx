import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "titleタグとは？ SEOとクリック率を左右する基本｜Web Direction Lab",
  description: "titleタグの役割、SEOで重要な理由、実務での書き方とよくある間違いを初心者向けに解説します。",
};

export default function TitleTagArticle() {
  return (
    <main className="article-page">
      <header className="site-header">
        <a className="logo" href="/">Web Direction <span>Lab</span></a>
        <nav aria-label="メインナビゲーション"><a href="/knowledge">ナレッジ</a><a href="/news">Webニュース</a><a href="/roadmap">学習ロードマップ</a><a href="/#topics">カテゴリ</a><a href="/#about">このサイトについて</a></nav>
      </header>
      <div className="article-shell">
        <article className="article-content">
          <div className="breadcrumbs"><a href="/">トップ</a><span>›</span><a href="/knowledge?category=SEO">SEO</a><span>›</span><span>titleタグとは？</span></div>
          <header className="article-header">
            <span className="category-label">SEO</span>
            <h1>titleタグとは？<br />SEOとクリック率を左右する基本</h1>
            <p className="article-intro">検索結果でユーザーが最初に目にするタイトル。役割と書き方を、実務で判断できるように整理します。</p>
            <div className="article-meta"><time>2026.07.18</time><span>読了目安 6分</span><span>初級</span></div>
          </header>

          <div className="article-hero-visual" aria-hidden="true"><div className="browser-card"><b>&lt;title&gt;</b><i /><i /><i /></div><div className="magnifier" /></div>

          <aside className="conclusion"><b>まず結論</b><p>titleタグは、検索結果やブラウザのタブに表示される「ページの題名」です。検索意図に合う内容を簡潔に伝えることで、SEOとクリック率の両方に影響します。</p></aside>

          <nav className="toc" aria-label="記事の目次"><b>この記事で学べること</b><ol><li><a href="#what">titleタグとは何か</a></li><li><a href="#why">なぜ重要なのか</a></li><li><a href="#practice">実務での書き方</a></li><li><a href="#mistakes">よくある間違い</a></li><li><a href="#quiz">理解度クイズ</a></li></ol></nav>

          <section id="what"><p className="chapter">01</p><h2>そもそもtitleタグとは？</h2><p>titleタグは、HTMLの<code>&lt;head&gt;</code>内に記述する要素です。ページの主題を検索エンジンとユーザーに伝えます。</p><pre><code>{`<title>titleタグとは？SEOで重要な理由と書き方</title>`}</code></pre><p>ページ内に表示される見出しの<code>h1</code>とは役割が異なります。titleタグは検索結果やブラウザタブ、SNSで共有された際の情報源として使われます。</p></section>

          <section id="why"><p className="chapter">02</p><h2>なぜ重要なのか</h2><div className="point-grid"><div><b>検索エンジンへの手掛かり</b><p>ページが何について書かれているかを理解する重要な情報になります。</p></div><div><b>クリックする判断材料</b><p>ユーザーはタイトルを見て、自分の疑問を解決できそうか判断します。</p></div></div><p>順位だけではなく、表示されたあとに選んでもらえるかまで考えることがポイントです。</p></section>

          <section id="practice"><p className="chapter">03</p><h2>実務ではどう書く？</h2><ul className="check-list"><li>ページごとに固有のタイトルを付ける</li><li>検索する人が使う言葉を自然に含める</li><li>ページの内容と一致させる</li><li>重要な内容を前半に置く</li><li>サイト名を末尾に添える</li></ul><div className="example"><span>改善前</span><p>SEOについて｜Web Direction Lab</p><span>改善後</span><p><b>titleタグとは？SEOで重要な理由と書き方｜Web Direction Lab</b></p></div></section>

          <section id="mistakes"><p className="chapter">04</p><h2>よくある間違い</h2><div className="mistake"><b>キーワードを詰め込みすぎる</b><p>読みにくく内容が伝わらないタイトルは逆効果です。検索キーワードより先に、ユーザーに意味が通じる文章になっているか確認します。</p></div><div className="mistake"><b>全ページで同じタイトルを使う</b><p>各ページの違いが検索エンジンにもユーザーにも伝わりません。テンプレート設計時点で固有部分を管理できるようにします。</p></div></section>

          <section id="quiz" className="quiz"><p className="chapter">QUIZ</p><h2>今日の理解度チェック</h2><p>titleタグとh1の説明として適切なのはどれでしょう？</p><ol><li>必ず同じ文章にしなければならない</li><li>titleタグは検索結果、h1は主にページ内の見出しとして使われる</li><li>h1があればtitleタグは不要</li></ol><details><summary>答えを見る</summary><p><b>答えは 2。</b>役割は異なりますが、ページの主題に一貫性があることが大切です。</p></details></section>

          <footer className="article-summary"><p className="section-kicker">TODAY&apos;S SUMMARY</p><h2>今日のまとめ</h2><ul><li>titleタグはページの題名を検索エンジンとユーザーに伝える</li><li>SEOだけでなく検索結果でのクリックにも影響する</li><li>検索意図と内容を一致させ、ページごとに固有の文言を付ける</li></ul><a className="button button--primary" href="/roadmap">次は「検索意図」を学ぶ <b>→</b></a></footer>
        </article>

        <aside className="article-sidebar"><div><b>学習状況</b><span>SEO 基礎</span><progress max="10" value="1">10%</progress><small>1 / 10 テーマ</small></div><div><b>この記事のポイント</b><ul><li>titleタグの役割</li><li>実務での書き方</li><li>よくある失敗</li></ul></div><a href="/roadmap">SEO学習ロードマップ →</a></aside>
      </div>
    </main>
  );
}
