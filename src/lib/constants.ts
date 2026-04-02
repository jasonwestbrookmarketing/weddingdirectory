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

export const FEATURES_LIST = [
  { value: "bridal_suite", label: "Bridal Suite" },
  { value: "groom_suite", label: "Groom Suite" },
  { value: "outdoor_ceremony", label: "Outdoor Ceremony" },
  { value: "indoor_ceremony", label: "Indoor Ceremony" },
  { value: "reception_hall", label: "Reception Hall" },
  { value: "catering_kitchen", label: "Catering Kitchen" },
  { value: "parking", label: "Parking" },
  { value: "accommodation", label: "Accommodation" },
  { value: "wheelchair_accessible", label: "Wheelchair Accessible" },
  { value: "pet_friendly", label: "Pet Friendly" },
  { value: "byob", label: "BYOB" },
  { value: "in_house_catering", label: "In-House Catering" },
  { value: "outside_catering", label: "Outside Catering Allowed" },
  { value: "dj_allowed", label: "DJ Allowed" },
  { value: "live_band_allowed", label: "Live Band Allowed" },
] as const;

export const CTA_LABEL = "Get Pricing & Check Availability";

export const BUDGET_RANGES = [
  { value: "0-5000", label: "Under $5,000", min: 0, max: 5000 },
  { value: "5000-10000", label: "$5,000 – $10,000", min: 5000, max: 10000 },
  { value: "10000-20000", label: "$10,000 – $20,000", min: 10000, max: 20000 },
  { value: "20000-40000", label: "$20,000 – $40,000", min: 20000, max: 40000 },
  { value: "40000+", label: "$40,000+", min: 40000, max: 999999 },
] as const;
