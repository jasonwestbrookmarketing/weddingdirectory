"use client";

import { useRef, useState } from "react";
import { X, Mail, Phone, Calendar, Users, Clock, MessageSquare, Tag, StickyNote, Check } from "lucide-react";
import { LEAD_STATUSES, BOOKING_TIMELINES } from "@/lib/constants";
import type { Lead } from "@/types/database";

interface LeadDetailProps {
  lead: Lead;
  onClose: () => void;
  onStatusChange: (leadId: string, status: string) => void;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

function getTimelineLabel(value: string | null) {
  if (!value) return "—";
  return BOOKING_TIMELINES.find((t) => t.value === value)?.label ?? value;
}

export function LeadDetail({ lead, onClose, onStatusChange }: LeadDetailProps) {
  const currentStage = LEAD_STATUSES.find((s) => s.value === lead.status);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [notesSaved, setNotesSaved] = useState(false);
  const notesTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const savedValueRef = useRef(lead.notes ?? "");

  async function saveNotes(value: string) {
    if (value === savedValueRef.current) return; // nothing changed
    savedValueRef.current = value;
    await fetch(`/api/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: value }),
    });
    setNotesSaved(true);
    if (notesTimer.current) clearTimeout(notesTimer.current);
    notesTimer.current = setTimeout(() => setNotesSaved(false), 2000);
  }

  function handleNotesChange(value: string) {
    setNotes(value);
    if (notesTimer.current) clearTimeout(notesTimer.current);
    // debounce while typing
    notesTimer.current = setTimeout(() => saveNotes(value), 800);
  }

  function handleNotesBlur() {
    // save immediately when focus leaves the textarea
    if (notesTimer.current) clearTimeout(notesTimer.current);
    saveNotes(notes);
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-stone-200 bg-white shadow-xl animate-slide-in-right overflow-y-auto">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-900 leading-tight">{lead.name}</h2>
            <span className={`inline-flex items-center mt-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${currentStage?.color ?? "bg-stone-100 text-stone-500"}`}>
              {currentStage?.label ?? lead.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors shrink-0 mt-0.5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">

          {/* Pipeline stage picker */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">Move to Stage</p>
            <div className="flex flex-wrap gap-1.5">
              {LEAD_STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => onStatusChange(lead.id, s.value)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                    lead.status === s.value
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 text-stone-600 hover:border-stone-400 hover:bg-stone-50"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-stone-100" />

          {/* Contact */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Contact</p>
            <a
              href={`mailto:${lead.email}`}
              className="flex items-center gap-3 rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <Mail className="h-4 w-4 text-stone-400 shrink-0" />
              <span className="truncate">{lead.email}</span>
            </a>
            <a
              href={`tel:${lead.phone}`}
              className="flex items-center gap-3 rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <Phone className="h-4 w-4 text-stone-400 shrink-0" />
              {lead.phone}
            </a>
          </div>

          {/* Event Details */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Event Details</p>
            <div className="rounded-xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
              <DetailRow icon={Calendar} label="Wedding Date" value={formatDate(lead.wedding_date)} />
              <DetailRow icon={Users} label="Guest Count" value={lead.guest_count ? `${lead.guest_count.toLocaleString()} guests` : "—"} />
              <DetailRow icon={Clock} label="Booking Timeline" value={getTimelineLabel(lead.booking_timeline)} />
              <DetailRow icon={Tag} label="Lead Received" value={formatDate(lead.created_at)} />
            </div>
          </div>

          {/* Message */}
          {lead.message && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                <MessageSquare className="inline h-3.5 w-3.5 mr-1 mb-0.5" />
                Message from couple
              </p>
              <p className="rounded-xl border border-stone-200 px-4 py-3 text-sm leading-relaxed text-stone-700">
                {lead.message}
              </p>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <StickyNote className="h-3.5 w-3.5" />
                Internal Notes
              </p>
              {notesSaved && (
                <span className="flex items-center gap-1 text-xs text-emerald-600">
                  <Check className="h-3 w-3" /> Saved
                </span>
              )}
            </div>
            <textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              onBlur={handleNotesBlur}
              rows={4}
              placeholder="Add private notes about this lead…"
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent resize-none leading-relaxed"
            />
            <p className="text-xs text-stone-400">Auto-saves as you type. Not visible to the couple.</p>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <a
              href={`mailto:${lead.email}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-stone-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-stone-700 transition-colors"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
            <a
              href={`tel:${lead.phone}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-stone-200 text-stone-700 px-4 py-2.5 text-sm font-medium hover:bg-stone-50 transition-colors"
            >
              <Phone className="h-4 w-4" />
              Call
            </a>
          </div>

        </div>
      </aside>
    </>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Icon className="h-4 w-4 text-stone-400 shrink-0" />
      <span className="text-sm text-stone-500 flex-1">{label}</span>
      <span className="text-sm font-medium text-stone-900 text-right">{value}</span>
    </div>
  );
}
