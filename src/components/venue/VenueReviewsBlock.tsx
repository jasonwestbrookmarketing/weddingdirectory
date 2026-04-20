"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Star } from "lucide-react";
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

const PREVIEW_LIMIT = 4;

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
              ? "fill-stone-900 text-stone-900"
              : "fill-stone-200 text-stone-200"
          }`}
          strokeWidth={0}
        />
      ))}
    </span>
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
}: {
  reviews: ListingReview[];
  google: GoogleReviewsCache | null;
}) {
  const storyCount = reviews.length;
  const storyAvg =
    storyCount > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / storyCount
      : 0;

  const hasGoogle = !!google && (google.reviews.length > 0 || google.userRatingCount > 0);
  // Default to whichever tab actually has review text on load. If both, StoryVenue wins.
  const [tab, setTab] = useState<TabKey>(
    storyCount > 0 || !hasGoogle ? "story" : "google"
  );
  const [showAll, setShowAll] = useState(false);

  const googleAvgRaw = google?.rating ?? null;
  const googleCount = google?.userRatingCount ?? 0;

  // Sorted copies so "top reviews first" feels natural.
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

  // Nothing to render either side — caller decides to hide the whole block.
  if (storyCount === 0 && !hasGoogle) return null;

  const activeList: Array<ListingReview | GoogleReviewItem> =
    tab === "story" ? storySorted : googleSorted;
  const activeCount = tab === "story" ? storyCount : googleReviewsLen;
  const visibleList =
    showAll || activeCount <= PREVIEW_LIMIT
      ? activeList
      : activeList.slice(0, PREVIEW_LIMIT);

  // Aggregate rating shown next to the section heading — mirror the active tab
  // so clicking between tabs updates the big number in sync.
  const headlineAvg = tab === "story" ? storyAvg : googleAvgRaw ?? 0;
  const headlineCount = tab === "story" ? storyCount : googleCount;

  return (
    <section id="reviews" className="mb-8 scroll-mt-24">
      <div className="flex items-baseline gap-3 mb-6">
        <h2 className="text-xl font-semibold text-stone-900 flex items-center gap-2">
          <Star
            className="h-5 w-5 fill-stone-900 text-stone-900"
            strokeWidth={0}
          />
          {headlineAvg > 0 ? headlineAvg.toFixed(headlineAvg === 5 ? 0 : 2) : "—"}
        </h2>
        <span className="text-stone-500 text-sm">
          · {headlineCount} {headlineCount === 1 ? "review" : "reviews"}
        </span>
      </div>

      {hasGoogle && (
        <div className="mb-6 border-b border-stone-200">
          <div className="flex gap-0">
            <button
              type="button"
              onClick={() => {
                setTab("story");
                setShowAll(false);
              }}
              className={`flex min-w-0 flex-1 items-center gap-3 border-b-2 px-3 py-3 text-left transition-colors sm:px-4 ${
                tab === "story"
                  ? "border-stone-900 text-stone-900"
                  : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
              aria-pressed={tab === "story"}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white ${
                  tab === "story" ? "bg-stone-900" : "bg-stone-400"
                }`}
              >
                <Star className="h-4 w-4 fill-white text-white" strokeWidth={0} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-stone-900">
                  StoryVenue
                </span>
                <span className="block text-xs text-stone-500">
                  {storyCount > 0 ? `${storyAvg.toFixed(1)}/5` : "—"} ·{" "}
                  {storyCount} {storyCount === 1 ? "review" : "reviews"}
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("google");
                setShowAll(false);
              }}
              className={`flex min-w-0 flex-1 items-center gap-3 border-b-2 px-3 py-3 text-left transition-colors sm:px-4 ${
                tab === "google"
                  ? "border-stone-900 text-stone-900"
                  : "border-transparent text-stone-500 hover:text-stone-800"
              }`}
              aria-pressed={tab === "google"}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-white">
                <GoogleGIcon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-stone-900">
                  Google
                </span>
                <span className="block text-xs text-stone-500">
                  {googleAvgRaw != null ? `${googleAvgRaw.toFixed(1)}/5` : "—"} ·{" "}
                  {googleCount} {googleCount === 1 ? "review" : "reviews"}
                </span>
              </span>
            </button>
          </div>
        </div>
      )}

      {activeCount === 0 ? (
        <p className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 px-4 py-10 text-center text-sm text-stone-500">
          {tab === "google"
            ? "Google rating is synced, but no review text has been published for this venue yet."
            : "No reviews yet."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
          {visibleList.map((r) =>
            tab === "story" ? (
              <StoryReviewCard
                key={(r as ListingReview).id}
                review={r as ListingReview}
              />
            ) : (
              <GoogleReviewCard
                // Google reviews don't carry stable IDs — combine author +
                // published_at for a reasonable React key.
                key={`${(r as GoogleReviewItem).author_name}-${
                  (r as GoogleReviewItem).published_at ?? ""
                }`}
                review={r as GoogleReviewItem}
              />
            )
          )}
        </div>
      )}

      {activeCount > PREVIEW_LIMIT && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-6 inline-flex items-center gap-1 text-stone-900 font-semibold text-sm hover:underline"
        >
          Show all {activeCount} reviews
          <ChevronDown className="h-4 w-4" />
        </button>
      )}

      {tab === "google" && hasGoogle && (
        <p className="mt-6 text-center text-[11px] text-stone-400">
          Reviews from Google Maps · counts reflect Google data
        </p>
      )}
    </section>
  );
}
