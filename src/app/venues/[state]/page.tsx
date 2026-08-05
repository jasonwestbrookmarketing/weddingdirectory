import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin } from 'lucide-react';
import SiteFooter from '@/components/SiteFooter';
import { stateFromSlug } from '@/lib/us-states';
import { fetchAllPublishedVenues, venuesInState, citiesForState } from '@/lib/directory-venues';
import { safeJsonLd } from '@/lib/json-ld';

const SITE_URL = (
  process.env.NEXT_PUBLIC_DIRECTORY_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://storyvenue.com'
).replace(/\/$/, '');

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const stateName = stateFromSlug(state);
  if (!stateName) return { title: 'Wedding Venues', robots: { index: false } };

  const title = `Wedding Venues in ${stateName} | Compare Pricing & Availability`;
  const description = `Browse wedding venues in ${stateName}. Compare pricing, guest capacity, photos, and verified reviews, then request availability for your wedding date on StoryVenue.`;
  const canonical = `${SITE_URL}/venues/${state}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: 'website' },
  };
}

export default async function StateHubPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const stateName = stateFromSlug(state);
  if (!stateName) notFound();

  const all = await fetchAllPublishedVenues();
  const [venues, cities] = await Promise.all([
    venuesInState(stateName, all),
    citiesForState(stateName, all),
  ]);

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Wedding Venues in ${stateName}`,
    numberOfItems: venues.length,
    itemListElement: venues.slice(0, 100).map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: v.name,
      url: `${SITE_URL}/venue/${v.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListJsonLd) }} />

      <nav className="sticky top-0 z-20 border-b border-stone-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" aria-label="StoryVenue home">
            <Image src="/storyvenue-dark-logo.png" alt="StoryVenue" width={140} height={36} className="h-8 w-auto object-contain" />
          </Link>
          <Link href="/search" className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700">
            Search all venues
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-4 text-xs text-stone-400" aria-label="Breadcrumb">
          <Link href="/venues" className="hover:text-stone-600">Wedding Venues</Link>
          <span className="mx-1.5">/</span>
          <span className="text-stone-600">{stateName}</span>
        </nav>

        <h1 className="text-3xl font-bold text-stone-900">Wedding Venues in {stateName}</h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-500">
          Compare {venues.length > 0 ? `${venues.length} ` : ''}wedding {venues.length === 1 ? 'venue' : 'venues'} in {stateName}: pricing,
          guest capacity, photos, and verified couple reviews. Request pricing and check availability for your date directly from each listing.
        </p>

        {cities.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-stone-900">Browse by city</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {cities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/venues/${state}/${c.slug}`}
                  className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:border-stone-400"
                >
                  {c.name} ({c.count})
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          {venues.length === 0 ? (
            <p className="py-16 text-center text-sm text-stone-500">
              No published venues in {stateName} yet.{' '}
              <Link href="/venues" className="text-stone-900 underline">Browse other states</Link>.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {venues.map((v) => (
                <Link
                  key={v.slug}
                  href={`/venue/${v.slug}`}
                  className="group rounded-2xl border border-stone-200 bg-white p-5 transition-colors hover:border-stone-400"
                >
                  <h3 className="font-semibold text-stone-900 group-hover:underline">{v.name}</h3>
                  {(v.location_city || v.location_state) && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-stone-500">
                      <MapPin size={12} />
                      {[v.location_city, v.location_state].filter(Boolean).join(', ')}
                    </p>
                  )}
                  <p className="mt-3 text-xs font-medium text-stone-400 group-hover:text-stone-600">
                    View pricing &amp; availability →
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 border-t border-stone-200 pt-8">
          <p className="text-xs leading-relaxed text-stone-400">
            StoryVenue lists wedding venues across {stateName} including barns, ballrooms, gardens,
            historic estates, and waterfront spaces. Every listing shows transparent details couples
            care about: starting price, guest capacity, indoor and outdoor options, amenities,
            photos, and verified reviews from real weddings. Request a venue&apos;s pricing guide to
            get availability for your wedding date, then book a tour online.
          </p>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
