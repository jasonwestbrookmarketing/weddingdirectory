import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import VenueCard from "@/components/search/VenueCard";
import SiteFooter from "@/components/SiteFooter";
import PhoneMockup from "@/components/marketing/PhoneMockup";

export const revalidate = 120;

const STORYPAY_URL = process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";

const TICKER_ITEMS = [
  { venue: "Waterloo Farms", result: "2 Weddings Booked in 7 Days" },
  { venue: "Atlantic Stables", result: "$15,000 in Booked Weddings in 30 Days" },
  { venue: "Retreat at Evans Farms", result: "258 Leads in 60 Days" },
  { venue: "Red Barn Acres", result: "9 Weddings Booked in 4 Months" },
  { venue: "Irongate Wedding Venue", result: "14 Inquiries in First Week" },
  { venue: "The White Barn", result: "$8,400 Booked in 2 Weeks" },
  { venue: "Waterloo Farms", result: "2 Weddings Booked in 7 Days" },
  { venue: "Atlantic Stables", result: "$15,000 in Booked Weddings in 30 Days" },
  { venue: "Retreat at Evans Farms", result: "258 Leads in 60 Days" },
  { venue: "Red Barn Acres", result: "9 Weddings Booked in 4 Months" },
  { venue: "Irongate Wedding Venue", result: "14 Inquiries in First Week" },
  { venue: "The White Barn", result: "$8,400 Booked in 2 Weeks" },
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data: rawVenues } = await supabase
    .from("venues")
    .select(
      "id, name, slug, location_full, cover_image_url, capacity_min, capacity_max, price_min, venue_type, directory_verified_status, directory_sponsored_status"
    )
    .eq("is_published", true)
    .neq("is_demo", true)
    .order("created_at", { ascending: false })
    .limit(24);

  const venues = (rawVenues ?? [])
    .map((v) => ({
      ...v,
      _sp: v.directory_sponsored_status === "approved" ? 1 : 0,
      _vf: v.directory_verified_status === "approved" ? 1 : 0,
    }))
    .sort((a, b) => b._sp - a._sp || b._vf - a._vf)
    .slice(0, 6);

  return (
    <>
      {/* Social proof ticker */}
      <div className="bg-stone-900 overflow-hidden py-2.5">
        <div
          className="flex whitespace-nowrap w-max animate-[ticker_50s_linear_infinite]"
          style={{ gap: "3rem" }}
        >
          {TICKER_ITEMS.map((item, i) => (
            <span
              key={i}
              className="text-xs text-white/70 shrink-0"
              style={{ fontFamily: "var(--font-open-sans)" }}
            >
              <span className="font-semibold text-white">{item.venue}</span>
              {" "}<span className="text-white/40 mx-1">·</span>{" "}
              {item.result}
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="relative min-h-[100svh] overflow-hidden bg-white">
        {/* Background image — bright white barn, pulled right so couple shows beside mockup */}
        <Image
          src="/hero-venue-bg.jpg"
          alt="Beautiful wedding venue interior"
          fill
          priority
          className="absolute inset-0 object-cover"
          style={{ objectPosition: "right center" }}
          sizes="100vw"
        />

        {/* White gradient — opaque on left for text, dissolves right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.97) 32%, rgba(255,255,255,0.80) 52%, rgba(255,255,255,0.25) 72%, rgba(255,255,255,0) 100%)",
          }}
        />

        {/* Nav */}
        <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-12 py-5">
          <Link href="/" aria-label="StoryVenue home" className="shrink-0">
            <Image
              src="/storyvenue-dark-logo.png"
              alt="StoryVenue"
              width={160}
              height={40}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>

          <a
            href={`${STORYPAY_URL}/signup?as=venue`}
            className="rounded-full bg-stone-900 text-white px-5 py-2.5 text-sm font-semibold hover:bg-stone-800 active:scale-[0.98] transition-all shadow-sm inline-flex items-center gap-1.5"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Start Free Trial
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </nav>

        {/* Two-column hero content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 min-h-[100svh] flex items-center">
          <div className="w-full flex flex-col lg:flex-row items-center gap-10 lg:gap-8 pt-28 pb-16 lg:pt-20 lg:pb-12">

            {/* Left — copy */}
            <div className="flex-1 max-w-[560px]">
              <h1
                className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-normal leading-[1.1] tracking-tight text-stone-900 mb-6"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Fully Book Your Wedding Venue Without Empty Weekends.
              </h1>

              <p
                className="text-base sm:text-[1.05rem] text-stone-600 leading-relaxed mb-8 max-w-lg"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                StoryVenue combines a wedding venue directory, booking system, CRM, payments,
                proposals, Meta ads, concierge follow-up, and AI intelligence into one simple
                platform built to help venues find more couples, host more tours, and book more
                weddings.
              </p>

              {/* Email CTA */}
              <form
                action={`${STORYPAY_URL}/signup`}
                method="get"
                className="flex flex-col sm:flex-row gap-2 max-w-md"
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Start your 14-day free trial"
                  className="flex-1 rounded-full border border-stone-200 bg-white px-5 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/20 shadow-sm"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                />
                <button
                  type="submit"
                  className="rounded-full bg-stone-900 text-white px-6 py-3 text-sm font-semibold hover:bg-stone-800 active:scale-[0.98] transition-all shadow-sm whitespace-nowrap inline-flex items-center justify-center gap-1.5"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  Get Started
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </form>

              <p
                className="text-xs text-stone-400 mt-3"
                style={{ fontFamily: "var(--font-open-sans)" }}
              >
                No contract. No down payment. No cancelation fees.
              </p>
            </div>

            {/* Right — phone mockup */}
            <div className="flex-1 flex items-center justify-center lg:justify-end">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Venues */}
      {venues && venues.length > 0 && (
        <section className="py-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-normal tracking-tight text-stone-900 mb-12"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Featured Venues
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {venues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </>
  );
}
