"use client";

import { Fragment, useEffect, useRef, useState } from "react";

const STEPS = [
  { n: 1, title: "Brides Find You First",        body: "Your venue appears in Meta ads and the StoryVenue directory while couples are actively searching." },
  { n: 2, title: "Clicks Become Inquiries",       body: "She lands on a focused page that captures her interest, wedding date, and buying readiness." },
  { n: 3, title: "Pricing Arrives Instantly",     body: "Your pricing and details are sent by email and SMS the moment she submits — no waiting." },
  { n: 4, title: "Your Team Is Notified",         body: "Her name, number, date, and readiness score reach your dashboard within seconds." },
  { n: 5, title: "Concierge Follows Up",          body: "Our team texts her right away to build trust and book a 5-minute chat or tour." },
  { n: 6, title: "AI Keeps Leads Alive",          body: "If she goes quiet, AI follows up every 1–3 days until she responds." },
  { n: 7, title: "You Host A Warm Tour",          body: "She already knows your pricing and trusts your venue before she walks through the door." },
] as const;

const ROW1 = STEPS.slice(0, 4);
/** Row 2 displayed right-to-left so step 5 sits under step 4 and journey
 *  flows naturally from right → left matching the snake return path.      */
const ROW2 = [...STEPS.slice(4)].reverse() as typeof STEPS[number][];

const STEP_MS = 220;

/** nodeDelay: (n-1)*2 * STEP  →  n1=0ms, n2=440ms … n7=2640ms */
const nodeDelay = (n: number) => (n - 1) * 2 * STEP_MS;
/** lineDelay: (from*2-1) * STEP  →  line1-2=220ms, …, line6-7=2420ms */
const lineDelay = (from: number) => (from * 2 - 1) * STEP_MS;
/** vertDelay: after node4, before node5 */
const VERT_DELAY = 7 * STEP_MS; // 1540ms

export default function ProcessTimeline() {
  const ref   = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setActive(true); return; }
    const ob = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); ob.disconnect(); } },
      { threshold: 0.15 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  const circleStyle = (n: number): React.CSSProperties => ({
    borderColor:     active ? "#1c1917" : "#e7e5e4",
    backgroundColor: active ? "#1c1917" : "#fff",
    color:           active ? "#fff"    : "#a8a29e",
    transition: "background-color 350ms ease, border-color 350ms ease, color 350ms ease",
    transitionDelay: active ? `${nodeDelay(n)}ms` : "0ms",
  });

  const horizStyle = (from: number, reverse = false): React.CSSProperties => ({
    transform:       active ? "scaleX(1)" : "scaleX(0)",
    transformOrigin: reverse ? "right" : "left",
    transition: "transform 600ms cubic-bezier(0.16,1,0.3,1)",
    transitionDelay: active ? `${lineDelay(from)}ms` : "0ms",
  });

  const vertStyle: React.CSSProperties = {
    transform:       active ? "scaleY(1)" : "scaleY(0)",
    transformOrigin: "top",
    transition: "transform 500ms cubic-bezier(0.16,1,0.3,1)",
    transitionDelay: active ? `${VERT_DELAY}ms` : "0ms",
  };

  const textStyle = (n: number): React.CSSProperties => ({
    opacity:   active ? 1 : 0,
    transform: active ? "translateY(0)" : "translateY(6px)",
    transition: "opacity 500ms ease, transform 500ms ease",
    transitionDelay: active ? `${nodeDelay(n) + 80}ms` : "0ms",
  });

  return (
    <div ref={ref} className="w-full select-none">

      {/* ── Row 1: steps 1-4, left → right ──────────────────────────── */}
      <div className="flex items-start">
        {ROW1.map((step, i) => (
          <Fragment key={step.n}>
            {/* Step */}
            <div className="flex-1 min-w-0 flex flex-col items-center text-center px-1 sm:px-2">
              {/* Circle */}
              <div
                className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-[13px] font-bold shrink-0"
                style={{ fontFamily: "var(--font-open-sans)", ...circleStyle(step.n) }}
              >
                {step.n}
              </div>
              <div style={textStyle(step.n)} className="mt-3">
                <p className="text-[12px] sm:text-[13px] font-bold text-stone-900 leading-snug" style={{ fontFamily: "var(--font-open-sans)" }}>
                  {step.title}
                </p>
                <p className="mt-1 text-[11px] text-stone-500 leading-relaxed hidden sm:block" style={{ fontFamily: "var(--font-open-sans)" }}>
                  {step.body}
                </p>
              </div>
            </div>
            {/* Connector line */}
            {i < 3 && (
              <div className="self-start shrink-0 w-6 sm:w-8 md:w-12 lg:w-16" style={{ paddingTop: "18px" }}>
                <div
                  style={{
                    borderTop: "2px dashed #d6d3d1",
                    ...horizStyle(step.n, false),
                  }}
                />
              </div>
            )}
          </Fragment>
        ))}
      </div>

      {/* ── Vertical connector (right side, step 4 → step 5) ─────────── */}
      <div className="flex justify-end" style={{ paddingRight: "calc(12.5% - 18px)" }}>
        <div
          style={{
            width: "2px",
            height: "52px",
            background: "repeating-linear-gradient(to bottom, #d6d3d1 0px, #d6d3d1 5px, transparent 5px, transparent 11px)",
            ...vertStyle,
          }}
        />
      </div>

      {/* ── Row 2: steps 5-7 displayed as [7][6][5] left→right ──────── */}
      {/* Journey flows right→left so step 5 (rightmost) animates first  */}
      <div className="flex items-start justify-end">
        {ROW2.map((step, i) => (
          <Fragment key={step.n}>
            {/* Step */}
            <div className="flex-1 min-w-0 flex flex-col items-center text-center px-1 sm:px-2">
              <div
                className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-[13px] font-bold shrink-0"
                style={{ fontFamily: "var(--font-open-sans)", ...circleStyle(step.n) }}
              >
                {step.n}
              </div>
              <div style={textStyle(step.n)} className="mt-3">
                <p className="text-[12px] sm:text-[13px] font-bold text-stone-900 leading-snug" style={{ fontFamily: "var(--font-open-sans)" }}>
                  {step.title}
                </p>
                <p className="mt-1 text-[11px] text-stone-500 leading-relaxed hidden sm:block" style={{ fontFamily: "var(--font-open-sans)" }}>
                  {step.body}
                </p>
              </div>
            </div>
            {/* Connector line — drawn right→left since journey goes right→left */}
            {/* In display [7][6][5]: line after idx 0 = line between step7 and step6 (lineDelay from=6) */}
            {/*                       line after idx 1 = line between step6 and step5 (lineDelay from=5) */}
            {i < 2 && (
              <div className="self-start shrink-0 w-6 sm:w-8 md:w-12 lg:w-16" style={{ paddingTop: "18px" }}>
                <div
                  style={{
                    borderTop: "2px dashed #d6d3d1",
                    // i=0 → between step7(left) and step6(right) → journey line from=6
                    // i=1 → between step6(left) and step5(right) → journey line from=5
                    ...horizStyle(i === 0 ? 6 : 5, true),
                  }}
                />
              </div>
            )}
          </Fragment>
        ))}
        {/* Invisible spacer matching the 4th step column so row 2 right-aligns with row 1's step 4 */}
        <div className="flex-1 min-w-0 px-1 sm:px-2 invisible" aria-hidden>
          <div className="w-9 h-9" />
        </div>
      </div>

    </div>
  );
}
