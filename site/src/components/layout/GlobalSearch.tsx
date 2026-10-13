"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { searchRecords, type SearchRecord } from "@/lib/search";

export function GlobalSearch({ records }: { records: SearchRecord[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("All");
  const results = searchRecords(records, query, kind);
  const open = () => {
    returnFocus.current = document.activeElement as HTMLElement;
    dialog.current?.showModal();
  };
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        if (
          (e.target as HTMLElement).closest(
            "input, textarea, select, [contenteditable=true]",
          ) &&
          !dialog.current?.open
        )
          return;
        e.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else {
          returnFocus.current = document.activeElement as HTMLElement;
          dialog.current?.showModal();
        }
      }
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, []);
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="search-trigger"
        aria-label="Search the site"
        aria-haspopup="dialog"
        aria-keyshortcuts="Control+k Meta+k"
        onClick={open}
      >
        <Search size={18} />
        <span className="hidden xl:inline">Search</span>
      </button>
      <dialog
        ref={dialog}
        className="atlas-dialog"
        aria-labelledby="search-title"
        onKeyDown={(event) => {
          // Search inputs otherwise consume Escape to clear their native value.
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            dialog.current?.close();
          }
        }}
        onClose={() =>
          (returnFocus.current?.isConnected
            ? returnFocus.current
            : trigger.current
          )?.focus()
        }
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <div className="search-panel">
          <div className="flex items-center justify-between gap-4">
            <h2 id="search-title" className="font-display text-2xl">
              Find your next path.
            </h2>
            <button
              type="button"
              className="icon-action"
              aria-label="Close search"
              onClick={() => dialog.current?.close()}
            >
              <X size={20} />
            </button>
          </div>
          <label
            className="mt-6 block text-sm text-paper/70"
            htmlFor="site-query"
          >
            Search projects, journeys, destinations & writing
          </label>
          <input
            autoFocus
            id="site-query"
            type="search"
            className="atlas-input mt-2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try Laravel or Uttarakhand"
            autoComplete="off"
          />
          <div
            className="mt-4 flex flex-wrap gap-2"
            aria-label="Search categories"
          >
            {[
              "All",
              "Projects",
              "Journeys",
              "Destinations",
              "Writing",
              "Guides",
            ].map((value) => (
              <button
                type="button"
                className="filter-chip"
                key={value}
                aria-pressed={kind === value}
                onClick={() => setKind(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <p role="status" className="atlas-meta mt-5">
            {results.length} results · Tab to explore · Esc to close
          </p>
          <ul className="search-results">
            {results.slice(0, 40).map((record) => (
              <li key={record.kind + record.href}>
                <Link
                  href={record.href}
                  onClick={() => dialog.current?.close()}
                  className="search-result"
                >
                  <span className="atlas-meta">
                    {record.kind}
                    {record.href.startsWith("https:") ? " ↗" : ""}
                  </span>
                  <strong>{record.title}</strong>
                  <span className="text-sm text-paper/65">
                    {record.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {results.length === 0 && (
            <div className="empty-state">
              <p>No paths found for “{query}”.</p>
              <button
                type="button"
                className="atlas-button mt-4"
                onClick={() => {
                  setQuery("");
                  setKind("All");
                }}
              >
                Clear search
              </button>
            </div>
          )}
          {results.length > 40 && (
            <p className="text-sm text-paper/65">
              Showing the first 40. Add a word to narrow the search.
            </p>
          )}
        </div>
      </dialog>
    </>
  );
}
