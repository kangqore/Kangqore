---
name: service-page-audit
description: Audit, rate and fix a marketing service page under /services/*. Use when asked to review, rate, compare against a competitor, or fix leaked/generic copy on any of the 62 service pages. Encodes the conventions established across PRs #343-#411 so shipped decisions are not undone.
---

# Service Page Audit & Fix

62 service pages render from one template. This skill is the repeatable version of
a review that was rebuilt by hand four times and got several measurements wrong in
the process. Run the tool first, then work the checklist.

---

## 0 · Hard rules — read before touching anything

**Do not undo what already shipped.** Every item below was a deliberate decision.
If a fix seems to require reversing one, stop and ask.

### Platform patterns — reuse, do not rebuild

| Pattern | Where | Do not |
|---|---|---|
| `POLICY_ETHICS_STACK` — exported from `servicesData.js`. Four layers: Policy & Regulatory Controls, Responsible AI & Ethics, Risk Governance & Assurance, Human Oversight & Accountability | Adopt with `architectureNodes: POLICY_ETHICS_STACK` | Re-write these four layers inline on another service. It is deliberately shared across Intelligent Automation, Agentic AI, AI Governance, Decision Intelligence and Kangqore View so the answer cannot drift between pages |
| `DEPT_SECTION_COPY` in `getParityService` — per-department `industryHeading`, `midCta`, `closingCta`, `architectureEyebrow` | Template | Move back to per-service data, or change a department default without checking every page in that department |

### Template hooks — all opt-in, all with defaults that preserve the other 61 pages

| Hooks | Section |
|---|---|
| `architectureEyebrow` / `architectureTitle` / `architectureTitleHighlight` / `architectureLede` | Architecture |
| `capabilitiesLabel` / `capabilitiesSectionTitle` / `capabilitiesSectionHighlight` / `capabilitiesLede` | Capabilities |
| `comparisonTable.eyebrow` | Comparison |
| `outcomesEyebrow` / `outcomesHeading` / `outcomesHeadingHighlight` | Engagement outcomes (the h2 is opt-in; without it the block has no heading at all) |
| `engagementEyebrow` / `engagementHeading` / `engagementHeadingHighlight` / `engagementLede` | Five ways to start |
| `faqEyebrow` / `faqHeading` / `faqHeadingHighlight` | FAQ |
| `midCta` / `midCtaLabel` | Mid-page CTA |
| `closingCta.primaryLabel` / `.secondaryLabel` / `.proofLabel` | Closing CTA |
| `conciergeChips` / `conciergeHeading` / `conciergeIntro` | eQORE |
| `practiceLabel` / `practiceHeading` / `practiceHeadingHighlight` / `practiceLede` | Practice cluster |
| `hidePartnershipModel` / `hideBadgeStrip` | Section removal |
| `heroTitle` / `heroBadge` / `heroStripItems` | Hero |

**Never hardcode any of these back into the template.**

### Content decisions

| Decision | Do not |
|---|---|
| 8 capability areas, 51 sub-capabilities, no numbering (ai-cognitive-computing) | Re-add numbering or collapse the taxonomy |
| Titles 45-60 chars, department word dropped ("Cognition", "Foundry") | Re-add department prefixes |
| Bespoke hero SVGs on 7 slugs: `agentic-ai-led-application-modernization`, `genai-business-services`, `ai-governance`, `ai-cognitive-computing`, `mlops`, `data-science-ai`, `intelligent-automation` | Replace any with the shared agentic default |
| `whatIsPara3/4` stay in the DOM when collapsed (`grid-template-rows` + `inert`) | Re-gate behind a mount condition |
| Real `<table>` semantics + explicit ARIA on the comparison section | Return it to a `<div>` grid |
| Contextual internal links in toolchain and comparison (`row.link`, `item.link`) | Strip them |
| Accessibility landmarks on `EQoreChatbot`, `CookieConsent`, **both** `FloatingButtons` stacks, and `ServiceGlassCards` scroll region | Remove any — every page is currently axe 0 and the right-hand floating stack is easy to miss |

### Gates and tooling

| Decision | Do not |
|---|---|
| Copy gate **Rule 2b** — catches percentages split across literals (`value: '94'` + `suffix: '%'`), which Rule 2's regex cannot see | Remove or "simplify" it. Twelve services were publishing unsourced percentages this way while the gate reported clean |
| 48 metric objects across 12 services carry `illustrative: true` | Unflag any without a real source |
| Generator emits comparison, architecture, industries, outcomes, packages, closing CTA, eQORE chips + heading + intro, `heroBadge`, `midCta` | Remove emitters — coverage was 6-30 per cent before them |
| Rubric excludes bands under 250px from the thin-section check (a CTA band is sparse by design) | Confuse this with lowering the 10 w/100px threshold |
| Rubric finds the FAQ by counting question-form `h3`s, not by matching heading text | Go back to text matching — rewriting a page's FAQ heading broke its own detection |

### Standing constraints from the user

- **Do not touch images.** Not the mapping, not dimensions, not the generator manifest. Report findings, change nothing.
- The oversized logo (4500px at ~104px) and the 152KB PNG are **knowingly ignored**.
- "Shield" in breadcrumb schema is **knowingly ignored**.
- **eQORE cannot be cut.** Make it page-specific instead.
- `/services/ai-governance` is parked.
- **Illustrative metrics stay.** The user was told that disclaimed numbers read to a sophisticated buyer as "no clients", chose to keep them and fix the worst offenders, and that decision stands. Absolute claims ("100% operational reliability", "maximum operational yield") are the part to remove.
- **"Robotic Operations Center"** on intelligent-automation is Tech Mahindra's named offering. Flagged, kept as supplied, rename parked.
- E-E-A-T is blocked on a real name, title and LinkedIn. **Never invent a person.**

---

## 1 · Set up

Work in the dedicated worktree, never the main tree.

```bash
cd /Users/maheshkumar/kq-acc          # worktree, node_modules symlinked
git fetch origin && git checkout -B <branch> origin/main
```

**Two servers, two different trees:**

| | Tree | Notes |
|---|---|---|
| `:3010` | `/Users/maheshkumar/kq-acc` | the worktree — your branch |
| `:3000` | `/Users/maheshkumar/Kangqore` | another session's tree |

**When the user says "nothing changed", check which branch that tree is on before
explaining anything.** This cost three rounds in one session: `:3000` had been sitting
on `refactor/wave-6-kimmp-waanda-migration` the whole time, and the answer was assumed
to be "the PR isn't merged" when it was "that tree has never been on main".

```bash
git -C /Users/maheshkumar/Kangqore rev-parse --abbrev-ref HEAD
git -C /Users/maheshkumar/Kangqore log --oneline -1
```

If the user wants it visible on `:3000` and that tree is clean, a `git merge --ff-only`
onto the pushed branch is safe and reversible. **Never rebase or reset a tree carrying
another session's unpushed commits.** And note `cd` does not persist between Bash
calls — use `git -C <path>` or the merge lands in the wrong tree.

Confirm the server reflects your branch before trusting any measurement:

```bash
curl -s localhost:3010/src/data/servicesData.js | grep -c "<a string you just added>"
```

## 2 · Measure

```bash
node scripts/audit-page-quality.mjs <slug>
node scripts/audit-page-quality.mjs <slug> --compare=<competitor-url>
node scripts/audit-page-quality.mjs --all --json     # takes over 10 min, run backgrounded
```

Everything reported comes from the rendered page, never the data file. Exits non-zero
on render errors or inherited copy, so it can gate a build.

**Scoring is rubric-anchored** (thresholds in `RUBRIC`). Two runs agree. Do not hand
out a score that is not from the tool — an unanchored number cannot be defended when
challenged, and cannot be compared across pages or over time. A second "commercial
readiness" score was invented once and had to be withdrawn for exactly this reason.

**Known limits — do not quote these numbers without the caveat:**

- **`--base` pointing at a different tree silently mismatches the snapshot.** The tool
  fetches the page from `--base` but reads snapshot files from the local filesystem.
  Auditing `:3000` from the worktree once reported 93.5 per cent coverage that was
  really 29. There is no guard yet. **Fix this before trusting a cross-tree audit.**
- **Coverage reads about 3 points low and is noisy.** The denominator counts FAQ text
  twice — once in the FAQ section, once in the animated glass card that types it out —
  while the snapshot emits it once. Page word count swings roughly 77 words run to run
  for the same reason.
- **Boilerplate is measured against rendered `innerText`**, so it includes UI chrome.
  Comparable across pages, not to per-data-block figures from older sessions.

## 3 · Work the checklist

Cheapest lever first.

1. **Inherited copy** — any hit is a hard fail.
2. **Render errors** — hard fail. Usually a wrong data key or prop name (§5).
3. **Content fit** — does the copy belong to *this* service? Read the capability
   names, the comparison argument and the toolchain against the service name. A
   toolchain naming none of the service's own platforms is the loudest signal.
4. **FAQ depth** — 8+ questions, 3 paragraphs, real `sources`. Usually the single
   biggest scoring lever (worth up to 4 points across two groups) and the best content.
5. **Snapshot coverage** — fix in `scripts/generate-prerender.mjs`, not the React page.
6. **Boilerplate and second person** — rewrite in the page's voice. Concrete nouns
   and "you", not "enterprise-grade frameworks".
7. **Thin sections** — under 10 w/100px and over 250px tall.
8. **E-E-A-T** — blocked on the user. Ask; never invent.

## 4 · Gate, in this order

```bash
node scripts/generate-prerender.mjs
npm run audit:all          # check the exit code, do not grep for "pass"
npm run check:prerender
npm run check:sitemap
cd frontend && npm run build
```

Then **open the page in a browser.** All four have passed on a page that fell to the
error boundary rendering twelve words.

Re-run `audit-page-quality.mjs <slug>` and confirm each point moved for the reason you
expected. Spot-check three unrelated services whenever you touched the template.

Revert `shared/serviceIndex.json` if only its `generatedAt` changed.

## 5 · Traps that have actually bitten

**The template resolves content through `getParityService()`.** Most services carry a
few hundred bytes and the parity layer synthesizes the rest, keyed by `deptSlug`.
**Never conclude anything about what renders by reading `servicesData.js`.** Counting
raw keys produced two wrong answers in one session: "industryHeading leaks on zero
pages" (56) and "EXECUTION LOOP is on 3 pages" (56).

**Dual emission.** Content added to the React page must also be added to
`generate-prerender.mjs` or crawlers never see it. Grep the regenerated snapshot.

**Verify what renders, not what you wrote.** Check the collapsed default state.

**Vite misses whole-file writes.** After a scripted rewrite, `touch` and re-`curl`.

**The copy gate scans code comments.** US English only. `unauthorised` /
`authorisation` are absent from its UK list; `modelling` and `cataloguing` are caught.

**Prop names, not just data keys.** `GeminiComparisonSection` takes `comparisonTable`,
not `data`. Writing `data.eyebrow` threw and took the whole page to the error boundary
while all four gates passed.

**Data key contracts:**

| Key | Contract |
|---|---|
| `architectureNodes[].features` | Not `keyCapabilities`. Wrong name throws. |
| `architectureNodes[].icon` | Must exist in `JOURNEY_ICON_MAP` or it silently falls back to `Target`. |
| `capabilityAreas[].items` | `'Name: prose'` splits on the colon for the card front; a bare name renders fine on both front and overlay. Card front shows the first 6 only. |
| `industryUseCases[]` | `items` **or** `agents`; prefer `items`. Section renders only if the key exists. |
| `closingCta` | Whole-object override. Set `title` explicitly or the default fills it. |
| `businessMetrics[]` | Needs `illustrative: true` per metric for the disclaimer. |
| `heroTitle` | **Must not end with a period.** The template renders the last word as `{titleHighlight}.` with the period baked in — a trailing period gives "Defend..". |
| `servicePackages[]` | `tier` renders only inside the `duration` block, so `tier` without `duration` is invisible. |

**Editing a service block with a script.** `capabilityAreas` is often the *last* key,
and blocks are followed by section banner comments — so "replace from key to end of
block" drops the object's closing brace, and `rstrip()` does not land on `},`. Locate
`blk.rfind('\n  },')` explicitly and assert the result still closes the object.

**Contrast measurement.** Walk up the DOM for the first non-transparent background and
composite the alpha. Measuring against `document.body` invents failures — that produced
a bogus "9 failing footer nodes" when the real count was 1.

## 6 · Ship

One branch, one commit, pushed from the worktree. `gh` is not installed — hand the user
the compare URL, and **lead with the URL where the change is actually visible**, not the
branch name. Saying "applied" about work on an unmerged branch the user cannot see has
caused repeated confusion.

State plainly in the commit message which changes are template-wide and which are
page-scoped.

## 7 · Open items, not yet fixed

- **The parity-layer snapshot gap.** `generate-prerender.mjs` reads raw service data
  while the page renders through `getParityService()`, so ~55 thin services emit almost
  nothing — `salesforce` at 2 per cent, `it-security-services` at 6, median fleet
  coverage 2.9. Largest technical defect on the site. Fix by extracting
  `getParityService` into a module both the component and the generator import.
- **110 fabricated case cards.** The parity `outcomeCard` / `outcomeCard2` defaults at
  `UniversalServicePage.jsx:700-715` invent a client descriptor ("Global Enterprise
  Organization") and assert "100% operational reliability" / "maximum operational
  yield" on all 55 services lacking their own. The user has no real clients yet.
- **57 duplicate h1s** — every service but a handful renders
  "&lt;Name&gt; Solutions at Enterprise Scale."
- **RPA, BPM and DPA** still share ~78 per cent of their content with each other.
  Intelligent Automation was differentiated out of that cluster; the other three
  were not. Consolidate-or-differentiate is still an open commercial decision.
- **No analytics installed.** Nothing shipped is measurable.
