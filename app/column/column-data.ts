export type ColumnItem = {
  slug: string;
  category: string;
  date: string;
  title: string;
  summary: string;
  videoHook: string;
  image: string;
  lead: string;
  sections: { title: string; body: string }[];
};

export const columnItems: ColumnItem[] = [
  { slug:"learn-web-as-a-system", category:"学び方", date:"2026.07.20", title:"Web用語を100個覚えても、実務で使えない理由", summary:"用語の暗記をやめて、Webサイトが動く一枚の地図から学ぶ。知識を仕事で使える形につなげる方法です。", videoHook:"覚えたはずのDNSやHTTPが、仕事ではつながらない。", image:"/images/column/web-system-learning.webp", lead:"DNS、HTTP、CMS、SEO。Webには覚える言葉が多くあります。ただ、言葉を一つずつ暗記しても、実務で『どこを確認すればよいか』は見えてきません。必要なのは用語集ではなく、全体をつなぐ地図です。", sections:[{title:"用語は流れの中で初めて使える",body:"たとえばDNSは、単独の定義だけでなく、URLを入力してからサーバーへ接続するまでの流れに置くと役割が分かります。HTTPステータスコードも、ブラウザとサーバーのやり取りを理解して初めて判断材料になります。"},{title:"最初に持ちたい一枚の地図",body:"制作、公開、集客、解析、改善という大きな流れを先に把握し、その中へHTML、サーバー、CMS、SEO、GA4などを配置します。細部を忘れても、どの分野を調べ直せばよいか分かる状態が目標です。"},{title:"今日から変えられる学び方",body:"新しい用語を見たら、定義だけでなく『誰が・いつ・何のために使うか』『前後にどんな処理があるか』まで確認します。知識が点ではなく線になり、トラブル時の切り分けにも使えるようになります。"}] },
  { slug:"three-questions-after-web-news", category:"情報収集", date:"2026.07.20", title:"Webニュースを「仕事」に変える3つの質問", summary:"読んで終わる情報収集から、対応の要否と次のアクションを決める情報収集へ。3つの質問だけで整理します。", videoHook:"そのニュース、本当にあなたのサイトに関係ありますか？", image:"/images/column/news-to-action.webp", lead:"新機能やアップデートを追い続けても、すべてを実務へ反映することはできません。必要なのは情報量より、ニュースを判断と行動へ変えるための問いです。", sections:[{title:"質問1：何が変わったのか",body:"発表の要約ではなく、変更前と変更後の差を確認します。仕様、料金、提供範囲、期限など、判断に影響する事実を一次情報で押さえます。"},{title:"質問2：自分のサイトに関係するか",body:"利用中のサービス、対象ユーザー、運用体制への影響を切り分けます。大きなニュースでも自分の環境では対応不要、逆に小さな変更でも運用へ直結する場合があります。"},{title:"質問3：いつ、誰が、何を確認するか",body:"対応が必要なら、期限、担当、確認項目まで落とします。今すぐ対応、次回改修で検討、情報だけ保管の三段階に分けると、ニュースがタスクを圧迫しにくくなります。"}] },
  { slug:"ai-and-human-judgement", category:"AI活用", date:"2026.07.20", title:"AIに任せてはいけない3つの判断", summary:"AIで速くできる仕事と、人が責任を持つべき判断を切り分けます。自動化で最も先に決めたい境界線です。", videoHook:"その公開判断まで、AIに渡して大丈夫ですか？", image:"/images/column/ai-human-judgement.webp", lead:"AI活用を考えるときは、ツール名より先に『どの判断を渡してよいか』を決める必要があります。速さよりも先に、責任の境界線を設計します。", sections:[{title:"AIに任せやすいのは材料づくり",body:"候補の洗い出し、情報の分類、構成案、定型文の下書き、表記チェックなどは自動化と相性があります。正解を一つに決めるのではなく、人が確認する材料を速く作る仕事です。"},{title:"人が持つべき3つの判断",body:"誰に何を届けるか、どの情報を信頼するか、公開して問題ないか。この3つは事業や利用者への影響を伴うため、背景を理解する人が責任を持つ必要があります。"},{title:"良い分担は確認工程まで含める",body:"AIを使う工程だけでなく、出典確認、事実確認、表現調整、公開承認までを一つのフローとして設計します。自動化の目的は確認をなくすことではなく、重要な判断へ時間を使えるようにすることです。"}] },
];

export function getColumn(slug: string) { return columnItems.find((item) => item.slug === slug); }
