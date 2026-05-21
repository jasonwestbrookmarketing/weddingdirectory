"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const CALENDAR_URL = "https://api.leadconnectorhq.com/widget/booking/YeI4ZUC2SwV8MXDRKfzr";
const CALENDAR_ID  = "YeI4ZUC2SwV8MXDRKfzr_1779370346164";
const GHL_SCRIPT   = "https://link.msgsndr.com/js/form_embed.js";

export default function ExitIntentModal() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // Desktop: fire when cursor leaves viewport toward browser chrome
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !shown) {
        setOpen(true);
        setShown(true);
      }
    };

    // Mobile/tablet: fire after 45 s of inactivity as a soft prompt
    let mobileTimer: ReturnType<typeof setTimeout>;
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      mobileTimer = setTimeout(() => {
        if (!shown) {
          setOpen(true);
          setShown(true);
        }
      }, 45_000);
    }

    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      clearTimeout(mobileTimer);
    };
  }, [shown]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Load GHL embed script once the modal opens
  useEffect(() => {
    if (!open) return;
    if (document.querySelector(`script[src="${GHL_SCRIPT}"]`)) return;
    const script = document.createElement("script");
    script.src = GHL_SCRIPT;
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-[0_32px_80px_-12px_rgba(0,0,0,0.45)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="px-8 pt-10 pb-5 text-center border-b border-stone-100">
          <p
            className="text-[10px] font-semibold tracking-[0.22em] uppercase text-stone-400"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            — Before you go
          </p>
          <h2
            className="mt-2 text-[28px] sm:text-[34px] leading-[1.1] text-stone-900"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            See StoryVenue Live.
          </h2>
          <p
            className="mt-2 text-sm text-stone-500 max-w-sm mx-auto"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Book a free 15-minute demo. We'll show you exactly how StoryVenue
            fills your calendar — no pressure, no pitch deck.
          </p>
        </div>

        {/* Calendar embed */}
        <div className="bg-stone-50 px-2 py-2">
          <iframe
            src={CALENDAR_URL}
            id={CALENDAR_ID}
            className="w-full rounded-2xl bg-white"
            style={{ height: 600, border: "none", overflow: "hidden" }}
            scrolling="no"
            title="Book a free demo"
          />
        </div>

        {/* Footer dismiss */}
        <div className="py-4 text-center bg-white">
          <button
            onClick={() => setOpen(false)}
            className="text-[12px] text-stone-400 hover:text-stone-600 transition-colors underline underline-offset-2"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            No thanks, I'll figure it out on my own
          </button>
        </div>
      </div>
    </div>
  );
}
