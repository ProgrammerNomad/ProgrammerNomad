import {
  Database,
  Search,
  ListFilter,
  MapPin,
  History,
  ArrowRight,
} from "lucide-react";
const steps = [
  {
    icon: Database,
    title: "Station data",
    detail:
      "CDN-hosted JSON is loaded into browser memory. A non-OK HTTP response triggers the bundled JSON fallback.",
  },
  {
    icon: Search,
    title: "Weighted search",
    detail:
      "Fuse.js prioritizes station names and codes, then regional names, district and state.",
  },
  {
    icon: ListFilter,
    title: "Suggestions",
    detail:
      "Up to 50 ranked matches. Arrow keys, Enter and Escape are handled by the search component.",
  },
  {
    icon: MapPin,
    title: "Station cards",
    detail:
      "Selected station codes are deduplicated. Cards show the location and available regional-language names.",
  },
];
export function RailwayArchitecture() {
  return (
    <section
      className="rail-architecture"
      aria-labelledby="rail-architecture-heading"
    >
      <p className="atlas-meta">
        Inside the implementation / Source-backed flow
      </p>
      <h2 id="rail-architecture-heading">The search lives in the browser.</h2>
      <ol>
        {steps.map(({ icon: Icon, title, detail }, index) => (
          <li key={title}>
            <div className="rail-step-heading">
              <Icon aria-hidden="true" size={24} />
              <span>0{index + 1}</span>
            </div>
            <h3>{title}</h3>
            <p>{detail}</p>
            {index < 3 && (
              <ArrowRight className="rail-flow-arrow" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
      <div className="rail-recent">
        <History aria-hidden="true" size={20} />
        <p>Recent selections → localStorage → latest 10 station records.</p>
      </div>
      <p className="text-sm text-paper/65 mt-6">
        Source snapshot:{" "}
        <a
          className="text-lime underline"
          href="https://github.com/ProgrammerNomad/indian-railway-station-search/blob/a0c8dcb7cf4275b1017ebe5f6c0eb0daa2f099bc/components/StationSearch.tsx"
        >
          StationSearch.tsx ↗
        </a>
        . This is station discovery, without train schedules or ticket
        availability.
      </p>
    </section>
  );
}
