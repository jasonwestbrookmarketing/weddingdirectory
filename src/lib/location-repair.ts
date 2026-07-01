import "server-only";
import {
  parseLocation,
  composeAddress,
  abbrState,
  isNoisyLocationPart,
} from "@/lib/format-location";

/**
 * Display-time repair for venues whose stored location is incomplete or
 * polluted (e.g. city = "Greene Township", missing zip). Uses the venue's
 * lat/lng to reverse-geocode the real postal city / state / zip via
 * Nominatim, then rebuilds a clean "street, City, ST zip" address.
 *
 * Results are cached by Next's fetch data cache (30 days per coordinate),
 * so this costs at most one geocode per venue per month.
 */

interface LocatableVenue {
  location_full: string | null;
  location_city: string | null;
  location_state: string | null;
  lat: number | string | null;
  lng: number | string | null;
}

function parsed(venue: LocatableVenue) {
  return parseLocation(
    venue.location_full,
    venue.location_city,
    venue.location_state
  );
}

/**
 * True when the stored address is missing its city, state, or zip and we
 * have something to repair it from (coordinates or an existing zip).
 */
export function needsLocationRepair(venue: LocatableVenue): boolean {
  const hasCoords = venue.lat != null && venue.lng != null;
  if (!venue.location_full) return hasCoords;
  const p = parsed(venue);
  const incomplete = !p.city || !p.zip || !p.state;
  return incomplete && (hasCoords || !!p.zip);
}

type NomAddress = {
  house_number?: string;
  road?: string;
  postcode?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  state?: string;
};

function resolveCity(a: NomAddress): string {
  for (const candidate of [a.city, a.town, a.village, a.municipality]) {
    if (candidate && !isNoisyLocationPart(candidate)) return candidate;
  }
  return "";
}

/**
 * Zip → USPS postal city ("17202" → "Chambersburg"). Rural coordinates often
 * reverse-geocode to a township with no city/town, but the postal city tied
 * to the zip is exactly what belongs in a mailing address.
 */
async function postalCityForZip(
  zip: string
): Promise<{ city: string; state: string } | null> {
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 * 60 * 24 * 30 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      places?: { "place name"?: string; "state abbreviation"?: string }[];
    };
    const place = data.places?.[0];
    if (!place?.["place name"]) return null;
    return {
      city: place["place name"],
      state: place["state abbreviation"] ?? "",
    };
  } catch {
    return null;
  }
}

/**
 * Returns venue with location_full / location_city / location_state replaced
 * by clean, complete values. Falls back to the original venue on any failure.
 */
export async function repairVenueLocation<T extends LocatableVenue>(
  venue: T
): Promise<T> {
  try {
    const lat = Number(venue.lat);
    const lng = Number(venue.lng);

    let a: NomAddress = {};
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}` +
          `&format=json&addressdetails=1&zoom=18`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "StoryVenue/1.0 (https://storyvenue.com)",
          },
          next: { revalidate: 60 * 60 * 24 * 30 },
        }
      );
      if (res.ok) {
        const data = (await res.json()) as { address?: NomAddress };
        a = data.address ?? {};
      }
    }

    const stored = parsed(venue);
    const geoStreet = [a.house_number, a.road].filter(Boolean).join(" ");
    let city = stored.city || resolveCity(a);
    let state = stored.state || (a.state ? abbrState(a.state) : "");

    // Keep the stored street (it's what the owner entered). Only fall back
    // to the geocoded street at building-level precision (house number
    // present) — city-centroid coordinates must not invent a street.
    const street = stored.street || (a.house_number ? geoStreet : "");

    // A zip belongs to a street-level address; a "City, ST"-only listing
    // must not gain a zip from approximate coordinates.
    const geoZip = street && a.postcode ? a.postcode.split("-")[0] : "";
    const zip = stored.zip || geoZip;

    // Rural addresses often geocode to a township with no proper city.
    // The zip's USPS postal city is the authoritative mailing city.
    if (!city && zip) {
      const postal = await postalCityForZip(zip);
      if (postal) {
        city = postal.city;
        state = state || postal.state;
      }
    }

    if (!city && !zip) return venue;

    return {
      ...venue,
      location_full: composeAddress({ street, city, state, zip }),
      location_city: city || venue.location_city,
      location_state: state || venue.location_state,
    };
  } catch {
    return venue;
  }
}
