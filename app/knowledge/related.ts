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
  description?: string;
  keywords?: string[];
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

function normalize(value: string) {
  return value.toLocaleLowerCase("ja").replace(/\s+/g, "").trim();
}

function keywordScore(currentKeywords: string[], article: ArticleIndexItem) {
  const haystack = normalize([
    article.title,
    article.description ?? "",
    ...(article.keywords ?? []),
  ].join(" "));

  return currentKeywords.reduce((score, keyword) => {
    const normalized = normalize(keyword);
    if (normalized.length < 2) return score;
    if ((article.keywords ?? []).some((item) => normalize(item) === normalized)) return score + 600;
    if (haystack.includes(normalized)) return score + 400;
    return score;
  }, 0);
}

export function getRelatedKnowledge(
  currentSlug: string,
  category: string,
  currentKeywords: string[] = [],
): RelatedKnowledge[] {
  const neighbors = nearbyCategories[category] ?? [];

  return (articles as ArticleIndexItem[])
    .filter((article) => article.slug !== currentSlug)
    .map((article, index) => {
      const neighborIndex = neighbors.indexOf(article.category);
      const semanticScore = keywordScore(currentKeywords, article);
      const categoryScore = article.category === category
        ? 180
        : neighborIndex >= 0
          ? 70 - neighborIndex * 15
          : 0;
      const score = semanticScore + categoryScore - index;
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
