import Image from "next/image";
import Link from "next/link";
import { MetaLabel } from "@/components/ui/MetaLabel";
import type { WorkFrontmatter } from "@/lib/validation/schemas";
import { cn } from "@/lib/utils";

export function WorkProjectCard({
  entry,
  className,
}: {
  entry: WorkFrontmatter;
  className?: string;
}) {
  const href = entry.detailPage
    ? `/work/${entry.slug}`
    : entry.repoUrl;
  const external = !entry.detailPage;

  const coverCategory = entry.categories[0]?.toLowerCase() ?? "";
  const coverClass = coverCategory === "php" ? "gen-cover--php"
    : coverCategory === "python" ? "gen-cover--python"
    : coverCategory === "typescript" ? "gen-cover--typescript"
    : coverCategory === "iot" ? "gen-cover--iot"
    : "";

  const inner = (
    <>
      <div className={cn("relative aspect-[16/10] overflow-hidden bg-canvas", !entry.cover && "gen-cover " + coverClass)}>
        {entry.cover ? (
          <Image
            src={entry.cover}
            alt=""
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : null}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--glass-bg)] to-transparent" />
      </div>
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
              <span key={t} className="rounded border border-paper/10 px-2 py-0.5">
                {t}
              </span>
            ))}
          </p>
        ) : null}
        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-lime">
          {entry.detailPage ? "Case study →" : "GitHub →"}
        </p>
      </div>
    </>
  );

  const classes = cn(
    "glass-card group block",
    className,
  );

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
