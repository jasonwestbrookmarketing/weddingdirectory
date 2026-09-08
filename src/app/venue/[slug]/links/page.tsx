import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, MapPin, Store, ArrowUpRight, Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { VenueSocialLinks } from "@/types/database";
import LeadLinkTracker from "@/components/venue/LeadLinkTracker";
import LeadLinkPricingCard from "./LeadLinkPricingCard";

// Demo listings are gated by a preview token, so this page must never be
// CDN-cached (the token is validated on every request).
export const dynamic = "force-dynamic";

const SITE_URL = (
  process.env.NEXT_PUBLIC_DIRECTORY_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://storyvenue.com"
).replace(/\/$/, "");

const LINKS_VENUE_SELECT =
  "id, slug, name, cover_image_url, location_city, location_state, is_published, is_demo, demo_preview_token, social_links, directory_verified_status" as const;

type LinksVenue = {
  id: string;
  slug: string | null;
  name: string | null;
  cover_image_url: string | null;
  location_city: string | null;
  location_state: string | null;
  is_published: boolean;
  is_demo: boolean | null;
  demo_preview_token: string | null;
  social_links: VenueSocialLinks | null;
  directory_verified_status: string | null;
};

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function fetchVenue(slug: string, previewToken: string | null): Promise<LinksVenue | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("venues")
    .select(LINKS_VENUE_SELECT)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  const venue = data as LinksVenue | null;
  if (!venue) return null;
  if (venue.is_demo === true) {
    if (!previewToken || previewToken !== venue.demo_preview_token) return null;
  }
  return venue;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const previewToken = typeof sp.preview === "string" ? sp.preview : null;
  const venue = await fetchVenue(slug, previewToken);
  if (!venue) return { title: "Links — StoryVenue", robots: { index: false } };

  const loc = [venue.location_city, venue.location_state].filter(Boolean).join(", ");
  const title = `${venue.name} — Links`;
  const description = `Connect with ${venue.name}${loc ? ` in ${loc}` : ""}: view the venue listing, download pricing & availability, and follow along on social.`;
  const canonical = `${SITE_URL}/venue/${slug}/links`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical },
    ...(previewToken ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      siteName: "StoryVenue",
      images: venue.cover_image_url ? [{ url: venue.cover_image_url, width: 1200, height: 630 }] : [],
    },
  };
}

// Brand icons were dropped from lucide-react 0.543+, so we ship small inline
// SVGs (same pattern as src/app/links/page.tsx).
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345c-.091.378-.293 1.194-.333 1.361-.052.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.966 7.398 6.931 0 4.136-2.608 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
    </svg>
  );
}

const SOCIAL_META: Record<
  keyof VenueSocialLinks,
  { label: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  instagram: { label: "Instagram", Icon: InstagramIcon },
  facebook: { label: "Facebook", Icon: FacebookIcon },
  tiktok: { label: "TikTok", Icon: TikTokIcon },
  pinterest: { label: "Pinterest", Icon: PinterestIcon },
  website: { label: "Website", Icon: Globe },
};

export default async function VenueLinksPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const previewToken = typeof sp.preview === "string" ? sp.preview : null;
  const venue = await fetchVenue(slug, previewToken);
  if (!venue) notFound();

  const name = venue.name ?? "This venue";
  const locationLine = [venue.location_city, venue.location_state].filter(Boolean).join(", ");
  const verified = venue.directory_verified_status === "approved";

  const socials = (Object.entries(venue.social_links ?? {}) as [keyof VenueSocialLinks, unknown][])
    .filter(([key, url]) => key in SOCIAL_META && typeof url === "string" && /^https?:\/\//i.test(url))
    .map(([key, url]) => ({ key, url: url as string }));

  const listingHref = `/venue/${venue.slug}?utm_source=lead_link&utm_medium=bio&utm_campaign=venue_listing`;

  return (
    <main className="flex min-h-screen justify-center bg-brand-warm px-4 py-12 sm:py-16">
      <LeadLinkTracker venueId={venue.id} />

      <div className="w-full max-w-[520px]">
        {/* Profile header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-brand-line bg-white shadow-[0_16px_40px_-20px_rgba(0,0,0,0.4)]">
            {venue.cover_image_url ? (
              <Image
                src={venue.cover_image_url}
                alt={name}
                fill
                priority
                unoptimized
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-brand-ink text-3xl font-semibold text-white">
                {name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="mt-5 flex items-center justify-center gap-1.5">
            <h1 className="text-2xl font-semibold text-brand-ink">{name}</h1>
            {verified && (
              <BadgeCheck className="h-5 w-5 shrink-0 text-sky-500" aria-label="Verified venue" />
            )}
          </div>
          {locationLine && (
            <p className="mt-1.5 flex items-center justify-center gap-1.5 text-sm text-brand-muted">
              <MapPin className="h-4 w-4" /> {locationLine}
            </p>
          )}
        </div>

        {/* Social icons */}
        {socials.length > 0 && (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {socials.map(({ key, url }) => {
              const { label, Icon } = SOCIAL_META[key];
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  data-track="lead_link_social_click"
                  data-track-platform={key}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-line bg-white text-brand-muted transition-all hover:-translate-y-0.5 hover:border-brand-ink hover:text-brand-ink"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              );
            })}
          </div>
        )}

        {/* Primary links */}
        <div className="mt-8 flex flex-col gap-3">
          <a
            href={listingHref}
            data-track="lead_link_click"
            data-track-platform="listing"
            className="group flex w-full items-center gap-4 rounded-2xl border border-brand-line bg-white px-5 py-4 text-left shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-ink"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-ink text-white">
              <Store className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold leading-snug text-brand-ink">
                Venue Listing
              </span>
              <span className="mt-0.5 block text-[13px] leading-snug text-brand-muted">
                Photos, reviews &amp; everything about us
              </span>
            </span>
            <ArrowUpRight className="h-5 w-5 shrink-0 text-brand-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>

          <LeadLinkPricingCard
            venueId={venue.id}
            venueName={name}
            venueSlug={venue.slug ?? slug}
          />
        </div>

        {/* Footer */}
        <p className="mt-10 text-center text-xs text-brand-muted">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:text-brand-ink hover:underline"
          >
            Powered by StoryVenue
          </Link>
        </p>
      </div>
    </main>
  );
}
