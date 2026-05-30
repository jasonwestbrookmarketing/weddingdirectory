"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Fires a Meta Pixel `PageView` on client-side route changes.
 *
 * The base pixel snippet in the root layout fires the initial PageView on
 * hard page load (this is what the /strategy-call/confirmed custom conversion
 * relies on). This component covers soft (Next.js Link) navigations so we
 * don't undercount PageViews — it skips the first render to avoid double
 * counting the initial load.
 */
export default function MetaPixelRouteTracker() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    const w = window as unknown as { fbq?: (...args: unknown[]) => void };
    w.fbq?.("track", "PageView");
  }, [pathname]);

  return null;
}
