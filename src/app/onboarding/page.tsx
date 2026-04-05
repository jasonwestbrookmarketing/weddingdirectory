"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ImageUploader } from "@/components/onboarding/ImageUploader";
import {
  VENUE_TYPES,
  INDOOR_OUTDOOR_OPTIONS,
  FEATURES_LIST,
} from "@/lib/constants";
import type { Venue } from "@/types/database";

const TOTAL_STEPS = 5;

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const rand = Math.random().toString(36).substring(2, 6);
  return `${base}-${rand}`;
}

export default function OnboardingPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-stone-400">Loading...</div></div>}>
      <OnboardingPage />
    </Suspense>
  );
}

function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStep = Number(searchParams.get("step")) || 1;

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publishErrors, setPublishErrors] = useState<string[]>([]);

  const supabase = createClient();

  useEffect(() => {
    async function loadVenue() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Not authenticated. Please sign in.");
        setLoading(false);
        return;
      }

      // Always filter by owner_id so RLS for published venues doesn't cause
      // .single() to 406 when more than one row is visible to this user.
      const { data, error: fetchError } = await supabase
        .from("venues")
        .select("*")
        .eq("owner_id", user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 = "no rows returned" — handled below by creating a new row
        setError("Could not load your venue. Please try again.");
        setLoading(false);
        return;
      }

      if (data) {
        setVenue(data as Venue);
        setLoading(false);
        return;
      }

      // No venue yet — create a blank one so onboarding can proceed
      const { data: created, error: createError } = await supabase
        .from("venues")
        .insert({ owner_id: user.id })
        .select("*")
        .single();

      if (createError || !created) {
        setError("Could not create your venue. Please try again.");
        setLoading(false);
        return;
      }

      setVenue(created as Venue);
      setLoading(false);
    }
    loadVenue();
  }, []);

  const goToStep = useCallback(
    (step: number) => {
      router.push(`/onboarding?step=${step}`);
    },
    [router]
  );

  const updateVenue = (partial: Partial<Venue>) => {
    setVenue((prev) => (prev ? { ...prev, ...partial } : prev));
  };

  const saveStep = async (step: number) => {
    if (!venue) return;
    setSaving(true);
    setError(null);

    let updateData: Record<string, unknown> = {};

    switch (step) {
      case 1:
        updateData = {
          name: venue.name,
          location_full: venue.location_full,
          venue_type: venue.venue_type,
          slug: venue.slug || generateSlug(venue.name || "venue"),
          onboarding_step: 2,
        };
        break;
      case 2:
        updateData = {
          capacity_min: venue.capacity_min,
          capacity_max: venue.capacity_max,
          price_min: venue.price_min,
          price_max: venue.price_max,
          indoor_outdoor: venue.indoor_outdoor,
          features: venue.features,
          description: venue.description,
          onboarding_step: 3,
        };
        break;
      case 3:
        updateData = {
          cover_image_url: venue.cover_image_url,
          gallery_images: venue.gallery_images,
          onboarding_step: 4,
        };
        break;
      case 4:
        updateData = {
          notification_email: venue.notification_email,
          email_notifications: venue.email_notifications,
          onboarding_step: 5,
        };
        break;
    }

    const { error: updateError } = await supabase
      .from("venues")
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq("id", venue.id);

    setSaving(false);

    if (updateError) {
      setError("Failed to save. Please try again.");
      return;
    }

    goToStep(step + 1);
  };

  const handlePublish = async () => {
    setPublishing(true);
    setPublishErrors([]);
    setError(null);

    const res = await fetch("/api/onboarding/publish", { method: "POST" });
    const data = await res.json();

    if (!res.ok) {
      if (data.errors) {
        setPublishErrors(data.errors);
      } else {
        setError(data.error || "Failed to publish");
      }
      setPublishing(false);
      return;
    }

    router.push(`/dashboard`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-900" />
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-stone-900 mb-2">
            No venue found
          </h1>
          <p className="text-stone-500">
            Please create a venue to begin onboarding.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-2xl px-6 py-6">
          <p className="text-sm font-medium text-stone-500 mb-4">
            Step {currentStep} of {TOTAL_STEPS}
          </p>
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  i < currentStep ? "bg-stone-900" : "bg-stone-200"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-2xl px-6 py-12">
        {error && (
          <div className="mb-8 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {currentStep === 1 && (
          <StepBasics venue={venue} onChange={updateVenue} />
        )}
        {currentStep === 2 && (
          <StepDetails venue={venue} onChange={updateVenue} />
        )}
        {currentStep === 3 && (
          <StepImages venue={venue} onChange={updateVenue} />
        )}
        {currentStep === 4 && (
          <StepLeadSettings venue={venue} onChange={updateVenue} />
        )}
        {currentStep === 5 && (
          <StepPreview
            venue={venue}
            publishErrors={publishErrors}
            publishing={publishing}
            onPublish={handlePublish}
          />
        )}

        {/* Navigation */}
        <div className="mt-12 flex items-center justify-between">
          {currentStep > 1 ? (
            <Button
              variant="secondary"
              onClick={() => goToStep(currentStep - 1)}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {currentStep < TOTAL_STEPS && (
            <Button
              loading={saving}
              onClick={() => saveStep(currentStep)}
            >
              Continue
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

/* ─── Step 1: Basics ─── */
function StepBasics({
  venue,
  onChange,
}: {
  venue: Venue;
  onChange: (v: Partial<Venue>) => void;
}) {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-stone-900 mb-2">
        Let&apos;s start with the basics
      </h1>
      <p className="text-stone-500 mb-10">
        Tell us about your venue so couples can find you.
      </p>

      <div className="space-y-6">
        <Input
          id="name"
          label="Venue Name"
          placeholder="e.g. The Grand Estate"
          value={venue.name || ""}
          onChange={(e) => onChange({ name: e.target.value })}
        />

        <Input
          id="location"
          label="Location"
          placeholder="e.g. Austin, TX"
          value={venue.location_full || ""}
          onChange={(e) => onChange({ location_full: e.target.value })}
        />

        <Select
          id="venue_type"
          label="Venue Type"
          placeholder="Select a venue type"
          options={VENUE_TYPES}
          value={venue.venue_type || ""}
          onChange={(e) => onChange({ venue_type: e.target.value })}
        />
      </div>
    </section>
  );
}

/* ─── Step 2: Details ─── */
function StepDetails({
  venue,
  onChange,
}: {
  venue: Venue;
  onChange: (v: Partial<Venue>) => void;
}) {
  const features = (venue.features as string[] | null) || [];

  const toggleFeature = (value: string) => {
    const next = features.includes(value)
      ? features.filter((f) => f !== value)
      : [...features, value];
    onChange({ features: next });
  };

  return (
    <section>
      <h1 className="text-2xl font-semibold text-stone-900 mb-2">
        Venue details
      </h1>
      <p className="text-stone-500 mb-10">
        Help couples understand what you offer and your pricing.
      </p>

      <div className="space-y-8">
        {/* Capacity */}
        <div>
          <p className="text-sm font-medium text-stone-700 mb-3">
            Guest Capacity
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="capacity_min"
              placeholder="Minimum"
              type="number"
              value={venue.capacity_min ?? ""}
              onChange={(e) =>
                onChange({
                  capacity_min: e.target.value ? Number(e.target.value) : null,
                })
              }
            />
            <Input
              id="capacity_max"
              placeholder="Maximum"
              type="number"
              value={venue.capacity_max ?? ""}
              onChange={(e) =>
                onChange({
                  capacity_max: e.target.value ? Number(e.target.value) : null,
                })
              }
            />
          </div>
        </div>

        {/* Pricing */}
        <div>
          <p className="text-sm font-medium text-stone-700 mb-3">
            Starting Price Range
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="price_min"
              placeholder="From ($)"
              type="number"
              value={venue.price_min ?? ""}
              onChange={(e) =>
                onChange({
                  price_min: e.target.value ? Number(e.target.value) : null,
                })
              }
            />
            <Input
              id="price_max"
              placeholder="To ($)"
              type="number"
              value={venue.price_max ?? ""}
              onChange={(e) =>
                onChange({
                  price_max: e.target.value ? Number(e.target.value) : null,
                })
              }
            />
          </div>
        </div>

        <Select
          id="indoor_outdoor"
          label="Setting"
          placeholder="Indoor, Outdoor, or Both"
          options={INDOOR_OUTDOOR_OPTIONS}
          value={venue.indoor_outdoor || ""}
          onChange={(e) => onChange({ indoor_outdoor: e.target.value })}
        />

        {/* Features */}
        <div>
          <p className="text-sm font-medium text-stone-700 mb-3">
            Amenities & Features
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FEATURES_LIST.map((feat) => {
              const checked = features.includes(feat.value);
              return (
                <label
                  key={feat.value}
                  className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 cursor-pointer transition-colors text-sm ${
                    checked
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 bg-white text-stone-700 hover:border-stone-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggleFeature(feat.value)}
                  />
                  {feat.label}
                </label>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={5}
            placeholder="Describe what makes your venue special…"
            value={venue.description || ""}
            onChange={(e) => onChange({ description: e.target.value })}
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 transition-colors focus:border-transparent focus:ring-2 focus:ring-stone-900 focus:outline-none resize-none"
          />
        </div>
      </div>
    </section>
  );
}

/* ─── Step 3: Images ─── */
function StepImages({
  venue,
  onChange,
}: {
  venue: Venue;
  onChange: (v: Partial<Venue>) => void;
}) {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-stone-900 mb-2">
        Show off your venue
      </h1>
      <p className="text-stone-500 mb-10">
        Great photos make all the difference. Upload your best images.
      </p>

      <ImageUploader
        venueId={venue.id}
        coverImageUrl={venue.cover_image_url}
        galleryImages={(venue.gallery_images as string[]) || []}
        onCoverChange={(url) => onChange({ cover_image_url: url })}
        onGalleryChange={(urls) => onChange({ gallery_images: urls })}
      />
    </section>
  );
}

/* ─── Step 4: Lead Settings ─── */
function StepLeadSettings({
  venue,
  onChange,
}: {
  venue: Venue;
  onChange: (v: Partial<Venue>) => void;
}) {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-stone-900 mb-2">
        Lead notifications
      </h1>
      <p className="text-stone-500 mb-10">
        Choose where you want to receive inquiries from couples.
      </p>

      <div className="space-y-6">
        <Input
          id="notification_email"
          label="Notification Email"
          type="email"
          placeholder="bookings@yourvenue.com"
          value={venue.notification_email || ""}
          onChange={(e) => onChange({ notification_email: e.target.value })}
        />

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={venue.email_notifications ?? true}
            onChange={(e) =>
              onChange({ email_notifications: e.target.checked })
            }
            className="h-5 w-5 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
          />
          <span className="text-sm text-stone-700">
            Send me an email when a new lead comes in
          </span>
        </label>
      </div>
    </section>
  );
}

/* ─── Step 5: Preview & Publish ─── */
function StepPreview({
  venue,
  publishErrors,
  publishing,
  onPublish,
}: {
  venue: Venue;
  publishErrors: string[];
  publishing: boolean;
  onPublish: () => void;
}) {
  const features = (venue.features as string[] | null) || [];
  const galleryImages = (venue.gallery_images as string[]) || [];

  const featureLabels = features
    .map((f) => FEATURES_LIST.find((fl) => fl.value === f)?.label)
    .filter(Boolean);

  const venueTypeLabel =
    VENUE_TYPES.find((t) => t.value === venue.venue_type)?.label ||
    venue.venue_type;

  const settingLabel =
    INDOOR_OUTDOOR_OPTIONS.find((o) => o.value === venue.indoor_outdoor)
      ?.label || venue.indoor_outdoor;

  return (
    <section>
      <h1 className="text-2xl font-semibold text-stone-900 mb-2">
        Review & publish
      </h1>
      <p className="text-stone-500 mb-10">
        Everything look good? Publish your venue to start receiving leads.
      </p>

      {publishErrors.length > 0 && (
        <div className="mb-8 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4">
          <p className="text-sm font-medium text-rose-700 mb-2">
            Please fix the following before publishing:
          </p>
          <ul className="list-disc list-inside text-sm text-rose-600 space-y-1">
            {publishErrors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-8">
        {/* Cover */}
        {venue.cover_image_url && (
          <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-stone-100">
            <img
              src={venue.cover_image_url}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-6">
          <SummaryItem label="Venue Name" value={venue.name} />
          <SummaryItem label="Location" value={venue.location_full} />
          <SummaryItem label="Type" value={venueTypeLabel} />
          <SummaryItem label="Setting" value={settingLabel} />
          <SummaryItem
            label="Capacity"
            value={
              venue.capacity_min || venue.capacity_max
                ? `${venue.capacity_min ?? "—"} – ${venue.capacity_max ?? "—"} guests`
                : null
            }
          />
          <SummaryItem
            label="Price Range"
            value={
              venue.price_min || venue.price_max
                ? `$${(venue.price_min ?? 0).toLocaleString()} – $${(venue.price_max ?? 0).toLocaleString()}`
                : null
            }
          />
          <SummaryItem
            label="Notification Email"
            value={venue.notification_email}
          />
        </div>

        {/* Description */}
        {venue.description && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-400 mb-2">
              Description
            </p>
            <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {venue.description}
            </p>
          </div>
        )}

        {/* Features */}
        {featureLabels.length > 0 && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-400 mb-3">
              Features
            </p>
            <div className="flex flex-wrap gap-2">
              {featureLabels.map((label) => (
                <span
                  key={label}
                  className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {galleryImages.length > 0 && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-400 mb-3">
              Gallery ({galleryImages.length} photos)
            </p>
            <div className="grid grid-cols-3 gap-3">
              {galleryImages.map((url, i) => (
                <div
                  key={url}
                  className="rounded-xl overflow-hidden aspect-square bg-stone-100"
                >
                  <img
                    src={url}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4">
          <Button
            size="lg"
            loading={publishing}
            onClick={onPublish}
            className="w-full"
          >
            Publish Venue
          </Button>
        </div>
      </div>
    </section>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-stone-400 mb-1">
        {label}
      </p>
      <p className="text-sm text-stone-800">{value || "—"}</p>
    </div>
  );
}
