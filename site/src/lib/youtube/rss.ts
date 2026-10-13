import fs from "fs/promises";
import path from "path";

export type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  watchUrl: string;
};

function getChannelId(): string | undefined {
  return process.env.YOUTUBE_CHANNEL_ID?.trim() || undefined;
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

function parseEntries(xml: string): YouTubeVideo[] {
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

    const thumbMatch = block.match(/url="([^"]+)"/);
    const thumbnailUrl =
      thumbMatch?.[1] ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

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

export async function fetchChannelVideos(
  limit = 15,
): Promise<YouTubeVideo[]> {
  const channelId = getChannelId();
  if (!channelId) return [];

  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseEntries(xml).slice(0, limit);
  } catch {
    return [];
  }
}

export async function fetchVideoById(
  videoId: string,
): Promise<YouTubeVideo | null> {
  const videos = await fetchChannelVideos(50);
  return videos.find((v) => v.id === videoId) ?? null;
}

export async function getYoutubeVideoCount(): Promise<number | null> {
  const apiKey = process.env.YOUTUBE_API_KEY?.trim();
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
