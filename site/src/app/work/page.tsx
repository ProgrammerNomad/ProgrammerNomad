import { EntryGrid, PaginationLinks, paginateEntries } from "@/components/content/EntryList";
import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { getAllEntries } from "@/lib/content/loader";

export const metadata = {
  title: "Work",
  description: "Engineering case studies and system design notes.",
};

export default async function WorkIndexPage() {
  const entries = await getAllEntries("work");
  const pageEntries = paginateEntries(entries, 1);

  return (
    <Container className="py-16 md:py-24">
      <MetaLabel>ENGINEERING / CASE STUDIES</MetaLabel>
      <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">Work</h1>
      <p className="mt-4 max-w-prose text-paper/70">
        Architecture, implementation decisions, and outcomes from production
        systems.
      </p>
      <div className="mt-12">
        <EntryGrid
          entries={pageEntries.map((e) => e.frontmatter)}
          hrefPrefix="/work"
        />
        <PaginationLinks basePath="/work" itemCount={entries.length} currentPage={1} />
      </div>
    </Container>
  );
}
