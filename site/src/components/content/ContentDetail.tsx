import { Prose } from "@/components/ui/Prose";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { renderMdx } from "@/lib/content/mdx";
import type { ContentEntry } from "@/lib/content/loader";

export async function ContentDetail({ entry }: { entry: ContentEntry }) {
  const body = await renderMdx(entry.body);
  const { title, date, tags, summary } = entry.frontmatter;

  return (
    <div>
      <MetaLabel>{date}</MetaLabel>
      <h1 className="mt-4 font-display text-4xl md:text-6xl tracking-tight text-paper">
        {title}
      </h1>
      {"summary" in entry.frontmatter && summary ? (
        <p className="mt-6 max-w-prose text-lg text-paper/70">{summary}</p>
      ) : null}
      {tags.length > 0 ? (
        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-paper/50">
          {tags.join(" · ")}
        </p>
      ) : null}
      <Prose className="mt-12">{body}</Prose>
    </div>
  );
}
