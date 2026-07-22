"use client";

import { useEffect, useState } from "react";

export const VSL_STORAGE_KEY  = "sv_vsl_gate_passed";
export const VSL_EVENT_OPEN   = "open-vsl-modal";
export const VSL_EVENT_PASSED = "vsl-gate-passed";

/**
 * Returns whether the visitor has already passed the VSL gate form,
 * and an `openCta` function that dispatches the right modal event:
 *   - gate not passed → "open-vsl-modal"  (VSL lead form)
 *   - gate passed     → "open-strategy-modal" (qualifier survey)
 *
 * Also listens for the "vsl-gate-passed" event so all buttons on the
 * page switch labels instantly when the form is submitted.
 */
/**
 * Synchronously read (and optionally clear) the gate flag before first render.
 * Handles ?reset / ?reset_gate by wiping the key and stripping the param so
 * every component on the page starts with gatePassed = false consistently.
 */
function readInitialGatePassed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const sp = new URLSearchParams(window.location.search);
    if (sp.has("reset") || sp.has("reset_gate")) {
      localStorage.removeItem(VSL_STORAGE_KEY);
      // Strip the param so sharing the URL doesn't keep resetting.
      sp.delete("reset");
      sp.delete("reset_gate");
      const clean = window.location.pathname + (sp.toString() ? `?${sp}` : "");
      window.history.replaceState(null, "", clean);
      return false;
    }
    return !!localStorage.getItem(VSL_STORAGE_KEY);
  } catch {
    return false;
  }
}

export function useVslGate() {
  // useState initializer runs synchronously on first render — no race with
  // async effects — so every component using this hook starts with the same
  // correct value, including nav buttons and the player itself.
  const [gatePassed, setGatePassed] = useState<boolean>(readInitialGatePassed);

  useEffect(() => {
    const onPassed = () => setGatePassed(true);
    window.addEventListener(VSL_EVENT_PASSED, onPassed);
    return () => window.removeEventListener(VSL_EVENT_PASSED, onPassed);
  }, []);

  const openCta = () =>
    window.dispatchEvent(new Event(gatePassed ? "open-strategy-modal" : VSL_EVENT_OPEN));

  return { gatePassed, openCta };
}
