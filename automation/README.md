# 毎日更新の自動化

毎朝6:00（日本時間）に、ナレッジ1本・Webニュース1本・30〜60秒のショート動画台本1本を生成します。AIの生成物は本番へ直接公開せず、日付別のレビューPRに保存します。

## 1日の流れ

1. GitHub Actions が毎朝6:00に公式情報を検索する
2. `automation/drafts/daily-YYYY-MM-DD.json` を日付別ブランチへ保存する
3. 内容確認用のPull Requestを自動作成する
4. 人がプレビュー、本文、一次情報URL、動画台本を確認・修正する
5. PRをマージすると、その操作を承認として記録する
6. 承認済み記事を `content/` へ変換し、mainへ追加する
7. Vercelがmainの更新を検知して本番へ反映する

## 初回設定

GitHubのリポジトリ設定で、Actions用Secretを1件登録します。

- 名前: `OPENAI_API_KEY`
- 値: OpenAI Platformで発行したAPIキー

Workflow permissionsは「Read and write permissions」を有効にし、「Allow GitHub Actions to create and approve pull requests」も有効にします。APIキーはJSON、ソースコード、ログへ書かないでください。

## 毎朝の確認

自動作成された「毎日のコンテンツ確認: YYYY-MM-DD」PRを開き、次を確認します。

- `/preview/YYYY-MM-DD/knowledge`
- `/preview/YYYY-MM-DD/news`
- 事実関係と断定表現
- 一次情報URLと公開日
- 既存記事との重複
- タイトル、説明文、SEO
- ショート動画台本

問題がなければPRをマージします。修正する場合は、PRブランチの `automation/drafts/daily-YYYY-MM-DD.json` を編集してからマージします。PRを閉じるだけなら公開されません。

## 手動実行と復旧

- その日の生成をやり直す: Actionsの `Generate daily content review` を手動実行
- マージ後の自動公開だけ失敗した: `Manually publish a merged draft` を実行し、日付と公開対象を指定
- 形式やビルドを確認する: `npm run content:validate && npm run build`

## 保存先

```text
automation/
  drafts/       AIが生成した未承認データ
  approved/     PRマージで承認された全データと承認者
  published/    公開日時、URL、ショート動画台本の記録
content/
  knowledge/    サイトに表示するナレッジ
  news/         サイトに表示するWebニュース
```
