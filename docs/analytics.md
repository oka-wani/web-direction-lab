# GTM・GA4設定

Google管理画面での新規作成は未完了。content/analytics.jsonは未設定なのでGoogleタグは読み込まれない。
IDが確定したら両方のIDを記入してビルド・公開する。
GA4の直接埋め込みを併用せず、GTMのGoogleタグ1本でpage_viewを送る。

GTM:
- GoogleタグにGA4測定IDを設定。Initialization – All Pagesで発火。
- 設定パラメータpage_locationは組み込み変数Page URLをそのまま使わず、データレイヤー変数page_locationを使う。サイトからクエリ・ハッシュを除いたURLを供給する。
- データレイヤーイベントgenerate_leadでGA4イベントgenerate_leadを発火。form_idはcontactのみ。
- 拡張計測のフォーム操作はオフ。自由記述・氏名・メール・ページ内テキストを収集しない。
- generate_leadはAPIの成功後に完了ページへ移動した場合に1回送る。完了ページへの直接アクセスや再読込で成果を水増ししない。
- 管理ページはタグの対象外。

GA4:
- プロパティ名Wani san Web、タイムゾーン日本、通貨JPY。
- Webストリームhttps://www.wani-san.com/。
- generate_leadをキーイベントにする。
- 任意のデータ共有はユーザーの回答に従う。
- プレビューでpage_viewとgenerate_leadの送信先・重複・個人情報の混入を確認し、GA4リアルタイム/DebugViewで到達を確認する。
- 有効化と同時に/about#privacyへGoogle Analyticsの利用・Cookie・オプトアウトへの案内を追記する。

Google AnalyticsとGTMの利用規約等への同意が求められたら、ユーザー確認後に確定する。
