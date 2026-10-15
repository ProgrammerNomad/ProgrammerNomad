import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Prose } from "@/components/ui/Prose";
import {
  PhotoGallery,
  type GalleryPhoto,
} from "@/components/content/PhotoGallery";
import { ReadingProgress } from "@/components/content/ReadingProgress";
import { ShareButtons, TableOfContents } from "@/components/writing/PostExtras";
import type { FieldNotesFrontmatter } from "@/lib/validation/schemas";
import type { RelatedArticle } from "@/lib/content/related";
import type { TocItem } from "@/lib/content/toc";
import { recordedFact } from "@/lib/travel/story-presentation";
import { RecordedItinerary } from "./RecordedItinerary";

export function TravelStoryLayout({
  entry,
  children,
  photos,
  related,
  toc,
  minutes,
}: {
  entry: FieldNotesFrontmatter;
  children: ReactNode;
  photos: GalleryPhoto[];
  related: RelatedArticle[];
  toc: TocItem[];
  minutes: number;
}) {
  const geo = entry.geo;
  const mapHref = geo
    ? `/field-notes?place=${encodeURIComponent(`${geo.lat.toFixed(2)}:${geo.lng.toFixed(2)}`)}#atlas`
    : "/field-notes#atlas";
  const hasCover = entry.cover && !entry.cover.includes("placeholder");
  return (
    <div className="travel-story" data-section="travel">
      <ReadingProgress />
      <Container className="pt-12 md:pt-20 pb-20">
        <Breadcrumbs
          items={[
            { label: "Journeys", href: "/field-notes" },
            { label: entry.title },
          ]}
        />
        <header className="travel-story-heading">
          <p className="atlas-meta">Field journal / {entry.tags.join(" · ")}</p>
          <h1>{entry.title}</h1>
          <p className="atlas-description">{entry.summary}</p>
          <div className="travel-story-meta">
            <span className="atlas-meta">
              {entry.date} / {minutes} min read
            </span>
            <Link className="atlas-button" href={mapHref}>
              ⌖ Back to this place on the atlas
            </Link>
          </div>
        </header>
        {hasCover ? (
          <figure className="travel-story-cover">
            <Image
              src={entry.cover!}
              alt={entry.title}
              fill
              priority
              sizes="(max-width:1152px) 100vw, 1152px"
              className="object-cover"
            />
            <figcaption>{geo?.label ?? entry.title} / Field journal</figcaption>
          </figure>
        ) : (
          <div className="travel-story-no-photo">
            <span aria-hidden="true">⌖</span>
            <div>
              <p className="atlas-meta">Location record</p>
              <p className="font-display text-2xl mt-2">
                {geo?.label ?? entry.title}
              </p>
              <p className="text-sm text-paper/65 mt-2">
                Photography will join this field note soon.
              </p>
            </div>
          </div>
        )}
        <dl className="travel-facts">
          <div>
            <dt>Recorded route</dt>
            <dd>
              {recordedFact(entry.route) ?? "Route notes not yet recorded."}
            </dd>
          </div>
          <div>
            <dt>Budget from this journal</dt>
            <dd>
              {recordedFact(entry.estimatedCost) ??
                "Trip costs not yet recorded."}
            </dd>
          </div>
          <div>
            <dt>Season noted</dt>
            <dd>
              {recordedFact(entry.bestSeason) ??
                "Season notes not yet recorded."}
            </dd>
          </div>
        </dl>
        <p className="text-xs text-paper/55 mt-4">
          Journal notes reflect this trip, not live prices or current route
          conditions.
        </p>
        <div className="article-columns mt-16">
          <aside>
            <TableOfContents items={toc} />
            <div className="mt-6">
              <ShareButtons
                title={entry.title}
                path={`/field-notes/${entry.slug}`}
              />
            </div>
          </aside>
          <div data-reading-body className="min-w-0">
            <RecordedItinerary route={entry.route} />
            <Prose>{children}</Prose>
          </div>
        </div>
        {photos.length > 0 && (
          <section className="editorial-section mt-16" id="photo-journal">
            <div className="section-topline">
              <div>
                <p className="atlas-meta">
                  Through the lens / {photos.length} frames
                </p>
                <h2>The photo journal.</h2>
              </div>
              <p className="text-sm text-paper/65">
                Open a frame to explore.
                <br />
                Arrow keys move between photographs.
              </p>
            </div>
            <PhotoGallery photos={photos} />
          </section>
        )}
        {entry.youtubeVideoId && (
          <section className="editorial-section">
            <h2>From the same journey.</h2>
            <a
              className="atlas-button mt-6"
              href={`https://www.youtube.com/watch?v=${entry.youtubeVideoId}`}
            >
              Watch the film on YouTube ↗
            </a>
          </section>
        )}
        <section className="editorial-section mt-12">
          <div className="section-topline">
            <div>
              <p className="atlas-meta">Keep exploring</p>
              <h2>Another path awaits.</h2>
            </div>
            <Link href={mapHref} className="atlas-button">
              Return to the atlas ↗
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((r) => (
              <Link key={r.href} href={r.href} className="dispatch-link">
                <span className="atlas-meta">
                  {r.href.startsWith("/writing") ? "Writing" : "Field notes"}
                </span>
                <h3>{r.title} ↗</h3>
              </Link>
            ))}
          </div>
          <Link href="/field-notes#field-guides" className="atlas-button mt-8">
            Remote-work field guides ↗
          </Link>
        </section>
      </Container>
    </div>
  );
}
