import { EntryGrid, PaginationLinks, paginateEntries } from "@/components/content/EntryList";
import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { getAllEntries } from "@/lib/content/loader";

export const metadata = {
  title: "Field Notes",
  description: "Travel journals, landscapes, and observations from the field.",
};

export default async function FieldNotesIndexPage() {
  const entries = await getAllEntries("field-notes");
  const pageEntries = paginateEntries(entries, 1);

  return (
    <Container className="py-16 md:py-24">
      <MetaLabel>EXPLORATION / FIELD NOTES</MetaLabel>
      <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
        Field Notes
      </h1>
      <div className="mt-12">
        <EntryGrid
          entries={pageEntries.map((e) => e.frontmatter)}
          hrefPrefix="/field-notes"
        />
        <PaginationLinks
          basePath="/field-notes"
          itemCount={entries.length}
          currentPage={1}
        />
      </div>
    </Container>
  );
}
