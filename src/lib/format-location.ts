const STATE_ABBR: Record<string, string> = {
  alabama: "AL", alaska: "AK", arizona: "AZ", arkansas: "AR",
  california: "CA", colorado: "CO", connecticut: "CT", delaware: "DE",
  florida: "FL", georgia: "GA", hawaii: "HI", idaho: "ID",
  illinois: "IL", indiana: "IN", iowa: "IA", kansas: "KS",
  kentucky: "KY", louisiana: "LA", maine: "ME", maryland: "MD",
  massachusetts: "MA", michigan: "MI", minnesota: "MN", mississippi: "MS",
  missouri: "MO", montana: "MT", nebraska: "NE", nevada: "NV",
  "new hampshire": "NH", "new jersey": "NJ", "new mexico": "NM",
  "new york": "NY", "north carolina": "NC", "north dakota": "ND",
  ohio: "OH", oklahoma: "OK", oregon: "OR", pennsylvania: "PA",
  "rhode island": "RI", "south carolina": "SC", "south dakota": "SD",
  tennessee: "TN", texas: "TX", utah: "UT", vermont: "VT",
  virginia: "VA", washington: "WA", "west virginia": "WV",
  wisconsin: "WI", wyoming: "WY", "district of columbia": "DC",
};

/** "Pennsylvania" → "PA"; passes through existing abbreviations. */
export function abbrState(state: string): string {
  const key = state.trim().toLowerCase();
  // Already an abbreviation
  if (/^[a-z]{2}$/i.test(key)) return state.trim().toUpperCase();
  return STATE_ABBR[key] ?? state.trim();
}

const abbr = abbrState;

/**
 * Returns true for any geocoder noise that is never part of a mailing
 * address — countries, counties, townships, boroughs, etc. Also used to
 * reject bad `location_city` values (e.g. "Greene Township") so we never
 * display an administrative division where the city belongs.
 */
export function isNoisyLocationPart(part: string): boolean {
  const lower = part.toLowerCase();
  if (lower === "united states" || lower === "us" || lower === "usa") return true;
  if (/\b(county|township|borough|parish|district|municipality)\b/.test(lower)) return true;
  return false;
}

const isNoise = isNoisyLocationPart;

/** Returns true if the part looks like a US state full name or abbreviation. */
function isState(part: string): boolean {
  const lower = part.trim().toLowerCase();
  if (STATE_ABBR[lower]) return true;
  if (/^[a-z]{2}$/i.test(lower)) return Object.values(STATE_ABBR).includes(lower.toUpperCase());
  return false;
}

/** Returns true if part is a 5-digit zip (optionally +4). */
function isZip(part: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(part.trim());
}

/**
 * Returns a clean "City, ST" short label — used on cards and map pins.
 *
 * Priority:
 *   1. location_city + location_state  → "Woodstock, PA"
 *   2. location_city only              → "Woodstock"
 *   3. location_state only             → "PA"
 *   4. Parse location_full             → best city/state extracted from the string
 *   5. Fallback                        → location_full as-is (trimmed)
 */
export function formatLocation(
  city: string | null | undefined,
  state: string | null | undefined,
  full: string | null | undefined,
): string {
  const cityRaw = city?.trim();
  // Never show an administrative division ("Greene Township") as the city.
  const c = cityRaw && !isNoise(cityRaw) ? cityRaw : "";
  const s = state?.trim();

  if (c && s) return `${c}, ${abbr(s)}`;
  if (c) return c;
  if (s) return abbr(s);

  if (!full) return "";
  const parts = full.split(",").map((p) => p.trim()).filter(Boolean);
  const cleaned = parts.filter((p) => !isNoise(p));
  if (cleaned.length === 0) return full.trim();

  for (let i = cleaned.length - 1; i >= 0; i--) {
    const maybeState = cleaned[i].replace(/\s*\d{5}(-\d{4})?$/, "").trim();
    if (!maybeState) continue;
    const stateAbbr = abbr(maybeState);
    if (stateAbbr !== maybeState || /^[A-Z]{2}$/.test(maybeState)) {
      // A street ("1090 Ragged Edge Road") is never the city — skip
      // digit-leading candidates rather than mislabeling them.
      const maybeCity = cleaned[i - 1];
      if (maybeCity && !/^\d/.test(maybeCity)) return `${maybeCity}, ${stateAbbr}`;
      return stateAbbr;
    }
  }

  return /^\d/.test(cleaned[0]) && cleaned.length === 1 ? "" : cleaned[0];
}

const ABBR_TO_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_ABBR).map(([name, ab]) => [ab, name])
);

/**
 * Builds a lowercase searchable string for a venue's location, expanding
 * state abbreviations to full names (and vice versa) so "TN", "Tennessee",
 * "Franklin, TN" and zip codes embedded in location_full all match.
 */
export function locationHaystack(
  full: string | null | undefined,
  city: string | null | undefined,
  state: string | null | undefined,
): string {
  const parts: string[] = [];
  if (full) parts.push(full);
  if (city) parts.push(city);
  if (state) {
    const s = state.trim();
    parts.push(s);
    const lower = s.toLowerCase();
    // "TN" → also index "tennessee"; "Tennessee" → also index "tn"
    if (ABBR_TO_NAME[s.toUpperCase()]) parts.push(ABBR_TO_NAME[s.toUpperCase()]);
    if (STATE_ABBR[lower]) parts.push(STATE_ABBR[lower]);
  }
  return parts.join(" ").toLowerCase();
}

