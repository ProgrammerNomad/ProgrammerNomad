import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { getAllEntries, getEntryBySlug } from "@/lib/content/loader";
import { renderMdx } from "@/lib/content/mdx";
import { BreadcrumbJsonLd, BlogPostingJsonLd } from "@/lib/seo/json-ld";
import { entryMetadata } from "@/lib/seo/metadata";
import type { WorkFrontmatter } from "@/lib/validation/schemas";

export async function generateStaticParams() {
  const entries = await getAllEntries<WorkFrontmatter>("work");
  return entries
    .filter((e) => e.frontmatter.detailPage !== false)
    .map((e) => ({ slug: e.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getEntryBySlug<WorkFrontmatter>("work", slug);
  if (!entry?.frontmatter.published || entry.frontmatter.detailPage === false) {
    return {};
  }
  return entryMetadata(entry.frontmatter, "/work");
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getEntryBySlug<WorkFrontmatter>("work", slug);
  if (
    !entry?.frontmatter.published ||
    entry.frontmatter.detailPage === false
  ) {
    notFound();
  }

  const content = await renderMdx(entry.body);
  const fm = entry.frontmatter;

  return (
    <Container className="py-16 md:py-24">
      <BlogPostingJsonLd entry={fm} pathPrefix="/work" />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Projects", path: "/work" },
          { name: fm.title, path: `/work/${fm.slug}` },
        ]}
      />
      <MetaLabel>{fm.categories.join(" · ") || "Open Source"}</MetaLabel>
      <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
        {fm.title}
      </h1>
      <p className="mt-4 max-w-prose text-lg text-paper/70">{fm.summary}</p>
      <div className="mt-6 flex flex-wrap gap-4 font-mono text-xs uppercase tracking-widest">
        <Link href={fm.repoUrl} target="_blank" rel="noopener noreferrer" className="text-lime hover:underline">
          GitHub →
        </Link>
        {fm.demoUrl ? (
          <Link href={fm.demoUrl} target="_blank" rel="noopener noreferrer" className="text-paper/80 hover:text-lime">
            Demo →
          </Link>
        ) : null}
      </div>
      <div className="mt-10">{content}</div>
    </Container>
  );
}
