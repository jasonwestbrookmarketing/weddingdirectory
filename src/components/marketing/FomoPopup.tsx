"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const STORYPAY_URL =
  process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";

// Fallback list used only if the live API call fails
const FALLBACK_VENUES = [
  "The Inn at Ragged Edge",
  "Arête Event Center",
  "Arbor Venues",
  "Atlantic Stables",
  "Victor's Florence",
  "White Pine Manor",
  "Red Barn Acres",
  "Haven at Cedar Grove",
  "City View Event Center",
  "The Pinetree Hotel",
  "Waterloo Farms",
  "Pine Acres Event Center",
  "Willow Creek Events",
  "The Venues at Honey Grove",
  "Cold Creek Farm",
  "Irongate Equestrian Center",
];

// How long each card is visible (ms)
const DISPLAY_MS = 4000;
// Delay before the first card appears (ms)
const INITIAL_DELAY_MS = 1000;
// Gap between cards — exit animation (350ms) + this pause before next
const GAP_MS = 3000;

interface Props {
  /** Link href — used on /book-more-weddings */
  signupHref?: string;
  /** Fire a custom window event instead of navigating — used on /strategy-call */
  modalEvent?: string;
  /** CTA label */
  ctaLabel?: string;
  /** Lift the card above a mobile sticky CTA bar (mobile only). */
  mobileLift?: boolean;
}

export default function FomoPopup({ signupHref, modalEvent, ctaLabel, mobileLift }: Props) {
  const [venues, setVenues] = useState<string[]>([]);
  const [venueIndex, setVenueIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [animIn, setAnimIn] = useState(false);

  // Fetch live venue names once on mount; newest → oldest order is from the API
  useEffect(() => {
    fetch(`${STORYPAY_URL}/api/public/recent-signups`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { names?: string[] } | null) => {
        const names = d?.names ?? [];
        setVenues(names.length >= 2 ? names : FALLBACK_VENUES);
      })
      .catch(() => setVenues(FALLBACK_VENUES));
  }, []);

  const show = useCallback((idx: number) => {
    setVenueIndex(idx);
    setVisible(true);
    // Trigger enter animation on next tick
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimIn(true));
    });
  }, []);

  const hide = useCallback(() => {
    setAnimIn(false);
    // Wait for exit animation then unmount
    setTimeout(() => setVisible(false), 350);
  }, []);

  // Start cycling once venues are loaded. Always starts at index 0 (newest).
  useEffect(() => {
    if (dismissed || venues.length === 0) return;

    let hideTimer: ReturnType<typeof setTimeout>;
    let nextTimer: ReturnType<typeof setTimeout>;
    let step = 0; // always starts at 0 (newest) on every page load/refresh

    const cycle = () => {
      show(step % venues.length);
      hideTimer = setTimeout(hide, DISPLAY_MS);
      step += 1;
      nextTimer = setTimeout(cycle, DISPLAY_MS + GAP_MS);
    };

    const initTimer = setTimeout(cycle, INITIAL_DELAY_MS);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [dismissed, venues, show, hide]);

  if (dismissed || !visible || venues.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes fomo-pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    <div
      aria-live="polite"
      aria-atomic="true"
      className={`left-4 sm:left-6 ${mobileLift ? "bottom-[92px] sm:bottom-6" : "bottom-6"}`}
      style={{
        position: "fixed",
        zIndex: 9999,
        transform: animIn ? "translateY(0)" : "translateY(16px)",
        opacity: animIn ? 1 : 0,
        transition: "transform 350ms cubic-bezier(0.22,1,0.36,1), opacity 350ms ease",
        pointerEvents: animIn ? "auto" : "none",
      }}
    >
      <div
        style={{
          width: 280,
          background: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderRadius: 12,
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div style={{ flex: 1 }}>
            {/* Dot + venue name on one line */}
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ position: "relative", width: 8, height: 8, display: "inline-flex", flexShrink: 0 }}>
                <span style={{
                  position: "absolute", inset: 0,
                  borderRadius: "50%", background: "#22c55e",
                  animation: "fomo-pulse 2s ease-in-out infinite",
                  opacity: 0.5,
                }} />
                <span style={{
                  position: "relative", width: 8, height: 8,
                  borderRadius: "50%", background: "#22c55e",
                }} />
              </span>
              <p style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 700,
                color: "#1b1b1b",
                fontFamily: "var(--font-open-sans, sans-serif)",
                lineHeight: "1.3",
              }}>
                {venues[venueIndex]}
              </p>
            </div>

            {/* Subheadline */}
            <p style={{
              margin: "2px 0 0",
              fontSize: 13,
              color: "#555",
              fontFamily: "var(--font-open-sans, sans-serif)",
              lineHeight: "1.4",
            }}>
              Signed Up
            </p>

            {/* Text link CTA */}
            {modalEvent ? (
              <button
                onClick={() => window.dispatchEvent(new Event(modalEvent))}
                style={{
                  display: "inline",
                  marginTop: 6,
                  fontSize: 11,
                  color: "#1b1b1b",
                  fontFamily: "var(--font-open-sans, sans-serif)",
                  fontWeight: 600,
                  textDecoration: "underline",
                  textUnderlineOffset: 2,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                {ctaLabel ?? "Book a free strategy call →"}
              </button>
            ) : (
              <Link
                href={signupHref ?? "#"}
                style={{
                  display: "inline-block",
                  marginTop: 6,
                  fontSize: 11,
                  color: "#1b1b1b",
                  fontFamily: "var(--font-open-sans, sans-serif)",
                  fontWeight: 600,
                  textDecoration: "underline",
                  textUnderlineOffset: 2,
                }}
              >
                {ctaLabel ?? "List your venue free →"}
              </Link>
            )}
          </div>

          {/* Dismiss */}
          <button
            onClick={() => { hide(); setTimeout(() => setDismissed(true), 350); }}
            aria-label="Dismiss"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#bbb",
              padding: 2,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            <X size={13} />
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
