"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const SESSION_KEY = "sv_book_exit_nudge_shown";
// Tiny buffer so the nudge can't fire from the cursor already sitting at the
// top edge on load — short enough that it still triggers the moment they leave.
const MIN_TIME_MS = 800;
// Mobile fallback: fire after this much dwell time (ms)
const MOBILE_DWELL_MS = 35000;
// The booking calendar anchor on the page
const CALENDAR_ID = "book-calendar";

/**
 * Objection-handling exit nudge for /strategy-call/book.
 *
 * The calendar is already the whole page, so instead of re-showing it we
 * reframe the hesitation ("free, 30 min, we'll tell you if it's not a fit")
 * and bounce the visitor back to the calendar. Fires at most once per session.
 */
export default function BookExitNudge() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(SESSION_KEY)) {
      return;
    }

    const readyAt = Date.now() + MIN_TIME_MS;
    let mobileTimer: ReturnType<typeof setTimeout>;

    const fire = () => {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
      setOpen(true);
    };

    // mouseout bubbles to document and fires when the pointer leaves the window
    // entirely (relatedTarget is null). This is more reliable than a mouseleave
    // bound to document, and still catches top exits above the calendar iframe.
    const onMouseOut = (e: MouseEvent) => {
      if (e.relatedTarget || (e as MouseEvent & { toElement?: unknown }).toElement) return;
      if (e.clientY > 20) return;
      if (Date.now() < readyAt) return;
      fire();
    };

    document.addEventListener("mouseout", onMouseOut);

    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      mobileTimer = setTimeout(fire, MOBILE_DWELL_MS);
    }

    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      clearTimeout(mobileTimer);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const goToCalendar = () => {
    setOpen(false);
    document.getElementById(CALENDAR_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 ${open ? "" : "!hidden"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Pick a time for your strategy call"
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-[0_32px_80px_-12px_rgba(0,0,0,0.45)] px-7 pt-7 pb-8 text-center">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <h2
          className="mt-2 text-[26px] sm:text-[30px] leading-[1.12] text-stone-900"
          style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
        >
          Wait — not ready to{" "}
          <span style={{ color: "#8a7448" }}>pick a time?</span>
        </h2>

        <p
          className="mt-4 text-[15px] text-stone-500 leading-relaxed"
          style={{ fontFamily: "var(--font-open-sans)" }}
        >
          It&apos;s free, 30 minutes, and we&apos;ll tell you straight if it&apos;s not a fit.
          No pitch, no pressure — just a clear look at your numbers.
        </p>

        <div className="mt-7 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={goToCalendar}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#1b1b1b] text-white font-bold tracking-[0.1em] uppercase px-8 py-4 text-[13px] sm:text-[14px] hover:-translate-y-px hover:shadow-[0_14px_36px_-10px_rgba(0,0,0,0.4)] active:scale-[0.98] transition-all shadow-[0_6px_20px_-8px_rgba(0,0,0,0.3)]"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Pick My Time
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-[13px] text-stone-400 hover:text-stone-600 transition-colors"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
