import type { Metadata } from "next";
import { CheckCircle2, Play, Mail, MessageSquare } from "lucide-react";
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
                Do these before your call — it takes less than 3 minutes.
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

        {/* What to expect next */}
        <section className="bg-brand-bg py-14 sm:py-20">
          <div className="max-w-2xl mx-auto px-6 md:px-10">
            <Reveal>
              <p
                className="text-[11px] font-semibold tracking-[0.28em] uppercase text-brand-muted text-center mb-6"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                What to expect next
              </p>
            </Reveal>

            {/* Emotional momentum — peak excitement, right after booking */}
            <Reveal delay={0.04}>
              <p
                className="text-center text-[15px] sm:text-[16px] text-brand-ink font-medium max-w-lg mx-auto mb-10 leading-relaxed"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                You made a smart move. Most venues go another whole season without fixing this. You didn&apos;t.
              </p>
            </Reveal>

            {/* Step 1 — Watch the video */}
            <Reveal delay={0.08}>
              <div className="flex gap-5 sm:gap-7 items-start">
                <div
                  className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-brand-ink text-white text-[15px] font-bold"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  1
                </div>
                <div className="flex-1 pb-10 border-b border-brand-line">
                  <div className="flex items-start gap-2 mb-1">
                    <Play className="w-4 h-4 text-brand-gold shrink-0 mt-1.5" />
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
                    It&apos;s two minutes. It shows you exactly how our call works so we can skip the small talk and get straight to your numbers.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Step 2 — Confirmation email & text */}
            <Reveal delay={0.16}>
              <div className="flex gap-5 sm:gap-7 items-start pt-10">
                <div
                  className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-brand-ink text-white text-[15px] font-bold"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  2
                </div>
                <div className="flex-1 pb-10 border-b border-brand-line">
                  <div className="flex items-start gap-2 mb-1">
                    <Mail className="w-4 h-4 text-brand-gold shrink-0 mt-1.5" />
                    <h2
                      className="text-[18px] sm:text-[20px] font-bold text-brand-ink"
                      style={{ fontFamily: "var(--font-open-sans)" }}
                    >
                      Check your email and phone
                    </h2>
                  </div>
                  <p
                    className="text-[14px] sm:text-[15px] text-brand-muted leading-relaxed"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    You&apos;ll receive a confirmation email and text with your scheduled date, time, and video call link. Save it so you&apos;re ready to join right on time.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Step 3 — Day-of reminder */}
            <Reveal delay={0.24}>
              <div className="flex gap-5 sm:gap-7 items-start pt-10">
                <div
                  className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-brand-ink text-white text-[15px] font-bold"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  3
                </div>
                <div className="flex-1 pb-10 border-b border-brand-line">
                  <div className="flex items-start gap-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-brand-gold shrink-0 mt-1.5" />
                    <h2
                      className="text-[18px] sm:text-[20px] font-bold text-brand-ink"
                      style={{ fontFamily: "var(--font-open-sans)" }}
                    >
                      We&apos;ll text you the day of your call
                    </h2>
                  </div>
                  <p
                    className="text-[14px] sm:text-[15px] text-brand-muted leading-relaxed"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    We&apos;ll text you the day of your call to confirm you&apos;re still on. Reply <strong className="text-brand-ink">YES</strong> to hold your spot.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Step 4 — Prepare for the call */}
            <Reveal delay={0.32}>
              <div className="flex gap-5 sm:gap-7 items-start pt-10">
                <div
                  className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-brand-ink text-white text-[15px] font-bold"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  4
                </div>
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-1">
                    <Play className="w-4 h-4 text-brand-gold shrink-0 mt-1.5" />
                    <h2
                      className="text-[18px] sm:text-[20px] font-bold text-brand-ink"
                      style={{ fontFamily: "var(--font-open-sans)" }}
                    >
                      Have these ready (optional, but worth it)
                    </h2>
                  </div>
                  <p
                    className="text-[14px] sm:text-[15px] text-brand-muted leading-relaxed"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    Roughly how many weddings you booked last year, how many open dates you still have, and what you&apos;ve tried for marketing so far. No prep required, but knowing these makes the call 10x more valuable.
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
