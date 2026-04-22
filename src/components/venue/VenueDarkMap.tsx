"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

// Signature brand charcoal used across the directory.
const BRAND = "#1b1b1b";

// CartoDB Dark Matter: a minimal, near-monochrome basemap that lets the venue
// marker stand out instead of fighting roads/park polygons like default OSM.
// `dark_all` keeps place labels; swap to `dark_nolabels` if we ever want the
// map to be purely decorative.
const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTRIB =
  '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>';

function buildPinHtml() {
  // Inline pin SVG so we don't need Leaflet's default marker PNGs (which 404
  // unless you copy them into /public). Color matches the brand charcoal.
  return `
    <span class="relative flex items-center justify-center">
      <span class="absolute inline-flex h-10 w-10 rounded-full opacity-30" style="background:${BRAND}"></span>
      <svg width="34" height="44" viewBox="0 0 34 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M17 2C8.716 2 2 8.716 2 17c0 10.7 13.5 24 14.075 24.562a1.25 1.25 0 0 0 1.85 0C18.5 41 32 27.7 32 17 32 8.716 25.284 2 17 2Z" fill="${BRAND}" stroke="white" stroke-width="2.25"/>
        <circle cx="17" cy="17" r="5.25" fill="white"/>
      </svg>
    </span>
  `;
}

export default function VenueDarkMap({
  lat,
  lng,
  venueName,
}: {
  lat: number;
  lng: number;
  venueName?: string | null;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;

    // Dynamic import so Leaflet only loads on the client; it touches `window`
    // during import and crashes SSR otherwise.
    import("leaflet").then((LMod) => {
      if (cancelled || !el || mapRef.current) return;
      const L = LMod.default ?? LMod;

      const map = L.map(el, {
        center: [lat, lng],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
      });

      L.tileLayer(TILE_URL, {
        attribution: TILE_ATTRIB,
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(map);

      const icon = L.divIcon({
        className: "sv-venue-pin",
        html: buildPinHtml(),
        iconSize: [34, 44],
        iconAnchor: [17, 42],
        popupAnchor: [0, -38],
      });

      const marker = L.marker([lat, lng], { icon }).addTo(map);
      if (venueName) {
        marker.bindPopup(
          `<div style="font-family:inherit;font-weight:600;color:#1b1b1b">${venueName}</div>`,
        );
      }

      mapRef.current = map;

      // Leaflet sometimes mis-measures the container when it mounts inside a
      // CSS grid; a single post-mount invalidate fixes the first-paint bug.
      requestAnimationFrame(() => map.invalidateSize());
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, venueName]);

  return (
    <div
      ref={containerRef}
      className="h-[380px] w-full rounded-2xl overflow-hidden border border-stone-200 bg-[#1b1b1b]"
      role="img"
      aria-label={venueName ? `Map showing ${venueName}` : "Venue location map"}
    />
  );
}
