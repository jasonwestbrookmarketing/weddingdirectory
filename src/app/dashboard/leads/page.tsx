"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { createClient } from "@/lib/supabase/client";
import { LEAD_STATUSES, BOOKING_TIMELINES } from "@/lib/constants";
import { LeadDetail } from "./LeadDetail";
import type { Lead } from "@/types/database";
import { Mail, Phone, Calendar, Users, MessageSquare } from "lucide-react";

type PipelineStage = typeof LEAD_STATUSES[number]["value"];
type Columns = Record<PipelineStage, Lead[]>;

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function getTimelineLabel(value: string | null) {
  if (!value) return null;
  return BOOKING_TIMELINES.find((t) => t.value === value)?.label ?? value;
}

const COLUMN_BORDER: Record<string, string> = {
  new:            "border-t-blue-400",
  contacted:      "border-t-amber-400",
  tour_booked:    "border-t-purple-400",
  proposal_sent:  "border-t-orange-400",
  booked_wedding: "border-t-emerald-400",
  not_interested: "border-t-stone-300",
};

const COLUMN_DOT: Record<string, string> = {
  new:            "bg-blue-400",
  contacted:      "bg-amber-400",
  tour_booked:    "bg-purple-400",
  proposal_sent:  "bg-orange-400",
  booked_wedding: "bg-emerald-400",
  not_interested: "bg-stone-300",
};

// ── Lead Card ────────────────────────────────────────────────────────────────
function LeadCard({
  lead,
  index,
  onClick,
}: {
  lead: Lead;
  index: number;
  onClick: () => void;
}) {
  const timeline = getTimelineLabel(lead.booking_timeline);

  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`bg-white rounded-xl select-none transition-all cursor-grab active:cursor-grabbing overflow-hidden ${
            snapshot.isDragging
              ? "shadow-2xl ring-2 ring-stone-300/60 scale-[1.01]"
              : "shadow-sm hover:shadow-md"
          }`}
        >
          {/* Card body */}
          <div className="px-4 pt-4 pb-3">
            {/* Name */}
            <p className="font-bold text-stone-900 text-[15px] leading-snug mb-3">
              {lead.name}
            </p>

            {/* Labeled rows */}
            <div className="space-y-1.5">
              {lead.wedding_date && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-400 w-28 shrink-0 flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" /> Wedding Date
                  </span>
                  <span className="text-xs font-medium text-stone-700">{formatDate(lead.wedding_date)}</span>
                </div>
              )}
              {lead.guest_count && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-400 w-28 shrink-0 flex items-center gap-1.5">
                    <Users className="h-3 w-3" /> Guest Count
                  </span>
                  <span className="text-xs font-medium text-stone-700">{lead.guest_count} guests</span>
                </div>
              )}
              {timeline && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-400 w-28 shrink-0 flex items-center gap-1.5">
                    <MessageSquare className="h-3 w-3" /> Timeline
                  </span>
                  <span className="text-xs font-medium text-stone-700">{timeline}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer action bar */}
          <div className="border-t border-stone-100 px-4 py-2.5 flex items-center gap-4">
            <a
              href={`tel:${lead.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="text-stone-400 hover:text-stone-700 transition-colors"
              title="Call"
            >
              <Phone className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${lead.email}`}
              onClick={(e) => e.stopPropagation()}
              className="text-stone-400 hover:text-stone-700 transition-colors"
              title="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
            <span className="ml-auto text-[11px] text-stone-400">
              {formatDate(lead.created_at)}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
}

