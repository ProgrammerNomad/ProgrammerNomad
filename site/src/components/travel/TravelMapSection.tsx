"use client";

import dynamic from "next/dynamic";
import type { MapPlace } from "@/components/travel/TravelMap";

const TravelMap = dynamic(
  () => import("@/components/travel/TravelMap").then((m) => m.TravelMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] animate-pulse rounded-xl bg-elevated" />
    ),
  },
);

export function TravelMapSection({ places }: { places: MapPlace[] }) {
  return <TravelMap places={places} />;
}
