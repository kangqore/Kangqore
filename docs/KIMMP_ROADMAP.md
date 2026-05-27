# KIMMP — Roadmap of Further Operations

_Last updated: 2026-05-28 · Companion to `KIMMP_STATUS.md`_

This is the build roadmap for turning KIMMP from **two working faculties** into
the intelligence layer that actually connects eQORE, eQORE Lead Intelligence,
ALIS, and VIS. It is organised by **phase** and by **owning team** so each
department knows what it owns and when.

## Honest framing (read first)

- **Launch is the priority, not KIMMP depth.** eQORE is pre-launch. KIMMP's
  behavior and detection layers only earn once real visitors exist. Most of
  this roadmap is *build-ready but value-gated on launch.*
- The roadmap is **sequenced** — each phase depends on the one before. Do not
  jump ahead.
- KIMMP never acts autonomously on high-impact actions. Every phase keeps
  admin approval for anything outward-facing (publishing, emailing, pricing).

## Teams / owners

| Team | Owns in this roadmap |
|---|---|
| **Backend / Platform** | Data models, the Signal Ledger, services, APIs |
| **AI / ML** | Claude integration, behavior tuning, ML prediction, RAG |
| **Frontend / Product** | Admin dashboards, the dynamic renderer, Command Center |
| **DevOps / Security** | Migrations, env, observability, permissions, audit, cost |
| **Data / Analytics** | Signal taxonomy, ALIS integration, KPI definitions |
| **Founder / Product leadership** | Governance rules, decision policy, approval matrix, launch |

## Phases

### Phase 0 — Launch readiness · **NOW** · _Owner: whole company_
Not a KIMMP phase. Get eQORE and the website live and in front of real
visitors. Nothing downstream earns until this is done.

### Phase 1 — Signal Ledger · **✅ BUILT** · _Owner: Backend / Platform_
The one hub every system writes signals to and KIMMP reads from. Replaces
ad-hoc point-to-point wiring with a single backbone. Shipped: `kimmp_signals`
table, `signalLedger` service, `POST/GET /signals`, and the first producer (the
behavior shadow observer emits a `BEHAVIOR` signal per analysis). The other
producers + the Decision Engine that consumes the ledger are Phase 2+.

### Phase 2 — Connect the four as producers · **✅ COMPLETE** · _Owner: Backend + AI/ML_
All four systems now emit signals into the Signal Ledger and KIMMP feeds back:

- **eQORE → ledger** — INTENT signal emitted per message dispatch
  (`eqoreConversation.controller.ts`).
- **Lead Intelligence → ledger** — INTENT/RISK signal on lead score/status change
  (`leadSignalProducer.service.ts`, called from `updateLeadScore`).
- **ALIS → ledger** — MARKET signals via `AlisSignalProducer.scanAndEmit()`
  (`POST /api/admin/alis/signals/emit`).
- **VIS → ledger** — CONTENT signals from page opportunities via
  `VisSignalProducer.scanAndEmit()` (`POST /api/admin/kangqore-immp/signals/scan-vis`).
- **KIMMP → Lead Intelligence (advisory)** — `GET /leads/:leadId/behavior`.
- **KIMMP → Lead Intelligence (score bridge)** — `LeadScoringBridge.behaviorBoost()`
  adds 0–10 pts based on behavioral posture. Flag-gated `KIMMP_SCORE_BRIDGE=false`
  — enable after real-traffic validation.
- **KIMMP → ALIS (advisory)** — `GET /market/behavior-signals`.
- **KIMMP → eQORE influence (PR 2b)** — flag-gated `KIMMP_EQORE_INFLUENCE=false`.
  Keep OFF until behavior reading is validated on real traffic.

All producers are value-gated on real launch traffic — inert until visitors flow.

### Phase 3 — Decision + Workflow engine · **✅ COMPLETE** · _Owner: Backend + Founder_
**Decision Engine (previously built):** reads NEW signals, applies deterministic policy,
records `PROPOSED` next-best actions. Policy covers BEHAVIOR, INTENT, CONTENT,
MARKET, RISK signal categories.

