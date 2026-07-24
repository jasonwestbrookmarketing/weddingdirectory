import "server-only";
import { getAdminClient } from "@/lib/supabase/admin";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ElementKey = "headline" | "subheadline" | "cta";

export interface VariantRow {
  id: string;
  page_key: string;
  element: ElementKey;
  content: string;
  enabled: boolean;
  pinned: boolean;
  impressions: number;
  clicks: number;
  position: number;
}

export interface HeroSelection {
  headline: { id: string | null; line1: string; line2: string };
  subheadline: { id: string | null; content: string };
  cta: { id: string | null; content: string };
  /** Non-null variant ids selected this render — used for impression/click tracking. */
  variantIds: string[];
}

/* ------------------------------------------------------------------ */
/*  Fallback copy (matches the live hero exactly)                      */
/* ------------------------------------------------------------------ */

const DEFAULTS: Record<string, Record<ElementKey, string>> = {
  "bride-booking-system": {
    headline: "Join The Fastest Growing Wedding Directory",
    subheadline: "List your venue free and get found by couples actively searching for a place to get married.",
    cta: "Claim Your Free Listing",
  },
};

function fallbackSelection(pageKey: string): HeroSelection {
  const d = DEFAULTS[pageKey] ?? DEFAULTS["bride-booking-system"];
  const { line1, line2 } = parseHeadline(d.headline);
  return {
    headline: { id: null, line1, line2 },
    subheadline: { id: null, content: d.subheadline },
    cta: { id: null, content: d.cta },
    variantIds: [],
  };
}

/** Headline convention: text after the first "|" renders in gold. */
export function parseHeadline(content: string): { line1: string; line2: string } {
  const idx = content.indexOf("|");
  if (idx === -1) return { line1: content.trim(), line2: "" };
  return {
    line1: content.slice(0, idx).trim(),
    line2: content.slice(idx + 1).trim(),
  };
}

/* ------------------------------------------------------------------ */
/*  Bandit math — Thompson Sampling on click-through rate              */
/* ------------------------------------------------------------------ */

