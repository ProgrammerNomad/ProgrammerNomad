import { describe, expect, it } from "vitest";
import { getAllEntries } from "@/lib/content/loader";
import { groupTravelDestinations } from "./destinations";
import {
  countMergedTravelPlaces,
  getMergedTravelPlaces,
  getTravelDestinations,
} from "./merge-places";

describe("shared atlas destinations", () => {
  it("groups repeat visits without losing stories or changing coordinates", () => {
    const places = groupTravelDestinations([
      {
        label: "Latest visit",
        lat: 30.1234,
        lng: 79.2345,
        href: "/field-notes/new",
      },
      {
        label: "Old visit",
        lat: 30.1234,
        lng: 79.2345,
        href: "/field-notes/old",
      },
      {
        label: "Duplicate",
        lat: 30.1234,
        lng: 79.2345,
        href: "/field-notes/new",
      },
      { label: "Supplemental", lat: -20, lng: -80 },
    ]);
    expect(places).toHaveLength(2);
    expect(places[0]).toEqual({
      id: "30.12:79.23",
      label: "Latest visit",
      lat: 30.1234,
      lng: 79.2345,
      stories: ["/field-notes/new", "/field-notes/old"],
    });
    expect(places[1].stories).toEqual([]);
  });

  it("rejects invalid coordinates", () => {
    expect(
      groupTravelDestinations([
        { label: "Invalid latitude", lat: 91, lng: 0 },
        { label: "Invalid longitude", lat: 0, lng: 181 },
        { label: "Not finite", lat: NaN, lng: Infinity },
      ]),
    ).toEqual([]);
  });

  it("uses existing map records, links only published stories, and counts unique places", async () => {
    const [map, atlas, notes, count] = await Promise.all([
      getMergedTravelPlaces(),
      getTravelDestinations(),
      getAllEntries("field-notes"),
      countMergedTravelPlaces(),
    ]);
    const published = new Set(
      notes.map((note) => `/field-notes/${note.frontmatter.slug}`),
    );
    expect(atlas).toEqual(groupTravelDestinations(map));
    expect(count).toBe(atlas.length);
    expect(new Set(atlas.map((place) => place.id)).size).toBe(atlas.length);
    expect(atlas.length).toBeGreaterThan(0);
    expect(
      atlas.every((place) =>
        place.stories.every((href) => published.has(href)),
      ),
    ).toBe(true);
  });
});
