import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SearchBar from "@/components/search/SearchBar";
import VenueCard from "@/components/search/VenueCard";
import SiteFooter from "@/components/SiteFooter";
import FomoPopup from "@/components/marketing/FomoPopup";

export const revalidate = 120;

const STORYPAY_URL = process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";

const TICKER_FALLBACK = [
  "White Pine Manor", "Red Barn Acres", "Atlantic Stables", "Arbor Venues",
  "Arete Event Center", "Waters Building", "Vista on the Docks", "Legacy Ranch Event Center",
  "Magnolia Wedding & Event Center", "Starlight Grove Events",
];

export default async function HomePage() {
  const supabase = await createClient();

  // Last 20 venue signups for the trust ticker — any plan, paid or free.
  const { data: tickerRows } = await supabase
    .from("venues")
    .select("name")
    .not("name", "is", null)
    .neq("is_demo", true)
    .order("created_at", { ascending: false })
    .limit(20);

  const tickerBase = (tickerRows ?? [])
    .map((r) => (r.name as string).trim())
    .filter(Boolean);

  // Need at least 10 names for a smooth loop; pad with fallbacks if needed.
  const tickerNames =
    tickerBase.length >= 10
      ? tickerBase
      : [...tickerBase, ...TICKER_FALLBACK].slice(0, Math.max(10, tickerBase.length));

  // Latest 20 venues to go live that have a cover image — shown in a 4×5 grid.
  // Venues without a photo are excluded so the grid always looks full and polished.
  const { data: rawVenues } = await supabase
    .from("venues")
    .select(
      "id, name, slug, location_full, location_city, location_state, cover_image_url, capacity_min, capacity_max, price_min, venue_type, directory_verified_status, directory_sponsored_status"
    )
    .eq("is_published", true)
    .neq("is_demo", true)
    .not("slug", "is", null)
    .not("cover_image_url", "is", null)
    .neq("cover_image_url", "")
    .order("created_at", { ascending: false })
    .limit(16);

  const venues = rawVenues ?? [];

  return (
    <>
      {/* Navigation — absolute over video. Three-column flex so the center
          link sits dead-center regardless of left/right widths. */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center px-6 md:px-12 py-6 gap-4">
        {/* Left — logo */}
        <div className="flex-1 flex items-center">
          <Link href="/" aria-label="StoryVenue home" className="shrink-0">
            <Image
              src="/storyvenue-light-logo.png"
              alt="StoryVenue"
              width={160}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Center spacer — keeps logo left and auth buttons right */}
        <div className="flex-1" />

        {/* Right — unified auth buttons. The dashboard's /login and /signup
            both have a Venue ↔ Couple toggle now, so one pair covers both
            audiences. We default to ?as=couple because this is the
            bride-facing directory. */}
        <div className="flex-1 flex items-center justify-end gap-2 shrink-0">
          <a
            href={`${STORYPAY_URL}/login?as=couple`}
            className="whitespace-nowrap rounded-full bg-white/10 border border-white/20 text-white px-4 py-2 text-sm font-medium hover:bg-white/20 active:scale-[0.98] transition-all backdrop-blur-sm"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Log in
          </a>
          <a
            href={`${STORYPAY_URL}/signup`}
            className="whitespace-nowrap rounded-full bg-white text-stone-900 px-4 py-2 text-sm font-semibold hover:bg-white/90 active:scale-[0.98] transition-all shadow-sm"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Sign up
          </a>
        </div>
      </nav>

      {/* Hero — cinematic video background */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">

        {/* Static hero image — always visible; focal point shifts right on
            mobile so the couple (center-right of the landscape frame) stays
            in frame on portrait screens. */}
        <Image
          src="/hero-wedding.jpg"
          alt="Elegant wedding venue"
          fill
          priority
          className="absolute inset-0 object-cover"
          style={{ objectPosition: "center center" }}
          sizes="100vw"
        />

        {/* Video layer — desktop/tablet only; autoplay is unreliable on
            mobile and the static image looks better in portrait anyway. */}
        <video
          className="absolute inset-0 w-full h-full object-cover hidden sm:block"
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-wedding.jpg"
        >
          {/* Mixkit free license — https://mixkit.co/license/#videoFree */}
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-happy-bride-walking-with-her-bouquet-40591-large.mp4"
            type="video/mp4"
          />
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-just-married-couple-40599-large.mp4"
            type="video/mp4"
          />
        </video>

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/70" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto text-center px-5 sm:px-8 pt-28 pb-24 sm:pt-32 sm:pb-28 flex flex-col items-center gap-5 sm:gap-6">

          {/* Main headline — "Find Your Perfect" smaller to let StoryVenue dominate */}
          <h1
            className="flex flex-col items-center gap-1 drop-shadow-lg"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            <span className="text-2xl sm:text-3xl md:text-4xl font-normal leading-tight tracking-tight text-white/90">
              Find Your Perfect
            </span>
            <em className="not-italic text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[1.05] tracking-tight text-white relative" style={{ fontFamily: "EditorsNote, serif", fontWeight: 300, fontStyle: "italic" }}>
              Wedding Venue
            </em>
          </h1>

          {/* Sub-headline */}
          <p
            className="text-sm sm:text-lg md:text-xl text-white/75 leading-relaxed font-light text-center max-w-xs sm:max-w-none px-2"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Discover venues that match your vision, guest count, and budget
          </p>

          {/* Search bar */}
          <div className="w-full mt-1 sm:mt-2">
            <SearchBar />
          </div>

          {/* Venue trust ticker — last 20 signups, any plan */}
          <div className="w-full mt-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_12%,white_88%,transparent)]">
            <div className="flex gap-12 animate-[ticker_120s_linear_infinite] whitespace-nowrap w-max">
              {[...tickerNames, ...tickerNames].map((venueName, i) => (
                <span
                  key={i}
                  className="text-xs sm:text-sm font-semibold text-white/40 tracking-widest uppercase shrink-0"
                  style={{ fontFamily: "var(--font-open-sans)" }}
                >
                  {venueName}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-50">
          <span
            className="text-white text-[10px] tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Scroll
          </span>
          <div className="w-px h-6 sm:h-8 bg-white/60 animate-pulse" />
        </div>
      </section>

      {/* Latest 20 live venues — 4 across, 5 rows */}
      {venues && venues.length > 0 && (
        <section className="py-20 px-6 md:px-12">
          <div className="max-w-screen-xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-normal tracking-tight text-stone-900 mb-10"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Newest Venues
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {venues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
      <FomoPopup signupHref={`${STORYPAY_URL}/signup`} />
    </>
  );
}
