"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const HeroCanvas = dynamic(
  () => import("./HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false },
);

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

export function HeroArt() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [show3d, setShow3d] = useState(false);
  const [paused, setPaused] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || webglFailed) return;
    let cancelled = false;
    const enable = () => {
      if (!cancelled) setShow3d(true);
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(enable, { timeout: 2000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }
    const timeoutId = window.setTimeout(enable, 800);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [reducedMotion, webglFailed]);

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
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const showCanvas = show3d && !reducedMotion && !webglFailed;

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl border border-paper/10 bg-elevated md:aspect-[4/5]"
      aria-hidden
    >
      <Image
        src="/hero-poster.webp"
        alt=""
        fill
        priority
        className={`object-cover transition-opacity duration-700 ${showCanvas ? "opacity-0" : "opacity-100"}`}
        sizes="(max-width: 768px) 100vw, 400px"
      />
      {showCanvas ? (
        <div className="absolute inset-0">
          <HeroCanvas paused={paused} />
        </div>
      ) : null}
      {show3d && !reducedMotion ? (
        <span className="sr-only">Generative hero sculpture</span>
      ) : null}
      {/* Probe WebGL once before mounting canvas */}
      {show3d && !reducedMotion && webglFailed ? null : null}
      <WebGLProbe onFail={() => setWebglFailed(true)} enabled={show3d && !reducedMotion} />
    </div>
  );
}

function WebGLProbe({
  onFail,
  enabled,
}: {
  onFail: () => void;
  enabled: boolean;
}) {
  useEffect(() => {
    if (!enabled) return;
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) onFail();
    } catch {
      onFail();
    }
  }, [enabled, onFail]);
  return null;
}
