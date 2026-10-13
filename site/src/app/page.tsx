import Link from "next/link";
import { HeroArt } from "@/components/hero/HeroArt";
import { ProjectCard } from "@/components/content/ProjectCard";
import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { Section } from "@/components/ui/Section";
import { getAllEntries } from "@/lib/content/loader";

export default async function HomePage() {
  const [work, writing] = await Promise.all([
    getAllEntries("work"),
    getAllEntries("writing"),
  ]);

  const featuredWork = work.slice(0, 3);
  const latestWriting = writing.slice(0, 3);

  return (
    <>
      <section className="border-b border-paper/10">
        <Container className="grid gap-12 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-24 lg:gap-16">
          <div>
            <MetaLabel>
              NOMAD PROGRAMMER® · DIGITAL PORTFOLIO / 001 · SOFTWARE · SYSTEMS ·
              EXPLORATION
            </MetaLabel>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              <span className="block">I BUILD SYSTEMS.</span>
              <span className="mt-2 block text-paper/90">I EXPLORE WORLDS.</span>
            </h1>
            <p className="mt-6 max-w-prose text-lg text-paper/75">
              An independent engineer exploring the intersection of software,
              infrastructure, artificial intelligence and the world beyond the
              screen.
            </p>
            <MetaLabel className="mt-8">SCROLL TO EXPLORE ↓</MetaLabel>
            <MetaLabel className="mt-2">28° 38&apos; N / DIGITAL SPACE</MetaLabel>
          </div>
          <HeroArt />
        </Container>
      </section>

      <Container>
        <Section eyebrow="01 / ENGINEERING" title="Systems that scale ↗">
          <div className="grid gap-6 md:grid-cols-3">
            {featuredWork.map((entry) => (
              <ProjectCard
                key={entry.frontmatter.slug}
                entry={entry.frontmatter}
                hrefPrefix="/work"
              />
            ))}
          </div>
          <Link
            href="/work"
            className="mt-8 inline-block font-mono text-xs uppercase tracking-widest text-lime hover:underline"
          >
            View all work →
          </Link>
        </Section>

        <Section eyebrow="02 / EXPLORATION" title="Worlds beyond ↗">
          <ul className="space-y-4">
            {latestWriting.map((entry) => (
              <li key={entry.frontmatter.slug}>
                <Link
                  href={`/writing/${entry.frontmatter.slug}`}
                  className="group flex flex-col gap-1 border-b border-paper/10 py-4 sm:flex-row sm:items-baseline sm:justify-between"
                >
                  <span className="font-display text-xl group-hover:text-lime">
                    {entry.frontmatter.title}
                  </span>
                  <MetaLabel>{entry.frontmatter.date}</MetaLabel>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/writing"
            className="mt-8 inline-block font-mono text-xs uppercase tracking-widest text-lime hover:underline"
          >
            Read writing →
          </Link>
        </Section>
      </Container>
    </>
  );
}
