"use client";
import { useState } from "react";
import type { YouTubeVideo } from "@/lib/youtube/rss";
import { VideoCard } from "./VideoCard";

export function VideoLibrary({
  videos,
  sections,
}: {
  videos: YouTubeVideo[];
  sections: { title: string; videoIds: string[] }[];
}) {
  const [selected, setSelected] = useState("All films");
  const [query, setQuery] = useState("");
  const ids = sections.find((section) => section.title === selected)?.videoIds;
  const matches = videos.filter(
    (video) =>
      (!ids || ids.includes(video.id)) &&
      `${video.title} ${video.description}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  return (
    <section className="film-library" aria-labelledby="film-library-title">
      <div className="section-topline">
        <div>
          <p className="atlas-meta">Choose a perspective</p>
          <h2 id="film-library-title">The screening room.</h2>
        </div>
        <label className="film-search">
          Find a film
          <input
            className="atlas-input mt-2"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Title or place"
          />
        </label>
      </div>
      <div className="film-filters" aria-label="Film categories">
        {["All films", ...sections.map((section) => section.title)].map(
          (title) => (
            <button
              type="button"
              key={title}
              className="filter-chip"
              aria-pressed={selected === title}
              onClick={() => setSelected(title)}
            >
              {title}
            </button>
          ),
        )}
      </div>
      <p role="status" className="atlas-meta my-6">
        {matches.length} {matches.length === 1 ? "film" : "films"}
      </p>
      {matches.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((video) => (
            <VideoCard video={video} key={video.id} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No films match that selection.</p>
          <button
            type="button"
            className="atlas-button mt-4"
            onClick={() => {
              setQuery("");
              setSelected("All films");
            }}
          >
            Reset film filters
          </button>
        </div>
      )}
    </section>
  );
}
