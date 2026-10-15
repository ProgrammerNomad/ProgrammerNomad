"use client";
import { useEffect, useRef, useState } from "react";
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
  const frame = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!playing) return;
    const stop = () => {
      if (document.hidden) setPlaying(false);
    };
    const observer = window.IntersectionObserver
      ? new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) setPlaying(false);
          },
          { threshold: 0 },
        )
      : undefined;
    if (frame.current) observer?.observe(frame.current);
    document.addEventListener("visibilitychange", stop);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", stop);
    };
  }, [playing]);
  return (
    <div ref={frame} className="video-player relative">
      {playing ? (
        <>
          <iframe
            title={title}
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
          <button
            type="button"
            className="stop-film"
            onClick={() => setPlaying(false)}
          >
            Stop playback ×
          </button>
        </>
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
