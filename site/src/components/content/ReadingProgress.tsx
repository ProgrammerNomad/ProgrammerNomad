"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setVisible(!mq.matches);
    updateMotion();
    mq.addEventListener("change", updateMotion);

    const onScroll = () => {
      if (mq.matches) return;
      const article = document.querySelector("[data-reading-body]");
      if (!article) return;
      const bounds = article.getBoundingClientRect();
      const distance = Math.max(1, bounds.height - innerHeight * 0.6);
      setProgress(
        Math.max(
          0,
          Math.min(100, ((innerHeight * 0.2 - bounds.top) / distance) * 100),
        ),
      );
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      mq.removeEventListener("change", updateMotion);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed left-0 top-0 z-[60] h-0.5 w-full bg-paper/10"
      aria-hidden
    >
      <div
        className="h-full bg-lime transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
