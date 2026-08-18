"use client";

import { useEffect } from "react";

/**
 * The GHL booking widget (and its form_embed.js helper) scrolls THIS page on
 * its own as the visitor advances through date -> time -> confirmation, by
 * calling window.scrollTo()/scrollBy() and Element.scrollIntoView() from the
 * parent-page context.
 *
 * We neutralize that by no-op'ing those *programmatic* scroll APIs on this
 * standalone page. This is deliberately different from watching scroll events
 * and reverting them (which fought the visitor's own momentum scrolling on
 * mobile): native finger/wheel/keyboard scrolling does NOT go through these
 * JS methods — the browser's compositor handles it directly — so blocking the
 * methods stops the widget's jumps while leaving the visitor's own scrolling
 * completely untouched and perfectly smooth.
 *
 * Scoped to this page only (restored on unmount), and it patches the parent
 * document's context, never the cross-origin iframe's own.
 */
export default function BlockWidgetScroll() {
  useEffect(() => {
    const origScrollTo = window.scrollTo;
    const origScroll = window.scroll;
    const origScrollBy = window.scrollBy;
    const origScrollIntoView = Element.prototype.scrollIntoView;

    const noop = () => {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.scrollTo = noop as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.scroll = noop as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.scrollBy = noop as any;
    Element.prototype.scrollIntoView = noop;

    return () => {
      window.scrollTo = origScrollTo;
      window.scroll = origScroll;
      window.scrollBy = origScrollBy;
      Element.prototype.scrollIntoView = origScrollIntoView;
    };
  }, []);

  return null;
}
