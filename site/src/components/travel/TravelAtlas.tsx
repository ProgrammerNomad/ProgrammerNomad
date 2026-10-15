"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TravelMapSection } from "./TravelMapSection";
import type { TravelDestination } from "@/lib/travel/destinations";
import type { FieldNotesFrontmatter } from "@/lib/validation/schemas";

const REGIONS = [
  "Uttarakhand",
  "Himachal",
  "Rajasthan",
  "UP",
  "Ladakh",
  "MP",
  "Kashmir",
  "Thailand",
  "Punjab",
  "Kerala",
  "Goa",
];
const EXPERIENCES = [
  "Road Trip",
  "Hills",
  "City",
  "Heritage",
  "Pilgrimage",
  "Trek",
  "Adventure",
  "Beach",
];
function UrlSelection({ select }: { select: (id: string) => void }) {
  const params = useSearchParams();
  const place = params.get("place");
  useEffect(() => {
    if (place) select(place);
  }, [place, select]);
  return null;
}
export function TravelAtlas({
  destinations,
  stories,
}: {
  destinations: TravelDestination[];
  stories: FieldNotesFrontmatter[];
}) {
  const [selected, setSelected] = useState(destinations[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [experience, setExperience] = useState("All");
  const [showMap, setShowMap] = useState(true);
  const [showPhotos, setShowPhotos] = useState(false);
  const lookup = useMemo(
    () =>
      new Map(stories.map((story) => [`/field-notes/${story.slug}`, story])),
    [stories],
  );
  const selectFromUrl = useCallback(
    (id: string) => {
      if (destinations.some((d) => d.id === id)) {
        setRegion("All");
        setExperience("All");
        setQuery("");
        setSelected(id);
      }
    },
    [destinations],
  );
  const filtered = destinations.filter((d) => {
    const visits = d.stories
      .map((href) => lookup.get(href))
      .filter(Boolean) as FieldNotesFrontmatter[];
    return (
      `${d.label} ${visits.map((v) => `${v.title} ${v.tags.join(" ")}`).join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()) &&
      (region === "All" || visits.some((v) => v.tags.includes(region))) &&
      (experience === "All" || visits.some((v) => v.tags.includes(experience)))
    );
  });
  const destination = filtered.find((d) => d.id === selected) ?? filtered[0];
  const visits = destination?.stories
    .map((href) => lookup.get(href))
    .filter(Boolean) as FieldNotesFrontmatter[] | undefined;
  const cover = visits?.find(
    (v) => v.cover && !v.cover.includes("placeholder"),
  )?.cover;
  return (
    <section id="atlas" className="travel-atlas scroll-mt-24">
      <Suspense fallback={null}>
        <UrlSelection select={selectFromUrl} />
      </Suspense>
      <div className="section-topline">
        <div>
          <p className="atlas-meta">The travel atlas / documented places</p>
          <h2 className="font-display text-3xl mt-3">
            Pick a place. Find a story.
          </h2>
        </div>
        <button
          type="button"
          className="atlas-button"
          aria-pressed={!showMap}
          onClick={() => setShowMap((v) => !v)}
        >
          {showMap ? "Use list only" : "Show map"}
        </button>
      </div>
      <div className="atlas-view-options">
        <button
          type="button"
          className="filter-chip"
          aria-pressed={showPhotos}
          onClick={() => {
            setShowPhotos((v) => !v);
            setShowMap(false);
          }}
        >
          {showPhotos ? "Close photo view" : "Browse photo journeys"}
        </button>
        <span className="atlas-meta">Map · List · Photography</span>
      </div>
      <div className="atlas-filters">
        <label>
          Find a destination
          <input
            className="atlas-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Place, story or tag"
          />
        </label>
        <label>
          Region
          <select
            className="atlas-input"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="All">All regions</option>
            {REGIONS.filter((r) => stories.some((s) => s.tags.includes(r))).map(
              (r) => (
                <option key={r}>{r}</option>
              ),
            )}
          </select>
        </label>
        <label>
          Experience
          <select
            className="atlas-input"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          >
            <option value="All">All experiences</option>
            {EXPERIENCES.filter((r) =>
              stories.some((s) => s.tags.includes(r)),
            ).map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
      </div>
      <p role="status" className="atlas-meta my-5">
        {filtered.length} places /{" "}
        {filtered.reduce((n, d) => n + d.stories.length, 0)} published visits
      </p>
      {showPhotos && (
        <div
          className="atlas-photo-view"
          aria-label="Destinations with photographs"
        >
          {filtered.flatMap((d) =>
            (d.visits ?? [])
              .filter((v) => v.cover && v.photoCount > 0)
              .map((v) => (
                <article key={v.href}>
                  <Link href={v.href}>
                    <Image
                      src={v.cover!}
                      alt={v.title}
                      width={600}
                      height={400}
                      sizes="(max-width:700px) 100vw, 380px"
                    />
                    <h3>{v.title} ↗</h3>
                  </Link>
                  <p className="atlas-meta">
                    {d.label} / {v.photoCount} photographs
                  </p>
                  <button
                    type="button"
                    className="atlas-button"
                    onClick={() => {
                      setSelected(d.id);
                      setShowPhotos(false);
                    }}
                  >
                    Select destination
                  </button>
                </article>
              )),
          )}
          {!filtered.some((d) =>
            d.visits?.some((v) => v.cover && v.photoCount > 0),
          ) && (
            <p className="atlas-description">
              No photo journals match these filters. The destination list below
              still includes the recorded places.
            </p>
          )}
        </div>
      )}
      <div className="atlas-explorer">
        <div className="min-w-0">
          {showMap && filtered.length > 0 && (
            <TravelMapSection
              places={filtered.map((d) => ({ ...d, href: d.stories[0] }))}
              selectedId={destination?.id}
              onSelect={setSelected}
            />
          )}
          <div className="destination-list" aria-label="Destination list">
            {filtered.map((d) => (
              <button
                type="button"
                className="destination-button"
                key={d.id}
                aria-pressed={destination?.id === d.id}
                onClick={() => setSelected(d.id)}
              >
                <span>{d.label}</span>
                <span className="atlas-meta">
                  {d.stories.length
                    ? `${d.stories.length} ${d.stories.length === 1 ? "note" : "notes"}`
                    : "Map pin"}{" "}
                  ↗
                </span>
              </button>
            ))}
          </div>
        </div>
        {destination ? (
          <aside className="atlas-selection" aria-label="Selected destination">
            {cover ? (
              <div className="atlas-selection-photo">
                <Image
                  src={cover}
                  alt={
                    visits?.find((v) => v.cover === cover)?.title ??
                    destination.label
                  }
                  fill
                  sizes="(max-width:900px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="atlas-coordinate-art" aria-hidden="true">
                <span>⌖</span>
                <p>
                  {Math.abs(destination.lat).toFixed(2)}°
                  {destination.lat < 0 ? "S" : "N"}
                  <br />
                  {Math.abs(destination.lng).toFixed(2)}°
                  {destination.lng < 0 ? "W" : "E"}
                </p>
              </div>
            )}
            <div className="p-6">
              <p className="atlas-meta">Selected destination</p>
              <h3 className="font-display text-3xl mt-3">
                {destination.label}
              </h3>
              <p className="atlas-meta mt-3">
                {Math.abs(destination.lat).toFixed(2)}°
                {destination.lat < 0 ? "S" : "N"} /{" "}
                {Math.abs(destination.lng).toFixed(2)}°
                {destination.lng < 0 ? "W" : "E"}
              </p>
              {visits?.length ? (
                visits.map((v) => (
                  <div className="atlas-visit" key={v.slug}>
                    <p className="atlas-meta">{v.date}</p>
                    <Link
                      href={`/field-notes/${v.slug}`}
                      className="font-display text-lg hover:text-[#e8b86d]"
                    >
                      {v.title} ↗
                    </Link>
                    <p className="text-sm text-paper/65 mt-2 leading-relaxed">
                      {v.summary}
                    </p>
                    {(destination.visits?.find(
                      (visit) => visit.href === `/field-notes/${v.slug}`,
                    )?.photoCount ?? 0) > 0 && (
                      <Link
                        className="atlas-button mt-4"
                        href={`/field-notes/${v.slug}#photo-journal`}
                      >
                        Open photo journal ↗
                      </Link>
                    )}
                    {v.youtubeVideoId && (
                      <a
                        className="atlas-button mt-4"
                        href={`https://www.youtube.com/watch?v=${v.youtubeVideoId}`}
                      >
                        Watch this journey ↗
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-paper/65 mt-5 leading-relaxed">
                  A documented map pin. A field note has not been published for
                  this place yet.
                </p>
              )}
            </div>
          </aside>
        ) : (
          <div className="empty-state">
            <p>No destinations match those filters.</p>
            <button
              className="atlas-button mt-4"
              type="button"
              onClick={() => {
                setQuery("");
                setRegion("All");
                setExperience("All");
              }}
            >
              Reset atlas filters
            </button>
          </div>
        )}
      </div>
      <p className="text-sm text-paper/55 mt-5">
        Pins show recorded destinations, not a reconstructed route. Map tiles
        need an internet connection; the destination list works independently.
      </p>
    </section>
  );
}
