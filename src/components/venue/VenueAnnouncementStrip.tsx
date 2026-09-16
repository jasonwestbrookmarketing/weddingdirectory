"use client";

import { useEffect, useRef, useState, type CSSProperties, type Ref } from "react";

/**
 * Owner-controlled announcement bar near the top of the public venue listing.
 * Message-only by design — no buttons or outbound links — so it never competes
 * with the pricing-guide lead-capture opt-in the page exists to drive.
 *
 * Presentation:
 *   - Constrained to the same width as the photo grid (the parent wraps it in
 *     the max-w-7xl content container) with rounded corners so it reads as its
 *     own card and stands out.
 *   - Always scrolls as a marquee. We measure the message so it's repeated
 *     enough to fill the bar, then duplicated into two identical halves that
 *     translate -50% for a seamless loop. Duration scales with width so the
 *     scroll SPEED stays constant regardless of message length. Disabled under
 *     prefers-reduced-motion (falls back to a centered static message).
 *   - Dismissible for the current page view only — no localStorage. Refreshing
 *     the page always brings it back while the announcement is still active on
 *     the backend. The ONLY way to make it stop showing entirely is turning the
 *     announcement off (or letting its window lapse) in the dashboard, at which
 *     point the page stops passing `message` and this component renders null.
 *
 * The page passes `message` only when the announcement is enabled and in its
 * active window (see venue/[slug]/page.tsx), so this component just renders.
 */

const SCROLL_PX_PER_SEC = 42; // constant apparent speed, any message length

export default function VenueAnnouncementStrip({ message }: { message: string }) {
  const trimmed = message.trim();

  const [dismissed, setDismissed] = useState(false);
  const [copies, setCopies] = useState(1);
  const [durationSec, setDurationSec] = useState(20);
  const [animate, setAnimate] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const unitRef = useRef<HTMLSpanElement>(null);

  // Measure one message "unit" vs. the track, then repeat enough to fill and
  // pick a duration that keeps the scroll speed constant.
  useEffect(() => {
    if (dismissed) return;
    const reduce =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function measure() {
      const track = trackRef.current;
      const unit = unitRef.current;
      if (!track || !unit) return;
      const unitW = unit.getBoundingClientRect().width;
      const trackW = track.clientWidth;
      if (unitW <= 0 || trackW <= 0) return;
      const needed = Math.max(2, Math.ceil(trackW / unitW) + 1);
      const halfW = needed * unitW;
      setCopies(needed);
      setDurationSec(Math.max(8, halfW / SCROLL_PX_PER_SEC));
      setAnimate(!reduce);
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [trimmed, dismissed]);

  if (!trimmed || dismissed) return null;

  function dismiss() {
    setDismissed(true);
  }

  const unit = (key: string, ref?: Ref<HTMLSpanElement>) => (
    <span
      key={key}
      ref={ref}
      className="flex items-center gap-3 whitespace-nowrap py-2 pr-3 text-xs font-medium text-white/90 sm:text-sm"
    >
      <span>{trimmed}</span>
      <span aria-hidden className="text-white/40">&bull;</span>
    </span>
  );

  const firstHalf = Array.from({ length: copies }, (_, i) =>
    unit(`a-${i}`, i === 0 ? unitRef : undefined),
  );
  const secondHalf = Array.from({ length: copies }, (_, i) => unit(`b-${i}`));

  return (
    <div
      role="region"
      aria-label="Venue announcement"
      className="relative flex items-center overflow-hidden rounded-2xl text-white shadow-sm ring-1 ring-black/5"
      style={{ backgroundColor: "#1b1b1b", minHeight: 40 }}
    >
      <div className="flex flex-shrink-0 items-center self-stretch border-r border-white/20 px-3">
        <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-widest text-white/60">
          Announcement
        </span>
      </div>

      <div
        ref={trackRef}
        className="relative flex-1 overflow-hidden pl-4"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 24px, black calc(100% - 24px), transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 24px, black calc(100% - 24px), transparent)",
        }}
      >
        <div
          className={animate ? "sv-ann-track flex w-max" : "flex w-max justify-center"}
          style={animate ? ({ "--sv-ann-dur": `${durationSec}s` } as CSSProperties) : undefined}
        >
          {firstHalf}
          {animate && secondHalf}
        </div>
      </div>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="flex flex-shrink-0 items-center self-stretch px-3 text-white/50 transition-colors hover:text-white"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      <style>{`
        @keyframes sv-ann-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .sv-ann-track { animation: sv-ann-scroll var(--sv-ann-dur, 20s) linear infinite; }
        .sv-ann-track:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .sv-ann-track { animation: none; }
        }
      `}</style>
    </div>
  );
}
