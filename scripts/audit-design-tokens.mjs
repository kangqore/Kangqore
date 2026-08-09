#!/usr/bin/env node
// ─── Design Token Audit (marketing service pages) ──────────────────────────────
// Two rules that kept drifting because nothing enforced them.
//
//   Rule 1 — type floor. The services tree had 14 distinct arbitrary font sizes
//            in simultaneous use: 10px x466, 15px x232, 9px x67, 17px x41,
//            7px x25, 8px x14, 13px x9, 9.5px, 7.5px … with no ratio governing
//            them, so nothing on a page had a reliable visual rank. 574 of
//            those uses were below 11px, which is where labels stop being
//            readable at arm's length regardless of contrast.
//
//            Sizes are now 11 / 12 / 14 / 16 / 20 / 24 / 32 / 48 / 64, matching
//            the svc-* scale in tailwind.config.js.
//
//   Rule 2 — section rhythm. Section padding was py-32 x7, py-24 x7, py-20 x2
//            and a single py-28. One value appearing once is an accident, not a
//            decision, and section boundaries stop being legible when the gaps
//            carry no meaning. Allowed: py-32 / py-24 / py-16 (128 / 96 / 64).
//
// Scope is the marketing services tree. src/os/** and the OS dashboard use the
// separate os-* scale and are deliberately excluded.
//
// Usage:  node scripts/audit-design-tokens.mjs
// Exit:   0 clean, 1 violations found, 2 could not run
// ────────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const SRC = path.join(repoRoot, 'frontend', 'src');

const SCALE = [11, 12, 14, 16, 20, 24, 32, 48, 64];
const TYPE_FLOOR = 11;
const ALLOWED_SECTION_PADDING = ['py-32', 'py-24', 'py-16'];

// Rule 3 — text opacity floor. White text composited on black:
//   white/40 -> #666666 = 3.66:1  FAIL      white/50 -> #7f7f7f = 5.28:1  PASS
//   white/45 -> #727272 = 4.41:1  FAIL      white/60 -> #999999 = 7.37:1  PASS
// /40 was the secondary body colour and had never passed AA; it accounted for
// 28 of 28 settled contrast failures on /services/agentic-ai. Only `text-`
// utilities are constrained — border-/bg-/via-white/40 carry no contrast duty.
// Banned because each was measured failing as real text, not assumed:
//   /18 x2   label "DESIGN APPROACH PRINCIPLES"        /25 x10  /30 x7
//   /35 x18  body copy and lists in ProductStrategyBIDS  /40 x115 /45 x19
// On black these land between 2.0:1 and 4.4:1, under the 4.5 AA floor. Several
// only brighten on hover, which does not help — WCAG judges the resting state.
//
// Deliberately NOT banned: /5, /10, /15 and /20 are icons (ChevronDown,
// ArrowRight, member.icon) and bullet separators. Those are non-text, carry no
// contrast duty at 1.4.3, and banning them would flag deliberate decoration.
// The opacity value alone does not separate the two cases, so this list is
// per-token evidence rather than a floor.
const BANNED_TEXT_OPACITY = [18, 25, 30, 35, 40, 45];
const TEXT_OPACITY_RX = /text-white\/(\d{1,3})\b/g;

