import Image from "next/image";
import Link from "next/link";
import { MetaLabel } from "@/components/ui/MetaLabel";

export function ProjectCard({
  href,
  title,
  summary,
  date,
  cover,
  tags,
}: {
  href: string;
  title: string;
  summary: string;
  date: string;
  cover?: string;
  tags?: string[];
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col border border-white/10 bg-elevated/50 transition-transform hover:-translate-y-0.5 hover:border-lime/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-canvas">
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-elevated to-canvas" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <MetaLabel>{date}</MetaLabel>
        <h3 className="font-display text-xl text-paper group-hover:text-lime transition-colors">
          {title}
        </h3>
        <p className="text-sm text-paper/70 line-clamp-3">{summary}</p>
        {tags && tags.length > 0 ? (
          <p className="mt-auto font-mono text-[10px] uppercase tracking-wider text-paper/50">
            {tags.slice(0, 3).join(" · ")}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
