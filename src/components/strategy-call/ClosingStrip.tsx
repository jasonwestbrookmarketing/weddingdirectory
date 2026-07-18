"use client";

import Image from "next/image";

export default function ClosingStrip() {
  return (
    <section className="relative overflow-hidden">
      {/* Bride & groom venue photo — positioned to keep faces visible */}
      <Image
        src="/hero-wedding-couple.jpg"
        alt=""
        aria-hidden
        fill
        unoptimized
        placeholder="empty"
        className="absolute inset-0 object-cover object-[center_15%]"
        sizes="100vw"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#1b1b1b]/72" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 text-center py-24 sm:py-32">
        <p
          className="text-white leading-[1.1] text-[22px] sm:text-[32px] md:text-[38px] lg:text-[44px] lg:whitespace-nowrap"
          style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
        >
          Every Month You Wait Is A Month You Can&apos;t Get Back.
        </p>

        <div className="mt-10 sm:mt-12">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("open-strategy-modal"))}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#1b1b1b] font-bold tracking-[0.1em] uppercase px-7 py-3.5 text-[13px] sm:text-[14px] hover:-translate-y-px hover:shadow-[0_12px_32px_-8px_rgba(255,255,255,0.25)] active:scale-[0.98] transition-all"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            See If I Qualify
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
            className="mt-3 text-[12px] text-white/60 tracking-wide"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            2-minute application · Free 30-minute strategy call for qualified venues
          </p>
        </div>
      </div>
    </section>
  );
}
