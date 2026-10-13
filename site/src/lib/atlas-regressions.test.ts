import { describe, expect, it } from "vitest";
import { searchRecords } from "./search";
import { validateContact } from "./contact";
import { prepareTravelStory, recordedFact } from "./travel/story-presentation";
import { parseEntries } from "./youtube/rss";

describe("atlas search", () => {
  const records = [
    {
      title: "JodKit",
      href: "/work/jodkit",
      kind: "Projects",
      summary: "Laravel modules",
      tags: ["PHP"],
    },
    {
      title: "Madhmaheshwar",
      href: "/field-notes/madhmaheshwar",
      kind: "Journeys",
      summary: "A mountain trek",
      tags: ["Uttarakhand"],
    },
  ];
  it("searches multiple terms across name, description and tags", () => {
    expect(searchRecords(records, "  php LARAVEL ")).toHaveLength(1);
    expect(searchRecords(records, "Uttarakhand")[0].title).toBe(
      "Madhmaheshwar",
    );
  });
  it("combines filters and handles no results", () => {
    expect(searchRecords(records, "", "Projects")).toHaveLength(1);
    expect(searchRecords(records, "Laravel", "Journeys")).toEqual([]);
  });
});

describe("authored travel presentation", () => {
  it("does not present TODOs as facts", () => {
    expect(recordedFact("TODO: actual cost")).toBeUndefined();
    expect(recordedFact("Ransi → Madhmaheshwar")).toBe("Ransi → Madhmaheshwar");
  });
  it("retains actual chapters while moving photographs into the gallery", () => {
    const result = prepareTravelStory(
      '## Route\n\nWalk from Ransi.\n\n## Costs\n\nTODO: add costs\n\n## Photos\n\n<Figure src="/images/travel/one.jpg" alt="A real caption" caption="The trail" />',
    );
    expect(result.body).toContain("## Route");
    expect(result.body).toContain("Walk from Ransi.");
    expect(result.body).not.toContain("## Costs");
    expect(result.body).not.toContain("## Photos");
    expect(result.body).not.toContain("TODO");
    expect(result.photos).toEqual([
      {
        src: "/images/travel/one.jpg",
        alt: "A real caption",
        caption: "The trail",
      },
    ]);
  });
  it("omits placeholder photographs without rewriting source", () => {
    const source =
      '<Figure src="/images/travel/placeholder.svg" alt="Placeholder" />';
    expect(prepareTravelStory(source).photos).toEqual([]);
    expect(source).toContain("placeholder.svg");
  });
});

describe("YouTube thumbnail parser", () => {
  it("uses media:thumbnail rather than media:content/watch URL", () => {
    const [video] = parseEntries(
      '<entry><id>yt:video:abc123</id><title>A &amp; B</title><media:content url="https://youtube.com/v/abc123"/><media:thumbnail url="https://i.ytimg.com/vi/abc123/hqdefault.jpg"/><published>2026-01-01</published></entry>',
    );
    expect(video.thumbnailUrl).toBe(
      "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
    );
    expect(video.title).toBe("A & B");
  });
  it("falls back to the real video thumbnail URL when absent", () => {
    expect(
      parseEntries("<entry><id>yt:video:abc123</id></entry>")[0].thumbnailUrl,
    ).toBe("https://i.ytimg.com/vi/abc123/hqdefault.jpg");
  });
});

describe("contact validation", () => {
  it("accepts a complete inquiry", () =>
    expect(
      validateContact({
        name: "Test Person",
        email: "test@example.com",
        type: "consulting",
        message: "A sufficiently detailed project inquiry.",
      }),
    ).toEqual({}));
  it("rejects whitespace, invalid addresses, short messages and invalid types", () =>
    expect(
      Object.keys(
        validateContact({
          name: " ",
          email: "wrong",
          type: "unknown",
          message: "short",
        }),
      ),
    ).toEqual(["name", "email", "type", "message"]));
});
