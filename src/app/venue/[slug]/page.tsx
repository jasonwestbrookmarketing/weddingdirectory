import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { parseGoogleReviewsCache } from "@/lib/google-reviews";
import { needsLocationRepair, repairVenueLocation } from "@/lib/location-repair";
import VenuePageClient from "./VenuePageClient";
import ListingTracker from "@/components/venue/ListingTracker";
import SiteFooter from "@/components/SiteFooter";
import { VenueSeoFooter } from "@/components/VenueSeoFooter";
import type { Metadata } from "next";

/** Minimal server-side FAQ parser (mirrors the client parseFaq shape). */
function parseFaqServer(raw: unknown): Array<{ question: string; answer: string }> {
  if (!Array.isArray(raw)) return [];
  const out: Array<{ question: string; answer: string }> = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
    const o = entry as Record<string, unknown>;
    const question = typeof o.question === "string" ? o.question.trim() : "";
    const answer = typeof o.answer === "string" ? o.answer.trim() : "";
    if (!question || !answer) continue;
    out.push({ question, answer });
    if (out.length >= 20) break;
  }
  return out;
}

/** Build EventVenue + FAQPage JSON-LD from whatever venue fields are present. */
function buildVenueJsonLd(venue: Record<string, unknown>, url: string): object {
  const name = String(venue.name ?? "");
  const description =
    (typeof venue.seo_description === "string" && venue.seo_description) ||
    (typeof venue.description === "string" ? venue.description.slice(0, 300) : "") ||
    `${name} on StoryVenue`;
  const images = [
    typeof venue.cover_image_url === "string" ? venue.cover_image_url : null,
    ...(Array.isArray(venue.gallery_images) ? (venue.gallery_images as string[]) : []),
  ].filter(Boolean).slice(0, 6);

  const city = typeof venue.location_city === "string" ? venue.location_city : null;
  const region = typeof venue.location_state === "string" ? venue.location_state : null;
  const lat = typeof venue.lat === "number" ? venue.lat : null;
  const lng = typeof venue.lng === "number" ? venue.lng : null;

  const eventVenue: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name,
    description,
    url,
    ...(images.length ? { image: images } : {}),
    ...(city || region
      ? {
          address: {
            "@type": "PostalAddress",
            ...(city ? { addressLocality: city } : {}),
            ...(region ? { addressRegion: region } : {}),
            addressCountry: "US",
          },
        }
      : {}),
    ...(lat != null && lng != null
      ? { geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lng } }
      : {}),
    ...(typeof venue.capacity === "number" && venue.capacity > 0
      ? { maximumAttendeeCapacity: venue.capacity }
      : {}),
  };

  const faqs = parseFaqServer(venue.faq);
  const graph: object[] = [eventVenue];
  if (faqs.length) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }
  return graph.length === 1 ? eventVenue : { "@context": "https://schema.org", "@graph": graph };
}

// Demo venue pages must never be CDN-cached — the preview token is the
// only auth mechanism and must be validated on every request.
export const dynamic = "force-dynamic";

const STORYPAY_URL =
  process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";

const SITE_URL = (
  process.env.NEXT_PUBLIC_DIRECTORY_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://storyvenue.com"
).replace(/\/$/, "");

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

  // Prefer the AI-generated SEO fields (backfilled + regenerated on edits);
  // fall back to sensible derived defaults when they're not populated yet.
  const title: string = venue.seo_title?.trim() || `${venue.name} — StoryVenue`;
  const description: string =
    venue.seo_description?.trim() ||
    venue.description?.slice(0, 160) ||
    `Discover ${venue.name} on StoryVenue`;
  const keywords: string[] = Array.isArray(venue.seo_keywords)
    ? (venue.seo_keywords as string[])
    : typeof venue.seo_keywords === "string" && venue.seo_keywords
      ? venue.seo_keywords.split(",").map((k: string) => k.trim()).filter(Boolean)
      : [];
  const canonical = `${SITE_URL}/venue/${slug}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    ...(keywords.length ? { keywords } : {}),
    // Demo venues accessed via preview token must never be indexed
    ...(previewToken ? { robots: { index: false, follow: false } } : {}),
    alternates: { canonical },
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: venue.cover_image_url ? [venue.cover_image_url] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: venue.cover_image_url ? [venue.cover_image_url] : [],
    },
  };
}

export default async function VenuePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const previewToken = typeof sp.preview === "string" ? sp.preview : null;
  let venue = await fetchVenueWithDemoCheck(slug, previewToken);

  if (!venue) notFound();

  // Legacy rows can store townships as the city or lack a zip entirely.
  // Reverse-geocode from coordinates (cached 30 days) so the public page
  // always shows a proper "street, City, ST zip" address.
  if (needsLocationRepair(venue)) {
    venue = await repairVenueLocation(venue);
  }

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
      {/* Structured data for search + AI answer engines (skip on demo preview). */}
      {!previewToken && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildVenueJsonLd(venue, `${SITE_URL}/venue/${slug}`)),
          }}
        />
      )}
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
      )}
      {venue.id && <ListingTracker venueId={venue.id} />}
      <VenuePageClient
        venue={venue}
        reviews={reviews}
        googleReviews={googleReviews}
        guidePreviewUrl={guidePreviewUrl}
        pricingGuideEnabled={pricingGuideEnabled}
      />
      <VenueSeoFooter
        venueName={venue.name}
        city={venue.location_city ?? null}
        state={venue.location_state ?? null}
        venueType={venue.venue_type ?? null}
        landingMode={hideHeader}
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
