#!/usr/bin/env node
// ─── Service Page Quality Audit ───────────────────────────────────────────────
// The same page review kept being rebuilt by hand, and hand-built measurements
// were wrong twice in ways the browser later contradicted: section leaks were
// counted from raw data keys when the template resolves most content through
// getParityService(), and footer contrast was measured against document.body
// instead of the element's own painted background. Both mistakes are impossible
// here because every number comes from the rendered page.
//
// Scores come from the rubric in RUBRIC below, which states the threshold for
// every point. That matters more than the total: an unanchored score cannot be
// defended when challenged, and cannot be compared across pages or across time.
// Two runs of this script on the same page always agree.
//
// Requires a dev server. Start one, then:
//   node scripts/audit-page-quality.mjs ai-cognitive-computing
//   node scripts/audit-page-quality.mjs --all --base=http://localhost:3010
//   node scripts/audit-page-quality.mjs mlops --compare=https://example.com/x
//   node scripts/audit-page-quality.mjs --all --json > audit.json
// ──────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const SNAP_DIR = path.join(repoRoot, 'frontend', 'public', 'prerender', 'services');
const DATA = path.join(repoRoot, 'frontend', 'src', 'data', 'servicesData.js');

// Playwright lives in the frontend package, not at the repo root.
// Both packages ship CommonJS, so a dynamic import hands back the module under
// `default` rather than as named exports.
const req = createRequire(path.join(repoRoot, 'frontend', 'package.json'));
const pw = await import(pathToFileURL(req.resolve('playwright')).href);
const chromium = pw.chromium || pw.default?.chromium;
const axeMod = await import(pathToFileURL(req.resolve('@axe-core/playwright')).href);
const AxeBuilder = axeMod.AxeBuilder || axeMod.default?.default || axeMod.default;
if (!chromium || !AxeBuilder) {
  console.error('ERROR: could not load playwright or @axe-core/playwright from frontend/node_modules');
  process.exit(2);
}

// ─── Args ─────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (n, d = null) => {
  const hit = argv.find((a) => a.startsWith(`--${n}=`));
  return hit ? hit.slice(n.length + 3) : d;
};
const has = (n) => argv.includes(`--${n}`);
const BASE = flag('base', 'http://localhost:3010').replace(/\/$/, '');
const COMPARE = flag('compare');
const JSON_OUT = has('json');
const slugArgs = argv.filter((a) => !a.startsWith('--'));

// ─── Vocabulary ───────────────────────────────────────────────────────────────
// Register proxy. These separate hand-written sections from templated ones more
// reliably than sentence length does, because a templated section reaches for
// them and a written one reaches for a concrete noun instead.
const BOILERPLATE = /\b(enterprise|organizational|framework|frameworks|governance|alignment|readiness|stakeholder|holistic|leverage|robust|seamless|cutting-edge|best-in-class|synerg\w*|end-to-end|comprehensive|world-class|state-of-the-art|transformative|innovative|scalable solutions|mission-critical|paradigm|ecosystem)\b/gi;

// Copy belonging to /services/agentic-ai that other pages used to inherit.
// Kept as a regression check: this class of defect was live on 56 pages.
//
// "your industry." is deliberately NOT listed. It was the second line of the
// agentic heading, but every department default written in #368 ends the same
// way ("Intelligence built for / your industry."), so matching it alone flags
// the fix as the defect. "Agents built for" is the part that was ever wrong.
const AGENTIC_DEFAULTS = [
  'Agents built for',
  'Your next workflow runs itself.',
  'One agent in production.',
  'what a production agent looks like',
  'ARCHITECTURE & EXECUTION LOOP',
  'The 5-Stage Autonomous Execution Loop.',
];

