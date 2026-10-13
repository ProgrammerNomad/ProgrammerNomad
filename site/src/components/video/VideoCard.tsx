import Link from "next/link";
import type { YouTubeVideo } from "@/lib/youtube/rss";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { VideoPoster } from "./VideoPoster";

export function VideoCard({ video }: { video: YouTubeVideo }) {
  const date = video.publishedAt.slice(0, 10);
  return (
    <Link href={`/videos/${video.id}`} className="video-card group block">
      <div className="relative aspect-video bg-canvas overflow-hidden">
        <VideoPoster src={video.thumbnailUrl} title={video.title} />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[var(--glass-bg)] to-transparent" />
      </div>
      <div className="p-4">
        <MetaLabel>{date}</MetaLabel>
        <h3 className="mt-2 font-display text-lg text-paper group-hover:text-lime line-clamp-2">
          {video.title}
        </h3>
      </div>
    </Link>
  );
}
