import type { ReactNode } from "react";
import { ChevronDown, Globe } from "lucide-react";
import type { Json, VenueFaqItem, VenueSocialLinks } from "@/types/database";

// Brand icons were removed from lucide-react 0.543+, so we ship our own small
// inline SVGs. `currentColor` so they inherit from the button text color.
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M13.5 21v-7.5h2.54l.38-2.95H13.5V8.7c0-.85.24-1.43 1.47-1.43h1.56V4.64a20.8 20.8 0 0 0-2.28-.12c-2.26 0-3.81 1.38-3.81 3.92v2.11H7.88v2.95h2.56V21h3.06z" />
    </svg>
  );
}

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

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.343l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
    </svg>
  );
}

const SOCIAL_KEYS = [
  "facebook",
  "instagram",
  "tiktok",
  "pinterest",
  "website",
] as const;

/**
 * Narrow the raw jsonb blob on `venues.social_links` to the safe subset we
 * render. Anything that isn't a non-empty https URL is dropped.
 */
export function parseSocialLinks(raw: Json | null | undefined): VenueSocialLinks {
  const out: VenueSocialLinks = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
  const obj = raw as Record<string, Json | undefined>;
  for (const key of SOCIAL_KEYS) {
    const v = obj[key];
    if (typeof v === "string") {
      const trimmed = v.trim();
      if (trimmed.startsWith("http")) out[key] = trimmed;
    }
  }
  return out;
}

/**
 * Narrow the raw jsonb array on `venues.faq` to entries that have at least a
 * question or an answer. Caps at 20 items (dashboard caps writes at 20).
 */
export function parseFaq(raw: Json | null | undefined): VenueFaqItem[] {
  if (!Array.isArray(raw)) return [];
  const items: VenueFaqItem[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
    const o = entry as Record<string, Json | undefined>;
    const question = typeof o.question === "string" ? o.question.trim() : "";
    const answer = typeof o.answer === "string" ? o.answer.trim() : "";
    if (!question && !answer) continue;
    items.push({ question, answer });
    if (items.length >= 20) break;
  }
  return items;
}

const linkBtn =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50";

export function VenueSocialRow({ social }: { social: VenueSocialLinks }) {
  const entries = (Object.entries(social) as [keyof VenueSocialLinks, string][])
    .filter(([, u]) => typeof u === "string" && u.startsWith("http"));
  if (entries.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold text-stone-900 mb-6">Connect</h2>
      <div className="flex flex-wrap gap-2">
        {entries.map(([key, url]) => {
          let icon: ReactNode;
          let label: string;
          switch (key) {
            case "facebook":
              icon = <FacebookIcon className="h-4 w-4" />;
              label = "Facebook";
              break;
            case "instagram":
              icon = <InstagramIcon className="h-4 w-4" />;
              label = "Instagram";
              break;
            case "tiktok":
              icon = <TikTokIcon className="h-4 w-4" />;
              label = "TikTok";
              break;
            case "pinterest":
              icon = <PinterestIcon className="h-4 w-4" />;
              label = "Pinterest";
              break;
            case "website":
            default:
              icon = <Globe className="h-4 w-4" />;
              label = "Website";
              break;
          }
          return (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={linkBtn}
              aria-label={label}
            >
              {icon}
            </a>
          );
        })}
      </div>
    </section>
  );
}

export function VenueFaqSection({ items }: { items: VenueFaqItem[] }) {
  if (!items.length) return null;
  return (
    <section>
      <h2 className="text-xl font-semibold text-stone-900 mb-6">
        Frequently asked questions
      </h2>
      {/*
        Native <details> gives us a closed-by-default accordion with full
        keyboard + screen-reader support and no client JS. We style the open
        state via the [&[open]] group selector so the chevron flips and
        borders hug tighter when expanded.
      */}
      <div className="space-y-3">
        {items.map((item, i) => (
          <details
            key={i}
            className="group rounded-2xl border border-stone-200 bg-white"
          >
            <summary
              className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 text-left [&::-webkit-details-marker]:hidden"
            >
              <span className="font-semibold text-stone-900 text-sm leading-snug">
                {item.question || "Question"}
              </span>
              <ChevronDown
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-stone-500 transition-transform duration-200 group-open:rotate-180"
                aria-hidden
              />
            </summary>
            {item.answer && (
              <div className="px-5 pb-5 -mt-1">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-600">
                  {item.answer}
                </p>
              </div>
            )}
          </details>
        ))}
      </div>
    </section>
  );
}
