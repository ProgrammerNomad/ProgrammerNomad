"use client";
import { useMemo } from "react";
import { boundarySegments } from "@/lib/travel/geography";
import { latLngToVector3 } from "./globe-utils";

export function GeographicLines({
  radius,
  theme,
}: {
  radius: number;
  theme: "dark" | "light";
}) {
  const layers = useMemo(
    () =>
      [false, true].map(
        (shared) =>
          new Float32Array(
            boundarySegments
              .filter((s) => s.shared === shared)
              .flatMap(({ a, b }) => [
                ...latLngToVector3(a[1], a[0], radius).toArray(),
                ...latLngToVector3(b[1], b[0], radius).toArray(),
              ]),
          ),
      ),
    [radius],
  );
  return (
    <>
      {layers.map((positions, i) => (
        <lineSegments key={i} renderOrder={1}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={
              theme === "light"
                ? i
                  ? "#78906b"
                  : "#435c3c"
                : i
                  ? "#6f8957"
                  : "#b2c69c"
            }
            transparent
            opacity={theme === "light" ? (i ? 0.5 : 0.78) : i ? 0.48 : 0.75}
            depthTest
            depthWrite={false}
          />
        </lineSegments>
      ))}
    </>
  );
}
