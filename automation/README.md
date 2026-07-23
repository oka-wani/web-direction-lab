# 毎日更新の自動化

毎朝6:00（日本時間）に、ナレッジ1本・Webニュース1本・Web系コラム1本を生成します。形式、重複、出典、サイトビルドの検証に成功した場合だけ、mainへコミットしてVercelへ自動公開します。

## 1日の流れ

1. GitHub Actions が毎朝6:00に起動する
2. OpenAI APIとWeb検索を使い、3種類の下書きを生成する
3. JSON形式、必須項目、カテゴリ、URL、重複を検証する
4. 下書きをサイト表示用データへ変換する
5. Next.jsの本番ビルドを実行する
6. すべて成功した場合だけmainへ追加する
7. Vercelがmainの更新を検知して本番へ反映する

途中で生成、検証、ビルドのいずれかが失敗した場合、その日のコンテンツは公開されません。再実行時は既存の下書き・公開記録を確認し、重複公開を避けます。

## 生成する内容

- ナレッジ: 長く参照できるWebの体系的な解説
- Webニュース: 原則7日以内の公式一次情報を基にした実務向けニュース
- コラム: 仕事術、AI・効率化を入口にした、検索とショート動画の両方で興味を引く読み物

動画はWeb Direction Labの毎日更新から切り離し、別ブランドで運用します。

## 初回設定

GitHubのリポジトリ設定でActions用Secretを登録します。

- 名前: `OPENAI_API_KEY`
- 値: OpenAI Platformで発行したAPIキー

Workflow permissionsは「Read and write permissions」を有効にします。APIキーはJSON、ソースコード、ログへ書かないでください。

## 手動実行と復旧

- その日の処理を実行・再実行する: Actionsの `Generate and publish daily content` を手動実行
- 既存の下書きを手動で公開する: `Manually publish a merged draft` を実行
- 形式やビルドを確認する: `npm run content:validate && npm run build`

## 保存先

```text
automation/
  drafts/       AIが生成した元データ
  approved/     自動検証を通過した全データ
  published/    公開日時とURLの記録
content/
  knowledge/    サイトに表示するナレッジ
  news/         サイトに表示するWebニュース
  column/       サイトに表示するコラム
```
