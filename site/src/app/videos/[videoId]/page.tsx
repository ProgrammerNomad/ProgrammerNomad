import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { BreadcrumbJsonLd, VideoObjectJsonLd } from "@/lib/seo/json-ld";
import { fetchChannelVideos, fetchVideoById } from "@/lib/youtube/rss";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { VideoCard } from "@/components/video/VideoCard";
import { getAllEntries } from "@/lib/content/loader";
import type { FieldNotesFrontmatter } from "@/lib/validation/schemas";

export async function generateStaticParams() {
  const videos = await fetchChannelVideos(30);
  return videos.map((v) => ({ videoId: v.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;
  const video = await fetchVideoById(videoId);
  if (!video) return {};
  return {
    title: video.title,
    description: video.description.slice(0, 160),
    alternates: { canonical: `/videos/${videoId}` },
    openGraph: {
      title: video.title,
      description: video.description.slice(0, 160),
      url: `/videos/${videoId}`,
      images: [video.thumbnailUrl],
    },
  };
}

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;
  const video = await fetchVideoById(videoId);
  if (!video) notFound();
  const more = (await fetchChannelVideos(8))
    .filter((v) => v.id !== videoId)
    .slice(0, 3);
  const stories = (
    await getAllEntries<FieldNotesFrontmatter>("field-notes")
  ).filter((e) => e.frontmatter.youtubeVideoId === videoId);

  return (
    <Container className="py-16 md:py-24">
      <Breadcrumbs
        items={[{ label: "Videos", href: "/videos" }, { label: video.title }]}
      />
      <VideoObjectJsonLd video={video} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Videos", path: "/videos" },
          { name: video.title, path: `/videos/${videoId}` },
        ]}
      />
      <MetaLabel>{video.publishedAt.slice(0, 10)}</MetaLabel>
      <h1 className="mt-4 font-display text-3xl font-semibold md:text-5xl">
        {video.title}
      </h1>
      <div className="mt-10">
        <VideoPlayer
          id={video.id}
          title={video.title}
          poster={video.thumbnailUrl}
        />
        <p className="atlas-meta mt-3">
          Click to load YouTube · playback connects to YouTube
        </p>
      </div>
      {video.description ? (
        <div className="prose prose-invert mt-10 max-w-prose whitespace-pre-wrap text-paper/80">
          {video.description}
        </div>
      ) : null}
      <Link
        href={video.watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 inline-block font-mono text-xs uppercase tracking-widest text-lime hover:underline"
      >
        Watch on YouTube →
      </Link>
      {stories.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl">Field notes from this film</h2>
          {stories.map(({ frontmatter: f }) => (
            <Link
              key={f.slug}
              className="dispatch-link"
              href={`/field-notes/${f.slug}`}
            >
              {f.title} ↗
            </Link>
          ))}
        </section>
      )}
      <section className="editorial-section mt-16">
        <div className="section-topline">
          <h2>Next on the screen.</h2>
          <Link href="/videos" className="atlas-button">
            All videos ↗
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {more.map((v) => (
            <VideoCard video={v} key={v.id} />
          ))}
        </div>
      </section>
    </Container>
  );
}
