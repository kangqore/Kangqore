# KIMMP — Roadmap of Further Operations

_Last updated: 2026-05-22 · Companion to `KIMMP_STATUS.md`_

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

### Phase 2 — Connect the four as producers · _IN PROGRESS_ · _Owner: Backend + AI/ML_
**Done:**
- KIMMP → Lead Intelligence (advisory) — `GET /leads/:leadId/behavior` surfaces
  KIMMP's behavioral read + sales posture per lead.
- KIMMP → ALIS (advisory) — `GET /market/behavior-signals` surfaces a
  market-level behavioral snapshot (demand drivers) for executive intelligence.

Both advisory — they expose intelligence; they do not yet mutate the lead score
or ALIS's aggregations (those are later gated steps).

Remaining — each system emits signals into the ledger, and KIMMP feeds back:
- eQORE → ledger (intent, behavior already via KIMMP)
- Lead Intelligence → ledger (lead score, stage) **and** KIMMP behavior signals
  feed lead scoring
- ALIS → ledger (market/demand) **and** KIMMP behavior patterns feed ALIS
- VIS → ledger (content gaps)
- **KIMMP → eQORE influence (PR 2b)** — ✅ BUILT. Behavior shapes eQORE
  responses via a flag-gated framing step (`KIMMP_EQORE_INFLUENCE`, OFF by
  default). Keep it OFF until KIMMP's behavior reading is validated on real
  traffic — enabling it pre-validation puts unvalidated AI in the live chat.
Value-gated on launch traffic.

### Phase 3 — Decision + Workflow engine · _Owner: Backend + Founder_
KIMMP reads the ledger and decides next-best action; a workflow router triggers
the right system. This is the step that makes KIMMP an *orchestrator*. Requires
Founder-defined decision policy + approval matrix.

### Phase 4 — Governance, Permission, Observability, Cost · _Owner: DevOps / Security_
Before any autonomy: per-action permission, human-approval gates, full audit,
OpenTelemetry-style tracing, LLM cost monitoring. Non-negotiable prerequisite
for Phase 5+.

### Phase 5 — ML prediction + RAG · _Owner: AI / ML_
Conversion / ACV / churn / delivery-risk prediction models; a RAG layer so
KIMMP reasons from Kangqore's own verified knowledge. Needs accumulated data
from Phases 2–3.

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
