"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { BUDGET_RANGES } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import SiteFooter from "@/components/SiteFooter";
import FilterBar, { type Filters } from "@/components/search/FilterBar";
import VenueCard from "@/components/search/VenueCard";
import type { Venue } from "@/types/database";

const STORYPAY_URL =
  process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isInitialMount = useRef(true);

  const [filters, setFilters] = useState<Filters>({
    location: searchParams.get("location") || "",
    guests: searchParams.get("guests") || "",
    budget: searchParams.get("budget") || "",
    style: searchParams.get("style") || "",
    indoor_outdoor: searchParams.get("indoor_outdoor") || "",
  });

  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVenues = useCallback(async (f: Filters) => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase.from("venues").select("*").eq("is_published", true);

    if (f.location) {
      query = query.or(
        `location_full.ilike.%${f.location}%,location_city.ilike.%${f.location}%`
      );
    }
    if (f.guests) {
      const g = Number(f.guests);
      query = query.lte("capacity_min", g).gte("capacity_max", g);
    }
    if (f.budget) {
      const range = BUDGET_RANGES.find((r) => r.value === f.budget);
      if (range) {
        query = query.lte("price_min", range.max).gte("price_max", range.min);
      }
    }
    if (f.style) {
      query = query.eq("venue_type", f.style);
    }
    if (f.indoor_outdoor) {
      query = query.eq("indoor_outdoor", f.indoor_outdoor);
    }

    const { data } = await query.order("created_at", { ascending: false });
    // Sponsored first, then verified, then the server's recency order. Keeps
    // paying-customer listings at the top regardless of how a visitor filters.
    const sorted = (data ?? []).slice().sort((a, b) => {
      const sp =
        Number(b.directory_sponsored_status === "approved") -
        Number(a.directory_sponsored_status === "approved");
      if (sp !== 0) return sp;
      return (
        Number(b.directory_verified_status === "approved") -
        Number(a.directory_verified_status === "approved")
      );
    });
    setVenues(sorted);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchVenues(filters);
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params.set(key, val);
      });
      router.replace(`/search?${params.toString()}`, { scroll: false });
      trackEvent("search_filter_applied", { ...filters });
      fetchVenues(filters);
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <>
      <FilterBar filters={filters} onFilterChange={setFilters} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <p className="text-sm text-stone-500 mb-6">
          {loading
            ? "Searching..."
            : `${venues.length} venue${venues.length !== 1 ? "s" : ""} found`}
        </p>

        {!loading && venues.length === 0 ? (
          <div className="text-center py-24">
            <Search className="h-12 w-12 text-stone-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-stone-900 mb-2">
              No venues found
            </h2>
            <p className="text-stone-500">
              Try adjusting your filters to see more results
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default function SearchPage() {
  return (
    <>
      <nav className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 gap-3">
          <Link href="/" aria-label="StoryVenue home" className="shrink-0">
            <Image
              src="/storyvenue-dark-logo.png"
              alt="StoryVenue"
              width={140}
              height={36}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
          {/* Unified auth: the dashboard handles Venue↔Couple via a toggle
              on /login and /signup, so one pair of buttons serves both. */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <a
              href={`${STORYPAY_URL}/login?as=couple`}
              className="hidden sm:inline text-sm font-medium text-stone-600 hover:text-stone-900 px-3 py-2 rounded-xl transition-colors"
            >
              Log in
            </a>
            <a
              href={`${STORYPAY_URL}/signup?as=couple`}
              className="text-sm font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 sm:px-4 py-2 rounded-xl transition-colors"
            >
              Sign up
            </a>
          </div>
        </div>
      </nav>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin h-8 w-8 border-2 border-stone-300 border-t-stone-900 rounded-full" />
          </div>
        }
      >
        <SearchContent />
      </Suspense>
      <SiteFooter />
    </>
  );
}
