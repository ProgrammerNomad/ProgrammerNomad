// Reproducible build-time conversion; no geographic service is needed at runtime.
import fs from "node:fs/promises";
const revision = "f1890d9f152c896d250a77557a5751a93d494776";
const url = `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/${revision}/geojson/ne_110m_admin_0_countries.geojson`;
const response = await fetch(url);
if (!response.ok) throw new Error(`Geography download: ${response.status}`);
const source = await response.json();
function simplify(points, tolerance = 0.25) {
  if (points.length <= 3) return points;
  const start = points[0],
    end = points.at(-1);
  let farthest = 0,
    index = 0;
  const dx = end[0] - start[0],
    dy = end[1] - start[1],
    norm = dx * dx + dy * dy;
  for (let i = 1; i < points.length - 1; i++) {
    const t = norm
      ? Math.max(
          0,
          Math.min(
            1,
            ((points[i][0] - start[0]) * dx + (points[i][1] - start[1]) * dy) /
              norm,
          ),
        )
      : 0;
    const distance =
      (points[i][0] - start[0] - t * dx) ** 2 +
      (points[i][1] - start[1] - t * dy) ** 2;
    if (distance > farthest) {
      farthest = distance;
      index = i;
    }
  }
  return farthest > tolerance ** 2
    ? [
        ...simplify(points.slice(0, index + 1), tolerance).slice(0, -1),
        ...simplify(points.slice(index), tolerance),
      ]
    : [start, end];
}
const rings = source.features.flatMap((feature) => {
  const polygons =
    feature.geometry.type === "Polygon"
      ? [feature.geometry.coordinates]
      : feature.geometry.coordinates;
  return polygons
    .map((polygon) =>
      simplify(polygon[0]).map((p) => p.map((n) => Math.round(n * 100) / 100)),
    )
    .filter((ring) => ring.length > 3);
});
await fs.mkdir("src/lib/travel/data", { recursive: true });
await fs.writeFile(
  "src/lib/travel/data/world-rings.json",
  JSON.stringify(rings),
);
console.log(
  JSON.stringify({
    revision,
    rings: rings.length,
    points: rings.reduce((n, r) => n + r.length, 0),
    bytes: JSON.stringify(rings).length,
  }),
);
