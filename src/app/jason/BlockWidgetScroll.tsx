"use client";

import { useEffect } from "react";

/**
 * The GHL booking widget's form_embed.js helper scrolls THIS page as the
 * visitor advances through the booking flow by calling window.scrollTo() from
 * the parent-page context. We neutralize just that by no-op'ing the
 * window-level programmatic scroll APIs on this standalone page.
 *
 * This is deliberately narrow: native finger/wheel/keyboard scrolling does NOT
 * go through these JS methods (the browser's compositor handles it directly),
 * so blocking them stops the widget's jump while leaving the visitor's own
 * scrolling completely smooth. We intentionally do NOT touch
 * Element.prototype.scrollIntoView — patching it globally can interfere with
 * form_embed.js's own bookkeeping and stall the widget's slot loading.
 *
 * Scoped to this page only (restored on unmount), and it patches the parent
 * document's context, never the cross-origin iframe's own.
 */
export default function BlockWidgetScroll() {
  useEffect(() => {
    const origScrollTo = window.scrollTo;
    const origScroll = window.scroll;
    const origScrollBy = window.scrollBy;

    const noop = () => {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.scrollTo = noop as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.scroll = noop as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.scrollBy = noop as any;

    return () => {
      window.scrollTo = origScrollTo;
      window.scroll = origScroll;
      window.scrollBy = origScrollBy;
    };
  }, []);

  return null;
}
