/** A destination may have several published visits, but occupies one atlas pin. */
export type TravelDestination = {
  id: string;
  label: string;
  lat: number;
  lng: number;
  stories: string[];
  visits?: {
    href: string;
    title: string;
    date: string;
    cover?: string;
    photoCount: number;
    videoId?: string;
  }[];
};

type Place = { label: string; lat: number; lng: number; href?: string };

/** Uses the same coordinate precision as the existing travel-map merger. */
export function groupTravelDestinations(places: Place[]): TravelDestination[] {
  const destinations = new Map<string, TravelDestination>();
  for (const place of places) {
    if (
      !Number.isFinite(place.lat) ||
      !Number.isFinite(place.lng) ||
      Math.abs(place.lat) > 90 ||
      Math.abs(place.lng) > 180
    )
      continue;
    const id = `${place.lat.toFixed(2)}:${place.lng.toFixed(2)}`;
    const destination = destinations.get(id) ?? {
      id,
      label: place.label,
      lat: place.lat,
      lng: place.lng,
      stories: [],
    };
    if (place.href && !destination.stories.includes(place.href)) {
      destination.stories.push(place.href);
    }
    destinations.set(id, destination);
  }
  return [...destinations.values()];
}
