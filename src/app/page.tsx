import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SearchBar from "@/components/search/SearchBar";
import VenueCard from "@/components/search/VenueCard";

export const revalidate = 120;

export default async function HomePage() {
  const supabase = await createClient();
  const { data: venues } = await supabase
    .from("venues")
    .select(
      "id, name, slug, location_full, cover_image_url, capacity_min, capacity_max, price_min, venue_type"
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <>
      {/* Navigation — absolute over video */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-12 py-6 gap-4">
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

        {/* Center links */}
        <div
          className="hidden sm:flex items-center gap-6 md:gap-8"
          style={{ fontFamily: "var(--font-open-sans)" }}
        >
          <a
            href="https://storypay.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            StoryPay
          </a>
          <a
            href="https://storyvenuemarketing.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            StoryVenue Marketing
          </a>
        </div>

        <Link
          href="/signup"
          className="shrink-0 text-sm font-medium text-white/90 hover:text-white transition-colors"
          style={{ fontFamily: "var(--font-open-sans)" }}
        >
          List Your Venue
        </Link>
      </nav>

      {/* Hero — cinematic video background */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">

        {/* Video layer */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80&auto=format&fit=crop"
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

          {/* Eyebrow */}
          <p
            className="text-xs sm:text-sm font-medium tracking-[0.22em] uppercase text-white/55"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Wedding Venue Discovery
          </p>

          {/* Main headline — Playfair Display thin (400) */}
          <h1
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[1.1] tracking-tight text-white drop-shadow-lg"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Find Your Perfect{" "}
            <em className="not-italic" style={{ fontStyle: "italic" }}>
              StoryVenue
            </em>
          </h1>

          {/* Sub-headline — Open Sans */}
          <p
            className="text-base sm:text-lg md:text-xl text-white/75 max-w-lg sm:max-w-xl mx-auto leading-relaxed font-light"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Discover venues that match your vision, guest count, and budget
          </p>

          {/* Search bar */}
          <div className="w-full max-w-xl mt-1 sm:mt-2">
            <SearchBar />
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

      {/* Footer */}
      <footer className="bg-stone-100 py-12 px-6 md:px-12 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" aria-label="StoryVenue home">
            <Image
              src="/storyvenue-dark-logo.png"
              alt="StoryVenue"
              width={140}
              height={36}
              className="h-8 w-auto object-contain"
            />
          </Link>
          <p className="text-sm text-stone-500">
            &copy; {new Date().getFullYear()} StoryVenue. All rights reserved.
          </p>
          <Link
            href="/signup"
            className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
          >
            List Your Venue
          </Link>
        </div>
      </footer>
    </>
  );
}
