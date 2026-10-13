import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { YouTubeEmbed } from "@/lib/content/mdx-components";
import {
  BreadcrumbJsonLd,
  VideoObjectJsonLd,
} from "@/lib/seo/json-ld";
import { fetchChannelVideos, fetchVideoById } from "@/lib/youtube/rss";

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

  return (
    <Container className="py-16 md:py-24">
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
      <div className="mt-10 max-w-3xl">
        <YouTubeEmbed videoId={video.id} />
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
    </Container>
  );
}
