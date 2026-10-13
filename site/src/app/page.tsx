import Image from "next/image";
import Link from "next/link";
import { HomeOpening } from "@/components/home/HomeOpening";
import styles from "@/components/home/HomeOpening.module.css";
import { HighlightStrip } from "@/components/home/HighlightStrip";
import { WorkProjectCard } from "@/components/work/WorkProjectCard";
import { VideoCard } from "@/components/video/VideoCard";
import { Container } from "@/components/ui/Container";
import { getAllEntries } from "@/lib/content/loader";
import { isFieldGuide } from "@/lib/content/field-guides";
import { getHighlightStats } from "@/lib/stats/highlights";
import { getTravelDestinations } from "@/lib/travel/merge-places";
import { fetchChannelVideos } from "@/lib/youtube/rss";
import type { WorkFrontmatter } from "@/lib/validation/schemas";

export default async function HomePage() {
  const [stats, work, fieldNotes, writing, videos, destinations] =
    await Promise.all([
      getHighlightStats(),
      getAllEntries<WorkFrontmatter>("work"),
      getAllEntries("field-notes"),
      getAllEntries("writing"),
      fetchChannelVideos(3),
      getTravelDestinations(),
    ]);
  const featured = work.filter((w) => w.frontmatter.featured).slice(0, 3);
  const travel = fieldNotes.filter((e) => !isFieldGuide(e.frontmatter));
  const photoStory = travel.find(
    (e) => e.frontmatter.cover && !e.frontmatter.cover.includes("placeholder"),
  );
  const dispatches = [
    ...writing,
    ...fieldNotes.filter((e) => isFieldGuide(e.frontmatter)).slice(0, 2),
  ];

  return (
    <div className={styles.home}>
      <HomeOpening destinations={destinations} />
      <Container id="home-highlights" className="scroll-mt-20 py-12">
        <HighlightStrip stats={stats} />
      </Container>
      <Container>
        <section className="editorial-section">
          <div className="section-topline">
            <div>
              <p className="atlas-meta">01 / The software lab</p>
              <h2>
                Useful things.
                <br />
                Built in the open.
              </h2>
            </div>
            <Link className="atlas-button" href="/work">
              All projects ↗
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map(({ frontmatter }) => (
              <WorkProjectCard key={frontmatter.slug} entry={frontmatter} />
            ))}
          </div>
        </section>
        <section className="editorial-section" data-section="travel">
          <div className="section-topline">
            <div>
              <p className="atlas-meta">02 / Away from the keyboard</p>
              <h2>
                Another road.
                <br />
                Another perspective.
              </h2>
            </div>
            <Link className="atlas-button" href="/field-notes#atlas">
              Open the atlas ↗
            </Link>
          </div>
          <div className="home-travel">
            {photoStory && (
              <Link
                className="home-travel-image"
                href={`/field-notes/${photoStory.frontmatter.slug}`}
                aria-label={`Read ${photoStory.frontmatter.title}`}
              >
                <Image
                  src={photoStory.frontmatter.cover!}
                  alt={photoStory.frontmatter.title}
                  fill
                  sizes="(max-width:700px) 100vw, 650px"
                />
              </Link>
            )}
            <div>
              {travel.slice(0, 3).map(({ frontmatter: f }) => (
                <Link
                  href={`/field-notes/${f.slug}`}
                  className="home-story-row"
                  key={f.slug}
                >
                  <span className="atlas-meta">{f.tags.join(" / ")}</span>
                  <h3>{f.title} ↗</h3>
                  <p className="text-sm leading-relaxed text-paper/65">
                    {f.summary}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className="editorial-section home-writing">
          <div>
            <p className="atlas-meta mb-5">03 / Notes worth sharing</p>
            <h2>
              From the terminal.
              <br />
              From the trail.
            </h2>
            <p className="atlas-description mt-6">
              Architecture notes and practical field guides for a life between
              building software and exploring.
            </p>
            <Link href="/writing" className="atlas-button mt-8">
              Read the notebook ↗
            </Link>
          </div>
          <div>
            {dispatches.map(({ frontmatter: f }) => (
              <Link
                key={f.slug}
                className="dispatch-link"
                href={`/${writing.some((w) => w.frontmatter.slug === f.slug) ? "writing" : "field-notes"}/${f.slug}`}
              >
                <span className="atlas-meta">
                  {f.date} / {isFieldGuide(f) ? "Field guide" : "Engineering"}
                </span>
                <h3>{f.title} ↗</h3>
                <p className="text-sm leading-relaxed text-paper/65">
                  {f.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>
        <section className="editorial-section">
          <div className="section-topline">
            <div>
              <p className="atlas-meta">04 / In motion</p>
              <h2>
                Stories with
                <br />
                the sound on.
              </h2>
            </div>
            <Link href="/videos" className="atlas-button">
              Watch the films ↗
            </Link>
          </div>
          {videos.length ? (
            <div className="grid gap-6 md:grid-cols-3">
              {videos.map((video) => (
                <VideoCard video={video} key={video.id} />
              ))}
            </div>
          ) : (
            <p className="atlas-description">
              Travel films and technical walkthroughs live on{" "}
              <a
                className="text-lime underline"
                href="https://www.youtube.com/@NomadProgrammer"
              >
                YouTube ↗
              </a>
              . The latest feed is temporarily unavailable.
            </p>
          )}
        </section>
        <section className="collab-banner">
          <div>
            <p className="atlas-meta mb-4">
              05 / Let&apos;s make something matter
            </p>
            <h2>
              Your next idea.
              <br />A shared adventure.
            </h2>
          </div>
          <Link href="/contact" className="atlas-button atlas-button--primary">
            Start a conversation ↗
          </Link>
        </section>
      </Container>
    </div>
  );
}
