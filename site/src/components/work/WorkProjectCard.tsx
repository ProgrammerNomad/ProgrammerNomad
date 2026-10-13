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

  const inner = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden bg-canvas">
        {entry.cover ? (
          <Image
            src={entry.cover}
            alt=""
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-elevated to-canvas" />
        )}
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
    "group block overflow-hidden rounded-xl border border-paper/10 bg-elevated transition hover:-translate-y-0.5 hover:border-lime/40",
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
