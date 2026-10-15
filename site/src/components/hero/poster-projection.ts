import type { TravelDestination } from "@/lib/travel/destinations";
export function projectDestination(
  place: Pick<TravelDestination, "lat" | "lng">,
  center: Pick<TravelDestination, "lat" | "lng">,
) {
  const radians = Math.PI / 180;
  const lat = place.lat * radians,
    origin = center.lat * radians,
    delta = (place.lng - center.lng) * radians;
  return {
    x: 300 + 190 * Math.cos(lat) * Math.sin(delta),
    y:
      300 -
      190 *
        (Math.cos(origin) * Math.sin(lat) -
          Math.sin(origin) * Math.cos(lat) * Math.cos(delta)),
    visible:
      Math.sin(origin) * Math.sin(lat) +
        Math.cos(origin) * Math.cos(lat) * Math.cos(delta) >
      0,
  };
}
