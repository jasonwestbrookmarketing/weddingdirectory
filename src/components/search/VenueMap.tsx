"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, X, Users, ExternalLink, AlertCircle } from "lucide-react";
import type { Venue } from "@/types/database";

interface Props {
  venues: Venue[];
}

interface QuickCard {
  venue: Venue;
  x: number;
  y: number;
}

export default function VenueMap({ venues }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const markersRef = useRef<unknown[]>([]);
  const [quickCard, setQuickCard] = useState<QuickCard | null>(null);
  const [mounted, setMounted] = useState(false);
  const [tokenMissing, setTokenMissing] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const mappable = venues.filter((v) => v.lat != null && v.lng != null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      setTokenMissing(true);
      return;
    }

    let destroyed = false;

    void import("mapbox-gl")
      .then((mapboxgl) => {
        if (destroyed || !containerRef.current) return;

        if (mapRef.current) {
          (mapRef.current as mapboxgl.Map).remove();
          mapRef.current = null;
          markersRef.current = [];
        }

        mapboxgl.default.accessToken = token;

        const center: [number, number] =
          mappable.length > 0
            ? [mappable[0].lng as number, mappable[0].lat as number]
            : [-98.35, 39.5];

        let map: mapboxgl.Map;
        try {
          map = new mapboxgl.default.Map({
            container: containerRef.current!,
            style: "mapbox://styles/mapbox/light-v11",
            center,
            zoom: mappable.length > 0 ? 7 : 4,
            scrollZoom: false,
            attributionControl: true,
          });
        } catch (err) {
          console.error("[VenueMap] Mapbox init failed", err);
          setMapError(err instanceof Error ? err.message : "Failed to initialize map");
          return;
        }

        mapRef.current = map;

        map.on("error", (e) => {
          const msg =
            (e?.error && (e.error as Error).message) ||
            (e as unknown as { message?: string }).message ||
            "Unknown Mapbox error";
          console.error("[VenueMap] Mapbox runtime error", e);
          setMapError(msg);
        });

        map.on("load", () => {
        if (destroyed) return;

        mappable.forEach((venue) => {
          // Circular photo pin — matches the previous Leaflet style
          const el = document.createElement("div");
          el.style.cssText = [
            "width:54px",
            "height:54px",
            "border-radius:50%",
            "border:3px solid white",
            "box-shadow:0 1px 6px rgba(0,0,0,0.18)",
            "cursor:pointer",
            "overflow:hidden",
            "background:#44403c",
            "display:flex",
            "align-items:center",
            "justify-content:center",
            "flex-shrink:0",
          ].join(";");

          if (venue.cover_image_url) {
            el.style.backgroundImage = `url(${venue.cover_image_url})`;
            el.style.backgroundSize = "cover";
            el.style.backgroundPosition = "center";
          } else {
            el.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
          }

          // Venue name label underneath pin
          const wrapper = document.createElement("div");
          wrapper.style.cssText =
            "display:flex;flex-direction:column;align-items:center;width:120px;margin-left:-30px;cursor:pointer;";
          const label = document.createElement("div");
          label.textContent = venue.name || "Venue";
          label.style.cssText = [
            "margin-top:5px",
            "text-align:center",
            "font-size:11.5px",
            "font-weight:600",
            "color:#1c1917",
            "line-height:1.3",
            "max-width:110px",
            "word-wrap:break-word",
            "text-shadow:0 1px 3px rgba(255,255,255,0.9),0 0 6px rgba(255,255,255,0.7)",
            "pointer-events:none",
          ].join(";");
          wrapper.appendChild(el);
          wrapper.appendChild(label);

          const marker = new mapboxgl.default.Marker({ element: wrapper, anchor: "top" })
            .setLngLat([venue.lng as number, venue.lat as number])
            .addTo(map);

          wrapper.addEventListener("click", (e) => {
            e.stopPropagation();
            const rect = containerRef.current!.getBoundingClientRect();
            const point = map.project([venue.lng as number, venue.lat as number]);
            setQuickCard({
              venue,
              x: Math.min(point.x, rect.width - 280),
              y: Math.max(point.y - 160, 8),
            });
          });

          markersRef.current.push(marker);
        });

        // Fit all markers into view
        if (mappable.length > 1) {
          const lngs = mappable.map((v) => v.lng as number);
          const lats = mappable.map((v) => v.lat as number);
          map.fitBounds(
            [
              [Math.min(...lngs), Math.min(...lats)],
              [Math.max(...lngs), Math.max(...lats)],
            ],
            { padding: 60, maxZoom: 12 },
          );
        }
      });

        map.on("click", () => setQuickCard(null));
      })
      .catch((err) => {
        console.error("[VenueMap] Failed to load mapbox-gl module", err);
        setMapError(
          err instanceof Error ? err.message : "Failed to load Mapbox library",
        );
      });

    return () => {
      destroyed = true;
      if (mapRef.current) {
        (mapRef.current as mapboxgl.Map).remove();
        mapRef.current = null;
        markersRef.current = [];
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, venues]);

  return (
    <div className="relative w-full h-[380px] bg-stone-100 overflow-hidden rounded-2xl border border-stone-200">
      {!mounted && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
          <div className="animate-spin h-6 w-6 border-2 border-stone-300 border-t-stone-700 rounded-full" />
        </div>
      )}
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* Quick card popup */}
      {quickCard && (
        <div
          className="absolute z-[1000] w-64 bg-white rounded-xl overflow-hidden border border-stone-200 shadow-lg"
          style={{ left: quickCard.x, top: quickCard.y }}
        >
          <button
            onClick={() => setQuickCard(null)}
            className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-1 text-stone-500 hover:text-stone-900"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          {quickCard.venue.cover_image_url ? (
            <div className="relative h-36 w-full">
              <Image
                src={quickCard.venue.cover_image_url}
                alt={quickCard.venue.name || "Venue"}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-36 bg-stone-100 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-stone-300" />
            </div>
          )}

          <div className="p-3 space-y-1">
            <p className="font-semibold text-sm text-stone-900 truncate">
              {quickCard.venue.name}
            </p>
            {quickCard.venue.location_full && (
              <p className="text-xs text-stone-500 flex items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0" />
                {quickCard.venue.location_full}
              </p>
            )}
            {(quickCard.venue.capacity_min != null || quickCard.venue.capacity_max != null) && (
              <p className="text-xs text-stone-500 flex items-center gap-1">
                <Users className="h-3 w-3 shrink-0" />
                {quickCard.venue.capacity_max
                  ? `Up to ${quickCard.venue.capacity_max} guests`
                  : `${quickCard.venue.capacity_min}+ guests`}
              </p>
            )}
            <Link
              href={`/venue/${quickCard.venue.slug}`}
              className="mt-2 flex items-center justify-center gap-1.5 w-full bg-stone-900 text-white text-xs font-semibold py-2 rounded-lg hover:bg-stone-700 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              View Listing
            </Link>
          </div>
        </div>
      )}

      {tokenMissing && mounted && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-stone-400 pointer-events-none z-10">
          <AlertCircle className="h-8 w-8" />
          <p className="text-sm font-medium">Map not configured</p>
          <p className="text-xs">Set NEXT_PUBLIC_MAPBOX_TOKEN to enable the map</p>
        </div>
      )}

      {mapError && mounted && !tokenMissing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-stone-500 z-10 p-6 text-center bg-stone-100">
          <AlertCircle className="h-8 w-8 text-amber-500" />
          <p className="text-sm font-medium">Map failed to load</p>
          <p className="text-xs max-w-md break-words">{mapError}</p>
          <p className="text-[11px] text-stone-400 mt-1">
            Check the Mapbox token (must start with <code>pk.</code>) and any
            URL restrictions in your Mapbox account.
          </p>
        </div>
      )}

      {mappable.length === 0 && mounted && !tokenMissing && !mapError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-stone-400 pointer-events-none z-10">
          <MapPin className="h-8 w-8" />
          <p className="text-sm">No venues with location data</p>
        </div>
      )}
    </div>
  );
}
