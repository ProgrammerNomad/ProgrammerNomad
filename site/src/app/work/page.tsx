import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
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
    <Container className="py-16 md:py-24" data-section="work">
      <PageHeader
        label="OPEN SOURCE / PROJECTS"
        title="Open-Source Projects"
        description="Tools, libraries, and apps from the Nomad Programmer GitHub - filter by stack below."
      />
      <div className="mt-12">
        <WorkFilterGrid entries={entries.map((e) => e.frontmatter)} />
      </div>
    </Container>
  );
}
