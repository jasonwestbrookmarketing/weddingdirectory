/**
 * Public types for the read-only directory site.
 *
 * Writes happen in the StoryPay dashboard; here we only read the public
 * `venues` table and `site_settings`. `venues` is the single source of truth
 * — it carries both directory-facing fields AND internal StoryPay columns.
 * The projections below only expose the directory-safe subset.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * Explicit column allowlist for anon-key `venues` queries.
 *
 * MUST stay in sync with the `grant select (...) on public.venues to anon`
 * column list in db/020_lock_down_anon_column_exposure.sql. Postgres does NOT
 * gracefully degrade `select("*")` to a granted column subset — a wildcard
 * select requires privilege on every column it expands to, so any anon query
 * using `*` against `venues` will fail outright once that migration's
 * column-level grant is applied. Every anon-key `.from("venues")` call in
 * this repo must select from this list (or a subset of it) instead of `*`.
 */
export const ANON_VENUE_SELECT =
  "id, slug, name, description, venue_type, location_full, location_city, location_state, lat, lng, capacity_min, capacity_max, price_min, price_max, indoor_outdoor, features, cover_image_url, gallery_images, availability_notes, is_published, is_demo, demo_preview_token, brand_website, phone, email, show_map, social_links, faq, google_place_id, google_reviews_cache, google_reviews_fetched_at, directory_verified_status, directory_sponsored_status, directory_plan_id, meta_pixel_id, seo_title, seo_description, seo_keywords, created_at, updated_at" as const;

export type Database = {
  public: {
    Tables: {
      venues: {
        Row: Venue;
        Insert: Partial<Venue> & { owner_id: string };
        Update: Partial<Venue>;
        Relationships: [];
      };
      site_settings: {
        Row: { key: string; value: string | null };
        Insert: { key: string; value?: string | null };
        Update: { key?: string; value?: string | null };
        Relationships: [];
      };
    };
    Views: {
      listing_reviews_public: {
        Row: ListingReview;
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

/**
 * Directory-facing projection of a `public.venues` row. The table has more
 * columns (brand_*, lunarpay_*, onboarding_*, etc.) but the public site
 * never reads them — RLS + `is_published = true` gates what anon can see.
 */
export interface Venue {
  id: string;
  slug: string | null;
  name: string | null;
  description: string | null;
  venue_type: string | null;
  location_full: string | null;
  location_city: string | null;
  location_state: string | null;
  lat: number | null;
  lng: number | null;
  capacity_min: number | null;
  capacity_max: number | null;
  price_min: number | null;
  price_max: number | null;
  indoor_outdoor: string | null;
  features: Json | null;
  cover_image_url: string | null;
  gallery_images: Json | null;
  availability_notes: string | null;
  is_published: boolean;
  /** True for demo/preview listings — gated by `demo_preview_token`, see page.tsx. */
  is_demo: boolean | null;
  /** Preview-link secret for demo listings. Never rendered; compared server-side only. */
  demo_preview_token: string | null;
  /** Venue's public website URL set in Branding settings. */
  brand_website: string | null;
  /** Public contact phone (set in Branding → Contact Information). */
  phone: string | null;
  /** Public contact email (set in Branding → Contact Information). */
  email: string | null;
  /** Owner toggle for the public map embed on the venue listing. */
  show_map: boolean | null;
  /** Sparse object of social URLs. See VenueSocialLinks for known keys. */
  social_links: Json | null;
  /** Array of { question, answer } pairs. See VenueFaqItem. */
  faq: Json | null;
  /** Google Maps Place ID (e.g. ChIJ...) if the venue connected Google reviews. */
  google_place_id: string | null;
  /**
   * Cached Google Places API payload. Shape is {
   *   rating: number | null,
   *   userRatingCount: number,
   *   reviews: GoogleReviewItem[]
   * } but stored as JSONB — use parseGoogleReviewsCache() before touching it.
   *
   * IMPORTANT: this directory site never refreshes this cache. The StoryPay
   * dashboard owns the Places API key and auto-refreshes on its own public
   * venue page whenever the cache is >24h old. The directory just renders
   * whatever is there.
   */
  google_reviews_cache: Json | null;
  /** ISO timestamp for when google_reviews_cache was last refreshed. */
  google_reviews_fetched_at: string | null;
  /**
   * Workflow status for the blue Instagram-style verified badge. Public UI
   * surfaces the badge ONLY when the value is `'approved'` — other values
   * represent internal workflow states (draft / pending / rejected / none).
   */
  directory_verified_status: DirectoryBadgeStatus | null;
  /**
   * Workflow status for the "Sponsored" label. Same rule as verified: the
   * public badge only appears when this is `'approved'`.
   */
  directory_sponsored_status: DirectoryBadgeStatus | null;
  /** FK into `directory_plans` — gates nav visibility/pricing-guide access. */
  directory_plan_id: string | null;
  /** Venue-specific Meta Pixel ID, fired on the lead thank-you page. */
  meta_pixel_id: string | null;
  seo_title: string | null;
  seo_description: string | null;
  /** Comma-separated string or array, depending on how it was set. */
  seo_keywords: Json | null;
  created_at: string;
  updated_at: string;
}

/**
 * Workflow for the verified/sponsored directory badges. See migration 031.
 * Only `'approved'` is surfaced publicly.
 */
export type DirectoryBadgeStatus =
  | "none"
  | "draft"
  | "pending"
  | "approved"
  | "rejected";

/** Known social channels rendered by the directory. Extra keys are ignored. */
export interface VenueSocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  pinterest?: string;
  website?: string;
}

export interface VenueFaqItem {
  question: string;
  answer: string;
}

/** Back-compat alias so older imports keep compiling. */
export type VenueListing = Venue;

/**
 * Public-safe projection of a review row, read from the
 * `public.listing_reviews_public` view. The view filters to status =
 * 'published' and strips reviewer_email / status / source so anon clients
 * never see moderation state or contact info.
 */
export interface ListingReview {
  id: string;
  venue_id: string;
  /** Integer 1–5, enforced at the DB level. */
  rating: number;
  title: string | null;
  body: string;
  reviewer_name: string;
  /** ISO date (YYYY-MM-DD) or null. */
  wedding_date: string | null;
  created_at: string;
}

/**
 * Single normalized Google review (as written by the StoryPay backend into
 * `venues.google_reviews_cache`).
 */
export interface GoogleReviewItem {
  author_name: string;
  /** 1–5 integer. */
  rating: number;
  text: string;
  /** ISO timestamp or null. */
  published_at: string | null;
  profile_photo_url: string | null;
}

/** Normalized shape of the cached Places API payload. */
export interface GoogleReviewsCache {
  /** Aggregate Google rating (0–5, one decimal) or null if Google hasn't surfaced one. */
  rating: number | null;
  /** Total number of Google ratings (may exceed reviews.length — Places API only returns up to ~20). */
  userRatingCount: number;
  reviews: GoogleReviewItem[];
}
