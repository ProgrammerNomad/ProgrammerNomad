"use client";
import Image from "next/image";
import { useState } from "react";

export function VideoPoster({
  src,
  title,
  priority = false,
}: {
  src: string;
  title: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="video-poster">
      {!failed && (
        <Image
          src={src}
          alt=""
          fill
          unoptimized
          priority={priority}
          sizes="(max-width:700px) 100vw, 900px"
          onError={() => setFailed(true)}
          className="object-cover"
        />
      )}
      <span className="video-play" aria-hidden="true">
        ▶
      </span>
      {failed && <p className="video-poster-label">{title}</p>}
    </div>
  );
}
