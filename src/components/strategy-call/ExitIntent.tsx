"use client";

import { useEffect } from "react";
import { VSL_STORAGE_KEY, VSL_EVENT_OPEN } from "./useVslGate";

// Separate session keys so consuming one doesn't block the other.
// The VSL key governs the Watch Now modal; the survey key governs the
// qualifier survey. They fire independently based on gate status.
const SESSION_KEY_VSL    = "sv_exit_intent_vsl";
const SESSION_KEY_SURVEY = "sv_exit_intent_shown";
const MIN_TIME_MS = 5000;

/**
 * Fires the correct exit-intent modal based on whether the visitor has
 * already passed the VSL gate:
 *   - gate not passed → "open-vsl-modal"       (Watch Now lead form)
 *   - gate passed     → "open-strategy-modal"  (qualifier survey)
 * Each path has its own session key so a prior fired state for one
 * never silently blocks the other.
 */
export default function ExitIntent() {
  useEffect(() => {
    const readyAt = Date.now() + MIN_TIME_MS;

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY > 20) return;
      if (Date.now() < readyAt) return;

      let gatePassed = false;
      try { gatePassed = !!localStorage.getItem(VSL_STORAGE_KEY); } catch {}

      if (gatePassed) {
        // Qualifier survey path — single-use per session
        if (sessionStorage.getItem(SESSION_KEY_SURVEY)) return;
        sessionStorage.setItem(SESSION_KEY_SURVEY, "1");
        window.dispatchEvent(new Event("open-strategy-modal"));
      } else {
        // VSL Watch Now path — single-use per session
        if (sessionStorage.getItem(SESSION_KEY_VSL)) return;
        sessionStorage.setItem(SESSION_KEY_VSL, "1");
        window.dispatchEvent(new Event(VSL_EVENT_OPEN));
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  return null;
}
