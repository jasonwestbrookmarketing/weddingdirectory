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
        className="fixed bottom-5 left-1/2 z-[70] inline-flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-full bg-brand-ink px-9 py-3.5 text-sm font-semibold text-white shadow-[0_12px_32px_-8px_rgba(0,0,0,0.55)] transition-transform hover:-translate-y-0.5 hover:-translate-x-1/2"
      >
        <CalendarHeart className="h-4 w-4 shrink-0" />
        <span>RSVP</span>
        {shortDate && (
          <>
            <span className="h-4 w-px flex-none bg-white/30" aria-hidden />
            <span className="whitespace-nowrap font-medium text-white/85">{shortDate}</span>
          </>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <style>{`@keyframes svRsvpPop{0%{opacity:0;transform:scale(.94) translateY(8px)}100%{opacity:1;transform:none}}`}</style>
          <div
            className="relative flex max-h-[90vh] w-full max-w-[440px] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
            style={{ animation: "svRsvpPop .22s cubic-bezier(.16,1,.3,1) both" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-brand-line px-5 py-3.5">
              <span className="text-base font-semibold text-brand-ink">RSVP</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="-mr-1.5 flex h-9 w-9 items-center justify-center rounded-full text-brand-muted transition-colors hover:bg-brand-warm hover:text-brand-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-4 py-4">
              <Rsvp slug={slug} embedded />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