// Marsaglia–Tsang gamma sampler (shape >= 1 handled; boosts low shapes).
function sampleGamma(shape: number): number {
  if (shape < 1) {
    const u = Math.random();
    return sampleGamma(shape + 1) * Math.pow(u, 1 / shape);
  }
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let x: number, v: number;
    do {
      x = gaussian();
      v = 1 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = Math.random();
    if (u < 1 - 0.0331 * x * x * x * x) return d * v;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}

function gaussian(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** Draw from Beta(alpha, beta). */
function sampleBeta(alpha: number, beta: number): number {
  const x = sampleGamma(alpha);
  const y = sampleGamma(beta);
  return x / (x + y);
}

/** Pick a winning variant for one element via Thompson Sampling. */
function pickVariant(variants: VariantRow[]): VariantRow | null {
  const enabled = variants.filter((v) => v.enabled);
  if (enabled.length === 0) return null;

  const pinned = enabled
    .filter((v) => v.pinned)
    .sort((a, b) => a.position - b.position);
  if (pinned.length > 0) return pinned[0];

  if (enabled.length === 1) return enabled[0];

  let best: VariantRow | null = null;
  let bestTheta = -1;
  for (const v of enabled) {
    const clicks = Math.max(0, v.clicks);
    const impr = Math.max(clicks, v.impressions);
    const theta = sampleBeta(clicks + 1, impr - clicks + 1);
    if (theta > bestTheta) {
      bestTheta = theta;
      best = v;
    }
  }
  return best;
}

/**
 * Probability each enabled variant is the best (Monte Carlo). Returns a map of
 * variant id -> probability (0..1). Disabled variants are omitted.
 */
export function probabilityBest(variants: VariantRow[], draws = 4000): Record<string, number> {
  const enabled = variants.filter((v) => v.enabled);
  const result: Record<string, number> = {};
  for (const v of enabled) result[v.id] = 0;
  if (enabled.length <= 1) {
    if (enabled.length === 1) result[enabled[0].id] = 1;
    return result;
  }
  for (let i = 0; i < draws; i++) {
    let bestId = enabled[0].id;
    let bestTheta = -1;
    for (const v of enabled) {
      const clicks = Math.max(0, v.clicks);
      const impr = Math.max(clicks, v.impressions);
      const theta = sampleBeta(clicks + 1, impr - clicks + 1);
      if (theta > bestTheta) {
        bestTheta = theta;
        bestId = v.id;
      }
    }
    result[bestId] += 1;
  }
  for (const id of Object.keys(result)) result[id] /= draws;
  return result;
}

/* ------------------------------------------------------------------ */
/*  Public render-time selection                                       */
/* ------------------------------------------------------------------ */

export async function getHeroSelection(pageKey: string): Promise<HeroSelection> {
  const supabase = getAdminClient();
  if (!supabase) return fallbackSelection(pageKey);

  try {
    const { data, error } = await supabase
      .from("funnel_variants")
      .select("id, page_key, element, content, enabled, pinned, impressions, clicks, position")
      .eq("page_key", pageKey);

    if (error || !data || data.length === 0) return fallbackSelection(pageKey);

    const rows = data as VariantRow[];
    const byElement = (el: ElementKey) => rows.filter((r) => r.element === el);

    const d = DEFAULTS[pageKey] ?? DEFAULTS["bride-booking-system"];

    const headlinePick = pickVariant(byElement("headline"));
    const subPick = pickVariant(byElement("subheadline"));
    const ctaPick = pickVariant(byElement("cta"));

    const headlineContent = headlinePick?.content ?? d.headline;
    const { line1, line2 } = parseHeadline(headlineContent);

    const variantIds = [headlinePick?.id, subPick?.id, ctaPick?.id].filter(
      (x): x is string => Boolean(x)
    );

    return {
      headline: { id: headlinePick?.id ?? null, line1, line2 },
      subheadline: { id: subPick?.id ?? null, content: subPick?.content ?? d.subheadline },
      cta: { id: ctaPick?.id ?? null, content: ctaPick?.content ?? d.cta },
      variantIds,
    };
  } catch {
    return fallbackSelection(pageKey);
  }
}

/* ------------------------------------------------------------------ */
/*  Tracking                                                           */
/* ------------------------------------------------------------------ */

export async function trackEvent(ids: string[], event: "impression" | "click"): Promise<boolean> {
  const supabase = getAdminClient();
  if (!supabase) return false;
  const clean = ids.filter((id) => /^[0-9a-f-]{36}$/i.test(id)).slice(0, 10);
  if (clean.length === 0) return false;
  const { error } = await supabase.rpc("funnel_track", { p_ids: clean, p_event: event });
  return !error;
}

/* ------------------------------------------------------------------ */
/*  Admin: stats + mutations                                           */
/* ------------------------------------------------------------------ */

export interface VariantStat extends VariantRow {
  ctr: number;
  probBest: number | null;
}

export interface PageSettings {
  page_key: string;
  auto_pause: boolean;
  min_impressions: number;
}

export interface ExperimentView {
  page: PageSettings;
  elements: Record<ElementKey, VariantStat[]>;
}

const ELEMENTS: ElementKey[] = ["headline", "subheadline", "cta"];

export async function getExperimentView(pageKey: string): Promise<ExperimentView | null> {
  const supabase = getAdminClient();
  if (!supabase) return null;

  const [{ data: variants }, { data: pageRows }] = await Promise.all([
    supabase
      .from("funnel_variants")
      .select("id, page_key, element, content, enabled, pinned, impressions, clicks, position")
      .eq("page_key", pageKey)
      .order("element", { ascending: true })
      .order("position", { ascending: true }),
    supabase.from("funnel_pages").select("page_key, auto_pause, min_impressions").eq("page_key", pageKey),
  ]);

  const page: PageSettings = (pageRows?.[0] as PageSettings) ?? {
    page_key: pageKey,
    auto_pause: false,
    min_impressions: 200,
  };

  const elements = {} as Record<ElementKey, VariantStat[]>;
  for (const el of ELEMENTS) {
    const rows = ((variants ?? []) as VariantRow[]).filter((r) => r.element === el);
    const probs = probabilityBest(rows);
    elements[el] = rows.map((r) => ({
      ...r,
      ctr: r.impressions > 0 ? r.clicks / r.impressions : 0,
      probBest: r.enabled ? probs[r.id] ?? null : null,
    }));
  }

  return { page, elements };
}

export async function upsertVariant(input: {
  id?: string;
  page_key: string;
  element: ElementKey;
  content: string;
}): Promise<boolean> {
  const supabase = getAdminClient();
  if (!supabase) return false;

  if (input.id) {
    const { error } = await supabase
      .from("funnel_variants")
      .update({ content: input.content, updated_at: new Date().toISOString() })
      .eq("id", input.id);
    return !error;
  }

  // New variant — enforce max 5 per element and append at next position.
  const { data: existing } = await supabase
    .from("funnel_variants")
    .select("id, position")
    .eq("page_key", input.page_key)
    .eq("element", input.element);
  if ((existing?.length ?? 0) >= 5) return false;
  const nextPos = Math.max(0, ...((existing ?? []).map((r) => (r as { position: number }).position))) + 1;

  const { error } = await supabase.from("funnel_variants").insert({
    page_key: input.page_key,
    element: input.element,
    content: input.content,
    position: existing && existing.length === 0 ? 0 : nextPos,
  });
  return !error;
}

export async function setVariantFlags(
  id: string,
  flags: { enabled?: boolean; pinned?: boolean }
): Promise<boolean> {
  const supabase = getAdminClient();
  if (!supabase) return false;

  // Pinning is exclusive per element: clear other pins first.
  if (flags.pinned === true) {
    const { data: row } = await supabase
      .from("funnel_variants")
      .select("page_key, element")
      .eq("id", id)
      .single();
    if (row) {
      await supabase
        .from("funnel_variants")
        .update({ pinned: false })
        .eq("page_key", (row as VariantRow).page_key)
        .eq("element", (row as VariantRow).element);
    }
  }

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (flags.enabled !== undefined) patch.enabled = flags.enabled;
  if (flags.pinned !== undefined) patch.pinned = flags.pinned;

  const { error } = await supabase.from("funnel_variants").update(patch).eq("id", id);
  return !error;
}

export async function deleteVariant(id: string): Promise<boolean> {
  const supabase = getAdminClient();
  if (!supabase) return false;
  const { error } = await supabase.from("funnel_variants").delete().eq("id", id);
  return !error;
}

export async function resetVariantStats(id: string): Promise<boolean> {
  const supabase = getAdminClient();
  if (!supabase) return false;
  const { error } = await supabase
    .from("funnel_variants")
    .update({ impressions: 0, clicks: 0, updated_at: new Date().toISOString() })
    .eq("id", id);
  return !error;
}

export async function setPageSettings(
  pageKey: string,
  settings: { auto_pause?: boolean; min_impressions?: number }
): Promise<boolean> {
  const supabase = getAdminClient();
  if (!supabase) return false;
  const { error } = await supabase
    .from("funnel_pages")
    .upsert(
      { page_key: pageKey, ...settings, updated_at: new Date().toISOString() },
      { onConflict: "page_key" }
    );
  return !error;
}

/**
 * Auto-pause losers: when a page has auto_pause on and an element has a variant
 * with >= 95% probability of being best (and enough impressions), disable the
 * others. Returns the number of variants disabled.
 */
export async function evaluateAutoPause(pageKey: string): Promise<number> {
  const supabase = getAdminClient();
  if (!supabase) return 0;
  const view = await getExperimentView(pageKey);
  if (!view || !view.page.auto_pause) return 0;

  let disabled = 0;
  for (const el of ELEMENTS) {
    const rows = view.elements[el];
    const enabled = rows.filter((r) => r.enabled);
    if (enabled.length <= 1) continue;
    const totalImpr = enabled.reduce((s, r) => s + r.impressions, 0);
    if (totalImpr < view.page.min_impressions) continue;
    const winner = enabled.find((r) => (r.probBest ?? 0) >= 0.95);
    if (!winner) continue;
    for (const r of enabled) {
      if (r.id === winner.id) continue;
      await supabase.from("funnel_variants").update({ enabled: false }).eq("id", r.id);
      disabled += 1;
    }
  }
  return disabled;
}
