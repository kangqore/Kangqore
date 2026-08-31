---
name: kangqorecompletion
description: The Kangqore Completion Protocol — the mandatory verification cycle run BEFORE declaring any task, feature, fix, or piece of work DONE. Invoke after execution finishes and whenever the user types /kangqorecompletion, or is about to be told something is "done", "complete", "finished", "working", or "ready". A task is not complete when the code is written — only when the intended outcome is achieved, verified, accepted, documented, integrated, and the system is ready for the next cycle. Runs Objective → Scope → Implementation → Test → Outcome → Impact → Quality → Acceptance → Closure → Declare DONE + next cycle.
---

# Kangqore Completion Protocol — v1.0

**COMPLETION MODE — default after execution.** Before declaring any work DONE, run the full completion cycle. This is the closing half of the [[kangqoreexecution]] loop.

## The Kangqore engineering law

A task is **not** complete when:

- ❌ "The developer finished coding."
- ❌ "The feature works on my machine."
- ❌ "All tests passed."

A task **is** complete when:

> ✅ The intended objective has been achieved, the implementation has been verified, the expected outcome has been validated, quality and readiness have been confirmed, acceptance has been obtained, the work has been documented, and the next cycle can safely begin.

**Built ≠ Working. Working ≠ Done.**

---

## When to run this cycle

Run it whenever you are about to tell the user something is "done", "complete", "finished", "working", "ready", "shipped", or "applied" — and on `/kangqorecompletion`.

Scale the rigor to the work: a one-line fix needs steps 1, 4, 9; a feature or migration needs all ten. The non-negotiables at any size are at the bottom.

**Do not skip to "done" because execution felt complete.** Execution completing is the trigger for this cycle, not a substitute for it.

---

## The 10-step completion cycle

### 1 · Confirm the Original Objective

Go back to the original plan (the [[kangqoreexecution]] step 1–4 artifacts). Ask:

- What were we supposed to accomplish?
- What was the original problem?
- What was the intended outcome?
- What were the acceptance criteria?

**Define completion from what was originally intended — never from what was actually built.** If the two have drifted, that drift is a finding, not a detail.

### 2 · Check Scope Completion

Walk the plan's checklist item by item: **Plan → Checklist → Actual Result.**

Features · components · tasks · subtasks · dependencies · documentation · configuration · integrations.

Classify each explicitly:

| | |
|---|---|
| ✅ | Completed |
| 🟡 | Partially completed |
| 🔴 | Not completed |
| ⚪ | Not required / intentionally removed |

Anything 🟡 or 🔴 is either finished now or written to `docs/DEFERRED.md` with why, what unblocks it, and where the code lives — before "done" is said.

### 3 · Verify the Implementation

Inspect what was actually produced, against the plan:

code · architecture · APIs · database · UI/UX · integrations · configuration · security · performance · error handling · edge cases.

Ask: **did we implement what we planned — correctly?** Read the diff, not your memory of writing it.

### 4 · Test Everything

Built ≠ Working. Run the appropriate:

unit · integration · E2E · UI · API · security · performance · regression · manual validation.

Repo gates, in order, **checking exit codes — do not grep for "pass"**:

```bash
node scripts/generate-prerender.mjs      # if content/service pages touched
npm run audit:all
npm run check:prerender
npm run check:sitemap
npm run audit:ontology-writes            # if any ontology write path touched
cd frontend && npm run build
```

Then **open it in a browser / curl the endpoint.** Every gate has passed before on a page that fell to the error boundary rendering twelve words.

### 5 · Validate the Outcome

The heart of the protocol. Ask: **did the work actually produce the intended outcome?**

Do not stop at "the button works." Verify the entire business flow end to end:

> User → UI → API → Database → Permissions → Response → UI state → Audit → Recovery

Example — "user can create an enterprise project" is not validated by "the Create Project button works." It is validated by a real row landing in the database with the right owner, the right markings, an audit entry, and the UI reflecting it — and the flow failing safely when it should.

