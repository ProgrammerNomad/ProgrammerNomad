import { describe, it, expect } from "vitest";
import { isLand, boundarySegments } from "./geography";

describe("sourced globe geography", () => {
  it("recognizes continents rather than bounding rectangles", () => {
    for (const [lat, lng] of [
      [28.6, 77.2],
      [48.8, 2.3],
      [-33.8, 151.2],
      [40.7, -74],
      [-23.5, -46.6],
    ])
      expect(isLand(lat, lng)).toBe(true);
    for (const [lat, lng] of [
      [0, -140],
      [0, 0],
      [0, 80],
      [30, -40],
    ])
      expect(isLand(lat, lng)).toBe(false);
  });
  it("uses finite short segments across the dateline", () => {
    expect(boundarySegments.length).toBeGreaterThan(5000);
    for (const { a, b } of boundarySegments) {
      expect([...a, ...b].every(Number.isFinite)).toBe(true);
      expect(Math.abs(a[0] - b[0])).toBeLessThanOrEqual(2.001);
      expect(Math.abs(a[1] - b[1])).toBeLessThanOrEqual(2.001);
    }
  });
});
