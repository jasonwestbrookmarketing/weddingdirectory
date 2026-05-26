"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

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
 * Wraps its children with a hand-drawn pencil underline that animates in via
 * stroke-dashoffset when the element enters the viewport.
 *
 * The stroke uses a linearGradient so it builds up opacity like a real pencil:
 * light touch at the start, full weight through the middle, lifts at the end.
 * The path has a single, almost-imperceptible arc — straight to the eye but
 * not mechanically perfect.
 */
export function SketchUnderline({
  children,
  color = "#8a7448",
  duration = 950,
  delay = 200,
}: SketchUnderlineProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);
  // Stable unique ID so multiple instances on the same page don't clash
  const uid = useId().replace(/:/g, "");
  const gradId = `pencil-grad-${uid}`;

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
      <svg
        aria-hidden
        focusable="false"
        viewBox="0 0 300 13"
        preserveAspectRatio="none"
        className="pointer-events-none absolute left-0 w-full"
        style={{ bottom: "-5px", height: 13 }}
      >
        <defs>
          {/*
            Pencil gradient — mimics how graphite builds and lifts:
            near-transparent start (pencil touching paper), full weight
            through the middle body, then eases off toward the end.
          */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"    stopColor={color} stopOpacity={0.15} />
            <stop offset="10%"   stopColor={color} stopOpacity={0.7}  />
            <stop offset="35%"   stopColor={color} stopOpacity={1}    />
            <stop offset="65%"   stopColor={color} stopOpacity={1}    />
            <stop offset="88%"   stopColor={color} stopOpacity={0.72} />
            <stop offset="100%"  stopColor={color} stopOpacity={0.2}  />
          </linearGradient>
        </defs>

        {/*
          Single gentle cubic arc — nearly straight, just ~1.5px of drift so it
          reads as confident freehand rather than a ruler or a scribble.
        */}
        <path
          d="M 2 8.5 C 75 7.2, 160 9.5, 240 7.8 S 278 8.8, 298 8"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: active ? 0 : 1,
            transition: active
              ? `stroke-dashoffset ${duration}ms cubic-bezier(0.42, 0.0, 0.38, 1.0)`
              : "none",
          }}
        />
      </svg>
    </span>
  );
}
