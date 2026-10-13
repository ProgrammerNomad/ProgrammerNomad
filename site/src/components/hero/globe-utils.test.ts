import { describe, expect, it } from "vitest";
import { Euler } from "three";
import { generateGlobeDots, latLngToVector3 } from "./globe-utils";
import { projectDestination } from "./HeroPoster";

describe("atlas geometry", () => {
  it.each([
    { lat: 30.5833, lng: 79.2167 },
    { lat: -33.86, lng: 151.2 },
    { lat: 40.71, lng: -74 },
  ])("centers a selected location in both renderers: %o", (place) => {
    const projected = projectDestination(place, place);
    expect(projected.x).toBeCloseTo(300);
    expect(projected.y).toBeCloseTo(300);
    expect(projected.visible).toBe(true);
    const vector = latLngToVector3(place.lat, place.lng, 1).applyEuler(
      new Euler(
        (place.lat * Math.PI) / 180,
        -Math.PI / 2 - (place.lng * Math.PI) / 180,
        0,
      ),
    );
    expect(vector.x).toBeCloseTo(0);
    expect(vector.y).toBeCloseTo(0);
    expect(vector.z).toBeCloseTo(1);
  });

  it("hides the far hemisphere on the poster", () => {
    expect(
      projectDestination({ lat: 0, lng: 180 }, { lat: 0, lng: 0 }).visible,
    ).toBe(false);
  });

  it("generates finite points in both eastern and western land regions", () => {
    const { landPositions } = generateGlobeDots(1);
    const points = Array.from(landPositions);
    expect(points.every(Number.isFinite)).toBe(true);
    expect(points.some((value, index) => index % 3 === 2 && value < -0.4)).toBe(
      true,
    );
    expect(points.some((value, index) => index % 3 === 2 && value > 0.4)).toBe(
      true,
    );
  });
});