// ── Column ────────────────────────────────────────────────────────────────────
function Column({
  stage,
  leads,
  onCardClick,
}: {
  stage: typeof LEAD_STATUSES[number];
  leads: Lead[];
  onCardClick: (lead: Lead) => void;
}) {
  return (
    <div className="flex flex-col w-[380px] shrink-0">

      {/* Column header — compact single row */}
      <div className={`bg-white rounded-xl border-t-[3px] shadow-sm px-4 py-2.5 mb-2.5 flex items-center gap-2.5 ${COLUMN_BORDER[stage.value] ?? "border-t-stone-300"}`}>
        <div className={`w-2 h-2 rounded-full shrink-0 ${COLUMN_DOT[stage.value] ?? "bg-stone-300"}`} />
        <h3 className="text-sm font-bold text-stone-800 flex-1 leading-none">{stage.label}</h3>
        <span className="text-xs font-semibold text-stone-400 tabular-nums">
          {leads.length} {leads.length === 1 ? "lead" : "leads"}
        </span>
      </div>

      {/* Droppable zone */}
      <Droppable droppableId={stage.value}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 min-h-[100px] rounded-2xl p-2 space-y-2 transition-colors ${
              snapshot.isDraggingOver
                ? "bg-stone-200/70 ring-2 ring-inset ring-stone-300/50"
                : "bg-stone-100/60"
            }`}
          >
            {leads.map((lead, index) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                index={index}
                onClick={() => onCardClick(lead)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LeadsPage() {
  const [columns, setColumns] = useState<Columns>(() => {
    const empty = {} as Columns;
    LEAD_STATUSES.forEach((s) => { empty[s.value as PipelineStage] = []; });
    return empty;
  });
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: venue } = await supabase
        .from("venues").select("id").eq("owner_id", user.id).maybeSingle();

      if (!venue) { setLoading(false); return; }

      const { data } = await supabase
        .from("leads").select("*").eq("venue_id", venue.id)
        .order("created_at", { ascending: false });

      const next: Columns = {} as Columns;
      LEAD_STATUSES.forEach((s) => { next[s.value as PipelineStage] = []; });
      (data ?? []).forEach((lead) => {
        const stage = lead.status as PipelineStage;
        if (next[stage]) next[stage].push(lead as Lead);
        else next["new"].push(lead as Lead);
      });
      setColumns(next);
      setLoading(false);
    }
    load();
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }

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

    if (selectedLead?.id === draggableId) {
      setSelectedLead((l) => l ? { ...l, status: dstStage } : l);
    }

    const res = await fetch(`/api/leads/${draggableId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: dstStage }),
    });
    showToast(res.ok
      ? `Moved to ${LEAD_STATUSES.find((s) => s.value === dstStage)?.label}`
      : "Failed to update — please try again"
    );
  }, [selectedLead]);

  const handleStatusChange = useCallback(async (leadId: string, status: string) => {
    const newStage = status as PipelineStage;
    let movedLead: Lead | undefined;

    setColumns((prev) => {
      const next = { ...prev };
      LEAD_STATUSES.forEach(({ value }) => {
        const stage = value as PipelineStage;
        const idx = next[stage].findIndex((l) => l.id === leadId);
        if (idx !== -1) {
          [movedLead] = next[stage].splice(idx, 1);
          movedLead = { ...movedLead, status: newStage };
        }
      });
      if (movedLead) next[newStage] = [movedLead, ...next[newStage]];
      return next;
    });

    if (selectedLead?.id === leadId) {
      setSelectedLead((l) => l ? { ...l, status: newStage } : l);
    }

    const res = await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStage }),
    });
    showToast(res.ok
      ? `Moved to ${LEAD_STATUSES.find((s) => s.value === newStage)?.label}`
      : "Failed to update"
    );
  }, [selectedLead]);

  const totalLeads = Object.values(columns).reduce((s, col) => s + col.length, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-300 border-t-stone-900" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 px-4 md:px-8">
        <h1 className="text-2xl font-semibold text-stone-900">Leads Pipeline</h1>
        <p className="mt-1 text-sm text-stone-500">
          {totalLeads} {totalLeads === 1 ? "lead" : "leads"} · Drag cards between stages
        </p>
      </div>

      {totalLeads === 0 ? (
        <div className="mx-4 md:mx-8 rounded-2xl border border-dashed border-stone-200 px-6 py-16 text-center">
          <p className="text-stone-500">No leads yet. Share your venue listing to start receiving inquiries.</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          {/* Always horizontal-scroll so columns stay wide */}
          <div className="overflow-x-auto pb-6 -mx-4 px-4 md:-mx-8 md:px-8">
            <div className="flex gap-4 w-max">
              {LEAD_STATUSES.map((stage) => (
                <Column
                  key={stage.value}
                  stage={stage}
                  leads={columns[stage.value as PipelineStage]}
                  onCardClick={setSelectedLead}
                />
              ))}
            </div>
          </div>
        </DragDropContext>
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
