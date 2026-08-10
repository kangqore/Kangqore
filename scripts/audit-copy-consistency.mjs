#!/usr/bin/env node
// ─── Copy Consistency Audit ────────────────────────────────────────────────────
// Two editorial rules that kept regressing because nothing enforced them.
//
//   Rule 1 — spelling convention. The public surface is US English. Service
//            slugs, canonical URLs, JSON-LD @ids, the sitemap and the 62-route
//            manifest all contain "modernization", so US is the anchor we
//            cannot cheaply move. Before this gate the data had eight US/UK
//            pairs in simultaneous use (optimization 26 / optimisation 23,
//            organization 15 / organisation 20, …) — not drift from a standard,
//            but the absence of one.
//
//   Rule 2 — numeric claims. Every percentage in service data must be either
//            labelled `illustrative: true`, or listed in SOURCED_CLAIMS with a
//            justification. Before this gate there were 27 real claims and 2
//            labels, including a "99% automated test coverage" line that read
//            as a delivery guarantee and contradicted the same page's argument
//            that the bar is behavioural equivalence, not a coverage number.
//
// Scope is the public marketing surface only (data/, components/, pages/).
// src/os/** is internal product UI and is deliberately excluded.
//
// Usage:  node scripts/audit-copy-consistency.mjs
// Exit:   0 clean, 1 violations found, 2 could not run
// ────────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const SRC = path.join(repoRoot, 'frontend', 'src');

// ─── Rule 1: UK forms that must not appear ────────────────────────────────────
const UK_FORMS = [
  'modernisation', 'modernisations', 'modernise', 'modernised', 'modernising',
  'optimisation', 'optimisations', 'optimise', 'optimises', 'optimised', 'optimising',
  'organisation', 'organisations', 'organisational', 'organise', 'organised', 'organising',
  'prioritise', 'prioritised', 'prioritising', 'prioritisation',
  'parallelise', 'parallelised', 'specialise', 'specialised', 'specialisation', 'specialisations',
  'analyse', 'analysed', 'analysing',
  'behaviour', 'behaviours', 'behavioural',
  'favour', 'favoured', 'favours',
  'programme', 'programmes', 'licence', 'defence', 'catalogue', 'catalogues',
  'utilise', 'utilised', 'utilising', 'utilisation',
  'recognise', 'recognised', 'realise', 'realised',
  'customise', 'customised', 'standardise', 'standardised', 'standardisation',
  'minimise', 'minimised', 'maximise', 'maximises', 'maximised',
  'summarise', 'summarised', 'categorise', 'categorised',
  'normalise', 'normalised', 'initialise', 'initialised',
  'visualise', 'visualised', 'visualisation', 'visualisations',
  'centralise', 'centralised', 'characterisation', 'characterise', 'characterised',

  // The list above is entirely -ise/-our. That is one family of British forms,
  // and the gate reported "0 UK forms" across 553 files while `artefacts`
  // rendered in the MLOps capability copy. These are the families it could not
  // see: -re, doubled-l inflections, and the individual words that do not
  // pattern-match anything.
  'artefact', 'artefacts',
  'centre', 'centres', 'centred', 'centring', 'metre', 'metres', 'fibre', 'fibres',
  'theatre', 'theatres', 'litre', 'litres',
  'labelled', 'labelling', 'travelled', 'travelling', 'cancelled', 'cancelling',
  'modelled', 'modelling', 'signalled', 'signalling', 'fuelled', 'levelled',
  'enrol', 'enrols', 'enrolment', 'enrolments', 'instalment', 'instalments',
  'judgement', 'judgements', 'acknowledgement', 'acknowledgements',
  'ageing', 'grey', 'greyed', 'storey', 'storeys', 'sceptic', 'sceptical', 'sceptics',
  'aluminium',
  'practise', 'practised', 'practising', 'aeroplane', 'kerb', 'cheque', 'cheques',
];
// Deliberately NOT listed: `dialogue` and `analogue`. Both are standard in US
// prose for a conversation and a continuous signal — only the UI sense ("dialog
// box") is reliably spelled short in US English, and the gate cannot tell the
// senses apart. Flagging them produces false positives on ordinary copy.

// Words that look British but are not ours to change. `createAnalyser` is the
// Web Audio API's actual spelling — renaming it breaks the voice assistant.
const SPELLING_EXCEPTIONS = [
  { pattern: /\banalyser(Ref)?\b/gi, why: 'Web Audio API spec spelling (createAnalyser)' },
  // Prisma enum member. The frontend compares against the exact string the API
  // returns, so respelling it here silently breaks every status filter and
  // badge colour that keys off it.
  { pattern: /\bCANCELLED\b/g, why: 'ConsultationStatus / MeetingStatus enum value in prisma/schema.prisma' },
  // The lowercase form appears in the same role — status literals sent to and
  // matched against the API, not prose shown to a reader.
  { pattern: /'(all|pending|contacted|scheduled|completed|cancelled)'/g, why: 'consultation status literals matched against the API' },
  // Asset filenames and a CSS class. Renaming the files is a separate change
  // with its own risk, and the class name is not read by anyone.
  { pattern: /[\w-]*-grey\.(png|jpg|svg|webp|avif)/g, why: 'shipped asset filenames' },
  { pattern: /\b(vs-dot-grey|preGreyed)\b/g, why: 'CSS class and prop identifiers, not copy' },
];

