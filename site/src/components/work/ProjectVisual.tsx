import Image from "next/image";
import type { CSSProperties } from "react";
import type { WorkFrontmatter } from "@/lib/validation/schemas";

export function ProjectVisual({ entry }: { entry: WorkFrontmatter }) {
  if (entry.cover && !entry.cover.endsWith("/default.svg"))
    return (
      <div className="project-visual">
        <Image
          src={entry.cover}
          alt={`${entry.title} preview`}
          fill
          sizes="(max-width:700px) 100vw, 650px"
          className="object-cover"
        />
      </div>
    );
  const palette = entry.categories.includes("IoT")
    ? "#e8b86d"
    : entry.categories.includes("TypeScript")
      ? "#92c8e5"
      : entry.categories.includes("Python")
        ? "#e2cc8f"
        : "#b5ff43";
  return (
    <div
      className="project-visual project-visual--abstract"
      style={{ "--project-accent": palette } as CSSProperties}
      aria-label={`${entry.title}: typographic project identity, not a product screenshot`}
      role="img"
    >
      <div className="project-visual-top">
        <span>NP / OPEN SOURCE</span>
        <span aria-hidden="true">↗</span>
      </div>
      <div className="project-monogram" aria-hidden="true">
        {entry.title.replace(/[^A-Z]/g, "").slice(0, 3) ||
          entry.title.slice(0, 2)}
      </div>
      <div className="project-visual-bottom">
        <span>{entry.slug}</span>
        <span>{entry.tech[0] ?? "Software"}</span>
      </div>
    </div>
  );
}
