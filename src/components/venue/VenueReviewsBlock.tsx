"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ExternalLink, Star } from "lucide-react";
import type { GoogleReviewItem, GoogleReviewsCache, ListingReview } from "@/types/database";

/**
 * Reviews block for the public venue listing.
 *
 * Two sources of truth:
 *  1. StoryVenue reviews — written/moderated in the dashboard, read from
 *     the `listing_reviews_public` view by the server component.
 *  2. Google reviews — cached into `venues.google_reviews_cache` by the
 *     StoryPay backend (Places API). The directory treats this as read-only.
 *
 * When Google data is present we surface a tab toggle; otherwise we fall
 * back to the original single-source layout to avoid visual noise.
 */

const STORY_PREVIEW = 4;
const GOOGLE_PREVIEW = 5;
const STORYPAY_URL =
  process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";

function StarRow({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md";
}) {
  const px = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${px} ${
            n <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-stone-200 text-stone-200"
          }`}
          strokeWidth={0}
        />
      ))}
    </span>
  );
}

/** Combined rating summary card + bar chart, shown above the tab/review list. */
function RatingSummary({
  combinedAvg,
  combinedCount,
  distribution,
  distributionTotal,
  venueId,
}: {
  combinedAvg: number;
  /** True total (storyCount + google userRatingCount). */
  combinedCount: number;
  /** Per-star counts derived from all available individual reviews (index 0 = 1★ … 4 = 5★). */
  distribution: number[];
  /** Sum of distribution — may be less than combinedCount when Google caches only a subset. */
  distributionTotal: number;
  venueId: string;
}) {
  const maxBar = Math.max(...distribution, 1);
  const writeHref = `${STORYPAY_URL}/login?as=couple&intent=review&venue=${encodeURIComponent(venueId)}`;
  const barsMismatched = distributionTotal < combinedCount;

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8 rounded-2xl border border-stone-200 overflow-hidden">
      {/* Left — aggregate */}
      <div className="flex flex-col justify-center gap-2 px-6 py-5 sm:w-52 shrink-0 bg-stone-50 border-b sm:border-b-0 sm:border-r border-stone-200">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
          Overall Rating
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-stone-900">
            {combinedAvg > 0 ? combinedAvg.toFixed(1) : "—"}
          </span>
          {combinedAvg > 0 && (
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={`h-4 w-4 ${
                    n <= Math.round(combinedAvg)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-stone-200 text-stone-200"
                  }`}
                  strokeWidth={0}
                />
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-stone-500">
          {combinedCount.toLocaleString()}{" "}
          {combinedCount === 1 ? "review" : "reviews"}
        </p>
        <a
          href={writeHref}
          className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-transparent px-4 py-2.5 text-xs font-semibold text-stone-900 hover:bg-stone-50 transition-colors"
        >
          <Star className="h-3.5 w-3.5 fill-stone-900 text-stone-900" strokeWidth={0} />
          Write a review
        </a>
      </div>

      {/* Right — distribution bars */}
      <div className="flex flex-col justify-center gap-2 px-6 py-5 flex-1">
        <div className="flex items-baseline justify-between mb-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
            Rating Breakdown
          </p>
          {barsMismatched && (
            <p className="text-xs text-stone-400">
              {distributionTotal.toLocaleString()} StoryVenue{" "}
              {distributionTotal === 1 ? "review" : "reviews"}
            </p>
          )}
        </div>
        {[5, 4, 3, 2, 1].map((star) => {
          const count = distribution[star - 1];
          // Bar width is relative to the most-popular star tier so all bars
          // are proportional to each other (not to the Google aggregate total
          // which we can't break down per-star from the cached data).
          const pct = Math.round((count / maxBar) * 100);
          return (
            <div key={star} className="flex items-center gap-3">
              <span className="flex items-center gap-0.5 shrink-0 w-8 text-xs text-stone-500 font-medium">
                {star}
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" strokeWidth={0} />
              </span>
              <div className="flex-1 h-2 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-5 text-right text-xs text-stone-400 shrink-0">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatReviewDate(iso: string | null | undefined) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function StoryReviewCard({ review }: { review: ListingReview }) {
  const initial = (review.reviewer_name || "?").trim().charAt(0).toUpperCase();
  return (
    <article className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
          <span className="text-stone-700 font-semibold text-sm">
            {initial || "?"}
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-stone-900 text-sm truncate">
            {review.reviewer_name}
          </p>
          <p className="text-xs text-stone-500">
            {formatReviewDate(review.created_at)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StarRow rating={review.rating} />
        {review.wedding_date && (
          <>
            <span className="text-stone-300" aria-hidden>
              ·
            </span>
            <span className="text-xs text-stone-500">
              Wedding {formatReviewDate(review.wedding_date)}
            </span>
          </>
        )}
      </div>
      {review.title && (
        <h3 className="font-semibold text-stone-900 text-sm">{review.title}</h3>
      )}
      <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">
        {review.body}
      </p>
    </article>
  );
}

function GoogleReviewCard({ review }: { review: GoogleReviewItem }) {
  const initial = (review.author_name || "?").trim().charAt(0).toUpperCase();
  return (
    <article className="space-y-3">
      <div className="flex items-center gap-3">
        {review.profile_photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.profile_photo_url}
            alt=""
            width={40}
            height={40}
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
            <span className="text-stone-700 font-semibold text-sm">
              {initial || "?"}
            </span>
          </div>
        )}
        <div className="min-w-0">
          <p className="font-semibold text-stone-900 text-sm truncate">
            {review.author_name}
          </p>
          <p className="text-xs text-stone-500">
            {formatReviewDate(review.published_at)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StarRow rating={review.rating} />
      </div>
      {review.text && (
        <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">
          {review.text}
        </p>
      )}
    </article>
  );
}

function GoogleGIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

type TabKey = "story" | "google";

export default function VenueReviewsBlock({
  reviews,
  google,
  googlePlaceId,
  venueId,
}: {
  reviews: ListingReview[];
  google: GoogleReviewsCache | null;
  googlePlaceId?: string | null;
  venueId: string;
}) {
  const storyCount = reviews.length;
  const storyAvg =
    storyCount > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / storyCount
      : 0;

  const hasGoogle = !!google && (google.reviews.length > 0 || google.userRatingCount > 0);
  const [tab, setTab] = useState<TabKey>(
    storyCount > 0 || !hasGoogle ? "story" : "google"
  );
  const [showAllStory, setShowAllStory] = useState(false);

  const googleAvgRaw = google?.rating ?? null;
  const googleCount = google?.userRatingCount ?? 0;

  const storySorted = useMemo(() => {
    return [...reviews].sort(
      (a, b) =>
        b.rating - a.rating ||
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [reviews]);

  const googleSorted = useMemo(() => {
    return [...(google?.reviews ?? [])].sort((a, b) => b.rating - a.rating);
  }, [google?.reviews]);

  const googleReviewsLen = google?.reviews.length ?? 0;

  // Combined stats for the summary widget
  const combinedCount = storyCount + googleCount;
  const combinedAvg = useMemo(() => {
    if (storyCount === 0 && googleCount === 0) return 0;
    if (storyCount > 0 && googleCount > 0 && googleAvgRaw != null) {
      return (storyAvg * storyCount + googleAvgRaw * googleCount) / combinedCount;
    }
    if (storyCount > 0) return storyAvg;
    return googleAvgRaw ?? 0;
  }, [storyCount, googleCount, storyAvg, googleAvgRaw, combinedCount]);

  // Distribution based solely on StoryVenue reviews — we own this data fully
  // and every individual rating is available, so the bar counts are exact.
  const distribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]; // index 0 = 1★ … 4 = 5★
    reviews.forEach((r) => {
      const idx = Math.min(Math.max(Math.round(r.rating), 1), 5) - 1;
      counts[idx] += 1;
    });
    return counts;
  }, [reviews]);

  const distributionTotal = storyCount;

  if (storyCount === 0 && !hasGoogle) return null;

  const headlineAvg = tab === "story" ? storyAvg : googleAvgRaw ?? 0;
  const headlineCount = tab === "story" ? storyCount : googleCount;

  // Google Maps link for "See all" button
  const googleMapsUrl = googlePlaceId
    ? `https://www.google.com/maps/place/?q=place_id:${googlePlaceId}`
    : null;

  // StoryVenue reviews to show
  const visibleStory =
    showAllStory || storyCount <= STORY_PREVIEW
      ? storySorted
      : storySorted.slice(0, STORY_PREVIEW);

  // Google reviews: always show first GOOGLE_PREVIEW only — rest via "See all" link
  const visibleGoogle = googleSorted.slice(0, GOOGLE_PREVIEW);

  return (
    <section id="reviews" className="mb-8 scroll-mt-24">
      {/* Section heading */}
      <h2 className="text-xl font-semibold text-stone-900 mb-6">Reviews</h2>

      {/* Combined summary widget */}
      <RatingSummary
        combinedAvg={combinedAvg}
        combinedCount={combinedCount}
        distribution={distribution}
        distributionTotal={distributionTotal}
        venueId={venueId}
      />

      {/* Per-source headline */}
      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-lg font-semibold text-stone-900 flex items-center gap-2">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" strokeWidth={0} />
          {headlineAvg > 0 ? headlineAvg.toFixed(headlineAvg === 5 ? 0 : 2) : "—"}
        </span>
        <span className="text-stone-500 text-sm">
          · {headlineCount} {headlineCount === 1 ? "review" : "reviews"}
        </span>
      </div>

      {/* Tab bar — only shown when both sources have data */}
      {hasGoogle && (
        <div className="mb-6 border-b border-stone-200">
          <div className="flex gap-0">
            <button type="button"
              onClick={() => { setTab("story"); setShowAllStory(false); }}
              className={`flex min-w-0 flex-1 items-center gap-3 border-b-2 px-3 py-3 text-left transition-colors sm:px-4 ${
                tab === "story" ? "border-stone-900 text-stone-900" : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
              aria-pressed={tab === "story"}
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white ${tab === "story" ? "bg-stone-900" : "bg-stone-400"}`}>
                <Star className="h-4 w-4 fill-white text-white" strokeWidth={0} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-stone-900">StoryVenue</span>
                <span className="block text-xs text-stone-500">
                  {storyCount > 0 ? `${storyAvg.toFixed(1)}/5` : "—"} · {storyCount} {storyCount === 1 ? "review" : "reviews"}
                </span>
              </span>
            </button>
            <button type="button"
              onClick={() => setTab("google")}
              className={`flex min-w-0 flex-1 items-center gap-3 border-b-2 px-3 py-3 text-left transition-colors sm:px-4 ${
                tab === "google" ? "border-stone-900 text-stone-900" : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
              aria-pressed={tab === "google"}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-white">
                <GoogleGIcon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-stone-900">Google</span>
                <span className="block text-xs text-stone-500">
                  {googleAvgRaw != null ? `${googleAvgRaw.toFixed(1)}/5` : "—"} · {googleCount} {googleCount === 1 ? "review" : "reviews"}
                </span>
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ── StoryVenue reviews ── */}
      {tab === "story" && (
        <>
          {storyCount === 0 ? (
            <p className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 px-4 py-10 text-center text-sm text-stone-500">
              No reviews yet.
            </p>
          ) : (
            <div className="divide-y divide-stone-100">
              {visibleStory.map((r) => (
                <div key={r.id} className="py-5 first:pt-0">
                  <StoryReviewCard review={r} />
                </div>
              ))}
            </div>
          )}
          {storyCount > STORY_PREVIEW && !showAllStory && (
            <button onClick={() => setShowAllStory(true)}
              className="mt-6 inline-flex items-center gap-1 text-stone-900 font-semibold text-sm hover:underline">
              Show all {storyCount} reviews
              <ChevronDown className="h-4 w-4" />
            </button>
          )}
        </>
      )}

      {/* ── Google reviews ── */}
      {tab === "google" && (
        <>
          {googleReviewsLen === 0 ? (
            <p className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 px-4 py-10 text-center text-sm text-stone-500">
              Google rating is synced, but no review text is available yet.
            </p>
          ) : (
            <div className="divide-y divide-stone-100">
              {visibleGoogle.map((r) => (
                <div key={`${r.author_name}-${r.published_at ?? ""}`} className="py-5 first:pt-0">
                  <GoogleReviewCard review={r} />
                </div>
              ))}
            </div>
          )}

          {/* Footer: count + See all link */}
          <div className="mt-5 flex items-center justify-between">
            <p className="text-xs text-stone-400">
              Showing {Math.min(GOOGLE_PREVIEW, googleReviewsLen)} of {googleCount > 0 ? googleCount.toLocaleString() : googleReviewsLen} Google reviews
            </p>
            {googleMapsUrl && (
              <a href={googleMapsUrl} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors">
                See all Google reviews
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </>
      )}
    </section>
  );
}
