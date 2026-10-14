import { describe, expect, it } from "vitest";
import {
  FOOTER_SOCIAL_LINKS,
  PROFILE_SOCIAL_LINKS,
  SAME_AS,
  SOCIAL,
  SITE_URL,
} from "./site-config";

describe("site-config social URLs", () => {
  it("uses the correct Instagram handle", () => {
    expect(SOCIAL.instagram).toBe(
      "https://www.instagram.com/nomadprogrammer_/",
    );
  });

  it("includes Google profile in schema sameAs and footer links", () => {
    expect(SOCIAL.googleProfile).toBe(
      "https://profile.google.com/@nomadprogrammer",
    );
    expect(SAME_AS).toContain(SOCIAL.googleProfile);
    expect(PROFILE_SOCIAL_LINKS.some((l) => l.id === "google")).toBe(true);
  });

  it("lists website and email in footer social icons", () => {
    expect(
      FOOTER_SOCIAL_LINKS.find((l) => l.id === "website")?.href,
    ).toBe(SITE_URL);
    expect(FOOTER_SOCIAL_LINKS.some((l) => l.id === "email")).toBe(true);
  });
});
