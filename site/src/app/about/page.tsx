import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import {
  CompanyCards,
  PhotoGallery,
  PressKitBlock,
  SkillsGrid,
  Timeline,
} from "@/components/about/AboutSections";
import { getPageEntry } from "@/lib/content/loader";
import { renderMdx } from "@/lib/content/mdx";
import { indexPageMetadata } from "@/lib/seo/metadata";

export const metadata = indexPageMetadata(
  "About Shiv Singh – Nomad Programmer",
  "Story, timeline, skills, and press kit for Shiv Singh - Nomad Programmer.",
  "/about",
);

async function loadJson<T>(file: string): Promise<T> {
  const raw = await fs.readFile(path.join(process.cwd(), "content", "about", file), "utf8");
  return JSON.parse(raw) as T;
}

export default async function AboutPage() {
  const page = await getPageEntry("about");
  if (!page) notFound();
  const body = await renderMdx(page.body);

  const [timeline, skills] = await Promise.all([
    loadJson<{ year: string; title: string; description: string }[]>("timeline.json"),
    loadJson<{ name: string; category: string }[]>("skills.json"),
  ]);

  const gallery = [
    { src: "/images/shiv-singh.svg", alt: "Shiv Singh headshot placeholder" },
    { src: "/images/travel/placeholder.svg", alt: "Travel placeholder" },
  ];

  return (
    <Container className="py-16 md:py-24">
      <MetaLabel>IDENTITY / ABOUT</MetaLabel>
      <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
        About Shiv Singh
      </h1>
      <div className="mt-12 max-w-prose">{body}</div>

      <section className="mt-16">
        <h2 className="font-display text-2xl text-paper">Timeline</h2>
        <div className="mt-8">
          <Timeline items={timeline} />
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl text-paper">Companies</h2>
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
          <PhotoGallery images={gallery} />
        </div>
      </section>

      <section className="mt-16">
        <PressKitBlock />
      </section>
    </Container>
  );
}
