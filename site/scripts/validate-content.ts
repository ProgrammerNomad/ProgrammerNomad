import fg from "fast-glob";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import {
  collectionSchemas,
  type CollectionId,
} from "../src/lib/validation/schemas";

const ALLOWED_COMPONENTS = new Set([
  "Callout",
  "Figure",
  "CodeBlock",
  "Video",
  "LinkCard",
  "ArchitectureDiagram",
  "YouTubeEmbed",
]);

const DISALLOWED_PATTERNS = [
  /<script[\s>]/i,
  /dangerouslySetInnerHTML/i,
  /javascript:/i,
];

const contentRoot = path.join(process.cwd(), "content");
const publicRoot = path.join(process.cwd(), "public");
const PLACEHOLDER_TRAVEL = "/images/travel/placeholder.svg";

async function assertPublicAsset(filePath: string, assetPath: string) {
  if (!assetPath.startsWith("/")) {
    throw new Error(`${filePath}: asset path must start with / (${assetPath})`);
  }
  if (assetPath === PLACEHOLDER_TRAVEL) return;
  const disk = path.join(publicRoot, assetPath.replace(/^\//, ""));
  try {
    await fs.access(disk);
  } catch {
    throw new Error(`${filePath}: missing public asset ${assetPath}`);
  }
}

function collectFigureSrc(body: string): string[] {
  const srcs: string[] = [];
  const re = /<Figure[^>]*\ssrc="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    srcs.push(m[1]);
  }
  return srcs;
}

async function validateFieldNoteAssets(filePath: string, data: unknown, body: string) {
  const cover = (data as { cover?: string }).cover;
  if (cover) await assertPublicAsset(filePath, cover);
  for (const src of collectFigureSrc(body)) {
    await assertPublicAsset(filePath, src);
  }
}

async function validateMdxBody(filePath: string, body: string) {
  for (const pattern of DISALLOWED_PATTERNS) {
    if (pattern.test(body)) {
      throw new Error(`${filePath}: disallowed MDX pattern (${pattern})`);
    }
  }

  const tree = unified().use(remarkParse).use(remarkMdx).parse(body);

  visit(tree, (node) => {
    if (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") {
      const name = "name" in node ? (node.name as string | null) : null;
      if (!name) return;
      const isHtml = name === name.toLowerCase();
      if (!isHtml && !ALLOWED_COMPONENTS.has(name)) {
        throw new Error(
          `${filePath}: disallowed JSX component <${name}> (not in allowlist)`,
        );
      }
    }
  });
}

async function validateCollection(collection: CollectionId) {
  const dir = path.join(contentRoot, collection);
  const files = await fg("**/*.mdx", { cwd: dir, absolute: true });
  const slugs = new Set<string>();
  const schema = collectionSchemas[collection];

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, "utf8");
    const { content, data } = matter(raw);
    const parsed = schema.safeParse(data);
    const published = Boolean((data as { published?: boolean }).published);

    if (published && !parsed.success) {
      throw new Error(
        `${filePath}: invalid published frontmatter - ${parsed.error.message}`,
      );
    }

    const slug = (parsed.success ? parsed.data.slug : (data as { slug?: string }).slug) ?? "";
    if (slug) {
      if (slugs.has(slug)) {
        throw new Error(`${filePath}: duplicate slug "${slug}" in ${collection}`);
      }
      slugs.add(slug);
    }

    await validateMdxBody(filePath, content);

    if (collection === "field-notes" && published) {
      await validateFieldNoteAssets(filePath, data, content);
    }
  }
}

async function main() {
  await validateCollection("work");
  await validateCollection("writing");
  await validateCollection("field-notes");
  await validateCollection("pages");
  console.log("Content validation passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
