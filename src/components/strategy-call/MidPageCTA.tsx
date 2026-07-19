"use client";

import { Reveal } from "./Reveal";

/**
 * Mid-page conversion catch. Placed right after the proof + math sections so
 * a visitor convinced at peak conviction can act without scrolling all the way
 * to the final CTA.
 */
export default function MidPageCTA() {
  return (
    <section className="bg-brand-bg py-14 sm:py-16 border-b border-brand-line">
      <div className="max-w-5xl mx-auto px-6 md:px-10 text-center">
        <Reveal>
          <h2
            className="text-[22px] sm:text-[30px] md:text-[34px] text-brand-ink leading-[1.14] lg:whitespace-nowrap"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            See exactly how many weddings you&apos;re{" "}
            <span style={{ color: "#8a7448" }}>leaving on the table.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("open-strategy-modal"))}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1b1b1b] text-white font-bold tracking-[0.1em] uppercase px-8 py-4 text-[13px] sm:text-[14px] hover:-translate-y-px hover:shadow-[0_14px_36px_-10px_rgba(0,0,0,0.4)] active:scale-[0.98] transition-all shadow-[0_6px_20px_-8px_rgba(0,0,0,0.3)]"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              See If I Qualify
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <p
              className="text-[12px] text-brand-muted tracking-wide"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Answer 5 quick questions to see if your venue qualifies for a free 30-minute strategy call.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
