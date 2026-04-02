"use client";

import { X, Mail, Phone } from "lucide-react";
import { Select } from "@/components/ui/Select";
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
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getTimelineLabel(value: string | null) {
  if (!value) return "—";
  return BOOKING_TIMELINES.find((t) => t.value === value)?.label ?? value;
}

export function LeadDetail({ lead, onClose, onStatusChange }: LeadDetailProps) {
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
      />
      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-stone-200 bg-white shadow-xl animate-slide-in-right overflow-y-auto">
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-stone-900">{lead.name}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Status */}
          <div>
            <Select
              label="Status"
              id="detail-status"
              options={LEAD_STATUSES}
              value={lead.status}
              onChange={(e) => onStatusChange(lead.id, e.target.value)}
            />
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Contact
            </h3>
            <a
              href={`mailto:${lead.email}`}
              className="flex items-center gap-3 rounded-lg border border-stone-200 px-4 py-3 text-sm text-stone-700 transition-colors hover:bg-stone-50"
            >
              <Mail className="h-4 w-4 text-stone-400" />
              {lead.email}
            </a>
            <a
              href={`tel:${lead.phone}`}
              className="flex items-center gap-3 rounded-lg border border-stone-200 px-4 py-3 text-sm text-stone-700 transition-colors hover:bg-stone-50"
            >
              <Phone className="h-4 w-4 text-stone-400" />
              {lead.phone}
            </a>
          </div>

          {/* Event Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Event Details
            </h3>
            <div className="rounded-lg border border-stone-200 divide-y divide-stone-100">
              <DetailRow label="Wedding Date" value={formatDate(lead.wedding_date)} />
              <DetailRow
                label="Guest Count"
                value={lead.guest_count ? lead.guest_count.toLocaleString() : "—"}
              />
              <DetailRow
                label="Timeline"
                value={getTimelineLabel(lead.booking_timeline)}
              />
            </div>
          </div>

          {/* Message */}
          {lead.message && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Message
              </h3>
              <p className="rounded-lg border border-stone-200 px-4 py-3 text-sm leading-relaxed text-stone-700">
                {lead.message}
              </p>
            </div>
          )}

          {/* Received */}
          <p className="text-xs text-stone-400">
            Received {formatDate(lead.created_at)}
          </p>
        </div>
      </aside>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <span className="text-sm text-stone-500">{label}</span>
      <span className="text-sm font-medium text-stone-900">{value}</span>
    </div>
  );
}
