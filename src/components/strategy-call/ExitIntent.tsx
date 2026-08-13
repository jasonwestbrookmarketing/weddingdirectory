"use client";

import { useEffect } from "react";

const SESSION_KEY = "sv_exit_intent_shown";
const MIN_TIME_MS = 5000;

/**
 * Exit-intent: open the "See If I Qualify" survey when the cursor leaves
 * the top of the viewport. Single-use per session.
 */
export default function ExitIntent() {
  useEffect(() => {
    const readyAt = Date.now() + MIN_TIME_MS;

    function handleMouseLeave(e: MouseEvent) {
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