/**
 * Returns a clean full address for venue detail pages:
 *   "1090 Ragged Edge Road, Chambersburg, PA 17202"
 *
 * Strategy:
 *   1. Parse location_full into comma-separated parts.
 *   2. Strip noise: country, county, township, borough, state names, zip codes,
 *      and any part that matches the known city name.
 *   3. What remains are street components (house number + road ± unit).
 *      Nominatim always puts street parts first, so take at most 2 remaining
 *      parts (house_number, road) joined with a space.
 *   4. Reassemble using the DB city/state fields for accuracy, plus the zip
 *      extracted from location_full.
 */
export interface ParsedLocation {
  street: string;
  city: string;
  state: string;
  zip: string;
}

/** Compose "street, City, ST zip" from parsed pieces, skipping empty parts. */
export function composeAddress(p: ParsedLocation): string {
  const stateZip = [p.state, p.zip].filter(Boolean).join(" ");
  const cityLine = p.city
    ? stateZip ? `${p.city}, ${stateZip}` : p.city
    : stateZip;
  return [p.street, cityLine].filter(Boolean).join(", ");
}

export function formatLocationFull(
  full: string | null | undefined,
  city?: string | null,
  state?: string | null,
): string {
  if (!full) return "";
  return composeAddress(parseLocation(full, city, state));
}

/**
 * Parses a stored location into clean street / city / state / zip pieces,
 * handling every vintage: dashboard-picker saves, raw Nominatim
 * display_names, Google formatted_addresses, and free-typed strings.
 */
export function parseLocation(
  full: string | null | undefined,
  city?: string | null,
  state?: string | null,
): ParsedLocation {
  if (!full) full = "";

  // Prefer DB fields for city/state; fall back to whatever we parse out.
  // A township/county stored in the city field is never displayed.
  const cityRaw = city?.trim() || "";
  const resolvedCity = cityRaw && !isNoise(cityRaw) ? cityRaw : "";
  let resolvedState = state?.trim() ? abbr(state.trim()) : "";
  let zip = "";

  const rawParts = full.split(",").map((p) => p.trim()).filter(Boolean);
  const streetParts: string[] = [];

  for (const part of rawParts) {
    // Standalone zip part: "17202"
    if (isZip(part)) {
      zip = zip || part.replace(/-\d{4}$/, "");
      continue;
    }
    // Combined state + zip part: "PA 17202" / "Pennsylvania 17202" — this is
    // the exact format the dashboard's address picker saves.
    const stateZipMatch = part.match(/^(.+?)\s+(\d{5})(?:-\d{4})?$/);
    if (stateZipMatch && isState(stateZipMatch[1])) {
      if (!resolvedState) resolvedState = abbr(stateZipMatch[1]);
      zip = zip || stateZipMatch[2];
      continue;
    }
    if (isNoise(part)) continue;
    if (isState(part)) {
      if (!resolvedState) resolvedState = abbr(part);
      continue;
    }
    if (resolvedCity && part.toLowerCase() === resolvedCity.toLowerCase()) continue;
    streetParts.push(part);
  }

  // Free-typed address without commas ("1090 Ragged Edge Rd Chambersburg PA
  // 17202"): peel trailing zip / state / city tokens off the single part.
  if (rawParts.length === 1 && streetParts.length === 1) {
    let s = streetParts[0];
    const zipTail = s.match(/\s+(\d{5})(?:-\d{4})?\s*$/);
    if (zipTail) {
      zip = zip || zipTail[1];
      s = s.slice(0, zipTail.index).trim();
    }
    for (const wordCount of [2, 1]) {
      const tokens = s.split(/\s+/);
      if (tokens.length > wordCount) {
        const tail = tokens.slice(-wordCount).join(" ");
        if (isState(tail)) {
          if (!resolvedState) resolvedState = abbr(tail);
          s = tokens.slice(0, -wordCount).join(" ");
          break;
        }
      }
    }
    if (resolvedCity && s.toLowerCase().endsWith(resolvedCity.toLowerCase())) {
      s = s.slice(0, s.length - resolvedCity.length).trim().replace(/,$/, "");
    }
    streetParts[0] = s;
  }

  // No DB city: the last remaining part is usually the city (Nominatim puts
  // street components first). With exactly 2 parts, only pop when the first
  // contains letters — ["1090", "Ragged Edge Road"] is house number + road.
  let cityFromFull = "";
  if (
    !resolvedCity &&
    (streetParts.length >= 3 ||
      (streetParts.length === 2 && /[a-z]/i.test(streetParts[0])))
  ) {
    cityFromFull = streetParts.pop()!;
  }

  // Nominatim format: house_number, road, [sub-locality…], [city…]
  // The first 2 street parts are house number + road name; anything beyond
  // that is sub-locality noise (village, hamlet, etc.) — drop it.
  const streetAddress = streetParts.slice(0, 2).join(" ").trim();

  return {
    street: streetAddress,
    city: resolvedCity || cityFromFull,
    state: resolvedState,
    zip,
  };
}
