import fs from "fs/promises";
import path from "path";
import { getAllEntries } from "@/lib/content/loader";
import type { FieldNotesFrontmatter } from "@/lib/validation/schemas";
import type { MapPlace } from "@/components/travel/TravelMap";
import { groupTravelDestinations } from "@/lib/travel/destinations";
import { prepareTravelStory } from "@/lib/travel/story-presentation";

type JsonPlace = { label: string; lat: number; lng: number; slug?: string };

function coordKey(lat: number, lng: number): string {
  return `${lat.toFixed(2)}:${lng.toFixed(2)}`;
}

async function loadPlacesJson(): Promise<JsonPlace[]> {
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "content", "travel", "places.json"),
      "utf8",
    );
    const places = JSON.parse(raw) as JsonPlace[];
    return Array.isArray(places) ? places : [];
  } catch {
    return [];
  }
}

/** Published trip posts + supplemental pins from places.json (deduped by coordinates). */
export async function getMergedTravelPlaces(): Promise<MapPlace[]> {
  const notes = await getAllEntries<FieldNotesFrontmatter>("field-notes");
  const fromNotes: MapPlace[] = notes
    .filter((n) => n.frontmatter.geo)
    .map((n) => ({
      lat: n.frontmatter.geo!.lat,
      lng: n.frontmatter.geo!.lng,
      label: n.frontmatter.geo!.label,
      href: `/field-notes/${n.frontmatter.slug}`,
    }));

  const covered = new Set(fromNotes.map((p) => coordKey(p.lat, p.lng)));
  const jsonPlaces = await loadPlacesJson();
  const published = new Set(notes.map((n) => n.frontmatter.slug));

  for (const p of jsonPlaces) {
    const key = coordKey(p.lat, p.lng);
    if (covered.has(key)) continue;
    covered.add(key);
    fromNotes.push({
      lat: p.lat,
      lng: p.lng,
      label: p.label,
      href:
        p.slug && published.has(p.slug) ? `/field-notes/${p.slug}` : undefined,
    });
  }

  return fromNotes;
}

export async function countMergedTravelPlaces(): Promise<number> {
  return (await getTravelDestinations()).length;
}

/** Shared map records, grouped for the homepage atlas and destination count. */
export async function getTravelDestinations() {
  const [places, notes] = await Promise.all([
    getMergedTravelPlaces(),
    getAllEntries<FieldNotesFrontmatter>("field-notes"),
  ]);
  const byHref = new Map(
    notes.map((n) => [`/field-notes/${n.frontmatter.slug}`, n]),
  );
  return groupTravelDestinations(places).map((destination) => ({
    ...destination,
    visits: destination.stories.flatMap((href) => {
      const note = byHref.get(href);
      if (!note) return [];
      return [
        {
          href,
          title: note.frontmatter.title,
          date: note.frontmatter.date,
          cover: note.frontmatter.cover?.includes("placeholder")
            ? undefined
            : note.frontmatter.cover,
          photoCount: prepareTravelStory(note.body).photos.length,
          videoId: note.frontmatter.youtubeVideoId,
        },
      ];
    }),
  }));
}
