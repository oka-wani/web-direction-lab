# Web Growth Lab

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

公開用のAPIキーやSNSトークンはリポジトリへ保存せず、GitHub Actions Secretsで管理します。

自動更新の設定と確認手順は [`automation/README.md`](automation/README.md) を参照してください。
