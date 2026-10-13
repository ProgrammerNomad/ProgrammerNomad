"use client";

import Link from "next/link";
import type { TocItem } from "@/lib/content/toc";
import { SITE_URL } from "@/lib/seo/site-config";

export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;
  return (
    <nav
      aria-label="Table of contents"
      className="rounded-xl border border-paper/10 bg-elevated/50 p-5"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-paper/50">
        On this page
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            className={item.level === 3 ? "ml-4" : undefined}
          >
            <a href={`#${item.id}`} className="text-paper/80 hover:text-lime">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function ShareButtons({ title, path }: { title: string; path: string }) {
  const url = `${SITE_URL}${path}`;
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap gap-3 font-mono text-xs uppercase tracking-widest">
      <Link
        href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-paper/70 hover:text-lime"
      >
        Share on X
      </Link>
      <Link
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-paper/70 hover:text-lime"
      >
        LinkedIn
      </Link>
      <button
        type="button"
        className="text-paper/70 hover:text-lime"
        onClick={() => navigator.clipboard.writeText(url)}
      >
        Copy link
      </button>
    </div>
  );
}
