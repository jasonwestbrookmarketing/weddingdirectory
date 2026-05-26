"use client";

import Image from "next/image";

export default function ClosingStrip() {
  return (
    <section className="relative overflow-hidden">
      {/* Bride & groom venue photo */}
      <Image
        src="/hero-wedding-couple.jpg"
        alt=""
        aria-hidden
        fill
        unoptimized
        placeholder="empty"
        className="absolute inset-0 object-cover object-center"
        sizes="100vw"
        style={{ transform: "scaleX(-1)" }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#1b1b1b]/75" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 text-center py-24 sm:py-32">
        <p
          className="text-white leading-[1.12] text-[28px] sm:text-[38px] md:text-[46px]"
          style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
        >
          Every month you wait is a month you can&apos;t get back.
        </p>

        <div className="mt-10 sm:mt-12">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("open-strategy-modal"))}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#1b1b1b] font-bold tracking-[0.1em] uppercase px-7 py-3.5 text-[13px] sm:text-[14px] hover:-translate-y-px hover:shadow-[0_12px_32px_-8px_rgba(255,255,255,0.25)] active:scale-[0.98] transition-all"
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
        </div>
      </div>
    </section>
  );
}
