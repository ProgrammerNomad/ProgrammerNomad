import { describe, expect, it } from "vitest";
import { getAllEntries, getPublishedSlugs } from "./loader";

describe("content loader", () => {
  it("excludes draft work from published lists", async () => {
    const slugs = await getPublishedSlugs("work");
    expect(slugs).not.toContain("domain-data-platform");
    expect(slugs).toContain("infrastructure-automation");
  });

  it("getAllEntries returns only published by default", async () => {
    const entries = await getAllEntries("work");
    expect(entries.every((e) => e.frontmatter.published)).toBe(true);
  });
});
