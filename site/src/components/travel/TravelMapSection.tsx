"use client";

import dynamic from "next/dynamic";
import type { MapPlace } from "@/components/travel/TravelMap";

const TravelMap = dynamic(
  () => import("@/components/travel/TravelMap").then((m) => m.TravelMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-[420px] flex items-center justify-center rounded-xl bg-elevated text-sm text-paper/65"
        role="status"
      >
        Loading map. Destinations are available in the list below.
      </div>
    ),
  },
);

export function TravelMapSection({
  places,
  selectedId,
  onSelect,
}: {
  places: MapPlace[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}) {
  return (
    <TravelMap places={places} selectedId={selectedId} onSelect={onSelect} />
  );
}
