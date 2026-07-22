import { MetadataRoute } from 'next';
import { fetchAllPublishedVenues, statesWithVenues, citiesForState } from '@/lib/directory-venues';
import { stateSlug, stateFullName, citySlug } from '@/lib/us-states';

const SITE_URL = (
  process.env.NEXT_PUBLIC_DIRECTORY_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://storyvenue.com'
).replace(/\/$/, '');

/**
 * Dynamic sitemap: static pages + every published venue listing + the
 * city/state hub pages derived from where those venues are located.
 * Revalidated hourly so new go-live listings surface quickly.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL,             lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/venues`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  ];

  const venues = await fetchAllPublishedVenues();

  // Venue listing pages
  for (const v of venues) {
    entries.push({
      url: `${SITE_URL}/venue/${v.slug}`,
      lastModified: v.updated_at ? new Date(v.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // State hub pages
  const states = await statesWithVenues(venues);
  for (const s of states) {
    entries.push({
      url: `${SITE_URL}/venues/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    });
  }

  // City hub pages
  for (const s of states) {
    const cities = await citiesForState(stateFullName(s.name), venues);
    for (const c of cities) {
      entries.push({
        url: `${SITE_URL}/venues/${stateSlug(s.name)}/${citySlug(c.name)}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.6,
      });
    }
  }

  return entries;
}
