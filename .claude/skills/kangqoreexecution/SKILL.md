---
name: kangqoreexecution
description: The Kangqore Closed-Loop Execution System — the mandatory plan-first operating loop for this repo. Invoke at the START of any non-trivial engineering task, feature, fix, refactor, migration, or execution work (anything that will change code, schema, infra, content, or config), and whenever the user types /kangqoreexecution. Coding is never the first step. Runs Plan → SOP → Approach → Outcome → Impact → Verify prior work → Execute → Check alignment → Learn → Improve the system → Replan.
---

# Kangqore Closed-Loop Execution System — v1.0

**Doctrine in one sentence:** PLAN BEFORE ACTION. EXECUTE WITH DISCIPLINE. VERIFY BEFORE PROCEEDING. LEARN FROM EVERYTHING. IMPROVE THE SYSTEM. REPLAN. REPEAT.

**Core principle:** every completed task must make the next task better. Every execution produces an outcome, every outcome produces evidence, every mistake produces learning, every learning improves the system.

Coding is an execution mechanism. It is not the starting point of engineering intelligence.

---

## When to run this loop

Run it for anything that will change code, schema, infra, content, config, or governance — a feature, a fix, a refactor, a migration, a content rebuild, a dependency bump with blast radius.

**Skip it** for: answering a question, reading/searching the codebase, a one-line typo fix the user explicitly hands you, or work already mid-cycle under a plan approved earlier in the session (resume that cycle, don't restart).

If unsure whether something is "trivial", it isn't — run the loop.

---

## Operating mode

**Steps 1–6 happen in plan mode.** Call `EnterPlanMode` before doing anything else. Do not edit a file, run a migration, or push until the plan is presented via `ExitPlanMode` and the user approves it. Once approved, execute decisively — the plan is the deliberate part; execution is not the place to keep surveying options (see [[feedback]] Rule 3).

The loop produces **artifacts**, not just intentions:
- The **plan** (steps 1–5) → presented in `ExitPlanMode`, and for multi-day work also written to `docs/` or the relevant roadmap file.
- **Learnings** (step 9) → appended to `docs/learn.md`.
- **Deferred/blocked items** (step 6, step 7) → `docs/DEFERRED.md`.
- **System changes** (step 10) → edits to SOPs, skills, checklists, memory, standards.

---

## The 10-step loop

### 1 · Create the Plan

Before doing or coding anything. The plan establishes:

| Field | What it answers |
|---|---|
| **What** | The concrete deliverable(s). |
| **Why** | The reason this is being done now. |
| **Scope** | Explicitly in, explicitly out. |
| **Dependencies** | What must be true / done first. Upstream and downstream. |
| **Priorities** | Order of work; what ships first if time is cut. |
| **Resources** | Files, services, accounts, credentials, models needed. Flag anything missing. |
| **Milestones** | Checkpoints where progress is verifiable. |
| **Definition of completion** | The precise, checkable condition for "done". Not "implemented" — verified against the running system. |

### 2 · Create the SOPs

The standard operating procedure for this class of work. Define:

- Standard process (the ordered steps)
- Roles and responsibilities (who/what does each step — Claude, user, CI, a service)
- Required inputs
- Expected outputs
- Quality standards (lint, types, tests, gates that must pass)
- Checks and controls (how each output is verified)
- Exceptions and escalation paths (what to do when a step fails or a decision is needed)

If an SOP for this class of work already exists (`docs/operating-manual/`, a skill, a prior `docs/learn.md` entry), reuse and cite it. Only write a new SOP when none fits.

### 3 · Define the Approach

How the planned work will actually be tackled:

- Technical approach — the mechanism, the data flow, the modules touched
- Product approach — how it presents to the user / customer
- Execution strategy — sequencing, batching, feature-flagging, rollout
- Architecture decisions — and which existing rules they must respect ([[feedback]], [[work-os-doctrine]], [[ontology-write-path-gate]], the `kangqore-view` placement rule)
- Tools and technologies
- Dependencies (concrete, at the implementation level)
- Risks — what could go wrong, likelihood, mitigation
- Alternatives — what else was considered and why it was rejected

### 4 · Define the Outcomes

Clearly, before executing:

- What must **exist** when this is complete?
- What problem will be **solved**?
- What **measurable** result is produced?
- What does "done" actually mean — as a command you can run or a state you can observe?

### 5 · Define the Impact

Why the work matters. Evaluate:

business · product · user · technical · operational · strategic

The objective is to avoid building things simply because they can be built. If the impact is thin, say so and propose not doing it.

### 6 · Verify Previous Work / Close the Circle

Before starting, confirm the previous task actually completed. Check:

- Previous task status — merged? deployed? verified against the running system, not assumed?
- Acceptance criteria — were they met, or quietly dropped?
- Dependencies — are the things this work depends on actually done?
- Unresolved issues and pending decisions — read `docs/DEFERRED.md`.
- Required documentation — was it written?
- **Actual completion vs. assumed completion** — this repo has modules that look complete and persist nothing ([[phase5-developer-ecosystem]], [[feedback]] Rule 2). A green response field is not evidence: query the row count, curl the endpoint, run the probe.
- **Verify against `origin/main`, not the current branch** — a stale branch fakes a gap convincingly ([[verify-against-main-not-branch]]). `git log HEAD..origin/main` before concluding something is missing.

Never build on an unfinished or misunderstood foundation. If the previous circle is open, closing it (or consciously deferring it in `docs/DEFERRED.md`) is step 1 of this cycle.

### 7 · Execute & Wait for Planned Task Completion

Once the plan is approved, execution runs under the **[[kangqoreexecutionmode]]** skill (`/kangqoreexecutionmode`) — EXECUTION MODE: understand before changing, one logical unit at a time, CHANGE → VERIFY rhythm, live todo state, detect deviations, fix root causes, protect the outcome.

Then **wait for the task to actually complete and be verified** before moving on. Do not jump ahead while critical earlier work is unfinished. Rhythm: **Plan → Execute → Complete → Verify → Continue.**

- Run the quality gates named in the SOP. Check exit codes — do not grep for "pass".
- Verify what renders / persists / responds, not what you wrote.
- Update `docs/DEFERRED.md` the moment anything is skipped — not later.

**Do not declare the work DONE here.** When execution finishes, hand off to the **[[kangqorecompletion]]** skill (`/kangqorecompletion`) — the full Objective → Scope → Implementation → Test → Outcome → Impact → Quality → Acceptance → Closure cycle runs before "done" is said. Built ≠ Working ≠ Done.

### 8 · Check Direction / Alignment

After each meaningful milestone, ask:

- Are we solving the right problem?
- Still aligned with the original objective?
- Has the business or technical context changed?
- Are the expected outcomes (step 4) still valid?
- Is the work producing the intended impact (step 5)?

If any answer is no: **Stop → Reassess → Replan.** Do not push through a plan that reality has invalidated.

### 9 · Self-Improvement Loop

After execution, identify: mistakes · failures · inefficiencies · wrong assumptions · repeated problems · successful patterns · new discoveries · lessons learned.

Append the important ones to **`docs/learn.md`**, using the entry format at the bottom of that file. A mistake must not disappear when it is fixed — it becomes organizational knowledge.

### 10 · Update the System & Replan

This step closes the loop. For each learning from step 9, ask:

> "What must change in the system so we don't repeat this?"

Then make that change — don't just record it:

plan templates · SOPs · engineering standards · architecture rules · checklists · automation · testing requirements · governance rules · documentation · `docs/learn.md` · product requirements · development workflow · **this skill** · memory files.

Then **replan the next cycle** — return to step 1 for the next task, now with an improved system.

---

## The closed loop

```
PLAN → STANDARDIZE → DEFINE APPROACH → DEFINE OUTCOME → DEFINE IMPACT
  → VERIFY PREVIOUS WORK → EXECUTE → COMPLETE & VERIFY → CHECK ALIGNMENT
  → LEARN → IMPROVE THE SYSTEM → REPLAN → 🔄 REPEAT
```

---

## Repo-specific hooks

- **Single tree:** `/Users/maheshkumar/Kangqore` on `:3000`. Ignore the `kq-acc` worktree / `:3010` ([[single-tree-no-worktree]]).
- **Branch in place**, never a git worktree. `git status --porcelain` clean before starting.
- **Placement rule:** OS-native backend code + its routes go in `backend/src/kangqore-view/`; `index.ts` only via a thin `routes/*.routes.ts` delegator ([[feedback]] Rule 1). Decide placement in step 3, before writing.
- **`gh` IS installed and authed** — use it for PRs ([[local-dev-tooling-notes]]).
- **Prisma:** `migrate dev` fails non-interactive — use `migrate diff` + manual folder + `migrate deploy`.
- **Backend is Docker on `:5050`** — restart to pick up edits.
- **Ontology writes** go through `OntologyGateway`; `npm run audit:ontology-writes` gates the build ([[ontology-write-path-gate]]).

---

## Minimum bar

A one-line answer is not a plan. But a 30-minute task does not need a 2-page plan — scale the artifact to the work. The non-negotiables regardless of size:

1. Plan mode entered before any change.
2. Definition of completion stated as something checkable.
3. Previous circle checked (`docs/DEFERRED.md` + verify against `main`).
4. Gates run with exit codes checked after execution.
5. At least one line considered for `docs/learn.md`.
