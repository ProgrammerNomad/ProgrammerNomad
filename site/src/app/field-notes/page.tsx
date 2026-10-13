import Link from "next/link";
import { EntryGrid, PaginationLinks, paginateEntries } from "@/components/content/EntryList";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionLink } from "@/components/ui/SectionLink";
import { isFieldGuide } from "@/lib/content/field-guides";
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

      {guides.length > 0 ? (
        <section
          id="field-guides"
          className="mt-12 rounded-xl border border-paper/10 bg-elevated/40 p-6 scroll-mt-24"
        >
          <h2 className="font-display text-xl text-paper">Developer field guides</h2>
          <p className="mt-2 max-w-prose text-sm text-paper/70">
            Practical guides for coding while traveling-connectivity, offline
            workflows, gear, and security.
          </p>
          <ul className="mt-6 space-y-3">
            {guides.map((g) => (
              <li key={g.frontmatter.slug}>
                <Link
                  href={`/field-notes/${g.frontmatter.slug}`}
                  className="font-display text-lg text-paper hover:text-lime"
                >
                  {g.frontmatter.title}
                </Link>
                <p className="mt-1 text-sm text-paper/60">{g.frontmatter.summary}</p>
              </li>
            ))}
          </ul>
          <SectionLink href="/gear" className="mt-6">
            Gear & tools →
          </SectionLink>
        </section>
      ) : null}

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
