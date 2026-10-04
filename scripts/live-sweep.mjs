#!/usr/bin/env node
/**
 * Live sweep of storyvenue.com: every public surface answers, shows real
 * content, and links and images actually resolve. Read-only GETs against the
 * live site — safe to run any time, and meant to run after every deploy
 * (the Oct 3 outage sat invisible for twelve hours because nothing watched
 * these pages).
 *
 *   node scripts/live-sweep.mjs            # https://storyvenue.com
 *   node scripts/live-sweep.mjs <base-url> # a preview deploy
 *
 * Exits non-zero when anything fails, with a findings list.
 */

const BASE = (process.argv[2] || 'https://storyvenue.com').replace(/\/+$/, '');
const APP = 'https://app.storyvenue.com';

const findings = [];
let checks = 0;
const ok = (label) => { checks++; process.stdout.write(`PASS  ${label}\n`); };
const bad = (label, detail) => { checks++; findings.push(`${label}${detail ? ` — ${detail}` : ''}`); process.stdout.write(`FAIL  ${label}${detail ? ` — ${detail}` : ''}\n`); };

async function get(url) {
  try {
    const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'storyvenue-live-sweep' } });
    return { status: res.status, html: res.ok ? await res.text() : '' };
  } catch (e) {
    return { status: 0, html: '', error: String(e?.message ?? e) };
  }
}

async function head(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', headers: { 'user-agent': 'storyvenue-live-sweep' } });
    // Some hosts refuse HEAD; a ranged GET settles it.
    if (res.status === 405 || res.status === 403) {
      const g = await fetch(url, { headers: { range: 'bytes=0-64', 'user-agent': 'storyvenue-live-sweep' } });
      return g.status;
    }
    return res.status;
  } catch {
    return 0;
  }
}

const hrefs = (html, prefix) => [...new Set([...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]).filter((h) => h.startsWith(prefix)))];
const ERROR_TEXT = /No published venues|Application error|Internal Server Error|something went wrong/i;

/** A page answers 200, carries expected content, and shows no error copy. */
async function checkPage(path, { expectLinks, min = 1, expectText } = {}) {
  const { status, html, error } = await get(BASE + path);
  if (status !== 200) return bad(path, `answered ${status}${error ? ` (${error})` : ''}`);
  if (ERROR_TEXT.test(html)) return bad(path, `shows error copy: ${html.match(ERROR_TEXT)?.[0]}`);
  if (expectText && !html.includes(expectText)) return bad(path, `missing "${expectText}"`);
  if (expectLinks) {
    const found = hrefs(html, expectLinks);
    if (found.length < min) return bad(path, `${found.length} ${expectLinks}* links (expected ≥${min})`);
  }
  ok(path);
  return html;
}

// ── The core surfaces ────────────────────────────────────────────────────
const home = await checkPage('/', { expectLinks: '/venue/', min: 8 });
const venuesIndex = await checkPage('/venues', { expectLinks: '/venues/', min: 10 });
// Search results mount in the browser (the shell HTML carries none), so
// this only proves the page answers; the browser pass checks results.
await checkPage('/search?q=venue', { expectText: 'StoryVenue' });
await checkPage('/sitemap.xml', { expectText: '<urlset' });
await checkPage('/llms.txt', { expectText: 'StoryVenue' });

// Every state hub lists at least one venue.
const states = typeof venuesIndex === 'string' ? hrefs(venuesIndex, '/venues/') : [];
for (const s of states) await checkPage(s, { expectLinks: '/venue/', min: 1 });

// A sample of venue pages and their Lead Link pages render with content.
const venuePaths = typeof home === 'string' ? hrefs(home, '/venue/').slice(0, 6) : [];
const venueHtml = [];
for (const v of venuePaths) {
  const html = await checkPage(v, { expectText: 'Capacity' });
  if (typeof html === 'string') venueHtml.push(html);
  await checkPage(`${v}/links`);
}

// ── Marketing pages keep their promise and their CTA ────────────────────
await checkPage('/wedding-planner', { expectText: 'Start planning free' });
await checkPage('/book-more-weddings', { expectText: 'StoryVenue' });
await checkPage('/bride-booking-system', { expectText: 'StoryVenue' });
await checkPage('/free-listing', { expectText: 'StoryVenue' });

// ── Images on the swept pages resolve (sampled) ──────────────────────────
const imgs = new Set();
for (const html of [home, venuesIndex, ...venueHtml]) {
  if (typeof html !== 'string') continue;
  for (const m of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    const src = m[1].startsWith('/') ? BASE + m[1] : m[1];
    if (/^https?:/.test(src)) imgs.add(src.replace(/&amp;/g, '&'));
  }
}
let broken = 0;
for (const src of [...imgs].slice(0, 40)) {
  const status = await head(src);
  if (status !== 200 && status !== 206) { broken++; bad('image', `${status} ${src.slice(0, 110)}`); }
}
if (!broken) ok(`images (${Math.min(imgs.size, 40)} sampled)`);

// ── Internal links across swept pages resolve (sampled) ─────────────────
const internal = new Set();
for (const html of [home, venuesIndex, ...venueHtml]) {
  if (typeof html !== 'string') continue;
  for (const h of hrefs(html, '/')) {
    if (h.startsWith('//') || h.includes('#') || /\.(xml|txt)$/.test(h)) continue;
    internal.add(h.split('?')[0]);
  }
}
let dead = 0;
for (const path of [...internal].slice(0, 80)) {
  const status = await head(BASE + path);
  if (status >= 400 || status === 0) { dead++; bad('link', `${status} ${path}`); }
}
if (!dead) ok(`internal links (${Math.min(internal.size, 80)} sampled)`);

// ── The doors this site sends people through ─────────────────────────────
for (const url of [`${APP}/signup`, `${APP}/login`, `${APP}/signup?as=couple`]) {
  const status = await head(url);
  if (status !== 200) bad('app door', `${status} ${url}`); else ok(`app door ${url.replace(APP, '')}`);
}

console.log(`\n${checks} checks, ${findings.length} findings.`);
if (findings.length) {
  console.log(findings.map((f) => ` - ${f}`).join('\n'));
  process.exit(1);
}
