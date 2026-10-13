"use client";

import Link from "next/link";
import { useInView, useMotionValueEvent, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef } from "react";
import type { HighlightStats } from "@/lib/stats/highlights";
import { SOCIAL } from "@/lib/seo/site-config";

function CountValue({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const reduced = useReducedMotion();
  const spring = useSpring(0, { stiffness: 90, damping: 18 });

  useMotionValueEvent(spring, "change", (latest) => {
    if (ref.current) {
      ref.current.textContent = String(Math.round(latest));
    }
  });

  useEffect(() => {
    if (!inView) return;
    spring.set(value);
  }, [inView, spring, value]);

  return (
    <span
      ref={ref}
      className="font-display text-3xl font-bold text-lime text-glow-lime md:text-4xl"
    >
      {reduced ? value : 0}
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
