"use client";

import { useEffect } from "react";
import { VSL_STORAGE_KEY, VSL_EVENT_OPEN } from "./useVslGate";

const SESSION_KEY = "sv_exit_intent_shown";
const MIN_TIME_MS = 5000;

/**
 * Fires the correct exit-intent modal based on whether the visitor has
 * already passed the VSL gate:
 *   - gate not passed → "open-vsl-modal"      (VSL lead form)
 *   - gate passed     → "open-strategy-modal"  (qualifier survey)
 * Triggers at most once per session.
 */
export default function ExitIntent() {
  useEffect(() => {
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(SESSION_KEY)) {
      return;
    }

    const readyAt = Date.now() + MIN_TIME_MS;

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY > 20) return;
      if (Date.now() < readyAt) return;
      if (sessionStorage.getItem(SESSION_KEY)) return;

      sessionStorage.setItem(SESSION_KEY, "1");

      // Read gate status at fire-time (visitor may have submitted between
      // page load and this event firing)
      let gatePassed = false;
      try { gatePassed = !!localStorage.getItem(VSL_STORAGE_KEY); } catch {}

      window.dispatchEvent(new Event(gatePassed ? "open-strategy-modal" : VSL_EVENT_OPEN));
    }

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  return null;
}
