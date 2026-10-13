import { getAllEntries } from "./loader";
import { isFieldGuide } from "./field-guides";
import { getTravelDestinations } from "@/lib/travel/merge-places";
import { PRIMARY_NAV } from "@/lib/navigation";
import type { WorkFrontmatter } from "@/lib/validation/schemas";
import type { SearchRecord } from "@/lib/search";

export async function getSearchIndex(): Promise<SearchRecord[]> {
  const [work, travel, writing, destinations] = await Promise.all([
    getAllEntries<WorkFrontmatter>("work"),
    getAllEntries("field-notes"),
    getAllEntries("writing"),
    getTravelDestinations(),
  ]);
  return [
    ...PRIMARY_NAV.map((page) => ({
      title: page.label,
      href: page.href,
      kind: "Pages",
      summary: "Explore Nomad Programmer",
      tags: [],
    })),
    ...work.map(({ frontmatter: f }) => ({
      title: f.title,
      href: f.detailPage ? `/work/${f.slug}` : f.repoUrl,
      kind: "Projects",
      summary: f.summary,
      tags: f.tech,
    })),
    ...travel.map(({ frontmatter: f }) => ({
      title: f.title,
      href: `/field-notes/${f.slug}`,
      kind: isFieldGuide(f) ? "Guides" : "Journeys",
      summary: f.summary,
      tags: f.tags,
    })),
    ...writing.map(({ frontmatter: f }) => ({
      title: f.title,
      href: `/writing/${f.slug}`,
      kind: "Writing",
      summary: f.summary,
      tags: f.tags,
    })),
    ...destinations.map((d) => ({
      title: d.label,
      href: `/field-notes?place=${encodeURIComponent(d.id)}#atlas`,
      kind: "Destinations",
      summary: `${d.stories.length} published ${d.stories.length === 1 ? "story" : "stories"}`,
      tags: [],
    })),
  ];
}
