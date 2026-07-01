/**
 * Canonical venue feature vocabulary.
 *
 * The dashboard (StoryPay → Listing editor) stores human-readable labels in
 * the `venues.features` jsonb array — e.g. "Ceremony site", "Bridal suite".
 * Older rows (seeds, imports, previous UIs) used snake_case values from
 * several different lists. This module maps every known historical value to
 * one canonical label so filtering and display work across all vintages.
 */

/** The amenity options venue owners can actually pick in the dashboard. */
export const VENUE_FEATURE_OPTIONS = [
  "Ceremony site",
  "Reception site",
  "Bridal suite",
  "Groom's suite",
  "On-site parking",
  "Wheelchair accessible",
  "In-house catering",
  "BYO catering allowed",
  "Bar service",
  "Dance floor",
  "Overnight accommodations",
  "Pet friendly",
  "Outdoor ceremony",
  "Tented options",
] as const;

export type VenueFeature = (typeof VENUE_FEATURE_OPTIONS)[number];

/** Legacy snake_case values → canonical label. */
const LEGACY_FEATURE_MAP: Record<string, VenueFeature> = {
  // Ceremony
  ceremony_space: "Ceremony site",
  ceremony_area: "Ceremony site",
  // Reception
  reception_hall: "Reception site",
  reception_area: "Reception site",
  indoor_reception: "Reception site",
  indoor_event_space: "Reception site",
  // Suites
  bridal_suite: "Bridal suite",
  dressing_room: "Bridal suite",
  grooms_room: "Groom's suite",
  grooms_suite: "Groom's suite",
  // Parking / accessibility
  parking: "On-site parking",
  on_site_parking: "On-site parking",
  handicap_accessible: "Wheelchair accessible",
  wheelchair_accessible: "Wheelchair accessible",
  // Catering / bar
  catering_kitchen: "In-house catering",
  food_catering: "In-house catering",
  full_service: "In-house catering",
  byo_catering: "BYO catering allowed",
  bar_drinks: "Bar service",
  bar_rental: "Bar service",
  bar_service: "Bar service",
  // Misc
  dance_floor: "Dance floor",
  on_site_accommodations: "Overnight accommodations",
  overnight_accommodations: "Overnight accommodations",
  pet_friendly: "Pet friendly",
  outdoor_ceremony: "Outdoor ceremony",
  outdoor_event_space: "Outdoor ceremony",
  covered_outdoors: "Tented options",
  tented: "Tented options",
  tents: "Tented options",
};

const CANONICAL_SET = new Set<string>(VENUE_FEATURE_OPTIONS);

/**
 * Resolve a stored feature value to its canonical label, or null if it isn't
 * one of the filterable amenities (e.g. legacy values like "photo_opps").
 */
export function canonicalFeature(value: string): VenueFeature | null {
  const trimmed = value.trim();
  if (CANONICAL_SET.has(trimmed)) return trimmed as VenueFeature;
  const key = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  return LEGACY_FEATURE_MAP[key] ?? null;
}

/** True if a venue's stored features include the given canonical label. */
export function venueHasFeature(features: unknown, label: string): boolean {
  if (!Array.isArray(features)) return false;
  return features.some(
    (f) => typeof f === "string" && canonicalFeature(f) === label
  );
}

/** "heated_cooled" → "Heated cooled" — display fallback for unknown values. */
export function humanizeFeature(value: string): string {
  const canonical = canonicalFeature(value);
  if (canonical) return canonical;
  const words = value.replace(/[_-]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}
