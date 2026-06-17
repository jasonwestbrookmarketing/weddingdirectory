import Image from "next/image";
import { Reveal } from "./Reveal";

export default function MathSection() {
  return (
    <section className="relative overflow-hidden text-white">
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
      {/* Base overlay — lightened so the background photo shows through */}
      <div className="absolute inset-0 bg-[#1b1b1b]/60" />
      {/* Right-side darken to neutralize the bright couple in the photo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(27,27,27,0) 35%, rgba(27,27,27,0.35) 75%, rgba(27,27,27,0.6) 100%)",
        }}
      />
      {/* Soft vignette to ground the composition */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(27,27,27,0) 40%, rgba(27,27,27,0.35) 100%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 text-center py-[clamp(96px,11vw,160px)]">
        <Reveal>
          <p
            className="text-[11px] font-semibold tracking-[0.28em] uppercase text-white/55"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            The Math
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <p
            className="mt-6 text-white/90 leading-[1.35] mx-auto text-lg sm:text-xl"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            <span className="block">$5,000 wedding or $50,000 wedding.</span>
            <span className="block text-white/70 mt-1">The math doesn&rsquo;t change.</span>
          </p>
        </Reveal>

        {/* Hero number */}
        <Reveal delay={0.16}>
          <div
            className="mt-10 sm:mt-12 leading-none tracking-tight"
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
            className="mt-4 text-[11px] sm:text-[12px] font-semibold tracking-[0.32em] uppercase text-white/55"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Extra Weddings Per Year
          </p>
        </Reveal>

        {/* Payoff — two-beat hierarchy */}
        <Reveal delay={0.3}>
          <div className="mt-12 sm:mt-14 pt-10 border-t border-white/15 max-w-2xl mx-auto">
            <p
              className="text-white text-xl sm:text-2xl font-semibold leading-[1.3] text-balance"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              That pays for StoryVenue for the{" "}
              <span className="whitespace-nowrap">entire year.</span>
            </p>
            <p
              className="mt-3 text-white/65 text-sm sm:text-base leading-relaxed"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Most of our private clients book that in their first 30 days.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
