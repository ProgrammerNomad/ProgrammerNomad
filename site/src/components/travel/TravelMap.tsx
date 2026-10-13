"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";

export type MapPlace = {
  lat: number;
  lng: number;
  label: string;
  href?: string;
};

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export function TravelMap({ places }: { places: MapPlace[] }) {
  if (places.length === 0) return null;

  const center = places[0];

  return (
    <div
      id="travel-map"
      className="h-[420px] w-full overflow-hidden rounded-xl border border-paper/10 [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-container]:bg-canvas"
    >
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={5}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places.map((p) => (
          <Marker key={`${p.lat}-${p.lng}`} position={[p.lat, p.lng]} icon={icon}>
            <Popup>
              {p.href ? (
                <a href={p.href} className="text-lime underline">
                  {p.label}
                </a>
              ) : (
                p.label
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
