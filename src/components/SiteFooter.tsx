import Image from "next/image";
import Link from "next/link";

const STORYPAY_URL =
  process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";

export default function SiteFooter() {
  return (
    <footer className="bg-stone-100 py-10 px-6 md:px-12 mt-auto">
      {/* Grid gives the copyright a true center column independent of
          the logo/links widths. On mobile it stacks vertically. */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-4">
        {/* Logo — left */}
        <Link href="/" aria-label="StoryVenue home" className="flex md:justify-start justify-center">
          <Image
            src="/storyvenue-dark-logo.png"
            alt="StoryVenue"
            width={140}
            height={36}
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Copyright — always perfectly centered */}
        <p className="text-sm text-stone-500 text-center">
          &copy; {new Date().getFullYear()} StoryVenue. All rights reserved.
        </p>

        {/* Links — right */}
        <div className="flex items-center justify-center md:justify-end gap-5 text-sm text-stone-500">
          <a
            href={`${STORYPAY_URL}/privacy`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-stone-900 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href={`${STORYPAY_URL}/terms`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-stone-900 transition-colors"
          >
            Terms of Use
          </a>
          <a
            href={`${STORYPAY_URL}/signup`}
            className="hover:text-stone-900 transition-colors"
          >
            Claim Your Free Listing
          </a>
        </div>
      </div>
    </footer>
  );
}
