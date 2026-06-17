import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Play, ArrowRight } from "lucide-react";
import StrategyNav from "@/components/strategy-call/StrategyNav";
import VideoPlayer from "@/components/strategy-call/VideoPlayer";
import PageFooter from "@/components/strategy-call/PageFooter";
import { Reveal } from "@/components/strategy-call/Reveal";
import { CONFIRMATION_VIDEO_URL } from "@/components/strategy-call/constants";
import FireLeadEvent from "@/components/strategy-call/FireLeadEvent";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "You're Booked | StoryVenue Strategy Call",
  description:
    "Your free strategy call is confirmed. Watch this quick video so you know exactly what to expect.",
  alternates: { canonical: "/strategy-call/confirmed" },
  robots: { index: false, follow: false },
};

const STORYPAY_URL =
  process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";

const FREE_SIGNUP_HREF = `${STORYPAY_URL}/signup?as=venue&plan=free&utm_source=strategy-call&utm_medium=confirmed`;

const RESULTS = [
  { venue: "Atlantic Stables", stat: "$15k in weddings", period: "first 30 days" },
  { venue: "Red Barn Acres", stat: "9 weddings booked", period: "first 4 months" },
  { venue: "Retreat at Evans Farms", stat: "258 leads", period: "60 days" },
];

export default function StrategyCallConfirmedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <FireLeadEvent />

      <div className="sticky top-0 z-40">
        <StrategyNav showCta={false} />
      </div>

      <main className="flex-1">
        {/* Hero — compact so video stays near fold */}
        <section className="bg-brand-bg pt-8 sm:pt-12 pb-10 sm:pb-14 border-b border-brand-line">
          <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
            <Reveal>
              <span
                className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-4 py-1.5 text-[11px] font-semibold tracking-[0.22em] uppercase text-green-700"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                Your Call Is Confirmed
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1
                className="mt-5 text-[30px] sm:text-[40px] md:text-[48px] leading-[1.1] text-brand-ink"
                style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
              >
                You&apos;re Booked. Here&apos;s What Happens{" "}
                <span style={{ color: "#8a7448" }}>Next.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.14}>
              <p
                className="mt-3 text-[15px] sm:text-[16px] text-brand-muted"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                Complete both steps below before your call.
              </p>
            </Reveal>

            {/* Video */}
            <Reveal delay={0.2}>
              <div className="pt-6 sm:pt-8">
                <VideoPlayer
                  videoUrl={CONFIRMATION_VIDEO_URL}
                  showPoster={false}
                  ariaLabel="What to expect on your strategy call"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Social proof strip */}
        <section className="bg-white border-b border-brand-line py-6">
          <div className="max-w-4xl mx-auto px-6 md:px-10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
              {RESULTS.map(({ venue, stat, period }) => (
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

        {/* Two numbered steps */}
        <section className="bg-brand-bg py-14 sm:py-20">
          <div className="max-w-2xl mx-auto px-6 md:px-10">
            <Reveal>
              <p
                className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brand-muted text-center mb-10"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                Two things to do right now
              </p>
            </Reveal>

            {/* Step 1 */}
            <Reveal delay={0.08}>
              <div className="flex gap-5 sm:gap-7 items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-brand-ink text-white text-[15px] font-bold"
                  style={{ fontFamily: "var(--font-open-sans)" }}>
                  1
                </div>
                <div className="flex-1 pb-10 border-b border-brand-line">
                  <div className="flex items-center gap-2 mb-1">
                    <Play className="w-4 h-4 text-brand-gold" />
                    <h2
                      className="text-[18px] sm:text-[20px] font-bold text-brand-ink"
                      style={{ fontFamily: "var(--font-open-sans)" }}
                    >
                      Watch the video above
                    </h2>
                  </div>
                  <p
                    className="text-[14px] sm:text-[15px] text-brand-muted leading-relaxed"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    It&apos;s two minutes. It shows you exactly how our call works so we skip the small talk and get straight to your numbers.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Step 2 */}
            <Reveal delay={0.16}>
              <div className="flex gap-5 sm:gap-7 items-start pt-10">
                <div className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-brand-ink text-white text-[15px] font-bold"
                  style={{ fontFamily: "var(--font-open-sans)" }}>
                  2
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <ArrowRight className="w-4 h-4 text-brand-gold" />
                    <h2
                      className="text-[18px] sm:text-[20px] font-bold text-brand-ink"
                      style={{ fontFamily: "var(--font-open-sans)" }}
                    >
                      Claim your free venue listing
                    </h2>
                  </div>
                  <p
                    className="text-[14px] sm:text-[15px] text-brand-muted leading-relaxed mb-5"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    Get your venue in front of couples before our call even happens. It&apos;s free, takes five minutes, and gives us real data to work with on the call.
                  </p>
                  <Link
                    href={FREE_SIGNUP_HREF}
                    className="group inline-flex items-center gap-2 rounded-full bg-brand-ink text-white px-7 py-3 text-[14px] font-semibold hover:bg-black transition-colors"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    List Your Venue Free
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <p
                    className="mt-3 text-[12px] text-brand-muted"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    Forever Free · No credit card required
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <PageFooter />
    </div>
  );
}
