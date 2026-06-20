"use client";

import { useEffect } from "react";

/**
 * Fires a Meta pixel custom event on mount:
 *   fbq('trackCustom', 'DisqualifiedStrategyCall') — matches the
 *     "Disqualified Strategy Call" custom conversion in Events Manager
 *
 * Mounted on /strategy-call/start-free, which is where the GHL survey
 * redirects leads who don't qualify for a strategy call.
 */
export default function FireDisqualifiedEvent() {
  useEffect(() => {
    try {
      const w = window as unknown as { fbq?: (...a: unknown[]) => void };
      w.fbq?.("trackCustom", "DisqualifiedStrategyCall");
    } catch { /* non-fatal */ }
  }, []);

  return null;
}
