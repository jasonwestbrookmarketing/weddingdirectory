export const VENUE_TYPES = [
  { value: "barn", label: "Barn" },
  { value: "estate", label: "Estate" },
  { value: "ballroom", label: "Ballroom" },
  { value: "vineyard", label: "Vineyard" },
  { value: "garden", label: "Garden" },
  { value: "hotel", label: "Hotel" },
  { value: "rooftop", label: "Rooftop" },
  { value: "beach", label: "Beach" },
  { value: "industrial", label: "Industrial" },
  { value: "chapel", label: "Chapel" },
  { value: "resort", label: "Resort" },
] as const;

export const INDOOR_OUTDOOR_OPTIONS = [
  { value: "indoor", label: "Indoor" },
  { value: "outdoor", label: "Outdoor" },
  { value: "both", label: "Both" },
] as const;

// Ordered intent buckets for the lead form's "When do you plan to start
// touring?" question. Order matters — hottest lead first so venues can
// prioritize inbox follow-up.
export const BOOKING_TIMELINES = [
  { value: "ready_now", label: "I'm ready to schedule tours now" },
  { value: "next_few_weeks", label: "Within the next few weeks" },
  { value: "researching", label: "Just researching" },
] as const;

// Matches the dashboard's ListingLeadModal options exactly so leads are
// consistently categorised across both surfaces.
export const VENUE_MATTERS_OPTIONS = [
  "Outdoor ceremony space",
  "Inclusive pricing & all-in packages",
  "Unique / non-traditional setting",
  "On-site catering & bar",
  "Guest capacity (large or intimate)",
  "Location & accessibility",
  "Photo-worthy aesthetics",
  "Vendor flexibility",
  "Bridal suite & getting-ready space",
  "Experience & reputation",
] as const;

export const LEAD_STATUSES = [
  { value: "new",            label: "New Lead",        color: "bg-stone-100 text-stone-700" },
  { value: "contacted",      label: "Contacted",       color: "bg-amber-50 text-amber-700" },
  { value: "tour_booked",    label: "Booked Tour",     color: "bg-purple-50 text-purple-700" },
  { value: "proposal_sent",  label: "Proposal Sent",   color: "bg-orange-50 text-orange-700" },
  { value: "booked_wedding", label: "Booked Wedding",  color: "bg-emerald-50 text-emerald-700" },
  { value: "not_interested", label: "Not Interested",  color: "bg-stone-100 text-stone-500" },
] as const;

export type LeadStatus = typeof LEAD_STATUSES[number]["value"];

// ── Amenities ────────────────────────────────────────────────────────────────
export const AMENITIES_LIST = [
  { value: "ceremony_area", label: "Ceremony Area" },
  { value: "covered_outdoors", label: "Covered Outdoors Space" },
  { value: "dressing_room", label: "Dressing Room" },
  { value: "handicap_accessible", label: "Handicap Accessible" },
  { value: "indoor_event_space", label: "Indoor Event Space" },
  { value: "liability_insurance", label: "Liability Insurance" },
  { value: "on_site_accommodations", label: "On-Site Accommodations" },
  { value: "outdoor_event_space", label: "Outdoor Event Space" },
  { value: "reception_area", label: "Reception Area" },
  { value: "wireless_internet", label: "Wireless Internet" },
] as const;

// ── Ceremony Types ────────────────────────────────────────────────────────────
export const CEREMONY_TYPES_LIST = [
  { value: "civil_union", label: "Civil Union" },
  { value: "commitment_ceremony", label: "Commitment Ceremony" },
  { value: "elopement", label: "Elopement" },
  { value: "interfaith_ceremony", label: "Interfaith Ceremony" },
  { value: "non_religious", label: "Non-Religious Ceremony" },
  { value: "religious_ceremony", label: "Religious Ceremony" },
  { value: "second_wedding", label: "Second Wedding" },
  { value: "vow_renewal", label: "Vow Renewal Ceremony" },
] as const;

