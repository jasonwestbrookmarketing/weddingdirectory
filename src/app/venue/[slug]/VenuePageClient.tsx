"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  MapPin,
  Users,
  DollarSign,
  Sparkles,
  TreePine,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import LeadFormModal from "@/components/lead/LeadFormModal";
import { trackEvent } from "@/lib/analytics";
import {
  CTA_LABEL,
  VENUE_TYPES,
  INDOOR_OUTDOOR_OPTIONS,
  FEATURES_LIST,
} from "@/lib/constants";
import type { Venue } from "@/types/database";

interface VenuePageClientProps {
  venue: Venue;
}

export default function VenuePageClient({ venue }: VenuePageClientProps) {
  const [isOpen, setIsOpen] = useState(false);

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

  const venueTypeLabel =
    VENUE_TYPES.find((t) => t.value === venue.venue_type)?.label ||
    venue.venue_type;
  const indoorOutdoorLabel = INDOOR_OUTDOOR_OPTIONS.find(
    (o) => o.value === venue.indoor_outdoor
  )?.label;
  const galleryImages = (venue.gallery_images as string[] | null) || [];
  const features = (venue.features as string[] | null) || [];
  const featureLabels = features.map(
    (f) => FEATURES_LIST.find((fl) => fl.value === f)?.label || f
  );

  return (
    <>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px]">
        {venue.cover_image_url ? (
          <Image
            src={venue.cover_image_url}
            alt={venue.name || "Venue"}
            fill
            unoptimized
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-300" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-3">
              {venue.name}
            </h1>
            {venue.location_full && (
              <p className="flex items-center gap-2 text-lg text-white/80 mb-6">
                <MapPin className="h-5 w-5" />
                {venue.location_full}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              {venueTypeLabel && (
                <span className="bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  {venueTypeLabel}
                </span>
              )}
              {(venue.capacity_min != null || venue.capacity_max != null) && (
                <span className="bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {venue.capacity_min && venue.capacity_max
                    ? `${venue.capacity_min}–${venue.capacity_max} guests`
                    : venue.capacity_max
                      ? `Up to ${venue.capacity_max} guests`
                      : `${venue.capacity_min}+ guests`}
                </span>
              )}
              {venue.price_min != null && (
                <span className="bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4" />
                  From ${venue.price_min.toLocaleString()}
                  {venue.price_max != null &&
                    ` – $${venue.price_max.toLocaleString()}`}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      {venue.description && (
        <section className="py-20 px-6">
          <div className="max-w-2xl mx-auto">
            <p className="text-lg md:text-xl leading-relaxed text-stone-700 whitespace-pre-line">
              {venue.description}
            </p>
          </div>
        </section>
      )}

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-900 mb-8">
              Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((url, i) => (
                <div
                  key={i}
                  className={`overflow-hidden rounded-xl ${
                    i === 0 ? "col-span-2 row-span-2" : ""
                  }`}
                >
                  <Image
                    src={url}
                    alt={`${venue.name} – Photo ${i + 1}`}
                    width={800}
                    height={600}
                    unoptimized
                    className="w-full h-full object-cover aspect-[4/3] hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Key Details */}
      <section className="py-16 px-6 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-900 mb-10">
            Key Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(venue.capacity_min != null || venue.capacity_max != null) && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-stone-500">
                  <Users className="h-5 w-5" />
                  <span className="text-sm font-medium uppercase tracking-wider">
                    Capacity
                  </span>
                </div>
                <p className="text-2xl font-semibold text-stone-900">
                  {venue.capacity_min && venue.capacity_max
                    ? `${venue.capacity_min} – ${venue.capacity_max}`
                    : venue.capacity_max || `${venue.capacity_min}+`}
                </p>
                <p className="text-sm text-stone-500">guests</p>
              </div>
            )}

            {venue.price_min != null && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-stone-500">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm font-medium uppercase tracking-wider">
                    Pricing
                  </span>
                </div>
                <p className="text-2xl font-semibold text-stone-900">
                  ${venue.price_min.toLocaleString()}
                  {venue.price_max != null &&
                    ` – $${venue.price_max.toLocaleString()}`}
                </p>
                <p className="text-sm text-stone-500">starting price</p>
              </div>
            )}

            {venueTypeLabel && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-stone-500">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-medium uppercase tracking-wider">
                    Style
                  </span>
                </div>
                <p className="text-2xl font-semibold text-stone-900">
                  {venueTypeLabel}
                </p>
              </div>
            )}

            {indoorOutdoorLabel && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-stone-500">
                  <TreePine className="h-5 w-5" />
                  <span className="text-sm font-medium uppercase tracking-wider">
                    Setting
                  </span>
                </div>
                <p className="text-2xl font-semibold text-stone-900">
                  {indoorOutdoorLabel}
                </p>
              </div>
            )}
          </div>

          {featureLabels.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-stone-900 mb-4">
                Features & Amenities
              </h3>
              <div className="flex flex-wrap gap-2">
                {featureLabels.map((label, i) => (
                  <span
                    key={i}
                    className="bg-white border border-stone-200 px-4 py-2 rounded-full text-sm text-stone-700"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Imagine Your Day Here */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900 mb-4">
            Imagine Your Day Here
          </h2>
          <p className="text-stone-500 text-lg">
            Every great love story deserves a stunning setting
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4 p-8">
            <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mx-auto">
              <Heart className="h-7 w-7 text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold text-stone-900">
              Your Ceremony
            </h3>
            <p className="text-stone-500 leading-relaxed">
              Picture exchanging vows in a{" "}
              {venueTypeLabel
                ? `beautiful ${venueTypeLabel.toLowerCase()} setting`
                : "stunning setting"}
              {indoorOutdoorLabel
                ? `, ${indoorOutdoorLabel.toLowerCase()}`
                : ""}
              , surrounded by your loved ones.
            </p>
          </div>
          <div className="text-center space-y-4 p-8">
            <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mx-auto">
              <Sparkles className="h-7 w-7 text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold text-stone-900">
              The Reception
            </h3>
            <p className="text-stone-500 leading-relaxed">
              Celebrate with
              {venue.capacity_max ? ` up to ${venue.capacity_max}` : " your"}{" "}
              guests as the evening unfolds with dinner, dancing, and
              unforgettable moments.
            </p>
          </div>
          <div className="text-center space-y-4 p-8">
            <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mx-auto">
              <Users className="h-7 w-7 text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold text-stone-900">
              Guest Experience
            </h3>
            <p className="text-stone-500 leading-relaxed">
              From arrival to last dance, every moment flows naturally in a
              space designed for celebration and connection.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Block */}
      <section className="py-24 px-6 text-center bg-stone-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900 mb-4">
            Ready to Visit?
          </h2>
          <p className="text-stone-500 text-lg mb-8">
            Get pricing details and check availability for your preferred dates.
          </p>
          <Button
            size="lg"
            className="bg-rose-600 hover:bg-rose-700 text-white"
            onClick={handleCTAClick}
          >
            {CTA_LABEL}
          </Button>
        </div>
      </section>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-stone-200 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button
          size="lg"
          className="w-full bg-rose-600 hover:bg-rose-700 text-white"
          onClick={handleCTAClick}
        >
          {CTA_LABEL}
        </Button>
      </div>

      {/* Spacer for mobile sticky CTA */}
      <div className="h-20 md:hidden" />

      {/* Lead Form Modal */}
      <LeadFormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        venueId={venue.id}
      />
    </>
  );
}
