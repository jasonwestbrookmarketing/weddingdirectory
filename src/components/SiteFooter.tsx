import Image from "next/image";
import Link from "next/link";

const STORYPAY_URL =
  process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";

// Brand social icons. lucide-react dropped brand glyphs in 0.543+, so (as in
// src/app/links/page.tsx and src/app/jason/page.tsx) we ship small inline SVGs
// that inherit the current text color.
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

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.115C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.386.526A2.994 2.994 0 0 0 .502 6.186 31.03 31.03 0 0 0 0 12a31.03 31.03 0 0 0 .502 5.814 2.994 2.994 0 0 0 2.112 2.115c1.881.526 9.386.526 9.386.526s7.505 0 9.386-.526a2.994 2.994 0 0 0 2.112-2.115A31.03 31.03 0 0 0 24 12a31.03 31.03 0 0 0-.502-5.814zM9.75 15.568V8.432L15.818 12 9.75 15.568z" />
    </svg>
  );
}

const SOCIALS = [
  { icon: InstagramIcon, href: "https://www.instagram.com/storyvenue", label: "Instagram" },
  { icon: FacebookIcon, href: "https://www.facebook.com/storyvenuemarketing", label: "Facebook" },
  { icon: PinterestIcon, href: "https://www.pinterest.com/storyvenue", label: "Pinterest" },
  { icon: YoutubeIcon, href: "https://www.youtube.com/@bridebookingsystem", label: "YouTube" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-stone-100 py-10 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
          {/* Logo + app badges — left, all on one line */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <Link href="/" aria-label="StoryVenue home">
              <Image
                src="/storyvenue-dark-logo.png"
                alt="StoryVenue"
                width={140}
                height={36}
                className="h-8 w-auto object-contain"
              />
            </Link>

            {/* iOS App Store */}
            <a
              href="https://apps.apple.com/us/app/storyvenue/id6797507866"
              target="_blank"
              rel="noopener noreferrer"
              title="Download on the App Store"
              className="h-8 flex items-center gap-1.5 rounded-lg px-2.5 hover:opacity-75 transition-opacity"
              style={{ background: "#1b1b1b" }}
            >
              <svg viewBox="0 0 24 24" width="12" height="14" fill="white" style={{ flexShrink: 0 }}>
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83z" />
                <path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="leading-none">
                <div className="text-white whitespace-nowrap" style={{ fontSize: 7, opacity: 0.7 }}>Download on the</div>
                <div className="text-white font-semibold whitespace-nowrap" style={{ fontSize: 11 }}>App Store</div>
              </div>
            </a>

            {/* Google Play */}
            <a
              href="https://play.google.com/store/apps/details?id=com.storyvenue.app"
              target="_blank"
              rel="noopener noreferrer"
              title="Get it on Google Play"
              className="h-8 flex items-center gap-1.5 rounded-lg px-2.5 hover:opacity-75 transition-opacity"
              style={{ background: "#1b1b1b" }}
            >
              <svg viewBox="0 0 10 12" width="10" height="12" fill="white" style={{ flexShrink: 0 }}>
                <path d="M0 0l10 6-10 6z" />
              </svg>
              <div className="leading-none">
                <div className="text-white whitespace-nowrap" style={{ fontSize: 7, opacity: 0.7, letterSpacing: "0.05em" }}>GET IT ON</div>
                <div className="text-white font-semibold whitespace-nowrap" style={{ fontSize: 11 }}>Google Play</div>
              </div>
            </a>
          </div>

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

        {/* Social media */}
        <div className="mt-8 pt-6 border-t border-stone-200 flex items-center justify-center gap-4">
          {SOCIALS.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition-colors hover:border-stone-900 hover:text-stone-900"
            >
              <Icon className="h-[18px] w-[18px]" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
