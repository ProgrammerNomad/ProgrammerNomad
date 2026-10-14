import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchChannelVideos,
  getChannelId,
  parseEntries,
} from "./rss";

describe("getChannelId", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("falls back to the public Nomad Programmer channel id", () => {
    vi.stubEnv("YOUTUBE_CHANNEL_ID", "");
    expect(getChannelId()).toBe("UCqXCwumTq46dgibfTwrJkGQ");
  });

  it("prefers YOUTUBE_CHANNEL_ID when set", () => {
    vi.stubEnv("YOUTUBE_CHANNEL_ID", " UCcustom123 ");
    expect(getChannelId()).toBe("UCcustom123");
  });
});

describe("fetchChannelVideos", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("uses the Data API when RSS returns a non-OK response", async () => {
    vi.stubEnv("YOUTUBE_API_KEY", "test-key");
    vi.stubEnv("YOUTUBE_CHANNEL_ID", "UCqXCwumTq46dgibfTwrJkGQ");

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("", { status: 404 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            items: [
              {
                contentDetails: {
                  relatedPlaylists: { uploads: "UUuploads123" },
                },
              },
            ],
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            items: [
              {
                snippet: {
                  resourceId: { videoId: "abc123" },
                  title: "Test film",
                  description: "Desc",
                  publishedAt: "2026-01-01T00:00:00Z",
                  thumbnails: {
                    high: { url: "https://i.ytimg.com/vi/abc123/hqdefault.jpg" },
                  },
                },
              },
            ],
          }),
          { status: 200 },
        ),
      );

    vi.stubGlobal("fetch", fetchMock);

    const videos = await fetchChannelVideos(5);
    expect(videos).toHaveLength(1);
    expect(videos[0].id).toBe("abc123");
    expect(videos[0].title).toBe("Test film");
  });
});

describe("parseEntries", () => {
  it("parses atom entries", () => {
    const [video] = parseEntries(
      '<entry><id>yt:video:xyz</id><title>Hello</title><published>2026-02-01</published></entry>',
    );
    expect(video.id).toBe("xyz");
    expect(video.title).toBe("Hello");
  });
});
