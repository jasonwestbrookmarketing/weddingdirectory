import Image from "next/image";
import type { Metadata, Viewport } from "next";
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
import SiteFooter from "@/components/SiteFooter";
import HighlighterText from "@/components/marketing/HighlighterText";
import LossStack from "@/components/marketing/LossStack";
import DashboardMockup from "@/components/marketing/DashboardMockup";
import PhonePreview from "@/components/marketing/PhonePreview";
import ScrollToTop from "@/components/marketing/ScrollToTop";
import FomoPopup from "@/components/marketing/FomoPopup";

export const dynamic = "force-static";

const STORYPAY_URL =
  process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";

const TRIAL_HREF = `${STORYPAY_URL}/signup?plan=venue-pro&utm_source=meta&utm_campaign=bride-booking-system`;

// Prevent iOS from auto-zooming when the user taps into input fields with a
// font-size < 16px. Matches book-more-weddings viewport behavior.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://storyvenue.com"),
  title:
    "The Bride Booking System — Start Booking More Brides in 5 Minutes | StoryVenue",
  description:
    "Capture every bride, follow up in seconds, and book more tours. The booking system built only for wedding venues. 14-day free trial.",
  alternates: { canonical: "/bride-booking-system" },
};

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

const STATS: Array<{ value: string; label: string }> = [
  { value: "258", label: "Leads in 60 Days" },
  { value: "$15,000", label: "in Booked Weddings in 30 Days" },
  { value: "2", label: "Weddings Booked in 7 Days" },
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
    a: "You continue on the Bride Booking System for $97/month, or downgrade to the free plan anytime and keep your listing live. You're never locked in.",
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
    a: "Directories list you next to every competitor. Agencies just send traffic. The Bride Booking System captures every bride, follows up in seconds, and books tours for you. It's built to get you booked, not just seen.",
  },
] as const;

/* -------------------------------------------------------------------- */
/*  Shared CTA component                                                  */
/* -------------------------------------------------------------------- */

