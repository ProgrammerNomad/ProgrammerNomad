import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { indexPageMetadata } from "@/lib/seo/metadata";
import { fetchChannelVideos, getChannelId } from "@/lib/youtube/rss";
import { DEFAULT_YOUTUBE_CHANNEL_ID } from "@/lib/seo/site-config";
import { AtlasHeading } from "@/components/ui/AtlasHeading";
import { VideoPoster } from "@/components/video/VideoPoster";
import { VideoLibrary } from "@/components/video/VideoLibrary";
import videoCatalog from "../../../content/youtube/catalog.json";

export const metadata = indexPageMetadata(
  "Nomad Programmer YouTube Videos – Tech & Travel",
  "Latest coding tutorials and travel films from the Nomad Programmer YouTube channel.",
  "/videos",
);

type PlaylistConfig = {
  sections: { title: string; videoIds: string[] }[];
};

async function loadPlaylists(): Promise<PlaylistConfig> {
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "content", "youtube", "playlists.json"),
      "utf8",
    );
    return JSON.parse(raw) as PlaylistConfig;
  } catch {
    return { sections: [] };
  }
}

export default async function VideosPage() {
  const [latest, playlists] = await Promise.all([
    fetchChannelVideos(24),
    loadPlaylists(),
  ]);
  const videos = [
    ...new Map(
      [
        ...latest,
        ...(getChannelId() === DEFAULT_YOUTUBE_CHANNEL_ID
          ? videoCatalog.videos
          : []),
      ].map((video) => [video.id, video]),
    ).values(),
  ].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const sectionsWithVideos = playlists.sections.filter(
    (s) => s.videoIds.length > 0,
  );

  return (
    <Container className="py-16 md:py-24">
      <AtlasHeading
        index="04"
        eyebrow="The screening room / Nomad Programmer"
        title="Press play. Go somewhere."
        description="Travel stories and technical walkthroughs, in motion. The latest dispatches from the Nomad Programmer channel."
      />

      {videos.length === 0 ? (
        <div className="empty-state">
          <h2 className="font-display text-2xl">
            The latest feed is taking a break.
          </h2>
          <p className="mt-4">
            You can still watch the films directly on YouTube.
          </p>
          <a
            className="atlas-button mt-6"
            href="https://www.youtube.com/@NomadProgrammer"
          >
            Open the channel ↗
          </a>
        </div>
      ) : (
        <>
          <Link href={`/videos/${videos[0].id}`} className="featured-film">
            <VideoPoster
              src={videos[0].thumbnailUrl}
              title={videos[0].title}
              priority
            />
            <div>
              <p className="atlas-meta">
                Latest release / {videos[0].publishedAt.slice(0, 10)}
              </p>
              <h2>{videos[0].title}</h2>
              <span className="atlas-button mt-6">Watch the film ↗</span>
            </div>
          </Link>
          <VideoLibrary videos={videos} sections={sectionsWithVideos} />
        </>
      )}
      <section className="editorial-section mt-16">
        <div className="section-topline">
          <div>
            <p className="atlas-meta">Beyond the screen</p>
            <h2>Follow the story.</h2>
          </div>
          <a
            href="https://www.youtube.com/@NomadProgrammer/playlists"
            className="atlas-button"
          >
            Channel playlists ↗
          </a>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <Link className="dispatch-link" href="/field-notes">
            <span className="atlas-meta">Journeys</span>
            <h3>Explore the travel atlas ↗</h3>
            <p className="text-paper/65">
              Destinations, photographs, and the notes behind a life on the
              road.
            </p>
          </Link>
          <Link className="dispatch-link" href="/work">
            <span className="atlas-meta">Engineering</span>
            <h3>Go into the source ↗</h3>
            <p className="text-paper/65">
              Open-source tools and the ideas behind them.
            </p>
          </Link>
        </div>
      </section>
    </Container>
  );
}