**Workflow Executor (now built):** turns an `APPROVED` decision into a real
cross-system action via `POST /decisions/:id/execute`. Five per-module executors:

| Decision type | Target | What the executor does |
|---|---|---|
| `SALES_ALERT` | lead-intelligence | Creates an `EqoreSalesOpportunity` (if none exists) + logs `KIMMP_SALES_ALERT` lead event |
| `HUMAN_HANDOFF` | human | Escalates the lead to ESCALATED status + logs `KIMMP_HUMAN_HANDOFF` lead event |
| `CONTENT_OPPORTUNITY` | vis | Promotes the `KimmpPageOpportunity` to PENDING for generation + optional lead event |
| `MARKET_ALERT` | alis | Emits a `MARKET_ALERT_ACTIONED` SYSTEM signal into the Signal Ledger |
| `RESPONSE_POLICY` | eqore | Logs the recommendation; no auto-mutation (enable `KIMMP_EQORE_INFLUENCE` manually) |

Every execution is: admin-approved (Phase 4 gate) → audit-logged → tracer-emitted →
decision marked EXECUTED with `executedBy`/`executedAt`.

### Phase 4 — Governance, Permission, Observability, Cost · **✅ BUILT** · _Owner: DevOps / Security_
**Done:**
- **Permission Matrix** (`permissionMatrix.ts`) — deterministic per-`decisionType` rules:
  required role + whether a note is mandatory. `HUMAN_HANDOFF` and `SALES_ALERT`
  require a written note; all types require ADMIN at v1.
- **Human-approval gate** — `PATCH /decisions/:id` now reads the permission matrix,
  writes governance columns (`approvedBy`, `approvedAt`, `dismissedBy`, `dismissedAt`,
  `executedBy`, `executedAt`, `notes`) and returns 403 if the policy is violated.
- **Audit Log** (`auditLog.service.ts` + `kimmp_audit_entries` table) — immutable
  record of every approval, dismissal, engine run. `GET /governance/audit`.
- **LLM Cost Ledger** (`costTracker.service.ts` + `kimmp_llm_costs` table) — records
  input/output tokens and estimated USD per Claude call. Instrumented on Tier-2
  behavior reasoning and page generation. `GET /governance/cost`.
- **Structured Tracer** (`kimmpTracer.service.ts`) — emits `[KIMMP:TRACE]`-prefixed
  structured log lines for signal received → decision proposed → approved/dismissed.
  Drop-in OpenTelemetry upgrade path documented in the service.
- **Permission inspector** — `GET /governance/permissions` shows the current matrix.
- **Migration** — `20260528000000_kimmp_phase4_governance` adds governance columns to
  `kimmp_decisions` and creates `kimmp_audit_entries`, `kimmp_llm_costs`.

**Unblocks:** Phase 3 workflow executor (turning APPROVED decisions into real actions)
and all Phase 5+ autonomy.

### Phase 5 — ML prediction + RAG · **✅ BUILT (v0)** · _Owner: AI / ML_

**RAG layer (buildable pre-launch — static KB):**
- `kimmpRag.service.ts` — wraps the existing Voyage-AI embedding stack and
  `retrieve()` function used by eQORE. KIMMP gets KB-grounded context at
  Tier-2 reasoning time.
- Injected into Tier-2 behavioral analysis: up to 3 relevant KB chunks appended
  to the Claude prompt so behavior assessment is grounded in actual Kangqore
  capabilities.
- Flag gate: `KIMMP_RAG_ENABLED=false` (enable once VOYAGE_API_KEY is set and
  KB is indexed).
- Admin endpoint: `GET /rag/query?q=...` to test retrieval.

