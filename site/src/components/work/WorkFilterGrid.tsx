"use client";

import { useMemo, useState } from "react";
import type { WorkFrontmatter } from "@/lib/validation/schemas";
import { WorkProjectCard } from "@/components/work/WorkProjectCard";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "PHP", "Python", "TypeScript", "IoT"] as const;

export function WorkFilterGrid({ entries }: { entries: WorkFrontmatter[] }) {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");

  const filtered = useMemo(() => {
    if (active === "All") return entries;
    return entries.filter((e) => e.categories.includes(active));
  }, [entries, active]);

  return (
    <div>
      <div className="flex flex-wrap gap-2.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActive(f)}
            className={cn(
              "rounded-lg px-4 py-2 font-mono text-xs uppercase tracking-widest transition-all duration-300",
              active === f
                ? "border border-lime bg-lime/15 text-lime font-bold shadow-[0_0_20px_rgba(181,255,67,0.28)]"
                : "glass-card text-paper/70 hover:border-lime/40 hover:text-white",
            )}
          >
            {f}
          </button>
        ))}
      </div>
      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((entry) => (
            <WorkProjectCard key={entry.slug} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-xl border border-paper/10 bg-elevated/30 p-12 text-center">
          <p className="font-mono text-sm text-lime">
            {"// NO ACTIVE REPOSITORIES FOUND FOR "}[{active}]
          </p>
          <p className="mt-2 text-paper/60 text-sm">
            Try switching to &quot;All&quot; to view the complete catalog.
          </p>
        </div>
      )}
    </div>
  );
}
