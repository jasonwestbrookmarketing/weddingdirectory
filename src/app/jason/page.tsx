import type { Metadata } from "next";
import Image from "next/image";
import { Globe } from "lucide-react";
import BlockWidgetScroll from "./BlockWidgetScroll";

// Brand icons were removed from lucide-react 0.543+ (see the same pattern in
// src/components/venue/VenuePublicBlocks.tsx), so we ship our own small
// inline SVGs. `currentColor` so they inherit from the button text color.
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.115C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.386.526A2.994 2.994 0 0 0 .502 6.186 31.03 31.03 0 0 0 0 12a31.03 31.03 0 0 0 .502 5.814 2.994 2.994 0 0 0 2.112 2.115c1.881.526 9.386.526 9.386.526s7.505 0 9.386-.526a2.994 2.994 0 0 0 2.112-2.115A31.03 31.03 0 0 0 24 12a31.03 31.03 0 0 0-.502-5.814zM9.75 15.568V8.432L15.818 12 9.75 15.568z" />
    </svg>
  );
}

const SITE_URL = (
  process.env.NEXT_PUBLIC_DIRECTORY_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://storyvenue.com"
).replace(/\/$/, "");

export const dynamic = "force-static";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Book a Call with Jason | StoryVenue",
  description:
    "Schedule a one-on-one call with Jason to talk specifically about your venue.",
  alternates: { canonical: "/jason" },
  // Personal contact/booking link — meant for direct sharing, not organic search.
  // Flip this to true if you'd rather it be discoverable via Google.
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "Book a Call with Jason | StoryVenue",
    description:
      "Schedule a one-on-one call with Jason to talk specifically about your venue.",
    url: "/jason",
    siteName: "StoryVenue",
    type: "profile",
  },
};

// ── Edit everything in this block to update the page content ──────────────
const PROFILE = {
  // Full-bleed portrait photo — fills the entire width/top edge of the left
  // panel. Drop a replacement into /public/jason-photo.png (portrait orientation
  // works best; it's cropped with object-cover at a 4:5 aspect ratio).
  photo: "/jason-photo.png",
  name: "Jason Westbrook",
  title: "Founder, StoryVenue",
  heading: "Let's Talk About Your Venue",
  description:
    "Time on my calendar to talk through whatever you need. Strategy, questions, next steps, or just to catch up.",
  socials: [
    { icon: Globe, href: "https://storyvenue.com", label: "Website" },
    {
      icon: InstagramIcon,
      href: "https://www.instagram.com/storyvenue",
      label: "Instagram",
    },
    {
      icon: YoutubeIcon,
      href: "https://www.youtube.com/@bridebookingsystem",
      label: "YouTube",
    },
  ],
};

const GHL_CALENDAR_URL =
  "https://api.leadconnectorhq.com/widget/booking/3elDdFHS38YLNp25JeB5";
const GHL_CALENDAR_ID = "3elDdFHS38YLNp25JeB5_1787061067537";
// ────────────────────────────────────────────────────────────────────────────

export default function JasonPage() {
  return (
    // Normal, natural document flow — the whole page scrolls as one smooth
    // surface. The calendar iframe below auto-sizes to its content (via GHL's
    // form_embed.js) so it never has an internal scrollbar that would trap a
    // thumb-scroll on mobile, and BlockWidgetScroll neutralizes the widget's
    // programmatic page-jumps without ever touching the visitor's own scroll.
    <main className="min-h-screen flex items-center justify-center bg-brand-warm px-4 py-10 sm:py-16">
      {/* Warm up the connections to GHL up front so the booking widget and its
          resizer script start downloading the instant the page HTML parses,
          instead of waiting — this is what keeps the calendar's time slots
          from buffering on first interaction. */}
      <link
        rel="preconnect"
        href="https://api.leadconnectorhq.com"
        crossOrigin=""
      />
      <link rel="preconnect" href="https://link.msgsndr.com" crossOrigin="" />
      {/* Load GHL's resizer eagerly in the initial HTML (React hoists this
          async script into <head>) rather than after hydration, so the widget
          has its helper ready immediately. */}
      <script async src="https://link.msgsndr.com/js/form_embed.js" />
      <BlockWidgetScroll />
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-brand-line overflow-hidden grid grid-cols-1 md:grid-cols-[420px_1fr] divide-y md:divide-y-0 md:divide-x divide-brand-line">
        {/* Left — profile / bio. Photo is full-bleed: flush against the
              panel's top + side edges, no padding, so it reads edge-to-edge.
              The outer card's `overflow-hidden rounded-3xl` automatically
              clips its top corner(s) to match — no rounding needed here. */}
        <div className="flex flex-col">
          <div className="relative w-full aspect-[4/5]">
            <Image
              src={PROFILE.photo}
              alt={PROFILE.name}
              fill
              priority
              sizes="(min-width: 768px) 420px, 100vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-between gap-8 flex-1 p-8 sm:p-10">
            <div>
              <p className="text-base font-semibold text-brand-ink">
                {PROFILE.name}
              </p>
              <p className="text-sm text-brand-muted">{PROFILE.title}</p>

              <h1
                className="mt-5 text-2xl sm:text-[1.75rem] font-normal leading-tight tracking-tight text-brand-ink"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {PROFILE.heading}
              </h1>

              <p className="mt-3 text-[15px] leading-relaxed text-brand-muted">
                {PROFILE.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {PROFILE.socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-full border border-brand-line text-brand-muted hover:text-brand-ink hover:border-brand-ink transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right — GHL calendar embed (renders its own date/time picker UI).
              We load GHL's form_embed.js so the iframe auto-resizes to fit its
              content: with `scrolling="no"` and no fixed height, it never gets
              an internal scrollbar, so a thumb-drag anywhere on mobile scrolls
              the whole page instead of getting trapped inside the widget. The
              scroll-jump that form_embed.js would otherwise cause is defused by
              BlockWidgetScroll (mounted above), which no-ops the programmatic
              scroll APIs while leaving native finger/wheel scrolling alone.
              `min-h` is only a first-paint placeholder before the script sizes
              it. */}
        <div className="bg-white p-2 sm:p-4">
          <iframe
            src={GHL_CALENDAR_URL}
            id={GHL_CALENDAR_ID}
            allow="payment"
            scrolling="no"
            style={{
              width: "100%",
              border: "none",
              display: "block",
              overflow: "hidden",
            }}
            className="min-h-[640px]"
            title="Book a call"
          />
        </div>
      </div>
    </main>
  );
}
