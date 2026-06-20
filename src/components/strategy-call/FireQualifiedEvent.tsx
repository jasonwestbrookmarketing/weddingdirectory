"use client";

import { useEffect } from "react";

/**
 * Fires two Meta pixel events on mount:
 *   fbq('track', 'Lead')                       — standard event for campaign optimisation
 *   fbq('trackCustom', 'QualifiedStrategyCall') — matches the "Qualified Strategy Call"
 *                                                 custom conversion in Events Manager
 *
 * This is the belt-and-suspenders fallback for /strategy-call/book. The primary
 * trigger is the postMessage listener in StrategyCallModal, but anyone who lands
 * here directly (e.g. retargeting, bookmarked link) also gets counted.
 */
export default function FireQualifiedEvent() {
  useEffect(() => {
    try {
      const w = window as unknown as { fbq?: (...a: unknown[]) => void };
      w.fbq?.("track", "Lead");
      w.fbq?.("trackCustom", "QualifiedStrategyCall");
    } catch { /* non-fatal */ }
  }, []);

  return null;
}
