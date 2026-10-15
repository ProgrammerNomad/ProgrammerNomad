"use client";

import { useEffect, useRef } from "react";
import {
  Baby,
  GraduationCap,
  Plane,
  MapPin,
  Heart,
  Code2,
  Building2,
  Clapperboard,
  Rocket,
  ArrowUpRight,
  Globe2,
} from "lucide-react";
import styles from "./LifeTimeline.module.css";

export type LifeEvent = {
  id?: string;
  year?: string;
  title: string;
  description: string;
  kind?: string;
  place?: string;
  chapter?: string;
  href?: string;
};
const icons = {
  birth: Baby,
  education: GraduationCap,
  move: Plane,
  return: MapPin,
  marriage: Heart,
  code: Code2,
  business: Building2,
  film: Clapperboard,
  leadership: Rocket,
};

const sceneLabels: Record<string, string> = {
  birth: "The beginning",
  education: "Learning & discovery",
  move: "A wider world",
  return: "Finding home",
  marriage: "Life, together",
  code: "Ideas into code",
  business: "Building something",
  film: "Stories & open source",
  leadership: "The next horizon",
};

function MilestoneScene({ kind, index }: { kind: string; index: number }) {
  const Icon = icons[kind as keyof typeof icons] ?? Code2;
  return (
    <div className={styles.scene} data-kind={kind} aria-hidden="true">
      <span className={styles.sceneNumber}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <svg className={styles.sceneDrawing} viewBox="0 0 300 240" fill="none">
        <circle cx="150" cy="120" r="88" className={styles.orbit} />
        <path d="M38 120H62 M238 120H262 M150 8V32 M150 208V232" />
        {kind === "birth" && (
          <>
            <path d="M35 177L84 131L115 157L161 109L224 177L266 156 M35 193H265 M62 207H238" />
            <path d="M102 99a48 48 0 0 1 96 0 M150 42V29 M104 56L94 44 M196 56L206 44" />
          </>
        )}
        {kind === "education" && (
          <>
            <path d="M70 77L145 57L226 80L151 101Z M70 77V169L151 192L226 169V80 M151 101V192 M91 117L128 128 M91 134L128 145 M174 127L205 117 M174 144L205 134" />
            <path d="M54 93V185L141 210 M240 95V185L163 208" />
          </>
        )}
        {kind === "move" && (
          <>
            <circle cx="150" cy="120" r="66" />
            <ellipse cx="150" cy="120" rx="29" ry="66" />
            <path
              d="M84 120H216 M95 87H205 M95 153H205 M43 178C49 70 229 29 257 88"
              strokeDasharray="4 7"
            />
            <path d="M240 77L257 88L260 67" />
          </>
        )}
        {kind === "return" && (
          <>
            <path d="M44 192H258 M62 192V123H99V192 M72 123V105H89V123 M113 192V90H162V192 M123 90V73H152V90 M178 192V133H230V192 M189 133V114H219V133 M76 142H85 M76 158H85 M126 113H147 M126 137H147 M192 153H214 M192 173H214" />
          </>
        )}
        {kind === "marriage" && (
          <>
            <circle cx="119" cy="143" r="49" />
            <circle cx="181" cy="143" r="49" />
            <path d="M78 65L90 77 M222 65L210 77 M150 39V54 M56 110H70 M230 110H244 M102 97L119 82L136 97 M164 97L181 82L198 97" />
          </>
        )}
        {kind === "code" && (
          <>
            <rect x="47" y="55" width="206" height="139" rx="8" />
            <path d="M47 82H253 M65 69H70 M80 69H85 M95 69H100 M99 115L83 132L99 149 M201 115L217 132L201 149 M139 169H181" />
          </>
        )}
        {kind === "business" && (
          <>
            <path d="M58 194V119H113V194 M113 194V67H183V194 M183 194V101H237V194 M43 194H257 M127 87H168 M127 104H168 M72 141H96 M72 160H96 M200 126H222 M200 147H222 M200 168H222" />
          </>
        )}
        {kind === "film" && (
          <>
            <rect x="51" y="52" width="198" height="145" rx="5" />
            <path d="M51 80H249 M76 52V80 M111 52V80 M147 52V80 M183 52V80 M219 52V80 M51 173H249 M76 173V197 M111 173V197 M147 173V197 M183 173V197 M219 173V197" />
          </>
        )}
        {kind === "leadership" && (
          <>
            <ellipse
              cx="150"
              cy="126"
              rx="115"
              ry="40"
              transform="rotate(-28 150 126)"
            />
            <path d="M82 193L104 171 M70 170L88 152 M108 210L126 190 M202 51L218 35 M213 72L235 64" />
          </>
        )}
      </svg>
      <span className={styles.sceneIcon}>
        <Icon size={kind === "marriage" ? 30 : 38} strokeWidth={1.25} />
      </span>
      <span className={styles.sceneCaption}>
        {sceneLabels[kind] ?? "A new chapter"}
      </span>
    </div>
  );
}

