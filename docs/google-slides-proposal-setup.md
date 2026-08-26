# WSW提案書 Googleスライド連携

## 目的

ヒアリング回答から編集可能なGoogleスライドを生成し、管理画面で確定した最新版をPDFへ書き出して顧客へ送付します。

## Google側の準備

1. Google CloudでGoogle Drive APIとGoogle Slides APIを有効にする。
2. サービスアカウントを作成し、JSON形式の秘密鍵を発行する。
3. Google Workspaceの共有ドライブに提案書保存用フォルダを作成し、サービスアカウントへ編集権限を付与する。
4. `wsw-proposal-google-slides-template.pptx`をGoogleスライド形式で共有ドライブへ取り込む。
5. 取り込んだテンプレートは編集せず、複製元として保持する。

個人のマイドライブを使う場合は、サービスアカウントにドメイン全体の委任を設定し、`GOOGLE_IMPERSONATED_USER`へ操作対象のGoogle Workspaceユーザーを指定します。

## Cloudflareへ設定する値

秘密情報はCloudflare WorkerのSecretとして設定します。

- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`

通常の環境変数として次を設定します。

- `GOOGLE_DRIVE_FOLDER_ID`: 編集用スライドの保存先フォルダID
- `GOOGLE_SLIDES_TEMPLATE_ID`: Googleスライド化したテンプレートのファイルID
- `GOOGLE_IMPERSONATED_USER`: 個人のマイドライブを利用する場合のみ

## 運用フロー

1. ヒアリング回答を受け付ける。
2. 固定ページテンプレートに沿って提案内容を生成する。
3. Googleスライドを自動生成し、管理画面へ編集リンクを表示する。
4. 手動調整後、管理画面の「PDFを更新」で最新版を確認する。
5. 「顧客へ送付」を押し、表示された宛先を確認する。
6. その時点のGoogleスライドを再度PDF化し、顧客メールへ添付して送付する。

## テンプレートの注意点

- `{{...}}`形式の文字列は自動差し込み用タグなので変更しない。
- `{{ROUGH_PAGE_TITLE}}`を含むスライドがページラフの複製元になる。
- ページサイズはA4縦。Googleスライドへ取り込んだ後もページサイズを変更しない。
- 文字枠やエリア数を変更する場合は、`src/google-slides.ts`の差し込みタグも同時に更新する。
