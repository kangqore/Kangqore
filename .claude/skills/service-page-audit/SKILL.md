---
name: service-page-audit
description: Audit, rate and fix a marketing service page under /services/*. Use when asked to review, rate, compare against a competitor, or fix leaked/generic copy on any of the 62 service pages. Encodes the conventions established across PRs #343-#368 so shipped decisions are not undone.
---

# Service Page Audit & Fix

62 service pages render from one template. This skill is the repeatable version of
a review that was rebuilt by hand four times and got two measurements wrong in the
process. Run the tool first, then work the checklist.

---

## 0 · Hard rules — read before touching anything

**Do not undo what already shipped.** Every item below was a deliberate decision.
If a fix seems to require reversing one, stop and ask.

| Decision | PR | Do not |
|---|---|---|
| 8 capability areas, 51 sub-capabilities, **no numbering** on cards (ai-cognitive-computing) | #350 | Re-add numbering or collapse the taxonomy |
| `hidePartnershipModel` on pages where it was removed | #353 | Re-enable the Partnership Model there |
| Titles trimmed to 45-60 chars, department word dropped where it cost length | #354 | Re-add "Cognition" style prefixes |
| Bespoke hero SVG: `PERCEIVE > REPRESENT > REASON > EVIDENCE` | #354 | Replace with the shared agentic diagram |
| All `businessMetrics` carry `illustrative: true` + visible disclaimer | #355 | Present a number as a client result without a source |
| Opt-in hooks: `architectureEyebrow` / `architectureTitle` / `architectureTitleHighlight` / `midCtaLabel` / `closingCta.primaryLabel` / `closingCta.secondaryLabel` / `practiceLede` | #356 | Hardcode these back into the template |
| Two-line hero statement | #357 | Expand it back to a paragraph |
| eQORE `conciergeChips` / `conciergeHeading` / `conciergeIntro`; `ConciergeSection` takes `heading` + `intro` props; generator emits chips | #365 | Remove the eQORE section (see constraints) |
| `DEPT_SECTION_COPY` in `getParityService`; agentic services pinned in data | #368 | Move these back to per-service data, or change a department default without checking all pages in it |
| Real `<table>` semantics + explicit ARIA on the comparison section | #343 | Return it to a `<div>` grid |
| Contextual internal links in toolchain and comparison | #346 | Strip `row.link` / `item.link` |
| `whatIsPara3/4` stay in the DOM when collapsed (`grid-template-rows` + `inert`) | #348 | Re-gate them behind a mount condition |

**Standing constraints from the user:**

- **Do not touch images.** Not the mapping, not dimensions, not the generator manifest. Report image findings, change nothing.
- The oversized logo (4500px rendered at ~104px) and the 152KB PNG are **knowingly ignored**.
- "Shield" appearing in breadcrumb schema is **knowingly ignored**.
- **eQORE cannot be cut.** It is integral. Make it page-specific instead.
- `/services/ai-governance` is parked.
- `/services/intelligent-automation` is blocked on a taxonomy decision (it is ~95 per cent duplicate of business-process-management).

---

## 1 · Set up

Work in the dedicated worktree, never the main tree — another session edits the
main tree and uncommitted work there has been silently overwritten.

```bash
cd /Users/maheshkumar/kq-acc          # detached worktree, node_modules symlinked
git fetch origin && git checkout -B <branch> origin/main
# dev server on :3010 (main tree runs :3000 and is often a commit behind)
```

Confirm the server reflects the branch before trusting any measurement:

```bash
curl -s localhost:3010/src/data/servicesData.js | grep -c "<a string you just added>"
```

## 2 · Measure

```bash
node scripts/audit-page-quality.mjs <slug>
node scripts/audit-page-quality.mjs <slug> --compare=<competitor-url>
node scripts/audit-page-quality.mjs --all            # fleet ranking, worst first
node scripts/audit-page-quality.mjs --all --json     # machine-readable
```

Everything it reports comes from the rendered page, never from the data file.
It exits non-zero on render errors or inherited copy, so it can gate a build.

**Scoring is rubric-anchored** (thresholds live in `RUBRIC` in the script). Two runs
on the same page always agree. Do not hand out a score that is not from the tool —
an unanchored number cannot be defended when challenged, and cannot be compared
across pages or over time.

**Calibration caveat:** boilerplate percentage is measured against rendered
`innerText`, so it includes UI chrome and is *not* comparable to per-data-block
figures quoted in older sessions. It is comparable across pages, because every page
is measured the same way.

## 3 · Work the checklist

The tool flags what is wrong. This is the order to fix it, cheapest lever first.

1. **Inherited copy** — any hit is a hard fail. Check whether the page needs its own
   value or whether the department default in `DEPT_SECTION_COPY` should change.
2. **Render errors** — hard fail. Usually a wrong data key (see §5).
3. **Snapshot coverage** — anything under 85 per cent means a crawler is missing
   content. Fix in `scripts/generate-prerender.mjs`, not the React page.
4. **Content fit** — does the copy belong to *this* service? Check off-topic word
   count, and read the capability names against the service name.
5. **Boilerplate and second person** — rewrite the offending block in the page's
   voice. Concrete nouns and "you", not "enterprise-grade frameworks".
6. **Thin sections** — under 10 words per 100px. Either give the section content or
   cut it.
7. **FAQ depth** — 8+ questions, 3 paragraphs each, with real `sources`.
8. **E-E-A-T** — blocked on a real name, title and LinkedIn from the user. Ask; do
   not invent one.

## 4 · Gate, in this order

```bash
node scripts/generate-prerender.mjs
npm run audit:all          # six gates — check the exit code, do not grep for "pass"
npm run check:prerender
npm run check:sitemap
cd frontend && npm run build
```

Then **open the page in a browser.** `audit:all`, `check:prerender` and `npm run build`
have all passed on a page that fell to the error boundary and rendered nothing.

Finally re-run `audit-page-quality.mjs <slug>` and confirm the score moved for the
reason you expected.

Revert `shared/serviceIndex.json` if only its `generatedAt` changed — it churns on
every regeneration and conflicts across PRs.

## 5 · Traps that have actually bitten

**The template resolves content through `getParityService()`.** Most services carry a
few hundred bytes of data and the parity layer synthesizes the rest, keyed by
`deptSlug`. **Never conclude anything about what renders by reading `servicesData.js`.**
Counting raw keys produced two wrong answers in one session: "industryHeading leaks on
zero pages" (it leaked on 56) and "EXECUTION LOOP is on 3 pages" (it was on 56).

**Dual emission.** Content added to the React page must also be added to
`scripts/generate-prerender.mjs` or crawlers never see it. Grep the regenerated
snapshot for the new string.

**Verify what renders, not what you wrote.** Check the collapsed default state, not
the expanded one. `whatIsPara4` shipped in a PR and was never in the DOM.

**Vite misses whole-file writes.** After a scripted rewrite of `servicesData.js`,
`touch` the file and re-`curl` it before measuring.

**The copy gate scans code comments.** US English only; every percentage needs
`illustrative: true` or an entry in `SOURCED_CLAIMS`. Simplest fix is to spell the
number out in prose. `unauthorised` / `authorisation` are absent from its UK list and
slip through — do not rely on it for those.

**Data key contracts:**

| Key | Contract |
|---|---|
| `architectureNodes[].features` | Not `keyCapabilities`. Wrong name throws and the whole page falls to the error boundary. |
| `capabilityAreas[].items` | Must be `'Name: prose'` — the card front splits on the colon. |
| `industryUseCases[]` | Uses `items` **or** `agents`; the industry section only renders if this key exists. |
| `closingCta` | Whole-object override. Set `title` explicitly or the template default fills it in. |
| `businessMetrics[]` | Needs `illustrative: true` per metric to render the disclaimer. |

**Contrast measurement.** Walk up the DOM for the first non-transparent background and
composite the alpha. Measuring against `document.body` reports white-on-white and
invents failures — that produced a bogus "9 failing footer nodes" (the real count was 1).

## 6 · Ship

One branch, one commit, pushed from the worktree. `gh` is not installed — hand the user
the compare URL. State plainly in the commit message which changes are template-wide
and which are page-scoped, so a reviewer is not misled into thinking a shared-component
change is local to one service.
