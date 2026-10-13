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
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <ProjectCard key={entry.slug} entry={entry} hrefPrefix={hrefPrefix} />
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
    <ul className="divide-y divide-paper/10 border-y border-paper/10">
      {entries.map((entry) => (
        <li key={entry.slug}>
          <Link
            href={`${hrefPrefix}/${entry.slug}`}
            className="flex flex-col gap-1 py-5 transition hover:text-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime sm:flex-row sm:items-baseline sm:justify-between"
          >
            <span className="font-display text-lg text-paper">{entry.title}</span>
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
      className="mt-10 flex items-center justify-between font-mono text-xs uppercase tracking-widest"
      aria-label="Pagination"
    >
      {currentPage > 1 ? (
        <Link
          href={currentPage === 2 ? basePath : `${basePath}/page/${currentPage - 1}`}
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
