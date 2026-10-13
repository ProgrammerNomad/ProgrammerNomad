import Link from "next/link";
import { ProjectCard } from "@/components/content/ProjectCard";
import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import type { ContentEntry } from "@/lib/content/loader";

export function ContentIndex({
  title,
  eyebrow,
  entries,
  basePath,
  page,
  totalPages,
}: {
  title: string;
  eyebrow: string;
  entries: ContentEntry[];
  basePath: string;
  page: number;
  totalPages: number;
}) {
  return (
    <Container className="py-16 md:py-24">
      <MetaLabel>{eyebrow}</MetaLabel>
      <h1 className="mt-4 font-display text-4xl md:text-6xl text-paper">{title}</h1>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <ProjectCard
            key={entry.frontmatter.slug}
            entry={entry.frontmatter}
            hrefPrefix={basePath}
            showTags
          />
        ))}
      </div>
      {totalPages > 1 ? (
        <nav
          className="mt-16 flex flex-wrap gap-4 font-mono text-xs uppercase tracking-widest"
          aria-label="Pagination"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={p === 1 ? basePath : `${basePath}/page/${p}`}
              className={
                p === page
                  ? "text-lime"
                  : "text-paper/60 hover:text-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime"
              }
              aria-current={p === page ? "page" : undefined}
            >
              Page {p}
            </Link>
          ))}
        </nav>
      ) : null}
    </Container>
  );
}
