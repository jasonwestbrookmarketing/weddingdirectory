"use client";

import { useEffect } from "react";

/**
 * The embedded GHL booking widget scrolls THIS page on its own as the visitor
 * advances through date -> time -> confirmation (its internal page runs
 * focus()/scrollIntoView(), which the browser natively propagates up across the
 * cross-origin iframe boundary to move our document). We can't cancel that from
 * the parent, so instead we snap the page back to where it was.
 *
 * The important part — and what an earlier version got wrong on mobile — is that
 * this must NEVER interfere with the visitor's own scrolling:
 *
 *   1. We only ever act while the calendar <iframe> actually holds focus. Just
 *      landing on the page and scrolling to read never touches the iframe, so
 *      the guard is completely dormant during normal browsing.
 *   2. Even once the iframe is focused (after they tap a date), an active finger
 *      drag / wheel / key press always wins — we track those and stand down,
 *      with a grace window so momentum ("flick") scrolling on iOS isn't cut off
 *      after the finger lifts.
 *
 * Only a scroll that happens while the iframe is focused AND with no real user
 * input behind it is treated as the widget yanking the page, and reverted.
 */
export default function StopIframeAutoScroll() {
  useEffect(() => {
    let anchorY = window.scrollY;
    let releaseUntil = 0; // while now < this, the visitor is scrolling: hands off

    const iframeFocused = () => document.activeElement?.tagName === "IFRAME";

    // Any genuine user scroll input opens/refreshes a grace window. touchmove
    // refreshing it is what keeps iOS momentum scrolling from being clipped
    // after the finger lifts.
    const userInput = () => {
      releaseUntil = Date.now() + 900;
      anchorY = window.scrollY;
    };

    const onScroll = () => {
      // Dormant during normal browsing — the iframe isn't focused, so just
      // track the position and let the page scroll 100% naturally.
      if (!iframeFocused()) {
        anchorY = window.scrollY;
        return;
      }
      // Iframe is focused, but the visitor is actively scrolling — let them,
      // and keep the anchor synced to where they land.
      if (Date.now() < releaseUntil) {
        anchorY = window.scrollY;
        return;
      }
      // Iframe focused + no user input behind this scroll => widget yanked the
      // page. Put it back (synchronously, same frame, so there's no flicker).
      if (Math.abs(window.scrollY - anchorY) > 1) {
        window.scrollTo(0, anchorY);
      }
    };

    window.addEventListener("touchstart", userInput, { passive: true });
    window.addEventListener("touchmove", userInput, { passive: true });
    window.addEventListener("wheel", userInput, { passive: true });
    window.addEventListener("keydown", userInput, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("touchstart", userInput);
      window.removeEventListener("touchmove", userInput);
      window.removeEventListener("wheel", userInput);
      window.removeEventListener("keydown", userInput);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
