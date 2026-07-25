import Image from "next/image";
import {
  ArrowRight,
  Store,
  BookOpen,
  Inbox,
  Zap,
  CalendarDays,
  Clock,
  Link2,
  Settings,
  Shield,
  ChevronDown,
} from "lucide-react";
import HighlighterText from "@/components/marketing/HighlighterText";
import LossStack from "@/components/marketing/LossStack";
import PhonePreview from "@/components/marketing/PhonePreview";

/* -------------------------------------------------------------------- */
/*  Data                                                                  */
/* -------------------------------------------------------------------- */

const CORE_FEATURES: Array<{
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  elevated?: boolean;
  /** Mobile screenshot shown in the phone. Omit to use the live activity feed. */
  screenshotSrc?: string;
  badgeLabel: string;
  badgeDetail: string;
}> = [
  {
    icon: Store,
    title: "Venue Listing Page",
    description:
      "A page built to turn bride clicks into inquiries. No website needed.",
    screenshotSrc: "/phone-directory-listing.png",
    badgeLabel: "Listing live",
    badgeDetail: "Red Barn Acres ✓",
  },
  {
    icon: BookOpen,
    title: "Pricing & Availability Guide",
    description:
      "Give brides the pricing they want instantly, so they reach out ready to talk.",
    screenshotSrc: "/phone-pricing-guide.png",
    badgeLabel: "Guide sent",
    badgeDetail: "Pricing delivered ✓",
  },
  {
    icon: Inbox,
    title: "Lead Inbox",
    description:
      "Every bride lands in one place. Nothing slips through the cracks.",
    screenshotSrc: "/phone-leads.png",
    badgeLabel: "New lead",
    badgeDetail: "Jonathan B. · just now",
  },
  {
    icon: Zap,
    title: "Speed to Lead System",
    description:
      "Every new inquiry gets followed up in seconds, so you're always first.",
    elevated: true,
    badgeLabel: "Auto follow-up",
    badgeDetail: "Replied in 12s ✓",
  },
  {
    icon: CalendarDays,
    title: "Venue Calendar",
    description:
      "Tours and dates booked in one calendar, no back and forth.",
    screenshotSrc: "/phone-calendar.png",
    badgeLabel: "Tour booked",
    badgeDetail: "Sat, Nov 8 · 2:00 PM",
  },
];

const STEPS: Array<{
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}> = [
  {
    icon: Settings,
    title: "Onboard once",
    description:
      "Your listing page and booking funnel are built for you during a quick setup.",
  },
  {
    icon: Link2,
    title: "Share your link",
    description:
      "Drop it on your website, your Instagram bio, your ads, anywhere brides look.",
  },
  {
    icon: Inbox,
    title: "Brides come in",
    description:
      "Every click becomes a lead in your inbox, followed up in seconds, on autopilot.",
  },
];

const STATS: Array<{ value: string; venue: string; label: string }> = [
  { value: "$15k", venue: "Atlantic Stables", label: "In booked weddings the first 30 days" },
  { value: "$8,000", venue: "Waterloo Farms", label: "In booked weddings the first 7 days" },
  { value: "258", venue: "Retreat at Evans Farms", label: "Leads in 60 days" },
];

const LOGOS = [
  { src: "/logos/arbor.png", alt: "Arbor at the Port", h: 36 },
  { src: "/logos/vista.png", alt: "Vista on the Docks", h: 34 },
  { src: "/logos/bogart.png", alt: "Bogart House", h: 52 },
  { src: "/logos/pinetree.png", alt: "The Pinetree", h: 44 },
  { src: "/logos/rachel.png", alt: "Rachel Marie Events & Co.", h: 44 },
  { src: "/logos/waterloo.png", alt: "Waterloo Farms", h: 48 },
  { src: "/logos/white-pine.png", alt: "White Pine Manor", h: 48 },
  { src: "/logos/willowcreek.png", alt: "Willow Creek", h: 40 },
  { src: "/logos/atlantic.png", alt: "Atlantic Stables", h: 44 },
];

const FAQ_ITEMS = [
  {
    q: "Do I need a website or any tech skills?",
    a: "No. Your listing page and booking funnel are built for you during setup. If you can share a link, you can run this.",
  },
  {
    q: "How fast can I actually start getting leads?",
    a: "As soon as you're set up. Share your listing link and the next bride who clicks becomes a lead in your inbox.",
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
    q: "Will this replace the tools I already use?",
    a: "For most venues, yes. Your listing page, lead inbox, follow-up, calendar, proposals, and payments all live in one place, so you can stop paying for and juggling separate tools.",
  },
  {
    q: "What makes this different from a directory or an agency?",
    a: "Directories list you next to every competitor. Agencies just send traffic. The Bride Booking System™ captures every bride, follows up in seconds, and books tours for you. It's built to get you booked, not just seen.",
  },
] as const;

