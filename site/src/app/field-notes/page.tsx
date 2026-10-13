import Link from "next/link";
import { EntryGrid, PaginationLinks, paginateEntries } from "@/components/content/EntryList";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionLink } from "@/components/ui/SectionLink";
import { getAllEntries } from "@/lib/content/loader";
import { indexPageMetadata } from "@/lib/seo/metadata";
import { MotionSection } from "@/components/ui/MotionReveal";
import { TravelMapSection } from "@/components/travel/TravelMapSection";
import { getTravelMapPlaces } from "@/lib/travel/places";

export const metadata = indexPageMetadata(
  "Travel Stories – Nomad Programmer",
  "Trip notes, maps, and remote-work tips from travels across India.",
  "/field-notes",
);

export default async function FieldNotesIndexPage() {
  const entries = await getAllEntries("field-notes");
  const pageEntries = paginateEntries(entries, 1);
  const places = await getTravelMapPlaces();

  return (
    <Container className="py-16 md:py-24" data-section="travel">
      <PageHeader
        label="EXPLORATION / TRAVEL"
        title="Travel Stories"
        description="Routes, costs, seasons, and films from the field - plus how I work on the road as a programmer-nomad."
      />

      <section className="mt-12">
        <h2 className="font-display text-2xl text-paper">Map</h2>
        <div className="mt-6">
          <TravelMapSection places={places} />
        </div>
      </section>

      <section className="mt-12 rounded-xl border border-paper/10 bg-elevated/40 p-6">
        <h2 className="font-display text-xl text-paper">Nomad programmer tips</h2>
        <p className="mt-2 max-w-prose text-sm text-paper/70">
          Laptop, connectivity, and gear for coding while traveling.
        </p>
        <SectionLink href="/field-notes/nomad-remote-work" className="mt-4">
          Read the checklist →
        </SectionLink>
        <Link
          href="/gear"
          className="ml-6 inline-block font-mono text-xs uppercase tracking-widest text-paper/70 hover:text-lime"
        >
          Gear page →
        </Link>
      </section>

      <MotionSection className="mt-12">
        <EntryGrid
          entries={pageEntries.map((e) => e.frontmatter)}
          hrefPrefix="/field-notes"
        />
        <PaginationLinks
          basePath="/field-notes"
          itemCount={entries.length}
          currentPage={1}
        />
      </MotionSection>
    </Container>
  );
}
