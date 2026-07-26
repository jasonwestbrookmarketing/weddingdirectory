import Image from "next/image";
import type { Metadata, Viewport } from "next";
import SiteFooter from "@/components/SiteFooter";
import PhonePreview from "@/components/marketing/PhonePreview";
import ScrollToTop from "@/components/marketing/ScrollToTop";
import FomoPopup from "@/components/marketing/FomoPopup";
import TrackedFreeListingCTA from "@/components/marketing/TrackedFreeListingCTA";
import FireFreeListingLandingEvent from "@/components/marketing/FireFreeListingLandingEvent";
import FreeListingVenueInput from "@/components/marketing/FreeListingVenueInput";

const STORYPAY_URL =
  process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";

const LISTING_HREF = `${STORYPAY_URL}/signup?plan=venue-free&utm_source=meta&utm_campaign=free-listing`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://storyvenue.com"),
  title:
    "Claim Your Free Venue Listing — The Fastest Growing Wedding Directory | StoryVenue",
  description:
    "List your venue free and run it all from one login. Pricing guide, lead inbox, proposals, payments, and calendar. Live in five minutes.",
  alternates: { canonical: "/free-listing" },
  robots: { index: false, follow: false },
};

// ── Ticker ───────────────────────────────────────────────────────────────────
const TICKER_VENUES = [
  "Meadow Ridge Estate",
  "Waterloo Farms",
  "Atlantic Stables",
  "Retreat at Evans Farms",
  "Red Barn Acres",
  "Irongate Venue",
];

// ── Logos ────────────────────────────────────────────────────────────────────
const LOGOS = [
  { src: "/logos/arbor.png", alt: "Arbor at the Port", h: 36 },
  { src: "/logos/vista.png", alt: "Vista on the Docks", h: 34 },
  { src: "/logos/bogart.png", alt: "Bogart House", h: 52 },
  { src: "/logos/pinetree.png", alt: "The Pinetree", h: 44 },
  { src: "/logos/waterloo.png", alt: "Waterloo Farms", h: 48 },
  { src: "/logos/white-pine.png", alt: "White Pine Manor", h: 48 },
];

// ── Feature cards ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
    pillLabel: "LISTING LIVE",
    pillDetail: "Red Barn Acres",
    title: "Venue Listing",
    description: "Gives you one link that shows off everything your venue offers.",
  },
  {
    pillLabel: "GUIDE SENT",
    pillDetail: "Pricing delivered",
    title: "Pricing Guide",
    description: "Answers the pricing question for you in seconds, not days.",
  },
  {
    pillLabel: "NEW LEAD",
    pillDetail: "Jonathan B.",
    title: "Lead Inbox",
    description: "Puts every inquiry in front of you in one place.",
  },
  {
    pillLabel: "PROPOSAL SENT",
    pillDetail: "Sophie + Will",
    title: "Proposals",
    description: "Go out the same day, built once and reused.",
  },
  {
    pillLabel: "DEPOSIT PAID",
    pillDetail: "$2,500 received",
    title: "Payments",
    description: "Land in your account on the spot, no chasing.",
  },
  {
    pillLabel: "TOUR BOOKED",
    pillDetail: "Sat, Nov 8",
    title: "Booking Calendar",
    description: "Shows every tour, hold, and booking on one screen.",
  },
];

// ── How It Works steps ────────────────────────────────────────────────────────
const STEPS = [
  {
    number: "01",
    title: "Find your venue",
    description:
      "Search your Google Business Profile and we pull in your photos, address, and details automatically.",
  },
  {
    number: "02",
    title: "Review and publish",
    description: "Add your finishing touches and go live.",
  },
  {
    number: "03",
    title: "Start taking inquiries",
    description:
      "Send your link anywhere brides find you and every response lands in your inbox.",
  },
];

