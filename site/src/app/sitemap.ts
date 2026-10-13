import type { MetadataRoute } from "next";
import { getAllEntries } from "@/lib/content/loader";
import { tagToParam } from "@/lib/content/tags";
import { shouldAllowIndexing, siteUrl } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!shouldAllowIndexing()) return [];

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/work",
    "/writing",
    "/field-notes",
    "/about",
    "/contact",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const collections = ["work", "writing", "field-notes"] as const;
  const entryRoutes: MetadataRoute.Sitemap = [];

  for (const collection of collections) {
    const entries = await getAllEntries(collection);
    for (const entry of entries) {
      entryRoutes.push({
        url: `${siteUrl}/${collection}/${entry.frontmatter.slug}`,
        lastModified: new Date(
          entry.frontmatter.updatedAt ?? entry.frontmatter.date,
        ),
      });
    }
  }

  const writing = await getAllEntries("writing");
  const tagRoutes: MetadataRoute.Sitemap = [
    ...new Set(writing.flatMap((w) => w.frontmatter.tags)),
  ].map((tag) => ({
    url: `${siteUrl}/writing/tags/${tagToParam(tag)}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...entryRoutes, ...tagRoutes];
}
