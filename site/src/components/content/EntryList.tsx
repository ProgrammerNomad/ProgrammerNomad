import Link from "next/link";
import type { BaseFrontmatter } from "@/lib/validation/schemas";
import { EntryGridClient } from "@/components/content/EntryGridClient";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { PAGE_SIZE, totalPages } from "@/lib/utils";

export function EntryGrid({
  entries,
  hrefPrefix,
}: {
  entries: BaseFrontmatter[];
  hrefPrefix: string;
}) {
  return <EntryGridClient entries={entries} hrefPrefix={hrefPrefix} />;
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
            className="glass-card group flex flex-col gap-2 p-5 transition-all duration-300 hover:border-lime/50 hover:shadow-[0_0_25px_rgba(181,255,67,0.14)] hover:translate-x-1 sm:flex-row sm:items-baseline sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-lime opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                →
              </span>
              <span className="font-display text-lg text-paper transition-colors group-hover:text-white group-hover:font-medium">
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
