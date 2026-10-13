import Image from "next/image";
import Link from "next/link";
import { HeroArt } from "@/components/hero/HeroArt";
import { HighlightStrip } from "@/components/home/HighlightStrip";
import { SubscribeCtas } from "@/components/home/SubscribeCtas";
import { WorkProjectCard } from "@/components/work/WorkProjectCard";
import { VideoCard } from "@/components/video/VideoCard";
import { ProjectCard } from "@/components/content/ProjectCard";
import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { Section } from "@/components/ui/Section";
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

      <Container className="py-12">
        <HighlightStrip stats={stats} />
      </Container>

      <Container>
        {videos.length > 0 ? (
          <Section eyebrow="YOUTUBE" title="Latest videos ↗">
            <div className="grid gap-6 md:grid-cols-3">
              {videos.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
            <Link
              href="/videos"
              className="mt-8 inline-block font-mono text-xs uppercase tracking-widest text-lime hover:underline"
            >
              All videos →
            </Link>
          </Section>
        ) : null}

        <Section eyebrow="01 / PROJECTS" title="Featured open source ↗">
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((entry) => (
              <WorkProjectCard key={entry.frontmatter.slug} entry={entry.frontmatter} />
            ))}
          </div>
          <Link
            href="/work"
            className="mt-8 inline-block font-mono text-xs uppercase tracking-widest text-lime hover:underline"
          >
            All projects →
          </Link>
        </Section>

        <Section eyebrow="02 / TRAVEL" title="Latest from the field ↗">
          <div className="grid gap-6 md:grid-cols-2">
            {latestTravel.map((entry) => (
              <ProjectCard
                key={entry.frontmatter.slug}
                entry={entry.frontmatter}
                hrefPrefix="/field-notes"
              />
            ))}
          </div>
          <Link
            href="/field-notes"
            className="mt-8 inline-block font-mono text-xs uppercase tracking-widest text-lime hover:underline"
          >
            Travel stories →
          </Link>
        </Section>
      </Container>
    </>
  );
}
