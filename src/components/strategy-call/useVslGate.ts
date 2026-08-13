"use client";

/**
 * CTA helper for the strategy-call page.
 *
 * The VSL is ungated and autoplays on landing. Every CTA (header, hero,
 * sticky mobile, final) opens the qualifier survey — "See If I Qualify".
 */
export function openQualifyModal() {
  window.dispatchEvent(new Event("open-strategy-modal"));
}

export function useVslGate() {
  return { openCta: openQualifyModal };
}
