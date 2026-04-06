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

export const BOOKING_TIMELINES = [
  { value: "asap", label: "ASAP" },
  { value: "within_3_months", label: "Within 3 months" },
  { value: "within_6_months", label: "Within 6 months" },
  { value: "within_12_months", label: "Within 12 months" },
  { value: "just_exploring", label: "Just exploring" },
] as const;

export const LEAD_STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "call_booked", label: "Call Booked" },
  { value: "tour_booked", label: "Tour Booked" },
  { value: "booked", label: "Booked" },
] as const;

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

export const CTA_LABEL = "Get Pricing & Check Availability";

export const BUDGET_RANGES = [
  { value: "0-5000", label: "Under $5,000", min: 0, max: 5000 },
  { value: "5000-10000", label: "$5,000 – $10,000", min: 5000, max: 10000 },
  { value: "10000-20000", label: "$10,000 – $20,000", min: 10000, max: 20000 },
  { value: "20000-40000", label: "$20,000 – $40,000", min: 20000, max: 40000 },
  { value: "40000+", label: "$40,000+", min: 40000, max: 999999 },
] as const;