**v0 Prediction layer (rules-based scaffold, data collection for future ML):**
- `kimmpPrediction.service.ts` — three deterministic predictors (rules-first,
  not opaque ML; each rule is documented):
  - `conversionProbability` (0.0–1.0): lead score, status, scheduling, behavior posture
  - `acvEstimate` (USD): projectedValue or valueTier fallback, adjusted by behavior
  - `deliveryRisk` (LOW/MODERATE/HIGH): urgency + stress signals + requirements clarity
- `predictionStore.service.ts` + `kimmp_predictions` table — every prediction
  stored with features snapshot. `actualConverted`, `actualAcv`, `actualDeliveryIssue`
  columns filled in post-conversion to close the training loop for v1 ML models.
- Decision Engine integration: high conversion probability (+8 priority) and
  high delivery risk (+5 priority) boost PROPOSED decision urgency.
- Flag gate: `KIMMP_PREDICTIONS_ENABLED=false` (enable after migration applied).
- Admin endpoints: `POST /predictions/run/:leadId`, `GET /predictions/:leadId`.

**Traffic gate (for v1 ML models):** Real models need real outcome labels.
Enable the v0 predictors at launch and collect labeled data. The prediction
store's feature+outcome rows are the training set for v1 gradient-boosted or
neural models in Phase 5 v1.

### Phase 6 — Command Center + extended intelligence · _Owner: Frontend + Data_
Founder dashboard; revenue / delivery / customer-success intelligence. The
"Digital CEO cockpit." Last, because it only has substance once Phases 1–5 feed
it.

---

## NEXT REAL STEP — Signal Ledger (scoped)

**PR name:** `KIMMP Signal Ledger — foundation`
**Owner:** Backend / Platform Engineering
**Size:** ~1 focused PR (same scale as the other KIMMP backend PRs)
**Dependency:** none — extends the existing `backend/src/kangqore-immp/` module
**Build timing:** pre-launch buildable · **Value timing:** post-launch (inert
until producers emit and traffic flows)

### Why it is the next step
KIMMP currently connects to 2 of 4 systems via two separate point-links. Adding
more point-links does not scale — N systems would need N×N wiring. The Signal
Ledger is the **hub**: every system writes signals to one place; KIMMP reads
one place. Nothing in Phases 2–6 can be built without it.

### In scope (this PR only)
1. **`KimmpSignal` model + migration** (`kimmp_signals`):
   - `id`, `sourceModule` (`eqore` | `lead-intelligence` | `alis` | `vis` | `kimmp`)
   - `signalType`, `signalCategory` (`BEHAVIOR` | `INTENT` | `MARKET` | `CONTENT` | `RISK` | `SYSTEM`)
   - `signalValue` (string), `confidence` (0–1), `severity` (`LOW`|`MODERATE`|`HIGH`|`CRITICAL`)
   - `conversationId?`, `leadId?`, `sessionId?`, `metadata` (Json?)
   - `status` (`NEW`|`PROCESSED`|`DISMISSED`), `createdAt`
   - indexed on sourceModule, signalCategory, status, createdAt
2. **`signals/signalLedger.service.ts`** — `record(signal)`, `query(filters)`,
   `markProcessed(id)`.
3. **API** — `POST /api/admin/kangqore-immp/signals` (ingest),
   `GET /signals` (query by module / category / severity / date).
4. **First producer wired** — the behavior shadow observer emits one
   `BEHAVIOR` signal per analysis, so KIMMP's own output is the ledger's first
   live feed.

### Explicitly NOT in scope
The other three producers (eQORE/Lead/ALIS/VIS adapters), the Decision Engine,
and any orchestration — those are Phase 2+.

### Acceptance criteria
- A signal can be POSTed and queried back.
- Every eQORE conversation produces exactly one `BEHAVIOR` signal in the ledger.
- New isolated table, no foreign keys; migration committed, applied via
  `prisma migrate deploy`.
- `tsc` clean; smoke-tested.

### CTO note
Building the ledger pre-launch is reasonable — it is infrastructure, low-risk,
and unblocks everything. But it stays *inert* until there is traffic. If the
choice is "Signal Ledger now" vs "help launch now," launch wins.
