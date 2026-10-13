"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

function Sculpture({ paused }: { paused: boolean }) {
  const mesh = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (paused || !mesh.current) return;
    mesh.current.rotation.y += delta * 0.25;
    mesh.current.rotation.x += delta * 0.08;
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.2, 1]} />
      <meshStandardMaterial
        color="#0B0C0B"
        emissive="#B5FF43"
        emissiveIntensity={0.15}
        wireframe
      />
    </mesh>
  );
}

export function HeroCanvas({ paused }: { paused: boolean }) {
  return (
    <Canvas
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
