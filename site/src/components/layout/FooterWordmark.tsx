"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./FooterWordmark.module.css";
import { FooterLandscape } from "./FooterLandscape";

export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState("static");
  const [replay, setReplay] = useState(0);
  const [motionAllowed, setMotionAllowed] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Real, visible server-rendered text is also the no-JS / old-browser fallback.
    if (preference.matches || !window.IntersectionObserver || !ref.current)
      return;
    setMotionAllowed(true);
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
      setMotionAllowed(false);
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
      <div key={replay} className={styles.scene}>
        <p className={styles.wordmark} aria-label="Nomad Programmer">
          <span className={styles.nomad}>
            <span className={styles.ink}>NOMAD</span>
          </span>{" "}
          <span className={styles.programmer}>
            <span className={styles.ink}>PROGRAMMER</span>
          </span>
        </p>
        <FooterLandscape />
      </div>
      <div className={styles.caption}>
        <span>From code to wild.</span>
        {motionAllowed && (
          <button
            type="button"
            onClick={() => {
              setState("entered");
              setReplay((value) => value + 1);
            }}
            className={styles.replay}
          >
            Replay the journey <span aria-hidden="true">↗</span>
          </button>
        )}
      </div>
    </div>
  );
}
