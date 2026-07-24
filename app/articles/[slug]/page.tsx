import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LearningArticle from "../../components/LearningArticle";
import { getRelatedKnowledge } from "../../knowledge/related";

type GeneratedKnowledge = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  date: string;
  minutes: number;
  level: string;
  image?: string;
  tags?: string[];
  hero?: { label: string; headline: string; items: string[] };
  seo: { metaTitle?: string; metaDescription?: string; keywords: string[] };
  body: {
    conclusion: string;
    highlights?: string[];
    glossary?: { term: string; description: string }[];
    definition: string;
    importance: string;
    practice: string;
    mistakes: string;
    example: string;
    sections?: { title: string; body: string; points?: string[] }[];
    todaySummary?: string[];
    quiz: {
      question: string;
      choices: string[];
      answer: string;
      explanation: string;
    };
  };
  sources: { name: string; url: string }[];
};

const postsDirectory = join(process.cwd(), "content/knowledge/posts");

async function readPost(slug: string): Promise<GeneratedKnowledge | null> {
  try {
    return JSON.parse(await readFile(join(postsDirectory, `${slug}.json`), "utf8"));
  } catch {
    return null;
  }
}

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = await readPost((await params).slug);
  if (!post) return {};
  return {
    title: post.seo.metaTitle ?? post.title,
    description: post.seo.metaDescription ?? post.summary,
    openGraph: post.image ? { images: [post.image] } : undefined,
  };
}

export default async function GeneratedKnowledgePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await readPost(slug);
  if (!post) notFound();

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
      image={post.image}
      visual={visual}
      hero={post.hero}
      conclusion={post.body.conclusion}
      highlights={post.body.highlights}
      terms={post.body.glossary}
      sections={post.body.sections ?? [
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
      related={getRelatedKnowledge(post.slug, post.category, post.tags ?? post.seo.keywords)}
    />
  );
}
