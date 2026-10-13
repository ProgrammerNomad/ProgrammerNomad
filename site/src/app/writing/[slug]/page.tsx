import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { ShareButtons, TableOfContents } from "@/components/writing/PostExtras";
import { getAllEntries, getEntryBySlug, getPublishedSlugs } from "@/lib/content/loader";
import { readingTimeMinutes } from "@/lib/content/reading-time";
import { extractTocFromMdx } from "@/lib/content/toc";
import { renderMdx } from "@/lib/content/mdx";
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

  const all = await getAllEntries("writing");
  const related = all
    .filter(
      (e) =>
        e.frontmatter.slug !== slug &&
        e.frontmatter.tags.some((t) => entry.frontmatter.tags.includes(t)),
    )
    .slice(0, 3);

  const path = `/writing/${slug}`;

  return (
    <Container className="py-16 md:py-24">
      <BlogPostingJsonLd entry={entry.frontmatter} pathPrefix="/writing" />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Writing", path: "/writing" },
          { name: entry.frontmatter.title, path },
        ]}
      />
      <MetaLabel>
        {entry.frontmatter.date} · {minutes} min read
      </MetaLabel>
      <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
        {entry.frontmatter.title}
      </h1>
      <p className="mt-4 max-w-prose text-lg text-paper/70">
        {entry.frontmatter.summary}
      </p>
      <div className="mt-6">
        <ShareButtons title={entry.frontmatter.title} path={path} />
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <TableOfContents items={toc} />
        </aside>
        <div>{content}</div>
      </div>

      {related.length > 0 ? (
        <section className="mt-16 border-t border-paper/10 pt-12">
          <h2 className="font-display text-2xl text-paper">Related posts</h2>
          <ul className="mt-6 space-y-3">
            {related.map((r) => (
              <li key={r.frontmatter.slug}>
                <Link
                  href={`/writing/${r.frontmatter.slug}`}
                  className="text-paper/80 hover:text-lime"
                >
                  {r.frontmatter.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </Container>
  );
}
