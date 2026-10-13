import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function Timeline({
  items,
}: {
  items: { year: string; title: string; description: string }[];
}) {
  return (
    <ol className="relative border-l border-paper/15 pl-8">
      {items.map((item) => (
        <li key={item.year} className="mb-10 last:mb-0">
          <span className="absolute -left-3 mt-1.5 h-2.5 w-2.5 rounded-full bg-lime" />
          <p className="font-mono text-xs uppercase tracking-widest text-lime">
            {item.year}
          </p>
          <h3 className="mt-1 font-display text-xl text-paper">{item.title}</h3>
          <p className="mt-2 text-paper/70">{item.description}</p>
        </li>
      ))}
    </ol>
  );
}

export function CompanyCards() {
  const companies = [
    {
      name: "Mobrilz",
      role: "CTO",
      href: "https://mobrilz.com",
      blurb: "Product engineering and platform leadership.",
    },
    {
      name: "JodKit",
      role: "Open source",
      href: "https://github.com/ProgrammerNomad/JodKit",
      blurb: "Modular Laravel starter kit for teams.",
    },
    {
      name: "Srapsware",
      role: "Founder",
      href: "https://srapsware.com",
      blurb: "Software consultancy and delivery.",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {companies.map((c) => (
        <Link
          key={c.name}
          href={c.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl border border-paper/10 bg-elevated/50 p-5 transition hover:border-lime/40"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-lime">
            {c.role}
          </p>
          <h3 className="mt-2 font-display text-xl">{c.name}</h3>
          <p className="mt-2 text-sm text-paper/70">{c.blurb}</p>
        </Link>
      ))}
    </div>
  );
}

export function SkillsGrid({
  skills,
}: {
  skills: { name: string; category: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((s) => (
        <span
          key={s.name}
          className="rounded-md border border-paper/10 px-3 py-2 font-mono text-xs uppercase tracking-wider text-paper/80"
          title={s.category}
        >
          {s.name}
        </span>
      ))}
    </div>
  );
}

export function PhotoGallery({ images }: { images: { src: string; alt: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {images.map((img) => (
        <div
          key={img.src}
          className="relative aspect-[4/3] overflow-hidden rounded-xl border border-paper/10"
        >
          <Image src={img.src} alt={img.alt} fill className="object-cover" />
        </div>
      ))}
    </div>
  );
}

export function PressKitBlock({ children }: { children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-paper/10 bg-elevated/50 p-6">
      <h2 className="font-display text-2xl text-paper">Media / press kit</h2>
      <p className="mt-3 max-w-prose text-paper/70">
        Download bio, logo, and headshot for articles and event listings.
      </p>
      <Link
        href="/press-kit/nomad-programmer-press-kit.zip"
        className="mt-4 inline-block font-mono text-xs uppercase tracking-widest text-lime hover:underline"
      >
        Download press kit (.zip)
      </Link>
      {children}
    </div>
  );
}
