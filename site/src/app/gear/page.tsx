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
                className="rounded-xl border border-paper/10 bg-elevated/50 p-5"
              >
                <h3 className="font-display text-lg text-lime">{item.name}</h3>
                <p className="mt-2 text-sm text-paper/70">{item.description}</p>
                {item.affiliateUrl ? (
                  <Link
                    href={item.affiliateUrl}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="mt-3 inline-block font-mono text-xs uppercase tracking-widest text-paper/80 hover:text-lime"
                  >
                    View product →
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
