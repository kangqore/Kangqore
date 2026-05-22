# KIMMP — Status of Record

_Last updated: 2026-05-22_

This is the honest, verified state of KIMMP. It exists so the picture is not
misremembered or overstated.

## What KIMMP actually is today

KIMMP = **Kangqore Intelligence Mind Management Processor.** Right now it is
**two working faculties** — not a mother brain:

1. **Human Behavior Intelligence Layer** — infers behavioral signals from
   conversation text (urgency, stress, skepticism, …) with confidence scores.
2. **Page Factory** — detects missing pages, generates Kangqore-branded pages
   via Claude, and publishes them (admin-gated).

Two corrections that must not drift:

- **KIMMP is NOT a local LLM.** It is a *cloud brain* — it reasons via
  Anthropic/Claude — plus a local *deterministic algorithm* (the Tier-1
  behavior extractor). There is no self-hosted model. This was locked on day 1.
- **KIMMP is NOT yet a "Digital CEO."** A Digital CEO decides and orchestrates.
  KIMMP today only *observes* (behavior) and *produces* (pages). It makes no
  cross-system decisions and commands nothing.

## Built and live

10 PRs merged (#36–#45). 4 tables live on Supabase:
`kimmp_behavior_profiles`, `kimmp_generated_pages`, `kimmp_page_opportunities`,
`kimmp_page_audit`.

- Behavior layer: Tier-1 + Tier-2 analysis, eQORE shadow observation,
  persistence, historical backfill.
- Page Factory: rails, dynamic renderer + admin UI, missing-page detection,
  Claude generation + claim validator, publish workflow (audit + sitemap +
  JSON-LD).
- One pending env switch: `KIMMP_PERSIST=true` (server env) for behavior
  storage. The Page Factory needs nothing further.

## Connection state — KIMMP touches 2 of the 4 systems

| Link | State | How |
|---|---|---|
| **eQORE → KIMMP** | ✅ connected | `eqoreConversation.controller.ts` calls `KimmpEqoreShadowObserver.observe()` per message. **Observe-only** — KIMMP does not change eQORE's replies. |
| **KIMMP → VIS** | ✅ connected (thin) | VIS `SitemapService` includes `kimmp_generated_pages`. One touchpoint. |
| **KIMMP ↔ eQORE Lead Intelligence** | ❌ none | No code link, either direction (verified by grep). |
| **KIMMP ↔ Kangqore ALIS** | ❌ none | No code link, either direction (verified by grep). |

KIMMP is a **connected module — not the connecting brain.**

## Not built (the "connect all four / orchestrate" layer)

Signal Ledger · Decision Engine · Workflow Orchestrator · cross-system signal
producers · ML prediction · RAG · governance/permission/observability ·
Command Center. This is a **roadmap, not a backlog** — see `KIMMP_ROADMAP.md`.

## Honest constraint

The behavior and detection layers are **traffic-gated** — they produce real
value only once eQORE has real visitors. eQORE is pre-launch. The Page Factory's
*generation* works today and can draft launch pages now.

## Next real step

The **Signal Ledger** (Phase 1) is **built** — `kimmp_signals` hub + ingest/query
API + the behavior observer as its first producer. The next real step is
**Phase 2**: wiring eQORE / Lead Intelligence / ALIS / VIS as signal producers
and consumers. See `KIMMP_ROADMAP.md`.
