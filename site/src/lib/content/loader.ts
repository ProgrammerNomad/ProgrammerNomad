import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import fg from "fast-glob";
import {
  collectionSchemas,
  type BaseFrontmatter,
  type CollectionId,
  type PageFrontmatter,
  type WorkFrontmatter,
} from "@/lib/validation/schemas";

const contentRoot = path.join(process.cwd(), "content");

export type ContentFrontmatter =
  | BaseFrontmatter
  | PageFrontmatter
  | WorkFrontmatter;

export type ContentEntry<T extends ContentFrontmatter = BaseFrontmatter> = {
  filePath: string;
  body: string;
  frontmatter: T;
};

function schemaFor(collection: CollectionId) {
  return collectionSchemas[collection];
}

export async function getAllMdxPaths(collection: CollectionId): Promise<string[]> {
  const dir = path.join(contentRoot, collection);
  try {
    await fs.access(dir);
  } catch {
    return [];
  }
  return fg("**/*.mdx", { cwd: dir, absolute: true });
}

export function parseEntry<T extends ContentFrontmatter>(
  collection: CollectionId,
  filePath: string,
  raw: string,
  strictPublished: boolean,
): ContentEntry<T> {
  const { content, data } = matter(raw);
  const schema = schemaFor(collection);
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const published = Boolean((data as { published?: boolean }).published);
    if (strictPublished && published) {
      throw new Error(
        `Invalid frontmatter in ${filePath}: ${parsed.error.message}`,
      );
    }
    return {
      filePath,
      body: content,
      frontmatter: data as T,
    };
  }
  return {
    filePath,
    body: content,
    frontmatter: parsed.data as T,
  };
}

async function readEntry<T extends ContentFrontmatter>(
  collection: CollectionId,
  filePath: string,
): Promise<ContentEntry<T>> {
  const raw = await fs.readFile(filePath, "utf8");
  return parseEntry<T>(collection, filePath, raw, true);
}

export async function getAllEntries<T extends ContentFrontmatter = BaseFrontmatter>(
  collection: CollectionId,
  options: { includeDrafts?: boolean } = {},
): Promise<ContentEntry<T>[]> {
  const { includeDrafts = false } = options;
  const paths = await getAllMdxPaths(collection);
  const entries: ContentEntry<T>[] = [];

  for (const filePath of paths) {
    const raw = await fs.readFile(filePath, "utf8");
    const entry = parseEntry<T>(collection, filePath, raw, false);
    if (!includeDrafts && !entry.frontmatter.published) {
      continue;
    }
    entries.push(entry);
  }

  return entries.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime(),
  );
}

export async function getEntryBySlug<T extends ContentFrontmatter = BaseFrontmatter>(
  collection: CollectionId,
  slug: string,
): Promise<ContentEntry<T> | null> {
  const paths = await getAllMdxPaths(collection);
  for (const filePath of paths) {
    const entry = await readEntry<T>(collection, filePath);
    if (entry.frontmatter.slug === slug) {
      return entry;
    }
  }
  return null;
}

export async function getPublishedSlugs(
  collection: CollectionId,
): Promise<string[]> {
  const entries = await getAllEntries(collection);
  return entries.map((e) => e.frontmatter.slug);
}

export async function getPageEntry(
  slug: "about" | "home",
): Promise<ContentEntry<PageFrontmatter> | null> {
  const filePath = path.join(contentRoot, "pages", `${slug}.mdx`);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return parseEntry<PageFrontmatter>("pages", filePath, raw, true);
  } catch {
    return null;
  }
}

export async function getAllTags(
  collection: "writing" | "field-notes",
): Promise<string[]> {
  const entries = await getAllEntries(collection);
  const tags = new Set<string>();
  for (const entry of entries) {
    for (const tag of entry.frontmatter.tags) tags.add(tag);
  }
  return [...tags].sort((a, b) => a.localeCompare(b));
}

export async function getEntriesByTag(
  collection: "writing" | "field-notes",
  tag: string,
): Promise<ContentEntry[]> {
  const entries = await getAllEntries(collection);
  return entries.filter((e) => e.frontmatter.tags.includes(tag));
}

export function isWorkFrontmatter(
  fm: BaseFrontmatter,
): fm is WorkFrontmatter {
  return "role" in fm;
}
