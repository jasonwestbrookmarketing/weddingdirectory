"use client";

import {
  useCallback, useEffect, useRef, useState, type FormEvent,
} from "react";
import {
  DragDropContext, Droppable, Draggable, type DropResult,
} from "@hello-pangea/dnd";
import { createClient } from "@/lib/supabase/client";
import { LEAD_STATUSES, BOOKING_TIMELINES } from "@/lib/constants";
import { LeadDetail } from "./LeadDetail";
import type { Lead } from "@/types/database";
import {
  Mail, Phone, Calendar, Users, MessageSquare,
  Search, Plus, Download, Upload, Kanban, List, X,
} from "lucide-react";

type PipelineStage = typeof LEAD_STATUSES[number]["value"];
type Columns = Record<PipelineStage, Lead[]>;
type ViewMode = "kanban" | "list";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function getTimelineLabel(value: string | null) {
  if (!value) return null;
  return BOOKING_TIMELINES.find((t) => t.value === value)?.label ?? value;
}

function matchesSearch(lead: Lead, q: string) {
  if (!q) return true;
  const s = q.toLowerCase();
  return (
    (lead.name ?? "").toLowerCase().includes(s) ||
    (lead.email ?? "").toLowerCase().includes(s) ||
    (lead.phone ?? "").toLowerCase().includes(s) ||
    (lead.wedding_date ?? "").includes(s) ||
    String(lead.guest_count ?? "").includes(s)
  );
}

// CSV helpers
function leadsToCSV(leads: Lead[]): string {
  const cols = ["name","email","phone","wedding_date","guest_count","booking_timeline","message","status","notes","created_at"];
  const header = cols.join(",");
  const rows = leads.map((l) =>
    cols.map((c) => {
      const v = String(l[c as keyof Lead] ?? "").replace(/"/g, '""');
      return `"${v}"`;
    }).join(",")
  );
  return [header, ...rows].join("\n");
}

function parseCSV(text: string): Partial<Lead>[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map((line) => {
    const vals = line.match(/(".*?"|[^,]+)/g)?.map((v) => v.replace(/^"|"$/g, "").replace(/""/g, '"')) ?? [];
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = vals[i] ?? ""; });
    return obj as Partial<Lead>;
  });
}

// ── Add Lead Modal ────────────────────────────────────────────────────────────
function AddLeadModal({
  venueId,
  onClose,
  onAdded,
}: {
  venueId: string;
  onClose: () => void;
  onAdded: (lead: Lead) => void;
}) {
  const supabase = createClient();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", wedding_date: "",
    guest_count: "", booking_timeline: "", message: "", status: "new" as PipelineStage,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setError("Name, email and phone are required."); return;
    }
    setSaving(true);
    const { data, error: err } = await supabase.from("leads").insert({
      venue_id: venueId,
      name: form.name, email: form.email, phone: form.phone,
      wedding_date: form.wedding_date || null,
      guest_count: form.guest_count ? Number(form.guest_count) : null,
      booking_timeline: form.booking_timeline || null,
      message: form.message || null,
      status: form.status,
    }).select("*").single();
    setSaving(false);
    if (err) { setError(err.message); return; }
    onAdded(data as Lead);
  }

  const inputCls = "w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent";
  const labelCls = "block text-xs font-medium text-stone-600 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="font-semibold text-stone-900">Add Contact</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className={labelCls}>Full Name *</label><input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Smith" /></div>
            <div><label className={labelCls}>Email *</label><input type="email" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@example.com" /></div>
            <div><label className={labelCls}>Phone *</label><input type="tel" className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(555) 555-5555" /></div>
            <div><label className={labelCls}>Wedding Date</label><input type="date" className={inputCls} value={form.wedding_date} onChange={(e) => set("wedding_date", e.target.value)} /></div>
            <div><label className={labelCls}>Guest Count</label><input type="number" className={inputCls} value={form.guest_count} onChange={(e) => set("guest_count", e.target.value)} placeholder="150" /></div>
            <div className="col-span-2">
              <label className={labelCls}>Booking Timeline</label>
              <select className={inputCls} value={form.booking_timeline} onChange={(e) => set("booking_timeline", e.target.value)}>
                <option value="">Select…</option>
                {BOOKING_TIMELINES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Stage</label>
              <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
                {LEAD_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="col-span-2"><label className={labelCls}>Message / Notes</label><textarea className={`${inputCls} resize-none`} rows={3} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Any notes…" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-700 disabled:opacity-50">
              {saving ? "Saving…" : "Add Contact"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Kanban Card ───────────────────────────────────────────────────────────────
const COLUMN_BORDER: Record<string, string> = {
  new: "border-t-blue-400", contacted: "border-t-amber-400",
  tour_booked: "border-t-purple-400", proposal_sent: "border-t-orange-400",
  booked_wedding: "border-t-emerald-400", not_interested: "border-t-stone-300",
};
const COLUMN_DOT: Record<string, string> = {
  new: "bg-blue-400", contacted: "bg-amber-400",
  tour_booked: "bg-purple-400", proposal_sent: "bg-orange-400",
  booked_wedding: "bg-emerald-400", not_interested: "bg-stone-300",
};

function LeadCard({ lead, index, onClick }: { lead: Lead; index: number; onClick: () => void }) {
  const timeline = getTimelineLabel(lead.booking_timeline);
  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
          onClick={onClick}
          className={`bg-white rounded-xl select-none cursor-grab active:cursor-grabbing overflow-hidden transition-all ${
            snapshot.isDragging ? "shadow-2xl ring-2 ring-stone-300/60 scale-[1.01]" : "shadow-sm hover:shadow-md"
          }`}
        >
          <div className="px-4 pt-4 pb-3">
            <p className="font-bold text-stone-900 text-[15px] leading-snug mb-3">{lead.name}</p>
            <div className="space-y-1.5">
              {lead.wedding_date && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-400 w-28 shrink-0 flex items-center gap-1.5"><Calendar className="h-3 w-3" />Wedding Date</span>
                  <span className="text-xs font-medium text-stone-700">{formatDate(lead.wedding_date)}</span>
                </div>
              )}
              {lead.guest_count && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-400 w-28 shrink-0 flex items-center gap-1.5"><Users className="h-3 w-3" />Guest Count</span>
                  <span className="text-xs font-medium text-stone-700">{lead.guest_count} guests</span>
                </div>
              )}
              {timeline && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-400 w-28 shrink-0 flex items-center gap-1.5"><MessageSquare className="h-3 w-3" />Timeline</span>
                  <span className="text-xs font-medium text-stone-700">{timeline}</span>
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-stone-100 px-4 py-2.5 flex items-center gap-4">
            <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="text-stone-400 hover:text-stone-700 transition-colors" title="Call"><Phone className="h-4 w-4" /></a>
            <a href={`mailto:${lead.email}`} onClick={(e) => e.stopPropagation()} className="text-stone-400 hover:text-stone-700 transition-colors" title="Email"><Mail className="h-4 w-4" /></a>
            <span className="ml-auto text-[11px] text-stone-400">{formatDate(lead.created_at)}</span>
          </div>
        </div>
      )}
    </Draggable>
  );
}

