import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import VenuePageClient from "./VenuePageClient";
import type { Metadata } from "next";

export const revalidate = 60;

const STORYPAY_URL =
  process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: venue } = await supabase
    .from("venues")
    .select("name, description, location_full, cover_image_url")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!venue) return { title: "Venue Not Found — StoryVenue" };

  return {
    title: `${venue.name} — StoryVenue`,
    description:
      venue.description?.slice(0, 160) ||
      `Discover ${venue.name} on StoryVenue`,
    openGraph: {
      title: `${venue.name} — StoryVenue`,
      description:
        venue.description?.slice(0, 160) ||
        `Discover ${venue.name} on StoryVenue`,
      images: venue.cover_image_url ? [venue.cover_image_url] : [],
    },
  };
}

export default async function VenuePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: venue } = await supabase
    .from("venues")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!venue) notFound();

  // Reviews live on a dedicated public view (listing_reviews_public) that
  // already filters to status = 'published' and hides moderation columns.
  // If the view isn't present yet (e.g. a Supabase project that hasn't run
  // migration 025), fall back to an empty list rather than 500-ing the page.
  const { data: reviewsData } = await supabase
    .from("listing_reviews_public")
    .select(
      "id, venue_id, rating, title, body, reviewer_name, wedding_date, created_at"
    )
    .eq("venue_id", venue.id)
    .order("created_at", { ascending: false });

  const reviews = reviewsData ?? [];

  return (
    <div className="min-h-screen bg-white">
      {/* Airbnb-style white top nav */}
      <nav className="sticky top-0 z-30 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between h-16 gap-3">
          <Link href="/" aria-label="StoryVenue home" className="shrink-0">
            <Image
              src="/storyvenue-dark-logo.png"
              alt="StoryVenue"
              width={140}
              height={36}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <a
              href={`${STORYPAY_URL}/couple/login`}
              className="hidden sm:inline text-sm font-medium text-stone-600 hover:text-stone-900 px-3 py-2 rounded-xl transition-colors"
            >
              Bride Login
            </a>
            <a
              href={`${STORYPAY_URL}/couple/signup`}
              className="text-sm font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 sm:px-4 py-2 rounded-xl transition-colors"
            >
              Join
            </a>
            <span className="hidden md:inline-block w-px h-5 bg-stone-200 mx-1" />
            <a
              href={`${STORYPAY_URL}/signup`}
              className="hidden md:inline text-sm font-medium text-stone-700 hover:text-stone-900 border border-stone-200 hover:border-stone-300 px-4 py-2 rounded-xl transition-colors"
            >
              List Your Venue
            </a>
          </div>
        </div>
      </nav>
      <VenuePageClient venue={venue} reviews={reviews} />
    </div>
  );
}
