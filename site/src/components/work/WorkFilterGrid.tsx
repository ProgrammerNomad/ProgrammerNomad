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
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActive(f)}
            className={cn(
              "rounded-md border px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition",
              active === f
                ? "border-lime bg-lime/10 text-lime"
                : "border-paper/15 text-paper/70 hover:border-paper/30",
            )}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((entry) => (
          <WorkProjectCard key={entry.slug} entry={entry} />
        ))}
      </div>
    </div>
  );
}
