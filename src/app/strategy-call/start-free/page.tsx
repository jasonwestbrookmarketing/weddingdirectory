import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Rocket, Globe, TrendingUp, ArrowRight } from "lucide-react";
import Marquee from "@/components/strategy-call/Marquee";
import StrategyNav from "@/components/strategy-call/StrategyNav";
import PageFooter from "@/components/strategy-call/PageFooter";
import { Reveal } from "@/components/strategy-call/Reveal";

export const dynamic = "force-static";

const STORYPAY_URL =
  process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";

// Free-plan signup — same flow as the rest of the site. Tagged so this
// entry point (post-survey, earlier-stage venues) is trackable on its own.
const FREE_SIGNUP_HREF = `${STORYPAY_URL}/signup?as=venue&plan=free&utm_source=strategy-call&utm_medium=survey&utm_campaign=start-free`;

// Distinct, no-index URL so the survey can route earlier-stage venues here and
// the Meta pixel can fire a "free signup intent" conversion scoped to this URL.
export const metadata: Metadata = {
  title: "Start Free | StoryVenue",
  description:
    "Every great venue starts here. Claim your free StoryVenue listing and get in front of couples today — no credit card, no contract.",
  alternates: { canonical: "/strategy-call/start-free" },
  robots: { index: false, follow: false },
};

const STEPS = [
  {
    icon: Globe,
    title: "Claim your free listing",
    body: "Get your venue in front of engaged couples actively searching StoryVenue. No credit card. No contract. Live in minutes.",
  },
  {
    icon: TrendingUp,
    title: "Start booking tours",
    body: "Capture inquiries, respond fast, and fill your calendar with the booking tools built into every free account.",
  },
  {
    icon: Rocket,
    title: "Scale when you're ready",
    body: "As the bookings grow, upgrade to unlock concierge follow-up, ads, and the 1-on-1 strategy support that fills weekends.",
  },
];

export default function StartFreePage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      {/* Sticky shell — marquee + nav scroll together (matches /strategy-call) */}
      <div className="sticky top-0 z-40">
        <Marquee />
        <StrategyNav showCta={false} />
      </div>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-brand-bg pt-10 sm:pt-14 lg:pt-16 pb-16 sm:pb-20 border-b border-brand-line">
          <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
            <Reveal>
              <span
                className="inline-flex items-center gap-2 rounded-full bg-brand-warm border border-brand-line px-4 py-1.5 text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-gold"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                Your Best First Step
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1
                className="mt-6 text-[34px] sm:text-[48px] md:text-[56px] leading-[1.08] text-brand-ink"
                style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
              >
                <span className="block">Every Great Venue</span>
                <span className="block">
                  Starts <span style={{ color: "#8a7448" }}>Right Here.</span>
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p
                className="mt-6 text-[15px] sm:text-[17px] text-brand-muted leading-relaxed max-w-2xl mx-auto"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                <span className="block">
                  Based on your answers, our 1-on-1 program isn&apos;t the right fit just yet — and that&apos;s actually good news.
                </span>
                <span className="block mt-3">
                  The smartest move right now is to get your venue listed and in front of couples for free. It&apos;s exactly where every venue we work with began.
                </span>
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="pt-9 sm:pt-10">
                <Link
                  href={FREE_SIGNUP_HREF}
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-ink text-white px-9 py-4 text-[15px] sm:text-[16px] font-semibold tracking-wide hover:bg-black transition-colors"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  Claim Your Free Listing
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <p
                  className="mt-4 text-[13px] text-brand-muted"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  No credit card · No contract · Live in minutes
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-brand-bg py-20 sm:py-28">
          <div className="max-w-5xl mx-auto px-6 md:px-10 text-center">
            <Reveal>
              <p
                className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-muted"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                How It Works
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h2
                className="mt-4 text-[22px] sm:text-3xl md:text-[38px] text-brand-ink leading-[1.12]"
                style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
              >
                Start small. Grow fast.
              </h2>
            </Reveal>

            <div className="mt-12 sm:mt-14 grid gap-4 sm:gap-5 sm:grid-cols-3 text-left">
              {STEPS.map(({ icon: Icon, title, body }, i) => (
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
              <div className="mt-14">
                <Link
                  href={FREE_SIGNUP_HREF}
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-ink text-white px-9 py-4 text-[15px] sm:text-[16px] font-semibold tracking-wide hover:bg-black transition-colors"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  Get Listed Free
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <PageFooter />
    </div>
  );
}
