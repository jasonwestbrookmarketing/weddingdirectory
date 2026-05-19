"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    step: "01",
    title: "Brides Find You First",
    outcome:
      "Your venue is promoted through targeted Meta ads and your StoryVenue directory listing while couples are actively searching and comparing.",
  },
  {
    step: "02",
    title: "Clicks Turn Into Qualified Inquiries",
    outcome:
      "Brides land on a focused page that captures their interest, collects their wedding date, and reveals how serious they are.",
  },
  {
    step: "03",
    title: "Pricing Is Delivered Instantly",
    outcome:
      "The moment she inquires, your pricing and venue details are sent by email and SMS — no waiting, no guessing, no friction.",
  },
  {
    step: "04",
    title: "Your Team Is Notified Immediately",
    outcome:
      "You receive her name, number, wedding date, and buying readiness within seconds of every new inquiry.",
  },
  {
    step: "05",
    title: "Concierge Follows Up Personally",
    outcome:
      "Our team texts her right away to answer questions, build trust, and book a 5-minute chat or tour on your behalf.",
  },
  {
    step: "06",
    title: "AI Keeps Silent Leads Alive",
    outcome:
      "If she goes quiet, AI follows up every 1–3 days until she replies — then hands her straight back to your team.",
  },
  {
    step: "07",
    title: "You Host A Warm Tour",
    outcome:
      "By tour day she already knows your pricing, trusts your venue, and is ready to say yes. You welcome her — you don't chase her.",
  },
] as const;

/**
 * Vertical animated timeline for the "How It Works" section.
 * Each step's node fills and its connector line draws down as the
 * item scrolls into view, reading top-to-bottom like a story.
 */
export default function ProcessTimeline() {
  const [visible, setVisible] = useState<Set<number>>(new Set());
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      setVisible(new Set(STEPS.map((_, i) => i)));
      return;
    }

    const observers = refs.current.map((el, i) => {
      if (!el) return null;
      const ob = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible((prev) => new Set([...prev, i]));
            ob.disconnect();
          }
        },
        { threshold: 0.55, rootMargin: "0px 0px -60px 0px" }
      );
      ob.observe(el);
      return ob;
    });

    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  const isActive = (i: number) => visible.has(i);

  return (
    <div className="max-w-xl mx-auto lg:mx-0">
      {STEPS.map((step, i) => (
        <div
          key={step.step}
          ref={(el) => { refs.current[i] = el; }}
          className="flex gap-7"
        >
          {/* Spine — circle node + connector line */}
          <div className="flex flex-col items-center shrink-0 w-9">
            {/* Node */}
            <div
              className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 text-[12px] font-bold"
              style={{
                fontFamily: "var(--font-open-sans)",
                borderColor: isActive(i) ? "#1c1917" : "#d6d3d1",
                backgroundColor: isActive(i) ? "#1c1917" : "#fff",
                color: isActive(i) ? "#fff" : "#a8a29e",
                transition: "background-color 400ms ease, border-color 400ms ease, color 400ms ease",
                transitionDelay: `${i * 40}ms`,
              }}
            >
              {i + 1}
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div
                className="mt-1.5 w-px min-h-[56px] flex-1"
                style={{
                  background:
                    "repeating-linear-gradient(to bottom, #d6d3d1 0px, #d6d3d1 5px, transparent 5px, transparent 12px)",
                  transform: isActive(i) ? "scaleY(1)" : "scaleY(0)",
                  transformOrigin: "top",
                  transition: "transform 700ms cubic-bezier(0.16,1,0.3,1)",
                  transitionDelay: `${160 + i * 40}ms`,
                }}
              />
            )}
          </div>

          {/* Content */}
          <div
            className="pb-10"
            style={{
              opacity: isActive(i) ? 1 : 0,
              transform: isActive(i) ? "translateY(0)" : "translateY(10px)",
              transition:
                "opacity 500ms ease, transform 500ms cubic-bezier(0.16,1,0.3,1)",
              transitionDelay: `${60 + i * 40}ms`,
            }}
          >
            <h3
              className="text-[17px] font-bold text-stone-900 leading-snug"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              {step.title}
            </h3>
            <p
              className="mt-1.5 text-[14px] text-stone-500 leading-relaxed"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              {step.outcome}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
