import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { getEntryBySlug, getPublishedSlugs } from "@/lib/content/loader";
import { renderMdx } from "@/lib/content/mdx";
import { entryMetadata } from "@/lib/seo/metadata";

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs("work");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getEntryBySlug("work", slug);
  if (!entry?.frontmatter.published) return {};
  return entryMetadata(entry.frontmatter, "/work");
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getEntryBySlug("work", slug);
  if (!entry?.frontmatter.published) notFound();

  const content = await renderMdx(entry.body);

  return (
    <Container className="py-16 md:py-24">
      <MetaLabel>{entry.frontmatter.date}</MetaLabel>
      <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
        {entry.frontmatter.title}
      </h1>
      <p className="mt-4 max-w-prose text-lg text-paper/70">
        {entry.frontmatter.summary}
      </p>
      <div className="mt-10">{content}</div>
    </Container>
  );
}
