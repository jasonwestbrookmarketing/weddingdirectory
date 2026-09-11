import crypto from "crypto";

/**
 * Wedding Minisite client for the public storyvenue.com/<slug> pages.
 *
 * Reads come from StoryPay's public API. Writes (guestbook posts, RSVP name
 * lookups) are HMAC-signed with the shared lead-webhook secret and proxied to
 * StoryPay — the same trust boundary as /api/leads, so no new env is needed.
 */
export const STORYPAY_URL = (process.env.NEXT_PUBLIC_STORYPAY_URL || "").replace(/\/$/, "");
export const MINISITE_SECRET = process.env.STORYPAY_LEAD_WEBHOOK_SECRET || "";

export function signMinisite(rawBody: string): string {
  return crypto.createHmac("sha256", MINISITE_SECRET).update(rawBody).digest("hex");
}

export interface MinisiteData {
  locked: boolean;
  slug: string;
  coupleName: string;
  headline: string | null;
  story: string | null;
  photoUrl: string | null;
  coverUrl: string | null;
  weddingDate: string | null;
  weddingTime: string | null;
  socials: { instagram: string | null; facebook: string | null; tiktok: string | null; pinterest: string | null };
  storyHtml: string | null;
  customLinks: { label: string; url: string; icon: string }[];
  gallery: string[];
  embedHtml: string | null;
  embedTitle: string | null;
  embedMode: "page" | "live";
  sectionOrder: string[];
  showCountdown: boolean;
  showGuestbook: boolean;
  rsvpEnabled: boolean;
  venue: {
    name: string; city: string | null; state: string | null; address: string | null;
    coverUrl: string | null; listingUrl: string; mapsUrl: string;
  } | null;
}

/**
 * Fetch a couple's minisite. Pass `key` (the unlock cookie value) so a
 * password-protected site returns full content once verified; otherwise a
 * protected site comes back with `locked: true` and only the couple name.
 */
export async function fetchMinisite(slug: string, key?: string | null): Promise<MinisiteData | null> {
  if (!STORYPAY_URL) return null;
  try {
    const qs = key ? `?k=${encodeURIComponent(key)}` : "";
    const res = await fetch(`${STORYPAY_URL}/api/public/minisite/${encodeURIComponent(slug)}${qs}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const j = (await res.json()) as Record<string, unknown>;
    return {
      locked: Boolean(j.locked),
      slug: (j.slug as string) ?? slug,
      coupleName: (j.coupleName as string) ?? "Our Wedding",
      headline: (j.headline as string | null) ?? null,
      story: (j.story as string | null) ?? null,
      storyHtml: (j.storyHtml as string | null) ?? null,
      photoUrl: (j.photoUrl as string | null) ?? null,
      coverUrl: (j.coverUrl as string | null) ?? null,
      weddingDate: (j.weddingDate as string | null) ?? null,
      weddingTime: (j.weddingTime as string | null) ?? null,
      socials: (j.socials as MinisiteData["socials"]) ?? { instagram: null, facebook: null, tiktok: null, pinterest: null },
      customLinks: (j.customLinks as MinisiteData["customLinks"]) ?? [],
      gallery: (j.gallery as string[]) ?? [],
      embedHtml: (j.embedHtml as string | null) ?? null,
      embedTitle: (j.embedTitle as string | null) ?? null,
      embedMode: j.embedMode === "live" ? "live" : "page",
      sectionOrder: (j.sectionOrder as string[]) ?? ["countdown", "story", "gallery", "links", "embed"],
      showCountdown: Boolean(j.showCountdown),
      showGuestbook: Boolean(j.showGuestbook),
      rsvpEnabled: Boolean(j.rsvpEnabled),
      venue: (j.venue as MinisiteData["venue"]) ?? null,
    };
  } catch {
    return null;
  }
}

/** Reserved / non-couple top-level paths (static routes already win; this is a
 *  belt-and-suspenders guard for the dynamic [slug] segment). */
export const RESERVED_TOP_PATHS: ReadonlySet<string> = new Set([
  "venue", "venues", "search", "links", "blog", "jason",
  "bride-booking-system", "strategy-call", "free-listing", "book-more-weddings",
  "confirmation", "maintenance", "api", "sitemap", "robots", "llms",
]);
