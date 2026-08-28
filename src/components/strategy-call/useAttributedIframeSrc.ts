import { useEffect, useSyncExternalStore } from "react";
import { appendMetaClickIds, captureMetaClickIds } from "@/lib/attribution";

// The click ids are snapshotted once per page load and never change afterwards,
// so there is nothing to subscribe to.
const subscribe = () => () => {};

/**
 * Returns `baseUrl` with the Meta click ids (fbc/fbp) appended for a GHL iframe.
 *
 * useSyncExternalStore keeps the bare URL for SSR / first hydration (matching
 * the static prerendered HTML) and swaps to the appended URL immediately after
 * hydration — so there is no hydration mismatch and no setState-in-effect.
 */
export function useAttributedIframeSrc(baseUrl: string): string {
  useEffect(() => {
    captureMetaClickIds();
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => appendMetaClickIds(baseUrl),
    () => baseUrl,
  );
}
