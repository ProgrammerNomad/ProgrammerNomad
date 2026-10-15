import { Container } from "@/components/ui/Container";
import { AtlasHeading } from "@/components/ui/AtlasHeading";
import { WorkFilterGrid } from "@/components/work/WorkFilterGrid";
import { getAllEntries } from "@/lib/content/loader";
import { indexPageMetadata } from "@/lib/seo/metadata";
import type { WorkFrontmatter } from "@/lib/validation/schemas";

export const metadata = indexPageMetadata(
  "Open-Source Projects by Nomad Programmer (Shiv Singh)",
  "Open-source projects by Shiv Singh - Laravel, Python, TypeScript, IoT, and more.",
  "/work",
);

export default async function WorkIndexPage() {
  const entries = await getAllEntries<WorkFrontmatter>("work");
  const featuredOrder = [
    "shiprocket-woo-shipping",
    "indian-railway-station-search",
    "likhaeditor",
  ];
  const ordered = [...entries].sort((a, b) => {
    const rank = (slug: string) =>
      featuredOrder.includes(slug)
        ? featuredOrder.indexOf(slug)
        : featuredOrder.length;
    return rank(a.frontmatter.slug) - rank(b.frontmatter.slug);
  });

  return (
    <Container className="py-16 md:py-24" data-section="work">
      <AtlasHeading
        index="01"
        eyebrow="Engineering / Open source"
        title="The software lab."
        description="Tools, libraries, and experiments. Explore what they do, how they fit together, and the source behind them."
      >
        <p className="atlas-meta mt-8">
          {entries.length} projects / PHP · Python · TypeScript · IoT
        </p>
      </AtlasHeading>
      <div className="mt-12">
        <WorkFilterGrid entries={ordered.map((e) => e.frontmatter)} />
      </div>
    </Container>
  );
}
