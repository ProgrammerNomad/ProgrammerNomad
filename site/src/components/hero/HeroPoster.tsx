import type { TravelDestination } from "@/lib/travel/destinations";
import { projectDestination } from "./poster-projection";
export { projectDestination } from "./poster-projection";

export function HeroPoster({
  destinations,
  selected,
  boundaries = [],
}: {
  destinations: TravelDestination[];
  selected: TravelDestination;
  boundaries?: string[];
}) {
  return (
    <svg viewBox="0 0 600 600" fill="none" aria-hidden="true">
      <circle cx="300" cy="300" r="205" stroke="#79d8ec" strokeOpacity=".1" />
      <circle
        cx="300"
        cy="300"
        r="190"
        fill="#0b110d"
        stroke="#b5ff43"
        strokeOpacity=".45"
      />
      {boundaries.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={i ? "#6f8957" : "#b2c69c"}
          strokeWidth={i ? ".65" : ".9"}
          strokeOpacity={i ? ".5" : ".8"}
        />
      ))}
      {[65, 125].map((radius) => (
        <ellipse
          key={radius}
          cx="300"
          cy="300"
          rx={radius}
          ry="190"
          stroke="#b5ff43"
          strokeOpacity=".16"
        />
      ))}
      {[65, 125].map((radius) => (
        <ellipse
          key={radius}
          cx="300"
          cy="300"
          rx="190"
          ry={radius}
          stroke="#b5ff43"
          strokeOpacity=".16"
        />
      ))}
      <path d="M110 300H490M300 110V490" stroke="#b5ff43" strokeOpacity=".2" />
      <ellipse
        cx="300"
        cy="300"
        rx="260"
        ry="108"
        transform="rotate(-28 300 300)"
        stroke="#b5ff43"
        strokeOpacity=".18"
      />
      <ellipse
        cx="300"
        cy="300"
        rx="248"
        ry="140"
        transform="rotate(58 300 300)"
        stroke="#79d8ec"
        strokeOpacity=".08"
      />
      {destinations.map((place) => {
        const point = projectDestination(place, selected);
        return point.visible ? (
          <circle
            key={place.id}
            cx={point.x.toFixed(3)}
            cy={point.y.toFixed(3)}
            r={place.id === selected.id ? 3.5 : 1.3}
            fill={place.id === selected.id ? "#f4f3ee" : "#b5ff43"}
          />
        ) : null;
      })}
      <circle cx="300" cy="300" r="10" stroke="#f4f3ee" strokeOpacity=".65" />
      <path
        d="M300 32V44M300 556V568M32 300H44M556 300H568"
        stroke="#a3aba2"
        strokeOpacity=".45"
      />
    </svg>
  );
}
