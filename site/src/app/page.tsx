import { SectionLink, SectionTextLink } from "@/components/ui/SectionLink";
import { SectionLinkRow } from "@/components/ui/SectionLinkRow";
import { HomeOpening } from "@/components/home/HomeOpening";
import styles from "@/components/home/HomeOpening.module.css";
import { HighlightStrip } from "@/components/home/HighlightStrip";
import { WorkProjectCard } from "@/components/work/WorkProjectCard";
import { VideoCard } from "@/components/video/VideoCard";
import { ProjectCard } from "@/components/content/ProjectCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  MotionSection,
  MotionStaggerGrid,
  MotionStaggerItem,
} from "@/components/ui/MotionReveal";
import { getAllEntries } from "@/lib/content/loader";
import { getHighlightStats } from "@/lib/stats/highlights";
import { getTravelDestinations } from "@/lib/travel/merge-places";
import { fetchChannelVideos } from "@/lib/youtube/rss";
import type { WorkFrontmatter } from "@/lib/validation/schemas";

export default async function HomePage() {
  const [stats, work, fieldNotes, videos, destinations] = await Promise.all([
    getHighlightStats(),
    getAllEntries<WorkFrontmatter>("work"),
    getAllEntries("field-notes"),
    fetchChannelVideos(3),
    getTravelDestinations(),
  ]);

  const featured = work.filter((w) => w.frontmatter.featured).slice(0, 3);
  const GUIDE_SLUGS = new Set(["nomad-remote-work"]);
  const latestTravel = fieldNotes
    .filter(
      (e) =>
        !e.frontmatter.tags.includes("Field Guide") &&
        !GUIDE_SLUGS.has(e.frontmatter.slug),
    )
    .slice(0, 2);

  return (
    <div className={styles.home}>
      <HomeOpening destinations={destinations} />

      <MotionSection>
        <Container id="home-highlights" className="scroll-mt-20 py-12">
          <HighlightStrip stats={stats} />
        </Container>
      </MotionSection>

      <Container>
        {videos.length > 0 ? (
          <MotionSection>
            <Section eyebrow="YOUTUBE" title="Latest videos ↗">
              <MotionStaggerGrid className="grid gap-6 md:grid-cols-3">
                {videos.map((v) => (
                  <MotionStaggerItem key={v.id}>
                    <VideoCard video={v} />
                  </MotionStaggerItem>
                ))}
              </MotionStaggerGrid>
              <SectionLinkRow>
                <SectionLink href="/videos" inline>
                  All videos →
                </SectionLink>
              </SectionLinkRow>
            </Section>
          </MotionSection>
        ) : null}

        <MotionSection>
          <Section eyebrow="01 / PROJECTS" title="Featured open source ↗">
            <MotionStaggerGrid className="grid gap-6 md:grid-cols-3">
              {featured.map((entry) => (
                <MotionStaggerItem key={entry.frontmatter.slug}>
                  <WorkProjectCard entry={entry.frontmatter} />
                </MotionStaggerItem>
              ))}
            </MotionStaggerGrid>
            <SectionLinkRow>
              <SectionLink href="/work" inline>
                All projects →
              </SectionLink>
            </SectionLinkRow>
          </Section>
        </MotionSection>

        <MotionSection>
          <Section eyebrow="02 / TRAVEL" title="Latest from the field ↗">
            <MotionStaggerGrid className="grid gap-6 md:grid-cols-2">
              {latestTravel.map((entry) => (
                <MotionStaggerItem key={entry.frontmatter.slug}>
                  <ProjectCard
                    entry={entry.frontmatter}
                    hrefPrefix="/field-notes"
                  />
                </MotionStaggerItem>
              ))}
            </MotionStaggerGrid>
            <SectionLinkRow>
              <SectionLink href="/field-notes" inline>
                All travel stories →
              </SectionLink>
              <SectionTextLink href="/field-notes#field-guides">
                Developer field guides
              </SectionTextLink>
            </SectionLinkRow>
          </Section>
        </MotionSection>
      </Container>
    </div>
  );
}
