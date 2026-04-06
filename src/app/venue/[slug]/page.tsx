import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import VenuePageClient from "./VenuePageClient";
import type { Metadata } from "next";

export const revalidate = 60;

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

  return (
    <div className="min-h-screen bg-white">
      {/* Airbnb-style white top nav */}
      <nav className="sticky top-0 z-30 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" aria-label="StoryVenue home">
            <Image
              src="/storyvenue-dark-logo.png"
              alt="StoryVenue"
              width={140}
              height={36}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium text-stone-700 hover:text-stone-900 border border-stone-200 hover:border-stone-300 px-4 py-2 rounded-xl transition-colors"
          >
            List Your Venue
          </Link>
        </div>
      </nav>
      <VenuePageClient venue={venue} />
    </div>
  );
}
