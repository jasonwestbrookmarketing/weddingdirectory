export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      leads: {
        Row: {
          booking_timeline: string | null
          created_at: string | null
          email: string
          guest_count: number | null
          id: string
          message: string | null
          name: string
          phone: string
          status: string
          venue_id: string
          wedding_date: string | null
        }
        Insert: {
          booking_timeline?: string | null
          created_at?: string | null
          email: string
          guest_count?: number | null
          id?: string
          message?: string | null
          name: string
          phone: string
          status?: string
          venue_id: string
          wedding_date?: string | null
        }
        Update: {
          booking_timeline?: string | null
          created_at?: string | null
          email?: string
          guest_count?: number | null
          id?: string
          message?: string | null
          name?: string
          phone?: string
          status?: string
          venue_id?: string
          wedding_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          role: string
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: string
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          availability_notes: string | null
          capacity_max: number | null
          capacity_min: number | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          email_notifications: boolean | null
          features: Json | null
          gallery_images: Json | null
          id: string
          indoor_outdoor: string | null
          is_published: boolean | null
          lat: number | null
          lng: number | null
          location_city: string | null
          location_full: string | null
          location_state: string | null
          name: string | null
          notification_email: string | null
          onboarding_completed: boolean | null
          onboarding_step: number | null
          owner_id: string
          price_max: number | null
          price_min: number | null
          slug: string | null
          updated_at: string | null
          venue_type: string | null
        }
        Insert: {
          availability_notes?: string | null
          capacity_max?: number | null
          capacity_min?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          email_notifications?: boolean | null
          features?: Json | null
          gallery_images?: Json | null
          id?: string
          indoor_outdoor?: string | null
          is_published?: boolean | null
          lat?: number | null
          lng?: number | null
          location_city?: string | null
          location_full?: string | null
          location_state?: string | null
          name?: string | null
          notification_email?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          owner_id: string
          price_max?: number | null
          price_min?: number | null
          slug?: string | null
          updated_at?: string | null
          venue_type?: string | null
        }
        Update: {
          availability_notes?: string | null
          capacity_max?: number | null
          capacity_min?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          email_notifications?: boolean | null
          features?: Json | null
          gallery_images?: Json | null
          id?: string
          indoor_outdoor?: string | null
          is_published?: boolean | null
          lat?: number | null
          lng?: number | null
          location_city?: string | null
          location_full?: string | null
          location_state?: string | null
          name?: string | null
          notification_email?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          owner_id?: string
          price_max?: number | null
          price_min?: number | null
          slug?: string | null
          updated_at?: string | null
          venue_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venues_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Venue = Database["public"]["Tables"]["venues"]["Row"];
export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
