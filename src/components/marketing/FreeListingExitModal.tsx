"use client";

import { useEffect, useRef, useState } from "react";
import { X, ArrowRight } from "lucide-react";

/**
 * Exit-intent modal for /free-listing.
 * Arms after 800ms (enough to ignore accidental cursor blips on load).
 * No session gate — fires every page load so refreshes and return visits always see it.
 * Only fires once per page load (fired ref).
 */
export default function FreeListingExitModal({ href }: { href: string }) {
  const [open, setOpen] = useState(false);
  const armed = useRef(false);
  const fired = useRef(false);

  // Arm quickly — just long enough to ignore initial cursor positioning
  useEffect(() => {
    const t = setTimeout(() => { armed.current = true; }, 800);
    return () => clearTimeout(t);
  }, []);

  // Detect mouse leaving through the top of the viewport
  useEffect(() => {
    function onLeave(e: MouseEvent) {
      if (!armed.current || fired.current) return;
      if (e.clientY > 5) return; // only top-edge exits
      fired.current = true;
      setOpen(true);
    }
    document.addEventListener("mouseleave", onLeave);
    return () => document.removeEventListener("mouseleave", onLeave);
  }, []);

  function handleCTA() {
    try {
      const w = window as unknown as { fbq?: (...a: unknown[]) => void };
      w.fbq?.("track", "Lead", {
        content_name: "Free Listing Exit Modal",
        content_category: "Venue Directory",
      });
    } catch {}
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-5 bg-black/55 backdrop-blur-sm animate-[fadeIn_0.18s_ease]"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative bg-white rounded-3xl shadow-[0_32px_80px_-16px_rgba(0,0,0,0.35)] w-full max-w-[420px] aspect-square flex flex-col items-center justify-center text-center px-10 animate-[slideUp_0.22s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dismiss */}
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Eyebrow */}
        <p
          className="text-[10px] font-bold uppercase tracking-[0.22em] text-stone-400 mb-4"
          style={{ fontFamily: "var(--font-open-sans)" }}
        >
          Before you go
        </p>

        {/* Headline */}
        <h2
          className="text-[30px] sm:text-[34px] text-stone-900 leading-[1.1] mb-4"
          style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
        >
          Your Listing Could Be Live In Five Minutes.
        </h2>

        {/* Subtext */}
        <p
          className="text-[14px] text-stone-500 leading-relaxed mb-8 max-w-[300px]"
          style={{ fontFamily: "var(--font-open-sans)" }}
        >
          Couples are searching for venues right now. Get your spot before another venue in your area does.
        </p>

        {/* CTA */}
        <a
          href={href}
          onClick={handleCTA}
          className="group inline-flex items-center gap-2 rounded-full bg-stone-900 text-white font-semibold px-7 py-3.5 text-[15px] hover:bg-stone-800 active:scale-[0.98] transition-all shadow-[0_8px_24px_-10px_rgba(0,0,0,0.45)]"
          style={{ fontFamily: "var(--font-open-sans)" }}
        >
          Claim My Free Listing
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </a>

        {/* Dismiss link */}
        <button
          onClick={() => setOpen(false)}
          className="mt-4 text-[12px] text-stone-400 hover:text-stone-600 transition-colors underline underline-offset-2"
          style={{ fontFamily: "var(--font-open-sans)" }}
        >
          No thanks, I&apos;ll pass for now.
        </button>
      </div>
    </div>
  );
}
