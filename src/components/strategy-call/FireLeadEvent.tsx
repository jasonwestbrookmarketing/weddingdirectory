"use client";

import { useEffect } from "react";

/**
 * Fires fbq('track', 'Lead') once when the /strategy-call/confirmed page
 * mounts. This feeds Meta's Leads campaign optimisation algorithm so it can
 * find more people likely to book, while leaving the URL-based custom
 * conversion rule untouched.
 */
export default function FireLeadEvent() {
  useEffect(() => {
    const w = window as unknown as { fbq?: (...args: unknown[]) => void };
    w.fbq?.("track", "Lead");
  }, []);

  return null;
}
