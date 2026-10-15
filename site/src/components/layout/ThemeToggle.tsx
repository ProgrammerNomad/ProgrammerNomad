"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";
const STORAGE_KEY = "nomad-programmer-theme";

function readTheme(): Theme {
  const value = document.documentElement.dataset.theme;
  return value === "light" ? "light" : "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(readTheme());
    const syncTheme = () => setTheme(readTheme());
    window.addEventListener("nomad-theme-change", syncTheme);
    return () => window.removeEventListener("nomad-theme-change", syncTheme);
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
    window.dispatchEvent(new Event("nomad-theme-change"));
  }

  const targetTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${targetTheme} theme`}
      title={`Switch to ${targetTheme} theme`}
    >
      {theme === "dark" ? (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 16.5h18M5.5 16.5a6.5 6.5 0 0 1 13 0"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M12 4.5v2m-6.3.1 1.4 1.4m9.8 0 1.4-1.4M8.5 15l3.5-3 3.5 3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="16.5" r="1.1" fill="var(--lime)" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M19.2 14.3A7.8 7.8 0 0 1 9.7 4.8a7.9 7.9 0 1 0 9.5 9.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="m13.5 7.5 1.6 1.6-1.6 1.6m1.6-1.6h3.4"
            stroke="var(--lime)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="18.5" cy="9.1" r="1" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}
