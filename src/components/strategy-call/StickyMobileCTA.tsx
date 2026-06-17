"use client";

/**
 * Persistent mobile-only booking bar pinned to the bottom of the screen.
 * Mobile users' thumbs live at the bottom, so the CTA is always one tap away.
 *
 * z-[60] sits below the booking modal (z-[9999]) so it tucks away when the
 * modal opens. The FOMO card and scroll-to-top FAB are lifted above this bar
 * on mobile (via their `mobileLift` props) so nothing overlaps.
 */
export default function StickyMobileCTA() {
  return (
    <div
      className="sm:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/95 backdrop-blur-md border-t border-brand-line px-4 pt-3"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event("open-strategy-modal"))}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#1b1b1b] text-white font-bold tracking-[0.1em] uppercase py-3.5 text-[13px] active:scale-[0.98] transition-transform shadow-[0_6px_20px_-8px_rgba(0,0,0,0.3)]"
        style={{ fontFamily: "var(--font-open-sans)" }}
      >
        Book Free Strategy Call
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>
    </div>
  );
}
