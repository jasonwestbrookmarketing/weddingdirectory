"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const CALENDAR_URL = "https://api.leadconnectorhq.com/widget/booking/YeI4ZUC2SwV8MXDRKfzr";
const CALENDAR_ID  = "YeI4ZUC2SwV8MXDRKfzr_1779370346164";
const GHL_SCRIPT   = "https://link.msgsndr.com/js/form_embed.js";

/**
 * Drop-in modal for the /strategy-call page.
 *
 * Opens on two triggers:
 *   1. Any element that dispatches the custom event "open-strategy-modal"
 *   2. Exit-intent (cursor exits the top of the viewport)
 *
 * Mobile fallback: opens after 45 s of dwell time (same as /book-more-weddings).
 * The GHL calendar iframe pre-loads silently so there's no delay when it appears.
 */
export default function StrategyCallModal() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

  // Pre-load GHL script so the calendar is ready before first open
  useEffect(() => {
    if (document.querySelector(`script[src="${GHL_SCRIPT}"]`)) return;
    const script = document.createElement("script");
    script.src = GHL_SCRIPT;
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Listen for button-triggered opens
  useEffect(() => {
    const handler = () => { setOpen(true); setShown(true); };
    window.addEventListener("open-strategy-modal", handler);
    return () => window.removeEventListener("open-strategy-modal", handler);
  }, []);

  // Exit-intent detection
  useEffect(() => {
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !shown) {
        setOpen(true);
        setShown(true);
      }
    };

    let mobileTimer: ReturnType<typeof setTimeout>;
    if (window.innerWidth < 1024) {
      mobileTimer = setTimeout(() => {
        if (!shown) { setOpen(true); setShown(true); }
      }, 45_000);
    }

    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      clearTimeout(mobileTimer);
    };
  }, [shown]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-stretch sm:items-center justify-center sm:p-4"
      style={{ display: open ? "flex" : "none" }}
      role="dialog"
      aria-modal="true"
      aria-label="Book your free strategy call"
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Modal card.
          Mobile: full-screen (h-full, no rounded corners, no padding) so the
          iframe fills the visible area and GHL handles its own scrolling.
          Touching inside a cross-origin iframe sends events to GHL, not to
          our scroll container — making the card fill the whole screen and
          letting the iframe scroll internally is the only reliable mobile fix.
          Desktop: centred card with max-width, rounded corners, shadow. */}
      <div
        className="relative z-10 w-full sm:max-w-2xl bg-white sm:rounded-3xl sm:shadow-[0_32px_80px_-12px_rgba(0,0,0,0.45)] flex flex-col h-full sm:h-auto"
        style={{ maxHeight: "100svh" }}
      >
        {/* Close row — always visible at top */}
        <div className="shrink-0 flex justify-end px-4 pt-4 bg-white sm:rounded-t-3xl">
          <button
            onClick={() => setOpen(false)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Header — compact on mobile to maximise iframe space */}
        <div className="shrink-0 px-6 sm:px-8 pt-1 sm:pt-2 pb-3 sm:pb-5 text-center">
          <p
            className="text-[10px] font-semibold tracking-[0.22em] uppercase text-stone-400"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Before You Go
          </p>
          <h2
            className="mt-1 sm:mt-2 text-[22px] sm:text-[34px] leading-[1.1] text-stone-900"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Book Your Free Strategy Call.
          </h2>
          <p
            className="hidden sm:block mt-2 text-sm text-stone-500 max-w-[30ch] mx-auto"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            30 minutes. No pitch. No pressure. We&rsquo;ll show you exactly what&rsquo;s leaking.
          </p>
        </div>

        {/* Calendar embed.
            flex-1 + min-h-0 makes the wrapper fill all remaining card height
            on mobile (full-screen card, so GHL gets the full space it needs
            and scrolls internally). On desktop, sm:min-h-[640px] gives the
            calendar enough room for every step without the card needing to
            scroll. The 2px margin trick clips GHL's 1px widget border. */}
        <div className="flex-1 min-h-0 sm:min-h-[640px] bg-white overflow-hidden">
          <iframe
            src={CALENDAR_URL}
            id={CALENDAR_ID}
            className="bg-white block w-full h-full"
            style={{
              marginLeft: -2,
              width: "calc(100% + 4px)",
              border: 0,
              outline: "none",
              boxShadow: "none",
            }}
            scrolling="auto"
            title="Book your free strategy call"
          />
        </div>

        {/* Dismiss */}
        <div className="shrink-0 py-3 sm:py-4 text-center bg-white sm:rounded-b-3xl">
          <button
            onClick={() => setOpen(false)}
            className="text-[12px] text-stone-400 hover:text-stone-600 transition-colors underline underline-offset-2"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            No thanks, I&apos;ll figure it out on my own
          </button>
        </div>
      </div>
    </div>
  );
}
