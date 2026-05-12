"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, X, Users, ExternalLink } from "lucide-react";
import type { Venue } from "@/types/database";

interface Props {
  venues: Venue[];
}

interface QuickCard {
  venue: Venue;
  x: number;
  y: number;
}

// Leaflet is browser-only — dynamically import to avoid SSR issues.
export default function VenueMap({ venues }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletMapRef = useRef<any>(null);
  const [quickCard, setQuickCard] = useState<QuickCard | null>(null);
  const [mounted, setMounted] = useState(false);

  const mappable = venues.filter(
    (v) => v.lat != null && v.lng != null
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !mapRef.current) return;

    let isMounted = true;

    async function initMap() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (!isMounted || !mapRef.current) return;

      // Destroy old map instance on re-render
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }

      const center: [number, number] =
        mappable.length > 0
          ? [mappable[0].lat as number, mappable[0].lng as number]
          : [39.5, -98.35];

      const map = L.map(mapRef.current, {
        center,
        zoom: mappable.length > 0 ? 8 : 4,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      leafletMapRef.current = map;

      // CartoDB Positron — clean light-grey minimal style matching the reference
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      // Circular photo pin + name label below — matches UKR Club reference style
      const createIcon = (imageUrl: string | null | undefined, name: string) => {
        const pinSize = 54;
        const imgHtml = imageUrl
          ? `<div style="
              width:${pinSize}px;height:${pinSize}px;border-radius:50%;
              border:3px solid white;
              background:url(${imageUrl}) center/cover no-repeat;
              box-shadow:0 1px 6px rgba(0,0,0,0.18);
              cursor:pointer;
              flex-shrink:0;
            "></div>`
          : `<div style="
              width:${pinSize}px;height:${pinSize}px;border-radius:50%;
              border:3px solid white;
              background:#44403c;
              display:flex;align-items:center;justify-content:center;
              box-shadow:0 1px 6px rgba(0,0,0,0.18);
              cursor:pointer;
              flex-shrink:0;
            ">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>`;

        const labelHtml = `<div style="
          margin-top:5px;
          text-align:center;
          font-size:11.5px;
          font-weight:600;
          color:#1c1917;
          line-height:1.3;
          max-width:110px;
          word-wrap:break-word;
          text-shadow:0 1px 3px rgba(255,255,255,0.9),0 0 6px rgba(255,255,255,0.7);
          pointer-events:none;
        ">${name}</div>`;

        return L.divIcon({
          html: `<div style="display:flex;flex-direction:column;align-items:center;width:120px;margin-left:-33px;">${imgHtml}${labelHtml}</div>`,
          className: "",
          iconSize: [120, 80],
          iconAnchor: [60, pinSize + 4],
          popupAnchor: [0, -(pinSize + 4)],
        });
      };

      mappable.forEach((venue) => {
        const marker = L.marker([venue.lat as number, venue.lng as number], {
          icon: createIcon(venue.cover_image_url, venue.name || "Venue"),
        }).addTo(map);

        marker.on("click", (e: { originalEvent: MouseEvent }) => {
          const containerRect = mapRef.current!.getBoundingClientRect();
          const point = map.latLngToContainerPoint([venue.lat as number, venue.lng as number]);
          setQuickCard({
            venue,
            x: Math.min(point.x, containerRect.width - 280),
            y: Math.max(point.y - 160, 8),
          });
          e.originalEvent.stopPropagation();
        });
      });

      // Fit all markers into view
      if (mappable.length > 1) {
        const bounds = L.latLngBounds(
          mappable.map((v) => [v.lat as number, v.lng as number])
        );
        map.fitBounds(bounds, { padding: [40, 40] });
      }

      // Close quick card on map click
      map.on("click", () => setQuickCard(null));
    }

    initMap();

    return () => {
      isMounted = false;
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
      <div ref={mapRef} className="absolute inset-0 z-0" />

      {/* Quick card popup */}
      {quickCard && (
        <div
          className="absolute z-[1000] w-64 bg-white rounded-xl overflow-hidden border border-stone-200"
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

      {mappable.length === 0 && mounted && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-stone-400 pointer-events-none z-10">
          <MapPin className="h-8 w-8" />
          <p className="text-sm">No venues with location data</p>
        </div>
      )}
    </div>
  );
}
