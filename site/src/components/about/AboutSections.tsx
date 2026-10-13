import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function Timeline({
  items,
}: {
  items: { year: string; title: string; description: string }[];
}) {
  return (
    <ol className="relative border-l border-lime/30 pl-8 ml-3 space-y-8">
      {items.map((item) => (
        <li key={item.year} className="relative group">
          {/* Glowing node point */}
          <span className="absolute -left-[38px] top-1.5 h-3.5 w-3.5 rounded-full bg-lime border-2 border-canvas shadow-[0_0_12px_#b5ff43] transition-transform duration-300 group-hover:scale-125" />
          <div className="glass-card p-5 transition-all duration-300 hover:border-lime/40 hover:shadow-[0_0_25px_rgba(181,255,67,0.12)]">
            <p className="font-mono text-xs uppercase tracking-widest text-lime font-bold">
              {"// "}{item.year}
            </p>
            <h3 className="mt-1 font-display text-xl text-paper font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-paper/75 leading-relaxed">{item.description}</p>
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
          <h3 className="mt-3 font-display text-xl font-semibold text-paper group-hover:text-white">
            {c.name}
          </h3>
          <p className="mt-2 text-sm text-paper/70 leading-relaxed">{c.blurb}</p>
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
    <div className="flex flex-wrap gap-2.5">
      {skills.map((s) => {
        const cat = s.category?.toLowerCase() ?? "";
        const isBackend = cat.includes("backend") || cat.includes("framework");
        const isDevops = cat.includes("devops") || cat.includes("cloud");
        const isDb = cat.includes("database") || cat.includes("data");
        const colorClass = isBackend
          ? "hover:border-lime/60 hover:text-lime hover:shadow-[0_0_15px_rgba(181,255,67,0.2)]"
          : isDevops
            ? "hover:border-cyan/60 hover:text-[#00d2ff] hover:shadow-[0_0_15px_rgba(0,210,255,0.2)]"
            : isDb
              ? "hover:border-amber/60 hover:text-[#e8b86d] hover:shadow-[0_0_15px_rgba(232,184,109,0.2)]"
              : "hover:border-lime/50 hover:text-white";

        return (
          <span
            key={s.name}
            className={`glass-card inline-flex items-center gap-1.5 px-3.5 py-2 font-mono text-xs uppercase tracking-wider text-paper/85 transition-all duration-200 cursor-default ${colorClass}`}
            title={s.category}
          >
            <span className="h-1 w-1 rounded-full bg-lime/60" />
            {s.name}
          </span>
        );
      })}
    </div>
  );
}

export function PhotoGallery({ images }: { images: { src: string; alt: string }[] }) {
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
      <h2 className="font-display text-2xl text-paper font-semibold">Media / press kit</h2>
      <p className="mt-3 max-w-prose text-paper/75 leading-relaxed">
        Download bio, logo, and headshot for articles and event listings.
      </p>
      <Link
        href="/press-kit/nomad-programmer-press-kit.zip"
        className="btn-glow mt-5 inline-flex items-center gap-2 rounded-lg border border-lime/40 bg-lime/10 px-4 py-2 font-mono text-xs uppercase tracking-widest text-lime transition-all duration-300 hover:bg-lime hover:text-canvas"
      >
        <span>Download press kit (.zip)</span>
        <span>↓</span>
      </Link>
      {children}
    </div>
  );
}
