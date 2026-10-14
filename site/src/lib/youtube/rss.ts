import fs from "fs/promises";
import path from "path";
import { DEFAULT_YOUTUBE_CHANNEL_ID } from "@/lib/seo/site-config";

export type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  watchUrl: string;
};

const RSS_FETCH_HEADERS = {
  Accept: "application/atom+xml, application/xml, text/xml, */*",
  "User-Agent":
    "NomadProgrammerSite/1.0 (+https://www.nomadprogrammer.in; RSS sync)",
} as const;

export function getChannelId(): string {
  return (
    process.env.YOUTUBE_CHANNEL_ID?.trim() || DEFAULT_YOUTUBE_CHANNEL_ID
  );
}

function getApiKey(): string | undefined {
  return process.env.YOUTUBE_API_KEY?.trim() || undefined;
}

function decodeXml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractTag(block: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = block.match(re);
  return m ? decodeXml(m[1].trim()) : "";
}

export function parseEntries(xml: string): YouTubeVideo[] {
  const entries = xml.split(/<entry>/i).slice(1);
  const videos: YouTubeVideo[] = [];

  for (const chunk of entries) {
    const block = `<entry>${chunk}`;
    const idRaw = extractTag(block, "id");
    const idMatch = idRaw.match(/video:([\w-]+)/);
    const id = idMatch?.[1];
    if (!id) continue;

    const title = extractTag(block, "title");
    const publishedAt = extractTag(block, "published");
    const description =
      extractTag(block, "media:description") ||
      extractTag(block, "summary") ||
      "";

    const thumbMatch = block.match(
      /<media:thumbnail\b[^>]*\burl=["']([^"']+)["']/i,
    );
    const thumbnailUrl = thumbMatch?.[1]
      ? decodeXml(thumbMatch[1])
      : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

    videos.push({
      id,
      title,
      description,
      publishedAt,
      thumbnailUrl,
      watchUrl: `https://www.youtube.com/watch?v=${id}`,
    });
  }

  return videos;
}

function mapApiSnippetToVideo(snippet: {
  resourceId?: { videoId?: string };
  title?: string;
  description?: string;
  publishedAt?: string;
  thumbnails?: { high?: { url?: string }; medium?: { url?: string } };
}): YouTubeVideo | null {
  const id = snippet.resourceId?.videoId;
  if (!id) return null;
  const thumbnailUrl =
    snippet.thumbnails?.high?.url ??
    snippet.thumbnails?.medium?.url ??
    `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  return {
    id,
    title: snippet.title ?? "",
    description: snippet.description ?? "",
    publishedAt: snippet.publishedAt ?? "",
    thumbnailUrl,
    watchUrl: `https://www.youtube.com/watch?v=${id}`,
  };
}

async function fetchChannelVideosFromRss(
  channelId: string,
  limit: number,
): Promise<{ videos: YouTubeVideo[]; status?: number; error?: string }> {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: RSS_FETCH_HEADERS,
    });
    if (!res.ok) {
      return { videos: [], status: res.status };
    }
    const xml = await res.text();
    if (!xml.includes("<entry")) {
      return { videos: [], error: "rss_no_entries" };
    }
    return { videos: parseEntries(xml).slice(0, limit) };
  } catch {
    return { videos: [], error: "rss_fetch_failed" };
  }
}

