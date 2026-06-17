"use client";

import { useEffect } from "react";

const SESSION_KEY = "sv_exit_intent_shown";
// Minimum time on page before exit intent can fire (ms)
const MIN_TIME_MS = 5000;

/**
 * Fires the "open-strategy-modal" event when the user moves their cursor
 * above the viewport (about to hit the browser chrome / close tab).
 * Triggers at most once per session.
 */
export default function ExitIntent() {
  useEffect(() => {
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(SESSION_KEY)) {
      return;
    }

    const readyAt = Date.now() + MIN_TIME_MS;

    function handleMouseLeave(e: MouseEvent) {
      // Only fire when cursor exits through the top edge
      if (e.clientY > 20) return;
      if (Date.now() < readyAt) return;
      if (sessionStorage.getItem(SESSION_KEY)) return;

      sessionStorage.setItem(SESSION_KEY, "1");
      window.dispatchEvent(new Event("open-strategy-modal"));
    }

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  return null;
}
