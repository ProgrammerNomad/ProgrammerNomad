import type { BaseFrontmatter } from "@/lib/validation/schemas";

export const FIELD_GUIDE_TAGS = ["Field Guide", "Developer Setup"] as const;

export function isFieldGuide(fm: BaseFrontmatter): boolean {
  if ("featured" in fm && (fm as { featured?: boolean }).featured) {
    return true;
  }
  return fm.tags.some((t) =>
    (FIELD_GUIDE_TAGS as readonly string[]).includes(t),
  );
}
