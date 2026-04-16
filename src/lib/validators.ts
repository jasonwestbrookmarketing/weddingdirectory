import { z } from "zod/v4";

export const signupSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  email: z.email("Valid email required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.email("Valid email required"),
  password: z.string().min(1, "Password is required"),
});

export const venueBasicsSchema = z.object({
  name: z.string().min(1, "Venue name is required"),
  location_full: z.string().min(1, "Location is required"),
  location_city: z.string().optional(),
  location_state: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  venue_type: z.string().min(1, "Venue type is required"),
});

export const venueDetailsSchema = z.object({
  capacity_min: z.number().int().min(1, "Min capacity required"),
  capacity_max: z.number().int().min(1, "Max capacity required"),
  price_min: z.number().int().min(0, "Min price required"),
  price_max: z.number().int().min(0, "Max price required"),
  indoor_outdoor: z.enum(["indoor", "outdoor", "both"]),
  features: z.array(z.string()).default([]),
  description: z.string().min(1, "Description is required"),
});

export const venueImagesSchema = z.object({
  cover_image_url: z.string().url("Cover image required"),
  gallery_images: z.array(z.string().url()).default([]),
});

export const leadSettingsSchema = z.object({
  notification_email: z.email("Valid email required"),
  email_notifications: z.boolean().default(true),
});

export const leadFormSchema = z
  .object({
    venue_id: z.string().uuid().optional(),
    listing_slug: z.string().min(1).optional(),
    name: z.string().min(1, "Name is required"),
    email: z.email("Valid email required"),
    phone: z.string().min(7, "Phone number is required"),
    wedding_date: z.string().optional(),
    guest_count: z.number().int().min(1).optional(),
    booking_timeline: z.string().optional(),
    message: z.string().optional(),
  })
  .refine((d) => d.venue_id || d.listing_slug, {
    message: "venue_id or listing_slug required",
    path: ["venue_id"],
  });

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VenueBasicsInput = z.infer<typeof venueBasicsSchema>;
export type VenueDetailsInput = z.infer<typeof venueDetailsSchema>;
export type VenueImagesInput = z.infer<typeof venueImagesSchema>;
export type LeadSettingsInput = z.infer<typeof leadSettingsSchema>;
export type LeadFormInput = z.infer<typeof leadFormSchema>;
