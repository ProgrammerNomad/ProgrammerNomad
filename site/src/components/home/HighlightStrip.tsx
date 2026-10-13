import Link from "next/link";
import type { HighlightStats } from "@/lib/stats/highlights";
import { SOCIAL } from "@/lib/seo/site-config";

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
      <span className="font-display text-2xl text-lime md:text-3xl">{value}</span>
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
