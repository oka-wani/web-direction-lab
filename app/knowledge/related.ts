import articles from "../../content/knowledge/articles.json";

export type RelatedKnowledge = {
  title: string;
  category: string;
  href: string;
};

type ArticleIndexItem = {
  slug: string;
  category: string;
  title: string;
};

const nearbyCategories: Record<string, string[]> = {
  システム: ["Web制作", "SEO"],
  Web制作: ["システム", "UX", "SEO"],
  SEO: ["Web制作", "アクセス解析", "マーケティング"],
  アクセス解析: ["マーケティング", "SEO", "UX"],
  AI活用: ["Web制作", "システム", "Webディレクション"],
  マーケティング: ["アクセス解析", "SEO", "UX"],
  UX: ["Web制作", "マーケティング", "アクセス解析"],
  Webディレクション: ["Web制作", "システム", "マーケティング"],
};

export function getRelatedKnowledge(currentSlug: string, category: string): RelatedKnowledge[] {
  const neighbors = nearbyCategories[category] ?? [];

  return (articles as ArticleIndexItem[])
    .filter((article) => article.slug !== currentSlug)
    .map((article, index) => {
      const neighborIndex = neighbors.indexOf(article.category);
      const score = article.category === category
        ? 1000 - index
        : neighborIndex >= 0
          ? 500 - neighborIndex * 50 - index
          : 0 - index;
      return { article, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ article }) => ({
      title: article.title,
      category: article.category,
      href: `/articles/${article.slug}`,
    }));
}
