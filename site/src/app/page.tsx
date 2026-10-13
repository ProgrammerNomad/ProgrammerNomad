import Image from "next/image";
import { SectionLink } from "@/components/ui/SectionLink";
import { HeroArt } from "@/components/hero/HeroArt";
import { HighlightStrip } from "@/components/home/HighlightStrip";
import { SubscribeCtas } from "@/components/home/SubscribeCtas";
import { WorkProjectCard } from "@/components/work/WorkProjectCard";
import { VideoCard } from "@/components/video/VideoCard";
import { ProjectCard } from "@/components/content/ProjectCard";
import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { Section } from "@/components/ui/Section";
import {
  MotionSection,
  MotionStaggerGrid,
  MotionStaggerItem,
} from "@/components/ui/MotionReveal";
import { getAllEntries } from "@/lib/content/loader";
import { getHighlightStats } from "@/lib/stats/highlights";
import { SITE_TAGLINE } from "@/lib/seo/site-config";
import { fetchChannelVideos } from "@/lib/youtube/rss";
import type { WorkFrontmatter } from "@/lib/validation/schemas";

export default async function HomePage() {
  const [stats, work, fieldNotes, videos] = await Promise.all([
    getHighlightStats(),
    getAllEntries<WorkFrontmatter>("work"),
    getAllEntries("field-notes"),
    fetchChannelVideos(3),
  ]);

  const featured = work.filter((w) => w.frontmatter.featured).slice(0, 3);
  const latestTravel = fieldNotes.slice(0, 2);

  return (
    <>
      <section className="border-b border-paper/10">
        <Container className="grid gap-12 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-24 lg:gap-16">
          <div>
            <MetaLabel>NOMAD PROGRAMMER® · DIGITAL PORTFOLIO</MetaLabel>
            <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-start">
              <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border border-paper/15">
                <Image
                  src="/images/shiv-singh.svg"
                  alt="Shiv Singh"
                  fill
                  className="object-cover"
                  priority
                  sizes="128px"
                />
              </div>
              <div>
                <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
                  Nomad Programmer
                </h1>
                <p className="mt-4 text-xl text-lime md:text-2xl">{SITE_TAGLINE}</p>
                <p className="mt-4 max-w-prose text-lg text-paper/75">
                  Shiv Singh - CTO at Mobrilz, 15+ years building software, open
                  source, and travel content.
                </p>
                <div className="mt-8">
                  <SubscribeCtas />
                </div>
              </div>
            </div>
          </div>
          <HeroArt />
        </Container>
      </section>

      <MotionSection>
        <Container className="py-12">
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
              <SectionLink href="/videos">All videos →</SectionLink>
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
            <SectionLink href="/work">All projects →</SectionLink>
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
            <div className="mt-8 flex flex-wrap gap-6">
              <SectionLink href="/field-notes">Travel stories →</SectionLink>
              <SectionLink href="/field-notes/nomad-remote-work" className="mt-0">
                Developer field guide →
              </SectionLink>
            </div>
          </Section>
        </MotionSection>
      </Container>
    </>
  );
}
