import { GITHUB_USER } from "@/lib/seo/site-config";
import { countMergedTravelPlaces } from "@/lib/travel/merge-places";
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

export async function getHighlightStats(): Promise<HighlightStats> {
  const [githubRepos, youtubeVideos, placesTraveled] = await Promise.all([
    fetchGithubPublicRepos(),
    getYoutubeVideoCount(),
    countMergedTravelPlaces(),
  ]);

  return { githubRepos, youtubeVideos, placesTraveled };
}
