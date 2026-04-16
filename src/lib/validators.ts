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

export type LeadFormInput = z.infer<typeof leadFormSchema>;
