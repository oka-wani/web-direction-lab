import items from "../../content/knowledge/articles.json";

export type ArticleItem = {
  slug: string;
  category: string;
  date: string;
  title: string;
  description: string;
  level: string;
  minutes: number;
  type: "seo" | "analytics" | "website" | "system" | "ai" | "marketing";
};

export const articleItems = items as ArticleItem[];
export const categories = ["すべて", "SEO", "Web制作", "アクセス解析", "システム", "AI活用", "マーケティング"];
