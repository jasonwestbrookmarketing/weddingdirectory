"use client";

import { useEffect } from "react";

/**
 * The embedded GHL booking widget scrolls THIS page on its own as the visitor
 * advances through date -> time -> confirmation. It does this two ways we can't
 * reach into from the parent: its (optional) form_embed.js posts a scrollTo
 * message, and — even without that script — the widget's own internal page runs
 * focus()/scrollIntoView() on each step, which the browser natively propagates
 * up across the iframe boundary to move our document. Neither is cancelable with
 * CSS or by listening on the iframe (it's cross-origin).
 *
 * So instead of trying to prevent the jump, we let the page flow and scroll
 * exactly like normal, and simply *undo* any scroll that the user didn't cause.
 * We treat wheel / touch / keyboard / scrollbar-drag as "real" user intent and
 * remember that position; any scroll event that lands somewhere else without a
 * recent user gesture is the widget moving us, so we snap straight back. The
 * snap happens inside the scroll handler (same frame, before paint), so there's
 * no visible flicker — the page just stays put while the visitor books.
 */
export default function StopIframeAutoScroll() {
  useEffect(() => {
    let allowedY = window.scrollY;
    let lastGestureAt = 0;
    const GESTURE_WINDOW_MS = 250;

    const markGesture = () => {
      lastGestureAt = Date.now();
    };

    const onScroll = () => {
      if (Date.now() - lastGestureAt < GESTURE_WINDOW_MS) {
        // Scroll the visitor drove themselves — accept the new position.
        allowedY = window.scrollY;
        return;
      }
      // Scroll with no recent user gesture => the widget moved us. Undo it.
      if (Math.abs(window.scrollY - allowedY) > 1) {
        window.scrollTo(0, allowedY);
      }
    };

    // Passive listeners for every way a person actually initiates a scroll.
    window.addEventListener("wheel", markGesture, { passive: true });
    window.addEventListener("touchstart", markGesture, { passive: true });
    window.addEventListener("touchmove", markGesture, { passive: true });
    window.addEventListener("keydown", markGesture, { passive: true });
    window.addEventListener("mousedown", markGesture, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", markGesture);
      window.removeEventListener("touchstart", markGesture);
      window.removeEventListener("touchmove", markGesture);
      window.removeEventListener("keydown", markGesture);
      window.removeEventListener("mousedown", markGesture);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
