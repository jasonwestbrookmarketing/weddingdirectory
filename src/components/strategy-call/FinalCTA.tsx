"use client";

import Image from "next/image";
import { Reveal } from "./Reveal";

const AVATARS = [
  "/avatars/av1.jpg",
  "/avatars/av2.jpg",
  "/avatars/av3.jpg",
  "/avatars/av4.jpg",
  "/avatars/av5.jpg",
];

export default function FinalCTA() {
  return (
    <section id="cta" className="bg-brand-bg py-20 sm:py-28 border-b border-brand-line">
      <div className="max-w-5xl mx-auto px-6 md:px-10 text-center">
        <Reveal>
          <p
            className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-muted"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Your Next Step
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2
            className="mt-4 text-[26px] sm:text-[36px] md:text-[42px] text-brand-ink leading-[1.1] lg:whitespace-nowrap"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Ready to see how many weddings you&apos;re{" "}
            <span style={{ color: "#8a7448" }}>losing?</span>
          </h2>
        </Reveal>

        <Reveal delay={0.14}>
          <p
            className="mt-6 text-brand-muted text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            On your free 30-minute strategy call, we&apos;ll look at your venue&apos;s actual
            numbers: your inquiries, your tour conversion, your response time. We&apos;ll tell you
            exactly how many weddings you&apos;re losing every month and what it would take to fix
            it.
          </p>
        </Reveal>

        {/* Closing reframe — EditorsNote for weight and elegance */}
        <Reveal delay={0.2}>
          <div
            className="mt-7 sm:mt-8 space-y-1 text-brand-muted text-[16px] sm:text-[17px]"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            <p>This isn&apos;t a sales call. It&apos;s a fit call.</p>
            <p>We don&apos;t pitch. We don&apos;t pressure. We don&apos;t read from a script.</p>
          </div>
        </Reveal>

        <Reveal delay={0.26}>
          <div className="mt-10 sm:mt-12 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("open-strategy-modal"))}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1b1b1b] text-white font-bold tracking-[0.1em] uppercase px-8 py-4 text-[13px] sm:text-[14px] hover:-translate-y-px hover:shadow-[0_14px_36px_-10px_rgba(0,0,0,0.4)] active:scale-[0.98] transition-all shadow-[0_6px_20px_-8px_rgba(0,0,0,0.3)]"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Book Your Free Strategy Call
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>

            <p
              className="text-[12px] text-brand-muted/70 tracking-wide"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              No commitment · No obligation · Just clarity
            </p>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <div className="flex -space-x-2.5 shrink-0">
                {AVATARS.map((src, i) => (
                  <div
                    key={i}
                    className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white overflow-hidden"
                    style={{ zIndex: 5 - i }}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      unoptimized
                      placeholder="empty"
                      className="object-cover object-center"
                      sizes="36px"
                    />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex gap-0.5" role="img" aria-label="5 stars">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="#1c1917" aria-hidden="true">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[10px] sm:text-[11px] text-brand-muted mt-0.5" style={{ fontFamily: "var(--font-open-sans)" }}>
                  Google Reviews
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
