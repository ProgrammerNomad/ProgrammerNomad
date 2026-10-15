"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

export type MapPlace = {
  lat: number;
  lng: number;
  label: string;
  href?: string;
  id?: string;
};

const nomadIcon =
  typeof window !== "undefined"
    ? L.divIcon({
        className: "custom-nomad-pin",
        html: `
        <div style="position: relative; width: 22px; height: 22px; display: flex; items-center; justify-content: center;">
          <div style="position: absolute; inset: 0; border-radius: 50%; background: color-mix(in srgb, var(--lime) 30%, transparent);"></div>
          <div style="position: absolute; top: 4px; left: 4px; width: 14px; height: 14px; border-radius: 50%; background: var(--lime); border: 2px solid var(--canvas); box-shadow: 0 0 8px var(--lime);"></div>
        </div>
      `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      })
    : undefined;

function MapView({
  places,
  selectedId,
}: {
  places: MapPlace[];
  selectedId?: string;
}) {
  const map = useMap();
  useEffect(() => {
    const selected = places.find((p) => p.id === selectedId);
    if (selected)
      map.setView([selected.lat, selected.lng], 6, { animate: false });
    else if (places.length)
      map.fitBounds(
        places.map((p) => [p.lat, p.lng] as [number, number]),
        { padding: [30, 30], maxZoom: 6, animate: false },
      );
  }, [map, places, selectedId]);
  return null;
}

export function TravelMap({
  places,
  selectedId,
  onSelect,
}: {
  places: MapPlace[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}) {
  if (places.length === 0) return null;

  const center = places[0];

  return (
    <div
      id="travel-map"
      className="glass-card dark-map-tiles relative h-[440px] w-full overflow-hidden border border-lime/30 shadow-[0_0_35px_rgba(181,255,67,0.12)] [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-container]:bg-canvas [&_.leaflet-popup-content-wrapper]:rounded-lg [&_.leaflet-popup-content-wrapper]:border [&_.leaflet-popup-content-wrapper]:border-lime/30 [&_.leaflet-popup-content-wrapper]:bg-elevated [&_.leaflet-popup-content-wrapper]:text-paper [&_.leaflet-popup-tip]:bg-elevated"
    >
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={5}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <MapView places={places} selectedId={selectedId} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places.map((p) => (
          <Marker
            key={p.id ?? `${p.lat}-${p.lng}-${p.href}`}
            position={[p.lat, p.lng]}
            icon={nomadIcon}
            title={p.label}
            alt={`Select ${p.label}`}
            eventHandlers={{
              click: () => {
                if (p.id) onSelect?.(p.id);
              },
            }}
          >
            <Popup>
              <div className="font-mono text-xs">
                <span className="text-lime font-bold">●</span>{" "}
                {p.href ? (
                  <a
                    href={p.href}
                    className="text-lime font-semibold underline hover:text-paper"
                  >
                    {p.label}
                  </a>
                ) : (
                  <span className="font-semibold text-paper/90">{p.label}</span>
                )}
                <div className="mt-1 text-[10px] text-paper/50">
                  {Math.abs(p.lat).toFixed(2)}°{p.lat < 0 ? "S" : "N"},{" "}
                  {Math.abs(p.lng).toFixed(2)}°{p.lng < 0 ? "W" : "E"}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
