import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");

const now = new Date();
const jstDate = process.env.RUN_DATE || new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(now);

const knowledgeIndex = JSON.parse(
  await readFile("content/knowledge/articles.json", "utf8"),
);
const newsIndex = JSON.parse(await readFile("content/news/news.json", "utf8"));
const existingTitles = [...knowledgeIndex, ...newsIndex]
  .map((item) => `${item.title}（slug: ${item.slug}）`)
  .join("\n- ");

let recentNews = [];
try {
  const files = (await readdir("automation/drafts"))
    .filter((file) => /^daily-\d{4}-\d{2}-\d{2}\.json$/.test(file))
    .sort()
    .reverse()
    .slice(0, 14);
  recentNews = (await Promise.all(files.map(async (file) => {
    const draft = JSON.parse(await readFile(join("automation/drafts", file), "utf8"));
    return draft.news ? `${draft.runDate}: ${draft.news.category} / ${draft.news.serviceName ?? "サービス不明"} / ${draft.news.title}` : null;
  }))).filter(Boolean);
} catch {
  recentNews = [];
}

const sourceSchema = {
  type: "object",
  additionalProperties: false,
  required: ["name", "url", "publishedAt", "isPrimary"],
  properties: {
    name: { type: "string" },
    url: { type: "string" },
    publishedAt: { type: "string" },
    isPrimary: { type: "boolean" },
  },
};

const articleBodySchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "conclusion",
    "highlights",
    "glossary",
    "definition",
    "importance",
    "practice",
    "mistakes",
    "example",
    "quiz",
  ],
  properties: {
    conclusion: { type: "string" },
    highlights: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: { type: "string" },
    },
    glossary: {
      type: "array",
      minItems: 5,
      maxItems: 10,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["term", "description"],
        properties: {
          term: { type: "string" },
          description: { type: "string" },
        },
      },
    },
    definition: { type: "string" },
    importance: { type: "string" },
    practice: { type: "string" },
    mistakes: { type: "string" },
    example: { type: "string" },
    quiz: {
      type: "object",
      additionalProperties: false,
      required: ["question", "choices", "answer", "explanation"],
      properties: {
        question: { type: "string" },
        choices: {
          type: "array",
          minItems: 3,
          maxItems: 4,
          items: { type: "string" },
        },
        answer: { type: "string" },
        explanation: { type: "string" },
      },
    },
  },
};

const responseSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "runDate",
    "knowledge",
    "news",
    "shortVideo",
    "reviewChecklist",
  ],
  properties: {
    runDate: { type: "string" },
    knowledge: {
      type: "object",
      additionalProperties: false,
      required: [
        "kind",
        "status",
        "title",
        "slug",
        "category",
        "summary",
        "level",
        "minutes",
        "hero",
        "body",
        "seo",
        "sources",
      ],
      properties: {
        kind: { type: "string", enum: ["knowledge"] },
        status: { type: "string", enum: ["draft"] },
        title: { type: "string" },
        slug: { type: "string", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" },
        category: {
          type: "string",
          enum: [
            "SEO",
            "Web制作",
            "アクセス解析",
            "システム",
            "AI活用",
            "マーケティング",
            "UX",
            "Webディレクション",
          ],
        },
        summary: { type: "string" },
        level: { type: "string", enum: ["初級", "中級", "上級"] },
        minutes: { type: "integer", minimum: 10, maximum: 25 },
        hero: {
          type: "object",
          additionalProperties: false,
          required: ["label", "headline", "items"],
          properties: {
            label: { type: "string" },
            headline: { type: "string" },
            items: {
              type: "array",
              minItems: 3,
              maxItems: 4,
              items: { type: "string" },
            },
          },
        },
        body: articleBodySchema,
        seo: {
          type: "object",
          additionalProperties: false,
          required: ["metaTitle", "metaDescription", "keywords"],
          properties: {
            metaTitle: { type: "string" },
            metaDescription: { type: "string" },
            keywords: {
              type: "array",
              minItems: 3,
              maxItems: 8,
              items: { type: "string" },
            },
          },
        },
        sources: {
          type: "array",
          minItems: 1,
          maxItems: 5,
          items: sourceSchema,
        },
      },
    },
    news: {
      type: "object",
      additionalProperties: false,
      required: [
        "kind",
        "status",
        "title",
        "slug",
        "category",
        "serviceName",
        "summary",
        "quickSummary",
        "keywords",
        "whatHappened",
        "impact",
        "action",
        "urgency",
        "audienceImpact",
        "selectionReason",
        "sources",
      ],
      properties: {
        kind: { type: "string", enum: ["news"] },
        status: { type: "string", enum: ["draft"] },
        title: { type: "string" },
        slug: { type: "string", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" },
        category: {
          type: "string",
          enum: [
            "AI",
            "検索・SEO",
            "アクセス解析・広告",
            "ブラウザ・Web標準",
            "Web制作・CMS",
            "クラウド・インフラ",
            "セキュリティ・プライバシー",
            "Webサービス",
          ],
        },
        serviceName: { type: "string" },
        summary: { type: "string" },
        quickSummary: {
          type: "array",
          minItems: 3,
          maxItems: 3,
          items: { type: "string" },
        },
        keywords: {
          type: "array",
          minItems: 3,
          maxItems: 8,
          items: { type: "string" },
        },
        whatHappened: { type: "string" },
        impact: { type: "string" },
        action: { type: "string" },
        urgency: { type: "integer", minimum: 1, maximum: 5 },
        audienceImpact: { type: "integer", minimum: 1, maximum: 5 },
        selectionReason: { type: "string" },
        sources: {
          type: "array",
          minItems: 1,
          maxItems: 5,
          items: sourceSchema,
        },
      },
    },
    shortVideo: {
      type: "object",
      additionalProperties: false,
      required: [
        "sourceKind",
        "reason",
        "hook",
        "script",
        "scenes",
        "cta",
      ],
      properties: {
        sourceKind: { type: "string", enum: ["knowledge", "news"] },
        reason: { type: "string" },
        hook: { type: "string" },
        script: { type: "string" },
        scenes: {
          type: "array",
          minItems: 4,
          maxItems: 7,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["seconds", "narration", "visual"],
            properties: {
              seconds: { type: "string" },
              narration: { type: "string" },
              visual: { type: "string" },
            },
          },
        },
        cta: { type: "string" },
      },
    },
    reviewChecklist: {
      type: "object",
      additionalProperties: false,
      required: [
        "factChecked",
        "primarySourcesChecked",
        "duplicateChecked",
        "seoChecked",
        "approvedBy",
      ],
      properties: {
        factChecked: { type: "boolean", enum: [false] },
        primarySourcesChecked: { type: "boolean", enum: [false] },
        duplicateChecked: { type: "boolean", enum: [false] },
        seoChecked: { type: "boolean", enum: [false] },
        approvedBy: { type: "null" },
      },
    },
  },
};

