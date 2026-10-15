import Link from "next/link";
import type { BaseFrontmatter } from "@/lib/validation/schemas";
import { ProjectCard } from "@/components/content/ProjectCard";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { PAGE_SIZE, totalPages } from "@/lib/utils";

export function EntryGrid({
  entries,
  hrefPrefix,
}: {
  entries: BaseFrontmatter[];
  hrefPrefix: string;
}) {
  // Content archives must remain readable without JS or viewport-triggered reveals.
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <ProjectCard entry={entry} hrefPrefix={hrefPrefix} key={entry.slug} />
      ))}
    </div>
  );
}

export function EntryListSimple({
  entries,
  hrefPrefix,
}: {
  entries: BaseFrontmatter[];
  hrefPrefix: string;
}) {
  return (
    <ul className="space-y-3">
      {entries.map((entry) => (
        <li key={entry.slug}>
          <Link
            href={`${hrefPrefix}/${entry.slug}`}
            className="dispatch-link group flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-lime opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                →
              </span>
              <span className="font-display text-lg text-paper transition-colors group-hover:text-lime group-hover:font-medium">
                {entry.title}
              </span>
            </div>
            <MetaLabel>{entry.date}</MetaLabel>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function PaginationLinks({
  basePath,
  itemCount,
  currentPage,
}: {
  basePath: string;
  itemCount: number;
  currentPage: number;
}) {
  const pages = totalPages(itemCount);
  if (pages <= 1) return null;

  return (
    <nav
      className="mt-10 flex flex-wrap gap-4 items-center justify-between font-mono text-xs uppercase tracking-widest"
      aria-label="Pagination"
    >
      {currentPage > 1 ? (
        <Link
          href={
            currentPage === 2 ? basePath : `${basePath}/page/${currentPage - 1}`
          }
          className="text-paper/80 hover:text-lime"
        >
          ← Previous
        </Link>
      ) : (
        <span />
      )}
      <span className="text-paper/50">
        Page {currentPage} / {pages}
      </span>
      {currentPage < pages ? (
        <Link
          href={`${basePath}/page/${currentPage + 1}`}
          className="text-paper/80 hover:text-lime"
        >
          Next →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

export function paginateEntries<T>(entries: T[], page: number): T[] {
  const start = (page - 1) * PAGE_SIZE;
  return entries.slice(start, start + PAGE_SIZE);
}
