"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, ExternalLink } from "lucide-react";

function ConfirmationContent() {
  const params = useSearchParams();
  const slug = params.get("slug");
  const website = params.get("website");
  const name = params.get("name") || "the venue";

  const listingHref = slug ? `/venue/${slug}` : "/search";

  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-50 px-6">
      <div className="max-w-md w-full text-center space-y-8 py-20">
        {/* Success icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-emerald-50 p-4">
            <CheckCircle className="h-10 w-10 text-emerald-600" strokeWidth={1.5} />
          </div>
        </div>

        {/* Heading + copy */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-stone-900">
            Thanks for downloading our guide!
          </h1>
          <p className="text-stone-500 text-base leading-relaxed">
            It&apos;s on the way to your inbox, and we&apos;ll text a copy too.
            We&apos;ll personally follow up to answer any questions you have and
            check your date.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          {website ? (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 text-white px-6 py-3.5 text-base font-semibold hover:bg-stone-800 transition-colors"
            >
              Visit {name}&apos;s Website
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <Link
              href={listingHref}
              className="inline-flex items-center justify-center rounded-xl bg-stone-900 text-white px-6 py-3.5 text-base font-semibold hover:bg-stone-800 transition-colors"
            >
              Back to Listing
            </Link>
          )}

          <Link
            href={listingHref}
            className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-900 px-6 py-3.5 text-base font-semibold hover:bg-stone-50 transition-colors"
          >
            Back to Listing
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense>
      <ConfirmationContent />
    </Suspense>
  );
}
