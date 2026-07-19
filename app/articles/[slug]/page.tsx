import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import LearningArticle from "../../components/LearningArticle";

type GeneratedKnowledge = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  date: string;
  minutes: number;
  level: string;
  body: {
    conclusion: string;
    highlights?: string[];
    glossary?: { term: string; description: string }[];
    definition: string;
    importance: string;
    practice: string;
    mistakes: string;
    example: string;
    todaySummary: string[];
    quiz: {
      question: string;
      choices: string[];
      answer: string;
      explanation: string;
    };
    nextTopic: string;
  };
  sources: { name: string; url: string }[];
};

const postsDirectory = join(process.cwd(), "content/knowledge/posts");

export async function generateStaticParams() {
  try {
    const files = await readdir(postsDirectory);
    return files
      .filter((file) => file.endsWith(".json"))
      .map((file) => ({ slug: file.replace(/\.json$/, "") }));
  } catch {
    return [];
  }
}

export default async function GeneratedKnowledgePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post: GeneratedKnowledge;

  try {
    post = JSON.parse(
      await readFile(join(postsDirectory, `${slug}.json`), "utf8"),
    );
  } catch {
    notFound();
  }

  const visual = {
    SEO: "seo",
    "アクセス解析": "analytics",
    "システム": "system",
    "AI活用": "ai",
  }[post.category] || "website";

  return (
    <LearningArticle
      category={post.category}
      title={post.title}
      intro={post.summary}
      date={post.date}
      minutes={post.minutes}
      level={post.level}
      visual={visual}
      conclusion={post.body.conclusion}
      highlights={post.body.highlights}
      terms={post.body.glossary}
      sections={[
        { title: "そもそも何か", body: post.body.definition },
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
      summary={post.body.todaySummary}
      sources={post.sources}
      nextLabel={`次に学ぶ：${post.body.nextTopic}`}
      nextHref="/roadmap"
    />
  );
}