// ── Venue Settings ────────────────────────────────────────────────────────────
export const VENUE_SETTINGS_LIST = [
  { value: "backyard", label: "Backyard" },
  { value: "ballroom", label: "Ballroom" },
  { value: "barn", label: "Barn" },
  { value: "beach", label: "Beach" },
  { value: "brewery_distillery", label: "Brewery & Distillery" },
  { value: "castle", label: "Castle" },
  { value: "city_hall", label: "City Hall" },
  { value: "country_club", label: "Country Club" },
  { value: "desert", label: "Desert" },
  { value: "estate", label: "Estate" },
  { value: "farm_ranch", label: "Farm & Ranch" },
  { value: "forest", label: "Forest" },
  { value: "garden", label: "Garden" },
  { value: "historic_venue", label: "Historic Venue" },
  { value: "industrial_warehouse", label: "Industrial & Warehouse" },
  { value: "library", label: "Library" },
  { value: "loft", label: "Loft" },
  { value: "mountain", label: "Mountain" },
  { value: "museum", label: "Museum" },
  { value: "park", label: "Park" },
  { value: "religious_setting", label: "Religious Setting" },
  { value: "restaurant", label: "Restaurant" },
  { value: "rooftop", label: "Rooftop" },
  { value: "tented", label: "Tented" },
  { value: "trees", label: "Trees" },
  { value: "vineyard_winery", label: "Vineyard & Winery" },
  { value: "waterfront", label: "Waterfront" },
] as const;

// ── Service Offerings ─────────────────────────────────────────────────────────
export const SERVICES_LIST = [
  { value: "bar_drinks", label: "Bar & Drinks" },
  { value: "bar_rental", label: "Bar Rental" },
  { value: "cakes_desserts", label: "Cakes & Desserts" },
  { value: "cupcakes", label: "Cupcakes" },
  { value: "other_desserts", label: "Other Desserts" },
  { value: "destination_weddings", label: "Destination Weddings" },
  { value: "destination_packages", label: "Destination Wedding Packages" },
  { value: "destination_planning", label: "Destination Wedding Planning" },
  { value: "food_catering", label: "Food & Catering" },
  { value: "planning", label: "Planning" },
  { value: "rentals_equipment", label: "Rentals & Equipment" },
  { value: "tents", label: "Tents" },
  { value: "se_habla_espanol", label: "Se Habla Español" },
  { value: "service_staff", label: "Service Staff" },
  { value: "transportation", label: "Transportation" },
  { value: "wedding_design", label: "Wedding Design" },
] as const;

// ── Guest Capacity Ranges ─────────────────────────────────────────────────────
export const GUEST_CAPACITY_RANGES = [
  { value: "0_50", label: "0–50", min: 0, max: 50 },
  { value: "51_100", label: "51–100", min: 51, max: 100 },
  { value: "101_150", label: "101–150", min: 101, max: 150 },
  { value: "151_200", label: "151–200", min: 151, max: 200 },
  { value: "201_250", label: "201–250", min: 201, max: 250 },
  { value: "251_300", label: "251–300", min: 251, max: 300 },
  { value: "300_plus", label: "300+", min: 300, max: 999999 },
] as const;

// ── Combined features list (all categories) — used by existing feature picker ─
export const FEATURES_LIST = [
  ...AMENITIES_LIST,
  ...CEREMONY_TYPES_LIST,
  ...VENUE_SETTINGS_LIST,
  ...SERVICES_LIST,
] as const;

export const CTA_LABEL = "Download Pricing & Availability Guide";

export const BUDGET_RANGES = [
  { value: "0-15000",    label: "$ · Intimate & Charming",    scale: "$",   min: 0,     max: 15000  },
  { value: "15000-35000", label: "$$ · Romantic & Refined",   scale: "$$",  min: 15000, max: 35000  },
  { value: "35000+",     label: "$$$ · Grand & Luxurious",    scale: "$$$", min: 35000, max: 999999 },
] as const;

/**
 * Returns a 3-tier dollar-sign scale for a given price_min value.
 * Describes the venue experience, not the price point.
 *   $   → Intimate & Charming   (up to $15k)
 *   $$  → Romantic & Refined    ($15k–$35k)
 *   $$$ → Grand & Luxurious     ($35k+)
 */
export function getPriceScale(priceMin: number | null | undefined): string | null {
  if (priceMin == null) return null;
  if (priceMin < 15000) return "$";
  if (priceMin < 35000) return "$$";
  return "$$$";
}

export const PRICE_SCALE_LABELS: Record<string, string> = {
  "$":   "Intimate & Charming",
  "$$":  "Romantic & Refined",
  "$$$": "Grand & Luxurious",
};
