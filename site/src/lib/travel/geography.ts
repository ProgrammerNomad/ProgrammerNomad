import worldRings from "./data/world-rings.json";

export type Coordinate = [number, number];
export const geography = worldRings as Coordinate[][];
const regions = geography.map((ring) => ({
  ring,
  minX: Math.min(...ring.map((p) => p[0])),
  maxX: Math.max(...ring.map((p) => p[0])),
  minY: Math.min(...ring.map((p) => p[1])),
  maxY: Math.max(...ring.map((p) => p[1])),
}));

export function isLand(lat: number, lng: number) {
  return regions.some(({ ring, minX, maxX, minY, maxY }) => {
    if (lng < minX || lng > maxX || lat < minY || lat > maxY) return false;
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i],
        [xj, yj] = ring[j];
      if (
        yi > lat !== yj > lat &&
        lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
      )
        inside = !inside;
    }
    return inside;
  });
}

/** Short, dateline-safe segments avoid chords cutting through the sphere. */
export function geographicSegments() {
  const unique = new Map<
    string,
    { a: Coordinate; b: Coordinate; shared: boolean }
  >();
  for (const ring of geography)
    for (let i = 1; i < ring.length; i++) {
      const a = ring[i - 1],
        b = ring[i];
      const key = [a.join(","), b.join(",")].sort().join("/");
      const previous = unique.get(key);
      if (previous) previous.shared = true;
      else unique.set(key, { a, b, shared: false });
    }
  const result: { a: Coordinate; b: Coordinate; shared: boolean }[] = [];
  for (const { a, b, shared } of unique.values()) {
    let dx = b[0] - a[0];
    if (dx > 180) dx -= 360;
    if (dx < -180) dx += 360;
    const steps = Math.max(
      1,
      Math.ceil(Math.max(Math.abs(dx), Math.abs(b[1] - a[1])) / 2),
    );
    for (let i = 0; i < steps; i++)
      result.push({
        a: [a[0] + (dx * i) / steps, a[1] + ((b[1] - a[1]) * i) / steps],
        b: [
          a[0] + (dx * (i + 1)) / steps,
          a[1] + ((b[1] - a[1]) * (i + 1)) / steps,
        ],
        shared,
      });
  }
  return result;
}
export const boundarySegments = geographicSegments();
