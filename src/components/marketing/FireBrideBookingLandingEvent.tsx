"use client";

import { useEffect } from "react";

/**
 * Fires two Meta Pixel events on mount for the /bride-booking-system landing page:
 *   fbq('track', 'ViewContent')                     — standard event; use this for
 *                                                     "Landing Page View" optimisation
 *                                                     in Meta ad campaigns targeting venues.
 *   fbq('trackCustom', 'BrideBookingSystemLanding')  — custom conversion you can create
 *                                                     in Meta Events Manager → Custom Conversions
 *                                                     to segment specifically this funnel entry.
 *
 * The global PageView fires automatically via the root layout snippet, so this
 * component only needs to handle the additional events.
 */
export default function FireBrideBookingLandingEvent() {
  useEffect(() => {
    try {
      const w = window as unknown as { fbq?: (...a: unknown[]) => void };
      w.fbq?.("track", "ViewContent", {
        content_name: "Bride Booking System Landing Page",
        content_category: "Venue Marketing",
      });
      w.fbq?.("trackCustom", "BrideBookingSystemLanding");
    } catch { /* non-fatal */ }
  }, []);

  return null;
}
