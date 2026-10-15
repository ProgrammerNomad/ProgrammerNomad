import {
  PaginationLinks,
  paginateEntries,
} from "@/components/content/EntryList";
import { Container } from "@/components/ui/Container";
import { getAllEntries } from "@/lib/content/loader";
import Link from "next/link";
import { AtlasHeading } from "@/components/ui/AtlasHeading";
import { isFieldGuide } from "@/lib/content/field-guides";
import { readingTimeMinutes } from "@/lib/content/reading-time";

import { indexPageMetadata } from "@/lib/seo/metadata";

export const metadata = indexPageMetadata(
  "Writing – Nomad Programmer",
  "Tech tutorials, architecture notes, and career tips by Shiv Singh.",
  "/writing",
);

export default async function WritingIndexPage() {
  const entries = await getAllEntries("writing");
  const pageEntries = paginateEntries(entries, 1);
  const guides = (await getAllEntries("field-notes")).filter((e) =>
    isFieldGuide(e.frontmatter),
  );

  return (
    <Container className="py-16 md:py-24">
      <AtlasHeading
        index="03"
        eyebrow="The notebook / Ideas in writing"
        title="Thinking out loud."
        description="Engineering notes, architecture decisions, and practical knowledge from life between the keyboard and the road."
      />
      <nav className="reading-paths" aria-label="Choose a reading path">
        <a href="#engineering-notes">
          <span className="atlas-meta">01 / Engineering</span>
          <strong>Understand the decisions.</strong>
          <span>Architecture, code and the reasoning behind them. ↘</span>
        </a>
        <a href="#practical-guides">
          <span className="atlas-meta">02 / Out in the field</span>
          <strong>Keep working, wherever you are.</strong>
          <span>Connectivity, preparation and life on the road. ↘</span>
        </a>
      </nav>
      <div id="engineering-notes" className="mt-12 scroll-mt-24">
        <div className="writing-index-grid">
          <div>
            <p className="atlas-meta">
              Engineering / {entries.length} published{" "}
              {entries.length === 1 ? "essay" : "essays"}
            </p>
            <p className="mt-4 text-paper/65 leading-relaxed">
              A quieter place to follow an idea all the way through.
            </p>
          </div>
          <div>
            {pageEntries.map(({ frontmatter: f, body }) => (
              <Link
                key={f.slug}
                href={`/writing/${f.slug}`}
                className="dispatch-link"
              >
                <p className="atlas-meta">
                  {f.date} / {readingTimeMinutes(body)} min read
                </p>
                <h2 className="font-display text-3xl my-5">{f.title} ↗</h2>
                <p className="atlas-description">{f.summary}</p>
                <p className="atlas-meta mt-6">{f.tags.join(" / ")}</p>
              </Link>
            ))}
          </div>
        </div>
        <PaginationLinks
          basePath="/writing"
          itemCount={entries.length}
          currentPage={1}
        />
        <nav className="topic-links" aria-label="Writing topics">
          {[...new Set(entries.flatMap((e) => e.frontmatter.tags))].map(
            (tag) => (
              <Link
                key={tag}
                href={`/writing/tags/${tag.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {tag} ↗
              </Link>
            ),
          )}
        </nav>
      </div>
      <section
        id="practical-guides"
        className="editorial-section mt-16 scroll-mt-24"
      >
        <div className="section-topline">
          <div>
            <p className="atlas-meta">Practical knowledge / Out in the field</p>
            <h2>
              Keep building.
              <br />
              Wherever you are.
            </h2>
          </div>
          <Link className="atlas-button" href="/field-notes#field-guides">
            All field guides ↗
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {guides.map(({ frontmatter: f }) => (
            <Link
              key={f.slug}
              href={`/field-notes/${f.slug}`}
              className="dispatch-link"
            >
              <span className="atlas-meta">Field guide</span>
              <h3>{f.title} ↗</h3>
              <p className="text-sm text-paper/65 leading-relaxed">
                {f.summary}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </Container>
  );
}
