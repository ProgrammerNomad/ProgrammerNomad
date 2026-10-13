import Image from "next/image";
import {
  SectionLink,
  SectionTextLink,
} from "@/components/ui/SectionLink";
import { SectionLinkRow } from "@/components/ui/SectionLinkRow";
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
  const GUIDE_SLUGS = new Set(["nomad-remote-work"]);
  const latestTravel = fieldNotes
    .filter(
      (e) =>
        !e.frontmatter.tags.includes("Field Guide") &&
        !GUIDE_SLUGS.has(e.frontmatter.slug),
    )
    .slice(0, 2);

  return (
    <>
      <section className="relative border-b border-paper/10 overflow-hidden">
        <div className="mx-auto w-full max-w-[1750px] px-6 py-12 sm:px-8 md:py-16 lg:px-12 xl:px-16">
          <div className="grid gap-12 items-center lg:grid-cols-[1fr_1.35fr] xl:grid-cols-[1fr_1.45fr]">
            <div className="z-10 max-w-xl">
              <MetaLabel>NOMAD PROGRAMMER® · DIGITAL PORTFOLIO</MetaLabel>
              <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-start">
                <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-2 border-lime/40 shadow-[0_0_25px_rgba(181,255,67,0.25)] transition-transform duration-300 hover:scale-105">
                  <Image
                    src="/images/shiv-singh.jpg"
                    alt="Shiv Singh - Nomad Programmer"
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
            <div className="w-full flex justify-center lg:justify-end">
              <HeroArt />
            </div>
          </div>
        </div>
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
    </>
  );
}
