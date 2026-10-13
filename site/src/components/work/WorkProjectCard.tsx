import Link from "next/link";
import { MetaLabel } from "@/components/ui/MetaLabel";
import type { WorkFrontmatter } from "@/lib/validation/schemas";
import { cn } from "@/lib/utils";
import { ProjectVisual } from "./ProjectVisual";

export function WorkProjectCard({
  entry,
  className,
}: {
  entry: WorkFrontmatter;
  className?: string;
}) {
  const href = entry.detailPage ? `/work/${entry.slug}` : entry.repoUrl;
  const external = !entry.detailPage;

  const inner = (
    <>
      <ProjectVisual entry={entry} />
      <div className="p-5">
        <MetaLabel>{entry.categories.join(" · ") || "Open Source"}</MetaLabel>
        <h3 className="mt-2 font-display text-xl text-paper group-hover:text-lime">
          {entry.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-paper/70">
          {entry.summary}
        </p>
        {entry.tech.length > 0 ? (
          <p className="mt-3 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-wider text-paper/50">
            {entry.tech.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded border border-paper/10 px-2 py-0.5"
              >
                {t}
              </span>
            ))}
          </p>
        ) : null}
        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-lime">
          {entry.detailPage ? "Explore project →" : "View repository ↗"}
        </p>
      </div>
    </>
  );

  const classes = cn("project-card group block", className);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}
