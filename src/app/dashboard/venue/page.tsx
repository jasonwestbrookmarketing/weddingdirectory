"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  VENUE_TYPES,
  INDOOR_OUTDOOR_OPTIONS,
  AMENITIES_LIST,
  CEREMONY_TYPES_LIST,
  VENUE_SETTINGS_LIST,
  SERVICES_LIST,
  FEATURES_LIST,
} from "@/lib/constants";

const FEATURE_GROUPS = [
  { label: "Amenities", items: AMENITIES_LIST },
  { label: "Ceremony Types", items: CEREMONY_TYPES_LIST },
  { label: "Venue Settings", items: VENUE_SETTINGS_LIST },
  { label: "Service Offerings", items: SERVICES_LIST },
] as const;
import type { Venue } from "@/types/database";
import { ExternalLink, Eye, Pencil, Save, X } from "lucide-react";

type EditSection = "basics" | "details" | "images" | null;

export default function VenueDashboardPage() {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editSection, setEditSection] = useState<EditSection>(null);
  const [toast, setToast] = useState("");

  const [basics, setBasics] = useState({
    name: "",
    location_full: "",
    venue_type: "",
  });
  const [details, setDetails] = useState({
    capacity_min: 0,
    capacity_max: 0,
    price_min: 0,
    price_max: 0,
    indoor_outdoor: "",
    description: "",
    features: [] as string[],
  });

  const supabase = createClient();

  useEffect(() => {
    fetchVenue();
  }, []);

  async function fetchVenue() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("venues")
      .select("*")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (data) {
      setVenue(data);
      setBasics({
        name: data.name || "",
        location_full: data.location_full || "",
        venue_type: data.venue_type || "",
      });
      setDetails({
        capacity_min: data.capacity_min || 0,
        capacity_max: data.capacity_max || 0,
        price_min: data.price_min || 0,
        price_max: data.price_max || 0,
        indoor_outdoor: data.indoor_outdoor || "",
        description: data.description || "",
        features: Array.isArray(data.features) ? (data.features as string[]) : [],
      });
    }
    setLoading(false);
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function saveBasics(e: FormEvent) {
    e.preventDefault();
    if (!venue) return;
    setSaving(true);
    const { error } = await supabase
      .from("venues")
      .update({
        name: basics.name,
        location_full: basics.location_full,
        venue_type: basics.venue_type,
      })
      .eq("id", venue.id);
    setSaving(false);
    if (!error) {
      showToast("Venue basics updated");
      setEditSection(null);
      fetchVenue();
    }
  }

  async function saveDetails(e: FormEvent) {
    e.preventDefault();
    if (!venue) return;
    setSaving(true);
    const { error } = await supabase
      .from("venues")
      .update({
        capacity_min: details.capacity_min,
        capacity_max: details.capacity_max,
        price_min: details.price_min,
        price_max: details.price_max,
        indoor_outdoor: details.indoor_outdoor,
        description: details.description,
        features: details.features,
      })
      .eq("id", venue.id);
    setSaving(false);
    if (!error) {
      showToast("Venue details updated");
      setEditSection(null);
      fetchVenue();
    }
  }

  function toggleFeature(f: string) {
    setDetails((prev) => ({
      ...prev,
      features: prev.features.includes(f)
        ? prev.features.filter((x) => x !== f)
        : [...prev.features, f],
    }));
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse text-stone-400">Loading venue...</div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="p-8">
        <h1 className="mb-2 text-2xl font-semibold text-stone-900">Venue Listing</h1>
        <p className="mb-6 text-stone-500">You don&apos;t have a venue yet.</p>
        <Link href="/onboarding">
          <Button>Start Onboarding</Button>
        </Link>
      </div>
    );
  }

  const isPublished = venue.is_published;
  const features = Array.isArray(venue.features) ? (venue.features as string[]) : [];
  const gallery = Array.isArray(venue.gallery_images)
    ? (venue.gallery_images as string[])
    : [];

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Venue Listing</h1>
          <p className="text-sm text-stone-500 mt-1">
            Manage your venue profile visible to couples.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              isPublished
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {isPublished ? "Published" : "Draft"}
          </span>
          {isPublished && venue.slug && (
            <Link
              href={`/venue/${venue.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              View Live
            </Link>
          )}
          {!venue.onboarding_completed && (
            <Link href="/onboarding">
              <Button size="sm">Complete Onboarding</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Cover Image */}
      {venue.cover_image_url && (
        <div className="mb-8 overflow-hidden rounded-xl">
          <Image
            src={venue.cover_image_url}
            alt={venue.name || "Venue cover"}
            width={800}
            height={400}
            className="w-full h-64 object-cover"
            unoptimized
          />
        </div>
      )}

      {/* Basics */}
      <section className="mb-6 rounded-xl border border-stone-200 bg-white">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <h2 className="font-semibold text-stone-900">Basics</h2>
          <button
            onClick={() => setEditSection(editSection === "basics" ? null : "basics")}
            className="text-sm font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1"
          >
            {editSection === "basics" ? (
              <><X className="h-3.5 w-3.5" /> Cancel</>
            ) : (
              <><Pencil className="h-3.5 w-3.5" /> Edit</>
            )}
          </button>
        </div>

        {editSection === "basics" ? (
          <form onSubmit={saveBasics} className="space-y-4 p-6">
            <Input
              id="name"
              label="Venue Name"
              value={basics.name}
              onChange={(e) => setBasics({ ...basics, name: e.target.value })}
              required
            />
            <Input
              id="location"
              label="Location"
              value={basics.location_full}
              onChange={(e) =>
                setBasics({ ...basics, location_full: e.target.value })
              }
              required
              placeholder="e.g. Austin, TX"
            />
            <Select
              id="venue_type"
              label="Venue Type"
              value={basics.venue_type}
              onChange={(e) =>
                setBasics({ ...basics, venue_type: e.target.value })
              }
              options={VENUE_TYPES.map((t) => ({ value: t.value, label: t.label }))}
              placeholder="Select a type"
            />
            <Button type="submit" loading={saving} size="sm">
              <Save className="h-3.5 w-3.5 mr-1.5" /> Save Basics
            </Button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
            <div>
              <p className="text-xs text-stone-400 mb-1">Name</p>
              <p className="text-sm font-medium text-stone-900">
                {venue.name || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-400 mb-1">Location</p>
              <p className="text-sm font-medium text-stone-900">
                {venue.location_full || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-400 mb-1">Type</p>
              <p className="text-sm font-medium text-stone-900 capitalize">
                {venue.venue_type || "—"}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Details */}
      <section className="mb-6 rounded-xl border border-stone-200 bg-white">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <h2 className="font-semibold text-stone-900">Details</h2>
          <button
            onClick={() =>
              setEditSection(editSection === "details" ? null : "details")
            }
            className="text-sm font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1"
          >
            {editSection === "details" ? (
              <><X className="h-3.5 w-3.5" /> Cancel</>
            ) : (
              <><Pencil className="h-3.5 w-3.5" /> Edit</>
            )}
          </button>
        </div>

        {editSection === "details" ? (
          <form onSubmit={saveDetails} className="space-y-4 p-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="capacity_min"
                label="Min Capacity"
                type="number"
                value={details.capacity_min || ""}
                onChange={(e) =>
                  setDetails({ ...details, capacity_min: Number(e.target.value) })
                }
              />
              <Input
                id="capacity_max"
                label="Max Capacity"
                type="number"
                value={details.capacity_max || ""}
                onChange={(e) =>
                  setDetails({ ...details, capacity_max: Number(e.target.value) })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="price_min"
                label="Min Price ($)"
                type="number"
                value={details.price_min || ""}
                onChange={(e) =>
                  setDetails({ ...details, price_min: Number(e.target.value) })
                }
              />
              <Input
                id="price_max"
                label="Max Price ($)"
                type="number"
                value={details.price_max || ""}
                onChange={(e) =>
                  setDetails({ ...details, price_max: Number(e.target.value) })
                }
              />
            </div>
            <Select
              id="indoor_outdoor"
              label="Setting"
              value={details.indoor_outdoor}
              onChange={(e) =>
                setDetails({ ...details, indoor_outdoor: e.target.value })
              }
              options={INDOOR_OUTDOOR_OPTIONS.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
              placeholder="Select setting"
            />
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Description
              </label>
              <textarea
                value={details.description}
                onChange={(e) =>
                  setDetails({ ...details, description: e.target.value })
                }
                rows={4}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none resize-none"
              />
            </div>
            <div className="space-y-5">
              <p className="text-sm font-medium text-stone-700">Features</p>
              {FEATURE_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((f) => (
                      <button
                        key={f.value}
                        type="button"
                        onClick={() => toggleFeature(f.value)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                          details.features.includes(f.value)
                            ? "border-stone-900 bg-stone-900 text-white"
                            : "border-stone-200 text-stone-600 hover:border-stone-400"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Button type="submit" loading={saving} size="sm">
              <Save className="h-3.5 w-3.5 mr-1.5" /> Save Details
            </Button>
          </form>
        ) : (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-stone-400 mb-1">Capacity</p>
                <p className="text-sm font-medium text-stone-900">
                  {venue.capacity_min && venue.capacity_max
                    ? `${venue.capacity_min}–${venue.capacity_max} guests`
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-400 mb-1">Price Range</p>
                <p className="text-sm font-medium text-stone-900">
                  {venue.price_min && venue.price_max
                    ? `$${venue.price_min.toLocaleString()}–$${venue.price_max.toLocaleString()}`
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-400 mb-1">Setting</p>
                <p className="text-sm font-medium text-stone-900 capitalize">
                  {venue.indoor_outdoor || "—"}
                </p>
              </div>
            </div>
            {venue.description && (
              <div>
                <p className="text-xs text-stone-400 mb-1">Description</p>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {venue.description}
                </p>
              </div>
            )}
            {features.length > 0 && (
              <div>
                <p className="text-xs text-stone-400 mb-2">Features</p>
                <div className="flex flex-wrap gap-1.5">
                  {features.map((f) => {
                    const match = FEATURES_LIST.find((fl) => fl.value === f);
                    return (
                      <span
                        key={f}
                        className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-700"
                      >
                        {match?.label || f}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Images */}
      <section className="mb-6 rounded-xl border border-stone-200 bg-white">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <h2 className="font-semibold text-stone-900">Images</h2>
          <Link
            href="/onboarding?step=3"
            className="text-sm font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit in Onboarding
          </Link>
        </div>
        <div className="p-6">
          {gallery.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {gallery.map((img, i) => (
                <div key={i} className="overflow-hidden rounded-lg aspect-square">
                  <Image
                    src={img}
                    alt={`Gallery ${i + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-400">
              No images uploaded yet.{" "}
              <Link
                href="/onboarding?step=3"
                className="text-stone-700 underline hover:text-stone-900"
              >
                Upload images
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* Quick link to public profile */}
      {isPublished && venue.slug && (
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-stone-900">Public Profile</p>
            <p className="text-xs text-stone-500 mt-0.5">
              View your venue as couples see it.
            </p>
          </div>
          <Link
            href={`/venue/${venue.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Public Page
          </Link>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 rounded-lg bg-stone-900 px-4 py-3 text-sm text-white shadow-lg animate-[fade-in_0.15s_ease-out]">
          {toast}
        </div>
      )}
    </div>
  );
}
