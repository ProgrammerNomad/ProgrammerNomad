import { getAllEntries } from "@/lib/content/loader";

export type RelatedArticle = {
  href: string;
  title: string;
};

export async function getRelatedArticles(
  slug: string,
  tags: string[],
  limit = 3,
): Promise<RelatedArticle[]> {
  const [fieldNotes, writing] = await Promise.all([
    getAllEntries("field-notes"),
    getAllEntries("writing"),
  ]);

  const candidates = [
    ...fieldNotes.map((e) => ({
      slug: e.frontmatter.slug,
      title: e.frontmatter.title,
      tags: e.frontmatter.tags,
      href: `/field-notes/${e.frontmatter.slug}`,
    })),
    ...writing.map((e) => ({
      slug: e.frontmatter.slug,
      title: e.frontmatter.title,
      tags: e.frontmatter.tags,
      href: `/writing/${e.frontmatter.slug}`,
    })),
  ];

  return candidates
    .filter(
      (e) =>
        e.slug !== slug &&
        e.tags.some((t) => tags.includes(t)),
    )
    .slice(0, limit)
    .map((e) => ({ href: e.href, title: e.title }));
}
