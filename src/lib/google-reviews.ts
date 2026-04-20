import type { GoogleReviewItem, GoogleReviewsCache, Json } from "@/types/database";

/**
 * Normalize the raw `venues.google_reviews_cache` JSONB value into a typed,
 * safe-to-render shape. Returns null when the value is missing, malformed,
 * or carries zero usable reviews.
 *
 * We mirror StoryPay's writer (src/lib/venue-google-reviews.ts) so shape
 * drift is caught at parse time rather than by a blank UI.
 */
export function parseGoogleReviewsCache(
  raw: Json | null | undefined
): GoogleReviewsCache | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;

  const rating =
    typeof o.rating === "number" && !Number.isNaN(o.rating) ? o.rating : null;
  const userRatingCount =
    typeof o.userRatingCount === "number" && !Number.isNaN(o.userRatingCount)
      ? o.userRatingCount
      : 0;

  const rawReviews = Array.isArray(o.reviews) ? o.reviews : [];
  const reviews: GoogleReviewItem[] = [];
  for (const r of rawReviews) {
    if (!r || typeof r !== "object") continue;
    const x = r as Record<string, unknown>;
    const text = typeof x.text === "string" ? x.text.trim() : "";
    const author =
      typeof x.author_name === "string" && x.author_name.trim()
        ? x.author_name.trim()
        : "Google user";
    const ratingN =
      typeof x.rating === "number" && !Number.isNaN(x.rating)
        ? Math.min(5, Math.max(1, Math.round(x.rating)))
        : 0;
    if (!text && ratingN === 0) continue;
    reviews.push({
      author_name: author,
      rating: ratingN || 5,
      text,
      published_at: typeof x.published_at === "string" ? x.published_at : null,
      profile_photo_url:
        typeof x.profile_photo_url === "string" &&
        x.profile_photo_url.startsWith("http")
          ? x.profile_photo_url
          : null,
    });
  }

  if (!reviews.length && userRatingCount === 0 && rating == null) return null;

  return { rating, userRatingCount, reviews };
}