**This repo has modules that look complete and persist nothing** ([[phase5-developer-ecosystem]], [[feedback]] Rule 2). A `success: true` response is not evidence. Query the row count. Curl the endpoint. Run the probe. Verify against `origin/main`, not the branch ([[verify-against-main-not-branch]]).

### 6 · Validate the Impact

Compare **Expected Impact vs. Actual Impact** (the [[kangqoreexecution]] step 5 artifact):

- Did performance actually improve? By how much?
- Did the workflow get faster / friction decrease?
- Did the automation actually save time?
- Did the business requirement get solved?
- Did the feature improve the product?

If no: the task may be *technically* complete while the *objective* is not. Say that plainly — do not let "code merged" stand in for "problem solved."

### 7 · Check Quality & Readiness

Before DONE, evaluate — **is this ready to become part of the real system?**

- **Engineering:** code quality, maintainability, scalability, reliability, security, observability.
- **Product:** UX quality, accessibility, consistency, usability, business logic.
- **Operations:** deployment readiness, monitoring, logging, documentation, rollback/recovery.

Respect what already shipped — do not undo a deliberate prior decision to satisfy a checklist item; if a fix seems to require reversing one, stop and ask.

### 8 · Obtain Acceptance

Completion has an **explicit acceptance point**. Determine:

- Who owns the requirement? (Default: Mahesh.)
- Does it meet the acceptance criteria from step 1?
- Are there outstanding objections?
- Are known limitations documented?

Then present the **evidence** (step 4 + 5 output) and get an explicit **ACCEPTED**. Only then is the work fully closed.

**Do not say "applied" / "done" about work on an unmerged branch the user cannot see** — lead with the URL or state where the change is actually visible. This has caused repeated confusion.

### 9 · Close the Circle

Formally close the task. Record:

what was planned · what was actually completed · what changed · what remains · known issues · decisions made · evidence of completion · deployment status · documentation status.

Update the relevant systems:

- **Git / PR** — commit message states which changes are system-wide vs. scoped; PR body has the evidence.
- **`docs/DEFERRED.md`** — what remains, if anything.
- **`docs/learn.md`** — learnings from this cycle (shared with [[kangqoreexecution]] step 9).
- **Changelog / roadmap / status docs** — as applicable.
- **Memory** — for multi-day or architecturally significant work, a `<sprint>-complete.md` style closure record + a MEMORY.md index line.

The task must leave behind a clear historical record.

### 10 · Declare DONE + Feed the Next Cycle

The final gate. Work is **✅ DONE** only when this chain is verified:

```
Objective → Scope → Implementation → Testing → Outcome → Impact → Quality → Acceptance → Closure
```

Then ask **what should happen next?** and generate:

next task · new dependencies · follow-up work · improvements · risks · learnings · new plan.

Feed those into the next [[kangqoreexecution]] planning cycle.

---

## The completion loop

```
ORIGINAL OBJECTIVE → CHECK SCOPE → VERIFY IMPLEMENTATION → TEST EVERYTHING
  → VALIDATE OUTCOME → VALIDATE IMPACT → CHECK QUALITY & READINESS → ACCEPTANCE
  → CLOSE THE CIRCLE → DECLARE DONE → CAPTURE LEARNINGS → GENERATE NEXT ACTIONS
  → 🔄 PLAN NEXT CYCLE
```

---

## Minimum bar (any size of work)

1. Original objective re-read — completion judged against intent, not output.
2. Scope checklist walked; every item ✅ / 🟡 / 🔴 / ⚪; nothing 🟡/🔴 left unrecorded.
3. Gates run, **exit codes checked**, and the thing opened / curled / probed against the running system.
4. Outcome validated end to end — a real row / response / state, not a `true` field.
5. Explicit acceptance asked for, with evidence, and the change located where the user can see it.
6. At least one line written to `docs/learn.md`, and the next action named.
