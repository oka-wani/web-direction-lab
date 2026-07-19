import items from "../../content/news/news.json";

export type NewsItem = {
  slug: string;
  category: string;
  date: string;
  title: string;
  summary: string;
  whatHappened?: string;
  impact: string;
  action: string;
  audienceImpact?: number;
  selectionReason?: string;
  sourceName: string;
  sourceUrl: string;
};

export const newsItems = items as NewsItem[];
