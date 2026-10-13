import fs from "fs/promises";
import path from "path";
import { getAllEntries } from "@/lib/content/loader";
import type { FieldNotesFrontmatter } from "@/lib/validation/schemas";
import type { MapPlace } from "@/components/travel/TravelMap";

export async function getTravelMapPlaces(): Promise<MapPlace[]> {
  const notes = await getAllEntries<FieldNotesFrontmatter>("field-notes");
  const fromNotes: MapPlace[] = notes
    .filter((n) => n.frontmatter.geo)
    .map((n) => ({
      lat: n.frontmatter.geo!.lat,
      lng: n.frontmatter.geo!.lng,
      label: n.frontmatter.geo!.label,
      href: `/field-notes/${n.frontmatter.slug}`,
    }));

  if (fromNotes.length > 0) return fromNotes;

  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "content", "travel", "places.json"),
      "utf8",
    );
    const places = JSON.parse(raw) as {
      label: string;
      lat: number;
      lng: number;
    }[];
    return places.map((p) => ({ ...p }));
  } catch {
    return [];
  }
}
