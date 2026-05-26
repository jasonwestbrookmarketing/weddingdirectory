import { Reveal } from "./Reveal";

export default function Guarantee() {
  return (
    <section className="bg-brand-warm py-20 sm:py-28 border-b border-brand-line">
      <div className="max-w-[720px] mx-auto px-6 md:px-10 text-center">
        {/* Badge */}
        <Reveal>
          <div className="flex items-center justify-center mb-10 sm:mb-12">
            <div
              className="relative flex items-center justify-center"
              style={{ width: 200, height: 200 }}
              aria-label="30 Day Guarantee"
            >
              {/* Outermost dashed ring */}
              <div
                className="absolute inset-0 rounded-full border border-dashed border-brand-ink/20"
                style={{ borderSpacing: "3px 3px" }}
              />
              {/* Second ring */}
              <div className="absolute rounded-full border border-brand-ink/12" style={{ inset: 12 }} />
              {/* Inner filled circle */}
              <div
                className="absolute rounded-full bg-[#1a1a1a] flex flex-col items-center justify-center text-white"
                style={{ inset: 22 }}
              >
                <span
                  className="text-[38px] leading-none"
                  style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
                >
                  30
                </span>
                <span
                  className="text-[9px] font-semibold tracking-[0.18em] uppercase text-white/60 mt-0.5"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  Day
                </span>
                <span
                  className="text-[9px] font-semibold tracking-[0.18em] uppercase text-white/60"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  Guarantee
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h2
            className="text-[26px] sm:text-4xl md:text-[42px] text-brand-ink leading-[1.1]"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            <em
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontStyle: "italic",
                color: "#8a7448",
              }}
            >
              If it doesn&apos;t work, you don&apos;t pay.
            </em>
          </h2>
        </Reveal>

        <Reveal delay={0.14}>
          <p
            className="mt-5 sm:mt-6 text-brand-muted leading-relaxed max-w-lg mx-auto"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(17px, 1.8vw, 22px)",
            }}
          >
            If you don&apos;t see results in your first 30 days after going live, you don&apos;t
            pay. No contracts. No cancellation fees.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <p
            className="mt-4 text-[13px] text-brand-muted/70 tracking-wide"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            The risk is on us.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
