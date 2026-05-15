"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";

export default function VenueDarkMap({
  lat,
  lng,
  venueName,
}: {
  lat: number;
  lng: number;
  venueName?: string | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const [tokenMissing, setTokenMissing] = useState(false);

  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${lat},${lng}`,
  )}`;

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      setTokenMissing(true);
      return;
    }
    if (!containerRef.current || mapRef.current) return;

    let map: mapboxgl.Map | null = null;
    let ro: ResizeObserver | null = null;

    void import("mapbox-gl").then((mapboxgl) => {
      if (!containerRef.current) return;

      mapboxgl.default.accessToken = token;

      map = new mapboxgl.default.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: 15,
        attributionControl: true,
      });

      ro = new ResizeObserver(() => {
        map?.resize();
      });
      ro.observe(containerRef.current);

      requestAnimationFrame(() => {
        map?.resize();
      });

      // Branded dark pin
      const el = document.createElement("div");
      el.style.cssText = [
        "width:32px",
        "height:44px",
        "background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 40'%3E%3Cpath d='M14 0C6.3 0 0 6.3 0 14c0 9.3 12.6 24.5 13.1 25.1.5.6 1.3.6 1.8 0C15.4 38.5 28 23.3 28 14 28 6.3 21.7 0 14 0z' fill='%231c1917' stroke='%23ffffff' stroke-width='1.5'/%3E%3Ccircle cx='14' cy='14' r='5' fill='%23ffffff'/%3E%3C/svg%3E\")",
        "background-size:contain",
        "background-repeat:no-repeat",
        "cursor:pointer",
      ].join(";");

      const marker = new mapboxgl.default.Marker({ element: el, anchor: "bottom" })
        .setLngLat([lng, lat]);

      if (venueName) {
        marker.setPopup(
          new mapboxgl.default.Popup({ offset: 25, closeButton: false })
            .setHTML(
              `<span style="font-family:-apple-system,sans-serif;font-size:13px;font-weight:600;color:#1c1917">${venueName}</span>`,
            ),
        );
      }

      marker.addTo(map);
      mapRef.current = map;
    });

    return () => {
      ro?.disconnect();
      map?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative h-[380px] w-full overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
      {tokenMissing ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-stone-400">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p className="text-sm font-medium">Map not configured</p>
          <p className="text-xs">Set NEXT_PUBLIC_MAPBOX_TOKEN to enable the map</p>
        </div>
      ) : (
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      )}

      <a
        href={directionsHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={venueName ? `Get directions to ${venueName}` : "Get directions"}
        className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-900 shadow-md transition-colors hover:bg-stone-50 z-10"
      >
        <DirectionsIcon className="h-4 w-4" />
        Get directions
      </a>
    </div>
  );
}

function DirectionsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}
