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
    <span ref={ref} className="font-display text-2xl text-lime md:text-3xl">
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
      <CountValue value={value} />
      <span className="mt-1 font-mono text-xs uppercase tracking-widest text-paper/60">
        {label}
      </span>
    </>
  );
  if (href) {
    return (
      <Link
        href={href}
        className="flex flex-col border border-paper/10 bg-elevated/50 px-6 py-4 transition hover:border-lime/40"
      >
        {inner}
      </Link>
    );
  }
  return (
    <div className="flex flex-col border border-paper/10 bg-elevated/50 px-6 py-4">
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