async function fetchChannelVideosFromApi(
  channelId: string,
  limit: number,
): Promise<YouTubeVideo[]> {
  const apiKey = getApiKey();
  if (!apiKey) return [];

  try {
    const channelUrl = new URL("https://www.googleapis.com/youtube/v3/channels");
    channelUrl.searchParams.set("part", "contentDetails");
    channelUrl.searchParams.set("id", channelId);
    channelUrl.searchParams.set("key", apiKey);

    const channelRes = await fetch(channelUrl, { next: { revalidate: 3600 } });
    if (!channelRes.ok) return [];

    const channelJson = (await channelRes.json()) as {
      items?: {
        contentDetails?: { relatedPlaylists?: { uploads?: string } };
      }[];
    };
    const uploadsPlaylistId =
      channelJson.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) return [];

    const playlistUrl = new URL(
      "https://www.googleapis.com/youtube/v3/playlistItems",
    );
    playlistUrl.searchParams.set("part", "snippet");
    playlistUrl.searchParams.set("playlistId", uploadsPlaylistId);
    playlistUrl.searchParams.set("maxResults", String(Math.min(limit, 50)));
    playlistUrl.searchParams.set("key", apiKey);

    const playlistRes = await fetch(playlistUrl, {
      next: { revalidate: 3600 },
    });
    if (!playlistRes.ok) return [];

    const playlistJson = (await playlistRes.json()) as {
      items?: { snippet?: Parameters<typeof mapApiSnippetToVideo>[0] }[];
    };

    return (playlistJson.items ?? [])
      .map((item) => mapApiSnippetToVideo(item.snippet ?? {}))
      .filter((v): v is YouTubeVideo => Boolean(v));
  } catch {
    return [];
  }
}

async function fetchVideoByIdFromApi(
  videoId: string,
): Promise<YouTubeVideo | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("id", videoId);
    url.searchParams.set("key", apiKey);

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;

    const json = (await res.json()) as {
      items?: {
        id?: string;
        snippet?: {
          title?: string;
          description?: string;
          publishedAt?: string;
          thumbnails?: { high?: { url?: string }; medium?: { url?: string } };
        };
      }[];
    };
    const item = json.items?.[0];
    if (!item?.id) return null;

    const thumbnailUrl =
      item.snippet?.thumbnails?.high?.url ??
      item.snippet?.thumbnails?.medium?.url ??
      `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`;

    return {
      id: item.id,
      title: item.snippet?.title ?? "",
      description: item.snippet?.description ?? "",
      publishedAt: item.snippet?.publishedAt ?? "",
      thumbnailUrl,
      watchUrl: `https://www.youtube.com/watch?v=${item.id}`,
    };
  } catch {
    return null;
  }
}

export async function fetchChannelVideos(limit = 15): Promise<YouTubeVideo[]> {
  const channelId = getChannelId();
  const rss = await fetchChannelVideosFromRss(channelId, limit);
  if (rss.videos.length > 0) return rss.videos;

  const apiVideos = await fetchChannelVideosFromApi(channelId, limit);
  if (apiVideos.length > 0) return apiVideos;

  const reason = rss.status
    ? `rss_http_${rss.status}`
    : (rss.error ?? "rss_empty");
  const apiHint = getApiKey()
    ? "api_fallback_empty"
    : "set_YOUTUBE_API_KEY_for_api_fallback";
  console.warn(
    `[youtube] No videos for channel ${channelId} (${reason}; ${apiHint})`,
  );
  return [];
}

export async function fetchVideoById(
  videoId: string,
): Promise<YouTubeVideo | null> {
  const videos = await fetchChannelVideos(50);
  const fromFeed = videos.find((v) => v.id === videoId);
  if (fromFeed) return fromFeed;
  return fetchVideoByIdFromApi(videoId);
}

export async function getYoutubeVideoCount(): Promise<number | null> {
  const apiKey = getApiKey();
  const channelId = getChannelId();
  if (apiKey && channelId) {
    try {
      const url = new URL("https://www.googleapis.com/youtube/v3/channels");
      url.searchParams.set("part", "statistics");
      url.searchParams.set("id", channelId);
      url.searchParams.set("key", apiKey);
      const res = await fetch(url, { next: { revalidate: 86400 } });
      if (res.ok) {
        const json = (await res.json()) as {
          items?: { statistics?: { videoCount?: string } }[];
        };
        const count = json.items?.[0]?.statistics?.videoCount;
        if (count) return Number.parseInt(count, 10);
      }
    } catch {
      /* fall through */
    }
  }

  try {
    const statsPath = path.join(process.cwd(), "content", "stats.json");
    const raw = await fs.readFile(statsPath, "utf8");
    const data = JSON.parse(raw) as { youtubeVideoCount?: number };
    if (typeof data.youtubeVideoCount === "number") {
      return data.youtubeVideoCount;
    }
  } catch {
    /* no fallback */
  }

  return null;
}
