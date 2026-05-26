import Link from "next/link";

const STORYPAY_URL =
  process.env.NEXT_PUBLIC_STORYPAY_URL ?? "https://app.storyvenue.com";

export default function PageFooter() {
  return (
    <footer className="bg-brand-bg border-t border-brand-line py-8 px-6 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-brand-muted">
        <p style={{ fontFamily: "var(--font-open-sans)" }}>
          &copy; 2026 StoryVenue
        </p>

        <nav className="flex items-center gap-5" aria-label="Footer">
          <a
            href={`${STORYPAY_URL}/privacy`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-ink transition-colors"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Privacy
          </a>
          <a
            href={`${STORYPAY_URL}/terms`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-ink transition-colors"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            Terms
          </a>
          <Link
            href="/book-more-weddings"
            className="hover:text-brand-ink transition-colors"
            style={{ fontFamily: "var(--font-open-sans)" }}
          >
            List Your Venue
          </Link>
        </nav>
      </div>
    </footer>
  );
}
