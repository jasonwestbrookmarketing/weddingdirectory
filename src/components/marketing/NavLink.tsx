"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

/**
 * Internal nav link that hard-guarantees a scroll-to-top on navigation.
 *
 * Browsers sometimes restore the previous scroll position when revisiting a
 * route (Next.js scroll restoration in App Router can do this on
 * back/forward AND on programmatic Link clicks after a prior visit). For a
 * marketing landing page that absolutely needs to start at the hero, we
 * defensively call window.scrollTo(0, 0) on click so the page begins fresh
 * regardless of any restored position.
 */
export default function NavLink({
  href,
  children,
  className,
  style,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}) {
  function handleClick() {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className}
      style={style}
      aria-label={ariaLabel}
      scroll
    >
      {children}
    </Link>
  );
}
