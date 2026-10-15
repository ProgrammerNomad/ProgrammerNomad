import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import Image from "next/image";
import Link from "next/link";
import { Prose } from "@/components/ui/Prose";
import { PhotoGallery as EditorialGallery } from "@/components/content/PhotoGallery";
import {
  CompanyCards,
  PressKitBlock,
  SkillsGrid,
} from "@/components/about/AboutSections";
import { LifeTimeline, type LifeEvent } from "@/components/about/LifeTimeline";
import { getPageEntry } from "@/lib/content/loader";
import { renderMdx } from "@/lib/content/mdx";
import { indexPageMetadata } from "@/lib/seo/metadata";

export const metadata = indexPageMetadata(
  "About Shiv Singh – Nomad Programmer",
  "Story, timeline, skills, and press kit for Shiv Singh - Nomad Programmer.",
  "/about",
);

async function loadJson<T>(file: string): Promise<T> {
  const raw = await fs.readFile(
    path.join(process.cwd(), "content", "about", file),
    "utf8",
  );
  return JSON.parse(raw) as T;
}

export default async function AboutPage() {
  const page = await getPageEntry("about");
  if (!page) notFound();
  const body = await renderMdx(page.body);

  const [timeline, skills, life] = await Promise.all([
    loadJson<{ year: string; title: string; description: string }[]>(
      "timeline.json",
    ),
    loadJson<{ name: string; category: string }[]>("skills.json"),
    loadJson<LifeEvent[]>("life-events.json"),
  ]);

  const gallery = [
    { src: "/images/shiv-singh.jpg", alt: "Shiv Singh - Nomad Programmer" },
    {
      src: "/images/travel/rishikesh-2026/cover.jpg",
      alt: "Rishikesh Himalayan river expedition",
    },
    {
      src: "/images/travel/madhmaheshwar/cover.jpg",
      alt: "Madhmaheshwar high altitude trail",
    },
    {
      src: "/images/travel/pangi-lahaul-2026/cover.jpg",
      alt: "Pangi Valley high mountain pass",
    },
  ];

  return (
    <Container className="py-16 md:py-24">
      <header className="about-opening">
        <div>
          <p className="atlas-meta">Identity / Shiv Singh</p>
          <h1>
            One life.
            <br />
            Two perspectives.
          </h1>
          <p className="atlas-description mt-6">
            Software engineer. Open-source builder. Traveler with a story to
            share.
          </p>
          <Link href="/contact" className="atlas-button mt-8">
            Let&apos;s talk ↗
          </Link>
        </div>
        <span className="atlas-index about-opening-index" aria-hidden="true">
          06
        </span>
        <figure>
          <Image
            src="/images/shiv-singh.jpg"
            alt="Shiv Singh, Nomad Programmer"
            width={2316}
            height={3088}
            sizes="(max-width:700px) calc(100vw - 32px), (max-width:1152px) 44vw, 480px"
            priority
            className="about-portrait"
          />
          <figcaption className="atlas-meta mt-4">
            Shiv Singh / Nomad Programmer
          </figcaption>
        </figure>
      </header>
      <section className="about-story editorial-section">
        <h2>
          Tech by profession.
          <br />
          Traveler by soul.
        </h2>
        <Prose>{body}</Prose>
      </section>

      <section className="mt-16">
        <p className="atlas-meta mb-4">The path so far / Life &amp; work</p>
        <h2 className="font-display text-4xl text-paper">
          Every chapter leaves a mark.
        </h2>
        <div className="mt-8">
          <LifeTimeline
            items={[
              ...life,
              ...timeline.map((event, i) => ({
                ...event,
                kind: ["code", "business", "film", "leadership"][i],
                chapter: "Building a career",
                href: [
                  "/work",
                  "https://srapsware.com",
                  "/videos",
                  "https://mobrilz.com",
                ][i],
              })),
            ]}
          />
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl text-paper">
          Companies & open source
        </h2>
        <div className="mt-8">
          <CompanyCards />
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl text-paper">Skills & stack</h2>
        <div className="mt-6">
          <SkillsGrid skills={skills} />
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl text-paper">Photos</h2>
        <div className="mt-6">
          <EditorialGallery photos={gallery.slice(1)} />
        </div>
      </section>

      <section className="mt-16">
        <PressKitBlock />
      </section>
    </Container>
  );
}
