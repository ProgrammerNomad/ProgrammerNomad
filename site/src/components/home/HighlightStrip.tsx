"use client";

import Link from "next/link";
import type { HighlightStats } from "@/lib/stats/highlights";
import { SOCIAL } from "@/lib/seo/site-config";

// Stable values are readable before hydration and never animate against a motion preference.
function CountValue({ value }: { value: number }) {
  return (
    <span className="font-display text-3xl font-bold text-lime text-glow-lime md:text-4xl">
      {value}
    </span>
  );
}

function Stat({
  label,
  value,
  href,
}: {
  label: string;
  value: number | null;
  href?: string;
}) {
  if (value === null) return null;
  const inner = (
    <>
      <div className="flex items-center justify-between">
        <CountValue value={value} />
        <span className="h-1.5 w-1.5 rounded-full bg-lime/60 opacity-0 transition group-hover:opacity-100 group-hover:shadow-[0_0_8px_#b5ff43]" />
      </div>
      <span className="mt-2 font-mono text-xs uppercase tracking-widest text-paper/65 transition group-hover:text-paper/90">
        {label}
      </span>
    </>
  );
  if (href) {
    return (
      <Link
        href={href}
        className="glass-card group flex flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:border-lime/50 hover:shadow-[0_0_30px_rgba(181,255,67,0.18)]"
      >
        {inner}
      </Link>
    );
  }
  return (
    <div className="glass-card group flex flex-col p-6 transition-all duration-300">
      {inner}
    </div>
  );
}

export function HighlightStrip({ stats }: { stats: HighlightStats }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      <Stat label="YouTube videos" value={stats.youtubeVideos} href="/videos" />
      <Stat
        label="GitHub repos"
        value={stats.githubRepos}
        href={SOCIAL.github}
      />
      <Stat
        label="Places traveled"
        value={stats.placesTraveled}
        href="/field-notes#travel-map"
      />
    </div>
  );
}
