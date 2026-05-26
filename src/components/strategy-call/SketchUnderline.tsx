"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface SketchUnderlineProps {
  children: ReactNode;
  /** Stroke color — defaults to brand gold */
  color?: string;
  /** Total draw duration in ms */
  duration?: number;
  /** Delay after element enters viewport (ms) */
  delay?: number;
}

/**
 * Wraps its children with a hand-drawn SVG underline that animates in via
 * stroke-dashoffset when the element enters the viewport.
 *
 * The path has gentle, organic Y-axis variation so it reads like a real
 * pencil stroke: confident but not mechanically perfect.
 */
export function SketchUnderline({
  children,
  color = "#8a7448",
  duration = 900,
  delay = 180,
}: SketchUnderlineProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (reduceMotion) {
            setActive(true);
          } else {
            window.setTimeout(() => setActive(true), delay);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <span ref={ref} className="relative inline whitespace-nowrap">
      {children}
      {/*
        SVG is absolutely positioned below the text baseline.
        preserveAspectRatio="none" lets the path scale to any text width.
        The viewBox is 300×14 — the path wanders between y≈5–10 for that
        natural, slightly-imperfect pencil feel without looking shaky.
      */}
      <svg
        aria-hidden
        focusable="false"
        viewBox="0 0 300 14"
        preserveAspectRatio="none"
        className="pointer-events-none absolute left-0 w-full"
        style={{ bottom: "-5px", height: 14 }}
      >
        <path
          /* Hand-tuned cubic bezier path — 4 gentle undulations across the span */
          d="
            M 2 9
            C 18 7, 42 11, 68 8
            S 110 11, 140 7
            S 185 10, 218 7
            S 262 9, 298 8
          "
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: active ? 0 : 1,
            transition: active
              ? `stroke-dashoffset ${duration}ms cubic-bezier(0.45, 0.05, 0.35, 1)`
              : "none",
          }}
        />
      </svg>
    </span>
  );
}
