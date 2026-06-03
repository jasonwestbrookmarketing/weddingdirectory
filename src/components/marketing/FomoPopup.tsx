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
const INITIAL_DELAY_MS = 10000;
// Gap between cards (ms)
const GAP_MS = 12000;

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
          background: "#ffffff",
          border: "1px solid #e2e2e2",
          borderRadius: 12,
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div style={{ flex: 1 }}>
            {/* Green dot + "Just now" */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#22c55e",
                display: "inline-block",
                flexShrink: 0,
              }} />
              <span style={{
                fontSize: 10,
                color: "#888",
                fontFamily: "var(--font-open-sans, sans-serif)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}>
                Just now
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
              margin: "3px 0 0",
              fontSize: 13,
              color: "#555",
              fontFamily: "var(--font-open-sans, sans-serif)",
              lineHeight: "1.4",
            }}>
              Signed Up
            </p>
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

        {/* CTA */}
        <Link
          href={signupHref}
          style={{
            display: "block",
            textAlign: "center",
            fontSize: 12,
            fontWeight: 600,
            color: "#1b1b1b",
            fontFamily: "var(--font-open-sans, sans-serif)",
            border: "1px solid #1b1b1b",
            borderRadius: 6,
            padding: "6px 12px",
            textDecoration: "none",
            transition: "background 200ms, color 200ms",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "#1b1b1b";
            (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
            (e.currentTarget as HTMLAnchorElement).style.color = "#1b1b1b";
          }}
        >
          List Your Venue Free →
        </Link>
      </div>
    </div>
  );
}
