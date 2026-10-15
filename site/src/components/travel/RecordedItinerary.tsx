import { MapPin, Flag } from "lucide-react";
import { recordedFact } from "@/lib/travel/story-presentation";
export function RecordedItinerary({ route }: { route?: string }) {
  const recorded = recordedFact(route);
  const stops = recorded?.split(/\s*(?:→|->)\s*/).filter(Boolean) ?? [];
  if (stops.length < 2) return null;
  return (
    <section className="recorded-itinerary" aria-label="Documented itinerary">
      <p className="atlas-meta">From the journal / Recorded stops</p>
      <ol>
        {stops.map((stop, index) => (
          <li key={`${index}-${stop}`}>
            {index === stops.length - 1 ? (
              <Flag size={18} aria-hidden="true" />
            ) : (
              <MapPin size={18} aria-hidden="true" />
            )}
            <span>{stop}</span>
          </li>
        ))}
      </ol>
      <p className="text-xs text-paper/55 mt-5">
        Sequence from the authored route notes. Spacing does not represent
        distance or elevation.
      </p>
    </section>
  );
}
