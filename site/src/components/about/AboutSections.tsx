import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function Timeline({
  items,
}: {
  items: { year: string; title: string; description: string }[];
}) {
  return (
    <ol className="editorial-timeline">
      {items.map((item) => (
        <li key={item.year}>
          <p className="timeline-year">{item.year}</p>
          <div>
            <h3 className="mt-1 font-display text-xl text-paper font-semibold">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-paper/75 leading-relaxed">
              {item.description}
            </p>
          </div>
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
          className="glass-card group block p-6 transition-all duration-300 hover:-translate-y-1 hover:border-lime/50 hover:shadow-[0_0_30px_rgba(181,255,67,0.18)]"
        >
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs uppercase tracking-widest text-lime font-bold">
              {c.role}
            </p>
            <span className="font-mono text-xs text-paper/40 transition group-hover:text-lime group-hover:translate-x-0.5">
              ↗
            </span>
          </div>
          <h3 className="mt-3 font-display text-xl font-semibold text-paper group-hover:text-lime">
            {c.name}
          </h3>
          <p className="mt-2 text-sm text-paper/70 leading-relaxed">
            {c.blurb}
          </p>
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
  const projects: Record<string, string> = {
    Laravel: "/work/jodkit",
    "Next.js": "/work/indian-railway-station-search",
    Python: "/work/dashpix",
    TypeScript: "/work/likhaeditor",
    IoT: "/work/dashpix",
    "Raspberry Pi": "/work/dashpix",
  };
  return (
    <div className="skill-groups">
      {[...new Set(skills.map((s) => s.category))].map((category) => (
        <section key={category}>
          <h3 className="atlas-meta">{category}</h3>
          <ul>
            {skills
              .filter((s) => s.category === category)
              .map((s) => (
                <li key={s.name}>
                  {projects[s.name] ? (
                    <Link href={projects[s.name]}>
                      {s.name} <span aria-hidden="true">↗</span>
                    </Link>
                  ) : (
                    s.name
                  )}
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function PhotoGallery({
  images,
}: {
  images: { src: string; alt: string }[];
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {images.map((img) => (
        <div
          key={img.src}
          className="glass-card group relative aspect-[4/3] overflow-hidden transition-all duration-300 hover:border-lime/40 hover:shadow-[0_0_30px_rgba(181,255,67,0.15)]"
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-canvas/80 via-transparent to-transparent pointer-events-none" />
        </div>
      ))}
    </div>
  );
}

export function PressKitBlock({ children }: { children?: ReactNode }) {
  return (
    <div className="glass-card p-8 border border-lime/20 shadow-[0_0_30px_rgba(181,255,67,0.08)]">
      <h2 className="font-display text-2xl text-paper font-semibold">
        Media / press kit
      </h2>
      <p className="mt-3 max-w-prose text-paper/75 leading-relaxed">
        Need a biography or brand assets for an article, event, or
        collaboration? Get in touch. A current portrait is available below.
      </p>
      <a
        href="/images/shiv-singh.jpg"
        download="shiv-singh.jpg"
        className="btn-glow mt-5 inline-flex items-center gap-2 rounded-lg border border-lime/40 bg-lime/10 px-4 py-2 font-mono text-xs uppercase tracking-widest text-lime transition-all duration-300 hover:bg-lime hover:text-canvas"
      >
        <span>Download portrait</span>
        <span>↓</span>
      </a>
      <Link href="/contact" className="atlas-button ml-0 sm:ml-4 mt-5">
        Request media kit ↗
      </Link>
      {children}
    </div>
  );
}
