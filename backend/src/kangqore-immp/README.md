# KIMMP — Kangqore Intelligence Mind Management Processor

KIMMP is Kangqore's **mother intelligence layer** — the brain that sits above and
connects the four existing systems:

- **eQORE** — talks to people
- **eQORE Lead Intelligence** — qualifies people
- **ALIS** — studies revenue / market patterns
- **VIS** — builds visibility (SEO / AEO / GEO / LLMO)

> eQORE speaks, Lead Intelligence qualifies, ALIS strategizes, VIS grows knowledge —
> **KIMMP understands, decides, and orchestrates.**

This folder ships the **Human Behavior Intelligence Layer** (PR 1) plus **shadow-mode
eQORE observation** (PR 2). The wider KIMMP vision (decision engine, workflow
orchestrator, governance, agent registry, revenue/delivery intelligence, founder
command center) is a phased roadmap — see *Roadmap* below.

KIMMP does **not** yet influence eQORE's responses. In shadow mode it analyzes live
conversations and logs the behavioral reading it *would* recommend — observe-only, so
it cannot affect the visitor experience. Letting it shape responses is a later PR (2b).

---

## What PR 1 does

Given conversation text, it infers the visitor's **behavioral state** — with
confidence scores — so Kangqore can respond like a thoughtful business operator
instead of a generic chatbot.

It detects nine states: `URGENCY`, `FRUSTRATION`, `STRESS`, `CONFUSION`,
`SKEPTICISM`, `TRUST_NEED`, `TECHNICAL_DEPTH`, `DECISION_READINESS`,
`BUYING_SERIOUSNESS` — plus a communication style and a recommended response mode.

### Ethical boundary (locked, non-negotiable)

KIMMP analyzes **observable communication signals only**. It never emits clinical
diagnoses or harmful labels ("low IQ", "mentally weak", "emotionally unstable", …).
This is enforced twice: in the Tier-2 system prompt, and again by a deterministic
`LabelGuardrail` that scrubs every human-facing string before it leaves the layer.

---

## Architecture — two-tier hybrid

```
              ┌───────────────────────────────────────────────┐
  messages →  │  BehaviorAnalyzer  (orchestrator)              │
              └───────────────────────────────────────────────┘
                       │
        ┌──────────────┴───────────────┐
        ▼                              ▼
  TIER 1 — local                 TIER 2 — cloud brain
  Tier1SignalExtractor           Tier2ClaudeReasoner
  • lexicons + heuristics        • Anthropic / Claude
  • ~1ms, free, every message    • only when Tier-1 is unsure
  • fully explainable              OR a HIGH-severity signal fires
        │                              │
        └──────────────┬───────────────┘
                       ▼
         TraitEstimator (Big Five — volume-gated)
                       ▼
         LabelGuardrail → BehaviorProfile
```

- **Tier 1** is the genuinely *local* "intelligence algorithm" — weighted phrase
  lexicons (`behavior/lexicons.ts`) plus structural heuristics (exclamation density,
  ALL-CAPS ratio, question density). No API call.
- **Tier 2** escalates to Claude only when Tier-1 aggregate confidence is below
  `KIMMP_TIER2_CONFIDENCE_FLOOR` *or* a `HIGH`-severity state is present. Most
  messages never reach the API, so cost stays bounded.
- **Traits** (Big Five / OCEAN) are **volume-gated** — short chats do not carry
  enough text for a defensible personality estimate, so traits stay `available:false`
  until the conversation crosses `KIMMP_TRAIT_MIN_CHARS` / `KIMMP_TRAIT_MIN_MESSAGES`.
  ("Neuroticism" is surfaced as `emotionalSensitivity` to avoid a clinical label.)

### Files

