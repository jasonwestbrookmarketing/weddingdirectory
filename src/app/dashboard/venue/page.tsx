"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
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
import type { Venue } from "@/types/database";
import {
  ExternalLink, Eye, Pencil, Save, X, Upload, ImageIcon,
  Trash2, Globe, EyeOff,
} from "lucide-react";

const BUCKET = "venue-images";
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024;

const FEATURE_GROUPS = [
  { label: "Amenities", items: AMENITIES_LIST },
  { label: "Ceremony Types", items: CEREMONY_TYPES_LIST },
  { label: "Venue Settings", items: VENUE_SETTINGS_LIST },
  { label: "Service Offerings", items: SERVICES_LIST },
] as const;

type EditSection = "basics" | "details" | "images" | null;

// ── Inline image uploader (no onboarding dependency) ──────────────────────
function ImageManager({
  venue,
  onSaved,
}: {
  venue: Venue;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const coverRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(venue.cover_image_url);
  const [gallery, setGallery] = useState<string[]>(
    Array.isArray(venue.gallery_images) ? (venue.gallery_images as string[]) : []
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);

  const isDirty =
    coverUrl !== venue.cover_image_url ||
    JSON.stringify(gallery) !== JSON.stringify(
      Array.isArray(venue.gallery_images) ? venue.gallery_images : []
    );

  async function uploadToSupabase(file: File, folder: "cover" | "gallery") {
    const ts = Date.now();
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `venues/${venue.id}/${folder}/${ts}-${safe}`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type, upsert: true });
    if (upErr) throw new Error(upErr.message);
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleCoverUpload(files: FileList | null) {
    if (!files?.[0]) return;
    const file = files[0];
    if (!ACCEPTED.includes(file.type)) { setError("Only JPEG, PNG or WebP accepted."); return; }
    if (file.size > MAX_SIZE) { setError("Max file size is 10 MB."); return; }
    setError(null);
    setUploading(true);
    setProgress("Uploading cover…");
    try {
      const url = await uploadToSupabase(file, "cover");
      setCoverUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      setProgress(null);
    }
  }

  async function handleGalleryUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    const arr = Array.from(files).filter((f) => ACCEPTED.includes(f.type) && f.size <= MAX_SIZE);
    if (arr.length === 0) { setError("No valid files selected."); return; }
    setError(null);
    setUploading(true);
    const urls: string[] = [];
    for (let i = 0; i < arr.length; i++) {
      setProgress(`Uploading ${i + 1} of ${arr.length}…`);
      try {
        const url = await uploadToSupabase(arr[i], "gallery");
        urls.push(url);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      }
    }
    setGallery((prev) => [...prev, ...urls]);
    setUploading(false);
    setProgress(null);
  }

  async function saveImages() {
    setSaving(true);
    const { error: saveErr } = await supabase
      .from("venues")
      .update({ cover_image_url: coverUrl, gallery_images: gallery })
      .eq("id", venue.id);
    setSaving(false);
    if (!saveErr) onSaved();
    else setError(saveErr.message);
  }

  return (
    <div className="space-y-6 p-6">
      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Cover image */}
      <div>
        <p className="text-sm font-medium text-stone-700 mb-3">Cover Image</p>
        {coverUrl ? (
          <div className="relative group rounded-xl overflow-hidden aspect-[16/9] bg-stone-100">
            <Image
              src={coverUrl}
              alt="Cover"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => coverRef.current?.click()}
                disabled={uploading}
                className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-stone-900 hover:bg-stone-100 transition-colors flex items-center gap-1.5"
              >
                <Upload className="h-3.5 w-3.5" /> Replace
              </button>
              <button
                type="button"
                onClick={() => setCoverUrl(null)}
                className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => coverRef.current?.click()}
            disabled={uploading}
            className="w-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 aspect-[16/9] hover:border-stone-400 hover:bg-stone-100 transition-colors disabled:opacity-50"
          >
            {uploading && progress?.includes("cover") ? (
              <p className="text-sm text-stone-500">{progress}</p>
            ) : (
              <>
                <Upload className="h-7 w-7 text-stone-400 mb-2" />
                <p className="text-sm font-medium text-stone-600">Upload cover photo</p>
                <p className="text-xs text-stone-400 mt-1">JPEG, PNG or WebP · Max 10 MB</p>
              </>
            )}
          </button>
        )}
        <input ref={coverRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
          onChange={(e) => handleCoverUpload(e.target.files)} />
      </div>

      {/* Gallery */}
      <div>
        <p className="text-sm font-medium text-stone-700 mb-3">Gallery Images</p>
        {gallery.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
            {gallery.map((url, i) => (
              <div key={url} className="relative group rounded-lg overflow-hidden aspect-square bg-stone-100">
                <Image src={url} alt={`Gallery ${i + 1}`} fill className="object-cover" unoptimized />
                <button
                  type="button"
                  onClick={() => setGallery((g) => g.filter((_, idx) => idx !== i))}
                  className="absolute top-1.5 right-1.5 rounded-full bg-black/60 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => galleryRef.current?.click()}
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 py-5 hover:border-stone-400 hover:bg-stone-100 transition-colors text-sm font-medium text-stone-600 disabled:opacity-50"
        >
          {uploading ? (
            <><div className="h-4 w-4 border-2 border-stone-400 border-t-stone-700 rounded-full animate-spin" />{progress}</>
          ) : (
            <><ImageIcon className="h-4 w-4 text-stone-400" /> Add gallery photos</>
          )}
        </button>
        <input ref={galleryRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden"
          onChange={(e) => handleGalleryUpload(e.target.files)} />
      </div>

      {isDirty && (
        <Button onClick={saveImages} loading={saving} size="sm">
          <Save className="h-3.5 w-3.5 mr-1.5" /> Save Images
        </Button>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function VenueDashboardPage() {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editSection, setEditSection] = useState<EditSection>(null);
  const [toast, setToast] = useState("");
  const [publishLoading, setPublishLoading] = useState(false);

  const [basics, setBasics] = useState({ name: "", location_full: "", venue_type: "" });
  const [details, setDetails] = useState({
    capacity_min: 0, capacity_max: 0,
    price_min: 0, price_max: 0,
    indoor_outdoor: "", description: "",
    features: [] as string[],
  });

  const supabase = createClient();

  useEffect(() => { fetchVenue(); }, []);

  async function fetchVenue() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("venues").select("*").eq("owner_id", user.id).maybeSingle();
    if (data) {
      setVenue(data);
      setBasics({ name: data.name || "", location_full: data.location_full || "", venue_type: data.venue_type || "" });
      setDetails({
        capacity_min: data.capacity_min || 0, capacity_max: data.capacity_max || 0,
        price_min: data.price_min || 0, price_max: data.price_max || 0,
        indoor_outdoor: data.indoor_outdoor || "", description: data.description || "",
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
    const { error } = await supabase.from("venues")
      .update({ name: basics.name, location_full: basics.location_full, venue_type: basics.venue_type })
      .eq("id", venue.id);
    setSaving(false);
    if (!error) { showToast("Basics saved"); setEditSection(null); fetchVenue(); }
  }

  async function saveDetails(e: FormEvent) {
    e.preventDefault();
    if (!venue) return;
    setSaving(true);
    const { error } = await supabase.from("venues")
      .update({
        capacity_min: details.capacity_min, capacity_max: details.capacity_max,
        price_min: details.price_min, price_max: details.price_max,
        indoor_outdoor: details.indoor_outdoor, description: details.description,
        features: details.features,
      })
      .eq("id", venue.id);
    setSaving(false);
    if (!error) { showToast("Details saved"); setEditSection(null); fetchVenue(); }
  }

  async function togglePublish() {
    if (!venue) return;
    setPublishLoading(true);
    const newVal = !venue.is_published;
    const { error } = await supabase.from("venues")
      .update({ is_published: newVal })
      .eq("id", venue.id);
    setPublishLoading(false);
    if (!error) { showToast(newVal ? "Listing published" : "Listing unpublished"); fetchVenue(); }
  }

  function toggleFeature(f: string) {
    setDetails((prev) => ({
      ...prev,
      features: prev.features.includes(f) ? prev.features.filter((x) => x !== f) : [...prev.features, f],
    }));
  }

  if (loading) return <div className="p-8 animate-pulse text-stone-400">Loading venue…</div>;

  if (!venue) return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-semibold text-stone-900">Venue Listing</h1>
      <p className="mb-6 text-stone-500">You don&apos;t have a venue yet.</p>
      <Button onClick={() => window.location.href = "/onboarding"}>Start Onboarding</Button>
    </div>
  );

  const isPublished = !!venue.is_published;
  const features = Array.isArray(venue.features) ? (venue.features as string[]) : [];

  const SectionHeader = ({
    title, section,
  }: { title: string; section: EditSection }) => (
    <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
      <h2 className="font-semibold text-stone-900">{title}</h2>
      <button
        onClick={() => setEditSection(editSection === section ? null : section)}
        className="text-sm font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1.5 transition-colors"
      >
        {editSection === section
          ? <><X className="h-3.5 w-3.5" /> Cancel</>
          : <><Pencil className="h-3.5 w-3.5" /> Edit</>}
      </button>
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-4xl">

      {/* Header row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Venue Listing</h1>
          <p className="text-sm text-stone-500 mt-1">Manage your public venue profile.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
            isPublished ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
          }`}>
            {isPublished ? "Published" : "Draft"}
          </span>
          {isPublished && venue.slug && (
            <a href={`/venue/${venue.slug}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors">
              <Eye className="h-3.5 w-3.5" /> View Live
            </a>
          )}
          <Button
            size="sm"
            loading={publishLoading}
            onClick={togglePublish}
            className={isPublished
              ? "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50"
              : "bg-stone-900 text-white hover:bg-stone-700"}
          >
            {isPublished
              ? <><EyeOff className="h-3.5 w-3.5 mr-1.5" /> Unpublish</>
              : <><Globe className="h-3.5 w-3.5 mr-1.5" /> Publish Listing</>}
          </Button>
        </div>
      </div>

      {/* ── Basics ── */}
      <section className="mb-5 rounded-xl border border-stone-200 bg-white overflow-hidden">
        <SectionHeader title="Basics" section="basics" />
        {editSection === "basics" ? (
          <form onSubmit={saveBasics} className="space-y-4 p-6">
            <Input id="name" label="Venue Name" value={basics.name}
              onChange={(e) => setBasics({ ...basics, name: e.target.value })} required />
            <Input id="location" label="Location" value={basics.location_full}
              onChange={(e) => setBasics({ ...basics, location_full: e.target.value })}
              placeholder="e.g. Austin, TX" required />
            <Select id="venue_type" label="Venue Type" value={basics.venue_type}
              onChange={(e) => setBasics({ ...basics, venue_type: e.target.value })}
              options={VENUE_TYPES.map((t) => ({ value: t.value, label: t.label }))}
              placeholder="Select a type" />
            <Button type="submit" loading={saving} size="sm">
              <Save className="h-3.5 w-3.5 mr-1.5" /> Save Basics
            </Button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
            {[["Name", venue.name], ["Location", venue.location_full], ["Type", venue.venue_type]].map(([label, val]) => (
              <div key={label}>
                <p className="text-xs text-stone-400 mb-1">{label}</p>
                <p className="text-sm font-medium text-stone-900 capitalize">{val || "—"}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Details ── */}
      <section className="mb-5 rounded-xl border border-stone-200 bg-white overflow-hidden">
        <SectionHeader title="Details" section="details" />
        {editSection === "details" ? (
          <form onSubmit={saveDetails} className="space-y-5 p-6">
            <div className="grid grid-cols-2 gap-4">
              <Input id="cap_min" label="Min Capacity" type="number" value={details.capacity_min || ""}
                onChange={(e) => setDetails({ ...details, capacity_min: Number(e.target.value) })} />
              <Input id="cap_max" label="Max Capacity" type="number" value={details.capacity_max || ""}
                onChange={(e) => setDetails({ ...details, capacity_max: Number(e.target.value) })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input id="price_min" label="Min Price ($)" type="number" value={details.price_min || ""}
                onChange={(e) => setDetails({ ...details, price_min: Number(e.target.value) })} />
              <Input id="price_max" label="Max Price ($)" type="number" value={details.price_max || ""}
                onChange={(e) => setDetails({ ...details, price_max: Number(e.target.value) })} />
            </div>
            <Select id="indoor_outdoor" label="Setting" value={details.indoor_outdoor}
              onChange={(e) => setDetails({ ...details, indoor_outdoor: e.target.value })}
              options={INDOOR_OUTDOOR_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
              placeholder="Select setting" />
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Description</label>
              <textarea value={details.description}
                onChange={(e) => setDetails({ ...details, description: e.target.value })}
                rows={4}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none resize-none" />
            </div>
            <div className="space-y-5">
              <p className="text-sm font-medium text-stone-700">Features & Amenities</p>
              {FEATURE_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">{group.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((f) => (
                      <button key={f.value} type="button" onClick={() => toggleFeature(f.value)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                          details.features.includes(f.value)
                            ? "border-stone-900 bg-stone-900 text-white"
                            : "border-stone-200 text-stone-600 hover:border-stone-400"
                        }`}>
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
                  {venue.capacity_min && venue.capacity_max ? `${venue.capacity_min}–${venue.capacity_max} guests` : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-400 mb-1">Price Range</p>
                <p className="text-sm font-medium text-stone-900">
                  {venue.price_min && venue.price_max ? `$${venue.price_min.toLocaleString()}–$${venue.price_max.toLocaleString()}` : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-400 mb-1">Setting</p>
                <p className="text-sm font-medium text-stone-900 capitalize">{venue.indoor_outdoor || "—"}</p>
              </div>
            </div>
            {venue.description && (
              <div>
                <p className="text-xs text-stone-400 mb-1">Description</p>
                <p className="text-sm text-stone-700 leading-relaxed">{venue.description}</p>
              </div>
            )}
            {features.length > 0 && (
              <div>
                <p className="text-xs text-stone-400 mb-2">Features</p>
                <div className="flex flex-wrap gap-1.5">
                  {features.map((f) => {
                    const match = FEATURES_LIST.find((fl) => fl.value === f);
                    return (
                      <span key={f} className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-700">
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

      {/* ── Images ── */}
      <section className="mb-5 rounded-xl border border-stone-200 bg-white overflow-hidden">
        <SectionHeader title="Photos" section="images" />
        {editSection === "images" ? (
          <ImageManager venue={venue} onSaved={() => { showToast("Images saved"); setEditSection(null); fetchVenue(); }} />
        ) : (
          <div className="p-6">
            {venue.cover_image_url || (Array.isArray(venue.gallery_images) && (venue.gallery_images as string[]).length > 0) ? (
              <div className="space-y-4">
                {venue.cover_image_url && (
                  <div className="overflow-hidden rounded-xl aspect-[16/9] bg-stone-100">
                    <Image src={venue.cover_image_url} alt="Cover" width={800} height={450}
                      className="w-full h-full object-cover" unoptimized />
                  </div>
                )}
                {Array.isArray(venue.gallery_images) && (venue.gallery_images as string[]).length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {(venue.gallery_images as string[]).map((img, i) => (
                      <div key={i} className="overflow-hidden rounded-lg aspect-square bg-stone-100">
                        <Image src={img} alt={`Gallery ${i + 1}`} width={150} height={150}
                          className="w-full h-full object-cover" unoptimized />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-stone-400">
                No photos yet. Click <strong>Edit</strong> to upload your venue photos.
              </p>
            )}
          </div>
        )}
      </section>

      {/* ── Public profile link ── */}
      {isPublished && venue.slug && (
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-stone-900">Public Profile</p>
            <p className="text-xs text-stone-500 mt-0.5">View your listing as couples see it.</p>
          </div>
          <a href={`/venue/${venue.slug}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 transition-colors shrink-0">
            <ExternalLink className="h-3.5 w-3.5" /> View
          </a>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white shadow-lg animate-[fade-in_0.15s_ease-out]">
          {toast}
        </div>
      )}
    </div>
  );
}
