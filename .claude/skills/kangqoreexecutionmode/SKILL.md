---
name: kangqoreexecutionmode
description: The Kangqore Execution Protocol — EXECUTION MODE, the discipline for the doing-the-work phase, after a plan is approved and before completion. Invoke once a /kangqoreexecution plan is approved and you are about to change code/schema/infra/content/config, and whenever the user types /kangqoreexecutionmode. Governs how changes are made: understand before changing, one logical unit at a time, verify continuously, maintain live state, detect deviations, fix root causes, protect the outcome. Golden rule — never execute blindly, never change without understanding, never continue without verifying, never drift without deciding.
---

# Kangqore Execution Protocol — v1.0

**EXECUTION MODE — default while performing work.** Once the plan is approved, execute deliberately, continuously verify, maintain alignment, and never lose control of the intended outcome.

This is the middle phase of the loop:
**[[kangqoreexecution]]** (plan) → **this skill** (execute) → **[[kangqorecompletion]]** (verify & close).

## The Golden Rule

> **NEVER EXECUTE BLINDLY. NEVER CHANGE WITHOUT UNDERSTANDING. NEVER CONTINUE WITHOUT VERIFYING. NEVER DRIFT WITHOUT DECIDING.**

Rhythm: **CHANGE → VERIFY → CHANGE → VERIFY** — not CHANGE → CHANGE → CHANGE → HOPE.

---

## When this mode is active

From the moment a `/kangqoreexecution` plan is approved until execution is finished and `/kangqorecompletion` takes over. Also on `/kangqoreexecutionmode`.

If there is no approved plan and the work is non-trivial, stop — go back to `/kangqoreexecution` first. Execution mode does not start cold.

---

## The 10-step execution loop

### 1 · Start From the Approved Plan

Before touching the code/task, load the current: plan · SOP · approach · expected outcomes · expected impact · dependencies · acceptance criteria.

**Do not execute from memory when a plan exists.** Re-read it. If the session compacted, reconstruct it from the `ExitPlanMode` message / roadmap doc before proceeding.

### 2 · Understand Before Changing

Before modifying anything:

- Inspect the existing system; read the surrounding code.
- Understand the relevant architecture and existing patterns.
- Identify dependencies — what imports this, what this imports.
- Identify constraints (governance gates, [[feedback]] placement rules, shipped decisions).
- Determine the blast radius — what could be affected.

**Never change what you haven't understood.** In this repo specifically: modules that look complete may persist nothing ([[phase5-developer-ecosystem]]); the Work OS template resolves content through a parity layer, so reading the data file tells you nothing about what renders (see [[marketing-service-pages]] / service-page-audit). Verify the mechanism, not the name.

### 3 · Execute One Logical Unit at a Time

Break the work into small, meaningful units:

```
Task → Subtask → Logical change → Verify → Next logical change
```

Small change → immediate understanding → immediate verification. Avoid large uncontrolled changes. Prefer a sequence of commits each of which is individually explainable and individually verifiable.

### 4 · Preserve the Existing System

**Minimal change → maximum intended impact**, not unnecessary rewriting.

Before changing something, ask: what depends on this? what existing behavior, API contract, DB behavior, UI, or permission could change? A response-shape change is a change to every consumer — the `learn.md` entry "Service probes proved nothing about the screens" is exactly this failure.

**Do not undo what already shipped.** Every deliberate prior decision (documented in skills, `docs/learn.md`, memory) stands unless the user reverses it. If a change seems to require reversing one, stop and ask.

### 5 · Verify Continuously

Don't wait until the end to discover problems. After each meaningful change:

- Compilation / build. (`cd frontend && npm run build` — there is no local `tsc` for the frontend, see [[local-dev-tooling-notes]].)
- Lint, types, the relevant gate (`npm run audit:all`, `check:prerender`, `check:sitemap`, `audit:ontology-writes` — as applicable), **exit codes checked, never grep "pass"**.
- Inspect logs. Backend is Docker on `:5050` — **restart it to pick up edits** or you are testing stale code.
- Exercise the actual workflow. Load the page in a browser — endpoint 200s are not page verification (`learn.md` has two P1 entries on exactly this).
- Validate the assumptions the change rested on.

### 6 · Maintain a Live State

Continuously know: where are we · what's done · what's in progress · what remains · what's blocked · what changed from the plan.

Use the **TodoWrite** tool as the live execution state, with status per unit:

🟢 Completed · 🔵 In Progress · 🟡 Waiting · 🔴 Blocked · ⚠️ Needs Decision

Keep it current as you go — this is what prevents losing control of complex work.

### 7 · Detect Deviations Immediately

Reality will differ from the plan. When it does: **STOP → IDENTIFY → ASSESS → DECIDE.**

Ask: is this deviation necessary? beneficial? does it affect scope / architecture / timeline / the expected outcome? does the plan need to change?

**Never silently drift.** A deviation is either:

- **Accepted** → documented (in the todo state + `docs/DEFERRED.md` or a note for the completion cycle) → incorporated, or
- **Rejected** → return to plan.

A deviation that changes scope or the outcome goes back to the user before it is executed.

### 8 · Handle Problems Systematically

When something fails, don't patch blindly:

```
OBSERVE → REPRODUCE → UNDERSTAND → IDENTIFY ROOT CAUSE
  → DESIGN FIX → IMPLEMENT → VERIFY → DOCUMENT LEARNING
```

**Fix the cause, not the symptom.** Don't accumulate temporary hacks. Every P1 in `docs/learn.md` ends with a concrete "System change:" line — match that bar: the fix includes whatever stops the class of problem recurring.

### 9 · Protect the Outcome While Executing

Constantly ask: **"is what I'm doing still taking us toward the intended outcome?"**

You can write beautiful, correct, fully-tested code and still build the wrong thing. Keep the chain connected at all times:

> Code → Feature → Workflow → Outcome → Impact

If a unit of work no longer connects to the outcome, that's a step-7 deviation — stop and decide.

### 10 · Update State, Evidence & Learning

At the end of **each execution unit**, record:

what changed · why · what was verified · what failed · what remains · decisions made · new risks · new dependencies · lessons learned.

Update: the todo state · the plan (if it moved) · documentation · git/PR · `docs/learn.md` (append using its entry format, and add the "System change:" line) · architecture decisions · SOPs when required.

Then move to the next unit.

---

## The execution loop

```
APPROVED PLAN → UNDERSTAND → SELECT LOGICAL UNIT → MAKE CHANGE → VERIFY
  → UPDATE LIVE STATE → CHECK FOR DEVIATION → SOLVE PROBLEMS
  → CHECK OUTCOME ALIGNMENT → RECORD EVIDENCE & LEARNING → NEXT UNIT
  → 🔄 UNTIL COMPLETION
```

When the last unit is verified, hand off to **[[kangqorecompletion]]** — do not declare the work done from inside execution mode.

---

## Minimum bar (any size of work)

1. Approved plan re-read; not executing from memory.
2. The code around the change read and understood before editing.
3. Work split into units that are each individually verifiable; no one giant diff.
4. A gate / build / browser check run after each meaningful change, exit codes checked.
5. Live todo state kept current, with blockers and decisions flagged.
6. Every deviation from plan explicitly accepted-and-documented or rejected — never silent.
7. Failures traced to root cause, not patched; each learning written to `docs/learn.md` with a system-change line.
