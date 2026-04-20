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
  onboarding_completed: boolean;
  notification_email: string | null;
  email_notifications: boolean;
  /** Owner toggle for the public map embed on the venue listing. */
  show_map: boolean | null;
  /** Sparse object of social URLs. See VenueSocialLinks for known keys. */
  social_links: Json | null;
  /** Array of { question, answer } pairs. See VenueFaqItem. */
  faq: Json | null;
  created_at: string;
  updated_at: string;
}

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
