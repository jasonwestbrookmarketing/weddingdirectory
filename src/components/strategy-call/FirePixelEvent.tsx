"use client";

import { useEffect, useRef } from "react";

/**
 * Fires a single Meta Pixel custom event on mount.
 * Returns null — purely a side-effect component for page-load conversions.
 */
export function FirePixelEvent({ eventName }: { eventName: string }) {
  const name = useRef(eventName);

  useEffect(() => {
    try {
      const w = window as unknown as { fbq?: (...a: unknown[]) => void };
      w.fbq?.("trackCustom", name.current);
    } catch { /* non-fatal */ }
  }, []);

  return null;
}
