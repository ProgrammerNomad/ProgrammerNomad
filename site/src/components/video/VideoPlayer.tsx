"use client";
import { useState } from "react";
import { VideoPoster } from "./VideoPoster";

export function VideoPlayer({
  id,
  title,
  poster,
}: {
  id: string;
  title: string;
  poster: string;
}) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="video-player">
      {playing ? (
        <iframe
          title={title}
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1`}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      ) : (
        <button
          type="button"
          aria-label={`Play ${title}`}
          onClick={() => setPlaying(true)}
          className="block w-full h-full text-left"
        >
          <VideoPoster src={poster} title={title} priority />
        </button>
      )}
    </div>
  );
}