export function LifeTimeline({ items }: { items: LifeEvent[] }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !window.IntersectionObserver || !root.current)
      return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-entered", "true");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    root.current
      .querySelectorAll("[data-event]")
      .forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  const chapters = [
    ...new Set(items.map((item) => item.chapter ?? "Building a career")),
  ];
  return (
    <div ref={root} className={styles.timeline}>
      <nav className={styles.chapters} aria-label="Life timeline chapters">
        {chapters.map((chapter, i) => (
          <a href={`#life-chapter-${i}`} key={chapter}>
            <span>0{i + 1}</span>
            {chapter}
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        ))}
      </nav>
      {chapters.map((chapter, chapterIndex) => (
        <section
          id={`life-chapter-${chapterIndex}`}
          className={styles.chapter}
          key={chapter}
          aria-label={chapter}
        >
          <header>
            <p className="atlas-meta">Chapter 0{chapterIndex + 1}</p>
            <h3>{chapter}</h3>
            <p>
              {chapterIndex === 0
                ? "The places and personal chapters behind the person."
                : "Ideas, teams, and things built along the way."}
            </p>
          </header>
          <ol className={styles.events}>
            {items
              .filter(
                (item) => (item.chapter ?? "Building a career") === chapter,
              )
              .map((item, index) => {
                const kind = item.kind ?? "code";
                return (
                  <li
                    data-event
                    key={item.id ?? `${item.title}-${item.year}`}
                    className={styles.event}
                  >
                    <svg
                      className={styles.route}
                      viewBox="0 0 1000 340"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        className={styles.routeBase}
                        d="M500 0C500 72 750 55 750 170S500 268 500 340"
                      />
                      <path
                        className={styles.routeInk}
                        pathLength="1"
                        d="M500 0C500 72 750 55 750 170S500 268 500 340"
                      />
                    </svg>
                    <svg
                      className={styles.mobileRoute}
                      viewBox="0 0 56 340"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        className={styles.routeBase}
                        d="M28 0C4 65 50 100 28 170S4 270 28 340"
                      />
                      <path
                        className={styles.routeInk}
                        pathLength="1"
                        d="M28 0C4 65 50 100 28 170S4 270 28 340"
                      />
                      <circle cx="28" cy="170" r="4" />
                    </svg>
                    <MilestoneScene kind={kind} index={index} />
                    <article className={styles.card}>
                      <p className={styles.era}>
                        {item.year ? (
                          <time>{item.year}</time>
                        ) : (
                          <span>{item.place ?? "Life chapter"}</span>
                        )}
                        <span aria-hidden="true">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </p>
                      <h4>{item.title}</h4>
                      {item.place && item.year && (
                        <p className={styles.place}>
                          <MapPin size={12} aria-hidden="true" />
                          {item.place}
                        </p>
                      )}
                      <p className={styles.description}>{item.description}</p>
                      {item.href && (
                        <a href={item.href} className={styles.link}>
                          Explore this chapter{" "}
                          <ArrowUpRight size={14} aria-hidden="true" />
                        </a>
                      )}
                    </article>
                  </li>
                );
              })}
          </ol>
        </section>
      ))}
      <p className={styles.ending}>
        <Globe2 size={22} aria-hidden="true" />
        Still building. Still exploring.
      </p>
    </div>
  );
}
