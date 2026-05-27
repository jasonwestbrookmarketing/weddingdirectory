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
          Mobile: 100svh full-screen. Header + dismiss row are hidden so the
          GHL iframe gets the entire viewport height. GHL's calendar is a
          single-page app that scrolls its own form steps internally — giving
          it the full screen is the only reliable way to fit the multi-step
          Enter Details form on iOS Safari (cross-origin iframes don't bubble
          touch events to parent scroll containers, so we can't scroll the
          card from inside the iframe).
          Desktop: centred card with max-width, rounded corners, shadow,
          header + dismiss visible. */}
      <div
        className="relative z-10 w-full sm:max-w-2xl bg-white sm:rounded-3xl sm:shadow-[0_32px_80px_-12px_rgba(0,0,0,0.45)] flex flex-col h-full sm:h-auto"
        style={{ maxHeight: "100svh" }}
      >
        {/* Floating close button — overlays the iframe on mobile, sits in the
            header row on desktop. Absolute positioning on mobile saves the
            ~50px of vertical space a full close-row would consume. */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 z-30 flex items-center justify-center w-9 h-9 rounded-full bg-white/95 shadow-md text-stone-600 hover:text-stone-900 hover:bg-white transition-colors sm:static sm:bg-stone-100 sm:shadow-none sm:hover:bg-stone-200 sm:self-end sm:mr-4 sm:mt-4"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header — hidden on mobile, visible on desktop only.
            Mobile needs every pixel for the iframe; the floating X is enough
            context to dismiss. Desktop keeps the editorial framing. */}
        <div className="hidden sm:block shrink-0 px-8 pt-2 pb-5 text-center">
          <p
            className="text-[10px] font-semibold tracking-[0.22em] uppercase text-stone-400"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Before You Go
          </p>
          <h2
            className="mt-2 text-[34px] leading-[1.1] text-stone-900"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Book Your Free Strategy Call.
          </h2>
          <p
            className="mt-2 text-sm text-stone-500 max-w-[30ch] mx-auto"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            30 minutes. No pitch. No pressure. We&rsquo;ll show you exactly what&rsquo;s leaking.
          </p>
        </div>

        {/* Calendar embed.
            flex-1 + min-h-0 fills all remaining vertical space. On mobile that
            is the whole 100svh viewport (no header, no dismiss), so GHL's
            multi-step form has full height to render its longest step (Enter
            Details). On desktop sm:min-h-[640px] guarantees the card is tall
            enough. The 2px margin trick clips GHL's 1px widget border. */}
        <div className="flex-1 min-h-0 sm:min-h-[640px] bg-white relative">
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

        {/* Dismiss — desktop only. Mobile uses the floating X. */}
        <div className="hidden sm:block shrink-0 py-4 text-center bg-white sm:rounded-b-3xl">
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