/* -------------------------------------------------------------------- */
/*  Shared CTA                                                            */
/* -------------------------------------------------------------------- */

export function PrimaryCTA({
  href,
  label = "Start Your 14-Day Free Trial",
  size = "lg",
  className = "",
}: {
  href: string;
  label?: string;
  size?: "md" | "lg";
  className?: string;
}) {
  const sizing =
    size === "lg" ? "px-6 py-3.5 text-[15px]" : "px-5 py-2.5 text-sm";
  return (
    <a
      href={href}
      className={`group inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-white font-semibold hover:bg-stone-800 active:scale-[0.98] transition-all shadow-[0_8px_24px_-10px_rgba(0,0,0,0.4)] ${sizing} ${className}`}
      style={{ fontFamily: "var(--font-open-sans)" }}
    >
      {label}
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}

/* -------------------------------------------------------------------- */
/*  Shared sales body — everything below the hero                         */
/*  Reused by /bride-booking-system and /strategy-call/start-free so the  */
/*  proven SaaS pitch stays identical across both entry points.           */
/* -------------------------------------------------------------------- */

// ── Free-listing variant overrides ───────────────────────────────────────────

const FREE_LISTING_FAQ: Array<{ q: string; a: string }> = [
  {
    q: "Do I need a website or any tech skills?",
    a: "No. Your listing page and booking funnel are built for you during setup. If you can share a link, you can run this.",
  },
  {
    q: "How fast can I actually start getting leads?",
    a: "As soon as you're set up. Share your listing link and the next bride who clicks becomes a lead in your inbox.",
  },
  {
    q: "What does the free listing include?",
    a: "Your free listing includes your venue page, direct inquiries, proposals with e-signatures, and online payments. Upgrade anytime for managed Meta ads and our Concierge follow-up team.",
  },
  {
    q: "Is there a contract?",
    a: "No contracts and no commitment. Stay month to month, downgrade, or cancel whenever you want.",
  },
  {
    q: "Will this replace the tools I already use?",
    a: "For most venues, yes. Your listing page, lead inbox, follow-up, calendar, proposals, and payments all live in one place, so you can stop paying for and juggling separate tools.",
  },
  {
    q: "What makes this different from a directory or an agency?",
    a: "We are the wedding directory built to send each bride to you, not hand her to ten venues at once. Then we give you the system to follow up fast and turn her into a booked tour.",
  },
];

export default function BrideBookingSections({
  trialHref,
  variant = "trial",
}: {
  trialHref: string;
  variant?: "trial" | "free-listing";
}) {
  const isFreeListing = variant === "free-listing";
  const ctaLabel = isFreeListing ? "Claim Your Free Listing" : "Start Your 14-Day Free Trial";
  const faqItems: Array<{ q: string; a: string }> = isFreeListing ? FREE_LISTING_FAQ : [...FAQ_ITEMS];
  return (
    <>
      {/* ============================================================== */}
      {/* LOGO WALL                                                       */}
      {/* ============================================================== */}
      <div className="bg-white py-12 lg:py-10 overflow-hidden">
        <div className="flex animate-[ticker_28s_linear_infinite] lg:animate-[ticker_60s_linear_infinite] whitespace-nowrap gap-10 lg:gap-16 items-center">
          {[...LOGOS, ...LOGOS].map(({ src, alt, h }, i) => (
            <div key={i} className="shrink-0 flex items-center justify-center">
              <Image
                src={src} alt={i < LOGOS.length ? alt : ""} width={160} height={h} unoptimized placeholder="empty"
                className="w-auto object-contain"
                style={{ height: h, maxWidth: 140, filter: "brightness(0) invert(0) sepia(0) saturate(0) hue-rotate(0deg) brightness(0.11)", mixBlendMode: "multiply" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* PAIN                                                            */}
      {/* ============================================================== */}
      <section className="bg-stone-50/70 py-20 sm:py-28 border-b border-stone-200/60">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <h2
            className="text-[26px] sm:text-4xl md:text-5xl text-stone-900 leading-[1.15]"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Brides Are Looking For a Venue
            <br className="sm:hidden" />
            {" "}Like Yours. So Why Are They{" "}
            <HighlighterText>Booking Somewhere Else?</HighlighterText>
          </h2>
          <div
            className="mt-8 space-y-4 text-stone-600 text-base sm:text-lg leading-relaxed"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            <p>
              You&apos;ve got the venue. The photos. The reviews. And still, weekends sit empty.
            </p>
            <p>
              It&apos;s not that brides aren&apos;t looking. It&apos;s that you&apos;re losing them after they find you.
            </p>
            <p>
              She asks for pricing. Waits too long. Hears nothing. Goes quiet. Books somewhere else.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* AGITATE                                                         */}
      {/* ============================================================== */}
      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl text-balance text-stone-900 leading-[1.08]"
              style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
            >
              Every Bride Who Slips Away{" "}
              <br className="hidden lg:block" />
              Is More Than a Missed Inquiry.
            </h2>
            <div
              className="mt-8 space-y-4 text-stone-600 text-base sm:text-lg leading-relaxed"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              <p>
                It&apos;s a missed tour. A missed wedding. A weekend on your calendar you never get back.
              </p>
              <p>
                And she&apos;ll never tell you why. She just stops replying and books somewhere else.
              </p>
              <p className="font-medium text-stone-900">
                Not the better venue. Not the cheaper one. The one that replied first, answered clearly, and made her feel sure.
              </p>
            </div>
          </div>

          {/* Visual: loss stack */}
          <div className="lg:col-span-5">
            <LossStack />
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SOLUTION REVEAL                                                 */}
      {/* ============================================================== */}
      <section className="bg-stone-50/70 py-20 sm:py-28 border-y border-stone-200/60 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left — copy */}
            <div className="min-w-0">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl lg:whitespace-nowrap text-stone-900 leading-[1.08]"
                style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
              >
                Meet the Bride Booking System<sup style={{ fontSize: "0.45em", verticalAlign: "super", fontWeight: 500 }}>™</sup>.
              </h2>

              <div
                className="mt-8 space-y-4 text-stone-600 text-base sm:text-lg leading-relaxed"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                <p>
                  The complete Bride Booking System™ that turns bride inquiries into booked tours, built only for wedding venues.
                </p>
                <p>
                  It captures every bride who finds you, follows up in seconds, and keeps the conversation moving until she books. So you&apos;re always the venue that replied first.
                </p>
              </div>

              <div className="mt-8">
                <PrimaryCTA href={trialHref} label={ctaLabel} size="md" />
              </div>
            </div>

            {/* Right — dashboard screenshot */}
            <div className="min-w-0 max-w-full overflow-hidden lg:max-w-none lg:overflow-visible lg:pr-4">
              <div className="relative rounded-2xl overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.28)] border border-stone-200/60">
                {/* Fake browser chrome */}
                <div className="flex items-center gap-1.5 bg-stone-100 border-b border-stone-200 px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  <div className="ml-3 flex-1 rounded-md bg-white border border-stone-200 px-3 py-1 text-[10px] text-stone-400 font-mono">
                    app.storyvenue.com/dashboard
                  </div>
                </div>
                <Image
                  src="/dashboard-mockup.png"
                  alt="Bride Booking System dashboard"
                  width={1024}
                  height={545}
                  unoptimized
                  placeholder="empty"
                  className="w-full h-auto object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* MECHANISM                                                       */}
      {/* ============================================================== */}
      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6 md:px-10 text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-3.5 py-1.5 text-[12px] font-semibold text-green-700"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            <Clock className="w-3.5 h-3.5" />
            Live in about 5 minutes
          </span>
          <h2
            className="mt-5 text-3xl sm:text-4xl md:text-5xl text-stone-900 leading-[1.08]"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Live in 5 Minutes.{" "}
            <span className="whitespace-nowrap">Working for You 24/7.</span>
          </h2>
          <p
            className="mt-6 text-base sm:text-lg text-stone-600 leading-relaxed max-w-3xl mx-auto"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Easy to setup with our 5 minute install. Share your listing link on your site, your social, your ads, anywhere brides find you. From that moment on, every bride who clicks gets captured, followed up with, and guided toward a tour. Automatically.
          </p>

          {/* 3-card row */}
          <div className="mt-12 grid sm:grid-cols-3 gap-5 text-left">
            {STEPS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl bg-stone-50 border border-stone-200/80 p-6 hover:shadow-[0_14px_32px_-15px_rgba(0,0,0,0.14)] hover:-translate-y-0.5 transition-all"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-white">
                  <Icon className="w-[17px] h-[17px]" />
                </span>
                <h3 className="mt-4 text-[16px] font-bold text-stone-900" style={{ fontFamily: "var(--font-open-sans)" }}>
                  {title}
                </h3>
                <p className="mt-1.5 text-[13px] text-stone-500 leading-relaxed" style={{ fontFamily: "var(--font-open-sans)" }}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* CORE FEATURES                                                   */}
      {/* ============================================================== */}
      <section className="bg-stone-50/70 py-20 sm:py-28 border-y border-stone-200/60">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <h2
            className="text-center text-3xl sm:text-4xl md:text-5xl text-stone-900 leading-[1.08]"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Everything You Need to Capture and Book More Brides.{" "}
            <span className="whitespace-nowrap">In One System.</span>
          </h2>

          <div className="mt-16 sm:mt-24 space-y-20 sm:space-y-28">
            {CORE_FEATURES.map(
              ({ icon: Icon, title, description, elevated, screenshotSrc, badgeLabel, badgeDetail }, i) => {
                const reverse = i % 2 === 1;
                return (
                  <div
                    key={title}
                    className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center"
                  >
                    {/* Phone — always below copy on mobile (order-2), alternates on desktop */}
                    <div
                      className={`flex justify-center order-2 ${
                        reverse
                          ? "lg:justify-end lg:order-2"
                          : "lg:justify-start lg:order-1"
                      }`}
                    >
                      <PhonePreview
                        screenshotSrc={screenshotSrc}
                        badgeLabel={badgeLabel}
                        badgeDetail={badgeDetail}
                      />
                    </div>

                    {/* Copy — always above phone on mobile (order-1), alternates on desktop */}
                    <div className={`order-1 ${reverse ? "lg:order-1" : "lg:order-2"}`}>
                      <span
                        className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                        style={{ backgroundColor: "#1c1917" }}
                      >
                        <Icon className="w-5 h-5" />
                      </span>
                      <h3
                        className="mt-4 text-2xl sm:text-3xl md:text-4xl text-stone-900 leading-[1.1]"
                        style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
                      >
                        {title}
                      </h3>
                      <p
                        className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed max-w-md"
                        style={{ fontFamily: "var(--font-open-sans)" }}
                      >
                        {description}
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* PROPOSAL & PAYMENTS                                             */}
      {/* ============================================================== */}
      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <PhonePreview
              screenshotSrc="/phone-proposals.png"
              badgeLabel="Proposal sent"
              badgeDetail="Sophie + Will · Signed ✓"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl text-stone-900 leading-[1.08]"
              style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
            >
              Send Branded Proposals &amp;
              <br />
              Online Payments With
              <br />
              0% Processing Fees
            </h2>
            <div
              className="mt-8 space-y-4 text-stone-600 text-base sm:text-lg leading-relaxed"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              <p>
                Send a branded proposal she can sign and pay right from her phone. She gets a simple, professional way to lock in her date in minutes.
              </p>
              <p>
                You collect deposits, balances, and payment plans online. It&apos;s included free, with 0% processing fees, so every dollar stays yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SOCIAL PROOF                                                    */}
      {/* ============================================================== */}
      <section className="relative bg-stone-900 text-white py-20 sm:py-28 overflow-hidden">
        {/* Shared background image (same as /book-more-weddings) */}
        <Image
          src="/not-just-software-bg.jpg"
          alt=""
          aria-hidden
          fill
          unoptimized
          placeholder="empty"
          className="absolute inset-0 object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-stone-900/70" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10">
          <div className="grid sm:grid-cols-3 gap-10 sm:gap-8 text-center">
            {STATS.map(({ value, venue, label }) => (
              <div key={label}>
                <p
                  className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/40 mb-3"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {venue}
                </p>
                <p
                  className="text-5xl sm:text-6xl text-white leading-none"
                  style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
                >
                  {value}
                </p>
                <p
                  className="mt-3 text-[13px] sm:text-sm text-white/60 leading-snug whitespace-nowrap"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Logo set */}
          <div className="mt-16 overflow-hidden">
            <div className="flex animate-[ticker_28s_linear_infinite] lg:animate-[ticker_60s_linear_infinite] whitespace-nowrap gap-10 lg:gap-16 items-center">
              {[...LOGOS, ...LOGOS].map(({ src, alt, h }, i) => (
                <div key={i} className="shrink-0 flex items-center justify-center">
                  <Image
                    src={src} alt={i < LOGOS.length ? alt : ""} width={160} height={h} unoptimized placeholder="empty"
                    className="w-auto object-contain"
                    style={{ height: h, maxWidth: 140, filter: "brightness(0) invert(1) grayscale(1)", opacity: 0.55 }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* GUARANTEE                                                       */}
      {/* ============================================================== */}
      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <div className="rounded-3xl border border-stone-200 bg-stone-50/60 px-8 py-12 sm:px-12 sm:py-14 text-center shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-900 text-white">
              <Shield className="w-6 h-6" />
            </span>
            <h2
              className="mt-6 text-3xl sm:text-4xl text-stone-900 leading-[1.08]"
              style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
            >
              {isFreeListing ? "List Your Venue Free" : "Try It Free for 14 Days."}
            </h2>
            <div
              className="mt-6 space-y-4 text-stone-600 text-base sm:text-lg leading-relaxed"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              {isFreeListing ? (
                <p>
                  Claim your free listing and get found by couples searching for a venue right now. Add your photos, your reviews, and your details, and start receiving inquiries. Upgrade anytime you want managed ads and done-for-you follow-up.
                </p>
              ) : (
                <>
                  <p className="lg:whitespace-nowrap">
                    Start your 14-day free trial and use the entire Bride Booking System™.
                  </p>
                  <p className="lg:whitespace-nowrap">
                    Downgrade to the free plan anytime and keep your listing live.
                  </p>
                </>
              )}
            </div>
            <div className="mt-8 flex justify-center">
              <PrimaryCTA href={trialHref} label={ctaLabel} />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* FAQ                                                             */}
      {/* ============================================================== */}
      <section id="faq" className="bg-stone-50/70 py-20 sm:py-28 border-y border-stone-200/60">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <h2
            className="text-center text-3xl sm:text-4xl text-stone-900 leading-[1.08]"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Frequently Asked Questions.
          </h2>

          <div className="mt-12 divide-y divide-stone-200">
            {faqItems.map((item, i) => (
              <details key={item.q} open={i === 0} className="group py-5">
                <summary
                  className="flex cursor-pointer items-start justify-between gap-4 list-none"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  <span className="text-[15px] font-semibold text-stone-900">
                    {item.q}
                  </span>
                  <ChevronDown className="mt-0.5 w-5 h-5 shrink-0 text-stone-400 transition-transform group-open:rotate-180" />
                </summary>
                <div
                  className="mt-4 text-[14px] text-stone-600 leading-relaxed"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  <p>{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* FINAL CTA                                                       */}
      {/* ============================================================== */}
      <section className="relative text-white overflow-hidden">
        {/* Background image */}
        <Image
          src="/your-next-step-bg.jpg"
          alt=""
          aria-hidden
          fill
          unoptimized
          placeholder="empty"
          className="absolute inset-0 object-cover object-top"
          sizes="100vw"
        />

        {/* Gradient only at the bottom */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.80) 100%)" }}
        />

        {/* Content layer above the image */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 pt-72 pb-20 sm:pt-80 sm:pb-28 text-center">
          <h2
            className="text-[28px] sm:text-4xl md:text-5xl leading-[1.1]"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            {isFreeListing
              ? "List Your Venue Free In Minutes"
              : <>Start Booking More Brides{" "}<span className="whitespace-nowrap">in 5 Minutes.</span></>}
          </h2>
          <p
            className="mt-5 text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            {isFreeListing
              ? "Claim your spot on the fastest growing wedding directory and get found by more couples. Free to list. Upgrade anytime."
              : "Set up your Bride Booking System™, share your link, and start turning brides into booked tours. Free for 14 days. Downgrade anytime."}
          </p>

          <div className="mt-10 flex justify-center">
            <a
              href={trialHref}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-stone-900 font-semibold px-7 py-4 text-base shadow-[0_18px_45px_-12px_rgba(0,0,0,0.6)] hover:bg-stone-100 active:scale-[0.98] transition-all"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              {ctaLabel}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
          {!isFreeListing && (
            <p className="mt-5 text-[12px] text-white/50" style={{ fontFamily: "var(--font-open-sans)" }}>
              Free for 14 days · Downgrade to free anytime
            </p>
          )}
        </div>
      </section>
    </>
  );
}
