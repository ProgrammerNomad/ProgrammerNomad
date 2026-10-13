import { notFound } from "next/navigation";
import Link from "next/link";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { Container } from "@/components/layout/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { getAllTags, getEntriesByTag } from "@/lib/content/loader";
import { matchTagFromParam, tagToParam } from "@/lib/content/tags";

export async function generateStaticParams() {
  const tags = await getAllTags("writing");
  return tags.map((tag) => ({ tag: tagToParam(tag) }));
}

export default async function WritingTagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag: tagParam } = await params;
  const allTags = await getAllTags("writing");
  const tag = matchTagFromParam(tagParam, allTags);
  if (!tag) notFound();

  const entries = await getEntriesByTag("writing", tag);

  return (
    <Container className="py-16 md:py-24">
      <MetaLabel>WRITING / TAG</MetaLabel>
      <h1 className="mt-4 font-display text-4xl text-paper">{tag}</h1>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <ProjectCard
            key={entry.frontmatter.slug}
            href={`/writing/${entry.frontmatter.slug}`}
            title={entry.frontmatter.title}
            summary={entry.frontmatter.summary}
            date={entry.frontmatter.date}
            cover={entry.frontmatter.cover}
            tags={entry.frontmatter.tags}
          />
        ))}
      </div>
      <Link
        href="/writing"
        className="mt-12 inline-block font-mono text-xs uppercase tracking-widest text-lime"
      >
        ← All writing
      </Link>
    </Container>
  );
}
