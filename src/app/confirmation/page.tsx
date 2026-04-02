import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata = {
  title: "Inquiry Sent | StoryVenue",
};

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-50 px-6">
      <div className="max-w-md w-full text-center space-y-8 py-20">
        <div className="flex justify-center">
          <div className="rounded-full bg-emerald-50 p-4">
            <CheckCircle className="h-10 w-10 text-emerald-600" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-stone-900">
            Your Inquiry Has Been Sent
          </h1>
          <p className="text-stone-500 text-lg">
            The venue will review your inquiry and follow up soon.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl px-5 py-4 text-left">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" strokeWidth={2} />
          <p className="text-sm text-stone-600">
            The venue has received your pricing and availability request
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/search"
            className="inline-flex items-center justify-center rounded-xl bg-stone-900 text-white px-6 py-3 text-base font-medium hover:bg-stone-800 transition-colors"
          >
            Browse More Venues
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-900 px-6 py-3 text-base font-medium hover:bg-stone-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
