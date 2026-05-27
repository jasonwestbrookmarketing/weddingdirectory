"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const CALENDAR_URL = "https://api.leadconnectorhq.com/widget/booking/YeI4ZUC2SwV8MXDRKfzr";
const CALENDAR_ID  = "YeI4ZUC2SwV8MXDRKfzr_1779890654536";
const GHL_SCRIPT   = "https://link.msgsndr.com/js/form_embed.js";

export default function ExitIntentModal() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

  // Load GHL embed script immediately on mount so the calendar is already
  // initialised by the time the user triggers the modal.
  useEffect(() => {
    if (document.querySelector(`script[src="${GHL_SCRIPT}"]`)) return;
    const script = document.createElement("script");
    script.src = GHL_SCRIPT;
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);
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
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
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

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Keep the component always mounted so the iframe pre-loads in the
  // background. We toggle visibility with display instead of unmounting.
  return (
    <>
      {/* MOBILE: full-screen scroll container around GHL's auto-resizing
          iframe. form_embed.js grows the iframe to its content height; the
          surrounding div handles all scrolling so iOS Safari can reach every
          form step including Submit. Floating X close button overlays the
          top-right corner. */}
      <div
        className={`sm:hidden fixed inset-0 z-[9999] bg-white overflow-y-auto ${open ? "" : "!hidden"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Book a free demo"
        aria-hidden={!open}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <button
          onClick={() => setOpen(false)}
          className="fixed top-3 right-3 z-[10000] flex items-center justify-center w-10 h-10 rounded-full bg-white/95 shadow-lg text-stone-700 hover:text-stone-900 transition-colors"
          aria-label="Close"
          style={{ touchAction: "manipulation" }}
        >
          <X className="w-5 h-5" />
        </button>

        <iframe
          src={CALENDAR_URL}
          id={CALENDAR_ID}
          title="Book a free demo"
          scrolling="no"
          style={{
            width: "100%",
            border: "none",
            overflow: "hidden",
            display: "block",
          }}
        />
      </div>

      {/* DESKTOP: editorial modal card */}
      <div
        className={`hidden sm:flex fixed inset-0 z-[9999] items-center justify-center p-4 ${open ? "" : "!hidden"}`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />

        {/* Card */}
        <div
          className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-[0_32px_80px_-12px_rgba(0,0,0,0.45)] flex flex-col"
          style={{ maxHeight: "calc(100svh - 32px)", overflowY: "auto" }}
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
              — Before you go
            </p>
            <h2
              className="mt-2 text-[34px] leading-[1.1] text-stone-900"
              style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
            >
              See StoryVenue Live.
            </h2>
            <p
              className="mt-2 text-sm text-stone-500 max-w-sm mx-auto"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Book a free 30-minute demo. We&rsquo;ll show you exactly how we fully book wedding venues.
            </p>
          </div>

          {/* Calendar iframe — GHL auto-resize embed pattern.
              px-10 creates breathing room on both sides so the calendar
              looks naturally proportioned inside the wider card. */}
          <div className="bg-white px-10">
            <iframe
              src={CALENDAR_URL}
              id={`${CALENDAR_ID}_desktop`}
              className="bg-white block"
              style={{
                width: "100%",
                border: "none",
                overflow: "hidden",
              }}
              scrolling="no"
              title="Book a free demo"
            />
          </div>

          {/* Footer dismiss */}
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
    </>
  );
}
