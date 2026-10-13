"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { HeroSculptureSkeleton } from "@/components/hero/HeroSculptureSkeleton";
import { TRAVEL_DESTINATIONS } from "./globe-utils";

const HeroCanvas = dynamic(
  () => import("./HeroCanvas").then((m) => m.HeroCanvas),
  {
    ssr: false,
    loading: () => <HeroSculptureSkeleton />,
  },
);

void import("./HeroCanvas");

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function probeWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

export function HeroArt() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);
  const [webglReady, setWebglReady] = useState(false);
  const [show3d, setShow3d] = useState(false);
  const [canvasVisible, setCanvasVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    if (!probeWebGL()) {
      setWebglFailed(true);
      return;
    }
    setWebglReady(true);
  }, [reducedMotion]);

  useEffect(() => {
    if (!webglReady || reducedMotion || webglFailed) return;
    let cancelled = false;
    const enable = () => {
      if (!cancelled) setShow3d(true);
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(enable, { timeout: 300 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }
    const timeoutId = window.setTimeout(enable, 300);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [webglReady, reducedMotion, webglFailed]);

  useEffect(() => {
    if (!show3d) return;
    const t = window.setTimeout(() => setCanvasVisible(true), 50);
    return () => window.clearTimeout(t);
  }, [show3d]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) setPaused(true);
      else {
        const node = containerRef.current;
        if (!node) {
          setPaused(false);
          return;
        }
        const rect = node.getBoundingClientRect();
        const inView =
          rect.top < window.innerHeight &&
          rect.bottom > 0 &&
          rect.left < window.innerWidth &&
          rect.right > 0;
        setPaused(!inView);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const showCanvas = show3d && !reducedMotion && !webglFailed;
  const hidePoster = showCanvas && canvasVisible;

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full max-w-[860px] sm:aspect-[1.1/1] lg:aspect-[1.22/1] min-h-[520px] sm:min-h-[600px] lg:min-h-[700px]"
      role="img"
      aria-label={`Orbital Atlas: a generative travel and engineering sculpture with ${TRAVEL_DESTINATIONS.length} logged destinations.`}
    >
      {/* ── Soft Radial Glow Aura behind the globe ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-80"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(181, 255, 67, 0.15) 0%, rgba(0, 210, 255, 0.08) 42%, transparent 70%)",
        }}
      />

      {/* ── Fallback Poster ── */}
      <Image
        src="/hero-poster.svg"
        alt=""
        fill
        priority
        className={`object-contain transition-opacity duration-700 ${hidePoster ? "opacity-0" : "opacity-100"}`}
        sizes="(max-width: 768px) 100vw, 800px"
      />

      {/* ── Live 3D Canvas ── */}
      {showCanvas ? (
        <div
          className={`absolute inset-0 z-10 transition-opacity duration-700 ${canvasVisible ? "opacity-100" : "opacity-0"}`}
        >
          <HeroCanvas paused={paused} />
        </div>
      ) : null}

      {/* ── Floating HUD Telemetry Chips ── */}
      <div className="pointer-events-none absolute inset-x-2 top-2 z-20 flex items-center justify-between text-[11px] font-mono text-paper/70 sm:inset-x-6 sm:top-4">
        <div className="flex items-center gap-2 rounded-full border border-paper/10 bg-canvas/80 px-3 py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-lime shadow-[0_0_8px_#b5ff43]" />
          </span>
          <span className="text-paper/90 font-semibold tracking-wider">ORBITAL ATLAS // LIVE</span>
        </div>
        <span className="hidden sm:inline rounded-full border border-paper/10 bg-canvas/80 px-3 py-1.5 backdrop-blur-md text-lime/90 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          {TRAVEL_DESTINATIONS.length} NODES LOGGED
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-2 bottom-2 z-20 flex items-center justify-between text-[10px] font-mono text-paper/60 sm:inset-x-6 sm:bottom-4">
        <div className="rounded-full border border-paper/10 bg-canvas/80 px-3 py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          ORIGIN: <span className="text-lime font-semibold">NOIDA HQ [28.53°N]</span>
        </div>
        <div className="rounded-full border border-paper/10 bg-canvas/80 px-3 py-1.5 backdrop-blur-md text-paper/80 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          COMPUTATIONAL SCULPTURE
        </div>
      </div>

    </div>
  );
}
