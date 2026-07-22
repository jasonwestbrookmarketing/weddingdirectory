import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import SiteFooter from '@/components/SiteFooter';
import { fetchAllPublishedVenues, statesWithVenues } from '@/lib/directory-venues';

const SITE_URL = (
  process.env.NEXT_PUBLIC_DIRECTORY_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://storyvenue.com'
).replace(/\/$/, '');

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Wedding Venues by State | Compare Pricing & Availability';
  const description =
    'Browse wedding venues across the United States on StoryVenue. Compare pricing, guest capacity, photos, and verified reviews, then request availability for your wedding date.';
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: `${SITE_URL}/venues` },
    openGraph: { title, description, url: `${SITE_URL}/venues`, type: 'website' },
  };
}

export default async function VenuesIndexPage() {
  const all = await fetchAllPublishedVenues();
  const states = await statesWithVenues(all);

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="sticky top-0 z-20 border-b border-stone-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" aria-label="StoryVenue home">
            <Image src="/storyvenue-dark-logo.png" alt="StoryVenue" width={140} height={36} className="h-8 w-auto object-contain" />
          </Link>
          <Link
            href="/search"
            className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700"
          >
            Search venues
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-stone-900">Wedding Venues by State</h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-500">
          Browse {all.length > 0 ? `${all.length} ` : ''}wedding venues on StoryVenue. Compare pricing,
          guest capacity, photos, and verified couple reviews, then request availability for your date.
        </p>

        {states.length === 0 ? (
          <p className="py-16 text-center text-sm text-stone-500">
            No published venues yet. <Link href="/search" className="text-stone-900 underline">Search venues</Link>.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {states.map((s) => (
              <Link
                key={s.slug}
                href={`/venues/${s.slug}`}
                className="group rounded-2xl border border-stone-200 bg-white p-4 transition-colors hover:border-stone-400"
              >
                <span className="font-semibold text-stone-900 group-hover:underline">{s.name}</span>
                <span className="mt-0.5 block text-xs text-stone-400">
                  {s.count} {s.count === 1 ? 'venue' : 'venues'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
