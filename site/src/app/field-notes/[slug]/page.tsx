import { notFound } from "next/navigation";
import { GuideArticleLayout } from "@/components/content/GuideArticleLayout";
import { getEntryBySlug, getPublishedSlugs } from "@/lib/content/loader";
import { renderMdx } from "@/lib/content/mdx";
import { getRelatedArticles } from "@/lib/content/related";
import { readingTimeMinutes } from "@/lib/content/reading-time";
import { extractTocFromMdx } from "@/lib/content/toc";
import { BlogPostingJsonLd, BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { entryMetadata } from "@/lib/seo/metadata";
import { TravelStoryLayout } from "@/components/travel/TravelStoryLayout";
import { isFieldGuide } from "@/lib/content/field-guides";
import { prepareTravelStory } from "@/lib/travel/story-presentation";
import type { FieldNotesFrontmatter } from "@/lib/validation/schemas";

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs("field-notes");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getEntryBySlug<FieldNotesFrontmatter>(
    "field-notes",
    slug,
  );
  if (!entry?.frontmatter.published) return {};
  return entryMetadata(entry.frontmatter, "/field-notes");
}

export default async function FieldNoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getEntryBySlug<FieldNotesFrontmatter>(
    "field-notes",
    slug,
  );
  if (!entry?.frontmatter.published) notFound();

  const isGuide = isFieldGuide(entry.frontmatter);
  const presentation = isGuide
    ? { body: entry.body, photos: [] }
    : prepareTravelStory(entry.body);
  const content = await renderMdx(presentation.body);
  const toc = extractTocFromMdx(presentation.body);
  if (presentation.photos.length)
    toc.push({ id: "photo-journal", text: "Photo journal", level: 2 });
  const minutes = readingTimeMinutes(presentation.body);
  const related = await getRelatedArticles(slug, entry.frontmatter.tags, 3);
  const path = `/field-notes/${slug}`;

  return (
    <>
      <BlogPostingJsonLd entry={entry.frontmatter} pathPrefix="/field-notes" />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Travel", path: "/field-notes" },
          { name: entry.frontmatter.title, path },
        ]}
      />
      {!isGuide ? (
        <TravelStoryLayout
          entry={entry.frontmatter}
          photos={presentation.photos}
          related={related}
          toc={toc}
          minutes={minutes}
        >
          {content}
        </TravelStoryLayout>
      ) : (
        <GuideArticleLayout
          entry={entry.frontmatter}
          path={path}
          sectionLabel="FIELD GUIDE"
          minutes={minutes}
          toc={toc}
          related={related}
        >
          {content}
        </GuideArticleLayout>
      )}
    </>
  );
}
