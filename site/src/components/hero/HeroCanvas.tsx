"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  FLIGHT_ROUTES,
  NOIDA_ORIGIN,
  TRAVEL_DESTINATIONS,
  createArcCurve,
  generateGlobeDots,
  generateGridLines,
  latLngToVector3,
} from "./globe-utils";

const GLOBE_RADIUS = 1.22;

function EarthGlobe({ paused }: { paused: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const sparksRef = useRef<(THREE.Mesh | null)[]>([]);
  const invalidate = useThree((s) => s.invalidate);

  // Rotation state with drag & momentum (initially facing India & Noida)
  const targetRot = useRef({ x: 0.18, y: 1.75 });
  const currentRot = useRef({ x: 0.18, y: 1.75 });
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // 1. Procedural land & ocean dot points
  const { landPositions, oceanPositions } = useMemo(
    () => generateGlobeDots(GLOBE_RADIUS, 1500),
    [],
  );

  // 2. Latitude and longitude grid line geometries
  const gridGeometries = useMemo(
    () => generateGridLines(GLOBE_RADIUS * 1.002),
    [],
  );

  // 3. Noida origin 3D position
  const noidaPos = useMemo(
    () => latLngToVector3(NOIDA_ORIGIN.lat, NOIDA_ORIGIN.lng, GLOBE_RADIUS * 1.01),
    [],
  );

  // 4. Travel destination 3D positions
  const destinationPositions = useMemo(
    () =>
      TRAVEL_DESTINATIONS.map((dest) => ({
        ...dest,
        vec: latLngToVector3(dest.lat, dest.lng, GLOBE_RADIUS * 1.008),
      })),
    [],
  );

  // 5. 3D Flight Bezier curves & line geometries
  const arcData = useMemo(() => {
    return FLIGHT_ROUTES.map((route) => {
      const destVec = latLngToVector3(route.lat, route.lng, GLOBE_RADIUS * 1.008);
      const { curve, points } = createArcCurve(noidaPos, destVec, GLOBE_RADIUS, 48);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return {
        ...route,
        curve,
        geometry,
        color: route.color,
      };
    });
  }, [noidaPos]);

  // Geometries for points and particles
  const landGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(landPositions, 3));
    return geom;
  }, [landPositions]);

  const oceanGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(oceanPositions, 3));
    return geom;
  }, [oceanPositions]);

  const ambientGeom = useMemo(() => {
    const count = 55;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.65 + Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geom;
  }, []);

  useEffect(() => {
    if (!paused) invalidate();
  }, [paused, invalidate]);

  // Animation frame loop
  useFrame((state, delta) => {
    if (paused || !groupRef.current) return;

    // Auto rotate when not actively dragging
    if (!isDragging.current) {
      targetRot.current.y += delta * 0.1;
    }

    // Smooth lerp rotation
    currentRot.current.x = THREE.MathUtils.lerp(
      currentRot.current.x,
      targetRot.current.x,
      0.08,
    );
    currentRot.current.y = THREE.MathUtils.lerp(
      currentRot.current.y,
      targetRot.current.y,
      0.08,
    );

    groupRef.current.rotation.x = currentRot.current.x;
    groupRef.current.rotation.y = currentRot.current.y;

    // Animate photon sparks along flight arcs
    const time = state.clock.getElapsedTime();
    arcData.forEach((arc, idx) => {
      const spark = sparksRef.current[idx];
      if (!spark) return;
      const t = (time * arc.speed + idx * 0.18) % 1;
      const pt = arc.curve.getPoint(t);
      spark.position.copy(pt);
      // Pulse scale as it traverses the peak altitude
      const scale = 1 + Math.sin(t * Math.PI) * 0.8;
      spark.scale.set(scale, scale, scale);
    });

    invalidate();
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={(e) => {
        isDragging.current = true;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={() => {
        isDragging.current = false;
      }}
      onPointerLeave={() => {
        isDragging.current = false;
      }}
      onPointerMove={(e) => {
        if (!isDragging.current) return;
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        targetRot.current.y += dx * 0.007;
        targetRot.current.x = THREE.MathUtils.clamp(
          targetRot.current.x + dy * 0.007,
          -1.1,
          1.1,
        );
      }}
    >
      {/* ── Base Earth Dark Core ── */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 48, 48]} />
        <meshStandardMaterial
          color="#080a08"
          roughness={0.88}
          metalness={0.12}
        />
      </mesh>

      {/* ── Inner Atmosphere Glow / Rim ── */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 1.015, 36, 36]} />
        <meshBasicMaterial
          color="#b5ff43"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── Outer Atmosphere Halo ── */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 1.12, 36, 36]} />
        <meshBasicMaterial
          color="#00d2ff"
          transparent
          opacity={0.035}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── Lat/Long Coordinate Grid Lines ── */}
      {gridGeometries.map((geom, i) => (
        <primitive
          key={i}
          object={
            new THREE.Line(
              geom,
              new THREE.LineBasicMaterial({
                color: "#b5ff43",
                transparent: true,
                opacity: 0.12,
              }),
            )
          }
        />
      ))}

      {/* ── Procedural Land Matrix Dots (Lime Glow) ── */}
      <points geometry={landGeom}>
        <pointsMaterial
          size={0.03}
          color="#b5ff43"
          transparent
          opacity={0.88}
          sizeAttenuation
        />
      </points>

      {/* ── Procedural Ocean Dots (Subtle) ── */}
      <points geometry={oceanGeom}>
        <pointsMaterial
          size={0.016}
          color="#1e2c1e"
          transparent
          opacity={0.3}
          sizeAttenuation
        />
      </points>

      {/* ── Noida Home Base HQ Pulse Dot ── */}
      <mesh position={noidaPos}>
        <sphereGeometry args={[0.038, 16, 16]} />
        <meshBasicMaterial color="#b5ff43" />
      </mesh>
      {/* Noida Origin Ring */}
      <mesh position={noidaPos}>
        <ringGeometry args={[0.05, 0.075, 24]} />
        <meshBasicMaterial
          color="#b5ff43"
          transparent
          opacity={0.75}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── Travel Destination Dots (31 hubs) ── */}
      {destinationPositions.map((dest, i) => (
        <mesh key={dest.label + i} position={dest.vec}>
          <sphereGeometry args={[0.024, 12, 12]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? "#b5ff43" : i % 3 === 1 ? "#00d2ff" : "#e8b86d"}
          />
        </mesh>
      ))}

      {/* ── 3D Volumetric Glowing Flight Arcs ── */}
      {arcData.map((arc, i) => (
        <mesh key={arc.dest + i}>
          <tubeGeometry args={[arc.curve, 36, 0.007, 6, false]} />
          <meshBasicMaterial
            color={arc.color}
            transparent
            opacity={0.88}
          />
        </mesh>
      ))}

      {/* ── Animated Flight Sparks / Traveling Photons ── */}
      {arcData.map((arc, i) => (
        <mesh
          key={`spark-${arc.dest}-${i}`}
          ref={(el) => {
            sparksRef.current[i] = el;
          }}
          position={noidaPos}
        >
          <sphereGeometry args={[0.014, 12, 12]} />
          <meshBasicMaterial
            color={arc.color}
          />
        </mesh>
      ))}

      {/* ── Ambient Orbiting Star / Tech Particles ── */}
      <points geometry={ambientGeom}>
        <pointsMaterial
          size={0.018}
          color="#b5ff43"
          transparent
          opacity={0.45}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

export function HeroCanvas({ paused }: { paused: boolean }) {
  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [0, 0, 4.35], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", cursor: "grab" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 5, 3]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-4, -3, -2]} intensity={0.4} color="#00d2ff" />
      <EarthGlobe paused={paused} />
    </Canvas>
  );
}
