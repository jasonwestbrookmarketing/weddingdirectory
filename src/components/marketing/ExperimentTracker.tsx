"use client";

import { useEffect } from "react";

/**
 * Fires a single impression beacon for the A/B variants shown on this render.
 * No-ops when there are no tracked variant ids (i.e. fallback/default copy).
 */
export default function ExperimentTracker({
  page,
  variantIds,
}: {
  page: string;
  variantIds: string[];
}) {
  useEffect(() => {
    if (!variantIds || variantIds.length === 0) return;
    const payload = JSON.stringify({ event: "impression", ids: variantIds, page });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/experiments/track",
          new Blob([payload], { type: "application/json" })
        );
      } else {
        fetch("/api/experiments/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        });
      }
    } catch {
      /* non-fatal */
    }
    // Fire once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

/** Shared helper so the CTA can log a click with the same transport. */
export function sendExperimentClick(page: string, variantIds: string[]) {
  if (!variantIds || variantIds.length === 0) return;
  const payload = JSON.stringify({ event: "click", ids: variantIds, page });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/experiments/track",
        new Blob([payload], { type: "application/json" })
      );
    } else {
      fetch("/api/experiments/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      });
    }
  } catch {
    /* non-fatal */
  }
}
