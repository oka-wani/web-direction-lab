import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LearningArticle from "../../../components/LearningArticle";
import { getFoundationContent } from "../../../guide/foundation-content";
import { getAllGuideArticles, getGuideArticle, getGuideArticleCategory } from "../../../guide/guide-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllGuideArticles().map((item) => ({ slug:item.step.slug, topic:item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; topic: string }> }): Promise<Metadata> {
  const { slug, topic } = await params;
  const item = getGuideArticle(slug, topic);
  return item ? {
    title:`${item.article.title}｜${item.step.title}｜Web Growth Lab`,
    description:item.article.summary,
  } : {};
}

export default async function FoundationTopicPage({ params }: { params: Promise<{ slug: string; topic: string }> }) {
  const { slug, topic } = await params;
  const item = getGuideArticle(slug, topic);
  if (!item) notFound();

  const allArticles = getAllGuideArticles();
  const currentIndex = allArticles.findIndex((candidate) => candidate.href === item.href);
  const previous = currentIndex > 0 ? allArticles[currentIndex - 1] : undefined;
  const next = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : undefined;
  const content = getFoundationContent(item.step, item.article);

  return <LearningArticle
    category={getGuideArticleCategory(item.step, item.article)}
    title={item.article.title}
    intro={item.article.summary}
    date="2026.07.20"
    minutes={6}
    image="/images/web-guide-hero.webp"
    visual={content.visual}
    conclusion={content.conclusion}
    highlights={content.highlights}
    hero={content.hero}
    terms={content.terms}
    sections={content.sections}
    quiz={content.quiz}
    sources={content.sources}
    related={content.related}
    parentLabel={item.step.title}
    parentHref={`/knowledge/${item.step.slug}`}
    backLabel={`STEP ${item.step.number}の一覧へ戻る`}
    backHref={`/knowledge/${item.step.slug}`}
    previousLabel={previous?.article.title}
    previousHref={previous?.href}
    nextLabel={next?.article.title}
    nextHref={next?.href}
  />;
}
