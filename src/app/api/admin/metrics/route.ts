import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return null;
  return user;
}

function getDateRange(range: string): string | null {
  const now = new Date();
  switch (range) {
    case "7d":   return new Date(now.getTime() - 7 * 86400000).toISOString();
    case "14d":  return new Date(now.getTime() - 14 * 86400000).toISOString();
    case "30d":  return new Date(now.getTime() - 30 * 86400000).toISOString();
    case "60d":  return new Date(now.getTime() - 60 * 86400000).toISOString();
    case "month": {
      const d = new Date(now.getFullYear(), now.getMonth(), 1);
      return d.toISOString();
    }
    case "ytd": {
      return new Date(now.getFullYear(), 0, 1).toISOString();
    }
    case "lastyear": {
      return new Date(now.getFullYear() - 1, 0, 1).toISOString();
    }
    case "all":
    default:
      return null;
  }
}

function getDateRangeEnd(range: string): string | null {
  if (range === "lastyear") {
    const now = new Date();
    return new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59).toISOString();
  }
  return null;
}

export async function GET(request: Request) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "30d";
  const since = getDateRange(range);
  const until = getDateRangeEnd(range);

  const service = await createServiceClient();

  // Venues
  let venuesQuery = service.from("venues").select("id, is_published, location_state, location_city, created_at", { count: "exact" });
  if (since) venuesQuery = venuesQuery.gte("created_at", since);
  if (until) venuesQuery = venuesQuery.lte("created_at", until);
  const { data: venues, count: totalVenues } = await venuesQuery;

  const publishedVenues = venues?.filter(v => v.is_published).length ?? 0;
  const draftVenues = venues?.filter(v => !v.is_published).length ?? 0;

  // All-time totals (for context)
  const { count: allVenues } = await service.from("venues").select("id", { count: "exact" });
  const { count: allPublished } = await service.from("venues").select("id", { count: "exact" }).eq("is_published", true);

  // Leads
  let leadsQuery = service.from("leads").select("id, created_at, venue_id", { count: "exact" });
  if (since) leadsQuery = leadsQuery.gte("created_at", since);
  if (until) leadsQuery = leadsQuery.lte("created_at", until);
  const { data: leads, count: totalLeads } = await leadsQuery;

  const { count: allLeads } = await service.from("leads").select("id", { count: "exact" });

  // Top states
  const stateCount: Record<string, number> = {};
  for (const v of venues ?? []) {
    if (v.location_state) {
      stateCount[v.location_state] = (stateCount[v.location_state] || 0) + 1;
    }
  }
  const topStates = Object.entries(stateCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([state, count]) => ({ state, count }));

  // Top cities
  const cityCount: Record<string, number> = {};
  for (const v of venues ?? []) {
    if (v.location_city) {
      cityCount[v.location_city] = (cityCount[v.location_city] || 0) + 1;
    }
  }
  const topCities = Object.entries(cityCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([city, count]) => ({ city, count }));

  // Leads per venue (top venues by leads in range)
  const venueLeadCount: Record<string, number> = {};
  for (const l of leads ?? []) {
    venueLeadCount[l.venue_id] = (venueLeadCount[l.venue_id] || 0) + 1;
  }
  const topVenueIds = Object.entries(venueLeadCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => id);

  let topVenuesByLeads: { name: string; leads: number }[] = [];
  if (topVenueIds.length > 0) {
    const { data: topVenueData } = await service
      .from("venues")
      .select("id, name")
      .in("id", topVenueIds);
    topVenuesByLeads = topVenueIds.map(id => ({
      name: topVenueData?.find(v => v.id === id)?.name ?? "Unknown",
      leads: venueLeadCount[id],
    }));
  }

  return NextResponse.json({
    range,
    period: {
      venues: totalVenues ?? 0,
      published: publishedVenues,
      drafts: draftVenues,
      leads: totalLeads ?? 0,
    },
    allTime: {
      venues: allVenues ?? 0,
      published: allPublished ?? 0,
      leads: allLeads ?? 0,
    },
    topStates,
    topCities,
    topVenuesByLeads,
  });
}
