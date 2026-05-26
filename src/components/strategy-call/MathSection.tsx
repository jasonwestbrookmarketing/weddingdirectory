import { Reveal } from "./Reveal";

export default function MathSection() {
  return (
    <section className="bg-[#1a1a1a] text-white py-[clamp(80px,10vw,140px)] border-b border-white/10">
      <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
        <Reveal>
          <p
            className="text-[11px] font-semibold tracking-[0.22em] uppercase text-white/40"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            — The Math
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <p
            className="mt-6 text-white/75 leading-relaxed max-w-xl mx-auto"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(20px, 2.5vw, 30px)",
            }}
          >
            Whether your average wedding sells for $5,000 or $50,000, the math is the same:
          </p>
        </Reveal>

        {/* Hero number */}
        <Reveal delay={0.16}>
          <div
            className="mt-8 sm:mt-10 leading-none tracking-tight"
            style={{
              fontFamily: "EditorsNote, serif",
              fontWeight: 300,
              fontSize: "clamp(88px, 14vw, 180px)",
            }}
            aria-label="1 to 2"
          >
            <span className="text-white">1 to </span>
            <em
              className="not-italic"
              style={{
                fontStyle: "italic",
                color: "#d4c4ad",
              }}
            >
              2
            </em>
          </div>
        </Reveal>

        <Reveal delay={0.22}>
          <p
            className="mt-3 text-[10px] sm:text-[11px] font-semibold tracking-[0.28em] uppercase text-white/40"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Extra Weddings · Per Year
          </p>
        </Reveal>

        {/* Coda */}
        <Reveal delay={0.3}>
          <p
            className="mt-10 sm:mt-12 pt-8 border-t border-white/15 text-white/65 max-w-xl mx-auto leading-relaxed"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(16px, 1.8vw, 22px)",
            }}
          >
            That&apos;s all it takes to make StoryVenue pay for itself for the entire year. Most of
            our private clients book that in their first 30 days.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