// ── Feature card browser placeholder ─────────────────────────────────────────
function FeatureCard({
  pillLabel,
  pillDetail,
  title,
  description,
}: (typeof FEATURES)[number]) {
  return (
    <div className="rounded-2xl border border-stone-200 overflow-hidden bg-white shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] flex flex-col">
      {/* Fake browser chrome */}
      <div className="flex items-center gap-1.5 bg-stone-100 border-b border-stone-200 px-3 py-2 shrink-0">
        <span className="w-2 h-2 rounded-full bg-[#ff5f56]" />
        <span className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
        <span className="w-2 h-2 rounded-full bg-[#27c93f]" />
        <div
          className="ml-2 flex-1 rounded-md bg-white border border-stone-200 px-2 py-[3px] text-[9px] text-stone-400"
          style={{ fontFamily: "ui-monospace, monospace" }}
        >
          app.storyvenue.com
        </div>
      </div>

      {/* Placeholder screenshot area */}
      <div className="relative bg-stone-50 h-[148px]">
        <div className="p-4 space-y-3">
          <div className="h-2 rounded-full bg-stone-200 w-3/4" />
          <div className="h-2 rounded-full bg-stone-200 w-full" />
          <div className="h-2 rounded-full bg-stone-200 w-1/2" />
          <div className="mt-4 h-2 rounded-full bg-stone-200 w-full" />
          <div className="h-2 rounded-full bg-stone-200 w-2/3" />
        </div>

        {/* Status pill */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-sm border border-stone-100">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
          </span>
          <span
            className="text-[8px] font-bold uppercase tracking-wider text-stone-400"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            {pillLabel}
          </span>
          <span
            className="text-[10px] font-semibold text-stone-700"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            {pillDetail}
          </span>
        </div>
      </div>

      {/* Card text */}
      <div className="px-4 pt-3.5 pb-4 border-t border-stone-100 flex-1">
        <h3
          className="text-[15px] font-bold text-stone-900"
          style={{ fontFamily: "var(--font-open-sans)" }}
        >
          {title}
        </h3>
        <p
          className="mt-1 text-[13px] text-stone-500 leading-snug"
          style={{ fontFamily: "var(--font-open-sans)" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function FreeListingPage() {
  return (
    <>
      <FireFreeListingLandingEvent />
      <ScrollToTop />

      {/* ================================================================ */}
      {/* STICKY SHELL — ticker + nav                                       */}
      {/* ================================================================ */}
      <div className="sticky top-0 z-40">
        {/* TICKER */}
        <div className="w-full overflow-hidden shrink-0 py-2 bg-[#1c1c1c]">
          <div className="flex animate-[announcement-ticker_28s_linear_infinite] lg:animate-[announcement-ticker_55s_linear_infinite] whitespace-nowrap">
            {[...TICKER_VENUES, ...TICKER_VENUES, ...TICKER_VENUES].map(
              (venue, i) => (
                <span
                  key={i}
                  className="inline-flex items-center text-xs tracking-wide text-[rgba(250,250,250,0.8)]"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  <span className="font-semibold">{venue}</span>
                  <span className="font-normal ml-1.5 text-white/60">
                    claimed their listing
                  </span>
                  <span className="mx-5 text-[rgba(250,250,250,0.3)] select-none">
                    ·
                  </span>
                </span>
              )
            )}
          </div>
        </div>

        {/* NAV */}
        <header className="bg-white/80 backdrop-blur-md border-b border-stone-100">
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
            <TrackedFreeListingCTA
              href={LISTING_HREF}
              label="Claim Your Free Listing"
              size="md"
            />
          </nav>
        </header>
      </div>

      {/* ================================================================ */}
      {/* HERO                                                              */}
      {/* ================================================================ */}
      <section className="relative bg-white overflow-hidden pt-2 lg:pt-16 lg:pb-24">
        {/* Mobile couple image */}
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

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 -mt-6 lg:mt-0 pb-14 lg:pb-0 grid lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          {/* ── Left: copy ─────────────────────────────────────────────── */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Eyebrow */}
            <p
              className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-4"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              For Wedding Venue Owners
            </p>

            {/* Headline */}
            <h1
              className="text-[32px] sm:text-[44px] md:text-[52px] lg:text-[56px] leading-[1.08] text-stone-900"
              style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
            >
              Claim Your Free Venue Listing
            </h1>

            {/* Subhead */}
            <p
              className="mt-4 sm:mt-5 text-[16px] sm:text-[18px] text-stone-600 leading-relaxed max-w-lg mx-auto lg:mx-0"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              Run your whole venue from one login:{" "}
              <strong className="font-semibold text-stone-800">
                pricing guide, lead inbox, proposals, payments, calendar.
              </strong>
            </p>

            {/* Input pill CTA */}
            <div className="mt-7 sm:mt-8 flex flex-col items-center lg:items-start gap-3">
              <FreeListingVenueInput href={LISTING_HREF} />

              {/* Microcopy */}
              <p
                className="text-[12px] sm:text-[13px] text-stone-500 text-center lg:text-left"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                <strong className="font-semibold text-stone-700">
                  Live in five minutes.
                </strong>{" "}
                Pulls straight from your Google Business Profile. No website
                changes, no contract.
              </p>

              {/* Avatar row */}
              <div className="mt-3 flex items-center justify-center lg:justify-start gap-3">
                <div className="flex -space-x-2.5 shrink-0">
                  {[
                    "/avatars/av1.jpg",
                    "/avatars/av2.jpg",
                    "/avatars/av3.jpg",
                    "/avatars/av4.jpg",
                    "/avatars/av5.jpg",
                  ].map((src, i) => (
                    <div
                      key={i}
                      className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white overflow-hidden"
                      style={{ zIndex: 5 - i }}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        unoptimized
                        placeholder="empty"
                        className="object-cover object-center"
                        sizes="36px"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="#1c1917"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p
                    className="text-[11px] text-stone-500 mt-0.5"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    60+ venues have claimed their listing
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: phone + two floating cards ──────────────────────── */}
          <div className="hidden lg:flex lg:col-span-5 justify-center lg:justify-end">
            <div className="relative">
              <PhonePreview
                screenshotSrc="/phone-directory-listing.png"
                badgeLabel="WEEKEND BOOKED"
                badgeDetail="Oct 12, 2026"
              />

              {/* Second floating card — NEW INQUIRY */}
              <div className="absolute -bottom-4 -right-8 z-20 rounded-2xl bg-white border border-stone-200 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.22)] px-3.5 py-2.5 flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
                  </span>
                </span>
                <div>
                  <p
                    className="text-[9px] font-semibold tracking-[0.14em] uppercase text-stone-400"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    New Inquiry
                  </p>
                  <p
                    className="text-[12px] font-bold text-stone-900 leading-none mt-0.5"
                    style={{ fontFamily: "var(--font-open-sans)" }}
                  >
                    Meadow Ridge · just now
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* LOGO STRIP                                                        */}
      {/* ================================================================ */}
      <section className="bg-stone-50 border-y border-stone-100 py-10 sm:py-12">
        <div className="max-w-5xl mx-auto px-6">
          <p
            className="text-center text-[10px] font-bold uppercase tracking-[0.22em] text-stone-400 mb-7"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Trusted by venues nationwide
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
            {LOGOS.map(({ src, alt, h }) => (
              <Image
                key={src}
                src={src}
                alt={alt}
                width={160}
                height={h}
                unoptimized
                placeholder="empty"
                className="object-contain opacity-60 hover:opacity-90 transition-opacity"
                style={{ height: h, width: "auto" }}
              />
            ))}
          </div>

          <p
            className="text-center text-[11px] text-stone-400 mt-7"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            <strong className="font-semibold text-stone-500">
              Verified venues only
            </strong>{" "}
            · 14 years in the wedding venue industry
          </p>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FEATURES                                                          */}
      {/* ================================================================ */}
      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6">
          {/* Section header */}
          <div className="text-center mb-12 sm:mb-16">
            <p
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-3"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              The Software Behind Your Listing
            </p>
            <h2
              className="text-[30px] sm:text-[40px] md:text-[46px] text-stone-900 leading-[1.1]"
              style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
            >
              Everything You Need To Run Your Venue In One Place
            </h2>
          </div>

          {/* 3-column grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* HOW IT WORKS                                                      */}
      {/* ================================================================ */}
      <section className="bg-stone-50 border-y border-stone-100 py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* Section header */}
          <div className="text-center mb-12 sm:mb-14">
            <p
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-3"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              How It Works
            </p>
            <h2
              className="text-[30px] sm:text-[42px] text-stone-900 leading-[1.1]"
              style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
            >
              Live In Five Minutes
            </h2>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-200">
            {STEPS.map((step, idx) => (
              <div
                key={step.number}
                className={`px-6 py-8 md:py-0 ${idx === 0 ? "md:pl-0" : ""} ${idx === STEPS.length - 1 ? "md:pr-0" : ""}`}
              >
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-300"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  Step {step.number}
                </span>
                <h3
                  className="mt-3 text-[20px] sm:text-[22px] text-stone-900 leading-snug"
                  style={{
                    fontFamily: "EditorsNote, serif",
                    fontWeight: 300,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="mt-3 text-[14px] text-stone-500 leading-relaxed"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FINAL CTA                                                         */}
      {/* ================================================================ */}
      <section className="bg-stone-900 py-20 sm:py-28">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2
            className="text-[34px] sm:text-[48px] text-white leading-[1.08]"
            style={{ fontFamily: "EditorsNote, serif", fontWeight: 300 }}
          >
            Claim Your Free Listing
          </h2>
          <p
            className="mt-4 text-[15px] sm:text-[17px] text-white/60 leading-relaxed"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Your listing and the software behind it, live in five minutes.
          </p>
          <div className="mt-8 flex justify-center">
            <TrackedFreeListingCTA
              href={LISTING_HREF}
              label="Claim My Free Listing"
              variant="light"
              size="lg"
            />
          </div>
          <p
            className="mt-5 text-[12px] text-white/40"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            <strong className="font-semibold text-white/60">
              Free to claim.
            </strong>{" "}
            Every listing is verified, so the platform stays trusted.
          </p>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FOOTER                                                            */}
      {/* ================================================================ */}
      <SiteFooter />

      <FomoPopup signupHref={LISTING_HREF} />
    </>
  );
}
