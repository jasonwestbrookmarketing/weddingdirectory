"use client";

import { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

// Editorial palette: warm cream paper with near-black ink for roads and type.
// Water/landuse pick up slightly cooler/warmer accents so the composition
// reads without color beyond the single red pin.
const CREAM = "#F5EEDC"; // page/background
const CREAM_SHADE = "#EDE3CB"; // landuse / parks
const WATER = "#E0D7BE"; // slightly darker cream for water
const INK = "#1b1b1b"; // streets + type
const PIN = "#D0342C"; // marker red

// OpenFreeMap serves free, API-key-less vector tiles. Positron is the cleanest
// base — we swap colors at runtime to get the cream/ink look.
const BASE_STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

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
  const mapRef = useRef<import("maplibre-gl").Map | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;

    // Dynamic import keeps MapLibre out of the initial bundle and guarantees
    // we never evaluate its `window` dependencies during SSR.
    import("maplibre-gl").then((mod) => {
      if (cancelled || !el || mapRef.current) return;
      const maplibregl = mod.default ?? mod;

      const map = new maplibregl.Map({
        container: el,
        style: BASE_STYLE_URL,
        center: [lng, lat],
        zoom: 13.5,
        attributionControl: false,
        dragRotate: false,
        pitchWithRotate: false,
        scrollZoom: false,
      });

      map.touchZoomRotate?.disableRotation();
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      map.addControl(
        new maplibregl.AttributionControl({ compact: true }),
        "bottom-right",
      );

      map.on("load", () => {
        applyCreamPalette(map);
      });
      // Style can finish loading after `load` in some edge cases (e.g.
      // network-slow sprite fetch); re-apply once the style is fully parsed.
      map.on("styledata", () => applyCreamPalette(map));

      // Custom red pin as a DOM element so we don't need a marker image.
      const pinEl = document.createElement("div");
      pinEl.innerHTML = buildPinHtml();
      pinEl.style.cursor = "default";

      const marker = new maplibregl.Marker({ element: pinEl, anchor: "bottom" })
        .setLngLat([lng, lat])
        .addTo(map);

      if (venueName) {
        const popup = new maplibregl.Popup({
          offset: 28,
          closeButton: false,
          className: "sv-venue-popup",
        }).setHTML(
          `<div style="font-family:inherit;font-weight:600;color:${INK};font-size:0.8125rem;padding:4px 2px">${escapeHtml(
            venueName,
          )}</div>`,
        );
        marker.setPopup(popup);
      }

      mapRef.current = map;
      requestAnimationFrame(() => map.resize());
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
      className="h-[380px] w-full rounded-2xl overflow-hidden border border-stone-200"
      style={{ background: CREAM }}
      role="img"
      aria-label={venueName ? `Map showing ${venueName}` : "Venue location map"}
    />
  );
}

// ---------- helpers ----------

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildPinHtml() {
  return `
    <div style="position:relative;display:flex;align-items:center;justify-content:center">
      <svg width="30" height="40" viewBox="0 0 34 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="filter:drop-shadow(0 3px 6px rgba(0,0,0,0.25))">
        <path d="M17 2C8.716 2 2 8.716 2 17c0 10.7 13.5 24 14.075 24.562a1.25 1.25 0 0 0 1.85 0C18.5 41 32 27.7 32 17 32 8.716 25.284 2 17 2Z" fill="${PIN}" stroke="white" stroke-width="2.25"/>
        <circle cx="17" cy="17" r="5" fill="white"/>
      </svg>
    </div>
  `;
}

// Walk the current MapLibre style and repaint into our cream/ink palette.
// We don't know the exact layer ids (OpenFreeMap updates the style from time
// to time), so we match on id patterns and layer types. That keeps us resilient
// to style refreshes without having to hand-curate a style JSON.
function applyCreamPalette(map: import("maplibre-gl").Map) {
  const style = map.getStyle();
  const layers = style?.layers ?? [];

  for (const layer of layers) {
    const id = layer.id;
    const type = layer.type;

    try {
      if (type === "background") {
        map.setPaintProperty(id, "background-color", CREAM);
        continue;
      }

      if (type === "fill") {
        if (/water|ocean|sea|river|lake|pond/i.test(id)) {
          map.setPaintProperty(id, "fill-color", WATER);
          map.setPaintProperty(id, "fill-outline-color", WATER);
          continue;
        }
        if (/park|forest|wood|grass|landcover|vegetation|cemetery|golf/i.test(id)) {
          map.setPaintProperty(id, "fill-color", CREAM_SHADE);
          continue;
        }
        if (/building|structure/i.test(id)) {
          map.setPaintProperty(id, "fill-color", CREAM_SHADE);
          map.setPaintProperty(id, "fill-outline-color", CREAM_SHADE);
          continue;
        }
        if (/landuse|land|residential|industrial|commercial/i.test(id)) {
          map.setPaintProperty(id, "fill-color", CREAM);
          continue;
        }
        // Unknown fills: flatten to cream so we don't leak positron gray.
        map.setPaintProperty(id, "fill-color", CREAM);
      }

      if (type === "line") {
        // Borders/admin stay subtle; roads become ink.
        if (/boundary|admin/i.test(id)) {
          map.setPaintProperty(id, "line-color", "#B8AF94");
          continue;
        }
        if (/water|river|stream|canal/i.test(id)) {
          map.setPaintProperty(id, "line-color", WATER);
          continue;
        }
        // Road casings get the page color so the ink-colored centerline
        // reads as a clean single stroke instead of a doubled tram line.
        if (/(road|street|highway|motorway|path|track|bridge|tunnel).*(case|casing|outline)/i.test(id)) {
          map.setPaintProperty(id, "line-color", CREAM);
          continue;
        }
        if (/road|street|highway|motorway|trunk|primary|secondary|tertiary|minor|service|path|track|pedestrian|footway|cycleway|rail|transit/i.test(id)) {
          map.setPaintProperty(id, "line-color", INK);
          continue;
        }
        // Fallback: make unknown lines disappear rather than clash.
        map.setPaintProperty(id, "line-color", CREAM);
      }

      if (type === "symbol") {
        // All type (place names, POI, road labels) becomes ink; the soft
        // cream halo keeps tiny text legible on top of road strokes.
        map.setPaintProperty(id, "text-color", INK);
        map.setPaintProperty(id, "text-halo-color", CREAM);
        map.setPaintProperty(id, "text-halo-width", 1.25);
      }
    } catch {
      // Some layers expose a restricted paint spec (e.g. heatmaps on other
      // styles); skip silently so one outlier never breaks the whole map.
    }
  }
}
