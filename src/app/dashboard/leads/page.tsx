"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { createClient } from "@/lib/supabase/client";
import { LEAD_STATUSES } from "@/lib/constants";
import { LeadDetail } from "./LeadDetail";
import type { Lead } from "@/types/database";
import { Mail, Phone, Clock } from "lucide-react";

type PipelineStage = typeof LEAD_STATUSES[number]["value"];
type Columns = Record<PipelineStage, Lead[]>;

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

const COLUMN_ACCENT: Record<string, string> = {
  new:            "border-l-blue-400",
  contacted:      "border-l-amber-400",
  tour_booked:    "border-l-purple-400",
  proposal_sent:  "border-l-orange-400",
  booked_wedding: "border-l-emerald-400",
  not_interested: "border-l-stone-300",
};

const COLUMN_DOT: Record<string, string> = {
  new:            "bg-blue-400",
  contacted:      "bg-amber-400",
  tour_booked:    "bg-purple-400",
  proposal_sent:  "bg-orange-400",
  booked_wedding: "bg-emerald-400",
  not_interested: "bg-stone-300",
};

function LeadCard({
  lead,
  index,
  onClick,
}: {
  lead: Lead;
  index: number;
  onClick: () => void;
}) {
  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`bg-white rounded-xl border-l-4 px-4 py-3.5 cursor-grab active:cursor-grabbing select-none transition-all ${
            COLUMN_ACCENT[lead.status] ?? "border-l-stone-300"
          } ${
            snapshot.isDragging
              ? "shadow-2xl scale-[1.01] ring-1 ring-stone-200"
              : "border border-stone-200 hover:shadow-md hover:border-stone-300"
          }`}
        >
          {/* Top row: name + date */}
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <p className="font-semibold text-stone-900 text-sm leading-snug">{lead.name}</p>
            <span className="text-[11px] text-stone-400 shrink-0 flex items-center gap-1 mt-0.5">
              <Clock className="h-3 w-3" />
              {formatDate(lead.created_at) ?? "—"}
            </span>
          </div>

          {/* Bottom row: email + phone side by side */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-stone-500 min-w-0">
              <Mail className="h-3 w-3 shrink-0 text-stone-400" />
              <span className="truncate">{lead.email}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 shrink-0">
              <Phone className="h-3 w-3 text-stone-400" />
              <span>{lead.phone}</span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

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
    <div className="flex flex-col min-w-[300px] lg:min-w-0 lg:flex-1">
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 px-0.5">
        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${COLUMN_DOT[stage.value] ?? "bg-stone-400"}`} />
        <h3 className="text-sm font-semibold text-stone-700 flex-1 truncate">{stage.label}</h3>
        <span className="text-xs font-semibold text-stone-400 bg-stone-100 rounded-full px-2.5 py-0.5 shrink-0 tabular-nums">
          {leads.length}
        </span>
      </div>

      {/* Droppable column */}
      <Droppable droppableId={stage.value}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 min-h-[160px] rounded-2xl p-2.5 space-y-2.5 transition-colors ${
              snapshot.isDraggingOver ? "bg-stone-200/80 ring-2 ring-stone-300/50" : "bg-stone-100/70"
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
        .from("venues")
        .select("id")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (!venue) { setLoading(false); return; }

      const { data } = await supabase
        .from("leads")
        .select("*")
        .eq("venue_id", venue.id)
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

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      const { source, destination, draggableId } = result;
      if (!destination) return;
      if (source.droppableId === destination.droppableId && source.index === destination.index) return;

      const srcStage = source.droppableId as PipelineStage;
      const dstStage = destination.droppableId as PipelineStage;

      // Optimistic update
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

      // Update selected lead if open
      if (selectedLead?.id === draggableId) {
        setSelectedLead((l) => l ? { ...l, status: dstStage } : l);
      }

      // Persist
      const res = await fetch(`/api/leads/${draggableId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: dstStage }),
      });

      if (res.ok) {
        const stageName = LEAD_STATUSES.find((s) => s.value === dstStage)?.label;
        showToast(`Moved to ${stageName}`);
      } else {
        showToast("Failed to update — please try again");
      }
    },
    [selectedLead]
  );

  const handleStatusChange = useCallback(
    async (leadId: string, status: string) => {
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

      if (res.ok) {
        const stageName = LEAD_STATUSES.find((s) => s.value === newStage)?.label;
        showToast(`Moved to ${stageName}`);
      } else {
        showToast("Failed to update");
      }
    },
    [selectedLead]
  );

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
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-900">Leads Pipeline</h1>
        <p className="mt-1 text-sm text-stone-500">
          {totalLeads} {totalLeads === 1 ? "lead" : "leads"} · Drag cards to move between stages
        </p>
      </div>

      {totalLeads === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 px-6 py-16 text-center">
          <p className="text-stone-500">
            No leads yet. Share your venue listing to start receiving inquiries.
          </p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          {/* Full-bleed horizontal scroll on mobile, flex on desktop */}
          <div className="overflow-x-auto pb-6 -mx-4 px-4 lg:-mx-8 lg:px-8">
            <div className="flex gap-4 min-w-max lg:min-w-0">

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
