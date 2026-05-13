"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { BUDGET_RANGES } from "@/lib/constants";
import SiteFooter from "@/components/SiteFooter";
import FilterPanel, { type SearchFilters, DEFAULT_FILTERS } from "@/components/search/FilterPanel";
import VenueCard from "@/components/search/VenueCard";
import type { Venue } from "@/types/database";

const VenueMap = dynamic(() => import("@/components/search/VenueMap"), { ssr: false });

const STORYPAY_URL = process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";
const PAGE_SIZE = 12;

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isInitialMount = useRef(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    location: searchParams.get("location") || "",
    budget: searchParams.get("budget") || "",
    guests: searchParams.get("guests") || "",
    style: searchParams.get("style") || "",
    indoor_outdoor: searchParams.get("indoor_outdoor") || "",
    amenities: searchParams.get("amenities")
      ? searchParams.get("amenities")!.split(",")
      : [],
  });

  // Pending filters (applied only on "Apply" click)
  const [pendingFilters, setPendingFilters] = useState<SearchFilters>(filters);


  const [allVenues, setAllVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"newest" | "price_asc" | "price_desc">("newest");

  const fetchVenues = useCallback(async (f: SearchFilters) => {
    setLoading(true);
    const supabase = createClient();

    let query = supabase
      .from("venues")
      .select("*")
      .eq("is_published", true)
      .neq("is_demo", true);

    if (f.location) {
      query = query.or(
        `location_full.ilike.%${f.location}%,location_city.ilike.%${f.location}%,location_state.ilike.%${f.location}%`
      );
    }
    if (f.guests) {
      const g = Number(f.guests);
      query = query.gte("capacity_max", g);
    }
    if (f.budget) {
      const range = BUDGET_RANGES.find((r) => r.value === f.budget);
      if (range) {
        query = query.lte("price_min", range.max).gte("price_max", range.min);
      }
    }
    if (f.style) query = query.eq("venue_type", f.style);
    if (f.indoor_outdoor) query = query.eq("indoor_outdoor", f.indoor_outdoor);
    if (f.amenities.length > 0) {
      query = query.contains("amenities", f.amenities);
    }

    const { data } = await query.order("created_at", { ascending: false }).limit(200);

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

    setAllVenues(sorted);
    setPage(1);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchVenues(filters);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = () => {
    setFilters(pendingFilters);
    setSidebarOpen(false);
    const params = new URLSearchParams();
    Object.entries(pendingFilters).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        if (val.length > 0) params.set(key, val.join(","));
      } else if (val) {
        params.set(key, val);
      }
    });
    router.replace(`/search?${params.toString()}`, { scroll: false });
    trackEvent("search_filter_applied", { ...pendingFilters });
    fetchVenues(pendingFilters);
  };

  const sortedVenues = [...allVenues].sort((a, b) => {
    if (sortOrder === "price_asc") return (a.price_min ?? 0) - (b.price_min ?? 0);
    if (sortOrder === "price_desc") return (b.price_min ?? 0) - (a.price_min ?? 0);
    return 0; // "newest" order already set by fetchVenues
  });

  const totalPages = Math.ceil(sortedVenues.length / PAGE_SIZE);
  const pagedVenues = sortedVenues.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilterCount = [
    pendingFilters.location,
    pendingFilters.budget,
    pendingFilters.guests,
    pendingFilters.style,
    pendingFilters.indoor_outdoor,
  ].filter(Boolean).length + pendingFilters.amenities.length;

  return (
    <>
    <div className="max-w-screen-xl mx-auto px-6 py-6 flex gap-10 min-h-[calc(100vh-64px)]">

      {/* ── Sidebar (desktop) ── */}
      <div className="hidden lg:block shrink-0">
        <FilterPanel
          filters={pendingFilters}
          onChange={setPendingFilters}
          onApply={applyFilters}
          resultCount={allVenues.length}
          loading={loading}
        />
      </div>

      {/* ── Mobile sidebar drawer ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col w-80 max-w-full bg-white h-full overflow-y-auto z-10 px-5">
            <div className="flex items-center justify-between py-4 border-b border-stone-200 mb-2">
              <span className="font-bold text-stone-900 text-lg">Filters</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5 text-stone-500" />
              </button>
            </div>
            <FilterPanel
              filters={pendingFilters}
              onChange={setPendingFilters}
              onApply={() => { applyFilters(); setSidebarOpen(false); }}
              resultCount={allVenues.length}
              loading={loading}
            />
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-5">

        {/* Results row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile filter trigger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 text-sm font-medium text-stone-700 border border-stone-200 rounded-lg px-3 py-2 hover:border-stone-400 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-stone-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <h1 className="text-base sm:text-xl font-bold text-stone-900">
              {loading ? (
                <span className="text-stone-400 text-sm font-normal">Searching…</span>
              ) : (
                `${allVenues.length} Result${allVenues.length !== 1 ? "s" : ""}`
              )}
            </h1>
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => { setSortOrder(e.target.value as typeof sortOrder); setPage(1); }}
              className="text-sm text-stone-700 border border-stone-200 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-stone-400 bg-white appearance-none cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor"><path d="M6 8L1 3h10z"/></svg>
            </div>
          </div>
        </div>

        {/* Map card */}
        <VenueMap venues={allVenues} />

        {/* Venue grid */}
        {!loading && allVenues.length === 0 ? (
          <div className="text-center py-24">
            <Search className="h-12 w-12 text-stone-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-stone-900 mb-2">No venues found</h2>
            <p className="text-stone-500">Try adjusting your filters to see more results</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-8">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[4/3] bg-stone-100 rounded-xl mb-3" />
                      <div className="h-4 bg-stone-100 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-stone-100 rounded w-1/2" />
                    </div>
                  ))
                : pagedVenues.map((venue) => (
                    <VenueCard key={venue.id} venue={venue} />
                  ))}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm border border-stone-200 rounded-lg text-stone-700 hover:border-stone-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && typeof arr[idx - 1] === "number" && (p as number) - (arr[idx - 1] as number) > 1) acc.push("…");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "…" ? (
                      <span key={`ellipsis-${i}`} className="px-2 text-stone-400">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => { setPage(p as number); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className={`w-9 h-9 text-sm rounded-lg border transition-colors ${
                          page === p ? "bg-stone-900 text-white border-stone-900" : "border-stone-200 text-stone-700 hover:border-stone-400"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm border border-stone-200 rounded-lg text-stone-700 hover:border-stone-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
    <div className="h-[250px]" aria-hidden="true" />
    <SiteFooter />
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Nav */}
      <nav className="bg-white border-b border-stone-200 h-16 flex items-center shrink-0 z-30">
        <div className="w-full max-w-screen-2xl mx-auto flex items-center justify-between px-6 gap-3">
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
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-2 border-stone-300 border-t-stone-900 rounded-full" />
          </div>
        }
      >
        <SearchContent />
      </Suspense>
    </div>
  );
}