// ─── Rule 2: percentage claims allowed without an `illustrative` flag ─────────
// Each entry must carry a reason. Adding one is a deliberate editorial act:
// you are asserting the number is either sourced or is a stated internal
// standard rather than a claimed client outcome.
const SOURCED_CLAIMS = [
  {
    match: 'Generated suites held to a 99% coverage floor before equivalence testing begins.',
    why: 'Stated internal process gate, not a claimed outcome. Describes what we hold generated suites to before equivalence testing, which is a policy we set rather than a result we report.',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const isPublicSurface = (rel) =>
  /^(data|components|pages)[/\\]/.test(rel) && !rel.split(path.sep).includes('os');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'build', 'dist'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const lineOf = (src, index) => src.slice(0, index).split('\n').length;

// ─── Run ──────────────────────────────────────────────────────────────────────
if (!fs.existsSync(SRC)) {
  console.error(`ERROR: source directory not found: ${SRC}`);
  process.exit(2);
}

const files = walk(SRC).filter((f) => isPublicSurface(path.relative(SRC, f)));
const spellingHits = [];
const claimHits = [];

const UK_RX = new RegExp(`\\b(${UK_FORMS.join('|')})\\b`, 'gi');

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const rel = path.relative(repoRoot, file);

  // Rule 1
  const exempt = new Set();
  for (const { pattern } of SPELLING_EXCEPTIONS) {
    for (const m of src.matchAll(pattern)) {
      for (let i = m.index; i < m.index + m[0].length; i++) exempt.add(i);
    }
  }
  for (const m of src.matchAll(UK_RX)) {
    if (exempt.has(m.index)) continue;
    spellingHits.push({ rel, line: lineOf(src, m.index), word: m[0] });
  }
}

// Rule 2 — service data only; that is where outcome claims live.
const dataFile = path.join(SRC, 'data', 'servicesData.js');
if (fs.existsSync(dataFile)) {
  const src = fs.readFileSync(dataFile, 'utf8');
  // Percentages inside Tailwind arbitrary values (max-w-[82%]) are layout, not
  // claims. This must be anchored to a utility prefix and forbid whitespace and
  // quotes inside the brackets: a bare /\[[^\]]*%[^\]]*\]/ also matches ordinary
  // JavaScript array literals, which silently exempted every claim living in
  // customFAQs: [ … ] or keyFeatures: [ … ].
  const tailwind = new Set();
  for (const m of src.matchAll(/[\w-]+-\[[^\]\s'"]*\d{1,3}%[^\]\s'"]*\]/g)) {
    for (let i = m.index; i < m.index + m[0].length; i++) tailwind.add(i);
  }

  for (const m of src.matchAll(/\d{1,3}(?:\.\d+)?%/g)) {
    if (tailwind.has(m.index)) continue;

    // Is this percentage inside an object carrying `illustrative: true`?
    const open = src.lastIndexOf('{', m.index);
    let labelled = false;
    for (let depth = 0, cursor = open; cursor > 0 && depth < 4; depth++) {
      const close = src.indexOf('}', m.index);
      if (src.slice(cursor, close === -1 ? src.length : close + 1).includes('illustrative: true')) {
        labelled = true;
        break;
      }
      cursor = src.lastIndexOf('{', cursor - 1);
    }
    if (labelled) continue;

    // Allowlisting must be scoped to the string literal the claim lives in.
    // Matching against a surrounding character window instead lets any claim
    // that merely sits *near* an allowlisted one inherit its exemption — two
    // adjacent bullets in the same array were enough to silence a new claim.
    const quote = src.lastIndexOf("'", m.index);
    let end = m.index;
    while (end < src.length) {
      end = src.indexOf("'", end + 1);
      if (end === -1) { end = src.length; break; }
      if (src[end - 1] !== '\\') break;
    }
    const literal = quote === -1 ? '' : src.slice(quote + 1, end);
    if (SOURCED_CLAIMS.some((c) => literal.trim() === c.match.trim())) continue;

    claimHits.push({
      line: lineOf(src, m.index),
      value: m[0],
      context: (literal || src.slice(m.index - 90, m.index + 90)).replace(/\s+/g, ' ').slice(0, 150),
    });
  }
}

// ─── Report ───────────────────────────────────────────────────────────────────
let failed = false;

if (spellingHits.length) {
  failed = true;
  console.error(`\nRule 1 — spelling: ${spellingHits.length} UK form(s) on the public surface.`);
  console.error('  The public surface is US English. Convert, or add a documented');
  console.error('  entry to SPELLING_EXCEPTIONS if the word is an API name.\n');
  for (const h of spellingHits.slice(0, 25)) {
    console.error(`    ${h.rel}:${h.line}  ${h.word}`);
  }
  if (spellingHits.length > 25) console.error(`    … and ${spellingHits.length - 25} more`);
} else {
  console.log(`spelling: clean — ${files.length} files, 0 UK forms`);
}

if (claimHits.length) {
  failed = true;
  console.error(`\nRule 2 — numeric claims: ${claimHits.length} unlabelled percentage claim(s).`);
  console.error('  Every percentage must be inside an object with `illustrative: true`,');
  console.error('  or listed in SOURCED_CLAIMS with a justification.\n');
  for (const h of claimHits) {
    console.error(`    servicesData.js:${h.line}  ${h.value}`);
    console.error(`      …${h.context}…`);
  }
} else {
  console.log('numeric claims: clean — every percentage is labelled or sourced');
}

if (failed) {
  console.error('\ncopy consistency FAILED');
  process.exit(1);
}
console.log('\ncopy consistency pass');
