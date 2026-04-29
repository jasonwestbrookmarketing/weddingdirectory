import Image from "next/image";
import Link from "next/link";

const STORYPAY_URL =
  process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";

export default function SiteFooter() {
  return (
    <footer className="bg-stone-100 py-10 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" aria-label="StoryVenue home">
          <Image
            src="/storyvenue-dark-logo.png"
            alt="StoryVenue"
            width={140}
            height={36}
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Copyright */}
        <p className="text-sm text-stone-500">
          &copy; {new Date().getFullYear()} StoryVenue. All rights reserved.
        </p>

        {/* Links */}
        <div className="flex items-center gap-5 text-sm text-stone-500">
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
            href={`${STORYPAY_URL}/signup?as=venue`}
            className="hover:text-stone-900 transition-colors"
          >
            List Your Venue
          </a>
        </div>
      </div>
    </footer>
  );
}
