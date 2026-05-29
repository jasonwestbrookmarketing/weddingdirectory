import type { Metadata } from "next";
import { CalendarCheck, Video, ListChecks, MessageSquare } from "lucide-react";
import Marquee from "@/components/strategy-call/Marquee";
import StrategyNav from "@/components/strategy-call/StrategyNav";
import VideoPlayer from "@/components/strategy-call/VideoPlayer";
import PageFooter from "@/components/strategy-call/PageFooter";
import { Reveal } from "@/components/strategy-call/Reveal";
import { CONFIRMATION_VIDEO_URL } from "@/components/strategy-call/constants";

export const dynamic = "force-static";

// Distinct title/canonical so the Meta pixel can fire a custom conversion on
// this URL (e.g. a "Schedule" / "Lead" event scoped to /strategy-call/confirmed).
export const metadata: Metadata = {
  title: "You're Booked | StoryVenue Strategy Call",
  description:
    "Your free strategy call is confirmed. Watch this quick video so you know exactly what to expect.",
  alternates: { canonical: "/strategy-call/confirmed" },
  robots: { index: false, follow: false },
};

const WHAT_TO_EXPECT = [
  {
    icon: CalendarCheck,
    title: "Check your inbox",
    body: "A calendar invite and confirmation are on their way. Add it to your calendar so the time is locked in.",
  },
  {
    icon: Video,
    title: "Watch the short video",
    body: "It takes two minutes and shows you exactly how the call works so we can skip the small talk and get to your numbers.",
  },
  {
    icon: ListChecks,
    title: "Come ready with your numbers",
    body: "Have a rough idea of your inquiries, tour conversion, and response time. We'll map out exactly how many weddings you're leaving on the table.",
  },
];

export default function StrategyCallConfirmedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      {/* Sticky shell — marquee + nav scroll together (matches /strategy-call) */}
      <div className="sticky top-0 z-40">
        <Marquee />
        <StrategyNav showCta={false} />
      </div>

      <main className="flex-1">
        {/* Hero / confirmation */}
        <section className="bg-brand-bg pt-10 sm:pt-14 lg:pt-16 pb-16 sm:pb-20 lg:pb-24 border-b border-brand-line">
          <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
            <Reveal>
              <span
                className="inline-flex items-center gap-2 rounded-full bg-brand-warm border border-brand-line px-4 py-1.5 text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-muted"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                <CalendarCheck className="w-3.5 h-3.5 text-brand-gold" />
                Your Call Is Confirmed
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1
                className="mt-6 text-[34px] sm:text-[48px] md:text-[56px] lg:text-[60px] leading-[1.08] text-brand-ink"
                style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
              >
                <span className="block">You&apos;re Booked.</span>
                <span className="block">
                  Here&apos;s What Happens{" "}
                  <span style={{ color: "#8a7448" }}>Next.</span>
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p
                className="mt-5 text-[15px] sm:text-[17px] text-brand-muted leading-relaxed max-w-2xl mx-auto"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                <span className="block">Watch this quick video before your call so you know exactly what to expect.</span>
                <span className="block">It&apos;ll make our 30 minutes together count.</span>
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <p
                className="mt-4 inline-flex items-center gap-2 text-[13px] sm:text-[14px] text-brand-muted"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                <MessageSquare className="w-4 h-4 text-brand-gold" />
                We&apos;ll text and email you reminders before we talk.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="pt-8 sm:pt-10">
                <VideoPlayer
                  videoUrl={CONFIRMATION_VIDEO_URL}
                  durationLabel="Watch · 2 min"
                  ariaLabel="Play video — what to expect on your strategy call"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* What to expect on the call */}
        <section className="bg-brand-bg py-20 sm:py-28">
          <div className="max-w-5xl mx-auto px-6 md:px-10 text-center">
            <Reveal>
              <p
                className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-muted"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                What To Expect On The Call
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h2
                className="mt-4 text-[22px] sm:text-3xl md:text-[38px] text-brand-ink leading-[1.12] md:whitespace-nowrap"
                style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
              >
                A 30-minute fit call. No pitch. No pressure.
              </h2>
            </Reveal>

            <div className="mt-12 sm:mt-14 grid gap-4 sm:gap-5 sm:grid-cols-3 text-left">
              {WHAT_TO_EXPECT.map(({ icon: Icon, title, body }, i) => (
                <Reveal key={title} delay={0.08 * i}>
                  <div className="h-full bg-white border border-brand-line rounded-xl p-6 sm:p-7">
                    <div className="flex items-center justify-center w-11 h-11 rounded-full bg-brand-warm border border-brand-line">
                      <Icon className="w-5 h-5 text-brand-gold" />
                    </div>
                    <h3
                      className="mt-5 text-[18px] sm:text-[19px] font-bold text-brand-ink"
                      style={{ fontFamily: "var(--font-open-sans)" }}
                    >
                      {title}
                    </h3>
                    <p
                      className="mt-2.5 text-[14.5px] sm:text-[15px] text-brand-muted leading-relaxed"
                      style={{ fontFamily: "var(--font-open-sans)" }}
                    >
                      {body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.3}>
              <p
                className="mt-12 text-[15px] sm:text-[16px] text-brand-muted"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                Can&apos;t make it?{" "}
                <span className="text-brand-ink font-semibold">
                  Check your email for the reschedule link.
                </span>
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <PageFooter />
    </div>
  );
}
