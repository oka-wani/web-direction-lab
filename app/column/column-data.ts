import columns from "../../content/column/columns.json";

export type ColumnItem = {
  slug: string;
  category: string;
  date: string;
  title: string;
  summary: string;
  videoHook: string;
  image: string;
  lead: string;
  sections: { title: string; body: string }[];
};

export const columnItems = columns as ColumnItem[];

export function getColumn(slug: string) { return columnItems.find((item) => item.slug === slug); }
