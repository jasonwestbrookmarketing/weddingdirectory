"use client";

/**
 * CTA helper for the strategy-call page.
 *
 * The VSL is ungated and autoplays on landing. Every CTA (header, hero,
 * sticky mobile, final) opens the qualifier survey — "See If I Qualify".
 */
export function openQualifyModal() {
  window.dispatchEvent(new Event("open-strategy-modal"));
  // Fire VSL Optin once per session — mirrors the old FreeTrainingOptIn event
  // that the email-gate used to fire, so the "VSL Optin" custom conversion
  // in Meta starts receiving data again without any GHL changes.
  try {
    if (!sessionStorage.getItem("_vsl_optin_fired")) {
      const w = window as unknown as { fbq?: (...a: unknown[]) => void };
      w.fbq?.("trackCustom", "FreeTrainingOptIn");
      sessionStorage.setItem("_vsl_optin_fired", "1");
    }
  } catch { /* non-fatal */ }
}

export function useVslGate() {
  return { openCta: openQualifyModal };
}
