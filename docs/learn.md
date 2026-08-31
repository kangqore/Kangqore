# Learnings

The core learning file of the three Kangqore operating doctrines — the
**Closed-Loop Execution System** (`.claude/skills/kangqoreexecution/`), the
**Execution Protocol** (`.claude/skills/kangqoreexecutionmode/`), and the
**Completion Protocol** (`.claude/skills/kangqorecompletion/`). Every loop's
learning step writes here.

A mistake should not disappear after it is fixed — it should become organizational
knowledge. Step 9 of the loop records the learning here; step 10 changes the system
so the mistake is less likely to recur, and links back to the entry.

**How to use this file.** Append an entry whenever a cycle surfaces something worth
keeping: a mistake, a wrong assumption, a repeated problem, a successful pattern, or
a discovery. Keep entries short and specific. When step 10 acts on an entry, add the
**System change** line pointing at what was updated (an SOP, a skill, a checklist,
a gate, a memory file). Entries are permanent — this file is knowledge, not a
running TODO. Newest first.

Severity of the underlying issue: **P1** = caused or nearly caused user-visible
breakage · **P2** = real cost in time or trust · **P3** = friction / tidy-up.

---

## Entry format

```
## YYYY-MM-DD — <short title>  (P1|P2|P3)

**Context:** what was being worked on.
**What happened:** the mistake, assumption, or discovery — concretely.
**Why:** root cause, not just the symptom.
**Learning:** the general rule to carry forward.
**System change:** what was updated in step 10 so this is less likely to recur
(file / SOP / skill / gate / memory), or "none yet — <reason>".
```

---

<!-- Append entries below this line, newest first. -->

## 2026-08-31 — Service probes proved nothing about the screens  (P1)

**Context:** rebuilding the Work OS on the ontology, then adding dashboards.
**What happened:** four Work OS pages — Timeline, Workload, Goals, Portfolio —
crashed with "data.filter is not a function" while thirteen probes stayed green
and every endpoint returned 200. The rebuilt endpoints return an envelope
(`{ items }`, `{ buckets }`) and the pages still called array methods on the
response. I had corrected `items` and `board` at the time and never checked the
rest.
**Why:** the probes assert what a service RETURNS. Nothing asserted what a page
READS. A 200 with the wrong shape passes every check that exists.
**Learning:** an endpoint contract has two sides, and only one of them was
tested. When a response shape changes, the consumers are part of the change —
and shallow shape assertions catch this where richer behavioural tests do not.
**System change:** added `backend/src/kangqore-view/eof/scripts/api-contract-e2e.ts`,
which asserts bare-array-versus-envelope and the specific field names each
screen indexes.

## 2026-08-31 — The error display was the thing that crashed  (P1)

**Context:** the dashboard showed "Objects are not valid as a React child
(found: object with keys {message, stack})".
**What happened:** the backend has two error shapes — route handlers return
`{ error: "message" }`, the global express handler returns
`{ error: { message, stack } }` in development. Every error display read
`response.data.error` and rendered it, so a failed request produced a crash
screen instead of the failure.
**Why:** I wrote the extraction once and copied it into six components without
checking what the backend actually emits on the error path. The failure was
invisible in testing because my requests were succeeding.
**Learning:** error-handling code needs to be tested against a real error, not
assumed. When display code crashes it replaces the real problem with a worse
one.
**System change:** added `frontend/src/os/lib/errorMessage.ts`, which handles
every shape and can only return a string; all six call sites rewired.

## 2026-08-31 — Assertions pinned to magic numbers drift silently  (P2)

**Context:** inserting `Portfolio` at tier 4 shifted every tier below it.
**What happened:** a probe read `Project now occupies tier 5`. After the insert
Project is 6, so the assertion tested **Program** while still reading as though
it tested Project. A second assertion used `tiers.includes(5)` as a proxy for a
gap that no longer existed.
**Why:** both encoded a position as a literal rather than a relationship.
**Learning:** assert the relationship, not the number — "Project sits directly
below Program" survives a renumber; "tier 5" quietly starts testing something
else.
**System change:** both assertions rewritten positionally in
`introspection-e2e.ts`.

## 2026-08-31 — Vacuous green: every() over an empty array  (P2)

**Context:** the dashboard probe asserted that every empty panel explains itself.
**What happened:** no panels were empty, so `empties.every(...)` passed
trivially and reported a green check for behaviour never exercised.
**Why:** the assertion depended on the fixture happening to contain the case.
**Learning:** a test for a condition must force the condition. If a check can
pass because nothing matched, it is not a check.
**System change:** `dashboard-e2e.ts` now creates a goal with nothing attached to
force the empty path.

## 2026-08-31 — Endpoint 200s are not page verification  (P1)

**Context:** the Outcome Risk page shipped in #467 and was blank on direct load
for days.
**What happened:** I verified its API exhaustively and never once loaded it in a
browser. The crash was a hooks-order violation in `eROOT`, latent on all 106
`/kangqore-view` routes.
**Why:** I treated "the endpoint returns correct data" as evidence the screen
works.
**Learning:** frontend work is verified by loading the page. A browser sweep of
every tab in a module takes two minutes and found four crashes that thirteen
probes and every gate missed.
**System change:** added `frontend/e2e/work-os.spec.ts` — every Work OS tab plus
Outcome Risk, asserting no uncaught error and no error boundary, running in the
existing `os-smoke` CI job.

**Follow-on learning:** the first version of that test was worthless, and I only
found out by deliberately reintroducing a crash and watching it stay green.
Without a backend the pages sit in a loading state, so the data path never runs.
It now serves captured fixtures, and was re-verified by reproducing the original
failure — "items.map is not a function" — before being committed. **A test that
has not been seen to fail has not been tested.**

