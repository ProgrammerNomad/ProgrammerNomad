import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { Prose } from "@/components/ui/Prose";
import { ReadingProgress } from "@/components/content/ReadingProgress";
import { ShareButtons, TableOfContents } from "@/components/writing/PostExtras";
import type { RelatedArticle } from "@/lib/content/related";
import type { TocItem } from "@/lib/content/toc";
import type { ReactNode } from "react";
import type { BaseFrontmatter } from "@/lib/validation/schemas";
import { cn } from "@/lib/utils";

const PLACEHOLDER_COVER = "/images/travel/placeholder.svg";

export function GuideArticleLayout({
  entry,
  path,
  sectionLabel,
  minutes,
  toc,
  related,
  children,
}: {
  entry: BaseFrontmatter;
  path: string;
  sectionLabel: string;
  minutes: number;
  toc: TocItem[];
  related: RelatedArticle[];
  children: ReactNode;
}) {
  const showCover =
    entry.cover && entry.cover !== PLACEHOLDER_COVER;
  const metaParts = [
    sectionLabel,
    entry.date,
    entry.updatedAt ? `Updated ${entry.updatedAt}` : null,
    `${minutes} min read`,
  ].filter(Boolean);

  return (
    <>
      <ReadingProgress />
      <Container className="py-16 md:py-24">
        <MetaLabel>{metaParts.join(" · ")}</MetaLabel>
        {entry.tags.length > 0 ? (
          <p className="mt-3 flex flex-wrap gap-2">
            {entry.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded border border-paper/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-paper/60"
              >
                {tag}
              </span>
            ))}
          </p>
        ) : null}
        <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
          {entry.title}
        </h1>
        <p className="mt-4 max-w-prose text-lg text-paper/70">{entry.summary}</p>
        <div className="mt-6">
          <ShareButtons title={entry.title} path={path} />
        </div>

        {showCover ? (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden border border-paper/10">
            <Image
              src={entry.cover!}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1152px) 100vw, 1152px"
              priority
            />
          </div>
        ) : null}

        <div
          className={cn(
            "grid gap-12 lg:grid-cols-[240px_1fr]",
            showCover ? "mt-12" : "mt-12",
          )}
        >
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <TableOfContents items={toc} />
          </aside>
          <Prose>{children}</Prose>
        </div>

        {related.length > 0 ? (
          <section className="mt-16 border-t border-paper/10 pt-12">
            <h2 className="font-display text-2xl text-paper">Related guides</h2>
            <ul className="mt-6 space-y-3">
              {related.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="text-paper/80 hover:text-lime">
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Container>
    </>
  );
}
