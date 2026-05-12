import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { parseGoogleReviewsCache } from "@/lib/google-reviews";
import VenuePageClient from "./VenuePageClient";
import ListingTracker from "@/components/venue/ListingTracker";
import SiteFooter from "@/components/SiteFooter";
import type { Metadata } from "next";

// Demo venue pages must never be CDN-cached — the preview token is the
// only auth mechanism and must be validated on every request.
export const dynamic = "force-dynamic";

const STORYPAY_URL =
  process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** Fetch a venue allowing demo access when a valid preview token is supplied. */
async function fetchVenueWithDemoCheck(slug: string, previewToken: string | null) {
  const supabase = await createClient();
  const { data: venue } = await supabase
    .from("venues")
    .select("*, demo_preview_token, is_demo")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!venue) return null;

  // Block demo venues unless the preview token matches
  if (venue.is_demo === true) {
    if (!previewToken || previewToken !== venue.demo_preview_token) return null;
  }

  return venue;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const previewToken = typeof sp.preview === "string" ? sp.preview : null;
  const venue = await fetchVenueWithDemoCheck(slug, previewToken);

  if (!venue) return { title: "Venue Not Found — StoryVenue", robots: { index: false } };

  return {
    title: `${venue.name} — StoryVenue`,
    // Demo venues accessed via preview token must never be indexed
    ...(previewToken ? { robots: { index: false, follow: false } } : {}),
    description:
      venue.description?.slice(0, 160) ||
      `Discover ${venue.name} on StoryVenue`,
    openGraph: {
      title: `${venue.name} — StoryVenue`,
      description:
        venue.description?.slice(0, 160) ||
        `Discover ${venue.name} on StoryVenue`,
      images: venue.cover_image_url ? [venue.cover_image_url] : [],
    },
  };
}

export default async function VenuePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const previewToken = typeof sp.preview === "string" ? sp.preview : null;
  const venue = await fetchVenueWithDemoCheck(slug, previewToken);

  if (!venue) notFound();

  // New supabase client for the remaining queries in this function
  const supabase = await createClient();

  // Reviews live on a dedicated public view (listing_reviews_public) that
  // already filters to status = 'published' and hides moderation columns.
  // If the view isn't present yet (e.g. a Supabase project that hasn't run
  // migration 025), fall back to an empty list rather than 500-ing the page.
  const { data: reviewsData } = await supabase
    .from("listing_reviews_public")
    .select(
      "id, venue_id, rating, title, body, reviewer_name, wedding_date, created_at"
    )
    .eq("venue_id", venue.id)
    .order("created_at", { ascending: false });

  const reviews = reviewsData ?? [];

  // Google reviews cache is refreshed by the StoryPay dashboard (it owns the
  // Places API key). Directory just surfaces whatever is in the JSONB column.
  const googleReviews = parseGoogleReviewsCache(venue.google_reviews_cache);

  // ── Plan gates ───────────────────────────────────────────────────────────
  // Fetch nav_permissions + hide_header in one query.
  // Venues without a plan (legacy) get full access + header visible.
  let pricingGuideEnabled = true;
  let hideHeader = false;
  if (venue.directory_plan_id) {
    const { data: plan } = await supabase
      .from("directory_plans")
      .select("nav_permissions, hide_header")
      .eq("id", venue.directory_plan_id)
      .maybeSingle();
    if (plan) {
      const perms = (plan.nav_permissions ?? {}) as Record<string, boolean>;
      pricingGuideEnabled = perms["nav_listing_pricing_guide"] === true;
      hideHeader = (plan as Record<string, unknown>).hide_header === true;
    } else {
      pricingGuideEnabled = false;
    }
  }

  // Pricing guide cover + owner toggle — only fetched when the plan gate allows it.
  // The venue owner can independently disable the guide from their dashboard even
  // when their plan grants access (venue_pricing_guides.enabled = false).
  let guidePreviewUrl = "";
  if (pricingGuideEnabled) {
    const { data: guideRow } = await supabase
      .from("venue_pricing_guides")
      .select("cover_image_url, enabled")
      .eq("venue_id", venue.id)
      .maybeSingle();
    // Respect the owner's toggle — if the row doesn't exist yet, treat as disabled.
    pricingGuideEnabled = guideRow?.enabled === true;
    guidePreviewUrl = pricingGuideEnabled ? (guideRow?.cover_image_url ?? "") : "";
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top nav — hidden when the plan has landing-page mode enabled */}
      {!hideHeader && (
      <nav className="sticky top-0 z-30 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between h-16 gap-3">
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
      )}
      {venue.id && <ListingTracker venueId={venue.id} />}
      <VenuePageClient
        venue={venue}
        reviews={reviews}
        googleReviews={googleReviews}
        guidePreviewUrl={guidePreviewUrl}
        pricingGuideEnabled={pricingGuideEnabled}
      />
      {hideHeader ? (
        <footer className="bg-stone-100 py-4 text-center">
          <a
            href="https://www.storyvenue.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-stone-500 hover:text-stone-700 transition-colors"
          >
            A StoryVenue Site
          </a>
        </footer>
      ) : (
        <SiteFooter />
      )}
    </div>
  );
}