function PrimaryCTA({
  label = "Start Your 14-Day Free Trial",
  size = "lg",
  className = "",
}: {
  label?: string;
  size?: "md" | "lg";
  className?: string;
}) {
  const sizing =
    size === "lg" ? "px-6 py-3.5 text-[15px]" : "px-5 py-2.5 text-sm";
  return (
    <a
      href={TRIAL_HREF}
      className={`group inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 text-white font-semibold hover:bg-stone-800 active:scale-[0.98] transition-all shadow-[0_8px_24px_-10px_rgba(0,0,0,0.4)] ${sizing} ${className}`}
      style={{ fontFamily: "var(--font-open-sans)" }}
    >
      {label}
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}

/* -------------------------------------------------------------------- */
/*  Page                                                                  */
/* -------------------------------------------------------------------- */

export default function BrideBookingSystemPage() {
  return (
    <>
      {/* ============================================================== */}
      {/* STICKY SHELL — ticker + nav scroll together as one unit         */}
      {/* ============================================================== */}
      <div className="sticky top-0 z-40">
        {/* TICKER */}
        <div className="w-full overflow-hidden shrink-0 py-2 bg-[#1c1c1c]">
          <div className="flex animate-[announcement-ticker_25s_linear_infinite] lg:animate-[announcement-ticker_60s_linear_infinite] whitespace-nowrap">
            {[
              { venue: "Manor", result: "2026 Dates Booked in 90 Days" },
              { venue: "Waterloo Farms", result: "2 Weddings Booked in 7 Days" },
              { venue: "Atlantic Stables", result: "$15,000 in Booked Weddings in 30 Days" },
              { venue: "Retreat at Evans Farms", result: "258 Leads in 60 Days" },
              { venue: "Red Barn Acres", result: "9 Weddings Booked in 4 Months" },
              { venue: "Irongate Wedding Venue", result: "131 Leads in 60 Days" },
              { venue: "Manor", result: "2026 Dates Booked in 90 Days" },
              { venue: "Waterloo Farms", result: "2 Weddings Booked in 7 Days" },
              { venue: "Atlantic Stables", result: "$15,000 in Booked Weddings in 30 Days" },
              { venue: "Retreat at Evans Farms", result: "258 Leads in 60 Days" },
              { venue: "Red Barn Acres", result: "9 Weddings Booked in 4 Months" },
              { venue: "Irongate Wedding Venue", result: "131 Leads in 60 Days" },
            ].map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center text-xs tracking-wide text-[rgba(250,250,250,0.8)]"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                <span>{item.venue}</span>
                <span className="font-bold ml-1.5">{item.result}</span>
                <span className="mx-4 text-[rgba(250,250,250,0.35)] select-none">•</span>
              </span>
            ))}
          </div>
        </div>

        {/* NAV */}
        <header className="bg-white/75 backdrop-blur-md border-b border-white/20">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-10 py-3 lg:py-4">
            <span className="shrink-0 flex items-center">
              <Image
                src="/storyvenue-dark-logo.png"
                alt="StoryVenue"
                width={185}
                height={44}
                className="h-9 lg:h-11 w-auto object-contain"
                priority
              />
            </span>
            <PrimaryCTA label="Start Free Trial" size="md" />
          </nav>
        </header>
      </div>

      {/* ============================================================== */}
      {/* 1. HERO  — couple image setting mirrors /book-more-weddings      */}
      {/* ============================================================== */}
      <section className="relative bg-white overflow-hidden lg:pt-16 lg:pb-24">
        {/* ── MOBILE / TABLET: couple image fading into the white section ── */}
        <div
          className="lg:hidden relative"
          style={{
            height: "min(54vw, 220px)",
            minHeight: 170,
            maskImage:
              "linear-gradient(to bottom, black 0%, black 55%, rgba(0,0,0,0.6) 80%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 55%, rgba(0,0,0,0.6) 80%, transparent 100%)",
          }}
        >
          <Image
            src="/hero-wedding-couple.jpg"
            alt=""
            aria-hidden
            fill
            priority
            unoptimized
            placeholder="empty"
            className="object-cover"
            sizes="100vw"
            style={{ transform: "scaleX(-1)", objectPosition: "center 60%" }}
          />
        </div>

        {/* ── DESKTOP: couple image bleeding in from the right ── */}
        <div
          className="hidden lg:block absolute inset-0 pointer-events-none"
          style={{ transform: "translateX(8%)" }}
        >
          <Image
            src="/hero-wedding-couple.jpg"
            alt=""
            aria-hidden
            fill
            priority
            unoptimized
            placeholder="empty"
            className="object-cover"
            sizes="100vw"
            style={{ transform: "scaleX(-1)", objectPosition: "center center" }}
          />
        </div>
        {/* Left fade — desktop only */}
        <div
          className="hidden lg:block absolute inset-y-0 left-0 w-[50%] z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, white 0%, white 25%, rgba(255,255,255,0.92) 50%, rgba(255,255,255,0.4) 75%, transparent 100%)",
          }}
        />
        {/* Right fade — desktop only */}
        <div
          className="hidden lg:block absolute inset-y-0 right-0 w-[40%] z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, white 0%, white 15%, rgba(255,255,255,0.85) 45%, rgba(255,255,255,0.3) 75%, transparent 100%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 -mt-8 lg:mt-0 pb-12 lg:pb-0 grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left — copy */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <h1
              className="text-[32px] sm:text-[44px] md:text-[52px] lg:text-[58px] leading-[1.08] text-stone-900"
              style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
            >
              <span className="block">Start Booking More Brides</span>
              <span className="block" style={{ color: "var(--color-brand-gold)" }}>
                in 5 Minutes.
              </span>
            </h1>

            <p
              className="mt-4 sm:mt-5 text-[16px] sm:text-[19px] text-stone-700 leading-relaxed max-w-md lg:max-w-xl mx-auto lg:mx-0"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Stop losing brides to the venue that replied first.
            </p>

            <div className="mt-7 sm:mt-8 flex flex-col items-center lg:items-start">
              <PrimaryCTA />
              <p
                className="mt-3 text-[12px] sm:text-[13px] text-stone-500"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                Free for 14 days · Downgrade to free anytime
              </p>

              {/* Social proof */}
              <div className="mt-6 flex items-center justify-center lg:justify-start gap-3">
                <div className="flex -space-x-2.5 shrink-0">
                  {["/avatars/av1.jpg", "/avatars/av2.jpg", "/avatars/av3.jpg", "/avatars/av4.jpg", "/avatars/av5.jpg"].map((src, i) => (
                    <div key={i} className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white overflow-hidden" style={{ zIndex: 5 - i }}>
                      <Image src={src} alt="" fill unoptimized placeholder="empty" className="object-cover object-center" sizes="36px" />
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="#1c1917"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    ))}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5" style={{ fontFamily: "var(--font-open-sans)" }}>
                    Over 500+ Venues Served
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — phone mockup (desktop only; mobile uses the couple image) */}
          <div className="hidden lg:flex lg:col-span-5 justify-center lg:justify-end">
            <PhonePreview />
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. LOGO WALL                                                    */}
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
      {/* 3. PAIN                                                         */}
      {/* ============================================================== */}
      <section className="bg-stone-50/70 py-20 sm:py-28 border-b border-stone-200/60">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <h2
            className="text-[26px] sm:text-4xl md:text-5xl text-stone-900 leading-[1.15]"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Brides Are Looking For a Venue Like Yours.
            <br />
            So Why Are They{" "}
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
      {/* 4. AGITATE                                                      */}
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
      {/* 5. SOLUTION REVEAL                                              */}
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
                Meet the Bride Booking System
                <sup style={{ fontSize: "0.45em", verticalAlign: "super" }}>™</sup>.
              </h2>

              <div
                className="mt-8 space-y-4 text-stone-600 text-base sm:text-lg leading-relaxed"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                <p>
                  The complete system that turns bride inquiries into booked tours, built only for wedding venues.
                </p>
                <p>
                  It captures every bride who finds you, follows up in seconds, and keeps the conversation moving until she books. So you&apos;re always the venue that replied first.
                </p>
              </div>

              <div className="mt-8">
                <PrimaryCTA size="md" />
              </div>
            </div>

            {/* Right — dashboard mockup */}
            <div className="min-w-0 max-w-full overflow-hidden lg:max-w-none lg:overflow-visible lg:pr-4">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. MECHANISM                                                    */}
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
            Live in 5 Minutes. Working for You 24/7.
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
      {/* 7. CORE FEATURES                                                */}
      {/* ============================================================== */}
      <section className="bg-stone-50/70 py-20 sm:py-28 border-y border-stone-200/60">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <h2
            className="text-center text-3xl sm:text-4xl md:text-5xl text-stone-900 leading-[1.08]"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Everything You Need to Capture and Book More Brides. In One System.
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
                    {/* Phone */}
                    <div
                      className={`flex justify-center ${
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

                    {/* Copy */}
                    <div className={reverse ? "lg:order-1" : "lg:order-2"}>
                      <span
                        className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                        style={
                          elevated
                            ? { backgroundColor: "var(--color-brand-gold)" }
                            : { backgroundColor: "#1c1917" }
                        }
                      >
                        <Icon className="w-5 h-5" />
                      </span>
                      {elevated && (
                        <span
                          className="mt-4 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
                          style={{ backgroundColor: "var(--color-brand-gold)", fontFamily: "var(--font-open-sans)" }}
                        >
                          Your edge
                        </span>
                      )}
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
      {/* 8. PROPOSAL & PAYMENTS                                          */}
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
              Send Branded Proposals & Online Payments. With 0% Processing Fees.
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
      {/* 9. SOCIAL PROOF                                                 */}
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
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p
                  className="text-5xl sm:text-6xl text-white leading-none"
                  style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
                >
                  {value}
                </p>
                <p
                  className="mt-3 text-[13px] sm:text-sm text-white/60 leading-snug max-w-[200px] mx-auto"
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
      {/* 10. GUARANTEE                                                   */}
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
              Try It Free for 14 Days.
            </h2>
            <div
              className="mt-6 space-y-4 text-stone-600 text-base sm:text-lg leading-relaxed"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              <p className="lg:whitespace-nowrap">
                Start your 14-day free trial and use the entire Bride Booking System.
              </p>
              <p className="lg:whitespace-nowrap">
                Downgrade to the free plan anytime and keep your listing live.
              </p>
            </div>
            <div className="mt-8 flex justify-center">
              <PrimaryCTA />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 11. FAQ                                                         */}
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
            {FAQ_ITEMS.map((item, i) => (
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
      {/* 12. FINAL CTA                                                   */}
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
            Start Booking More Brides in 5 Minutes.
          </h2>
          <p
            className="mt-5 text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Set up your Bride Booking System, share your link, and start turning brides into booked tours. Free for 14 days. Downgrade anytime.
          </p>

          <div className="mt-10 flex justify-center">
            <a
              href={TRIAL_HREF}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-stone-900 font-semibold px-7 py-4 text-base shadow-[0_18px_45px_-12px_rgba(0,0,0,0.6)] hover:bg-stone-100 active:scale-[0.98] transition-all"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Start Your 14-Day Free Trial
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
          <p className="mt-5 text-[12px] text-white/50" style={{ fontFamily: "var(--font-open-sans)" }}>
            Free for 14 days · Downgrade to free anytime
          </p>
        </div>
      </section>

      <SiteFooter />

      {/* Scroll-to-top FAB (all devices) */}
      <ScrollToTop />

      {/* FOMO social-proof popup */}
      <FomoPopup signupHref={TRIAL_HREF} />
    </>
  );
}
