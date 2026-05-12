"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { getPriceScale, PRICE_SCALE_LABELS } from "@/lib/constants";
import { resolveBadges } from "@/lib/directory-badges";
import { DirectoryListingBadges } from "@/components/venue/DirectoryListingBadges";
import type { Venue } from "@/types/database";

type VenueCardData = Pick<
  Venue,
  | "id"
  | "name"
  | "slug"
  | "location_full"
  | "cover_image_url"
  | "capacity_min"
  | "capacity_max"
  | "price_min"
  | "venue_type"
  | "directory_verified_status"
  | "directory_sponsored_status"
>;

interface VenueCardProps {
  venue: VenueCardData;
}

export default function VenueCard({ venue }: VenueCardProps) {
  const handleClick = () => {
    trackEvent("venue_card_clicked", {
      venue_id: venue.id,
      venue_name: venue.name,
    });
  };

  const { verified, sponsored } = resolveBadges(venue);
  const scale = getPriceScale(venue.price_min);
  const scaleLabel = scale ? PRICE_SCALE_LABELS[scale] : null;

  return (
    <Link
      href={`/venue/${venue.slug}`}
      onClick={handleClick}
      className="group block"
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-xl">
        {venue.cover_image_url ? (
          <Image
            src={venue.cover_image_url}
            alt={venue.name || "Venue"}
            width={600}
            height={420}
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="aspect-[4/3] w-full bg-stone-100 flex items-center justify-center rounded-xl">
            <MapPin className="h-10 w-10 text-stone-300" />
          </div>
        )}
        {sponsored && (
          <div className="absolute top-3 left-3">
            <DirectoryListingBadges verified={false} sponsored variant="onDark" size="sm" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        <h3 className="font-bold text-base text-stone-900 group-hover:text-stone-700 transition-colors flex items-center gap-1.5">
          <span className="truncate">{venue.name || "Unnamed Venue"}</span>
          {verified && (
            <DirectoryListingBadges verified sponsored={false} variant="onLight" size="sm" />
          )}
        </h3>

        {venue.location_full && (
          <p className="text-stone-500 text-sm flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-stone-400" />
            {venue.location_full}
          </p>
        )}

        {scale && scaleLabel && (
          <p className="text-sm text-stone-700 mt-1">
            <span className="font-semibold text-stone-900">{scale}</span>
            <span className="text-stone-400"> · </span>
            <span>{scaleLabel}</span>
          </p>
        )}
      </div>
    </Link>
  );
}
