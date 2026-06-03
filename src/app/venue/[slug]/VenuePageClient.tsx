"use client";

import { useEffect, useRef, useState } from "react";
import { formatLocation, formatLocationFull } from "@/lib/format-location";
import Image from "next/image";
import {
  MapPin,
  Users,
  DollarSign,
  Sparkles,
  TreePine,
  Heart,
  Share2,
  ChevronDown,
  X,
  Check,
  Star,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import LeadFormModal from "@/components/lead/LeadFormModal";
import {
  VenueSocialButtons,
  VenueFaqSection,
  parseSocialLinks,
  parseFaq,
} from "@/components/venue/VenuePublicBlocks";
// VenueDarkMap is a "use client" component; Leaflet is loaded via dynamic
// import inside its effect, so SSR stays safe without next/dynamic gymnastics.
import VenueDarkMap from "@/components/venue/VenueDarkMap";
import VenueReviewsBlock from "@/components/venue/VenueReviewsBlock";
import { DirectoryListingBadges } from "@/components/venue/DirectoryListingBadges";
import { resolveBadges } from "@/lib/directory-badges";
import { trackEvent } from "@/lib/analytics";

const STORYPAY_URL =
  process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";
import {
  CTA_LABEL,
  VENUE_TYPES,
  INDOOR_OUTDOOR_OPTIONS,
  AMENITIES_LIST,
  CEREMONY_TYPES_LIST,
  VENUE_SETTINGS_LIST,
  SERVICES_LIST,
  getPriceScale,
  PRICE_SCALE_LABELS,
} from "@/lib/constants";

const FEATURE_GROUPS = [
  { label: "Amenities", items: AMENITIES_LIST },
  { label: "Ceremony Types", items: CEREMONY_TYPES_LIST },
  { label: "Venue Settings", items: VENUE_SETTINGS_LIST },
  { label: "Service Offerings", items: SERVICES_LIST },
] as const;
import type {
  Venue,
  ListingReview,
  GoogleReviewsCache,
} from "@/types/database";

interface VenuePageClientProps {
  venue: Venue;
  reviews: ListingReview[];
  googleReviews: GoogleReviewsCache | null;
  /** Empty string = no cover uploaded yet (placeholder shown); otherwise the cover URL. */
  guidePreviewUrl: string;
  /** When false the entire booking card and mobile CTA are hidden. */
  pricingGuideEnabled: boolean;
}

function PhotoMosaic({
  coverImage,
  galleryImages,
  venueName,
  onViewAll,
}: {
  coverImage: string | null;
  galleryImages: string[];
  venueName: string;
  // Index is the 0-based position within the combined photo array so the modal
  // can jump straight to whichever tile the user clicked.
  onViewAll: (index?: number) => void;
}) {
  // Deduplicate: cover comes first, then gallery photos that aren't the same
  // URL. The dashboard sometimes stores the cover in both cover_image_url AND
  // gallery_images (e.g. when the user stars a gallery photo as the cover),
  // which causes the same image to appear twice in the mosaic.
  const allPhotos = [
    ...(coverImage ? [coverImage] : []),
    ...galleryImages.filter((url) => url !== coverImage),
  ];

  const placeholderClass = "bg-gradient-to-br from-stone-200 to-stone-300";

  // Shared button classes for each mosaic tile. We force `cursor-default`
  // (the standard arrow cursor) instead of the hand/finger pointer so hover
  // matches the rest of the page's clickable surfaces.
  const tileBtnClass =
    "group/photo relative w-full h-full overflow-hidden cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2";
  const imgHoverClass =
    "transition-[filter,transform] duration-200 ease-out group-hover/photo:brightness-95";

  return (
    <div className="relative">
      {/* Desktop mosaic: 1 large left + 2×2 right grid */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[480px] overflow-hidden rounded-none md:rounded-2xl">
        {/* Main large photo */}
        <div className="col-span-2 row-span-2 overflow-hidden" data-photo-view-index={0}>
          {allPhotos[0] ? (
            <button
              type="button"
              onClick={() => onViewAll(0)}
              className={tileBtnClass}
              aria-label={`Open photo 1 of ${allPhotos.length}`}
            >
              <Image
                src={allPhotos[0]}
                alt={`${venueName} – Main photo`}
                fill={false}
                width={900}
                height={600}
                unoptimized
                className={`w-full h-full object-cover ${imgHoverClass}`}
                priority
              />
            </button>
          ) : (
            <div className={`w-full h-full ${placeholderClass}`} />
          )}
        </div>
        {/* Top-right two */}
        {[1, 2].map((i) => (
          <div key={i} className="overflow-hidden" data-photo-view-index={i}>
            {allPhotos[i] ? (
              <button
                type="button"
                onClick={() => onViewAll(i)}
                className={tileBtnClass}
                aria-label={`Open photo ${i + 1} of ${allPhotos.length}`}
              >
                <Image
                  src={allPhotos[i]}
                  alt={`${venueName} – Photo ${i + 1}`}
                  fill={false}
                  width={450}
                  height={300}
                  unoptimized
                  className={`w-full h-full object-cover ${imgHoverClass}`}
                />
              </button>
            ) : (
              <div className={`w-full h-full ${placeholderClass}`} />
            )}
          </div>
        ))}
        {/* Bottom-right two */}
        {[3, 4].map((i) => (
          <div key={i} className="overflow-hidden relative" data-photo-view-index={i}>
            {allPhotos[i] ? (
              <button
                type="button"
                onClick={() => onViewAll(i)}
                className={tileBtnClass}
                aria-label={`Open photo ${i + 1} of ${allPhotos.length}`}
              >
                <Image
                  src={allPhotos[i]}
                  alt={`${venueName} – Photo ${i + 1}`}
                  fill={false}
                  width={450}
                  height={300}
                  unoptimized
                  className={`w-full h-full object-cover ${imgHoverClass}`}
                />
              </button>
            ) : (
              <div className={`w-full h-full ${placeholderClass}`} />
            )}
            {/* "Show all photos" overlay on last tile */}
            {i === 4 && allPhotos.length > 5 && (
              <button
                type="button"
                onClick={() => onViewAll(4)}
                className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold text-sm hover:bg-black/50 transition-colors"
              >
                +{allPhotos.length - 5} photos
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: card-style hero with photo count badge */}
      <div className="md:hidden mx-4 mt-4 relative h-[260px] rounded-2xl overflow-hidden" data-photo-view-index={0}>
        {allPhotos[0] ? (
          <button
            type="button"
            onClick={() => onViewAll(0)}
            className="relative w-full h-full focus:outline-none"
            aria-label={`Open photo 1 of ${allPhotos.length}`}
          >
            <Image
              src={allPhotos[0]}
              alt={`${venueName} – Main photo`}
              fill
              unoptimized
              sizes="100vw"
              className="object-cover"
              priority
            />
            {/* Photo count overlay */}
            {allPhotos.length > 1 && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                <span className="grid grid-cols-2 gap-0.5 w-3 h-3">
                  {[0,1,2,3].map(n => <div key={n} className="bg-white rounded-[1px]" />)}
                </span>
                {allPhotos.length} photos
              </div>
            )}
          </button>
        ) : (
          <div className={`w-full h-full rounded-2xl ${placeholderClass}`} />
        )}
      </div>

      {/* Show all photos button */}
      {allPhotos.length > 1 && (
        <button
          type="button"
          onClick={() => onViewAll(0)}
          className="absolute bottom-4 right-4 hidden md:flex items-center gap-2 bg-white border border-stone-300 text-stone-900 text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm hover:bg-stone-50 transition-colors"
        >
          <span className="grid grid-cols-2 gap-0.5 w-4 h-4">
            {[0,1,2,3].map(n => (
              <div key={n} className="bg-stone-900 rounded-[1px]" />
            ))}
          </span>
          Show all photos
        </button>
      )}
    </div>
  );
}

function PhotoGalleryModal({
  images,
  venueName,
  initialIndex = 0,
  onClose,
}: {
  images: string[];
  venueName: string;
  initialIndex?: number;
  onClose: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // Jump to the tile the user clicked. `scrollIntoView` inside an RAF gives the
  // modal one frame to lay out before we scroll; without it the target offset
  // is 0 and we land on the first image every time.
  useEffect(() => {
    if (initialIndex <= 0) return;
    const target = itemRefs.current[initialIndex];
    if (!target) return;
    const raf = requestAnimationFrame(() => {
      target.scrollIntoView({ block: "start", behavior: "auto" });
    });
    return () => cancelAnimationFrame(raf);
  }, [initialIndex]);

  return (
    <div
      ref={scrollRef}
      className="fixed inset-0 z-50 bg-white overflow-y-auto"
    >
      <div className="sticky top-0 z-10 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-stone-900 font-medium hover:underline text-sm"
        >
          <X className="h-5 w-5" />
          Close
        </button>
        <span className="text-sm font-medium text-stone-600">
          {images.length} photos
        </span>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-4">
        {images.map((url, i) => (
          <div
            key={i}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="overflow-hidden rounded-2xl scroll-mt-20"
            data-photo-view-index={i}
          >
            <Image
              src={url}
              alt={`${venueName} – Photo ${i + 1}`}
              width={900}
              height={600}
              unoptimized
              className="w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function VenuePageClient({
  venue,
  reviews,
  googleReviews,
  guidePreviewUrl,
  pricingGuideEnabled,
}: VenuePageClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryStart, setGalleryStart] = useState(0);
  const [descExpanded, setDescExpanded] = useState(false);

  const openGallery = (index?: number) => {
    setGalleryStart(typeof index === "number" && index >= 0 ? index : 0);
    setShowGallery(true);
  };

  // Headline rating next to the title: prefer our own (moderated) aggregate;
  // fall back to Google's if we don't have StoryVenue reviews yet. Keeps the
  // inline star count honest when a venue only has Google data.
  const storyCount = reviews.length;
  const storyAvg =
    storyCount > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / storyCount
      : 0;
  const googleCount = googleReviews?.userRatingCount ?? 0;
  const googleAvg = googleReviews?.rating ?? 0;

  const hasStory = storyCount > 0;
  const hasGoogle = googleCount > 0 || (googleReviews?.reviews.length ?? 0) > 0;
  const headlineAvg = hasStory ? storyAvg : hasGoogle ? googleAvg : 0;
  const headlineCount = hasStory ? storyCount : googleCount;

  const badges = resolveBadges(venue);

  useEffect(() => {
    trackEvent("venue_page_viewed", {
      venue_id: venue.id,
      venue_name: venue.name,
    });
  }, [venue.id, venue.name]);

  const handleCTAClick = () => {
    trackEvent("lead_cta_clicked", { venue_id: venue.id });
    setIsOpen(true);
  };

  // Save heart links out to the StoryPay dashboard's save-venue bounce page.
  // Auth (bride / couple account) lives on app.storyvenue.com — this is a
  // deliberately thin link-out so we don't duplicate auth on the directory.
  const saveHref = venue.slug
    ? `${STORYPAY_URL}/couple/save/${encodeURIComponent(venue.slug)}${
        typeof window !== "undefined"
          ? `?redirect=${encodeURIComponent(window.location.href)}`
          : ""
      }`
    : `${STORYPAY_URL}/login?as=couple`;

  const handleSaveClick = () => {
    trackEvent("venue_save_clicked", {
      venue_id: venue.id,
      venue_slug: venue.slug,
    });
  };

  const handleShareClick = async () => {
    trackEvent("venue_share_clicked", { venue_id: venue.id });
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const title = venue.name || "StoryVenue";
    try {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await (navigator as Navigator & {
          share: (data: { title: string; url: string }) => Promise<void>;
        }).share({ title, url });
        return;
      }
    } catch {
      // user-cancelled or unsupported — fall through to clipboard
    }
    try {
      await navigator.clipboard?.writeText(url);
    } catch {
      // ignore — the button is decorative if neither Share API nor clipboard work
    }
  };

  const venueTypeLabel =
    VENUE_TYPES.find((t) => t.value === venue.venue_type)?.label ||
    venue.venue_type;
  const indoorOutdoorLabel = INDOOR_OUTDOOR_OPTIONS.find(
    (o) => o.value === venue.indoor_outdoor
  )?.label;
  const galleryImages = (venue.gallery_images as string[] | null) || [];
  const features = (venue.features as string[] | null) || [];
  const socialLinks = parseSocialLinks(venue.social_links);
  // Split website out so it can be rendered in the fixed order:
  // phone → email → website → social media icons
  const { website: socialWebsite, ...socialIconLinks } = socialLinks;
  const faqItems = parseFaq(venue.faq);
  const showMap =
    venue.show_map !== false && venue.lat != null && venue.lng != null;
  const hasSocial = Object.keys(socialIconLinks).length > 0;
  const hasFaq = faqItems.length > 0;
  const groupedFeatures = FEATURE_GROUPS.map((g) => ({
    label: g.label,
    labels: g.items
      .filter((item) => features.includes(item.value))
      .map((item) => item.label),
  })).filter((g) => g.labels.length > 0);
  const allPhotos = [
    ...(venue.cover_image_url ? [venue.cover_image_url] : []),
    ...galleryImages.filter((url) => url !== venue.cover_image_url),
  ];

  const descriptionText = venue.description || "";
  const DESCRIPTION_LIMIT = 280;
  const isLongDesc = descriptionText.length > DESCRIPTION_LIMIT;
  const displayedDesc =
    isLongDesc && !descExpanded
      ? descriptionText.slice(0, DESCRIPTION_LIMIT) + "…"
      : descriptionText;

  return (
    <>
      {/* Photo mosaic */}
      <div className="max-w-7xl mx-auto px-0 md:px-6 lg:px-8 pt-0 md:pt-6">
        <PhotoMosaic
          coverImage={venue.cover_image_url}
          galleryImages={galleryImages}
          venueName={venue.name || "Venue"}
          onViewAll={openGallery}
        />
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          {/* Left column */}
          <div className="min-w-0">
            {/* Title row */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-900 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <span>{venue.name}</span>
                  <DirectoryListingBadges
                    verified={badges.verified}
                    sponsored={badges.sponsored}
                    variant="onLight"
                    size="md"
                  />
                </h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-500">
                  {venue.location_full && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.location_full)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:underline"
                    >
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      {formatLocationFull(venue.location_full, venue.location_city, venue.location_state)}
                    </a>
                  )}
                </div>
                {headlineCount > 0 && (
                  <a
                    href="#reviews"
                    className="inline-flex items-center gap-1.5 mt-2 hover:underline"
                  >
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`h-5 w-5 ${
                            n <= Math.round(headlineAvg)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-stone-200 text-stone-200"
                          }`}
                          strokeWidth={0}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-stone-900 text-base">
                      {headlineAvg.toFixed(1)}
                    </span>
                    <span className="text-stone-500 text-sm">
                      ({headlineCount}{" "}
                      {headlineCount === 1 ? "review" : "reviews"})
                    </span>
                  </a>
                )}
              </div>
              {/* Action buttons — phone → email → website → social → share/save */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {venue.phone && (
                  <a
                    href={`tel:${venue.phone}`}
                    className="flex items-center justify-center h-8 w-8 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
                    aria-label="Call venue"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                )}
                {venue.email && (
                  <a
                    href={`mailto:${venue.email}`}
                    className="flex items-center justify-center h-8 w-8 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
                    aria-label="Email venue"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                )}
                {socialWebsite && (
                  <a
                    href={socialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-8 w-8 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
                    aria-label="Website"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                )}
                {hasSocial && (
                  <VenueSocialButtons
                    social={socialIconLinks}
                    size="sm"
                  />
                )}
                <span className="w-px h-5 bg-stone-300" aria-hidden />
                <button
                  onClick={handleShareClick}
                  className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-sm font-medium px-2 py-2 rounded-xl transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                <a
                  href={saveHref}
                  onClick={handleSaveClick}
                  className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-sm font-medium px-2 py-2 rounded-xl transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Save</span>
                </a>
              </div>
            </div>

            {/* Quick-stat pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {venueTypeLabel && (
                <span className="bg-stone-100 text-stone-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  {venueTypeLabel}
                </span>
              )}
              {indoorOutdoorLabel && (
                <span className="bg-stone-100 text-stone-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
                  <TreePine className="h-3.5 w-3.5" />
                  {indoorOutdoorLabel}
                </span>
              )}
              {(venue.capacity_min != null || venue.capacity_max != null) && (
                <span className="bg-stone-100 text-stone-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {venue.capacity_min && venue.capacity_max
                    ? `${venue.capacity_min}–${venue.capacity_max} guests`
                    : venue.capacity_max
                      ? `Up to ${venue.capacity_max} guests`
                      : `${venue.capacity_min}+ guests`}
                </span>
              )}
              {venue.price_min != null && getPriceScale(venue.price_min) && (
                <span className="bg-stone-100 text-stone-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  Pricing: {getPriceScale(venue.price_min)}
                </span>
              )}
            </div>

            <hr className="border-stone-200 mb-8" />

            {/* Key highlights — two across on sm+ so Capacity/Pricing sit
                side by side, then Venue Style/Setting wrap onto the next row. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-8">
              {(venue.capacity_min != null || venue.capacity_max != null) && (
                <div className="flex items-start gap-4">
                  <Users className="h-6 w-6 text-stone-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-stone-900">Capacity</p>
                    <p className="text-stone-500 text-sm">
                      {venue.capacity_min && venue.capacity_max
                        ? `${venue.capacity_min}–${venue.capacity_max} guests`
                        : venue.capacity_max
                          ? `Up to ${venue.capacity_max} guests`
                          : `${venue.capacity_min}+ guests`}
                    </p>
                  </div>
                </div>
              )}
              {venue.price_min != null && getPriceScale(venue.price_min) && (
                <div className="flex items-start gap-4">
                  <DollarSign className="h-6 w-6 text-stone-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-stone-900">Pricing</p>
                    <p className="text-stone-500 text-sm">
                      <span className="font-semibold text-stone-700">Pricing: {getPriceScale(venue.price_min)}</span>
                      {" · "}{PRICE_SCALE_LABELS[getPriceScale(venue.price_min)!]}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">Inquire for exact pricing</p>
                  </div>
                </div>
              )}
              {venueTypeLabel && (
                <div className="flex items-start gap-4">
                  <Sparkles className="h-6 w-6 text-stone-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-stone-900">Venue Style</p>
                    <p className="text-stone-500 text-sm">{venueTypeLabel}</p>
                  </div>
                </div>
              )}
              {indoorOutdoorLabel && (
                <div className="flex items-start gap-4">
                  <TreePine className="h-6 w-6 text-stone-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-stone-900">Setting</p>
                    <p className="text-stone-500 text-sm">{indoorOutdoorLabel}</p>
                  </div>
                </div>
              )}
            </div>

            <hr className="border-stone-200 mb-8" />

            {/* About */}
            {descriptionText && (
              <>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-stone-900 mb-4">
                    About {venue.name || "this venue"}
                  </h2>
                  <p className="text-stone-700 leading-relaxed text-base whitespace-pre-line">
                    {displayedDesc}
                  </p>
                  {isLongDesc && (
                    <button
                      onClick={() => setDescExpanded(!descExpanded)}
                      className="flex items-center gap-1 mt-3 text-stone-900 font-semibold text-sm hover:underline"
                    >
                      {descExpanded ? "Show less" : "Show more"}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${descExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </div>
                <hr className="border-stone-200 mb-8" />
              </>
            )}

            {/* Reviews — tabs appear when Google is connected */}
            {(hasStory || hasGoogle) && (
              <>
                <VenueReviewsBlock
                  reviews={reviews}
                  google={googleReviews}
                  googlePlaceId={venue.google_place_id ?? null}
                  venueId={venue.id}
                />
                <hr className="border-stone-200 mb-8" />
              </>
            )}

            {/* Features & Amenities — grouped */}
            {groupedFeatures.length > 0 && (
              <>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-stone-900 mb-6">
                    What this venue offers
                  </h2>
                  <div className="space-y-6">
                    {groupedFeatures.map((group) => (
                      <div key={group.label}>
                        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
                          {group.label}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {group.labels.map((label) => (
                            <div key={label} className="flex items-center gap-3">
                              <Check className="h-4 w-4 text-stone-500 flex-shrink-0" />
                              <span className="text-stone-700 text-sm">{label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <hr className="border-stone-200 mb-8" />
              </>
            )}

            {/* Map */}
            {showMap && venue.lat != null && venue.lng != null && (
              <>
                <section className="mb-8">
                  <VenueDarkMap
                    lat={venue.lat}
                    lng={venue.lng}
                    venueName={venue.name}
                  />
                  {venue.location_full && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.location_full)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 hover:underline transition-colors"
                    >
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                      {formatLocationFull(venue.location_full, venue.location_city, venue.location_state)}
                    </a>
                  )}
                </section>
                <hr className="border-stone-200 mb-8" />
              </>
            )}

            {/* FAQ */}
            {hasFaq && (
              <>
                <div className="mb-8">
                  <VenueFaqSection items={faqItems} />
                </div>
                <hr className="border-stone-200 mb-8" />
              </>
            )}

            {/* Vision section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-stone-900 mb-6">
                Imagine your day here
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-stone-700" />
                  </div>
                  <h3 className="font-semibold text-stone-900 text-sm">Your Ceremony</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    Exchange vows in a{" "}
                    {venueTypeLabel
                      ? `beautiful ${venueTypeLabel.toLowerCase()} setting`
                      : "stunning setting"}
                    {indoorOutdoorLabel
                      ? `, ${indoorOutdoorLabel.toLowerCase()}`
                      : ""}
                    , surrounded by the ones you love.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-stone-700" />
                  </div>
                  <h3 className="font-semibold text-stone-900 text-sm">The Reception</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    Celebrate with
                    {venue.capacity_max ? ` up to ${venue.capacity_max}` : " your"}{" "}
                    guests as the evening unfolds with dinner, dancing, and
                    unforgettable moments.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-stone-700" />
                  </div>
                  <h3 className="font-semibold text-stone-900 text-sm">Guest Experience</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    From arrival to last dance, every moment flows naturally in
                    a space designed for celebration and connection.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column — sticky booking card (only when plan allows pricing guide) */}
          {pricingGuideEnabled && <div className="hidden lg:block">
            <div className="sticky top-[88px]">
              <div className="border border-stone-200 rounded-2xl shadow-lg p-6 bg-white max-h-[calc(100vh-104px)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {/* Pricing guide cover — replaces the stats box entirely.
                    Always shown: real cover when uploaded, placeholder otherwise. */}
                <button
                  type="button"
                  onClick={handleCTAClick}
                  className="w-full mb-4 group relative rounded-xl overflow-hidden border border-stone-200 focus:outline-none"
                  aria-label="Preview pricing guide — click to download"
                >
                  {/* 8.5 × 11 portrait aspect ratio */}
                  <div style={{ paddingTop: "129.41%" }} className="relative w-full">
                    {guidePreviewUrl ? (
                      <img
                        src={guidePreviewUrl}
                        alt="Pricing guide preview"
                        className="absolute inset-0 w-full h-full object-cover object-top"
                      />
                    ) : (
                      /* Placeholder when no cover has been uploaded yet */
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100 gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-stone-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="text-xs text-stone-400 font-medium text-center px-4">
                          Cover coming soon
                        </p>
                      </div>
                    )}

                    {/* Always-visible centered title */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                      <span
                        className="text-white text-lg text-center leading-snug drop-shadow-lg px-4"
                        style={{ fontFamily: "var(--font-playfair)", fontWeight: 300 }}
                      >
                        Pricing &amp; Availability Guide
                      </span>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="text-white text-xs font-semibold tracking-wide drop-shadow bg-black/40 rounded-lg px-3 py-1.5">
                        Click to download ↓
                      </span>
                    </div>

                    {/* Free Guide badge */}
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-[11px] font-semibold text-stone-700 shadow-sm">
                      Free Guide
                    </div>
                  </div>
                </button>

                <Button
                  size="lg"
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm whitespace-nowrap"
                  onClick={handleCTAClick}
                >
                  {CTA_LABEL}
                </Button>

              </div>
            </div>
          </div>}
        </div>
      </div>

      {/* Mobile sticky CTA (only when plan allows pricing guide) */}
      {pricingGuideEnabled && <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-stone-200 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between gap-4">
          {venue.price_min != null && getPriceScale(venue.price_min) && (
            <div>
              <span className="text-xs text-stone-500">Pricing: </span>
              <span className="text-lg font-bold tracking-wide text-stone-900">
                {getPriceScale(venue.price_min)}
              </span>
            </div>
          )}
          <Button
            size="md"
            className="flex-1 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm whitespace-nowrap"
            onClick={handleCTAClick}
          >
            {CTA_LABEL}
          </Button>
        </div>
      </div>}

      {/* Spacer for mobile sticky CTA */}
      {pricingGuideEnabled && <div className="h-20 lg:hidden" />}

      {/* Photo gallery modal */}
      {showGallery && (
        <PhotoGalleryModal
          images={allPhotos}
          venueName={venue.name || "Venue"}
          initialIndex={galleryStart}
          onClose={() => setShowGallery(false)}
        />
      )}

      {/* Lead Form Modal */}
      <LeadFormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        venueId={venue.id}
        venueName={venue.name || undefined}
        venueSlug={venue.slug || undefined}
        venueWebsite={venue.brand_website || undefined}
      />
    </>
  );
}