const developerPrompt = `あなたはWeb Direction Labの編集者です。
対象読者は、Webディレクター・Webコンサルを目指す20〜40代です。

成果物:
- 長く役立つナレッジ記事の下書き1件
- 最新のWebニュース記事の下書き1件
- 上記のうち動画向きな1件の30〜60秒ショート動画台本

必須条件:
- 日本語で書く
- 実務で使える具体性を優先する
- ナレッジの重要ポイントを3〜5件の短いhighlightsにまとめる
- ナレッジに登場する重要用語を3〜8件抽出し、glossaryを「用語」と「簡潔な意味」に分けて書く
- ナレッジのタイトルは煽らず、用語・仕組み・実務上の意味が分かる辞書・解説型にする
- heroには記事テーマを一目で理解できる短い見出しと、図解用の3〜4項目を入れる
- ナレッジ本文は合計3,500〜5,000文字程度を目安にし、初級でも説明を省略しすぎない
- definitionは700〜1,000文字、importanceは500〜800文字、practiceは800〜1,200文字、mistakesは500〜800文字、exampleは600〜900文字を目安にする
- 各本文項目は2〜4段落に分け、定義だけで終わらず、仕組み、判断基準、実務での確認方法まで説明する
- 本文で特に重要な語句を各項目1〜2箇所だけ **重要語句** の形式で囲み、画面上のハイライト対象にする
- highlightsは重複しない3〜5件、glossaryは本文理解に必要な5〜10件を作る
- practiceには実務担当者が確認できる具体的な手順またはチェック項目を含める
- mistakesにはよくある誤解、失敗した場合の影響、回避方法を含める
- exampleにはWebサイト運用や制作現場を想定した具体的な状況を含める
- ナレッジの参考情報は可能な限り公式仕様・公式ドキュメント・公的機関を優先し、最低2件確認する
- SEO keywordsには関連ナレッジの判定にも使える、記事固有の用語・技術名・実務テーマを入れる
- ナレッジは既存記事と重複させない
- ニュース候補を最低5件調査し、影響範囲・実務関連性・鮮度・行動可能性・一次情報の確かさで比較して最も有用な1件だけを出力する
- ニュースの対象領域は、AI、検索・SEO、アクセス解析・広告、ブラウザ・Web標準、Web制作・CMS、クラウド・インフラ、セキュリティ・プライバシー、主要Webサービスまで広く扱う
- OpenAI・Anthropic・Google AI・Microsoft・Adobe・Figma・GitHub・Cursor、Google Search・Bing・GA4、Chrome・Safari・Firefox・W3C、WordPress・Webflow・Shopify、Cloudflare・AWS・Vercelなどの一次情報を幅広く確認する
- 直近の記事と同じ領域・同じサービスを続けず、14日単位でテーマを分散する。ただし緊急度4以上の重要変更は例外とする
- ごく一部の事業者だけが対象の募集終了、限定テスト、地域限定機能、軽微な文言変更は原則選ばない
- 対象読者の多くに影響するか、Webディレクターが顧客へ説明すべき変更を優先する
- ニュースは原則7日以内の公式な一次情報をWeb検索で確認する
- 7日以内に影響度3以上のニュースがなければ30日以内まで広げる
- audienceImpactには対象読者への影響度を1〜5で、selectionReasonには他候補より優先した理由を書く
- quickSummaryは記事冒頭に表示する重要ポイントを、重複のない短文3件に整理する
- whatHappenedは公式発表の内容、変更の背景、従来との違いが分かるよう600〜900文字程度で詳しく説明する
- impactは誤解しやすい点や実務上とくに重要な点を、400〜700文字程度で具体的に説明する
- actionはWeb担当者が確認・判断すべき内容を、400〜700文字程度で具体的に説明する
- 結論、ポイント、詳しい説明、重要事項、実務で確認することの間で、同じ説明を繰り返さない
- ニュースの全ソースに公開日とURLを入れる
- ニュースは一次情報を最低1件含める
- 検索結果だけで裏付けられない主張を作らない
- 確認できない内容は断定しない
- SEOタイトルは誇張や煽りを避ける
- 動画は通常ナレッジを選び、緊急度4以上の重要ニュースのみニュースを優先する
- 出力は下書きであり、人間の承認前に公開しない`;

const userPrompt = `実行日（日本時間）: ${jstDate}

既存タイトル:
- ${existingTitles}

直近14日間のニュース（同じ領域・サービスの連続を避ける）:
- ${recentNews.length ? recentNews.join("\n- ") : "なし"}

SEO、Web制作、アクセス解析、システム、AI活用、マーケティング、UX、Webディレクションの範囲から、今日の下書きを作成してください。`;

const response = await fetch("https://api.openai.com/v1/responses", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "gpt-5.6-sol",
    reasoning: { effort: "low" },
    tools: [{ type: "web_search" }],
    input: [
      { role: "developer", content: developerPrompt },
      { role: "user", content: userPrompt },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "daily_content_draft",
        strict: true,
        schema: responseSchema,
      },
    },
  }),
});

const result = await response.json();
if (!response.ok) {
  throw new Error(`OpenAI API error ${response.status}: ${JSON.stringify(result)}`);
}

const outputText =
  result.output_text ??
  result.output
    ?.flatMap((item) => item.content ?? [])
    .find((item) => item.type === "output_text")?.text;

if (!outputText) throw new Error("The API returned no structured output.");

const draft = JSON.parse(outputText);
if (draft.runDate !== jstDate) {
  throw new Error(`The API returned runDate ${draft.runDate}; expected ${jstDate}.`);
}
draft.generatedAt = now.toISOString();
draft.model = result.model ?? "gpt-5.6-sol";
draft.responseId = result.id;

const directory = "automation/drafts";
await mkdir(directory, { recursive: true });
const outputPath = join(directory, `daily-${jstDate}.json`);
await writeFile(outputPath, `${JSON.stringify(draft, null, 2)}\n`, "utf8");

console.log(`Created draft: ${outputPath}`);
