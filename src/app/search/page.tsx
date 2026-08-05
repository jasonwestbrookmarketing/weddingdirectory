"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ANON_VENUE_SELECT } from "@/types/database";
import { trackEvent } from "@/lib/analytics";
import { BUDGET_RANGES } from "@/lib/constants";
import { venueHasFeature } from "@/lib/venue-features";
import { locationHaystack } from "@/lib/format-location";
import SiteFooter from "@/components/SiteFooter";
import FilterPanel, { type SearchFilters, DEFAULT_FILTERS } from "@/components/search/FilterPanel";
import VenueCard from "@/components/search/VenueCard";
import type { Venue } from "@/types/database";

const VenueMap = dynamic(() => import("@/components/search/VenueMap"), { ssr: false });

const STORYPAY_URL = process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";
const PAGE_SIZE = 12;

/** How far from a searched zip code a venue can be and still show up. */
const ZIP_RADIUS_MILES = 50;

const zipCache = new Map<string, { lat: number; lng: number } | null>();

/** Zip → coordinates via Nominatim (same provider as the venue maps). */
async function geocodeZip(zip: string): Promise<{ lat: number; lng: number } | null> {
  if (zipCache.has(zip)) return zipCache.get(zip)!;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${zip}&country=us&format=json&limit=1`,
      { headers: { Accept: "application/json" } }
    );
    const rows = (await res.json()) as { lat: string; lon: string }[];
    const hit = rows?.[0]
      ? { lat: parseFloat(rows[0].lat), lng: parseFloat(rows[0].lon) }
      : null;
    const result = hit && Number.isFinite(hit.lat) && Number.isFinite(hit.lng) ? hit : null;
    zipCache.set(zip, result);
    return result;
  } catch {
    return null;
  }
}

/** Haversine distance in miles. */
function distanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 3958.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isInitialMount = useRef(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    name: searchParams.get("name") || "",
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

    // Only cheap, structurally-safe filters run in the database. Everything
    // nuanced (free-text location, zip radius, indoor/outdoor "both",
    // amenity vocabulary) is filtered client-side below — the result set is
    // small (≤200 rows) and this avoids PostgREST syntax pitfalls that used
    // to silently zero out results.
    let query = supabase
      .from("venues")
      .select(ANON_VENUE_SELECT)
      .eq("is_published", true)
      .neq("is_demo", true)
      .not("slug", "is", null);

    if (f.guests) {
      const g = Number(f.guests);
      if (Number.isFinite(g) && g > 0) query = query.gte("capacity_max", g);
    }
    if (f.style) query = query.eq("venue_type", f.style);

    const { data, error } = await query
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) console.error("[search] venue query failed:", error.message);

    let rows = (data ?? []) as Venue[];

    // ── Budget: price range overlap ─────────────────────────────────────
    if (f.budget) {
      const range = BUDGET_RANGES.find((r) => r.value === f.budget);
      if (range) {
        rows = rows.filter((v) => {
          if (v.price_min == null && v.price_max == null) return false;
          const lo = v.price_min ?? v.price_max ?? 0;
          const hi = v.price_max ?? v.price_min ?? lo;
          return lo <= range.max && hi >= range.min;
        });
      }
    }

    // ── Setting: a venue marked "both" satisfies indoor OR outdoor ──────
    if (f.indoor_outdoor) {
      rows = rows.filter(
        (v) =>
          v.indoor_outdoor === f.indoor_outdoor || v.indoor_outdoor === "both"
      );
    }

    // ── Amenities: every selected amenity must be present (vocabulary-
    //    normalized so legacy stored values still match) ─────────────────
    if (f.amenities.length > 0) {
      rows = rows.filter((v) =>
        f.amenities.every((a) => venueHasFeature(v.features, a))
      );
    }

    // ── Venue name: case-insensitive substring match ────────────────────
    const nameQuery = f.name.trim().toLowerCase();
    if (nameQuery) {
      rows = rows.filter((v) =>
        (v.name ?? "").toLowerCase().includes(nameQuery)
      );
    }

    // ── Location: zip → radius search around the zip's coordinates;
    //    anything else → token text match on city/state/full address ─────
    const loc = f.location.trim();
    if (loc) {
      const zipMatch = loc.match(/^\d{5}(-\d{4})?$/);
      if (zipMatch) {
        const zip5 = loc.slice(0, 5);
        const center = await geocodeZip(zip5);
        rows = rows.filter((v) => {
          // Exact zip stored in the address always matches.
          if ((v.location_full ?? "").includes(zip5)) return true;
          if (center && v.lat != null && v.lng != null) {
            return distanceMiles(center.lat, center.lng, Number(v.lat), Number(v.lng)) <= ZIP_RADIUS_MILES;
          }
          return false;
        });
      } else {
        const tokens = loc.toLowerCase().split(/[,\s]+/).filter(Boolean);
        rows = rows.filter((v) => {
          const hay = locationHaystack(v.location_full, v.location_city, v.location_state);
          return tokens.every((t) => hay.includes(t));
        });
      }
    }

    const sorted = rows.slice().sort((a, b) => {
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
    pendingFilters.name,
    pendingFilters.location,
    pendingFilters.budget,
    pendingFilters.guests,
    pendingFilters.style,
    pendingFilters.indoor_outdoor,
  ].filter(Boolean).length + pendingFilters.amenities.length;

  return (
    <>
    {/* Always CSS grid — mobile is a single column, desktop is a hard 288px
        sidebar + minmax(0,1fr) main column so the right side always fills the
        available width regardless of how much content it has. */}
    <div className="w-full max-w-screen-xl mx-auto px-6 py-6 min-h-[calc(100vh-64px)]
                    grid grid-cols-1 gap-5
                    lg:grid-cols-[288px_minmax(0,1fr)] lg:gap-10">

      {/* ── Sidebar (desktop) ── */}
      <div className="hidden lg:block w-full">
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
      <div className="w-full min-w-0 flex flex-col gap-5">

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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-8 min-h-[320px]">
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <Search className="h-10 w-10 text-stone-300 mb-4" />
              <h2 className="text-lg font-semibold text-stone-900 mb-1">No venues found</h2>
              <p className="text-sm text-stone-500">Try adjusting your filters to see more results</p>
            </div>
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
              className="text-sm font-medium text-stone-600 hover:text-stone-900 px-3 py-2 rounded-xl transition-colors"
            >
              Log in
            </a>
            <a
              href={`${STORYPAY_URL}/signup`}
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
