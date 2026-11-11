# 日次コラム

毎日午前6時（日本時間）にCodexのこのチャットの自動実行で1本を執筆・公開する。
自動実行にはこのPCとCodexの実行環境が利用可能であることが必要。
旧GitHub Actionsの3種類一括生成は停止したままにし、二重公開を避ける。

対象: UX・CXを中心に、マーケティング、SEO・解析、Web運用・改善を織り交ぜる。
直近30本のタイトル・要約・結論を確認し、同じテーマを繰り返さない。
日本語1,500〜3,000字程度。読者の課題、具体例、判断基準、翌日から試せる行動を含める。
事例は仮の例と明記し、実績・インタビュー・数値・著者の体験を創作しない。
執筆前に公式ドキュメント・原著者・研究機関等の一次情報を調べ、記事末尾にリンクを載せる。
引用は必要最小限とし、独自の説明と実務上の考察を中心にする。
生成記事にはAIを用いて作成した旨を表示する。

1. mainの最新状態を取得し、当日のAI記事があれば何もしない。
2. content/column/columns.jsonとapp/column/column-data.tsで既存記事を確認する。
3. 記事JSONをリポジトリ外のwork配下に作る。ColumnItem型とpublish-column.mjsの検証条件に従う。
4. node scripts/publish-column.mjs <記事JSON> を実行する。
5. node --test scripts/publish-column.test.mjs、npm run content:validate、npm run buildを通す。
6. 変更をGitHubのmainへ反映する。最新headを確認し、他の変更を上書きしない。
   接続済みGitHubのblob/tree/commit/update_ref機能も利用できる。
7. Cloudflareによる本番反映を確認する。検証や公開が失敗した場合は完了扱いにしない。

公開データの追加でトップ・一覧・個別URL・サイトマップに反映される。