// Responsive prefixes are fine — py-16 md:py-24 is one rhythm expressed twice.
const SECTION_RX = /<section[^>]*className=(?:"|`)([^"`]*)/g;
const PY_RX = /(?:^|\s|:)(py-\d+)/g;
const TEXT_RX = /text-\[([\d.]+)px\]/g;

const inServicesTree = (rel) => rel.split(path.sep).includes('services');

// Rule 2 is scoped to the shared template chain — the components that render
// all 62 template-driven service pages, where a rhythm is actually shared and
// therefore enforceable. The per-service custom section files are independent
// designs carrying 117 further off-rhythm paddings, many of them legitimate
// responsive pairs (py-20 lg:py-28). Sweeping those is a visual decision per
// page, not a lint fix, so they are out of scope rather than silently passed.
const SHARED_TEMPLATE = [
  path.join('components', 'services', 'shared'),
  path.join('components', 'services', 'cognition', 'AICustomSections.jsx'),
];
const inSharedTemplate = (rel) => SHARED_TEMPLATE.some((p) => rel.includes(p));

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'build', 'dist'].includes(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (/\.(jsx|tsx)$/.test(e.name)) out.push(full);
  }
  return out;
}

const lineOf = (src, i) => src.slice(0, i).split('\n').length;

if (!fs.existsSync(SRC)) {
  console.error(`ERROR: source directory not found: ${SRC}`);
  process.exit(2);
}

const files = walk(SRC).filter((f) => inServicesTree(path.relative(SRC, f)));
const typeHits = [];
const padHits = [];
const opacityHits = [];

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const rel = path.relative(repoRoot, file);

  for (const m of src.matchAll(TEXT_RX)) {
    const px = Number.parseFloat(m[1]);
    if (px < TYPE_FLOOR) {
      typeHits.push({ rel, line: lineOf(src, m.index), px, why: `below the ${TYPE_FLOOR}px floor` });
    } else if (!SCALE.includes(px)) {
      typeHits.push({ rel, line: lineOf(src, m.index), px, why: 'not on the svc-* scale' });
    }
  }

  for (const m of src.matchAll(TEXT_OPACITY_RX)) {
    const pct = Number.parseInt(m[1], 10);
    if (BANNED_TEXT_OPACITY.includes(pct)) {
      opacityHits.push({ rel, line: lineOf(src, m.index), cls: m[0], pct });
    }
  }

  if (!inSharedTemplate(rel)) continue;
  for (const s of src.matchAll(SECTION_RX)) {
    for (const p of s[1].matchAll(PY_RX)) {
      if (!ALLOWED_SECTION_PADDING.includes(p[1])) {
        padHits.push({ rel, line: lineOf(src, s.index), cls: p[1] });
      }
    }
  }
}

let failed = false;

if (typeHits.length) {
  failed = true;
  console.error(`\nRule 1 — type scale: ${typeHits.length} off-scale font size(s).`);
  console.error(`  Allowed: ${SCALE.join(' / ')}px. Prefer the svc-* tokens in tailwind.config.js.\n`);
  for (const h of typeHits.slice(0, 25)) {
    console.error(`    ${h.rel}:${h.line}  text-[${h.px}px] — ${h.why}`);
  }
  if (typeHits.length > 25) console.error(`    … and ${typeHits.length - 25} more`);
} else {
  console.log(`type scale: clean — ${files.length} files, every size on the ${SCALE.length}-step scale`);
}

if (padHits.length) {
  failed = true;
  console.error(`\nRule 2 — section rhythm: ${padHits.length} off-rhythm section padding(s).`);
  console.error(`  Allowed: ${ALLOWED_SECTION_PADDING.join(' / ')} (128 / 96 / 64px).\n`);
  for (const h of padHits.slice(0, 25)) {
    console.error(`    ${h.rel}:${h.line}  ${h.cls}`);
  }
  if (padHits.length > 25) console.error(`    … and ${padHits.length - 25} more`);
} else {
  console.log('section rhythm: clean — shared template on 128 / 96 / 64');
}

if (opacityHits.length) {
  failed = true;
  console.error(`\nRule 3 — text contrast: ${opacityHits.length} banned white-text token(s).`);
  console.error('  On black, text-white/40 is 3.66:1 and /45 is 4.41:1 — both below WCAG AA.\n');
  for (const h of opacityHits.slice(0, 25)) console.error(`    ${h.rel}:${h.line}  ${h.cls}`);
  if (opacityHits.length > 25) console.error(`    … and ${opacityHits.length - 25} more`);
} else {
  console.log(`text contrast: clean — no text-white/${BANNED_TEXT_OPACITY.join(' or /')} in the services tree`);
}

if (failed) {
  console.error('\ndesign tokens FAILED');
  process.exit(1);
}
console.log('\ndesign tokens pass');
