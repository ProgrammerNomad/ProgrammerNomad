"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { Mesh } from "three";

function Sculpture({ paused }: { paused: boolean }) {
  const mesh = useRef<Mesh>(null);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    if (!paused) invalidate();
  }, [paused, invalidate]);

  useFrame((_, delta) => {
    if (paused || !mesh.current) return;
    mesh.current.rotation.y += delta * 0.25;
    mesh.current.rotation.x += delta * 0.08;
    invalidate();
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.15, 2]} />
      <meshStandardMaterial
        color="#0B0C0B"
        emissive="#B5FF43"
        emissiveIntensity={0.2}
        wireframe
      />
    </mesh>
  );
}

export function HeroCanvas({ paused }: { paused: boolean }) {
  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [0, 0, 4], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 4, 2]} intensity={1.2} />
      <Sculpture paused={paused} />
    </Canvas>
  );
}
