"use client";

import { useEffect, useState } from "react";
import { X, CalendarHeart } from "lucide-react";
import Rsvp from "./Rsvp";

/**
 * Always-present floating RSVP button (mobile + desktop). Opens the full RSVP
 * flow in a centered modal so guests can respond from anywhere on the page.
 */
export default function RsvpFloating({ slug, weddingDate }: { slug: string; weddingDate?: string | null }) {
  const [open, setOpen] = useState(false);

  const shortDate = weddingDate
    ? new Date(`${weddingDate}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : null;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 inline-flex items-center gap-2.5 rounded-full bg-brand-ink px-9 py-3.5 text-sm font-semibold text-white shadow-[0_12px_32px_-8px_rgba(0,0,0,0.55)] transition-transform hover:-translate-y-0.5 hover:-translate-x-1/2"
      >
        <CalendarHeart className="h-4 w-4 shrink-0" />
        <span>RSVP</span>
        {shortDate && (
          <>
            <span className="h-4 w-px bg-white/30" aria-hidden />
            <span className="font-medium text-white/85">{shortDate}</span>
          </>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/60 p-4 py-10 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-[520px]" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute -top-2 right-0 z-10 flex h-9 w-9 -translate-y-full items-center justify-center rounded-full bg-white/90 text-brand-ink shadow hover:bg-white sm:-right-2"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="mb-1 text-center text-lg font-semibold text-white">RSVP</h2>
            <Rsvp slug={slug} />
          </div>
        </div>
      )}
    </>
  );
}
