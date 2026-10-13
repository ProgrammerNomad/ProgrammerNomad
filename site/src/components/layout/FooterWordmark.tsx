"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./FooterWordmark.module.css";

export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState("static");

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Real, visible server-rendered text is also the no-JS / old-browser fallback.
    if (preference.matches || !window.IntersectionObserver || !ref.current)
      return;
    setState("pending");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("entered");
        observer.disconnect();
      },
      { threshold: 0.15 },
    );
    observer.observe(ref.current);
    const reduce = () => {
      if (!preference.matches) return;
      observer.disconnect();
      setState("static");
    };
    preference.addEventListener("change", reduce);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", reduce);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={styles.closing}
      data-state={state}
      data-testid="footer-wordmark"
    >
      <p className={styles.wordmark}>
        <span className={styles.nomad}>
          <span className={styles.ink}>NOMAD</span>
        </span>{" "}
        <span className={styles.programmer}>
          <span className={styles.ink}>PROGRAMMER</span>
        </span>
      </p>
      <svg
        className={styles.route}
        viewBox="0 0 1200 52"
        fill="none"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <path
          className={styles.routeBase}
          d="M2 39H280C390 39 398 13 508 13H760C863 13 879 39 981 39H1198"
        />
        <path
          className={styles.routeDraw}
          pathLength="1"
          d="M2 39H280C390 39 398 13 508 13H760C863 13 879 39 981 39H1198"
        />
        <circle className={styles.destination} cx="1198" cy="39" r="0.5" />
      </svg>
    </div>
  );
}
