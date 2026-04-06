"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Search, Plus, Pencil, Trash2, ExternalLink, X, Save,
  ChevronLeft, ChevronRight, Check, AlertTriangle,
} from "lucide-react";
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
} from "@/lib/constants";

const FEATURE_GROUPS = [
  { label: "Amenities", items: AMENITIES_LIST },
  { label: "Ceremony Types", items: CEREMONY_TYPES_LIST },
  { label: "Venue Settings", items: VENUE_SETTINGS_LIST },
  { label: "Service Offerings", items: SERVICES_LIST },
] as const;

interface Venue {
  id: string;
  name: string | null;
  slug: string | null;
  location_full: string | null;
  location_city: string | null;
  location_state: string | null;
  venue_type: string | null;
  is_published: boolean | null;
  onboarding_completed: boolean | null;
  cover_image_url: string | null;
  created_at: string | null;
  capacity_min: number | null;
  capacity_max: number | null;
  price_min: number | null;
  price_max: number | null;
  description: string | null;
  indoor_outdoor: string | null;
  owner_id: string | null;
}

type EditState = Partial<Venue>;

const EMPTY_VENUE: EditState = {
  name: "",
  location_full: "",
  location_city: "",
  location_state: "",
  venue_type: "",
  indoor_outdoor: "",
  is_published: false,
  capacity_min: null,
  capacity_max: null,
  price_min: null,
  price_max: null,
  description: "",
  owner_id: "",
};

