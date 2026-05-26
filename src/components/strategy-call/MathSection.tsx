import Image from "next/image";
import { Reveal } from "./Reveal";

export default function MathSection() {
  return (
    <section className="relative overflow-hidden text-white">
      {/* Background photo — same technique as /book-more-weddings "not just software" */}
      <Image
        src="/not-just-software-bg.jpg"
        alt=""
        aria-hidden
        fill
        unoptimized
        placeholder="empty"
        className="absolute inset-0 object-cover object-center"
        sizes="100vw"
      />
      {/* Dark overlay so text stays legible */}
      <div className="absolute inset-0 bg-[#1b1b1b]/82" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 text-center py-[clamp(80px,10vw,140px)]">
        <Reveal>
          <p
            className="text-[11px] font-semibold tracking-[0.22em] uppercase text-white/40"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            The Math
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <p
            className="mt-6 text-white/75 leading-relaxed max-w-xl mx-auto text-base sm:text-lg font-medium"
            style={{ fontFamily: "var(--font-open-sans)" }}
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
            <span style={{ color: "#d4c4ad" }}>2</span>
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
            className="mt-10 sm:mt-12 pt-8 border-t border-white/15 text-white/65 max-w-xl mx-auto leading-relaxed text-sm sm:text-base font-semibold"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            That&apos;s all it takes to make StoryVenue pay for itself for the entire year. Most of
            our private clients book that in their first 30 days.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