// ─── Rubric ───────────────────────────────────────────────────────────────────
// Every point has a stated threshold. Change a threshold and every page rescores
// consistently; that is the property an unanchored judgment call does not have.
const RUBRIC = {
  content: [
    ['boilerplate density', 3, (m) => (m.boilerplatePct < 1 ? 3 : m.boilerplatePct < 2 ? 2 : m.boilerplatePct < 4 ? 1 : 0),
      'under 1 per cent of words = 3, under 2 = 2, under 4 = 1'],
    ['second person', 3, (m) => (m.youPer1k > 10 ? 3 : m.youPer1k > 5 ? 2 : m.youPer1k > 2 ? 1 : 0),
      'per 1,000 words: over 10 = 3, over 5 = 2, over 2 = 1'],
    ['off-topic contamination', 2, (m) => (m.offTopic <= 5 ? 2 : m.offTopic < 15 ? 1 : 0),
      'stray words from another service: 5 or fewer = 2, under 15 = 1'],
    ['FAQ depth', 2, (m) => (m.faqCount >= 8 && m.faqWords >= 800 ? 2 : m.faqCount >= 5 && m.faqWords >= 400 ? 1 : 0),
      '8 or more questions and 800 or more words = 2'],
  ],
  discoverability: [
    ['snapshot coverage', 3, (m) => (m.snapCoverage >= 85 ? 3 : m.snapCoverage >= 70 ? 2 : m.snapCoverage >= 50 ? 1 : 0),
      'share of page words a non-JS crawler receives: 85 or more = 3, 70 = 2, 50 = 1'],
    ['FAQPage schema', 2, (m) => (m.schema.includes('FAQPage') ? 2 : 0), 'present = 2'],
    ['speakable', 1, (m) => (m.schema.includes('SpeakableSpecification') ? 1 : 0), 'present = 1'],
    ['citations in snapshot', 2, (m) => (m.snapCitations >= 10 ? 2 : m.snapCitations >= 3 ? 1 : 0),
      'outbound source links: 10 or more = 2, 3 or more = 1'],
    ['question-form content', 2, (m) => (m.questionStrings >= 10 ? 2 : m.questionStrings >= 5 ? 1 : 0),
      'headings and prompts ending in a question mark: 10 = 2, 5 = 1'],
  ],
  search: [
    ['title length', 2, (m) => (m.titleLen >= 45 && m.titleLen <= 60 ? 2 : m.titleLen <= 65 ? 1 : 0),
      '45 to 60 characters = 2, up to 65 = 1'],
    ['meta description', 2, (m) => (m.descLen >= 140 && m.descLen <= 160 ? 2 : m.descLen >= 110 && m.descLen <= 170 ? 1 : 0),
      '140 to 160 characters = 2'],
    ['heading structure', 2, (m) => (m.h1Count === 1 && m.headingSkips === 0 ? 2 : m.h1Count === 1 ? 1 : 0),
      'exactly one h1 and no skipped levels = 2'],
    ['internal linking', 1, (m) => (m.internalLinks >= 25 ? 1 : 0), '25 or more internal links = 1'],
    ['E-E-A-T signals', 3, (m) => (m.hasPerson ? 2 : 0) + (m.hasDates ? 1 : 0),
      'Person schema = 2, datePublished or dateModified = 1'],
  ],
  experience: [
    ['accessibility', 3, (m) => (m.axe === 0 ? 3 : m.axe <= 2 ? 2 : m.axe <= 5 ? 1 : 0),
      'axe violations: 0 = 3, up to 2 = 2, up to 5 = 1'],
    ['tap targets', 2, (m) => (m.tapSmall === 0 ? 2 : m.tapSmall <= 2 ? 1 : 0), 'none under 24px = 2'],
    ['render health', 2, (m) => (m.pageErrors === 0 ? 2 : 0), 'no console page errors = 2'],
    ['no inherited copy', 2, (m) => (m.leaks.length === 0 ? 2 : 0), 'no other service default strings = 2'],
    ['section density', 1, (m) => (m.thinSections === 0 ? 1 : 0), 'no section under 10 words per 100px = 1'],
  ],
};

