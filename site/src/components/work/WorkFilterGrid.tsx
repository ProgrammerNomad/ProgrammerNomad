"use client";

import { useMemo, useState } from "react";
import type { WorkFrontmatter } from "@/lib/validation/schemas";
import { WorkProjectCard } from "@/components/work/WorkProjectCard";

const FILTERS = ["All", "PHP", "Python", "TypeScript", "IoT"] as const;

export function WorkFilterGrid({ entries }: { entries: WorkFrontmatter[] }) {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return entries.filter(
      (e) =>
        (active === "All" || e.categories.includes(active)) &&
        `${e.title} ${e.summary} ${e.tech.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase().trim()),
    );
  }, [entries, active, query]);

  return (
    <div>
      <label htmlFor="project-search" className="atlas-meta">
        Find a tool
      </label>
      <input
        id="project-search"
        type="search"
        className="atlas-input mt-2 mb-6 max-w-md"
        placeholder="Search by name or technology"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="flex flex-wrap gap-2.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={active === f}
            onClick={() => setActive(f)}
            className="filter-chip"
          >
            {f}
          </button>
        ))}
      </div>
      <p className="atlas-meta mt-5" role="status">
        {filtered.length} projects in view
      </p>
      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((entry) => (
            <WorkProjectCard key={entry.slug} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-xl border border-paper/10 bg-elevated/30 p-12 text-center">
          <p className="font-mono text-sm text-lime">
            No projects match this search.
          </p>
          <button
            type="button"
            className="atlas-button mt-5"
            onClick={() => {
              setQuery("");
              setActive("All");
            }}
          >
            Reset filters
          </button>
          <p className="mt-2 text-paper/60 text-sm">
            Try switching to &quot;All&quot; to view the complete catalog.
          </p>
        </div>
      )}
    </div>
  );
}