| Path | Role |
|---|---|
| `core/types.ts` | Shared types, `KIMMP_VERSION` |
| `core/flags.ts` | Env-driven feature flags & tunables |
| `behavior/lexicons.ts` | Tier-1 weighted phrase lexicons |
| `behavior/signalExtractor.service.ts` | Tier-1 deterministic extractor |
| `behavior/claudeReasoner.service.ts` | Tier-2 Claude reasoning pass |
| `behavior/traitEstimator.service.ts` | Volume-gated Big Five estimator |
| `behavior/behaviorAnalyzer.service.ts` | Orchestrator (Tier-1 → Tier-2 → traits) |
| `behavior/behaviorSchema.ts` | zod validation (input + Tier-2 payload) |
| `behavior/behaviorProfileStore.service.ts` | Optional, graceful persistence |
| `guardrails/labelGuardrail.ts` | Harmful-label backstop |
| `controllers/behaviorAnalysis.controller.ts` | HTTP handlers |
| `routes.ts` | Route registry |

---

## API

Mounted at `/api/admin/kangqore-immp` (see `backend/src/index.ts`).

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/health` | public | Module status |
| POST | `/behavior/analyze` | ADMIN | Analyze conversation text |
| GET | `/behavior/profiles/:id` | ADMIN | Fetch a stored profile |
| GET | `/shadow/observations?limit=50` | ADMIN | Recent shadow-mode readings of live eQORE traffic (PR 2.5) |
| GET | `/shadow/backfill?limit=25` | ADMIN | Run KIMMP over existing eQORE conversation history (PR 2.6) |
| POST | `/signals` | ADMIN | Ingest a signal into the Signal Ledger (Phase 1) |
| GET | `/signals` | ADMIN | Query the Signal Ledger (filter by module/category/severity/status) |
| GET | `/page-factory/rendered/:slug` | public | Fetch a PUBLISHED page by slug (consumed by the renderer) |
| GET | `/page-factory/pages` | ADMIN | List generated pages (filter `?status=&pageType=`) |
| POST | `/page-factory/pages` | ADMIN | Create a DRAFT page |
| GET/PATCH | `/page-factory/pages/:id` | ADMIN | Get / update a page |
| POST | `/page-factory/pages/:id/publish` | ADMIN | Publish a page (admin-gated) |
| POST | `/page-factory/pages/:id/unpublish` | ADMIN | Return a page to DRAFT |
| POST | `/page-factory/generate` | ADMIN | KIMMP drafts a page via Claude → saved as DRAFT (PR-C) |
| POST | `/page-factory/opportunities/scan` | ADMIN | Detect missing-page opportunities (PR-B) |
| GET | `/page-factory/opportunities` | ADMIN | List detected opportunities |
| PATCH | `/page-factory/opportunities/:id` | ADMIN | Update an opportunity's status |
| GET | `/page-factory/audit` | ADMIN | Page lifecycle audit trail (PR-D) |

`POST /behavior/analyze` body:

```json
{
  "messages": [
    { "role": "USER", "content": "We have an old ERP system. It keeps breaking. Our team is frustrated. Can you fix this fast?" }
  ],
  "analyzedRole": "USER"
}
```

---

## Configuration

| Env var | Default | Purpose |
|---|---|---|
| `KIMMP_ENABLED` | `true` | Master switch |
| `KIMMP_TIER2_ENABLED` | `true` | Allow the Claude reasoning pass |
| `KIMMP_PERSIST` | `false` | Persist profiles (needs the migration) |
| `KIMMP_REASONER_MODEL` | `claude-haiku-4-5-20251001` | Tier-2 model |
| `KIMMP_TIER2_CONFIDENCE_FLOOR` | `0.55` | Escalation threshold |
| `KIMMP_TRAIT_MIN_CHARS` | `600` | Trait volume gate (characters) |
| `KIMMP_TRAIT_MIN_MESSAGES` | `4` | Trait volume gate (messages) |

Tier-2 also needs `ANTHROPIC_API_KEY` (already used by eQORE). Without it, KIMMP
runs Tier-1 only.

## Persistence / migration

PR 1.5 adds the `KimmpBehaviorProfile` model and a migration
(`prisma/migrations/20260522120000_add_kimmp_behavior_profile`). The migration is
**not auto-applied** — apply it per environment with `prisma migrate deploy`, then
set `KIMMP_PERSIST=true`.

- `KIMMP_PERSIST=true` — every behavior analysis (including shadow observations) is
  stored, and `GET /shadow/observations` serves from the database, so readings
  survive restarts.
- `KIMMP_PERSIST=false` (default) — analysis runs fully in-memory and
  `/shadow/observations` serves the in-memory ring buffer only.

Persistence degrades gracefully: if the table is absent, analysis still works and
storage is skipped with a warning.

---

## Roadmap (phased)

| PR | Slice |
|---|---|
| **PR 1 ✅** | Human Behavior Intelligence Layer (this folder) |
| **PR 2 ✅** | Shadow-mode eQORE observation — analyze live traffic, log only |
| PR 2b | Let behavior signals shape eQORE responses (tone / response mode) |
| PR 1.5 | Persistence — `KimmpBehaviorProfile` model + migration |
| **PR-A1 ✅** | Page Factory rails — generated-page model + store + lifecycle API |
| **PR-A2 ✅** | Page Factory — dynamic frontend renderer + admin authoring UI |
| **PR-B ✅** | Page Factory — missing-page detection (opportunity ledger) |
| **PR-C ✅** | Page Factory — KIMMP generates page content (Claude + claim validator) |
| **PR-D ✅** | Page Factory — publish workflow: audit trail, sitemap inclusion, JSON-LD |

The Page Factory (PR-A → PR-D) is complete: detect → generate → review →
publish (audited) → discoverable in the sitemap, rendered with JSON-LD.

### Signal Ledger (Phase 1)

`signals/` is the cross-system signal hub — the base for connecting all four
systems. Every system writes signals to one table (`kimmp_signals`); KIMMP
reads one place. This PR ships the ledger + its first producer: the behavior
shadow observer emits one `BEHAVIOR` signal per analysis. The eQORE /
Lead-Intelligence / ALIS / VIS producers and the Decision Engine that consumes
the ledger are Phase 2+ — see `docs/KIMMP_ROADMAP.md`.
| PR 3+ | Signal Ledger, Decision Engine, governance, … |

See `docs/KIMMP_PAGE_FACTORY_PLAN.md` for the full Page Factory build path.

### Page Factory (PR-A1)

`page-factory/` stores website pages as structured data (`KimmpGeneratedPage`),
so one dynamic renderer can serve them — no hand-written React per page. A page is
`DRAFT` until an admin publishes it; KIMMP never auto-publishes. PR-A1 is the
backend rails only (model + API); the renderer and admin UI are PR-A2. The
`kimmp_generated_pages` migration is committed but **not auto-applied** — run
`prisma migrate deploy` per environment.

### Shadow mode (PR 2)

KIMMP observes every eQORE conversation via `eqore-bridge/eqoreShadowObserver.ts`,
hooked into `EqoreConversationController.handleMessage`. The call is fire-and-forget:
it never blocks or breaks the chat flow. Each observation logs one greppable line —
`[KIMMP:SHADOW] …` — carrying the recommended response mode, style, and top signals.

Recent observations are also kept in an in-memory ring buffer and exposed at
`GET /shadow/observations` (PR 2.5), so an admin can review the readings without
grepping logs. With `KIMMP_PERSIST=true` (PR 1.5) the endpoint serves durably from
the database instead, so observations survive server restarts.

| Env var | Default | Purpose |
|---|---|---|
| `KIMMP_EQORE_SHADOW` | `true` | Enable shadow observation of eQORE traffic |
| `KIMMP_SHADOW_TIER2` | `false` | Allow the Claude Tier-2 pass during shadow runs (cost) |
