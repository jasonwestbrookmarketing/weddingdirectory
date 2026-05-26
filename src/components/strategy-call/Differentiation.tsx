import Image from "next/image";
import { Reveal } from "./Reveal";
import { SketchUnderline } from "./SketchUnderline";

const COMPETITORS = [
  {
    name: "The Knot & WeddingWire",
    failure: "Sell the same leads to ten venues at once",
  },
  {
    name: "Generic marketing agencies",
    failure: "Don't understand brides. Disappear after onboarding.",
  },
  {
    name: "Other booking software",
    failure: "Just sits there waiting for you to use it",
  },
];

export default function Differentiation() {
  return (
    <section className="bg-white py-20 sm:py-28 border-t border-brand-line border-b border-brand-line">
      <div className="max-w-[1040px] mx-auto px-6 md:px-10">

        {/* ── Header ── */}
        <Reveal>
          <p
            className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-muted"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            What Makes StoryVenue Different
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2
            className="mt-4 text-[26px] sm:text-4xl md:text-[42px] text-brand-ink leading-[1.1]"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Not software. Not an agency.{" "}
            <SketchUnderline>
              <span style={{ color: "#8a7448" }}>A booking system.</span>
            </SketchUnderline>
          </h2>
        </Reveal>

        {/* ── Competitor rows ── */}
        {/* Border lives outside Reveal so every line is identical full width */}
        <div className="mt-12 sm:mt-14 border-t border-brand-line">
          {COMPETITORS.map((c, i) => (
            <div key={c.name} className="border-b border-brand-line">
              <Reveal delay={0.07 * i}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8 py-5">
                  {/* Left: icon + name */}
                  <div className="flex items-center gap-3 sm:w-[280px] shrink-0">
                    <div
                      className="w-6 h-6 rounded-full bg-red-50 border border-red-200 flex items-center justify-center shrink-0"
                      aria-hidden="true"
                    >
                      <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <p
                      className="text-[14px] font-semibold text-brand-ink"
                      style={{ fontFamily: "var(--font-open-sans)" }}
                    >
                      {c.name}
                    </p>
                  </div>

                  {/* Right: failure — dark so it reads as a real problem statement */}
                  <p
                    className="text-[15px] sm:text-[16px] text-brand-ink leading-snug pl-9 sm:pl-0 font-medium"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    {c.failure}
                  </p>
                </div>
              </Reveal>
            </div>
          ))}
        </div>

        {/* ── VS divider ── */}
        <Reveal delay={0.26}>
          <div className="flex items-center justify-center my-8 sm:my-10">
            <p
              className="text-[11px] font-semibold tracking-[0.3em] uppercase text-brand-muted"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              vs
            </p>
          </div>
        </Reveal>

        {/* ── StoryVenue resolution ── */}
        <Reveal delay={0.32}>
          <div className="relative bg-white border border-[#8a7448]/30 rounded-xl overflow-hidden shadow-[0_4px_32px_-8px_rgba(138,116,72,0.15)]">
            {/* Gold top bar */}
            <div className="h-[3px] w-full bg-gradient-to-r from-[#8a7448] via-[#b09a6a] to-[#8a7448]" />

            <div className="px-8 sm:px-10 py-8 sm:py-10 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
              {/* Logo + tagline — vertically centered */}
              <div className="shrink-0 flex flex-col items-start gap-2 sm:w-[180px]">
                <Image
                  src="/storyvenue-dark-logo.png"
                  alt="StoryVenue™"
                  width={160}
                  height={36}
                  unoptimized
                  placeholder="empty"
                  className="h-8 w-auto object-contain"
                />
                <p
                  className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#8a7448]"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  The complete system
                </p>
              </div>

              <div className="hidden sm:block w-px self-stretch bg-brand-line shrink-0" />

              {/* Description — 2 clean lines, no orphan */}
              <div className="flex-1">
                <p
                  className="text-brand-ink text-[15px] sm:text-[16px] leading-relaxed font-medium"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  A complete booking system, with a real team behind it, built by people who&apos;ve been in this industry for over 14 years.
                </p>
                <p
                  className="mt-2 text-brand-muted text-[13px] leading-relaxed"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  We bring the brides. Our team works the leads. You show up for the tour.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
