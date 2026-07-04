import type { Metadata, Viewport } from "next";
import Image from "next/image";
import { ArrowRight, Store, Inbox, Zap, ChevronDown } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import FireDisqualifiedEvent from "@/components/strategy-call/FireDisqualifiedEvent";

const STORYPAY_URL =
  process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";

const TRIAL_HREF = `${STORYPAY_URL}/signup?plan=venue-pro&utm_source=strategy-call&utm_medium=survey&utm_campaign=start-free`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://storyvenue.com"),
  title: "Your Best Next Step | StoryVenue",
  description:
    "The Bride Booking System is the engine behind our done-for-you program — start it yourself with a 14-day free trial. Downgrade to free anytime.",
  alternates: { canonical: "/strategy-call/start-free" },
  robots: { index: false, follow: false },
};

const FEATURES = [
  {
    icon: Store,
    title: "Venue Listing Page",
    desc: "A page built to turn bride clicks into inquiries. No website needed.",
  },
  {
    icon: Inbox,
    title: "Lead Inbox",
    desc: "Every bride lands in one place. Nothing slips through the cracks.",
  },
  {
    icon: Zap,
    title: "Speed to Lead System",
    desc: "Every new inquiry gets followed up in seconds so you're always first.",
  },
];

const FAQ = [
  {
    q: "Do I need a website or tech skills?",
    a: "No. Your listing page and booking funnel are built for you during setup. If you can share a link, you can run this.",
  },
  {
    q: "What happens after the 14-day free trial?",
    a: "You continue on the Bride Booking System™ for $97/month, or downgrade to the free plan anytime and keep your listing live. You're never locked in.",
  },
  {
    q: "Is there a contract?",
    a: "No contracts and no commitment. Stay month to month, downgrade, or cancel whenever you want.",
  },
  {
    q: "How is this different from a directory?",
    a: "Directories list you next to every competitor. The Bride Booking System™ captures every bride, follows up in seconds, and books tours for you — on autopilot.",
  },
];

export default function StartFreePage() {
  return (
    <>
      <FireDisqualifiedEvent />

      {/* ── NAV ── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/60">
        <nav className="max-w-5xl mx-auto flex items-center justify-between px-5 md:px-10 py-3">
          <Image
            src="/storyvenue-dark-logo.png"
            alt="StoryVenue"
            width={160}
            height={40}
            className="h-8 w-auto object-contain"
            priority
          />
          <a
            href={TRIAL_HREF}
            className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 text-white text-[12px] font-semibold px-4 py-2 hover:bg-stone-800 transition-colors"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Start Free Trial
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </nav>
      </header>

      <main>
        {/* ── HERO — above-the-fold offer, no images pushing CTA down ── */}
        <section className="bg-white pt-10 sm:pt-14 pb-12 sm:pb-16 border-b border-stone-200/60">
          <div className="max-w-2xl mx-auto px-6 text-center">

            {/* Badge */}
            <span
              className="inline-flex items-center rounded-full bg-stone-100 border border-stone-200 px-3.5 py-1.5 text-[11px] sm:text-[12px] font-semibold text-stone-600"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Thanks for applying. This is your next best step to grow.
            </span>

            {/* Headline */}
            <h1
              className="mt-5 text-[30px] sm:text-[42px] md:text-[50px] leading-[1.08] text-stone-900"
              style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
            >
              Start Booking More Brides{" "}
              <span style={{ color: "var(--color-brand-gold)" }}>on Your Own Terms.</span>
            </h1>

            {/* Short subhead */}
            <p
              className="mt-4 text-[15px] sm:text-[17px] text-stone-600 leading-relaxed"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Our done-for-you program isn&apos;t your next step yet, but the engine behind it is.
              Start the Bride Booking System free for 14 days and grow into the full program when you&apos;re ready.
            </p>

            {/* CTA — primary */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <a
                href={TRIAL_HREF}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-white font-semibold px-7 py-3.5 text-[15px] hover:bg-stone-800 active:scale-[0.98] transition-all shadow-[0_8px_24px_-10px_rgba(0,0,0,0.4)]"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                Start Your 14-Day Free Trial
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <p
                className="text-[12px] text-stone-500"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                Free for 14 days · Then $97/mo or downgrade to free · No contract
              </p>
            </div>

            {/* Bridge back to the main program */}
            <p
              className="mt-6 text-[12px] sm:text-[13px] text-stone-400 leading-relaxed"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Already on the platform and ready to use our done-for-you program?{" "}
              <a
                href="https://storyvenue.com/strategy-call"
                className="underline underline-offset-2 text-stone-500 hover:text-stone-700 transition-colors"
              >
                Book a call anytime at storyvenue.com/strategy-call.
              </a>
            </p>
          </div>
        </section>

        {/* ── 3 CORE FEATURES — short, scannable ── */}
        <section className="bg-stone-50 py-14 sm:py-20 border-b border-stone-200/60">
          <div className="max-w-4xl mx-auto px-6 md:px-10">
            <p
              className="text-center text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-400 mb-10"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              What&apos;s included in your trial
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl bg-white border border-stone-200/80 p-6"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-white">
                    <Icon className="w-[17px] h-[17px]" />
                  </span>
                  <h3
                    className="mt-4 text-[15px] font-bold text-stone-900"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    {title}
                  </h3>
                  <p
                    className="mt-1.5 text-[13px] text-stone-500 leading-relaxed"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    {desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Mid-page CTA */}
            <div className="mt-10 flex justify-center">
              <a
                href={TRIAL_HREF}
                className="group inline-flex items-center gap-2 rounded-full bg-stone-900 text-white font-semibold px-6 py-3 text-[14px] hover:bg-stone-800 active:scale-[0.98] transition-all"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                Start Free — No Credit Card Needed
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-white py-14 sm:py-20">
          <div className="max-w-2xl mx-auto px-6 md:px-10">
            <h2
              className="text-center text-[24px] sm:text-[32px] text-stone-900 leading-[1.1] mb-10"
              style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
            >
              Quick answers.
            </h2>
            <div className="divide-y divide-stone-200">
              {FAQ.map((item, i) => (
                <details key={item.q} open={i === 0} className="group py-5">
                  <summary
                    className="flex cursor-pointer items-start justify-between gap-4 list-none"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    <span className="text-[14px] font-semibold text-stone-900">{item.q}</span>
                    <ChevronDown className="mt-0.5 w-5 h-5 shrink-0 text-stone-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <p
                    className="mt-3 text-[13px] text-stone-600 leading-relaxed"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    {item.a}
                  </p>
                </details>
              ))}
            </div>

            {/* Final CTA */}
            <div className="mt-10 flex flex-col items-center gap-3">
              <a
                href={TRIAL_HREF}
                className="group inline-flex items-center gap-2 rounded-full bg-stone-900 text-white font-semibold px-7 py-3.5 text-[15px] hover:bg-stone-800 active:scale-[0.98] transition-all shadow-[0_8px_24px_-10px_rgba(0,0,0,0.4)]"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                Start Your 14-Day Free Trial
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <p
                className="text-[12px] text-stone-500"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                Free for 14 days · Then $97/mo or downgrade to free · No contract
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
