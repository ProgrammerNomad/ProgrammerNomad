import type { MapPlace } from "@/components/travel/TravelMap";
import { getMergedTravelPlaces } from "@/lib/travel/merge-places";

export async function getTravelMapPlaces(): Promise<MapPlace[]> {
  return getMergedTravelPlaces();
}
