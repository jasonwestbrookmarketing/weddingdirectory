import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import VenuePageClient from "./VenuePageClient";
import type { Metadata } from "next";

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
    <>
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-12 py-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          StoryVenue
        </Link>
        <Link
          href="/signup"
          className="text-sm font-medium text-white/80 hover:text-white transition-colors"
        >
          List Your Venue
        </Link>
      </nav>
      <VenuePageClient venue={venue} />
    </>
  );
}
