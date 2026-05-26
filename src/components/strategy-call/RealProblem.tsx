import { Reveal } from "./Reveal";

export default function RealProblem() {
  return (
    <section className="bg-brand-bg py-20 sm:py-28 border-b border-brand-line">
      <div className="max-w-[880px] mx-auto px-6 md:px-10">
        <Reveal>
          <p
            className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-muted"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            — The Real Problem
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2
            className="mt-4 text-[26px] sm:text-4xl md:text-5xl text-brand-ink leading-[1.12]"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            You don&apos;t just need more leads. You need a{" "}
            <em
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontStyle: "italic",
                color: "#8a7448",
              }}
            >
              booking system
            </em>{" "}
            built for venues — not brides.
          </h2>
        </Reveal>

        <Reveal delay={0.16}>
          <div
            className="mt-8 sm:mt-10 space-y-5 text-brand-muted text-base sm:text-lg leading-relaxed"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            <p>
              The Knot and WeddingWire weren&apos;t built to help your venue. They were built to help
              the bride — by sending her to ten venues at once. You&apos;re not their customer.
              You&apos;re inventory.
            </p>
            <p>
              That&apos;s why throwing more money at them never works. You&apos;re not solving the
              real problem. You&apos;re funding a system that was never built for you.
            </p>
            <p>
              The real problem is that you don&apos;t have a booking system. You have a directory
              listing, an inbox, a Google Calendar, and a hope that brides reply.
            </p>
          </div>
        </Reveal>

        {/* Pull-quote */}
        <Reveal delay={0.24}>
          <blockquote
            className="mt-10 sm:mt-12 pl-5 border-l-2 border-brand-ink"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(18px, 2.2vw, 22px)",
            }}
          >
            <p className="text-brand-ink leading-snug">
              That&apos;s not a system. That&apos;s why your weekends are empty.
            </p>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
