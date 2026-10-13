import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { getPageEntry } from "@/lib/content/loader";
import { renderMdx } from "@/lib/content/mdx";

export const metadata = {
  title: "About",
  description: "Background, philosophy, and capabilities.",
};

export default async function AboutPage() {
  const page = await getPageEntry("about");
  if (!page) notFound();
  const body = await renderMdx(page.body);

  return (
    <Container className="py-16 md:py-24">
      <MetaLabel>IDENTITY / ABOUT</MetaLabel>
      <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
        {page.frontmatter.title}
      </h1>
      <div className="mt-12 max-w-prose">{body}</div>
    </Container>
  );
}
