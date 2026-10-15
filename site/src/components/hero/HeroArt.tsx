"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { TravelDestination } from "@/lib/travel/destinations";
import { HeroPoster } from "./HeroPoster";
import styles from "../home/HomeOpening.module.css";

// Keep the server-rendered atlas visible until the first real WebGL frame.
const HeroCanvas = dynamic(
  () => import("./HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false },
);

class CanvasBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function HeroArt({
  destinations,
  initialPaths,
}: {
  destinations: TravelDestination[];
  initialPaths: string[];
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(true);
  const [rotating, setRotating] = useState(false);
  const [turn, setTurn] = useState(0);
  const [selectedId, setSelectedId] = useState(destinations[0]?.id);
  const [posterPaths, setPosterPaths] = useState(initialPaths);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const selected =
    destinations.find((d) => d.id === selectedId) ?? destinations[0];
  useEffect(() => {
    const syncTheme = () =>
      setTheme(
        document.documentElement.dataset.theme === "light" ? "light" : "dark",
      );
    syncTheme();
    window.addEventListener("nomad-theme-change", syncTheme);
    return () => window.removeEventListener("nomad-theme-change", syncTheme);
  }, []);
  useEffect(() => {
    if (!selected || selected.id === destinations[0]?.id) {
      setPosterPaths(initialPaths);
      return;
    }
    let cancelled = false;
    import("./poster-paths")
      .then(({ getPosterPaths }) => {
        if (!cancelled) setPosterPaths(getPosterPaths(selected));
      })
      .catch(() => {
        if (!cancelled) setPosterPaths([]);
      });
    return () => {
      cancelled = true;
    };
  }, [selected, initialPaths, destinations]);
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => {
    setFailed(true);
    setReady(false);
    setRotating(false);
  }, []);
  const onInteraction = useCallback(() => setRotating(false), []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setMotionAllowed(!preference.matches);
      setReady(false);
      setRotating(!preference.matches);
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const node = sceneRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    observer.observe(node);
    const visibility = () => setVisible(!document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  useEffect(() => {
    if (!motionAllowed || !inView || enabled || failed) return;
    const enable = () => {
      try {
        const gl = document.createElement("canvas").getContext("webgl2");
        if (!gl) {
          onError();
          return;
        }
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        setEnabled(true);
      } catch {
        onError();
      }
    };
    if (window.requestIdleCallback) {
      const id = window.requestIdleCallback(enable, { timeout: 500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(enable, 100);
    return () => window.clearTimeout(id);
  }, [motionAllowed, inView, enabled, failed, onError]);

  const showCanvas = motionAllowed && enabled && !failed;
  useEffect(() => {
    if (!showCanvas || ready || !visible) return;
    const id = window.setTimeout(onError, 8000);
    return () => window.clearTimeout(id);
  }, [showCanvas, ready, visible, onError]);

  if (!selected) return null;
  const live = showCanvas && ready;
  const coordinates = `${Math.abs(selected.lat).toFixed(2)}°${selected.lat < 0 ? "S" : "N"} / ${Math.abs(selected.lng).toFixed(2)}°${selected.lng < 0 ? "W" : "E"}`;

  return (
    <figure className={styles.atlas} aria-label="Travel atlas">
      <figcaption className={styles.atlasHeading}>
        <strong>01 / THE TRAVEL ATLAS</strong>
        <span>{destinations.length} PLACES EXPLORED</span>
      </figcaption>
      <div
        ref={sceneRef}
        className={styles.scene}
        role="img"
        aria-label={`Stylized globe with recorded destinations. Selected: ${selected.label}.`}
      >
        <div
          data-testid="atlas-poster"
          className={`${styles.poster} ${live ? styles.posterHidden : ""}`}
          aria-hidden="true"
        >
          <HeroPoster
            destinations={destinations}
            selected={selected}
            boundaries={posterPaths}
          />
        </div>
        {showCanvas && (
          <div
            className={`${styles.canvas} ${live ? styles.canvasReady : ""}`}
            aria-hidden="true"
          >
            <CanvasBoundary onError={onError}>
              <HeroCanvas
                destinations={destinations}
                selected={selected}
                theme={theme}
                turn={turn}
                paused={!inView || !visible}
                autoRotate={rotating}
                onReady={onReady}
                onError={onError}
                onInteraction={onInteraction}
              />
            </CanvasBoundary>
          </div>
        )}
      </div>
      <div className={styles.atlasControls}>
        <span className={styles.atlasStatus} role="status">
          {live
            ? rotating
              ? "3D atlas · rotating"
              : "3D atlas · drag to explore"
            : "Static atlas · explore below"}
        </span>
        {live && (
          <div className={styles.controlGroup}>
            <button
              type="button"
              className={styles.control}
              aria-label="Turn globe left"
              onClick={() => {
                setRotating(false);
                setTurn((v) => v - 1);
              }}
            >
              <ArrowLeft size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.control}
              aria-label="Turn globe right"
              onClick={() => {
                setRotating(false);
                setTurn((v) => v + 1);
              }}
            >
              <ArrowRight size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.control}
              aria-label={
                rotating ? "Pause globe rotation" : "Start globe rotation"
              }
              aria-pressed={rotating}
              onClick={() => setRotating((v) => !v)}
            >
              {rotating ? (
                <Pause size={16} aria-hidden="true" />
              ) : (
                <Play size={16} aria-hidden="true" />
              )}
            </button>
          </div>
        )}
      </div>
      <div className={styles.destination}>
        <label htmlFor="atlas-destination">CHOOSE A DESTINATION</label>
        <select
          id="atlas-destination"
          value={selected.id}
          onChange={(e) => {
            setSelectedId(e.target.value);
            setPosterPaths(
              e.target.value === destinations[0]?.id ? initialPaths : [],
            );
            setRotating(false);
            setTurn(0);
          }}
        >
          {destinations.map((place) => (
            <option key={place.id} value={place.id}>
              {place.label}
            </option>
          ))}
        </select>
        <div className={styles.destinationDetail}>
          <span>{coordinates}</span>
          <Link href={selected.stories[0] ?? "/field-notes"}>
            {selected.stories.length ? "Read field note" : "All journeys"}
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <div
          className={styles.visitPanel}
          aria-label="Selected destination stories"
        >
          {selected.visits?.length ? (
            selected.visits.map((visit) => (
              <div key={visit.href} className={styles.visit}>
                {visit.cover && (
                  <Link href={visit.href} tabIndex={-1} aria-hidden="true">
                    <Image
                      src={visit.cover}
                      alt=""
                      width={160}
                      height={110}
                      sizes="100px"
                    />
                  </Link>
                )}
                <div>
                  <p>{visit.title}</p>
                  <span>{visit.date} / Published note</span>
                  <div className={styles.visitActions}>
                    <Link href={visit.href}>Open story ↗</Link>
                    {visit.photoCount > 0 && (
                      <Link href={`${visit.href}#photo-journal`}>
                        View {visit.photoCount} photos ↗
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.atlasStatus}>
              A recorded place. A field note has not been published yet.
            </p>
          )}
          <Link
            className={styles.atlasStatus}
            href={`/field-notes?place=${encodeURIComponent(selected.id)}#atlas`}
          >
            Find this place on the travel atlas ↗
          </Link>
        </div>
        <p className={styles.geoCredit}>
          Geography:{" "}
          <a href="https://www.naturalearthdata.com/about/disputed-boundaries-policy/">
            Natural Earth
          </a>{" "}
          · simplified boundaries
        </p>
        <noscript>
          <p className={styles.atlasStatus}>
            Interactive selection requires JavaScript. Explore all destinations
            in <Link href="/field-notes">Journeys</Link>.
          </p>
        </noscript>
      </div>
    </figure>
  );
}
