import { z } from "zod/v4";

/**
 * This site no longer writes to the DB — all venue edits happen in the StoryPay
 * dashboard. The only form we still validate here is the public lead-capture
 * form, which is proxied (HMAC-signed) to StoryPay's webhook.
 */
export const leadFormSchema = z
  .object({
    venue_id: z.string().uuid().optional(),
    listing_slug: z.string().min(1).optional(),
    // Accept combined name OR split first/last — both are forwarded to StoryPay
    name: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.email("Valid email required"),
    phone: z.string().min(7, "Phone number is required"),
    guest_count: z.number().int().positive().optional(),
    booking_timeline: z.string().optional(),
    venue_matters: z.string().optional(),
    message: z.string().optional(),
    // First-touch attribution — forwarded to StoryPay for lead-source
    // bucketing (Meta / Google / Direct). Optional; absent for untagged traffic.
    utm_source: z.string().optional(),
    utm_medium: z.string().optional(),
    utm_campaign: z.string().optional(),
    utm_term: z.string().optional(),
    utm_content: z.string().optional(),
    fbclid: z.string().optional(),
    referrer: z.string().optional(),
  })
  .refine((d) => d.venue_id || d.listing_slug, {
    message: "venue_id or listing_slug required",
    path: ["venue_id"],
  });

export type LeadFormInput = z.infer<typeof leadFormSchema>;
