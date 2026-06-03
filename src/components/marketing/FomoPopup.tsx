"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const VENUES = [
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
const DISPLAY_MS = 5000;
// Delay before the first card appears (ms)
const INITIAL_DELAY_MS = 1000;
// Gap between cards (ms)
const GAP_MS = 8000;

interface Props {
  signupHref: string;
}

export default function FomoPopup({ signupHref }: Props) {
  const [venueIndex, setVenueIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [animIn, setAnimIn] = useState(false);

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

  useEffect(() => {
    if (dismissed) return;

    let hideTimer: ReturnType<typeof setTimeout>;
    let nextTimer: ReturnType<typeof setTimeout>;

    // Shuffle order so it feels organic
    const order = [...VENUES.keys()].sort(() => Math.random() - 0.5);
    let step = 0;

    const cycle = () => {
      show(order[step % order.length]);
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
  }, [dismissed, show, hide]);

  if (dismissed || !visible) return null;

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
      style={{
        position: "fixed",
        bottom: 24,
        left: 24,
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
          border: "1px solid rgba(255, 255, 255, 0.6)",
          borderRadius: 12,
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div style={{ flex: 1 }}>
            {/* Green pulse dot */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
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
            </div>

            {/* Venue name */}
            <p style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 700,
              color: "#1b1b1b",
              fontFamily: "var(--font-open-sans, sans-serif)",
              lineHeight: "1.3",
            }}>
              {VENUES[venueIndex]}
            </p>

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
            <Link
              href={signupHref}
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
              List your venue free →
            </Link>
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
