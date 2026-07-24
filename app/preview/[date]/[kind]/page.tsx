import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LearningArticle from "../../../components/LearningArticle";
import NewsArticle from "../../../components/NewsArticle";
import type { NewsItem } from "../../../news/news-data";
import { getRelatedKnowledge } from "../../../knowledge/related";

export const metadata: Metadata = {
  title: "下書きプレビュー | Web Growth Lab",
  robots: { index: false, follow: false, nocache: true },
};

type Source = {
  name: string;
  url: string;
  isPrimary?: boolean;
};

type KnowledgeDraft = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  minutes: number;
  level: string;
  hero?: { label: string; headline: string; items: string[] };
  seo: { keywords: string[] };
  body: {
    conclusion: string;
    highlights?: string[];
    glossary?: { term: string; description: string }[];
    definition: string;
    importance: string;
    practice: string;
    mistakes: string;
    example: string;
    todaySummary?: string[];
    quiz: {
      question: string;
      choices: string[];
      answer: string;
      explanation: string;
    };
  };
  sources: Source[];
};

type NewsDraft = Omit<NewsItem, "date" | "sourceName" | "sourceUrl"> & {
  sources: Source[];
};

type DailyDraft = {
  runDate: string;
  knowledge: KnowledgeDraft;
  news: NewsDraft;
};

const draftsDirectory = join(process.cwd(), "automation/drafts");

export async function generateStaticParams() {
  const files = await readdir(draftsDirectory);
  return files
    .filter((file) => /^daily-\d{4}-\d{2}-\d{2}\.json$/.test(file))
    .flatMap((file) => {
      const date = file.slice(6, -5);
      return [
        { date, kind: "knowledge" },
        { date, kind: "news" },
      ];
    });
}

function PreviewBanner({ date, kind }: { date: string; kind: string }) {
  return (
    <aside
      style={{
        background: "#ffcb05",
        color: "#071f41",
        fontWeight: 800,
        padding: "12px 24px",
        textAlign: "center",
      }}
    >
      下書きプレビュー：{date}・{kind === "knowledge" ? "ナレッジ" : "Webニュース"}（未公開）
    </aside>
  );
}

export default async function DraftPreviewPage({
  params,
}: {
  params: Promise<{ date: string; kind: string }>;
}) {
  const { date, kind } = await params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !["knowledge", "news"].includes(kind)) {
    notFound();
  }

  let draft: DailyDraft;
  try {
    draft = JSON.parse(
      await readFile(join(draftsDirectory, `daily-${date}.json`), "utf8"),
    );
  } catch {
    notFound();
  }

  const displayDate = draft.runDate.replaceAll("-", ".");

  if (kind === "news") {
    const primary =
      draft.news.sources.find((source) => source.isPrimary) ??
      draft.news.sources[0];

    if (!primary) notFound();

    return (
      <>
        <PreviewBanner date={draft.runDate} kind={kind} />
        <NewsArticle
          item={{
            ...draft.news,
            date: displayDate,
            sourceName: primary.name,
            sourceUrl: primary.url,
            sources: draft.news.sources,
          }}
        />
      </>
    );
  }

  const post = draft.knowledge;
  const visual =
    {
      SEO: "seo",
      "アクセス解析": "analytics",
      システム: "system",
      AI活用: "ai",
    }[post.category] ?? "website";

  return (
    <>
      <PreviewBanner date={draft.runDate} kind={kind} />
      <LearningArticle
        category={post.category}
        title={post.title}
        intro={post.summary}
        date={displayDate}
        minutes={post.minutes}
        level={post.level}
        visual={visual}
        hero={post.hero}
        conclusion={post.body.conclusion}
        highlights={post.body.highlights}
        terms={post.body.glossary}
        sections={[
          { title: "基本と仕組み", body: post.body.definition },
          { title: "なぜ重要か", body: post.body.importance },
          { title: "実務ではどう使うか", body: post.body.practice },
          { title: "よくある間違い", body: post.body.mistakes },
          { title: "具体例", body: post.body.example },
        ]}
        quiz={{
          question: post.body.quiz.question,
          choices: post.body.quiz.choices,
          answer: `${post.body.quiz.answer} — ${post.body.quiz.explanation}`,
        }}
        sources={post.sources}
        related={getRelatedKnowledge(post.slug, post.category, post.seo.keywords)}
      />
    </>
  );
}