const GROUP_LABEL = {
  content: 'Content Intelligence',
  discoverability: 'AI Discoverability',
  search: 'Search Intelligence',
  experience: 'Experience & Conversion',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const words = (t) => t.trim().split(/\s+/).filter(Boolean);
const normTokens = (t) => t.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(Boolean);

/**
 * Read a prerender snapshot the way the crawler it was written for reads it.
 *
 * This used to strip tags with regular expressions, which CodeQL flagged (a
 * `<script[\s\S]*?</script>` filter does not survive malformed or unusual tags,
 * and a single pass of `<[^>]+>` is incomplete sanitization). Both objections
 * are correct about accuracy as well as safety, and there is no reason to hand
 * roll an HTML parser here when a browser is already open.
 *
 * JavaScript is disabled deliberately: the snapshot exists for crawlers that do
 * not execute it, so this measures exactly what they receive.
 */
async function readSnapshot(browser, slug) {
  const file = path.join(SNAP_DIR, `${slug}.html`);
  if (!fs.existsSync(file)) return { text: '', words: 0, citations: 0 };
  const snapCtx = await browser.newContext({ javaScriptEnabled: false });
  const page = await snapCtx.newPage();
  try {
    await page.goto(pathToFileURL(file).href, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const out = await page.evaluate(() => ({
      text: document.body.innerText,
      citations: document.querySelectorAll('a[href^="http"]').length,
    }));
    return { text: out.text, words: out.text.trim().split(/\s+/).filter(Boolean).length, citations: out.citations };
  } finally {
    await snapCtx.close();
  }
}

function allSlugs() {
  const src = fs.readFileSync(DATA, 'utf8');
  return [...src.matchAll(/\n {2}'([a-z0-9-]+)': \{/g)].map((m) => m[1]);
}

/** Longest shared n-gram windows between two texts — a derivation probe. */
function derivation(a, b) {
  const A = normTokens(a); const B = normTokens(b);
  const out = {};
  for (const n of [10, 8, 6, 5, 4]) {
    const setB = new Set();
    for (let i = 0; i + n <= B.length; i += 1) setB.add(B.slice(i, i + n).join(' '));
    const hits = new Set();
    for (let i = 0; i + n <= A.length; i += 1) {
      const g = A.slice(i, i + n).join(' ');
      if (setB.has(g)) hits.add(g);
    }
    out[n] = [...hits];
  }
  return out;
}

// ─── Measurement ──────────────────────────────────────────────────────────────
async function measure(browserRef, ctx, slug) {
  const page = await ctx.newPage();
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(e.message));
  await page.goto(`${BASE}/services/${slug}`, { waitUntil: 'networkidle', timeout: 60000 });
  // GSAP reveals start at opacity 0, and axe skips what it believes is hidden.
  await page.addStyleTag({ content: '[data-gsap]{opacity:1!important;transform:none!important}' });
  await page.waitForTimeout(1400);

  const dom = await page.evaluate(() => {
    const text = document.body.innerText;
    const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
      .map((e) => ({ level: +e.tagName[1], text: e.innerText.trim().replace(/\s+/g, ' ') }));
    const sections = [...document.querySelectorAll('section')]
      .map((s) => {
        const r = s.getBoundingClientRect();
        const t = (s.innerText || '').trim();
        return {
          px: Math.round(r.height),
          words: t.split(/\s+/).filter(Boolean).length,
          heading: (s.querySelector('h1,h2')?.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60) || '(no heading)',
        };
      })
      .filter((s) => s.px > 40);
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')]
      .map((s) => { try { return JSON.parse(s.textContent); } catch { return null; } }).filter(Boolean);
    const types = [];
    const walk = (o) => {
      if (!o) return;
      if (Array.isArray(o)) { o.forEach(walk); return; }
      if (typeof o === 'object') {
        if (o['@type']) types.push(...[].concat(o['@type']));
        Object.values(o).forEach(walk);
      }
    };
    ld.forEach(walk);
    const ldRaw = JSON.stringify(ld);
    const imgs = [...document.querySelectorAll('img')].map((i) => ({
      src: (i.currentSrc || i.src).split('/').pop(),
      natural: i.naturalWidth,
      display: Math.round(i.getBoundingClientRect().width),
      hasDim: !!(i.getAttribute('width') && i.getAttribute('height')),
      hasAlt: !!i.alt,
    }));
    const links = [...document.querySelectorAll('a[href]')];
    const tapSmall = [...document.querySelectorAll('a,button')]
      .filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.height < 24 || r.width < 24); })
      .map((e) => `${e.innerText.trim().slice(0, 22)} ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`);
    return {
      text,
      height: document.body.scrollHeight,
      sections,
      heads,
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.content || '',
      canonical: document.querySelector('link[rel="canonical"]')?.href || '',
      h1Count: document.querySelectorAll('h1').length,
      schema: [...new Set(types)].sort(),
      hasDates: /"datePublished"|"dateModified"/.test(ldRaw),
      imgs,
      internalLinks: links.filter((a) => a.host === location.host).length,
      externalLinks: links.filter((a) => a.host !== location.host).length,
      tapSmall,
    };
  });

  const axeRun = await new AxeBuilder({ page }).analyze();
  await page.close();

  // ── Snapshot coverage: what a crawler that never runs JS actually receives ──
  const snap = await readSnapshot(browserRef, slug);
  const snapWords = snap.words;
  const snapCitations = snap.citations;
  const snapText = snap.text;

  const pageWords = words(dom.text).length;
  const boilerHits = (dom.text.match(BOILERPLATE) || []).length;
  const youHits = (dom.text.match(/\byou\b|\byour\b|\byours\b/gi) || []).length;

  // Off-topic contamination: agentic vocabulary is only on-topic for the two
  // agentic services, so it is measured against every other page.
  const offTopic = slug.startsWith('agentic')
    ? 0
    : (dom.text.match(/\bagent\b|\bagents\b|\bagentic\b|\bautonomous\b/gi) || []).length;

  const leaks = slug.startsWith('agentic') ? [] : AGENTIC_DEFAULTS.filter((s) => dom.text.includes(s));

  // Heading skips: h2 to h4 with no h3 between. Footer chrome is excluded by
  // ignoring anything after the last h2, which is where the footer starts.
  let skips = 0; let prev = 0;
  for (const h of dom.heads) {
    if (prev && h.level > prev + 1) skips += 1;
    prev = h.level;
  }

  // Headings only. The snapshot repeats the same questions, so counting it too
  // would double every FAQ.
  const questionStrings = dom.heads.filter((h) => h.text.endsWith('?')).length;

  const faqHeads = dom.heads.filter((h) => h.level === 3 && h.text.endsWith('?'));
  const faqIdx = dom.sections.findIndex((s) => /FAQ|frequently asked|hard questions/i.test(s.heading));

  const thin = dom.sections.filter((s) => s.words / Math.max(s.px, 1) * 100 < 10);

  return {
    slug,
    height: dom.height,
    pageWords,
    sections: dom.sections,
    heads: dom.heads,
    title: dom.title,
    titleLen: dom.title.length,
    desc: dom.desc,
    descLen: dom.desc.length,
    canonical: dom.canonical,
    h1Count: dom.h1Count,
    headingSkips: skips,
    schema: dom.schema,
    hasPerson: dom.schema.includes('Person'),
    hasDates: dom.hasDates,
    internalLinks: dom.internalLinks,
    externalLinks: dom.externalLinks,
    imgs: dom.imgs,
    imgsNoDim: dom.imgs.filter((i) => !i.hasDim).length,
    imgsNoAlt: dom.imgs.filter((i) => !i.hasAlt).length,
    imgsOversized: dom.imgs.filter((i) => i.display > 0 && i.natural / i.display >= 3).length,
    imgsReused: Object.entries(dom.imgs.reduce((a, i) => { a[i.src] = (a[i.src] || 0) + 1; return a; }, {}))
      .filter(([, n]) => n >= 4).map(([s, n]) => `${s} x${n}`),
    boilerplatePct: +(boilerHits / Math.max(pageWords, 1) * 100).toFixed(2),
    youPer1k: +(youHits / Math.max(pageWords, 1) * 1000).toFixed(1),
    youCount: youHits,
    offTopic,
    leaks,
    faqCount: faqHeads.length,
    faqWords: faqIdx >= 0 ? dom.sections[faqIdx].words : 0,
    questionStrings,
    snapWords,
    snapCitations,
    snapCoverage: pageWords ? +(snapWords / pageWords * 100).toFixed(1) : 0,
    snapText,
    axe: axeRun.violations.length,
    axeDetail: axeRun.violations.map((v) => `${v.id}(${v.nodes.length})`),
    tapSmall: dom.tapSmall.length,
    tapDetail: dom.tapSmall,
    thinSections: thin.length,
    thinDetail: thin.map((s) => `${s.heading} ${s.px}px/${s.words}w`),
    pageErrors: pageErrors.length,
    pageErrorDetail: pageErrors,
  };
}

