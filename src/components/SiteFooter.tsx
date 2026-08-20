import Image from "next/image";
import Link from "next/link";

const STORYPAY_URL =
  process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";

export default function SiteFooter() {
  return (
    <footer className="bg-stone-100 py-10 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top row: logo | copyright | links */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
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
              Start Free
            </a>
          </div>
        </div>

        {/* App store badges — centered below the main row */}
        <div className="flex items-center justify-center gap-3">
          {/* iOS App Store */}
          <a
            href="https://apps.apple.com/us/app/storyvenue/id6797507866"
            target="_blank"
            rel="noopener noreferrer"
            title="Download on the App Store"
            className="h-10 flex items-center gap-2 rounded-lg px-3 hover:opacity-75 transition-opacity"
            style={{ background: "#1b1b1b" }}
          >
            {/* Apple logo — MDI path, body and leaf stem share the same center */}
            <svg viewBox="0 0 24 24" width="14" height="17" fill="white" style={{ flexShrink: 0 }}>
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83z" />
              <path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div className="leading-none">
              <div className="text-white whitespace-nowrap" style={{ fontSize: 8, opacity: 0.7 }}>Download on the</div>
              <div className="text-white font-semibold whitespace-nowrap" style={{ fontSize: 13 }}>App Store</div>
            </div>
          </a>

          {/* Google Play */}
          <a
            href="https://play.google.com/store/apps/details?id=com.storyvenue.app"
            target="_blank"
            rel="noopener noreferrer"
            title="Get it on Google Play"
            className="h-10 flex items-center gap-2 rounded-lg px-3 hover:opacity-75 transition-opacity"
            style={{ background: "#1b1b1b" }}
          >
            {/* Play triangle */}
            <svg viewBox="0 0 10 12" width="11" height="13" fill="white" style={{ flexShrink: 0 }}>
              <path d="M0 0l10 6-10 6z" />
            </svg>
            <div className="leading-none">
              <div className="text-white whitespace-nowrap" style={{ fontSize: 8, opacity: 0.7, letterSpacing: "0.05em" }}>GET IT ON</div>
              <div className="text-white font-semibold whitespace-nowrap" style={{ fontSize: 13 }}>Google Play</div>
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
}
