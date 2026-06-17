import type { Metadata } from "next";
import { CalendarCheck, Video, ListChecks, CheckCircle2, CalendarPlus } from "lucide-react";
import StrategyNav from "@/components/strategy-call/StrategyNav";
import VideoPlayer from "@/components/strategy-call/VideoPlayer";
import PageFooter from "@/components/strategy-call/PageFooter";
import { Reveal } from "@/components/strategy-call/Reveal";
import { CONFIRMATION_VIDEO_URL } from "@/components/strategy-call/constants";
import FireLeadEvent from "@/components/strategy-call/FireLeadEvent";

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

// Google Calendar deeplink — opens a pre-filled "StoryVenue Strategy Call"
// event so they can add it in one click. Date/time intentionally left blank
// (GHL sends a proper invite; this just reinforces the habit of adding it).
const GCAL_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  "&text=StoryVenue+Strategy+Call" +
  "&details=Your+free+30-minute+strategy+call+with+StoryVenue.+Check+your+email+for+the+exact+time+and+join+link.";

export default function StrategyCallConfirmedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <FireLeadEvent />

      {/* Nav only — no marquee on a post-conversion page */}
      <div className="sticky top-0 z-40">
        <StrategyNav showCta={false} />
      </div>

      <main className="flex-1">
        {/* Hero / confirmation — compact so video is near fold */}
        <section className="bg-brand-bg pt-8 sm:pt-12 pb-10 sm:pb-14 border-b border-brand-line">
          <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">

            {/* Confirmed pill + add-to-calendar */}
            <Reveal>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <span
                  className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-4 py-1.5 text-[11px] font-semibold tracking-[0.22em] uppercase text-green-700"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  Your Call Is Confirmed
                </span>
                <a
                  href={GCAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-line bg-white px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] uppercase text-brand-muted hover:border-brand-ink hover:text-brand-ink transition-colors"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  Add to Calendar
                </a>
              </div>
            </Reveal>

            {/* Headline — smaller than before so video comes up faster */}
            <Reveal delay={0.08}>
              <h1
                className="mt-5 text-[30px] sm:text-[40px] md:text-[48px] leading-[1.1] text-brand-ink"
                style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
              >
                You&apos;re Booked. Here&apos;s What Happens{" "}
                <span style={{ color: "#8a7448" }}>Next.</span>
              </h1>
            </Reveal>

            {/* Single-line sub — no clutter before the video */}
            <Reveal delay={0.14}>
              <p
                className="mt-3 text-[15px] sm:text-[16px] text-brand-muted"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                Watch this quick video before your call — it&apos;ll make our 30 minutes count.
              </p>
            </Reveal>

            {/* Reschedule nudge — near the top, not buried */}
            <Reveal delay={0.18}>
              <p
                className="mt-2 text-[13px] text-brand-muted"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                Can&apos;t make it?{" "}
                <span className="text-brand-ink font-semibold">Check your email for the reschedule link.</span>
              </p>
            </Reveal>

            {/* Video — tighter top padding so it's near the fold */}
            <Reveal delay={0.22}>
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

        {/* What to expect on the call — tighter padding */}
        <section className="bg-brand-bg py-14 sm:py-20">
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

            <div className="mt-10 sm:mt-12 grid gap-4 sm:gap-5 sm:grid-cols-3 text-left">
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
          </div>
        </section>
      </main>

      <PageFooter />
    </div>
  );
}
