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

/**
 * Returns a clean "City, ST" label from structured or raw location fields.
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

  // Parse location_full as last resort
  if (!full) return "";
  const parts = full.split(",").map((p) => p.trim()).filter(Boolean);
  // Drop street number at start and known noise at end
  const noise = new Set(["united states", "us", "usa"]);
  const cleaned = parts.filter((p) => !noise.has(p.toLowerCase()));
  if (cleaned.length === 0) return full.trim();

  // Try to find a state-like token and the token before it as city
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

  // Last resort: first meaningful part
  return cleaned[0];
}
