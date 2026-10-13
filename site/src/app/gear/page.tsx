import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { indexPageMetadata } from "@/lib/seo/metadata";

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
      <MetaLabel>GEAR / USES</MetaLabel>
      <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
        Gear & tools
      </h1>
      <p className="mt-4 max-w-prose text-paper/70">
        What I travel and work with - from dev laptop to cameras and editing
        software. Affiliate links marked where present.
      </p>

      {Object.entries(byCategory).map(([category, list]) => (
        <section key={category} className="mt-12">
          <h2 className="font-display text-2xl text-paper">{category}</h2>
          <ul className="mt-6 space-y-4">
            {list.map((item) => (
              <li
                key={item.name}
                className="glass-card group p-6 transition-all duration-300 hover:border-lime/40 hover:shadow-[0_0_25px_rgba(181,255,67,0.12)] hover:-translate-y-0.5"
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-semibold text-lime text-glow-lime">
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
                    className="mt-4 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-lime transition-all group-hover:text-white"
                  >
                    <span>View product</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="mt-16 border-t border-paper/10 pt-12">
        <h2 className="font-display text-2xl text-paper">Related guides</h2>
        <ul className="mt-6 space-y-3 text-paper/80">
          <li>
            <Link href="/field-notes/nomad-remote-work" className="hover:text-lime">
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
            <Link href="/field-notes/offline-coding-travel" className="hover:text-lime">
              How to code without internet while traveling
            </Link>
          </li>
        </ul>
      </section>
    </Container>
  );
}
