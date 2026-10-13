import Link from "next/link";
import {
  EntryGrid,
  PaginationLinks,
  paginateEntries,
} from "@/components/content/EntryList";
import { Container } from "@/components/ui/Container";
import { SectionLink } from "@/components/ui/SectionLink";
import { isFieldGuide } from "@/lib/content/field-guides";
import { getAllEntries } from "@/lib/content/loader";
import { indexPageMetadata } from "@/lib/seo/metadata";
import { getTravelDestinations } from "@/lib/travel/merge-places";
import { AtlasHeading } from "@/components/ui/AtlasHeading";
import { TravelAtlas } from "@/components/travel/TravelAtlas";
import type { FieldNotesFrontmatter } from "@/lib/validation/schemas";

export const metadata = indexPageMetadata(
  "Travel Stories – Nomad Programmer",
  "Trip notes, maps, and remote-work tips from travels across India.",
  "/field-notes",
);

export default async function FieldNotesIndexPage() {
  const entries = await getAllEntries<FieldNotesFrontmatter>("field-notes");
  const pageEntries = paginateEntries(entries, 1);
  const destinations = await getTravelDestinations();
  const guides = entries
    .filter((e) => isFieldGuide(e.frontmatter))
    .sort((a, b) => {
      const af = (a.frontmatter as { featured?: boolean }).featured ? 1 : 0;
      const bf = (b.frontmatter as { featured?: boolean }).featured ? 1 : 0;
      if (af !== bf) return bf - af;
      return (
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
      );
    });

  return (
    <Container className="py-16 md:py-24" data-section="travel">
      <AtlasHeading
        index="02"
        eyebrow="Journeys / The living atlas"
        title="The world, outside the editor."
        description="Mountain roads, city lanes, and field notes from the places I've explored. Choose a pin, follow a story, or find a practical guide for working on the road."
      >
        <p className="atlas-meta mt-8">
          {destinations.length} documented places /{" "}
          {entries.filter((e) => !isFieldGuide(e.frontmatter)).length} travel
          stories
        </p>
      </AtlasHeading>
      <TravelAtlas
        destinations={destinations}
        stories={entries
          .filter((e) => !isFieldGuide(e.frontmatter))
          .map((e) => e.frontmatter)}
      />

      {guides.length > 0 ? (
        <section id="field-guides" className="field-guide-shelf scroll-mt-24">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#e8b86d] shadow-[0_0_8px_#e8b86d]" />
            <h2 className="font-display text-xl text-paper font-semibold">
              Developer field guides
            </h2>
          </div>
          <p className="mt-2 max-w-prose text-sm text-paper/75 leading-relaxed">
            Practical guides for coding while traveling - connectivity, offline
            workflows, gear, and security.
          </p>
          <ul className="mt-6 space-y-4">
            {guides.map((g) => (
              <li key={g.frontmatter.slug} className="group">
                <Link
                  href={`/field-notes/${g.frontmatter.slug}`}
                  className="font-display text-lg text-paper transition-colors group-hover:text-[#e8b86d] font-medium"
                >
                  {g.frontmatter.title}
                </Link>
                <p className="mt-1 text-sm text-paper/60 leading-relaxed">
                  {g.frontmatter.summary}
                </p>
              </li>
            ))}
          </ul>
          <SectionLink href="/gear" className="mt-6">
            Gear & tools →
          </SectionLink>
        </section>
      ) : null}

      <section className="mt-12">
        <h2 className="font-display text-3xl mb-8">From the notebook</h2>
        <EntryGrid
          entries={pageEntries.map((e) => e.frontmatter)}
          hrefPrefix="/field-notes"
        />
        <PaginationLinks
          basePath="/field-notes"
          itemCount={entries.length}
          currentPage={1}
        />
      </section>
    </Container>
  );
}
