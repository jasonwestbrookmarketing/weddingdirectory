"use client";

import { useEffect } from "react";

/**
 * Fires two Meta Pixel events on mount for the /free-listing landing page:
 *
 *   fbq('track', 'ViewContent')              — standard event; use this for
 *                                              "Landing Page View" optimisation
 *                                              in Meta ad campaigns.
 *
 *   fbq('trackCustom', 'FreeListingLanding') — custom event; create a matching
 *                                              Custom Conversion in Meta Events
 *                                              Manager to isolate this funnel.
 *
 * The global PageView fires automatically via the root layout snippet, so this
 * component only handles the additional content-specific events.
 */
export default function FireFreeListingLandingEvent() {
  useEffect(() => {
    try {
      const w = window as unknown as { fbq?: (...a: unknown[]) => void };
      w.fbq?.("track", "ViewContent", {
        content_name: "Free Listing Landing Page",
        content_category: "Venue Directory",
      });
      w.fbq?.("trackCustom", "FreeListingLanding");
    } catch { /* non-fatal */ }
  }, []);

  return null;
}