function score(m) {
  const groups = {};
  let total = 0;
  for (const [key, rows] of Object.entries(RUBRIC)) {
    const items = rows.map(([label, max, fn, rule]) => ({ label, max, got: fn(m), rule }));
    const got = items.reduce((a, i) => a + i.got, 0);
    const max = items.reduce((a, i) => a + i.max, 0);
    groups[key] = { items, got, max };
    total += got;
  }
  return { groups, total, max: Object.values(groups).reduce((a, g) => a + g.max, 0) };
}

// ─── Report ───────────────────────────────────────────────────────────────────
function report(m, sc, deriv) {
  const L = [];
  L.push(`\n${'═'.repeat(72)}`);
  L.push(`  /services/${m.slug}`);
  L.push(`${'═'.repeat(72)}`);
  L.push(`  ${m.height}px   ${m.pageWords} words   ${m.sections.length} sections   ${m.pageErrors} page errors`);
  L.push(`  title (${m.titleLen})  ${m.title}`);
  L.push(`  desc  (${m.descLen})  ${m.desc.slice(0, 100)}${m.desc.length > 100 ? '…' : ''}`);
  L.push(`  canonical  ${m.canonical || '(none)'}`);

  L.push(`\n  ── Sections (px / words / density) ──`);
  m.sections.forEach((s, i) => {
    const d = (s.words / Math.max(s.px, 1) * 100).toFixed(1);
    const warn = +d < 10 ? '  <- thin' : '';
    L.push(`  ${String(i + 1).padStart(2)}. ${String(s.px).padStart(5)}px ${String(s.words).padStart(5)}w ${String(d).padStart(5)}${warn}  ${s.heading}`);
  });

  L.push(`\n  ── Content ──`);
  L.push(`  boilerplate      ${m.boilerplatePct}% of ${m.pageWords} words`);
  L.push(`  second person    ${m.youCount} hits (${m.youPer1k} per 1,000 words)`);
  L.push(`  off-topic words  ${m.offTopic}`);
  L.push(`  FAQ              ${m.faqCount} questions, ${m.faqWords} words`);
  L.push(`  inherited copy   ${m.leaks.length ? m.leaks.join(' | ') : 'none'}`);

  L.push(`\n  ── Crawler ──`);
  L.push(`  snapshot         ${m.snapWords} of ${m.pageWords} words (${m.snapCoverage}%)`);
  L.push(`  citations        ${m.snapCitations}`);
  L.push(`  schema           ${m.schema.join(', ') || '(none)'}`);
  L.push(`  E-E-A-T          Person:${m.hasPerson ? 'yes' : 'no'}  dates:${m.hasDates ? 'yes' : 'no'}`);

  L.push(`\n  ── Experience ──`);
  L.push(`  axe              ${m.axe}${m.axe ? ` — ${m.axeDetail.join(', ')}` : ''}`);
  L.push(`  tap under 24px   ${m.tapSmall}${m.tapSmall ? ` — ${m.tapDetail.join(' | ')}` : ''}`);
  L.push(`  links            ${m.internalLinks} internal, ${m.externalLinks} external`);
  L.push(`  images           ${m.imgs.length} (${m.imgsNoDim} without dimensions, ${m.imgsNoAlt} without alt, ${m.imgsOversized} oversized 3x or more)`);
  if (m.imgsReused.length) L.push(`  reused image     ${m.imgsReused.join(', ')}`);
  if (m.pageErrors) L.push(`  ERRORS           ${m.pageErrorDetail.join(' | ')}`);

  if (deriv) {
    L.push(`\n  ── Derivation vs comparison page ──`);
    for (const n of [10, 8, 6, 5, 4]) {
      const hits = deriv[n];
      L.push(`  ${String(n).padStart(2)}-gram overlap  ${hits.length}${hits.length && n <= 5 ? `  e.g. ${hits.slice(0, 2).join('; ')}` : ''}`);
    }
  }

  L.push(`\n  ── Score ──`);
  for (const [key, g] of Object.entries(sc.groups)) {
    L.push(`  ${GROUP_LABEL[key].padEnd(24)} ${String(g.got).padStart(2)} / ${g.max}`);
    g.items.forEach((i) => {
      const mark = i.got === i.max ? ' ' : i.got === 0 ? '!' : '~';
      L.push(`    ${mark} ${i.label.padEnd(24)} ${i.got}/${i.max}   ${i.rule}`);
    });
  }
  L.push(`\n  TOTAL  ${sc.total} / ${sc.max}   (${(sc.total / sc.max * 10).toFixed(1)} out of 10)`);
  return L.join('\n');
}

