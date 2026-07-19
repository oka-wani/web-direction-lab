import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import NewsArticle from "../../components/NewsArticle";
import type { NewsItem } from "../news-data";

type GeneratedNews = NewsItem & {
  sources: { name: string; url: string; isPrimary?: boolean }[];
};

const postsDirectory = join(process.cwd(), "content/news/posts");

export async function generateStaticParams() {
  try {
    const files = await readdir(postsDirectory);
    return files.filter((file) => file.endsWith(".json")).map((file) => ({ slug: file.replace(/\.json$/, "") }));
  } catch {
    return [];
  }
}

export default async function GeneratedNewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post: GeneratedNews;
  try {
    post = JSON.parse(await readFile(join(postsDirectory, `${slug}.json`), "utf8"));
  } catch {
    notFound();
  }

  const primary = post.sources.find((source) => source.isPrimary) ?? post.sources[0];
  return <NewsArticle item={{...post, sourceName: primary.name, sourceUrl: primary.url}} />;
}
