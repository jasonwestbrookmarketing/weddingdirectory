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

/** Tokens that are pure noise in a geocoder-returned address. */
function isNoise(part: string): boolean {
  const lower = part.toLowerCase();
  if (lower === "united states" || lower === "us" || lower === "usa") return true;
  if (/\bcounty\b/.test(lower)) return true;
  if (/\btownship\b/.test(lower)) return true;
  if (/\bborough\b/.test(lower)) return true;
  if (/\bparish\b/.test(lower)) return true;
  return false;
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
 * Returns a clean full address string for venue detail pages.
 * Strips county/township/country noise but keeps street, city, state, zip.
 *
 * e.g. "1090, Ragged Edge Road, Woodstock, Greene Township, Franklin County,
 *       Pennsylvania, 17202, United States"
 *   →  "1090 Ragged Edge Road, Woodstock, PA 17202"
 */
export function formatLocationFull(
  full: string | null | undefined,
  city?: string | null,
  state?: string | null,
): string {
  if (!full) return "";

  const parts = full.split(",").map((p) => p.trim()).filter(Boolean);
  const cleaned = parts.filter((p) => !isNoise(p));
  if (cleaned.length === 0) return full.trim();

  // Identify the zip (5-digit token) and state token
  let zipPart = "";
  let statePart = "";
  const remaining: string[] = [];

  for (const part of cleaned) {
    if (/^\d{5}(-\d{4})?$/.test(part)) {
      zipPart = part.replace(/-\d{4}$/, ""); // drop +4
    } else {
      const stateAbbr = abbr(part);
      if (stateAbbr !== part || /^[A-Z]{2}$/.test(part)) {
        statePart = stateAbbr;
      } else {
        remaining.push(part);
      }
    }
  }

  // Prefer DB city/state fields if provided
  const resolvedState = (state?.trim() ? abbr(state.trim()) : statePart) || "";
  const resolvedCity = city?.trim() || "";

  // remaining parts that aren't the city
  const streetParts = resolvedCity
    ? remaining.filter((p) => p.toLowerCase() !== resolvedCity.toLowerCase())
    : remaining.slice(0, -1); // treat last non-state as city

  const inferredCity = resolvedCity || remaining[remaining.length - 1] || "";
  const streetAddress = streetParts.join(" ").replace(/,\s*/g, " ").trim();

  const parts2: string[] = [];
  if (streetAddress) parts2.push(streetAddress);
  if (inferredCity) {
    const cityState = resolvedState
      ? `${inferredCity}, ${resolvedState}`
      : inferredCity;
    const cityStateParts2 = zipPart ? `${cityState} ${zipPart}` : cityState;
    parts2.push(cityStateParts2);
  } else if (resolvedState || zipPart) {
    parts2.push([resolvedState, zipPart].filter(Boolean).join(" "));
  }

  return parts2.join(", ");
}
