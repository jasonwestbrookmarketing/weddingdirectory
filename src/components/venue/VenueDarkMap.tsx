"use client";

// Kept the file name for minimal churn; this is just a Google Maps embed now
// so couples see the cartography they already recognize, with a one-tap
// "Get directions" button that hands off to the real Google Maps app/site.

const ZOOM = 15;

export default function VenueDarkMap({
  lat,
  lng,
  venueName,
}: {
  lat: number;
  lng: number;
  venueName?: string | null;
}) {
  // `output=embed` on maps.google.com works without an API key and renders
  // the native Google Maps look (labels, POIs, traffic-free basemap). The
  // `q=` param doubles as the marker pin so we don't need a separate overlay.
  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    `${lat},${lng}`,
  )}&z=${ZOOM}&hl=en&output=embed`;

  // The canonical "open Google Maps with directions to X" URL. Google Maps
  // fills the user's current location as the origin automatically.
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${lat},${lng}`,
  )}`;

  const label = venueName
    ? `Open directions to ${venueName} in Google Maps`
    : "Open directions in Google Maps";

  return (
    <div className="relative h-[380px] w-full overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
      <iframe
        title={venueName ? `Map showing ${venueName}` : "Venue location map"}
        src={embedSrc}
        className="h-full w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        // Allow pan/zoom but keep the iframe from capturing scroll until the
        // user interacts with it so the page still scrolls naturally.
        allow="geolocation"
      />

      <a
        href={directionsHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-900 shadow-md transition-colors hover:bg-stone-50"
      >
        <DirectionsIcon className="h-4 w-4" />
        Get directions
      </a>
    </div>
  );
}

// Simple inline icon so we don't pull in another icon dep. Matches the
// rounded-square direction arrow that Google Maps itself uses.
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
