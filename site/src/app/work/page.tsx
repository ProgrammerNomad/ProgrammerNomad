import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
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

  return (
    <Container className="py-16 md:py-24">
      <MetaLabel>OPEN SOURCE / PROJECTS</MetaLabel>
      <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
        Open-Source Projects
      </h1>
      <p className="mt-4 max-w-prose text-paper/70">
        Tools, libraries, and apps from the Nomad Programmer GitHub - filter by
        stack below.
      </p>
      <div className="mt-12">
        <WorkFilterGrid entries={entries.map((e) => e.frontmatter)} />
      </div>
    </Container>
  );
}
