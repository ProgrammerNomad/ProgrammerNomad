import Image from "next/image";
import Link from "next/link";
import type { BaseFrontmatter } from "@/lib/validation/schemas";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { cn } from "@/lib/utils";

const cardClass =
  "group block overflow-hidden rounded-xl border border-paper/10 bg-elevated shadow-sm transition hover:-translate-y-0.5 hover:border-lime/40 hover:shadow-[0_0_24px_rgba(181,255,67,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime";

export function ProjectCard({
  entry,
  hrefPrefix,
  href,
  showTags = false,
  className,
}: {
  entry: BaseFrontmatter;
  hrefPrefix?: string;
  href?: string;
  showTags?: boolean;
  className?: string;
}) {
  const link = href ?? `${hrefPrefix}/${entry.slug}`;

  return (
    <Link href={link} className={cn(cardClass, className)}>
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
        <MetaLabel>{entry.date}</MetaLabel>
        <h3 className="mt-2 font-display text-xl text-paper group-hover:text-lime">
          {entry.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-paper/70">
          {entry.summary}
        </p>
        {showTags && entry.tags.length > 0 ? (
          <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-paper/50">
            {entry.tags.slice(0, 3).join(" · ")}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
