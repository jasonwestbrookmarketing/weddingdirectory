import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Building2,
  TrendingUp,
  ArrowUpRight,
  Globe,
} from "lucide-react";

// Brand icons were removed from lucide-react 0.543+ (same pattern used in
// src/app/jason/page.tsx and src/components/venue/VenuePublicBlocks.tsx), so we
// ship our own small inline SVGs. `currentColor` so they inherit the text color.
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
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.115C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.386.526A2.994 2.994 0 0 0 .502 6.186 31.03 31.03 0 0 0 0 12a31.03 31.03 0 0 0 .502 5.814 2.994 2.994 0 0 0 2.112 2.115c1.881.526 9.386.526 9.386.526s7.505 0 9.386-.526a2.994 2.994 0 0 0 2.112-2.115A31.03 31.03 0 0 0 24 12a31.03 31.03 0 0 0-.502-5.814zM9.75 15.568V8.432L15.818 12 9.75 15.568z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345c-.091.378-.293 1.194-.333 1.361-.052.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.966 7.398 6.931 0 4.136-2.608 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
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
  title: "StoryVenue — Links",
  description:
    "Everything StoryVenue in one place: find a wedding venue, list your venue for free, book more weddings, and connect with us.",
  alternates: { canonical: "/links" },
  openGraph: {
    title: "StoryVenue — Links",
    description:
      "Everything StoryVenue in one place: find a wedding venue, list your venue for free, book more weddings, and connect with us.",
    url: "/links",
    siteName: "StoryVenue",
    type: "website",
    images: [{ url: "/og-strategy-call.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "StoryVenue — Links",
    description:
      "Find a wedding venue, list your venue for free, book more weddings, and connect with us.",
    images: ["/og-strategy-call.png"],
  },
};

// ── Edit everything in this block to update the page ────────────────────────
const PROFILE = {
  // Circular brand mark shown at the top. Swap the file in /public if needed.
  mark: "/storyvenue-mark.png",
  // Official wordmark (with ™) used as the name/heading. Dark version reads on
  // the light background.
  logo: "/storyvenue-dark-logo.png",
  name: "StoryVenue",
  handle: "@storyvenue",
  tagline: "Fully book your wedding venue without empty weekends",
};

type LinkItem = {
  label: string;
  description?: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  featured?: boolean;
};

// Reorder / add / remove freely. Internal routes start with "/"; anything
// starting with "http" opens in a new tab automatically.
const LINKS: LinkItem[] = [
  {
    label: "Book More Weddings",
    description: "The system that fills your venue's calendar",
    href: "/strategy-call",
    icon: TrendingUp,
    featured: true,
  },
  {
    label: "List Your Venue Free",
    description: "Venue owners: claim your free StoryVenue listing",
    href: "/free-listing",
    icon: Building2,
  },
  {
    label: "Find Your Perfect Wedding Venue",
    description: "Browse venues by location, guest count & budget",
    href: "/",
    icon: Search,
  },
  {
    label: "Watch on YouTube",
    description: "The Bride Booking System channel",
    href: "https://www.youtube.com/@bridebookingsystem",
    icon: YoutubeIcon,
  },
];

const SOCIALS = [
  { icon: Globe, href: "https://storyvenue.com", label: "Website" },
  { icon: InstagramIcon, href: "https://www.instagram.com/storyvenue", label: "Instagram" },
  { icon: YoutubeIcon, href: "https://www.youtube.com/@bridebookingsystem", label: "YouTube" },
  { icon: FacebookIcon, href: "https://www.facebook.com/storyvenuemarketing", label: "Facebook" },
  { icon: PinterestIcon, href: "https://www.pinterest.com/storyvenue", label: "Pinterest" },
];
// ────────────────────────────────────────────────────────────────────────────

function LinkButton({ item }: { item: LinkItem }) {
  const { label, description, href, icon: Icon, featured } = item;
  const external = href.startsWith("http");

  const base =
    "group relative flex items-center gap-4 w-full rounded-2xl border px-5 py-4 text-left transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink/15";
  const skin = featured
    ? "border-transparent bg-brand-ink text-white shadow-[0_16px_40px_-18px_rgba(0,0,0,0.55)] hover:bg-black"
    : "border-brand-line bg-white text-brand-ink shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)] hover:border-brand-ink";

  const inner = (
    <>
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          featured
            ? "bg-white/10 text-white"
            : "bg-brand-warm text-brand-muted"
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold leading-snug">
          {label}
        </span>
        {description ? (
          <span
            className={`mt-0.5 block text-[13px] leading-snug ${
              featured ? "text-white/70" : "text-brand-muted"
            }`}
          >
            {description}
          </span>
        ) : null}
      </span>

      <ArrowUpRight
        className={`h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
          featured ? "text-white/70" : "text-brand-muted"
        }`}
      />
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${skin}`}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={`${base} ${skin}`}>
      {inner}
    </Link>
  );
}

export default function LinksPage() {
  return (
    <main className="flex min-h-screen justify-center bg-brand-warm px-4 py-12 sm:py-16">
      <div className="w-full max-w-[520px]">
        {/* Header — brand mark, name, tagline */}
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-brand-line bg-white p-3 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.4)]">
            <Image
              src={PROFILE.mark}
              alt={PROFILE.name}
              width={72}
              height={72}
              priority
              className="h-auto w-full object-contain"
            />
          </div>

          <h1 className="mt-6">
            <Image
              src={PROFILE.logo}
              alt={PROFILE.name}
              width={3000}
              height={751}
              priority
              className="h-9 w-auto sm:h-10"
            />
          </h1>
          <p className="mt-2 text-sm font-medium text-brand-ink">
            {PROFILE.handle}
          </p>
          <p className="mt-3 whitespace-nowrap text-[13px] leading-relaxed text-brand-muted sm:text-[15px]">
            {PROFILE.tagline}
          </p>
        </div>

        {/* Links */}
        <div className="mt-9 flex flex-col gap-3">
          {LINKS.map((item) => (
            <LinkButton key={item.label} item={item} />
          ))}
        </div>

        {/* Socials */}
        <div className="mt-9 flex items-center justify-center gap-3">
          {SOCIALS.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-line bg-white text-brand-muted transition-colors hover:border-brand-ink hover:text-brand-ink"
            >
              <Icon className="h-[18px] w-[18px]" />
            </a>
          ))}
        </div>

        {/* Footer */}
        <p className="mt-10 text-center text-xs text-brand-muted">
          © {new Date().getFullYear()} StoryVenue ·{" "}
          <Link href="/" className="underline-offset-2 hover:text-brand-ink hover:underline">
            storyvenue.com
          </Link>
        </p>
      </div>
    </main>
  );
}
