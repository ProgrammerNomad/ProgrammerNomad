import Image from "next/image";
import Link from "next/link";
import type { YouTubeVideo } from "@/lib/youtube/rss";
import { MetaLabel } from "@/components/ui/MetaLabel";

export function VideoCard({ video }: { video: YouTubeVideo }) {
  const date = video.publishedAt.slice(0, 10);
  return (
    <Link
      href={`/videos/${video.id}`}
      className="group block overflow-hidden rounded-xl border border-paper/10 bg-elevated transition hover:border-lime/40"
    >
      <div className="relative aspect-video bg-canvas">
        <Image
          src={video.thumbnailUrl}
          alt=""
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 400px"
          unoptimized
        />
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
