import type { Metadata } from "next";
import Script from "next/script";
import { CheckCircle2 } from "lucide-react";
import Marquee from "@/components/strategy-call/Marquee";
import StrategyNav from "@/components/strategy-call/StrategyNav";
import PageFooter from "@/components/strategy-call/PageFooter";
import BookExitNudge from "@/components/strategy-call/BookExitNudge";
import { Reveal } from "@/components/strategy-call/Reveal";

export const dynamic = "force-static";

const BOOKING_ID = "YeI4ZUC2SwV8MXDRKfzr";
const BOOKING_SRC = `https://api.leadconnectorhq.com/widget/booking/${BOOKING_ID}`;

// Distinct, no-index URL so the Meta pixel can fire a qualified-lead conversion
// scoped to /strategy-call/book (the survey redirects qualified leads here).
export const metadata: Metadata = {
  title: "Book Your Strategy Call | StoryVenue",
  description:
    "You're a great fit. Pick a time for your free 30-minute wedding venue strategy call.",
  alternates: { canonical: "/strategy-call/book" },
  robots: { index: false, follow: false },
};

export default function StrategyCallBookPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />

      {/* Sticky shell — marquee + nav scroll together (matches /strategy-call) */}
      <div className="sticky top-0 z-40">
        <Marquee />
        <StrategyNav showCta={false} />
      </div>

      <main className="flex-1">
        <section className="bg-brand-bg pt-8 sm:pt-10 pb-6 sm:pb-8">
          <div className="max-w-3xl mx-auto px-6 md:px-10 text-center">
            <Reveal>
              <span
                className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-[10px] font-semibold tracking-[0.22em] uppercase text-green-700"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                <CheckCircle2 className="w-3 h-3 text-green-600" />
                You&apos;re A Great Fit
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1
                className="mt-4 text-[28px] sm:text-[36px] md:text-[42px] leading-[1.1] text-brand-ink"
                style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
              >
                Pick A Time For Your{" "}
                <span className="whitespace-nowrap" style={{ color: "#8a7448" }}>
                  Free Strategy Call.
                </span>
              </h1>
            </Reveal>


            {/* Call agenda — kills abandonment before the calendar */}
            <Reveal delay={0.18}>
              <ul
                className="mt-5 inline-flex flex-col items-start gap-2.5 text-left"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                {[
                  "30 minutes, no prep needed",
                  "We'll show you exactly how many bookings you're likely leaving on the table",
                  "Not a fit? We'll tell you that too",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2.5 text-[13px] sm:text-[14px] text-brand-muted">
                    <span className="mt-px text-green-600 font-bold shrink-0">✓</span>
                    {line}
                  </li>
                ))}
              </ul>
            </Reveal>

          </div>
        </section>

        {/* Calendar / booking form embed */}
        <section id="book-calendar" className="bg-brand-bg pb-10 sm:pb-12 scroll-mt-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-10">
            <div className="bg-white rounded-2xl overflow-hidden">
              <iframe
                src={BOOKING_SRC}
                id={`${BOOKING_ID}_1781719379172`}
                style={{ width: "100%", border: "none", overflow: "hidden" }}
                scrolling="no"
                title="Book Your Strategy Call"
              />
            </div>
          </div>
        </section>

        {/* Social proof — reassurance under the calendar to reduce no-shows */}
        <section className="bg-white border-t border-brand-line py-8 sm:py-10">
          <div className="max-w-4xl mx-auto px-6 md:px-10">
            <p
              className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-muted text-center mb-6"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              What Venues See After Working With Us
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
              {[
                { venue: "Atlantic Stables", stat: "$15k in weddings", period: "first 30 days" },
                { venue: "Red Barn Acres", stat: "9 weddings booked", period: "first 4 months" },
                { venue: "Retreat at Evans Farms", stat: "258 leads", period: "60 days" },
              ].map(({ venue, stat, period }) => (
                <div key={venue} className="text-center">
                  <p
                    className="text-[22px] sm:text-[26px] font-bold text-brand-ink leading-none"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    {stat}
                  </p>
                  <p
                    className="mt-1 text-[12px] text-brand-muted"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    {venue} · {period}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PageFooter />

      <BookExitNudge />
    </div>
  );
}
