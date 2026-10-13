"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { HeroSculptureSkeleton } from "@/components/hero/HeroSculptureSkeleton";

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
      className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl border border-paper/10 bg-elevated/20 p-2 md:aspect-[4/5]"
      aria-hidden
    >
      {/* ── Radial Glow Aura behind the globe ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-80"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(181, 255, 67, 0.12) 0%, rgba(0, 210, 255, 0.06) 45%, transparent 72%)",
        }}
      />

      {/* ── Fallback Poster ── */}
      <Image
        src="/hero-poster.svg"
        alt=""
        fill
        priority
        className={`object-contain transition-opacity duration-700 ${hidePoster ? "opacity-0" : "opacity-100"}`}
        sizes="(max-width: 768px) 100vw, 400px"
      />

      {/* ── Live 3D Canvas ── */}
      {showCanvas ? (
        <div
          className={`absolute inset-0 z-10 transition-opacity duration-700 ${canvasVisible ? "opacity-100" : "opacity-0"}`}
        >
          <HeroCanvas paused={paused} />
        </div>
      ) : null}

      {/* ── HUD Telemetry Overlay (Click-through) ── */}
      <div className="pointer-events-none absolute inset-x-3 top-3 z-20 flex items-center justify-between text-[11px] font-mono text-paper/70">
        <div className="flex items-center gap-1.5 rounded-full border border-paper/10 bg-canvas/80 px-2.5 py-1 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
          </span>
          <span className="text-paper/90 font-semibold tracking-wider">GEO-MATRIX // ONLINE</span>
        </div>
        <span className="hidden sm:inline rounded-full border border-paper/10 bg-canvas/80 px-2.5 py-1 backdrop-blur-sm text-lime/90">
          31 NODES LOGGED
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex items-center justify-between text-[10px] font-mono text-paper/60">
        <div className="rounded-full border border-paper/10 bg-canvas/80 px-2.5 py-1 backdrop-blur-sm">
          ORIGIN: <span className="text-lime">NOIDA HQ [28.53°N]</span>
        </div>
        <div className="rounded-full border border-paper/10 bg-canvas/80 px-2.5 py-1 backdrop-blur-sm text-paper/80">
          DRAG TO ROTATE ↺
        </div>
      </div>

      {show3d && !reducedMotion ? (
        <span className="sr-only">Interactive 3D Earth globe with flight paths</span>
      ) : null}
    </div>
  );
}
