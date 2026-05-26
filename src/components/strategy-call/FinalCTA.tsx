import { Reveal } from "./Reveal";
import { BOOKING_URL } from "./constants";

export default function FinalCTA() {
  return (
    <section id="cta" className="bg-brand-bg py-20 sm:py-28 border-b border-brand-line">
      <div className="max-w-[760px] mx-auto px-6 md:px-10 text-center">
        <Reveal>
          <p
            className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-muted"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            — Your Next Step
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2
            className="mt-4 text-[26px] sm:text-4xl md:text-[44px] text-brand-ink leading-[1.1]"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Ready to see how many weddings you&apos;re{" "}
            <em
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontStyle: "italic",
                color: "#8a7448",
              }}
            >
              losing?
            </em>
          </h2>
        </Reveal>

        <Reveal delay={0.14}>
          <p
            className="mt-6 text-brand-muted text-base sm:text-lg leading-relaxed"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            On your free 30-minute strategy call, we&apos;ll look at your venue&apos;s actual
            numbers — your inquiries, your tour conversion, your response time — and tell you
            exactly how many weddings you&apos;re losing every month and what it would take to fix
            it.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div
            className="mt-7 sm:mt-8 space-y-1.5 text-brand-muted"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(17px, 1.8vw, 22px)",
            }}
          >
            <p>This isn&apos;t a sales call. It&apos;s a fit call.</p>
            <p>We don&apos;t pitch. We don&apos;t pressure. We don&apos;t read from a script.</p>
          </div>
        </Reveal>

        <Reveal delay={0.26}>
          <div className="mt-10 sm:mt-12 flex flex-col items-center gap-3">
            <a
              href={BOOKING_URL}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1a1a1a] text-white font-semibold px-8 py-4 text-[15px] sm:text-base hover:-translate-y-px hover:shadow-[0_14px_36px_-10px_rgba(0,0,0,0.4)] active:scale-[0.98] transition-all shadow-[0_6px_20px_-8px_rgba(0,0,0,0.3)]"
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
            <p
              className="text-[12px] text-brand-muted/70 tracking-wide"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              No commitment · No obligation · Just clarity
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
