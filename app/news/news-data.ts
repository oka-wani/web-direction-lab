import items from "../../content/news/news.json";

export type NewsItem = {
  slug: string;
  category: string;
  date: string;
  title: string;
  summary: string;
  serviceName?: string;
  quickSummary?: string[];
  affected?: string[];
  beforeAfter?: { before: string; after: string };
  actionLevel?: "今すぐ確認" | "今週中に確認" | "把握のみ";
  actions?: string[];
  visual?: { label: string; headline: string; items: string[] };
  keywords?: string[];
  whatHappened?: string;
  impact: string;
  action: string;
  audienceImpact?: number;
  selectionReason?: string;
  sourceName: string;
  sourceUrl: string;
  sources?: { name: string; url: string; isPrimary?: boolean }[];
};

export const newsItems = items as NewsItem[];
