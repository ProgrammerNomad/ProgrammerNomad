import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { getAllEntries, getEntryBySlug } from "@/lib/content/loader";
import { renderMdx } from "@/lib/content/mdx";
import { BreadcrumbJsonLd, BlogPostingJsonLd } from "@/lib/seo/json-ld";
import { entryMetadata } from "@/lib/seo/metadata";
import type { WorkFrontmatter } from "@/lib/validation/schemas";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProjectVisual } from "@/components/work/ProjectVisual";
import { CapabilityDiagram } from "@/components/work/CapabilityDiagram";
import { projectDiagrams } from "@/lib/content/project-diagrams";
import { Prose } from "@/components/ui/Prose";
import { TableOfContents } from "@/components/writing/PostExtras";
import { extractTocFromMdx } from "@/lib/content/toc";
import { RailwayArchitecture } from "@/components/work/RailwayArchitecture";

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
  if (!entry?.frontmatter.published || entry.frontmatter.detailPage === false) {
    notFound();
  }

  const content = await renderMdx(entry.body);
  const fm = entry.frontmatter;
  const related = (await getAllEntries<WorkFrontmatter>("work"))
    .filter(
      (e) =>
        e.frontmatter.slug !== slug &&
        e.frontmatter.categories.some((c) => fm.categories.includes(c)),
    )
    .slice(0, 3);

  return (
    <Container className="py-16 md:py-24" data-section="work">
      <Breadcrumbs
        items={[{ label: "Projects", href: "/work" }, { label: fm.title }]}
      />
      <BlogPostingJsonLd entry={fm} pathPrefix="/work" />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Projects", path: "/work" },
          { name: fm.title, path: `/work/${fm.slug}` },
        ]}
      />
      <div className="project-opening">
        <div>
          <MetaLabel>{fm.categories.join(" · ") || "Open Source"}</MetaLabel>
          <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
            {fm.title}
          </h1>
          <p className="mt-4 max-w-prose text-lg text-paper/70">{fm.summary}</p>
          <div className="mt-6 flex flex-wrap gap-4 font-mono text-xs uppercase tracking-widest">
            <Link
              href={fm.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lime hover:underline"
            >
              GitHub →
            </Link>
            {fm.demoUrl ? (
              <Link
                href={fm.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-paper/80 hover:text-lime"
              >
                {fm.demoUrl.includes("github.com")
                  ? "Documentation ↗"
                  : "Live demo ↗"}
              </Link>
            ) : null}
          </div>
          <p className="atlas-meta mt-8">{fm.tech.join(" / ")}</p>
        </div>
        <ProjectVisual entry={fm} />
      </div>
      {slug === "indian-railway-station-search" ? (
        <RailwayArchitecture />
      ) : (
        projectDiagrams[slug] && (
          <CapabilityDiagram nodes={projectDiagrams[slug]} />
        )
      )}
      <div className="article-columns mt-16">
        <aside>
          <TableOfContents items={extractTocFromMdx(entry.body)} />
        </aside>
        <Prose>{content}</Prose>
      </div>
      <section className="editorial-section mt-16">
        <div className="section-topline">
          <div>
            <p className="atlas-meta">Continue through the lab</p>
            <h2>More to explore.</h2>
          </div>
          <Link href="/work" className="atlas-button">
            All projects ↗
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {related.map(({ frontmatter: r }) => (
            <Link
              className="dispatch-link"
              key={r.slug}
              href={r.detailPage ? `/work/${r.slug}` : r.repoUrl}
            >
              <p className="atlas-meta">{r.tech.join(" / ")}</p>
              <h3>{r.title} ↗</h3>
              <p className="text-paper/65 text-sm">{r.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </Container>
  );
}
