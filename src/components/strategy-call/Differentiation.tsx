import { Reveal } from "./Reveal";
import { SketchUnderline } from "./SketchUnderline";

const COMPETITORS = [
  {
    failure: "Sell the same leads to ten venues at once",
    name: "The Knot & WeddingWire",
  },
  {
    failure: "Don't understand brides. Disappear after onboarding.",
    name: "Generic marketing agencies",
  },
  {
    failure: "Just sits there waiting for you to use it",
    name: "Other booking software",
  },
];

export default function Differentiation() {
  return (
    <section className="bg-brand-bg py-20 sm:py-28 border-b border-brand-line">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 md:px-10 text-center">
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
      </div>

      {/* ── Three competitor "verdict" cards ──────────────────── */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 mt-14 sm:mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {COMPETITORS.map((c, i) => (
            <Reveal key={c.name} delay={0.07 * i}>
              <div className="relative flex flex-col h-full bg-brand-warm border border-brand-line rounded-xl px-6 py-7 overflow-hidden">
                {/* Red left accent */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-red-400 rounded-l-xl" />

                {/* X icon */}
                <div
                  className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-5"
                  aria-hidden="true"
                >
                  <svg
                    className="w-3.5 h-3.5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>

                {/* The failure IS the headline */}
                <p
                  className="text-brand-ink text-[16px] sm:text-[17px] leading-snug flex-1"
                  style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
                >
                  {c.failure}
                </p>

                {/* Competitor name as the footnote */}
                <p
                  className="mt-5 pt-4 border-t border-brand-line text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-muted"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {c.name}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── VS divider ────────────────────────────────────────── */}
        <Reveal delay={0.25}>
          <div className="flex items-center gap-4 my-8 sm:my-10">
            <div className="h-px flex-1 bg-brand-line" />
            <p
              className="text-[11px] font-semibold tracking-[0.3em] uppercase text-brand-muted"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              vs
            </p>
            <div className="h-px flex-1 bg-brand-line" />
          </div>
        </Reveal>

        {/* ── StoryVenue resolution card ────────────────────────── */}
        <Reveal delay={0.32}>
          <div className="relative bg-[#1b1b1b] border border-transparent rounded-xl overflow-hidden">
            {/* Gold left bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8a7448]" />

            <div className="px-8 sm:px-10 py-8 sm:py-10 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12">
              {/* Brand */}
              <div className="shrink-0 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8a7448] shrink-0" aria-hidden="true" />
                <p
                  className="text-white text-[22px] sm:text-[26px] leading-none"
                  style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
                >
                  StoryVenue
                </p>
              </div>

              {/* Divider (desktop only) */}
              <div className="hidden sm:block w-px self-stretch bg-white/15 shrink-0" />

              {/* Description */}
              <p
                className="text-white/70 text-[14px] sm:text-[15px] leading-relaxed"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                A complete system — with a real team behind it — built by people who&apos;ve been
                in this industry for over 14 years.
              </p>

              {/* Badge */}
              <div className="shrink-0">
                <div className="inline-flex items-center gap-1.5 border border-[#8a7448]/50 rounded-full px-3 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8a7448]" aria-hidden="true" />
                  <p
                    className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#8a7448]"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    14 Years In
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
