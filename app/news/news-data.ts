import items from "../../content/news/news.json";

export type NewsItem = {
  slug: string;
  category: string;
  date: string;
  title: string;
  summary: string;
  impact: string;
  action: string;
  sourceName: string;
  sourceUrl: string;
};

export const newsItems = items as NewsItem[];
