import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { getAllTags, getEntriesByTag } from "@/lib/content/loader";
import { matchTagFromParam, tagToParam } from "@/lib/content/tags";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EntryListSimple } from "@/components/content/EntryList";
import { indexPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag: param } = await params;
  const tag = matchTagFromParam(param, await getAllTags("writing"));
  if (!tag) return {};
  return indexPageMetadata(
    `${tag} – Writing`,
    `Engineering notes tagged ${tag}.`,
    `/writing/tags/${tagToParam(tag)}`,
  );
}

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
      <Breadcrumbs
        items={[{ label: "Writing", href: "/writing" }, { label: tag }]}
      />
      <MetaLabel>WRITING / TAG</MetaLabel>
      <h1 className="mt-4 font-display text-4xl text-paper">{tag}</h1>
      <div className="mt-12">
        <EntryListSimple
          entries={entries.map((e) => e.frontmatter)}
          hrefPrefix="/writing"
        />
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
