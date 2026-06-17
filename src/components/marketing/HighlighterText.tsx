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
  /** extra classes on the outer span — use whitespace-normal for multi-line text */
  className?: string;
  /** keep text on a single line (default). Set false to allow wrapping. */
  nowrap?: boolean;
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
  className = "",
  nowrap = true,
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
      className={`relative inline-block ${nowrap ? "whitespace-nowrap" : ""} ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden
        viewBox="0 0 600 80"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ mixBlendMode: "multiply" }}
      >
        {/* Mostly-straight highlighter swipe — only a hair of waver so it
            still feels human. Endpoints sit just inside the box so the streak
            hugs the text instead of bleeding to the screen edge on mobile. */}
        <path
          d="M 24 41 C 130 39, 240 43, 350 40 S 500 42, 576 39"
          fill="none"
          stroke={color}
          strokeWidth="66"
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
