"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

const AVATARS = [
  "/avatars/av1.jpg",
  "/avatars/av2.jpg",
  "/avatars/av3.jpg",
  "/avatars/av4.jpg",
  "/avatars/av5.jpg",
];

// Prequalifier survey. It redirects qualified leads to /strategy-call/book
// (the calendar page) and disqualified leads to /book-more-weddings — those
// redirects are configured inside the GHL survey itself.
const SURVEY_URL = "https://api.leadconnectorhq.com/widget/survey/foNEAvcN1Ecj7zm8gcoP";
const SURVEY_ID  = "foNEAvcN1Ecj7zm8gcoP";
const GHL_SCRIPT = "https://link.msgsndr.com/js/form_embed.js";

/**
 * Drop-in modal for the /strategy-call page.
 *
 * Opens on two triggers:
 *   1. Any element that dispatches the custom event "open-strategy-modal"
 *   2. Exit-intent (cursor exits the top of the viewport)
 *
 * Mobile fallback: opens after 45 s of dwell time (same as /book-more-weddings).
 * The GHL survey iframe pre-loads silently so there's no delay when it appears.
 * The survey prequalifies the lead, then GHL redirects them to the booking
 * calendar (/strategy-call/book) or the SaaS page (/book-more-weddings).
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
    <>
      {/* MOBILE: full-screen scroll container around GHL's auto-resizing iframe.
          form_embed.js listens for postMessage from the iframe and grows its
          height to fit content. With width:100%, scrolling="no", and no fixed
          height, the iframe behaves like a regular block element — the
          surrounding div scrolls naturally on iOS Safari, exposing the entire
          form including the submit button.
          A floating X close button overlays the top-right corner. */}
      <div
        className={`sm:hidden fixed inset-0 z-[9999] bg-white overflow-y-auto ${open ? "" : "!hidden"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Book your free strategy call"
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

        {/* Header + social proof (mirrors desktop) */}
        <div className="px-6 pt-12 pb-4 text-center">
          <h2
            className="text-[28px] leading-[1.1] text-stone-900"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Book Free Strategy Call
          </h2>
          <div className="mt-3 flex flex-col items-center gap-2.5">
            <p
              className="text-[12px] text-stone-400 tracking-wide"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              30-minute fit call · No pitch · No pressure
            </p>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5 shrink-0">
                {AVATARS.map((src, i) => (
                  <div
                    key={i}
                    className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden"
                    style={{ zIndex: 5 - i }}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      unoptimized
                      placeholder="empty"
                      className="object-cover object-center"
                      sizes="32px"
                    />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex gap-0.5" role="img" aria-label="5 stars">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="#1c1917"
                      aria-hidden="true"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p
                  className="text-[10px] text-stone-400 mt-0.5"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  Google Reviews
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* GHL standard embed — iframe auto-resizes to content height via
            form_embed.js postMessage. Parent div handles all scrolling. */}
        <iframe
          src={SURVEY_URL}
          id={SURVEY_ID}
          title="Book your free strategy call"
          scrolling="no"
          style={{
            width: "100%",
            border: "none",
            overflow: "hidden",
            display: "block",
          }}
        />
      </div>

      {/* DESKTOP: editorial modal card with header + dismiss row.
          Hidden on mobile (mobile uses the full-bleed version above). */}
      <div
        className={`hidden sm:flex fixed inset-0 z-[9999] items-center justify-center p-4 ${open ? "" : "!hidden"}`}
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

          {/* Header + social proof */}
          <div className="px-8 pt-2 pb-5 text-center">
            <h2
              className="mt-2 text-[34px] leading-[1.1] text-stone-900"
              style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
            >
              Book Free Strategy Call
            </h2>

            {/* Social proof under headline */}
            <div className="mt-4 flex flex-col items-center gap-2.5">
              <p
                className="text-[12px] text-stone-400 tracking-wide"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                30-minute fit call · No pitch · No pressure
              </p>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5 shrink-0">
                  {AVATARS.map((src, i) => (
                    <div
                      key={i}
                      className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden"
                      style={{ zIndex: 5 - i }}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        unoptimized
                        placeholder="empty"
                        className="object-cover object-center"
                        sizes="32px"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex gap-0.5" role="img" aria-label="5 stars">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="#1c1917"
                        aria-hidden="true"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p
                    className="text-[10px] text-stone-400 mt-0.5"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    Google Reviews
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Survey iframe */}
          <div className="bg-white px-10">
            <iframe
              src={SURVEY_URL}
              id={`${SURVEY_ID}_desktop`}
              className="bg-white block"
              style={{
                width: "100%",
                border: "none",
                overflow: "hidden",
              }}
              scrolling="no"
              title="Book your free strategy call"
            />
          </div>

          {/* Dismiss */}
        </div>
      </div>
    </>
  );
}