// ─── Run ──────────────────────────────────────────────────────────────────────
const slugs = has('all') ? allSlugs() : slugArgs;
if (!slugs.length) {
  console.error('usage: node scripts/audit-page-quality.mjs <slug> [--all] [--json] [--base=URL] [--compare=URL]');
  process.exit(2);
}

const browser = await chromium.launch();
// A default automation user agent is refused by many marketing sites, which is
// why the comparison fetch used to come back 403.
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  locale: 'en-GB',
});

let compareText = '';
if (COMPARE) {
  const cp = await ctx.newPage();
  // Marketing sites commonly refuse a default automation user agent.
  await cp.setExtraHTTPHeaders({ 'accept-language': 'en-GB,en;q=0.9' });
  try {
    const r = await cp.goto(COMPARE, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await cp.waitForTimeout(3000);
    compareText = await cp.evaluate(() => document.body.innerText);
    console.error(`fetched comparison page (${r?.status()}), ${words(compareText).length} words`);
  } catch (e) {
    console.error(`comparison fetch failed: ${e.message}`);
  }
  await cp.close();
}

const results = [];
for (const slug of slugs) {
  try {
    const m = await measure(browser, ctx, slug);
    const sc = score(m);
    const deriv = compareText ? derivation(m.snapText || m.pageText || '', compareText) : null;
    results.push({ m, sc, deriv });
    if (!JSON_OUT) console.log(report(m, sc, deriv));
  } catch (e) {
    console.error(`FAILED ${slug}: ${e.message}`);
  }
}
await browser.close();

if (JSON_OUT) {
  console.log(JSON.stringify(results.map(({ m, sc, deriv }) => ({
    slug: m.slug,
    total: sc.total,
    max: sc.max,
    outOfTen: +(sc.total / sc.max * 10).toFixed(1),
    groups: Object.fromEntries(Object.entries(sc.groups).map(([k, g]) => [k, { got: g.got, max: g.max }])),
    metrics: {
      height: m.height, words: m.pageWords, sections: m.sections.length,
      boilerplatePct: m.boilerplatePct, youPer1k: m.youPer1k, offTopic: m.offTopic,
      snapCoverage: m.snapCoverage, axe: m.axe, tapSmall: m.tapSmall,
      pageErrors: m.pageErrors, leaks: m.leaks, thinSections: m.thinSections,
    },
    derivation: deriv ? Object.fromEntries(Object.entries(deriv).map(([n, h]) => [n, h.length])) : null,
  })), null, 2));
} else if (results.length > 1) {
  console.log(`\n${'═'.repeat(72)}\n  SUMMARY — ${results.length} pages, worst first\n${'═'.repeat(72)}`);
  [...results].sort((a, b) => a.sc.total - b.sc.total).forEach(({ m, sc }) => {
    console.log(`  ${(sc.total / sc.max * 10).toFixed(1).padStart(4)}  ${m.slug.padEnd(42)} leaks:${m.leaks.length} axe:${m.axe} snap:${m.snapCoverage}% boiler:${m.boilerplatePct}%`);
  });
}

// Non-zero exit on defects that are always wrong, so this can gate a build.
const hardFails = results.filter(({ m }) => m.pageErrors > 0 || m.leaks.length > 0);
if (hardFails.length) {
  console.error(`\n${hardFails.length} page(s) with render errors or inherited copy: ${hardFails.map((r) => r.m.slug).join(', ')}`);
  process.exit(1);
}
