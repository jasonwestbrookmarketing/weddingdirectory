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
export function useVslGate() {
  const [gatePassed, setGatePassed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(VSL_STORAGE_KEY)) setGatePassed(true);
    } catch {}

    const onPassed = () => setGatePassed(true);
    window.addEventListener(VSL_EVENT_PASSED, onPassed);
    return () => window.removeEventListener(VSL_EVENT_PASSED, onPassed);
  }, []);

  const openCta = () =>
    window.dispatchEvent(new Event(gatePassed ? "open-strategy-modal" : VSL_EVENT_OPEN));

  return { gatePassed, openCta };
}