function KanbanColumn({ stage, leads, onCardClick }: { stage: typeof LEAD_STATUSES[number]; leads: Lead[]; onCardClick: (l: Lead) => void }) {
  return (
    <div className="flex flex-col w-[300px] shrink-0">
      <div className={`bg-white rounded-xl border-t-[3px] shadow-sm px-4 py-2.5 mb-2.5 flex items-center gap-2 ${COLUMN_BORDER[stage.value] ?? "border-t-stone-300"}`}>
        <div className={`w-2 h-2 rounded-full shrink-0 ${COLUMN_DOT[stage.value] ?? "bg-stone-300"}`} />
        <h3 className="text-sm font-bold text-stone-800 flex-1 leading-none">{stage.label}</h3>
        <span className="text-xs font-semibold text-stone-400 tabular-nums">{leads.length}</span>
      </div>
      <Droppable droppableId={stage.value}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}
            className={`flex-1 min-h-[100px] rounded-2xl p-2 space-y-2 transition-colors ${
              snapshot.isDraggingOver ? "bg-stone-200/70 ring-2 ring-inset ring-stone-300/50" : "bg-stone-100/60"
            }`}
          >
            {leads.map((lead, i) => <LeadCard key={lead.id} lead={lead} index={i} onClick={() => onCardClick(lead)} />)}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

// ── List View ─────────────────────────────────────────────────────────────────
function ListView({ leads, onRowClick }: { leads: Lead[]; onRowClick: (l: Lead) => void }) {
  const stageColor: Record<string, string> = {
    new: "bg-blue-50 text-blue-700", contacted: "bg-amber-50 text-amber-700",
    tour_booked: "bg-purple-50 text-purple-700", proposal_sent: "bg-orange-50 text-orange-700",
    booked_wedding: "bg-emerald-50 text-emerald-700", not_interested: "bg-stone-100 text-stone-500",
  };

  if (leads.length === 0) return (
    <div className="text-center py-16 text-stone-400 text-sm">No contacts match your search.</div>
  );

  return (
    <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50 text-xs font-semibold text-stone-500 uppercase tracking-wide">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Wedding Date</th>
              <th className="px-5 py-3">Guests</th>
              <th className="px-5 py-3">Stage</th>
              <th className="px-5 py-3">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {leads.map((lead) => (
              <tr key={lead.id} onClick={() => onRowClick(lead)} className="hover:bg-stone-50 cursor-pointer transition-colors">
                <td className="px-5 py-3 font-semibold text-stone-900">{lead.name}</td>
                <td className="px-5 py-3 text-stone-500">{lead.email}</td>
                <td className="px-5 py-3 text-stone-500">{lead.phone}</td>
                <td className="px-5 py-3 text-stone-500">{formatDate(lead.wedding_date)}</td>
                <td className="px-5 py-3 text-stone-500">{lead.guest_count ?? "—"}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${stageColor[lead.status] ?? "bg-stone-100 text-stone-500"}`}>
                    {LEAD_STATUSES.find((s) => s.value === lead.status)?.label ?? lead.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-stone-400 text-xs">{formatDate(lead.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile cards */}
      <div className="divide-y divide-stone-100 md:hidden">
        {leads.map((lead) => (
          <div key={lead.id} onClick={() => onRowClick(lead)} className="px-4 py-3 hover:bg-stone-50 cursor-pointer">
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-stone-900 text-sm">{lead.name}</p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stageColor[lead.status] ?? ""}`}>
                {LEAD_STATUSES.find((s) => s.value === lead.status)?.label}
              </span>
            </div>
            <p className="text-xs text-stone-500">{lead.email} · {lead.phone}</p>
            {lead.wedding_date && <p className="text-xs text-stone-400 mt-0.5">{formatDate(lead.wedding_date)}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LeadsPage() {
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [columns, setColumns] = useState<Columns>(() => {
    const e = {} as Columns;
    LEAD_STATUSES.forEach((s) => { e[s.value as PipelineStage] = []; });
    return e;
  });
  const [loading, setLoading] = useState(true);
  const [venueId, setVenueId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("kanban");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Build columns from leads array
  function buildColumns(leads: Lead[]) {
    const cols: Columns = {} as Columns;
    LEAD_STATUSES.forEach((s) => { cols[s.value as PipelineStage] = []; });
    leads.forEach((l) => {
      const stage = l.status as PipelineStage;
      if (cols[stage]) cols[stage].push(l);
      else cols["new"].push(l);
    });
    setColumns(cols);
  }

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: venue } = await supabase.from("venues").select("id").eq("owner_id", user.id).maybeSingle();
      if (!venue) { setLoading(false); return; }
      setVenueId(venue.id);
      const { data } = await supabase.from("leads").select("*").eq("venue_id", venue.id).order("created_at", { ascending: false });
      const leads = (data ?? []) as Lead[];
      setAllLeads(leads);
      buildColumns(leads);
      setLoading(false);
    }
    load();
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }

  // Filtered leads for list view and search
  const filteredLeads = allLeads.filter((l) => matchesSearch(l, search));
  const filteredColumns: Columns = {} as Columns;
  LEAD_STATUSES.forEach((s) => {
    filteredColumns[s.value as PipelineStage] = (columns[s.value as PipelineStage] ?? []).filter((l) => matchesSearch(l, search));
  });

  // Drag & drop
  const handleDragEnd = useCallback(async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    const srcStage = source.droppableId as PipelineStage;
    const dstStage = destination.droppableId as PipelineStage;

    setColumns((prev) => {
      const next = { ...prev };
      const srcList = [...prev[srcStage]];
      const [moved] = srcList.splice(source.index, 1);
      const dstList = srcStage === dstStage ? srcList : [...prev[dstStage]];
      dstList.splice(destination.index, 0, { ...moved, status: dstStage });
      next[srcStage] = srcStage === dstStage ? dstList : srcList;
      if (srcStage !== dstStage) next[dstStage] = dstList;
      return next;
    });
    setAllLeads((prev) => prev.map((l) => l.id === draggableId ? { ...l, status: dstStage } : l));
    if (selectedLead?.id === draggableId) setSelectedLead((l) => l ? { ...l, status: dstStage } : l);

    const res = await fetch(`/api/leads/${draggableId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: dstStage }),
    });
    showToast(res.ok ? `Moved to ${LEAD_STATUSES.find((s) => s.value === dstStage)?.label}` : "Failed to update");
  }, [selectedLead]);

  const handleStatusChange = useCallback(async (leadId: string, status: string) => {
    const newStage = status as PipelineStage;
    setAllLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, status: newStage } : l));
    setColumns((prev) => {
      const next = { ...prev };
      let moved: Lead | undefined;
      LEAD_STATUSES.forEach(({ value }) => {
        const stage = value as PipelineStage;
        const idx = next[stage].findIndex((l) => l.id === leadId);
        if (idx !== -1) { [moved] = next[stage].splice(idx, 1); moved = { ...moved, status: newStage }; }
      });
      if (moved) next[newStage] = [moved, ...next[newStage]];
      return next;
    });
    if (selectedLead?.id === leadId) setSelectedLead((l) => l ? { ...l, status: newStage } : l);
    const res = await fetch(`/api/leads/${leadId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStage }),
    });
    showToast(res.ok ? `Moved to ${LEAD_STATUSES.find((s) => s.value === newStage)?.label}` : "Failed to update");
  }, [selectedLead]);

  // Export CSV
  function exportCSV() {
    const csv = leadsToCSV(allLeads);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `leads-${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  }

  // Import CSV
  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !venueId) return;
    const text = await file.text();
    const rows = parseCSV(text);
    if (!rows.length) { showToast("No valid rows found in CSV."); return; }
    const inserts = rows.map((r) => ({
      venue_id: venueId,
      name: r.name ?? "", email: r.email ?? "", phone: r.phone ?? "",
      wedding_date: r.wedding_date || null,
      guest_count: r.guest_count ? Number(r.guest_count) : null,
      booking_timeline: r.booking_timeline || null,
      message: r.message || null, notes: r.notes || null,
      status: (r.status && LEAD_STATUSES.find((s) => s.value === r.status)) ? r.status : "new",
    })).filter((r) => r.name && r.email);

    if (!inserts.length) { showToast("No valid rows (name + email required)."); return; }
    const { data, error } = await supabase.from("leads").insert(inserts).select("*");
    if (error) { showToast("Import failed: " + error.message); return; }
    const newLeads = [...allLeads, ...(data as Lead[])];
    setAllLeads(newLeads); buildColumns(newLeads);
    showToast(`Imported ${data.length} contacts`);
    e.target.value = "";
  }

  // After adding manually
  function handleAdded(lead: Lead) {
    const newLeads = [lead, ...allLeads];
    setAllLeads(newLeads); buildColumns(newLeads);
    setShowAdd(false); showToast("Contact added");
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-300 border-t-stone-900" />
    </div>
  );

  return (
    <>
      {/* ── Toolbar ── */}
      <div className="px-4 md:px-8 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-stone-900">Leads</h1>
            <p className="text-sm text-stone-400 mt-0.5">{allLeads.length} total contacts</p>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search name, email, phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* View toggle */}
            <div className="flex items-center bg-stone-100 rounded-xl p-1 gap-0.5">
              <button onClick={() => setView("kanban")} className={`p-2 rounded-lg transition-colors ${view === "kanban" ? "bg-white shadow-sm text-stone-900" : "text-stone-400 hover:text-stone-700"}`} title="Pipeline view">
                <Kanban className="h-4 w-4" />
              </button>
              <button onClick={() => setView("list")} className={`p-2 rounded-lg transition-colors ${view === "list" ? "bg-white shadow-sm text-stone-900" : "text-stone-400 hover:text-stone-700"}`} title="List view">
                <List className="h-4 w-4" />
              </button>
            </div>
            <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-stone-600 border border-stone-200 rounded-xl bg-white hover:bg-stone-50 transition-colors" title="Export CSV">
              <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export</span>
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-stone-600 border border-stone-200 rounded-xl bg-white hover:bg-stone-50 transition-colors" title="Import CSV">
              <Upload className="h-4 w-4" /> <span className="hidden sm:inline">Import</span>
            </button>
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImport} />
            <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-stone-900 rounded-xl hover:bg-stone-700 transition-colors">
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </div>
      </div>

      {/* ── Board / List ── */}
      {allLeads.length === 0 ? (
        <div className="mx-4 md:mx-8 rounded-2xl border border-dashed border-stone-200 px-6 py-16 text-center">
          <p className="text-stone-500 mb-4">No leads yet. Share your venue listing or add one manually.</p>
          <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white text-sm font-semibold rounded-xl hover:bg-stone-700 transition-colors">
            <Plus className="h-4 w-4" /> Add First Contact
          </button>
        </div>
      ) : view === "list" ? (
        <div className="px-4 md:px-8">
          <ListView leads={filteredLeads} onRowClick={setSelectedLead} />
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="overflow-x-auto pb-6 px-4 md:px-8">
            <div className="flex gap-4 w-max">
              {LEAD_STATUSES.map((stage) => (
                <KanbanColumn
                  key={stage.value}
                  stage={stage}
                  leads={filteredColumns[stage.value as PipelineStage]}
                  onCardClick={setSelectedLead}
                />
              ))}
            </div>
          </div>
        </DragDropContext>
      )}

      {/* ── Modals ── */}
      {showAdd && venueId && (
        <AddLeadModal venueId={venueId} onClose={() => setShowAdd(false)} onAdded={handleAdded} />
      )}

      {selectedLead && (
        <LeadDetail
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white shadow-lg animate-slide-up">
          {toast}
        </div>
      )}
    </>
  );
}
