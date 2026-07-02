import Image from "next/image";
import type { Metadata, Viewport } from "next";
import SiteFooter from "@/components/SiteFooter";
import PhonePreview from "@/components/marketing/PhonePreview";
import ScrollToTop from "@/components/marketing/ScrollToTop";
import FomoPopup from "@/components/marketing/FomoPopup";
import FireBrideBookingLandingEvent from "@/components/marketing/FireBrideBookingLandingEvent";
import ExperimentTracker from "@/components/marketing/ExperimentTracker";
import HeroTrialCTA from "@/components/marketing/HeroTrialCTA";
import BrideBookingSections, { PrimaryCTA } from "@/components/marketing/BrideBookingSections";
import { getHeroSelection } from "@/lib/experiments";

const PAGE_KEY = "bride-booking-system";

// Rendered per request so the A/B bandit can pick the hero variant. The page is
// noindex (paid traffic only) so there's no SEO cost to dynamic rendering.
export const dynamic = "force-dynamic";

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
  robots: { index: false, follow: false },
};

/* -------------------------------------------------------------------- */
/*  Page                                                                  */
/* -------------------------------------------------------------------- */

export default async function BrideBookingSystemPage() {
  const hero = await getHeroSelection(PAGE_KEY);

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
            <PrimaryCTA href={TRIAL_HREF} label="Start Free Trial" size="md" />
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
              <span className="block">{hero.headline.line1}</span>
              {hero.headline.line2 && (
                <span className="block" style={{ color: "var(--color-brand-gold)" }}>
                  {hero.headline.line2}
                </span>
              )}
            </h1>

            <p
              className="mt-4 sm:mt-5 text-[16px] sm:text-[19px] text-stone-700 leading-relaxed max-w-md lg:max-w-xl mx-auto lg:mx-0"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              {hero.subheadline.content}
            </p>

            <div className="mt-7 sm:mt-8 flex flex-col items-center lg:items-start">
              <HeroTrialCTA
                href={TRIAL_HREF}
                label={hero.cta.content}
                page={PAGE_KEY}
                variantIds={hero.variantIds}
              />
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

      {/* Shared sales body — logo wall through final CTA */}
      <BrideBookingSections trialHref={TRIAL_HREF} />

      <SiteFooter />

      {/* Scroll-to-top FAB (all devices) */}
      <ScrollToTop />

      {/* FOMO social-proof popup */}
      <FomoPopup signupHref={TRIAL_HREF} />

      {/* Meta Pixel — ViewContent + BrideBookingSystemLanding custom event */}
      <FireBrideBookingLandingEvent />

      {/* A/B impression beacon for the hero variants shown this render */}
      <ExperimentTracker page={PAGE_KEY} variantIds={hero.variantIds} />
    </>
  );
}
