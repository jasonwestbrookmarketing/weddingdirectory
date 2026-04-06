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
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-12 py-6">
        <Link href="/" aria-label="StoryVenue home">
          <Image
            src="/storyvenue-light-logo.png"
            alt="StoryVenue"
            width={160}
            height={40}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>
        <Link
          href="/signup"
          className="text-sm font-medium text-white/90 hover:text-white transition-colors"
        >
          List Your Venue
        </Link>
      </nav>

      {/* Hero — cinematic video background */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">

        {/* Video layer */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80&auto=format&fit=crop"
        >
          {/*
            Mixkit free license — https://mixkit.co/license/#videoFree
            "Happy bride walking with her bouquet" – mixkit ID 40591
            "Just married couple" – mixkit ID 40599
          */}
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-happy-bride-walking-with-her-bouquet-40591-large.mp4"
            type="video/mp4"
          />
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-just-married-couple-40599-large.mp4"
            type="video/mp4"
          />
        </video>

        {/* Cinematic dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        {/* Subtle vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        <div className="relative z-10 w-full max-w-4xl mx-auto text-center space-y-7 pt-28 pb-20">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-white/60">
            Wedding Venue Discovery
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight drop-shadow-lg">
            Find Your Perfect{" "}
            <span className="italic font-light text-white/90">StoryVenue</span>
          </h1>
          <p className="text-lg md:text-xl text-white/75 max-w-xl mx-auto leading-relaxed">
            Discover venues that match your vision, guest count, and budget
          </p>
          <SearchBar />
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-60">
          <span className="text-white text-xs tracking-widest uppercase">
            Scroll
          </span>
          <div className="w-px h-8 bg-white/50 animate-pulse" />
        </div>
      </section>

      {/* Featured Venues */}
      {venues && venues.length > 0 && (
        <section className="py-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900 mb-12">
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
