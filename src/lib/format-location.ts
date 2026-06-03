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

function abbr(state: string): string {
  const key = state.trim().toLowerCase();
  // Already an abbreviation
  if (/^[a-z]{2}$/i.test(key)) return state.trim().toUpperCase();
  return STATE_ABBR[key] ?? state.trim();
}

/** Returns true for any geocoder noise that is never part of a mailing address. */
function isNoise(part: string): boolean {
  const lower = part.toLowerCase();
  if (lower === "united states" || lower === "us" || lower === "usa") return true;
  if (/\b(county|township|borough|parish|district|municipality)\b/.test(lower)) return true;
  return false;
}

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
  const c = city?.trim();
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
      const maybeCity = cleaned[i - 1];
      if (maybeCity) return `${maybeCity}, ${stateAbbr}`;
      return stateAbbr;
    }
  }

  return cleaned[0];
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
export function formatLocationFull(
  full: string | null | undefined,
  city?: string | null,
  state?: string | null,
): string {
  if (!full) return "";

  const parts = full.split(",").map((p) => p.trim()).filter(Boolean);

  // Extract zip anywhere in the string
  const zipRaw = parts.find((p) => isZip(p));
  const zip = zipRaw ? zipRaw.replace(/-\d{4}$/, "") : "";

  // Resolve state abbreviation — prefer DB field
  const resolvedState = state?.trim() ? abbr(state.trim()) : "";

  // Resolve city — prefer DB field
  const resolvedCity = city?.trim() || "";

  // Keep only street-level parts: drop noise, zips, state names, and the city itself
  const streetParts = parts.filter((p) => {
    if (isNoise(p)) return false;
    if (isZip(p)) return false;
    if (isState(p)) return false;
    if (resolvedCity && p.toLowerCase() === resolvedCity.toLowerCase()) return false;
    return true;
  });

  // Nominatim format: house_number, road, [sub-locality…], [city…]
  // The first 2 street parts are house number + road name; anything beyond
  // that is sub-locality noise (village, hamlet, etc.) — drop it.
  const streetAddress = streetParts.slice(0, 2).join(" ").trim();

  // Build city/state/zip segment
  const stateZip = [resolvedState, zip].filter(Boolean).join(" ");
  const cityLine = resolvedCity
    ? stateZip ? `${resolvedCity}, ${stateZip}` : resolvedCity
    : stateZip;

  return [streetAddress, cityLine].filter(Boolean).join(", ");
}
