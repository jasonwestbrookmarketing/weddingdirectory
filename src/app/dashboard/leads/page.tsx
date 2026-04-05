"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { LEAD_STATUSES } from "@/lib/constants";
import { LeadDetail } from "./LeadDetail";
import type { Lead } from "@/types/database";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-50 text-blue-700",
  contacted: "bg-amber-50 text-amber-700",
  call_booked: "bg-purple-50 text-purple-700",
  tour_booked: "bg-emerald-50 text-emerald-700",
  booked: "bg-emerald-50 text-emerald-700",
};

function statusLabel(value: string) {
  return LEAD_STATUSES.find((s) => s.value === value)?.label ?? value;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white shadow-lg animate-slide-up">
      {message}
    </div>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: venue } = await supabase
        .from("venues")
        .select("id")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (!venue) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("leads")
        .select("*")
        .eq("venue_id", venue.id)
        .order("created_at", { ascending: false });

      setLeads(data ?? []);
      setLoading(false);
    }
    load();
  }, [supabase]);

  const handleStatusChange = useCallback(
    async (leadId: string, status: string) => {
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status } : l))
      );

      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setToast("Status updated");
      } else {
        setToast("Failed to update status");
      }
    },
    []
  );

  const selectedLead = leads.find((l) => l.id === selectedId) ?? null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-300 border-t-stone-900" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-900">Leads</h1>
        <p className="mt-1 text-sm text-stone-500">
          Manage inquiries from couples interested in your venue.
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 px-6 py-16 text-center">
          <p className="text-stone-500">
            No leads yet. Share your venue listing to start receiving inquiries.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50">
                  <th className="px-4 py-3 font-medium text-stone-500">Name</th>
                  <th className="px-4 py-3 font-medium text-stone-500">Email</th>
                  <th className="px-4 py-3 font-medium text-stone-500">Phone</th>
                  <th className="px-4 py-3 font-medium text-stone-500">Wedding Date</th>
                  <th className="px-4 py-3 font-medium text-stone-500">Guests</th>
                  <th className="px-4 py-3 font-medium text-stone-500">Status</th>
                  <th className="px-4 py-3 font-medium text-stone-500">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedId(lead.id)}
                    className="cursor-pointer transition-colors hover:bg-stone-50"
                  >
                    <td className="px-4 py-3 font-medium text-stone-900">
                      {lead.name}
                    </td>
                    <td className="px-4 py-3 text-stone-600">{lead.email}</td>
                    <td className="px-4 py-3 text-stone-600">{lead.phone}</td>
                    <td className="px-4 py-3 text-stone-600">
                      {formatDate(lead.wedding_date)}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {lead.guest_count ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleStatusChange(lead.id, e.target.value)
                        }
                        className={`rounded-full px-3 py-1 text-xs font-medium border-0 cursor-pointer focus:ring-2 focus:ring-stone-900 focus:outline-none ${
                          STATUS_COLORS[lead.status] ?? "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {LEAD_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-stone-500">
                      {formatDate(lead.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {leads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => setSelectedId(lead.id)}
                className="cursor-pointer rounded-xl border border-stone-200 p-4 transition-colors hover:bg-stone-50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-stone-900">{lead.name}</p>
                    <p className="mt-0.5 text-sm text-stone-500">{lead.email}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      STATUS_COLORS[lead.status] ?? "bg-stone-100 text-stone-700"
                    }`}
                  >
                    {statusLabel(lead.status)}
                  </span>
                </div>
                <div className="mt-3 flex gap-4 text-xs text-stone-500">
                  <span>{formatDate(lead.wedding_date)}</span>
                  {lead.guest_count && (
                    <span>{lead.guest_count} guests</span>
                  )}
                  <span className="ml-auto">
                    {formatDate(lead.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedLead && (
        <LeadDetail
          lead={selectedLead}
          onClose={() => setSelectedId(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </>
  );
}
