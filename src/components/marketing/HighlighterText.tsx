"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface HighlighterTextProps {
  children: ReactNode;
  /** ms — total draw duration. Defaults to 1800ms. */
  duration?: number;
  /** highlighter hex color */
  color?: string;
  /** 0..1 — paint translucency */
  opacity?: number;
}

/**
 * Inline span that paints a hand-drawn yellow highlighter behind its
 * children. The SVG path animates in via stroke-dashoffset when the
 * element scrolls into view, using mix-blend-mode: multiply so the
 * ink tints whatever is behind it like a real marker.
 */
export default function HighlighterText({
  children,
  duration = 1800,
  color = "#fde047",
  opacity = 0.78,
}: HighlighterTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (reduceMotion) {
            setActive(true);
          } else {
            window.setTimeout(() => setActive(true), 220);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.55 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className="relative inline-block whitespace-nowrap"
    >
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden
        viewBox="0 0 600 80"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ mixBlendMode: "multiply" }}
      >
        {/* Slightly irregular highlighter swipe — tilts a touch and
            extends past both ends so the marker feels human, not pixel-perfect. */}
        <path
          d="M -10 58 C 110 44, 240 68, 348 52 S 508 46, 612 56"
          fill="none"
          stroke={color}
          strokeWidth="46"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={opacity}
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: active ? 0 : 1,
            transition: `stroke-dashoffset ${duration}ms cubic-bezier(0.45, 0.05, 0.35, 1)`,
          }}
        />
      </svg>
    </span>
  );
}
