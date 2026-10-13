import type { TravelDestination } from "@/lib/travel/destinations";

// Orthographic projection using the same coordinates as the WebGL markers.
export function projectDestination(
  place: Pick<TravelDestination, "lat" | "lng">,
  center: Pick<TravelDestination, "lat" | "lng">,
) {
  const radians = Math.PI / 180;
  const lat = place.lat * radians;
  const origin = center.lat * radians;
  const delta = (place.lng - center.lng) * radians;
  return {
    x: 300 + 190 * Math.cos(lat) * Math.sin(delta),
    y:
      300 -
      190 *
        (Math.cos(origin) * Math.sin(lat) -
          Math.sin(origin) * Math.cos(lat) * Math.cos(delta)),
    visible:
      Math.sin(origin) * Math.sin(lat) +
        Math.cos(origin) * Math.cos(lat) * Math.cos(delta) >
      0,
  };
}

export function HeroPoster({
  destinations,
  selected,
}: {
  destinations: TravelDestination[];
  selected: TravelDestination;
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
        strokeOpacity=".5"
      />
      <ellipse
        cx="300"
        cy="300"
        rx="248"
        ry="140"
        transform="rotate(58 300 300)"
        stroke="#79d8ec"
        strokeOpacity=".3"
      />
      {destinations.map((place) => {
        const point = projectDestination(place, selected);
        return point.visible ? (
          <circle
            key={place.id}
            cx={point.x.toFixed(3)}
            cy={point.y.toFixed(3)}
            r={place.id === selected.id ? 4.5 : 2.5}
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
