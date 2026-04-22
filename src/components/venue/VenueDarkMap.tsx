"use client";

import { useState } from "react";

// Kept the file name for minimal churn; this is just a Google Maps embed now
// so couples see the cartography they already recognize, with a one-tap
// "Get directions" button that hands off to the real Google Maps app/site.

const DEFAULT_ZOOM = 15;
const MIN_ZOOM = 3;
const MAX_ZOOM = 20;

export default function VenueDarkMap({
  lat,
  lng,
  venueName,
}: {
  lat: number;
  lng: number;
  venueName?: string | null;
}) {
  // Google Maps' `output=embed` iframe doesn't render native +/- controls, so
  // we drive zoom from React state and feed it back into the iframe URL. Each
  // +/- click rewrites `src` with the new `z=` param; the iframe reloads but
  // stays centered on the venue.
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    `${lat},${lng}`,
  )}&z=${zoom}&hl=en&output=embed`;

  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${lat},${lng}`,
  )}`;

  const directionsLabel = venueName
    ? `Open directions to ${venueName} in Google Maps`
    : "Open directions in Google Maps";

  const canZoomIn = zoom < MAX_ZOOM;
  const canZoomOut = zoom > MIN_ZOOM;

  return (
    <div className="relative h-[380px] w-full overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
      <iframe
        title={venueName ? `Map showing ${venueName}` : "Venue location map"}
        src={embedSrc}
        className="h-full w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allow="geolocation"
      />

      {/* Google-Maps-style stacked +/- buttons, rendered above the iframe
          in a shadowed white card like their native control. */}
      <div
        className="absolute right-3 top-3 flex flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-md"
        role="group"
        aria-label="Zoom"
      >
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 1))}
          disabled={!canZoomIn}
          aria-label="Zoom in"
          className="flex h-9 w-9 items-center justify-center text-stone-700 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:text-stone-300 disabled:hover:bg-white"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
        <div className="h-px bg-stone-200" aria-hidden />
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 1))}
          disabled={!canZoomOut}
          aria-label="Zoom out"
          className="flex h-9 w-9 items-center justify-center text-stone-700 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:text-stone-300 disabled:hover:bg-white"
        >
          <MinusIcon className="h-4 w-4" />
        </button>
      </div>

      <a
        href={directionsHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={directionsLabel}
        className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-900 shadow-md transition-colors hover:bg-stone-50"
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

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
