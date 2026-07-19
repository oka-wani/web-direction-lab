import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");

const now = new Date();
const jstDate = new Intl.DateTimeFormat("sv-SE", {
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
  .map((item) => item.title)
  .join("\n- ");

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
      minItems: 2,
      maxItems: 4,
      items: { type: "string" },
    },
    glossary: {
      type: "array",
      minItems: 3,
      maxItems: 8,
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
        minutes: { type: "integer", minimum: 5, maximum: 15 },
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
        "summary",
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
        category: { type: "string" },
        summary: { type: "string" },
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
- ナレッジの重要ポイントを2〜4件の短いhighlightsにまとめる
- ナレッジに登場する重要用語を3〜8件抽出し、glossaryを「用語」と「簡潔な意味」に分けて書く
- ナレッジのタイトルは煽らず、用語・仕組み・実務上の意味が分かる辞書・解説型にする
- heroには記事テーマを一目で理解できる短い見出しと、図解用の3〜4項目を入れる
- ナレッジは既存記事と重複させない
- ニュース候補を最低5件調査し、影響範囲・実務関連性・鮮度・行動可能性・一次情報の確かさで比較して最も有用な1件だけを出力する
- Google検索・Search Console・GA4・主要ブラウザ・Web標準・アクセシビリティ・セキュリティ・プライバシー・主要CMS・主要AI/Web制作ツールの変更を優先する
- ごく一部の事業者だけが対象の募集終了、限定テスト、地域限定機能、軽微な文言変更は原則選ばない
- 対象読者の多くに影響するか、Webディレクターが顧客へ説明すべき変更を優先する
- ニュースは原則7日以内の公式な一次情報をWeb検索で確認する
- 7日以内に影響度3以上のニュースがなければ30日以内まで広げる
- audienceImpactには対象読者への影響度を1〜5で、selectionReasonには他候補より優先した理由を書く
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
draft.generatedAt = now.toISOString();
draft.model = result.model ?? "gpt-5.6-sol";
draft.responseId = result.id;

const directory = "automation/drafts";
await mkdir(directory, { recursive: true });
const outputPath = join(directory, `daily-${jstDate}.json`);
await writeFile(outputPath, `${JSON.stringify(draft, null, 2)}\n`, "utf8");

console.log(`Created draft: ${outputPath}`);
