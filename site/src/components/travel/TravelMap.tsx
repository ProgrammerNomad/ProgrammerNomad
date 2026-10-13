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

const nomadIcon = typeof window !== "undefined"
  ? L.divIcon({
      className: "custom-nomad-pin",
      html: `
        <div style="position: relative; width: 22px; height: 22px; display: flex; items-center; justify-content: center;">
          <div style="position: absolute; inset: 0; border-radius: 50%; background: rgba(181,255,67,0.3); animation: pulse 2s infinite;"></div>
          <div style="position: absolute; top: 4px; left: 4px; width: 14px; height: 14px; border-radius: 50%; background: #b5ff43; border: 2px solid #0b0c0b; box-shadow: 0 0 8px #b5ff43;"></div>
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    })
  : undefined;

export function TravelMap({ places }: { places: MapPlace[] }) {
  if (places.length === 0) return null;

  const center = places[0];

  return (
    <div
      id="travel-map"
      className="glass-card dark-map-tiles relative h-[440px] w-full overflow-hidden border border-lime/30 shadow-[0_0_35px_rgba(181,255,67,0.12)] [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-container]:bg-canvas [&_.leaflet-popup-content-wrapper]:rounded-lg [&_.leaflet-popup-content-wrapper]:border [&_.leaflet-popup-content-wrapper]:border-lime/30 [&_.leaflet-popup-content-wrapper]:bg-[#141614] [&_.leaflet-popup-content-wrapper]:text-paper [&_.leaflet-popup-tip]:bg-[#141614]"
    >
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={5}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places.map((p) => (
          <Marker
            key={`${p.lat}-${p.lng}`}
            position={[p.lat, p.lng]}
            icon={nomadIcon}
          >
            <Popup>
              <div className="font-mono text-xs">
                <span className="text-lime font-bold">●</span>{" "}
                {p.href ? (
                  <a href={p.href} className="text-lime font-semibold underline hover:text-white">
                    {p.label}
                  </a>
                ) : (
                  <span className="font-semibold text-paper/90">{p.label}</span>
                )}
                <div className="mt-1 text-[10px] text-paper/50">
                  {p.lat.toFixed(2)}°N, {p.lng.toFixed(2)}°E
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
