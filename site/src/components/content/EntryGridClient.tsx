"use client";

import type { BaseFrontmatter } from "@/lib/validation/schemas";
import { ProjectCard } from "@/components/content/ProjectCard";
import {
  MotionStaggerGrid,
  MotionStaggerItem,
} from "@/components/ui/MotionReveal";

export function EntryGridClient({
  entries,
  hrefPrefix,
}: {
  entries: BaseFrontmatter[];
  hrefPrefix: string;
}) {
  return (
    <MotionStaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <MotionStaggerItem key={entry.slug}>
          <ProjectCard entry={entry} hrefPrefix={hrefPrefix} />
        </MotionStaggerItem>
      ))}
    </MotionStaggerGrid>
  );
}
