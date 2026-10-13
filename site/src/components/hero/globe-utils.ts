import * as THREE from "three";

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
 * Stylized continental regions, not a geographic boundary dataset.
 */
function isLandCoordinate(lat: number, lng: number): boolean {
  // India & South Asia (Shiv's primary base)
  if (lat >= 6 && lat <= 37 && lng >= 68 && lng <= 97) return true;

  // Southeast Asia & Thailand
  if (lat >= -10 && lat <= 25 && lng >= 95 && lng <= 145) return true;

  // East Asia (China, Korea, Japan)
  if (lat >= 20 && lat <= 50 && lng >= 100 && lng <= 145) return true;

  // Middle East & Central Asia
  if (lat >= 12 && lat <= 45 && lng >= 35 && lng <= 75) return true;

  // Europe
  if (lat >= 36 && lat <= 71 && lng >= -10 && lng <= 50) return true;

  // Africa
  if (lat >= -35 && lat <= 37 && lng >= -17 && lng <= 51) return true;

  // North America
  if (lat >= 15 && lat <= 72 && lng >= -165 && lng <= -55) return true;

  // South America
  if (lat >= -55 && lat <= 12 && lng >= -80 && lng <= -35) return true;

  // Australia & New Zealand
  if (lat >= -45 && lat <= -10 && lng >= 113 && lng <= 178) return true;

  // Northern Eurasia / Siberia
  if (lat >= 50 && lat <= 75 && lng >= 50 && lng <= 180) return true;

  return false;
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

    const isLand = isLandCoordinate(lat, lng);
    const px = x * radius;
    const py = y * radius;
    const pz = z * radius;

    if (isLand) {
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
