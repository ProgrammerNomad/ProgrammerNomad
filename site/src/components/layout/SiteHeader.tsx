"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { PRIMARY_NAV } from "@/lib/navigation";
import { HEADER_COORDINATES } from "@/lib/seo/site-config";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-paper/10 bg-canvas/85 backdrop-blur-xl transition-all">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded focus:bg-lime focus:px-4 focus:py-3 focus:text-canvas"
      >
        Skip to content
      </a>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-lime/30 to-transparent" />
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          aria-label="Nomad Programmer home"
          className="group -my-1 flex items-center gap-3 rounded-sm py-1 font-mono uppercase tracking-[0.25em] text-paper transition hover:text-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-lime shadow-[0_0_8px_#b5ff43]" />
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold">Nomad Programmer</span>
            <span className="hidden text-[10px] tracking-widest text-paper/45 group-hover:text-lime/80 sm:block">
              {HEADER_COORDINATES}
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {PRIMARY_NAV.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "nav-link-animated font-mono text-xs uppercase tracking-widest transition-colors py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime",
                  isActive
                    ? "text-lime font-bold text-glow-lime"
                    : "text-paper/75 hover:text-white",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          ref={menuButton}
          type="button"
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md p-2 text-paper lg:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle menu</span>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </Container>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-paper/10 bg-elevated lg:hidden"
          aria-label="Mobile navigation"
        >
          <Container className="flex flex-col gap-1 py-4">
            {PRIMARY_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={
                  pathname === link.href || pathname.startsWith(`${link.href}/`)
                    ? "page"
                    : undefined
                }
                className="rounded-md px-2 py-3 font-mono text-sm uppercase tracking-widest text-paper hover:bg-canvas hover:text-lime"
              >
                {link.label}
              </Link>
            ))}
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
