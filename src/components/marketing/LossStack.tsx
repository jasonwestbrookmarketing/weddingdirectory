"use client";

import { useEffect, useRef, useState } from "react";

const items = [
  {
    label: "Missed inquiry",
    sub: "She never got a reply",
    tone: "border-stone-200 bg-white",
  },
  {
    label: "Missed tour",
    sub: "She booked with a competitor",
    tone: "border-rose-100 bg-rose-50/70",
  },
  {
    label: "Missed proposal",
    sub: "$12,000 never sent",
    tone: "border-rose-200 bg-rose-50",
  },
  {
    label: "Missed deposit",
    sub: "Weekend still open",
    tone: "border-rose-300 bg-rose-100/80",
  },
  {
    label: "Empty weekend",
    sub: "Revenue gone",
    tone: "border-rose-400 bg-rose-100",
  },
] as const;

/**
 * Stacked "missed event" tiles that pop in one-by-one as the
 * group scrolls into view, reading top→bottom like a timeline.
 * Uses a slight overshoot easing for the "pop" feel and
 * respects prefers-reduced-motion.
 */
export default function LossStack() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative flex flex-col gap-3 max-w-xs mx-auto">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${item.tone}`}
          style={{
            marginLeft: `${i * 6}px`,
            opacity: active ? 1 : 0,
            transform: active
              ? "translateY(0) scale(1)"
              : "translateY(16px) scale(0.94)",
            transition:
              "opacity 520ms cubic-bezier(0.16,1,0.3,1), transform 620ms cubic-bezier(0.34,1.56,0.64,1)",
            transitionDelay: `${i * 180}ms`,
            willChange: "opacity, transform",
          }}
        >
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white border border-stone-200">
            <span className="text-[11px] font-bold text-stone-400">{i + 1}</span>
          </span>
          <div>
            <p
              className="text-[13px] font-bold text-stone-900"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              {item.label}
            </p>
            <p className="text-[12px] text-stone-500">{item.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
