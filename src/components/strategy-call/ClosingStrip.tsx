import { BOOKING_URL } from "./constants";

export default function ClosingStrip() {
  return (
    <section className="bg-[#1a1a1a] py-20 sm:py-24">
      <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
        <p
          className="text-white leading-snug"
          style={{
            fontFamily: "EditorsNote, serif",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "clamp(24px, 4vw, 42px)",
          }}
        >
          Every month you wait is a month you can&apos;t get back.
        </p>

        <div className="mt-8 sm:mt-10">
          <a
            href={BOOKING_URL}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#1a1a1a] font-semibold px-7 py-3.5 text-[15px] hover:-translate-y-px hover:shadow-[0_12px_32px_-8px_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all"
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
          </a>
        </div>
      </div>
    </section>
  );
}
