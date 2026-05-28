# KIMMP — Status of Record

_Last updated: 2026-05-28_

This is the honest, verified state of KIMMP. It exists so the picture is not
misremembered or overstated.

## What KIMMP actually is today

KIMMP = **Kangqore Intelligence Mind Management Processor.** Right now it is
**a signal-aware intelligence layer with a Decision Engine** — not yet a mother
brain or orchestrator:

1. **Human Behavior Intelligence Layer** — infers behavioral signals from
   conversation text (urgency, stress, skepticism, …) with confidence scores.
2. **Page Factory** — detects missing pages, generates Kangqore-branded pages
   via Claude, and publishes them (admin-gated).
3. **Signal Ledger** — the cross-system hub. All four systems now write signals
   here; KIMMP reads from one place.
4. **Decision Engine** — reads NEW signals, applies a deterministic policy, and
   proposes next-best actions for admin review. Decides and recommends only.

Two corrections that must not drift:

- **KIMMP is NOT a local LLM.** It is a *cloud brain* — it reasons via
  Anthropic/Claude — plus a local *deterministic algorithm* (the Tier-1
  behavior extractor). There is no self-hosted model. This was locked on day 1.
- **KIMMP is NOT yet a "Digital CEO."** It now *observes*, *signals*, and
  *recommends* — but no approved decision is auto-executed. Workflow execution
  is gated on Phase 4 governance.

## Built and live

Phases 1–3 core built. 4 tables live on Supabase:
`kimmp_behavior_profiles`, `kimmp_generated_pages`, `kimmp_page_opportunities`,
`kimmp_page_audit`. Plus `kimmp_signals` and `kimmp_decisions`.

- Behavior layer: Tier-1 + Tier-2 analysis, eQORE shadow observation,
  persistence, historical backfill.
- Page Factory: rails, dynamic renderer + admin UI, missing-page detection,
  Claude generation + claim validator, publish workflow (audit + sitemap +
  JSON-LD).
- Signal Ledger: `kimmp_signals` hub, ingest/query API, all four systems wired
  as producers.
- Decision Engine: reads signals, applies policy, proposes `PROPOSED` decisions.
  Admin-reviewed; never auto-executes.

Pending env switches:
- `KIMMP_PERSIST=true` — enables durable behavior storage.
- `KIMMP_EQORE_INFLUENCE=true` — enables KIMMP behavior shaping eQORE responses
  (keep OFF until behavior reading is validated on real traffic).
- `KIMMP_SCORE_BRIDGE=true` — enables KIMMP behavior boost to lead scoring
  (keep OFF until validated).

## Connection state — all four systems connected

| Link | State | How |
|---|---|---|
| **eQORE → KIMMP** | ✅ shadow + influence | Shadow observer per message; influence flag-gated OFF. |
| **eQORE → Signal Ledger** | ✅ Phase 2 | INTENT signal emitted per message dispatch. |
| **Lead Intelligence → Signal Ledger** | ✅ Phase 2 | INTENT/RISK signal when lead score/status changes. |
| **ALIS → Signal Ledger** | ✅ Phase 2 | MARKET signals via `POST /api/admin/alis/signals/emit`. |
| **VIS → Signal Ledger** | ✅ Phase 2 | CONTENT signals via `POST /api/admin/kangqore-immp/signals/scan-vis`. |
| **KIMMP → Lead Intelligence (advisory)** | ✅ Phase 2 | `GET /leads/:leadId/behavior` — behavioral read per lead. |
| **KIMMP → Lead Intelligence (scoring)** | ✅ built, flag-gated OFF | Behavior boost (+0–10 pts). Enable `KIMMP_SCORE_BRIDGE=true` post-validation. |
| **KIMMP → ALIS (advisory)** | ✅ Phase 2 | `GET /market/behavior-signals` — market-level behavioral snapshot. |
| **KIMMP → VIS** | ✅ thin | VIS `SitemapService` includes `kimmp_generated_pages`. |
| **Decision Engine** | ✅ Phase 3 | Reads signals, proposes BEHAVIOR/INTENT/CONTENT/MARKET/RISK decisions. |

## Not built

Workflow Orchestrator (Phase 3 remainder, gated on Phase 4) · Phase 4
governance/permission/observability/cost · Phase 5 ML prediction + RAG ·
Phase 6 Command Center. See `KIMMP_ROADMAP.md`.

## Honest constraint

All signal producers are **traffic-gated** — they produce real value only once
eQORE has real visitors. The Decision Engine will only have decisions to propose
once signals flow. The Page Factory's *generation* works today.

## Phase 4 — Governance layer (built)

- **Permission Matrix** — per-`decisionType` approval rules (role + note requirement).
- **Approval gate** — `PATCH /decisions/:id` enforces the matrix; writes `approvedBy`,
  `approvedAt`, `notes`, etc. Returns 403 on policy violation.
- **Audit Log** — `kimmp_audit_entries` table + `GET /governance/audit`.
- **LLM Cost Ledger** — `kimmp_llm_costs` + `GET /governance/cost`. Instrumented on
  Tier-2 behavior + page generation Claude calls.
- **Structured Tracer** — `[KIMMP:TRACE]` log lines for every signal → decision →
  approval transition. OpenTelemetry upgrade path ready.

Apply the migration: `prisma migrate deploy` (migration `20260528000000_kimmp_phase4_governance`).

## Phase 3 remainder — Workflow Executor (built)

`POST /api/admin/kangqore-immp/decisions/:id/execute`

Turns an `APPROVED` decision into a real action. Five executors:
- **SALES_ALERT** — creates `EqoreSalesOpportunity` + `KIMMP_SALES_ALERT` lead event
- **HUMAN_HANDOFF** — escalates lead status + `KIMMP_HUMAN_HANDOFF` lead event
- **CONTENT_OPPORTUNITY** — promotes `KimmpPageOpportunity` to PENDING
- **MARKET_ALERT** — emits `MARKET_ALERT_ACTIONED` SYSTEM signal
- **RESPONSE_POLICY** — logs recommendation; no auto eQORE mutation

Every execution: requires APPROVED status → writes audit entry → emits trace event → marks EXECUTED.

## Phase 5 — ML prediction + RAG (v0 built)

**RAG layer:** `kimmpRag.service.ts` wraps the existing Voyage-AI embedding
stack. Up to 3 KB chunks appended to Tier-2 reasoning prompts. Flag gate:
`KIMMP_RAG_ENABLED=false` — enable once `VOYAGE_API_KEY` is set and KB indexed.
Admin: `GET /rag/query?q=...`

**v0 Prediction layer:** Three deterministic predictors (rules → ML scaffold):
- `conversionProbability` — lead score + status + scheduling + behavior
- `acvEstimate` — projectedValue or valueTier, adjusted by behavior posture
- `deliveryRisk` — urgency + stress signals + requirements clarity

Every prediction stored in `kimmp_predictions` with feature snapshot +
outcome columns for future ML training labels. Decision Engine uses predictions
to boost priority of high-conversion / high-risk leads.
Flag gate: `KIMMP_PREDICTIONS_ENABLED=false`.
Admin: `POST /predictions/run/:leadId`, `GET /predictions/:leadId`

**v1 ML models:** need real outcome data post-launch. Enable v0 at launch to
start collecting labeled training data. The prediction store rows are the
training set for v1 gradient-boosted models.

## Next real step

**Phase 6 — Command Center + extended intelligence.** The founder dashboard
and Digital CEO cockpit. Has substance only once Phases 1–5 data flows.
See `KIMMP_ROADMAP.md`.
