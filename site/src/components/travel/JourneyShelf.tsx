import Image from "next/image";
import Link from "next/link";
import type { TravelDestination } from "@/lib/travel/destinations";

export function JourneyShelf({
  destinations,
}: {
  destinations: TravelDestination[];
}) {
  const visits = destinations.flatMap((d) =>
    (d.visits ?? [])
      .filter((v) => v.cover && /\.(jpg|webp|png)$/i.test(v.cover))
      .map((v) => ({ ...v, place: d.label, id: d.id })),
  );
  if (!visits.length) return null;
  return (
    <section className="journey-shelf" aria-label="Photo journeys">
      <div className="section-topline">
        <div>
          <p className="atlas-meta">A few places, in pictures</p>
          <h2>Go where the story is.</h2>
        </div>
      </div>
      <div className="journey-shelf-grid">
        {visits.map((visit, index) => (
          <Link key={visit.href} href={visit.href} className="journey-frame">
            <div>
              <Image
                src={visit.cover!}
                alt={visit.title}
                width={900}
                height={600}
                sizes="(max-width:700px) 100vw, 380px"
              />
              <span aria-hidden="true">0{index + 1} ↗</span>
            </div>
            <p className="atlas-meta">
              {visit.place} / {visit.photoCount} photographs
            </p>
            <h3>{visit.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
