import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SearchBar from "@/components/search/SearchBar";
import VenueCard from "@/components/search/VenueCard";

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
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-12 py-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          StoryVenue
        </Link>
        <Link
          href="/signup"
          className="text-sm font-medium text-white/80 hover:text-white transition-colors"
        >
          List Your Venue
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="absolute inset-0 bg-stone-900">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900 via-stone-900/80 to-stone-900/60" />

        <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-8 pt-24 pb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
            Find Your Perfect{" "}
            <span className="text-stone-300">StoryVenue</span>
          </h1>
          <p className="text-xl text-stone-300 max-w-2xl mx-auto">
            Discover venues that match your vision, guest count, and budget
          </p>
          <SearchBar />
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
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-stone-900"
          >
            StoryVenue
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
