import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { indexPageMetadata } from "@/lib/seo/metadata";
import Image from "next/image";
import { Camera, Code2, Laptop } from "lucide-react";
import { AtlasHeading } from "@/components/ui/AtlasHeading";
import { PackingChecklist } from "@/components/gear/PackingChecklist";

export const metadata = indexPageMetadata(
  "Gear & Tools – Nomad Programmer",
  "Laptop, cameras, software, and editing tools for coding and travel filmmaking.",
  "/gear",
);

type GearItem = {
  category: string;
  name: string;
  description: string;
  affiliateUrl: string | null;
  image?: string;
};

export default async function GearPage() {
  const raw = await fs.readFile(
    path.join(process.cwd(), "content", "gear", "items.json"),
    "utf8",
  );
  const items = JSON.parse(raw) as GearItem[];

  const byCategory = items.reduce<Record<string, GearItem[]>>((acc, item) => {
    acc[item.category] ??= [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <Container className="py-16 md:py-24">
      <AtlasHeading
        index="05"
        eyebrow="The field kit / Gear & tools"
        title="Build. Capture. Carry on."
        description="The tools behind coding days and travel films. Organized around what each one helps me do."
      />
      <section
        className="kit-workflow"
        aria-label="Coding and filmmaking workflow"
      >
        <div>
          <Code2 aria-hidden="true" />
          <h2>Build</h2>
          <p>Repositories, documentation, a place to focus.</p>
        </div>
        <span aria-hidden="true">→</span>
        <div>
          <Camera aria-hidden="true" />
          <h2>Capture</h2>
          <p>Bring back the details of a place.</p>
        </div>
        <span aria-hidden="true">→</span>
        <div>
          <Laptop aria-hidden="true" />
          <h2>Edit &amp; share</h2>
          <p>Turn raw material into a story.</p>
        </div>
      </section>

      {Object.entries(byCategory).map(([category, list], index) => (
        <section key={category} className="gear-section">
          <div className="gear-section-heading">
            <p className="atlas-meta">
              0{index + 1} / {category}
            </p>
            {category === "Laptop" ? (
              <Laptop size={72} strokeWidth={1} aria-hidden="true" />
            ) : category === "Cameras" ? (
              <Camera size={72} strokeWidth={1} aria-hidden="true" />
            ) : (
              <Code2 size={72} strokeWidth={1} aria-hidden="true" />
            )}
            <h2>
              {category === "Laptop"
                ? "The mobile workspace."
                : category === "Cameras"
                  ? "Bring the story back."
                  : "From raw to ready."}
            </h2>
          </div>
          <ul className="gear-items">
            {list.map((item) => (
              <li key={item.name} className="gear-item group">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={900}
                    height={600}
                    className="w-full h-auto mb-6"
                  />
                )}
                <div className="flex flex-wrap gap-3 items-baseline justify-between">
                  <h3 className="font-display text-lg font-semibold text-lime">
                    {item.name}
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-paper/40">
                    {category}
                  </span>
                </div>
                <p className="mt-2 text-sm text-paper/75 leading-relaxed">
                  {item.description}
                </p>
                {item.affiliateUrl ? (
                  <Link
                    href={item.affiliateUrl}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-lime transition-all group-hover:text-paper"
                  >
                    <span>View product (affiliate)</span>
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
      <PackingChecklist />

      <section className="mt-16 border-t border-paper/10 pt-12">
        <h2 className="font-display text-2xl text-paper">Related guides</h2>
        <ul className="mt-6 space-y-3 text-paper/80">
          <li>
            <Link
              href="/field-notes/nomad-remote-work"
              className="hover:text-lime"
            >
              Working remotely while traveling - complete field guide
            </Link>
          </li>
          <li>
            <Link
              href="/field-notes/developer-internet-backup"
              className="hover:text-lime"
            >
              Internet backup plans for traveling programmers
            </Link>
          </li>
          <li>
            <Link
              href="/field-notes/offline-coding-travel"
              className="hover:text-lime"
            >
              How to code without internet while traveling
            </Link>
          </li>
        </ul>
      </section>
    </Container>
  );
}
