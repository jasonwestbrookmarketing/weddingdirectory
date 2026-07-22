/**
 * Server-side data helpers for SEO surfaces (sitemap + city/state hub pages).
 *
 * Reads published venues directly from Supabase via the public anon client
 * (same read-only RLS the venue pages use). No dependency on the dashboard API.
 */

import { createClient } from '@/lib/supabase/server';
import { stateFullName, stateSlug, citySlug } from '@/lib/us-states';

export interface DirectoryVenue {
  slug: string;
  name: string;
  updated_at: string | null;
  location_city: string | null;
  location_state: string | null;
}

/**
 * Every published, non-demo venue (slug + name + location). Paginates past the
 * PostgREST 1,000-row cap. Cached at the route level via `revalidate`.
 */
export async function fetchAllPublishedVenues(): Promise<DirectoryVenue[]> {
  try {
    const supabase = await createClient();
    const pageSize = 1000;
    const out: DirectoryVenue[] = [];
    for (let from = 0; from < 20_000; from += pageSize) {
      const { data, error } = await supabase
        .from('venues')
        .select('slug, name, updated_at, location_city, location_state, is_demo')
        .eq('is_published', true)
        .not('slug', 'is', null)
        .order('updated_at', { ascending: false })
        .range(from, from + pageSize - 1);
      if (error || !data || data.length === 0) break;
      for (const v of data as Array<DirectoryVenue & { is_demo: boolean | null }>) {
        if (v.is_demo === true) continue;
        if (!v.slug) continue;
        out.push({
          slug: v.slug,
          name: v.name,
          updated_at: v.updated_at,
          location_city: v.location_city,
          location_state: v.location_state,
        });
      }
      if (data.length < pageSize) break;
    }
    return out;
  } catch {
    return [];
  }
}

/** Published venues in a given state (matches "NC" or "North Carolina" storage). */
export async function venuesInState(stateName: string, all?: DirectoryVenue[]): Promise<DirectoryVenue[]> {
  const list = all ?? (await fetchAllPublishedVenues());
  const target = stateSlug(stateName);
  return list.filter(
    (v) => v.location_state && stateSlug(stateFullName(v.location_state)) === target,
  );
}

/** Published venues in a given city within a state (exact city-slug match). */
export async function venuesInCity(
  stateName: string,
  cityParamSlug: string,
  all?: DirectoryVenue[],
): Promise<DirectoryVenue[]> {
  const inState = await venuesInState(stateName, all);
  return inState.filter((v) => v.location_city && citySlug(v.location_city) === cityParamSlug);
}

/** Distinct cities (display name + slug + count) with published venues in a state. */
export async function citiesForState(
  stateName: string,
  all?: DirectoryVenue[],
): Promise<Array<{ name: string; slug: string; count: number }>> {
  const inState = await venuesInState(stateName, all);
  const byCity = new Map<string, { name: string; count: number }>();
  for (const v of inState) {
    if (!v.location_city) continue;
    const key = citySlug(v.location_city);
    const cur = byCity.get(key);
    if (cur) cur.count++;
    else byCity.set(key, { name: v.location_city.trim(), count: 1 });
  }
  return [...byCity.entries()]
    .map(([slug, { name, count }]) => ({ name, slug, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** Distinct states (display name + slug + count) that have published venues. */
export async function statesWithVenues(
  all?: DirectoryVenue[],
): Promise<Array<{ name: string; slug: string; count: number }>> {
  const list = all ?? (await fetchAllPublishedVenues());
  const byState = new Map<string, { name: string; count: number }>();
  for (const v of list) {
    if (!v.location_state) continue;
    const name = stateFullName(v.location_state);
    const key = stateSlug(name);
    if (!key) continue;
    const cur = byState.get(key);
    if (cur) cur.count++;
    else byState.set(key, { name, count: 1 });
  }
  return [...byState.entries()]
    .map(([slug, { name, count }]) => ({ name, slug, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
