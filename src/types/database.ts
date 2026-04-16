/**
 * Public types for the read-only directory site.
 *
 * Writes happen in the StoryPay dashboard; here we only read the public
 * `venue_listings` table and `site_settings`.
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
      venue_listings: {
        Row: VenueListing;
        Insert: Partial<VenueListing> & { storypay_venue_id: string };
        Update: Partial<VenueListing>;
        Relationships: [];
      };
      site_settings: {
        Row: { key: string; value: string | null };
        Insert: { key: string; value?: string | null };
        Update: { key?: string; value?: string | null };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export interface VenueListing {
  id: string;
  storypay_venue_id: string;
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
  created_at: string;
  updated_at: string;
}

// Back-compat alias so existing components that import `Venue` keep working.
export type Venue = VenueListing;
