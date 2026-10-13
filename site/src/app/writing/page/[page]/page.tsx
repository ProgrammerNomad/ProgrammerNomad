import { notFound } from "next/navigation";
import {
  EntryListSimple,
  PaginationLinks,
  paginateEntries,
} from "@/components/content/EntryList";
import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { getAllEntries } from "@/lib/content/loader";
import { totalPages } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { indexPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  return indexPageMetadata(
    `Writing – Page ${page}`,
    "Engineering essays and architecture notes.",
    `/writing/page/${page}`,
  );
}

export async function generateStaticParams() {
  const entries = await getAllEntries("writing");
  const pages = totalPages(entries.length);
  if (pages <= 1) return [];
  return Array.from({ length: pages - 1 }, (_, i) => ({
    page: String(i + 2),
  }));
}

export default async function WritingPaginatedPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page: pageParam } = await params;
  const page = Number(pageParam);
  const entries = await getAllEntries("writing");
  const pages = totalPages(entries.length);

  if (!Number.isInteger(page) || page < 2 || page > pages) notFound();

  const pageEntries = paginateEntries(entries, page);

  return (
    <Container className="py-16 md:py-24">
      <Breadcrumbs
        items={[
          { label: "Writing", href: "/writing" },
          { label: `Archive / ${page}` },
        ]}
      />
      <MetaLabel>WRITING / ARCHIVE</MetaLabel>
      <h1 className="mt-4 font-display text-4xl font-semibold">
        Writing - Page {page}
      </h1>
      <div className="mt-12">
        <EntryListSimple
          entries={pageEntries.map((e) => e.frontmatter)}
          hrefPrefix="/writing"
        />
        <PaginationLinks
          basePath="/writing"
          itemCount={entries.length}
          currentPage={page}
        />
      </div>
    </Container>
  );
}
