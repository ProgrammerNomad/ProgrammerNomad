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
      className="relative aspect-square w-full max-w-md overflow-hidden md:aspect-[4/5]"
      aria-hidden
    >
      <Image
        src="/hero-poster.svg"
        alt=""
        fill
        priority
        className={`object-contain transition-opacity duration-700 ${hidePoster ? "opacity-0" : "opacity-100"}`}
        sizes="(max-width: 768px) 100vw, 400px"
      />
      {showCanvas ? (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${canvasVisible ? "opacity-100" : "opacity-0"}`}
        >
          <HeroCanvas paused={paused} />
        </div>
      ) : null}
      {show3d && !reducedMotion ? (
        <span className="sr-only">Generative hero sculpture</span>
      ) : null}
    </div>
  );
}
