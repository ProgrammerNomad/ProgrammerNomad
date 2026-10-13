import path from "node:path";

export const CONTENT_DIR = path.join(process.cwd(), "content");

export function collectionDir(collection: string): string {
  return path.join(CONTENT_DIR, collection);
}
