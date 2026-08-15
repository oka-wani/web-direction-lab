# Wani san Web

Webで成果を出すための知識・ツール・サービスを提供するプラットフォームです。

Web制作・SEO・AI・業務改善の情報発信から、実務ツール、Webサイト診断・改善・制作・運用支援までを「学ぶ・使う・相談する」の流れでつなぎます。

## 3つの役割

- 学ぶ：Webガイド、ナレッジ、コラム、ニュース
- 使う：無料ツール、テンプレート、AIプロンプト
- 相談する：簡易診断、改善提案、SEO、CMS、AI、制作・運用支援

コンセプト、情報設計、収益モデル、段階的な開発方針は [`docs/wdl-platform-concept.md`](docs/wdl-platform-concept.md) を参照してください。

## 自動更新

毎朝6:00（日本時間）にナレッジ・Webニュース・コラムを生成し、検証後に公開するGitHub Actionsを用意しています。

## 開発

```bash
npm install
npm run dev
```

本番環境はAstroで静的生成したページと、問い合わせAPIのみを含むCloudflare Workerで構成します。Cloudflare向けの設定は `astro.config.mjs` と `wrangler.jsonc` で管理します。

Cloudflare標準の確認用URLは `https://web-direction-lab.kwmno.workers.dev/` です。独自ドメインは表示確認後に接続します。

公開用のAPIキーやSNSトークンはリポジトリへ保存せず、GitHub Actions SecretsまたはCloudflare Secretsで管理します。

## 問い合わせフォーム

本番反映前に、Cloudflareで次の値を設定してください。

- Secret: `RESEND_API_KEY`
- Secret: `TURNSTILE_SECRET_KEY`
- Variable: `PUBLIC_TURNSTILE_SITE_KEY`
- Variable: `CONTACT_ADMIN_EMAIL`
- Variable: `CONTACT_FROM_EMAIL`（Resendで認証済みの送信元）

ローカル確認では `.dev.vars.example` を `.dev.vars` にコピーし、Turnstileの公式テストキーとResendのテスト用設定へ差し替えます。`.dev.vars` はコミットしません。

Cloudflare Dashboardでは、`/api/contact` の `POST` を対象にWAFとRate Limitingも設定します。これらはリポジトリ内のコードではなくゾーン設定です。

## Cloudflare Workers Builds

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy --keep-vars`
- Node.js: 22

`main` へのpushをトリガーにCloudflare側でビルド・デプロイします。GitHub Actionsはコンテンツ生成・検証・Astroビルドチェックを担当します。

自動更新の設定と確認手順は [`automation/README.md`](automation/README.md) を参照してください。
