import * as THREE from "three";
import { isLand } from "@/lib/travel/geography";

/**
 * Converts spherical latitude and longitude (in degrees) to 3D Cartesian coordinates.
 */
export function latLngToVector3(
  lat: number,
  lng: number,
  radius: number,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

/**
 * Generates procedural Fibonacci land dots around the globe.
 */
export function generateGlobeDots(
  radius: number,
  count = 1400,
): { landPositions: Float32Array; oceanPositions: Float32Array } {
  const landPoints: number[] = [];
  const oceanPoints: number[] = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
    const r = Math.sqrt(1 - y * y); // radius at y
    const theta = (2 * Math.PI * i) / goldenRatio;

    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;

    // Convert (x, y, z) back to lat/lng
    const lat = 90 - (Math.acos(y) * 180) / Math.PI;
    const lng = (Math.atan2(-z, x) * 180) / Math.PI;

    const land = isLand(lat, lng);
    const px = x * radius;
    const py = y * radius;
    const pz = z * radius;

    if (land) {
      landPoints.push(px, py, pz);
    } else if (i % 3 === 0) {
      // sparse ocean points
      oceanPoints.push(px, py, pz);
    }
  }

  return {
    landPositions: new Float32Array(landPoints),
    oceanPositions: new Float32Array(oceanPoints),
  };
}

/**
 * Generates latitude and longitude grid line segments.
 */
export function generateGridLines(radius: number): THREE.BufferGeometry[] {
  const geometries: THREE.BufferGeometry[] = [];

  // Parallels (latitude rings)
  const lats = [-60, -30, 0, 30, 60];
  for (const lat of lats) {
    const phi = (90 - lat) * (Math.PI / 180);
    const ringRadius = radius * Math.sin(phi);
    const y = radius * Math.cos(phi);

    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * ringRadius,
          y,
          Math.sin(angle) * ringRadius,
        ),
      );
    }
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    geometries.push(geom);
  }

  // Meridians (longitude rings)
  const lngs = [0, 60, 120];
  for (const lng of lngs) {
    const points: THREE.Vector3[] = [];
    const theta = (lng * Math.PI) / 180;

    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      const x = Math.sin(angle) * Math.cos(theta) * radius;
      const z = Math.sin(angle) * Math.sin(theta) * radius;
      const y = Math.cos(angle) * radius;
      points.push(new THREE.Vector3(x, y, z));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    geometries.push(geom);
  }

  return geometries;
}
