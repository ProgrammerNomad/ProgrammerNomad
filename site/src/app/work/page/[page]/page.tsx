import { notFound } from "next/navigation";
import {
  PaginationLinks,
  paginateEntries,
} from "@/components/content/EntryList";
import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { getAllEntries } from "@/lib/content/loader";
import { totalPages } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { WorkProjectCard } from "@/components/work/WorkProjectCard";
import type { WorkFrontmatter } from "@/lib/validation/schemas";
import { indexPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  return indexPageMetadata(
    `Projects – Page ${page}`,
    "More tools from the software lab.",
    `/work/page/${page}`,
  );
}

export async function generateStaticParams() {
  const entries = await getAllEntries<WorkFrontmatter>("work");
  const pages = totalPages(entries.length);
  if (pages <= 1) return [];
  return Array.from({ length: pages - 1 }, (_, i) => ({
    page: String(i + 2),
  }));
}

export default async function WorkPaginatedPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page: pageParam } = await params;
  const page = Number(pageParam);
  const entries = await getAllEntries<WorkFrontmatter>("work");
  const pages = totalPages(entries.length);

  if (!Number.isInteger(page) || page < 2 || page > pages) notFound();

  const pageEntries = paginateEntries(entries, page);

  return (
    <Container className="py-16 md:py-24">
      <Breadcrumbs
        items={[
          { label: "Projects", href: "/work" },
          { label: `Archive / ${page}` },
        ]}
      />
      <MetaLabel>ENGINEERING / ARCHIVE</MetaLabel>
      <h1 className="mt-4 font-display text-4xl font-semibold">
        Work - Page {page}
      </h1>
      <div className="mt-12">
        <div className="grid gap-6 md:grid-cols-3">
          {pageEntries.map(({ frontmatter }) => (
            <WorkProjectCard entry={frontmatter} key={frontmatter.slug} />
          ))}
        </div>
        <PaginationLinks
          basePath="/work"
          itemCount={entries.length}
          currentPage={page}
        />
      </div>
    </Container>
  );
}
