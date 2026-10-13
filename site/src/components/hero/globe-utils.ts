import * as THREE from "three";

export interface GeoLocation {
  label: string;
  lat: number;
  lng: number;
  slug?: string;
  isOrigin?: boolean;
}

export const NOIDA_ORIGIN: GeoLocation = {
  label: "Noida (HQ)",
  lat: 28.5355,
  lng: 77.391,
  isOrigin: true,
};

export const TRAVEL_DESTINATIONS: GeoLocation[] = [
  { label: "Leh, Ladakh", lat: 34.15, lng: 77.58 },
  { label: "Bangkok, Thailand", lat: 13.76, lng: 100.5 },
  { label: "Kochi, Kerala", lat: 9.93, lng: 76.27 },
  { label: "Udaipur, Rajasthan", lat: 24.5854, lng: 73.7125 },
  { label: "Srinagar, Kashmir", lat: 34.08, lng: 74.8 },
  { label: "Manali, HP", lat: 32.24, lng: 77.19 },
  { label: "Mandrem, Goa", lat: 15.66, lng: 73.71 },
  { label: "Rishikesh, UK", lat: 30.14, lng: 78.38, slug: "rishikesh-2026" },
  { label: "Jaipur, Rajasthan", lat: 26.91, lng: 75.79 },
  { label: "Shimla, HP", lat: 31.1, lng: 77.17 },
  { label: "Amritsar, Punjab", lat: 31.62, lng: 74.88 },
  { label: "Pangi Valley, HP", lat: 33.07, lng: 76.35 },
  { label: "Diskit, Nubra", lat: 34.54, lng: 77.56 },
  { label: "Keylong, Lahaul", lat: 32.57, lng: 77.03 },
  { label: "Jispa, Lahaul", lat: 32.64, lng: 77.18 },
  { label: "Dalhousie, HP", lat: 32.54, lng: 75.97 },
  { label: "Agra, UP", lat: 27.18, lng: 78.01 },
  { label: "Fatehpur Sikri", lat: 27.0945, lng: 77.6679 },
  { label: "Lucknow, UP", lat: 26.85, lng: 80.95 },
  { label: "Dehradun, UK", lat: 30.32, lng: 78.03 },
  { label: "Mussoorie, UK", lat: 30.46, lng: 78.07 },
  { label: "Nainital, UK", lat: 29.38, lng: 79.46 },
  { label: "Devprayag, UK", lat: 30.15, lng: 78.6 },
  { label: "Haridwar, UK", lat: 29.95, lng: 78.16 },
  { label: "Chitrakoot Dham", lat: 25.17, lng: 80.86 },
  { label: "Kota, Rajasthan", lat: 25.21, lng: 75.86 },
  { label: "Vidisha, MP", lat: 23.52, lng: 77.81 },
  { label: "Jammu, J&K", lat: 32.73, lng: 74.86 },
  { label: "Pithoragarh, UK", lat: 29.58, lng: 80.22 },
  { label: "Madkote, UK", lat: 30.0, lng: 80.25 },
  { label: "Madhmaheshwar", lat: 30.5833, lng: 79.2167 },
];

// Major long-distance routes radiating from home base for flight arcs
export const FLIGHT_ROUTES = [
  { dest: "Leh, Ladakh", lat: 34.15, lng: 77.58, color: "#b5ff43", speed: 0.35 },
  { dest: "Bangkok, Thailand", lat: 13.76, lng: 100.5, color: "#00d2ff", speed: 0.28 },
  { dest: "Kochi, Kerala", lat: 9.93, lng: 76.27, color: "#e8b86d", speed: 0.32 },
  { dest: "Udaipur, Rajasthan", lat: 24.5854, lng: 73.7125, color: "#b5ff43", speed: 0.4 },
  { dest: "Srinagar, Kashmir", lat: 34.08, lng: 74.8, color: "#00d2ff", speed: 0.38 },
  { dest: "Mandrem, Goa", lat: 15.66, lng: 73.71, color: "#e8b86d", speed: 0.3 },
  { dest: "Manali, HP", lat: 32.24, lng: 77.19, color: "#b5ff43", speed: 0.45 },
  { dest: "Diskit, Nubra", lat: 34.54, lng: 77.56, color: "#b5ff43", speed: 0.33 },
];

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
 * Creates a curved 3D quadratic arc rising above the sphere surface.
 */
export function createArcCurve(
  startVec: THREE.Vector3,
  endVec: THREE.Vector3,
  radius: number,
  samples = 40,
): { curve: THREE.CubicBezierCurve3; points: THREE.Vector3[] } {
  const distance = startVec.distanceTo(endVec);
  const altitude = radius + Math.max(0.14, Math.min(distance * 0.6, radius * 0.5));

  const mid = new THREE.Vector3()
    .addVectors(startVec, endVec)
    .multiplyScalar(0.5)
    .normalize()
    .multiplyScalar(altitude);

  const control1 = new THREE.Vector3().lerpVectors(startVec, mid, 0.6).normalize().multiplyScalar(altitude * 0.95);
  const control2 = new THREE.Vector3().lerpVectors(endVec, mid, 0.6).normalize().multiplyScalar(altitude * 0.95);

  const curve = new THREE.CubicBezierCurve3(startVec, control1, control2, endVec);
  const points = curve.getPoints(samples);
  return { curve, points };
}

/**
 * Determines whether lat/lng falls within major continental land regions.
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
    const lng = ((Math.atan2(z, -x) * 180) / Math.PI) - 180;

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
      points.push(new THREE.Vector3(Math.cos(angle) * ringRadius, y, Math.sin(angle) * ringRadius));
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
