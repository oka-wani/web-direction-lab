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
8. 承認済みの動画台本から9:16動画を生成し、YouTubeショートとInstagramリールへ自動投稿する

動画テーマは、効率化と行動経済を日ごとに交互に生成します。ナレーションはOpenAIのAI音声（男性的な低めの声・少し速め）で、動画内と投稿文にAI音声である旨を表示します。

## 初回設定

GitHubのリポジトリ設定で、Actions用Secretを登録します。値はチャット、JSON、ソースコード、ログへ書かないでください。

- 名前: `OPENAI_API_KEY`
- 値: OpenAI Platformで発行したAPIキー

YouTube Data API:

- `YOUTUBE_CLIENT_ID`: Google Cloud OAuthクライアントID
- `YOUTUBE_CLIENT_SECRET`: Google Cloud OAuthクライアントシークレット
- `YOUTUBE_REFRESH_TOKEN`: 対象チャンネルが許可した `youtube.upload` スコープのリフレッシュトークン

Instagram Graph API:

- `INSTAGRAM_USER_ID`: 投稿先InstagramプロアカウントのID
- `INSTAGRAM_ACCESS_TOKEN`: コンテンツ公開権限を持つアクセストークン

Instagram側は、Metaアプリへ投稿先のInstagramプロアカウントを接続し、Reels公開に必要な権限を許可します。動画ファイルはMetaが取得できるよう、GitHub Releaseの公開URLへ置いてから投稿します。

Workflow permissionsは「Read and write permissions」を有効にし、「Allow GitHub Actions to create and approve pull requests」も有効にします。

Secrets設定後は、承認PRをマージするだけで動画投稿まで進みます。初回だけActionsの `Publish approved short video` を手動実行し、過去の日付で疎通確認できます。本番アカウントへの投稿になるため、最初の1本はYouTube側の `YOUTUBE_PRIVACY_STATUS` を一時的に `private` に変更して確認する運用も可能です。

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
