export type Metadata = Record<string, unknown>;

export function notFound(): never {
  throw new Error("Not found");
}
