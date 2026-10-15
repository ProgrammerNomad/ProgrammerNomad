"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { GeographicLines } from "./GeographicLines";
import type { TravelDestination } from "@/lib/travel/destinations";
import {
  generateGlobeDots,
  generateGridLines,
  latLngToVector3,
} from "./globe-utils";

const GLOBE_RADIUS = 1.22;
type AtlasProps = {
  destinations: TravelDestination[];
  selected: TravelDestination;
  turn: number;
  paused: boolean;
  autoRotate: boolean;
  onReady: () => void;
  onError: () => void;
  onInteraction: () => void;
};

function AtlasContours() {
  return (
    <>
      <mesh rotation={[1.15, 0.25, 0.55]}>
        <torusGeometry args={[1.46, 0.004, 6, 96]} />
        <meshBasicMaterial color="#b5ff43" transparent opacity={0.22} />
      </mesh>
    </>
  );
}

function CanvasHealth({
  onReady,
  onError,
}: Pick<AtlasProps, "onReady" | "onError">) {
  const { gl, invalidate } = useThree();
  const reported = useRef(false);
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onError();
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onError]);
  useFrame(() => {
    if (reported.current) return;
    // A previous frame must actually have drawn geometry, not merely mounted a canvas.
    if (gl.info.render.calls > 0) {
      reported.current = true;
      onReady();
    } else invalidate();
  });
  return null;
}

function EarthGlobe({
  destinations,
  selected,
  turn,
  paused,
  autoRotate,
  onInteraction,
}: AtlasProps) {
  const groupRef = useRef<THREE.Group>(null);
  const invalidate = useThree((s) => s.invalidate);
  const target = useRef({
    x: (selected.lat * Math.PI) / 180,
    y: -Math.PI / 2 - (selected.lng * Math.PI) / 180,
  });
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const previousTurn = useRef(turn);
  const { landPositions, oceanPositions } = useMemo(
    () => generateGlobeDots(GLOBE_RADIUS * 1.006, 6500),
    [],
  );
  const gridLines = useMemo(
    () =>
      generateGridLines(GLOBE_RADIUS * 1.002).map(
        (geometry) =>
          new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({
              color: "#b5ff43",
              transparent: true,
              opacity: 0.07,
            }),
          ),
      ),
    [],
  );
  const positions = useMemo(
    () =>
      destinations.map((place) => ({
        ...place,
        vector: latLngToVector3(place.lat, place.lng, GLOBE_RADIUS * 1.018),
      })),
    [destinations],
  );

  useEffect(
    () => () =>
      gridLines.forEach((line) => {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      }),
    [gridLines],
  );
  useEffect(() => {
    target.current = {
      x: (selected.lat * Math.PI) / 180,
      y: -Math.PI / 2 - (selected.lng * Math.PI) / 180,
    };
    previousTurn.current = 0;
    invalidate();
  }, [selected, invalidate]);
  useEffect(() => {
    target.current.y += ((turn - previousTurn.current) * Math.PI) / 6;
    previousTurn.current = turn;
    invalidate();
  }, [turn, invalidate]);
  useEffect(() => {
    if (!paused) invalidate();
  }, [paused, autoRotate, invalidate]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (paused || !group) return;
    if (autoRotate && !dragging.current)
      target.current.y += Math.min(delta, 0.05) * 0.16;
    const factor = 1 - Math.exp(-8 * Math.min(delta, 0.05));
    group.rotation.x = THREE.MathUtils.lerp(
      group.rotation.x,
      target.current.x,
      factor,
    );
    group.rotation.y = THREE.MathUtils.lerp(
      group.rotation.y,
      target.current.y,
      factor,
    );
    if (
      autoRotate ||
      Math.abs(group.rotation.x - target.current.x) +
        Math.abs(group.rotation.y - target.current.y) >
        0.001
    )
      invalidate();
  });

  return (
    <group
      ref={groupRef}
      rotation={[
        (selected.lat * Math.PI) / 180,
        -Math.PI / 2 - (selected.lng * Math.PI) / 180,
        0,
      ]}
      onPointerDown={(event) => {
        // Keep touch scrolling native; buttons and the destination picker work for everyone.
        if (event.pointerType === "touch") return;
        onInteraction();
        dragging.current = true;
        lastPointer.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerLeave={() => {
        dragging.current = false;
      }}
      onPointerMove={(event) => {
        if (!dragging.current) return;
        target.current.y += (event.clientX - lastPointer.current.x) * 0.007;
        target.current.x = THREE.MathUtils.clamp(
          target.current.x + (event.clientY - lastPointer.current.y) * 0.007,
          -1.4,
          1.4,
        );
        lastPointer.current = { x: event.clientX, y: event.clientY };
        invalidate();
      }}
    >
      <AtlasContours />
      <GeographicLines radius={GLOBE_RADIUS * 1.007} />
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 48, 48]} />
        <meshStandardMaterial
          color="#080a08"
          roughness={0.88}
          metalness={0.12}
        />
      </mesh>
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
      {gridLines.map((line, index) => (
        <primitive key={index} object={line} />
      ))}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[landPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.012}
          color="#b5ff43"
          transparent
          opacity={0.32}
          sizeAttenuation
        />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[oceanPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.014}
          color="#55735d"
          transparent
          opacity={0.08}
          sizeAttenuation
        />
      </points>
      {positions.map((place) => (
        <mesh key={place.id} position={place.vector}>
          <sphereGeometry
            args={[place.id === selected.id ? 0.026 : 0.009, 12, 12]}
          />
          <meshBasicMaterial
            color={place.id === selected.id ? "#ffffff" : "#79d8ec"}
          />
        </mesh>
      ))}
    </group>
  );
}

export function HeroCanvas(props: AtlasProps) {
  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [0, 0, 5.35], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{
        width: "100%",
        height: "100%",
        cursor: "grab",
        touchAction: "pan-y",
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 5, 3]} intensity={1.5} color="#ffffff" />
      <directionalLight
        position={[-4, -3, -2]}
        intensity={0.4}
        color="#00d2ff"
      />
      <EarthGlobe {...props} />
      <CanvasHealth onReady={props.onReady} onError={props.onError} />
    </Canvas>
  );
}
