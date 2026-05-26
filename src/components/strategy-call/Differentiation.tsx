import { Reveal } from "./Reveal";

const NEGATIVE_ROWS = [
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
    <section className="bg-brand-bg py-20 sm:py-28 border-b border-brand-line">
      <div className="max-w-[760px] mx-auto px-6 md:px-10">
        <Reveal>
          <p
            className="text-center text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-muted"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            — What Makes This Different
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2
            className="mt-4 text-center text-[26px] sm:text-4xl md:text-[42px] text-brand-ink leading-[1.1]"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Not software. Not an agency.{" "}
            <span style={{ color: "#8a7448" }}>A system.</span>
          </h2>
        </Reveal>

        <div className="mt-12 sm:mt-14 space-y-3">
          {/* Negative rows */}
          {NEGATIVE_ROWS.map((row, i) => (
            <Reveal key={row.name} delay={0.07 * i}>
              <div className="grid grid-cols-2 gap-4 items-center bg-brand-warm rounded-xl px-5 sm:px-6 py-4 sm:py-5 border border-brand-line">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-red-50 text-red-600 text-[11px] font-bold"
                    aria-label="Does not work"
                  >
                    ✕
                  </span>
                  <p
                    className="text-[13px] sm:text-sm font-medium text-brand-ink leading-snug"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    {row.name}
                  </p>
                </div>
                <p
                  className="text-right text-[12px] sm:text-[13px] text-brand-muted leading-snug"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {row.failure}
                </p>
              </div>
            </Reveal>
          ))}

          {/* Divider */}
          <Reveal delay={0.22}>
            <div className="flex items-center justify-center py-2">
              <div className="h-px flex-1 bg-brand-line" />
              <p
                className="mx-4 text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-muted"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                — vs —
              </p>
              <div className="h-px flex-1 bg-brand-line" />
            </div>
          </Reveal>

          {/* Positive row */}
          <Reveal delay={0.28}>
            <div className="grid grid-cols-2 gap-4 items-center bg-[#1b1b1b] rounded-xl px-5 sm:px-6 py-5 sm:py-6 border border-transparent">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="shrink-0 w-2 h-2 rounded-full bg-[#8a7448]"
                  aria-hidden="true"
                />
                <p
                  className="text-[14px] sm:text-[15px] font-semibold text-white leading-snug"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  StoryVenue
                </p>
              </div>
              <p
                className="text-right text-[12px] sm:text-[13px] text-white/65 leading-snug"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                A complete system — with a real team behind it — built by people who&apos;ve been in
                this industry for over 14 years.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
