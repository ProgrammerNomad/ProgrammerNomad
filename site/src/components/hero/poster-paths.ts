import { boundarySegments } from "@/lib/travel/geography";
import { projectDestination } from "./poster-projection";
export function getPosterPaths(center: { lat: number; lng: number }) {
  return [false, true].map((shared) =>
    boundarySegments
      .filter((s) => s.shared === shared)
      .map(({ a, b }) => {
        const from = projectDestination({ lat: a[1], lng: a[0] }, center),
          to = projectDestination({ lat: b[1], lng: b[0] }, center);
        return from.visible && to.visible
          ? `M${from.x.toFixed(1)},${from.y.toFixed(1)}L${to.x.toFixed(1)},${to.y.toFixed(1)}`
          : "";
      })
      .join(""),
  );
}
