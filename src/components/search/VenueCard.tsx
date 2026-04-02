"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Users } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
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

  return (
    <Link
      href={`/venue/${venue.slug}`}
      onClick={handleClick}
      className="group block"
    >
      <div className="overflow-hidden rounded-xl">
        {venue.cover_image_url ? (
          <Image
            src={venue.cover_image_url}
            alt={venue.name || "Venue"}
            width={600}
            height={450}
            unoptimized
            className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="aspect-[4/3] w-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
            <MapPin className="h-10 w-10 text-stone-300" />
          </div>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="font-semibold text-lg text-stone-900 group-hover:text-stone-700 transition-colors">
          {venue.name || "Unnamed Venue"}
        </h3>
        {venue.location_full && (
          <p className="text-stone-500 text-sm flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {venue.location_full}
          </p>
        )}
        <div className="flex items-center justify-between pt-1">
          {venue.price_min != null && (
            <span className="text-sm font-medium text-stone-900">
              From ${venue.price_min.toLocaleString()}
            </span>
          )}
          {(venue.capacity_min != null || venue.capacity_max != null) && (
            <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded-full flex items-center gap-1">
              <Users className="h-3 w-3" />
              {venue.capacity_min && venue.capacity_max
                ? `${venue.capacity_min}–${venue.capacity_max}`
                : venue.capacity_max
                  ? `Up to ${venue.capacity_max}`
                  : `${venue.capacity_min}+`}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
