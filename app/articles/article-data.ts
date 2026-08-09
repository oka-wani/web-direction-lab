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

function dateValue(date: string) {
  return Date.parse(date.replaceAll(".", "-")) || 0;
}

export const articleItems = [...(items as ArticleItem[])].sort(
  (a, b) => dateValue(b.date) - dateValue(a.date),
);

export const categories = ["すべて", "フロント", "システム", "SEO", "マーケティング"] as const;

type CategorySource = Pick<ArticleItem, "category" | "type">;

export function getKnowledgeCategory(article: CategorySource) {
  if (article.category === "SEO" || article.type === "seo") return "SEO";
  if (["システム", "AI活用"].includes(article.category) || ["system", "ai"].includes(article.type)) return "システム";
  if (["マーケティング", "アクセス解析", "Webディレクション"].includes(article.category) || ["marketing", "analytics"].includes(article.type)) return "マーケティング";
  return "フロント";
}

export function matchesCategory(article: CategorySource, category: string) {
  return category === "すべて" || getKnowledgeCategory(article) === category;
}
