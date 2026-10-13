import { EntryListSimple, PaginationLinks, paginateEntries } from "@/components/content/EntryList";
import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { getAllEntries } from "@/lib/content/loader";

export const metadata = {
  title: "Writing",
  description: "Articles, tutorials, and long-form notes.",
};

export default async function WritingIndexPage() {
  const entries = await getAllEntries("writing");
  const pageEntries = paginateEntries(entries, 1);

  return (
    <Container className="py-16 md:py-24">
      <MetaLabel>WRITING / ARTICLES</MetaLabel>
      <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">Writing</h1>
      <div className="mt-12">
        <EntryListSimple
          entries={pageEntries.map((e) => e.frontmatter)}
          hrefPrefix="/writing"
        />
        <PaginationLinks
          basePath="/writing"
          itemCount={entries.length}
          currentPage={1}
        />
      </div>
    </Container>
  );
}
