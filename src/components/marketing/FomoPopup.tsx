"use client";

import { useEffect, useState, useCallback } from "react";
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
          width: 240,
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          padding: "10px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 0,
          boxShadow: "0 2px 12px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6 }}>
          <div style={{ flex: 1 }}>
            {/* Venue name */}
            <p style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 700,
              color: "#1b1b1b",
              fontFamily: "var(--font-open-sans, sans-serif)",
              lineHeight: "1.3",
            }}>
              {venues[venueIndex]}
            </p>

            {/* Subheadline */}
            <p style={{
              margin: "2px 0 0",
              fontSize: 11,
              color: "#777",
              fontFamily: "var(--font-open-sans, sans-serif)",
              lineHeight: "1.4",
            }}>
              Just signed up
            </p>

            {/* Verified — Facebook-style 12-point starburst badge + plain text */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              marginTop: 6,
            }}>
              <svg width="15" height="15" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                {/* 12-pointed starburst: alternating outer r=48 and inner r=36 points */}
                <polygon
                  points="50,2 59,15 74,8 76,25 92,26 85,41 98,50 85,59 92,74 76,75 74,92 59,85 50,98 41,85 26,92 24,75 8,74 15,59 2,50 15,41 8,26 24,25 26,8 41,15"
                  fill="#5b9cf6"
                />
                <path d="M34 51 L45 63 L66 38" stroke="white" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{
                fontSize: 11,
                color: "#5b9cf6",
                fontFamily: "var(--font-open-sans, sans-serif)",
              }}>
                Verified listing
              </span>
            </div>
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
