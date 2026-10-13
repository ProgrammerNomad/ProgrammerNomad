import type { MetadataRoute } from "next";
import { getAllEntries } from "@/lib/content/loader";
import { tagToParam } from "@/lib/content/tags";
import { shouldAllowIndexing, siteUrl } from "@/lib/env";
import { fetchChannelVideos } from "@/lib/youtube/rss";
import type { WorkFrontmatter } from "@/lib/validation/schemas";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!shouldAllowIndexing()) return [];

  const staticPaths = [
    "",
    "/work",
    "/writing",
    "/field-notes",
    "/videos",
    "/gear",
    "/about",
    "/contact",
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${siteUrl}${path}`,
  }));

  const collections = ["work", "writing", "field-notes"] as const;
  const entryRoutes: MetadataRoute.Sitemap = [];

  for (const collection of collections) {
    const entries = await getAllEntries(collection);
    for (const entry of entries) {
      if (collection === "work") {
        const fm = entry.frontmatter as WorkFrontmatter;
        if (fm.detailPage === false) continue;
      }
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
  }));

  const videos = await fetchChannelVideos(30);
  const videoRoutes: MetadataRoute.Sitemap = videos.map((v) => ({
    url: `${siteUrl}/videos/${v.id}`,
    lastModified: v.publishedAt ? new Date(v.publishedAt) : undefined,
  }));

  return [...staticRoutes, ...entryRoutes, ...tagRoutes, ...videoRoutes];
}
