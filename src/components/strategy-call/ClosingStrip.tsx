
"use client";

export default function ClosingStrip() {
  return (
    <section className="bg-[#1a1a1a] py-20 sm:py-24">
      <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
        <p
          className="text-white font-bold leading-snug text-[20px] sm:text-[26px] md:text-[32px]"
          style={{ fontFamily: "var(--font-open-sans)" }}
        >
          Every month you wait is a month you can&apos;t get back.
        </p>

        <div className="mt-8 sm:mt-10">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("open-strategy-modal"))}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#1a1a1a] font-bold tracking-[0.1em] uppercase px-7 py-3.5 text-[13px] sm:text-[14px] hover:-translate-y-px hover:shadow-[0_12px_32px_-8px_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all"
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
