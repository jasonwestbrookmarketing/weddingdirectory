import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { VenueMetaPixelScript } from "@/components/venue/VenueMetaPixelScript";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Lead-capture thank-you page, one per venue slug.
 *
 * This exists (rather than the old shared `/confirmation` page) so each
 * venue's own Meta Pixel can fire here — a venue owner creates a Meta
 * custom conversion rule matching this URL, so every guide download from
 * their Meta ads is attributed automatically with zero extra setup beyond
 * pasting their Pixel ID into the dashboard.
 */
export default async function VenueThankYouPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  const supabase = await createClient();
  const { data: venue } = await supabase
    .from("venues")
    .select("name, slug, brand_website, meta_pixel_id")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!venue) notFound();

  const website =
    (typeof sp.website === "string" && sp.website) || venue.brand_website || "";
  const name = (typeof sp.name === "string" && sp.name) || venue.name || "the venue";
  const listingHref = `/venue/${venue.slug}`;

  return (
    <>
      <VenueMetaPixelScript pixelId={venue.meta_pixel_id} />
      <Suspense>
        <main className="min-h-screen flex items-center justify-center bg-stone-50 px-6">
          <div className="max-w-lg w-full text-center space-y-6 py-20">
            <div className="flex justify-center">
              <div className="rounded-full bg-emerald-50 p-4">
                <CheckCircle className="h-10 w-10 text-emerald-600" strokeWidth={1.5} />
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-stone-900 whitespace-nowrap">
                Thanks for downloading our guide!
              </h1>
              <p className="text-stone-500 text-sm leading-relaxed">
                We just sent the guide to your phone, and it&apos;s headed to your inbox too.<br />
                We&apos;ll personally reach out to answer any questions<br />
                and make sure your date is still available!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {website ? (
                <>
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 text-white px-5 py-2.5 text-sm font-semibold hover:bg-stone-800 transition-colors whitespace-nowrap"
                  >
                    Visit {name}&apos;s Website
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <Link
                    href={listingHref}
                    className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-900 px-5 py-2.5 text-sm font-semibold hover:bg-stone-50 transition-colors whitespace-nowrap"
                  >
                    Back to Listing
                  </Link>
                </>
              ) : (
                <Link
                  href={listingHref}
                  className="inline-flex items-center justify-center rounded-xl bg-stone-900 text-white px-5 py-2.5 text-sm font-semibold hover:bg-stone-800 transition-colors whitespace-nowrap"
                >
                  Back to Listing
                </Link>
              )}
            </div>
          </div>
        </main>
      </Suspense>
    </>
  );
}