function formatDate(str: string | null) {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

// ── Edit / Create Modal ────────────────────────────────────────────────────
function VenueModal({
  venue,
  isNew,
  onClose,
  onSaved,
}: {
  venue: EditState;
  isNew: boolean;
  onClose: () => void;
  onSaved: (v: Venue) => void;
}) {
  const [form, setForm] = useState<EditState>(venue);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof EditState, v: unknown) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleSave() {
    setSaving(true);
    setError("");
    const url = isNew ? "/api/admin/venues" : `/api/admin/venues/${venue.id}`;
    const method = isNew ? "POST" : "PATCH";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error || "Save failed"); return; }
    onSaved(data.venue);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <h2 className="text-lg font-semibold text-stone-900">
            {isNew ? "Add Venue" : "Edit Venue"}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {error && (
            <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="name" label="Venue Name" value={form.name || ""}
              onChange={(e) => set("name", e.target.value)}
            />
            <Select
              id="venue_type" label="Venue Type"
              value={form.venue_type || ""}
              onChange={(e) => set("venue_type", e.target.value)}
              options={VENUE_TYPES} placeholder="Select type"
            />
          </div>

          <Input
            id="location_full" label="Full Address / Location"
            value={form.location_full || ""}
            onChange={(e) => set("location_full", e.target.value)}
            placeholder="e.g. New Albany, Ohio"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="location_city" label="City"
              value={form.location_city || ""}
              onChange={(e) => set("location_city", e.target.value)}
            />
            <Input
              id="location_state" label="State"
              value={form.location_state || ""}
              onChange={(e) => set("location_state", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="capacity_min" label="Min Capacity" type="number"
              value={form.capacity_min ?? ""}
              onChange={(e) => set("capacity_min", e.target.value ? Number(e.target.value) : null)}
            />
            <Input
              id="capacity_max" label="Max Capacity" type="number"
              value={form.capacity_max ?? ""}
              onChange={(e) => set("capacity_max", e.target.value ? Number(e.target.value) : null)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="price_min" label="Min Price ($)" type="number"
              value={form.price_min ?? ""}
              onChange={(e) => set("price_min", e.target.value ? Number(e.target.value) : null)}
            />
            <Input
              id="price_max" label="Max Price ($)" type="number"
              value={form.price_max ?? ""}
              onChange={(e) => set("price_max", e.target.value ? Number(e.target.value) : null)}
            />
          </div>

          <Select
            id="indoor_outdoor" label="Setting"
            value={form.indoor_outdoor || ""}
            onChange={(e) => set("indoor_outdoor", e.target.value)}
            options={INDOOR_OUTDOOR_OPTIONS} placeholder="Select setting"
          />

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description || ""}
              onChange={(e) => set("description", e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none resize-none"
            />
          </div>

          {isNew && (
            <Input
              id="owner_id" label="Owner User ID (UUID)"
              value={form.owner_id || ""}
              onChange={(e) => set("owner_id", e.target.value)}
              placeholder="Supabase auth user UUID"
            />
          )}

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={!!form.is_published}
              onChange={(e) => set("is_published", e.target.checked)}
              className="h-4 w-4 rounded border-stone-300 text-stone-900"
            />
            <span className="text-sm text-stone-700 font-medium">Published</span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-200 bg-stone-50">
          <button
            onClick={onClose}
            className="text-sm font-medium text-stone-600 hover:text-stone-900 px-4 py-2"
          >
            Cancel
          </button>
          <Button loading={saving} onClick={handleSave} size="sm">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            {isNew ? "Create Venue" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm ─────────────────────────────────────────────────────────
function DeleteConfirm({
  venue,
  onClose,
  onDeleted,
}: {
  venue: Venue;
  onClose: () => void;
  onDeleted: (id: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const res = await fetch(`/api/admin/venues/${venue.id}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) onDeleted(venue.id);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full bg-rose-50 p-2.5">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
          </div>
          <h2 className="text-lg font-semibold text-stone-900">Delete Venue</h2>
        </div>
        <p className="text-sm text-stone-600 mb-6">
          Are you sure you want to delete{" "}
          <strong>{venue.name || "this venue"}</strong>? This cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="text-sm font-medium text-stone-600 hover:text-stone-900 px-4 py-2"
          >
            Cancel
          </button>
          <Button
            loading={loading}
            onClick={handleDelete}
            className="bg-rose-600 hover:bg-rose-700 text-white"
            size="sm"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function AdminVenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [editVenue, setEditVenue] = useState<Venue | null>(null);
  const [deleteVenue, setDeleteVenue] = useState<Venue | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState("");
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const LIMIT = 20;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const load = useCallback(async (q: string, p: number) => {
    setLoading(true);
    const res = await fetch(
      `/api/admin/venues?search=${encodeURIComponent(q)}&page=${p}`
    );
    const data = await res.json();
    setVenues(data.venues ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, []);

  useEffect(() => { load(search, page); }, [search, page, load]);

  function handleSearchInput(val: string) {
    setSearchInput(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearch(val);
      setPage(1);
    }, 350);
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function handleSaved(v: Venue) {
    setVenues((prev) => {
      const idx = prev.findIndex((x) => x.id === v.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = v; return next; }
      return [v, ...prev];
    });
    setTotal((t) => (editVenue ? t : t + 1));
    setEditVenue(null);
    setShowAdd(false);
    showToast(editVenue ? "Venue updated" : "Venue created");
  }

  function handleDeleted(id: string) {
    setVenues((prev) => prev.filter((v) => v.id !== id));
    setTotal((t) => t - 1);
    setDeleteVenue(null);
    showToast("Venue deleted");
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Venues</h1>
          <p className="text-sm text-stone-500 mt-1">{total} total</p>
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4 mr-1.5" /> Add Venue
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <input
          type="text"
          placeholder="Search by name, location, city, state…"
          value={searchInput}
          onChange={(e) => handleSearchInput(e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white pl-10 pr-4 py-3 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-300 border-t-stone-900" />
          </div>
        ) : venues.length === 0 ? (
          <div className="py-24 text-center text-stone-400 text-sm">
            No venues found.
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50">
                    <th className="px-4 py-3 font-medium text-stone-500">Venue</th>
                    <th className="px-4 py-3 font-medium text-stone-500">Location</th>
                    <th className="px-4 py-3 font-medium text-stone-500">Type</th>
                    <th className="px-4 py-3 font-medium text-stone-500">Status</th>
                    <th className="px-4 py-3 font-medium text-stone-500">Created</th>
                    <th className="px-4 py-3 font-medium text-stone-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {venues.map((v) => (
                    <tr key={v.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-stone-900">{v.name || "—"}</p>
                        <p className="text-xs text-stone-400 font-mono mt-0.5 truncate max-w-[200px]">
                          {v.id}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        <p>{v.location_city && v.location_state
                          ? `${v.location_city}, ${v.location_state}`
                          : v.location_full || "—"}</p>
                      </td>
                      <td className="px-4 py-3 text-stone-600 capitalize">
                        {v.venue_type || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          v.is_published
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}>
                          {v.is_published ? <><Check className="h-3 w-3" /> Published</> : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-stone-500 text-xs">
                        {formatDate(v.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {v.is_published && v.slug && (
                            <Link
                              href={`/venue/${v.slug}`}
                              target="_blank"
                              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                              title="View public page"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          )}
                          <button
                            onClick={() => setEditVenue(v)}
                            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteVenue(v)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-stone-100 md:hidden">
              {venues.map((v) => (
                <div key={v.id} className="p-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-stone-900 truncate">{v.name || "—"}</p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {v.location_city || v.location_full || "—"}
                    </p>
                    <span className={`inline-block mt-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                      v.is_published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {v.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => setEditVenue(v)} className="p-2 text-stone-400 hover:text-stone-700">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteVenue(v)} className="p-2 text-stone-400 hover:text-rose-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-stone-500">
            Page {page} of {totalPages} · {total} venues
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {editVenue && (
        <VenueModal
          venue={editVenue}
          isNew={false}
          onClose={() => setEditVenue(null)}
          onSaved={handleSaved}
        />
      )}
      {showAdd && (
        <VenueModal
          venue={EMPTY_VENUE}
          isNew={true}
          onClose={() => setShowAdd(false)}
          onSaved={handleSaved}
        />
      )}
      {deleteVenue && (
        <DeleteConfirm
          venue={deleteVenue}
          onClose={() => setDeleteVenue(null)}
          onDeleted={handleDeleted}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
