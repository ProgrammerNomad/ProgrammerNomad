import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { VideoCard } from "@/components/video/VideoCard";
import { indexPageMetadata } from "@/lib/seo/metadata";
import { fetchChannelVideos, type YouTubeVideo } from "@/lib/youtube/rss";

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

function videosForSection(all: YouTubeVideo[], ids: string[]) {
  if (ids.length === 0) return [];
  return ids
    .map((id) => all.find((v) => v.id === id))
    .filter((v): v is YouTubeVideo => Boolean(v));
}

export default async function VideosPage() {
  const [videos, playlists] = await Promise.all([
    fetchChannelVideos(24),
    loadPlaylists(),
  ]);

  const sectionsWithVideos = playlists.sections.filter(
    (s) => s.videoIds.length > 0,
  );

  return (
    <Container className="py-16 md:py-24">
      <MetaLabel>YOUTUBE / VIDEOS</MetaLabel>
      <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
        Videos
      </h1>
      <p className="mt-4 max-w-prose text-paper/70">
        Tech tutorials and travel stories from{" "}
        <Link href="https://www.youtube.com/@NomadProgrammer" className="text-lime hover:underline">
          @NomadProgrammer
        </Link>
        .
      </p>

      {videos.length === 0 ? (
        <p className="mt-12 text-paper/60">
          Videos load when <code className="text-lime">YOUTUBE_CHANNEL_ID</code> is
          set in the environment.
        </p>
      ) : (
        <>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>

          {sectionsWithVideos.map((section) => {
            const sectionVideos = videosForSection(videos, section.videoIds);
            if (sectionVideos.length === 0) return null;
            return (
              <section key={section.title} className="mt-16">
                <h2 className="font-display text-2xl text-paper">{section.title}</h2>
                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {sectionVideos.map((v) => (
                    <VideoCard key={v.id} video={v} />
                  ))}
                </div>
              </section>
            );
          })}
        </>
      )}
    </Container>
  );
}
