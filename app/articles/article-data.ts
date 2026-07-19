import items from "../../content/knowledge/articles.json";

export type ArticleItem = {
  slug: string;
  category: string;
  date: string;
  title: string;
  description: string;
  level: string;
  minutes: number;
  image?: string;
  tags?: string[];
  type: "seo" | "analytics" | "website" | "system" | "ai" | "marketing";
};

export const articleItems = items as ArticleItem[];
export const categories = ["すべて", "基礎知識", "SEO", "Web制作", "デザイン・UX", "マーケティング・解析", "システム", "AI活用", "その他"];

export function matchesCategory(article: ArticleItem, category: string) {
  if (category === "すべて") return true;
  if (category === "マーケティング・解析") return article.category === "マーケティング" || article.category === "アクセス解析";
  if (category === "デザイン・UX") return article.slug === "site-improvement" || article.slug === "customer-journey";
  if (category === "その他") return !["SEO", "Web制作", "アクセス解析", "マーケティング", "システム", "AI活用"].includes(article.category);
  return article.category === category;
}
