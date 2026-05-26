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
      className="fixed inset-0 z-[9999] flex items-start sm:items-center justify-center p-2 sm:p-4"
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

      {/* Modal card */}
      <div
        className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-[0_32px_80px_-12px_rgba(0,0,0,0.45)] flex flex-col"
        style={{ maxHeight: "calc(100svh - 16px)", overflowY: "auto" }}
      >
        {/* Sticky close */}
        <div className="sticky top-0 z-20 flex justify-end px-4 pt-4 bg-white rounded-t-3xl">
          <button
            onClick={() => setOpen(false)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Header */}
        <div className="px-8 pt-2 pb-5 text-center">
          <p
            className="text-[10px] font-semibold tracking-[0.22em] uppercase text-stone-400"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Before You Go
          </p>
          <h2
            className="mt-2 text-[26px] sm:text-[34px] leading-[1.1] text-stone-900"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Book Your Free Strategy Call.
          </h2>
          <p
            className="mt-2 text-sm text-stone-500 max-w-sm mx-auto"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            30 minutes. No pitch. No pressure. We&rsquo;ll look at your venue&rsquo;s actual numbers
            and show you exactly what&rsquo;s leaking.
          </p>
        </div>

        {/* Calendar embed — padded container so calendar doesn't touch modal edges */}
        <div className="bg-white overflow-hidden px-6 sm:px-8">
          <iframe
            src={CALENDAR_URL}
            id={CALENDAR_ID}
            className="bg-white block"
            style={{
              width: "calc(100% + 8px)",
              height: 610,
              marginLeft: -4,
              marginTop: -4,
              marginBottom: -4,
              border: 0,
              outline: "none",
              boxShadow: "none",
              overflow: "hidden",
            }}
            scrolling="no"
            title="Book your free strategy call"
          />
        </div>

        {/* Dismiss */}
        <div className="py-4 text-center bg-white rounded-b-3xl">
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
