"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";

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
  const [show3d, setShow3d] = useState(false);
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

  const showCanvas = show3d && !reducedMotion && !webglFailed;

  return (
    <div
      className="relative aspect-square w-full max-w-md overflow-hidden md:aspect-[4/5]"
      aria-hidden
    >
      <Image
        src="/hero-poster.svg"
        alt=""
        fill
        priority
        className={`object-contain transition-opacity duration-700 ${showCanvas ? "opacity-0" : "opacity-100"}`}
        sizes="(max-width: 768px) 100vw, 400px"
      />
      {showCanvas ? (
        <div className="absolute inset-0">
          <HeroCanvas />
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
