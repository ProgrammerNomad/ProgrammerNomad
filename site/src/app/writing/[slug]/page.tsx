import { notFound } from "next/navigation";
import { GuideArticleLayout } from "@/components/content/GuideArticleLayout";
import { getEntryBySlug, getPublishedSlugs } from "@/lib/content/loader";
import { renderMdx } from "@/lib/content/mdx";
import { getRelatedArticles } from "@/lib/content/related";
import { readingTimeMinutes } from "@/lib/content/reading-time";
import { extractTocFromMdx } from "@/lib/content/toc";
import { BlogPostingJsonLd, BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { entryMetadata } from "@/lib/seo/metadata";

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs("writing");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getEntryBySlug("writing", slug);
  if (!entry?.frontmatter.published) return {};
  return entryMetadata(entry.frontmatter, "/writing");
}

export default async function WritingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getEntryBySlug("writing", slug);
  if (!entry?.frontmatter.published) notFound();

  const content = await renderMdx(entry.body);
  const toc = extractTocFromMdx(entry.body);
  const minutes = readingTimeMinutes(entry.body);
  const related = await getRelatedArticles(
    slug,
    entry.frontmatter.tags,
    3,
  );
  const path = `/writing/${slug}`;

  return (
    <>
      <BlogPostingJsonLd entry={entry.frontmatter} pathPrefix="/writing" />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Writing", path: "/writing" },
          { name: entry.frontmatter.title, path },
        ]}
      />
      <GuideArticleLayout
        entry={entry.frontmatter}
        path={path}
        sectionLabel="WRITING"
        minutes={minutes}
        toc={toc}
        related={related}
      >
        {content}
      </GuideArticleLayout>
    </>
  );
}
