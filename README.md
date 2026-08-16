# Wani san Web

Wani san Web（WSW）は、Webサイト制作とWeb改善を提供するサービスです。

> **短期間でも、品質は妥協しない。**

制作フロー、共通モジュール、技術基盤を標準化し、毎案件ゼロから作る工数を減らしながら、アクセシビリティ・SEO・レスポンシブ・パフォーマンス・セキュリティなどの品質を担保する制作モデルを目指します。

## サービス

### Web制作

小〜中規模サイトを中心に、新規制作・リニューアルへ対応します。

- 飲食店
- 店舗・スクール
- 小規模コーポレートサイト
- サービスサイト
- 個人事業・士業
- LP

業種別・用途別の制作イメージを用意し、依頼前に必要な情報・ページ構成・デザイン・追加機能を想像できる状態を作ります。

### Web改善

既存サイトを対象に、問題点を調査し、改善優先順位を整理します。

- SEO / 技術的SEO
- Search Console / GA4
- アクセシビリティ
- ユーザビリティ
- パフォーマンス
- 改善ポイント整理
- 必要に応じた改修

## 標準技術構成

- Astro
- GitHub
- Cloudflare

必要に応じて microCMS、GTM、GA4、Google Search Console、Microsoft Clarity、Looker Studio などを追加します。

## 主な公開ページ

- `/`：TOP
- `/services/`：サービス・料金
- `/services/web-production/`：Web制作
- `/services/web-improvement/`：Web改善
- `/demo/`：制作イメージ
- `/process/`：ご依頼の流れ
- `/quality/`：品質・技術・セキュリティ
- `/quality/cms/`：CMSについて
- `/quality/form/`：問い合わせフォームについて
- `/column/`：将来のお客様向けコラム
- `/news/`：WSWからのお知らせ
- `/about/`：WSWについて
- `/contact/`：お問い合わせ

既存の `/knowledge/` は運営者用Webノートとして残し、表側のナビゲーションから外して `noindex` としています。

## コンテンツ運用

旧「ナレッジ・外部Webニュース・コラム」の日次自動生成は停止しています。

- コラム：ホームページ制作・運用・改善を検討する方向けのテーマへ限定
- ニュース：外部Webニュースを廃止し、WSW自身のお知らせとして運用
- ナレッジ：運営者の学習・技術メモとして直接URLで利用

旧生成ワークフローは必要時のみ手動実行できる状態で残しています。

## 開発

```bash
npm install
npm run dev
```

検証：

```bash
npm run content:validate
npm run build
```

## Cloudflare

本番環境はAstroとCloudflare Workersで構成します。

Cloudflare標準の確認用URL：

`https://web-direction-lab.kwmno.workers.dev/`

独自ドメイン：

`https://www.wani-san.com/`

### Cloudflare Workers Builds

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy --keep-vars`
- Node.js: 22

`main` へのpushをトリガーにCloudflare側でビルド・デプロイします。GitHub Actionsはコンテンツ検証とAstroビルドチェックを担当します。

## 問い合わせフォーム

問い合わせフォームはCloudflareをベースに構成します。

- Turnstile
- Bot対策
- Rate Limiting
- 担当者メール通知
- 自動返信

本番環境では以下をCloudflare側で設定します。

- Secret: `RESEND_API_KEY`
- Secret: `TURNSTILE_SECRET_KEY`
- Variable: `PUBLIC_TURNSTILE_SITE_KEY`
- Variable: `CONTACT_ADMIN_EMAIL`
- Variable: `CONTACT_FROM_EMAIL`

公開用のAPIキーなどの秘密情報はリポジトリへ保存せず、Cloudflare Secrets等で管理します。
