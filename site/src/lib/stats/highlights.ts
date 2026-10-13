import fs from "fs/promises";
import path from "path";
import { getAllEntries } from "@/lib/content/loader";
import { GITHUB_USER } from "@/lib/seo/site-config";
import { getYoutubeVideoCount } from "@/lib/youtube/rss";

export type HighlightStats = {
  githubRepos: number | null;
  youtubeVideos: number | null;
  placesTraveled: number;
};

async function fetchGithubPublicRepos(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}`, {
      next: { revalidate: 86400 },
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { public_repos?: number };
    return typeof json.public_repos === "number" ? json.public_repos : null;
  } catch {
    return null;
  }
}

async function countTravelPlaces(): Promise<number> {
  try {
    const placesPath = path.join(process.cwd(), "content", "travel", "places.json");
    const raw = await fs.readFile(placesPath, "utf8");
    const places = JSON.parse(raw) as unknown[];
    if (Array.isArray(places)) return places.length;
  } catch {
    /* fall through */
  }

  const notes = await getAllEntries("field-notes");
  const withGeo = notes.filter(
    (n) =>
      "geo" in n.frontmatter &&
      n.frontmatter.geo &&
      typeof n.frontmatter.geo === "object",
  );
  return withGeo.length > 0 ? withGeo.length : notes.length;
}

export async function getHighlightStats(): Promise<HighlightStats> {
  const [githubRepos, youtubeVideos, placesTraveled] = await Promise.all([
    fetchGithubPublicRepos(),
    getYoutubeVideoCount(),
    countTravelPlaces(),
  ]);

  return { githubRepos, youtubeVideos, placesTraveled };
}
