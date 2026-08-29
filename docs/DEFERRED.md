# Deferred Work

Running log of things we consciously skipped, deferred, or hit a wall on — so
they are recoverable later instead of being rediscovered from scratch.

**How to use this file.** Add an entry the moment something is skipped, not
later. Every entry needs: what it is, *why* it was skipped, what unblocks it,
and where the code lives. When an item is done, delete it and note it in the
commit — this file tracks open debt only, not history.

Severity: **P1** = wrong/broken, fix before it reaches users · **P2** = missing
capability with a real cost · **P3** = tidy-up.

Last updated: 2026-08-30

---

## Blocked on accounts or credentials we don't have

### npm + PyPI publishing — Phase 5.2 (P2)

The three packages build, the tag-driven workflow is written, and every name is
still free on both registries. Nothing has been published.

- **Blocked by:** an npm account owning the `@kangqore` org plus `NPM_TOKEN` in
  repo secrets; and a PyPI trusted publisher configured for `kangqore-view-sdk`.
  Both live in accounts only Mahesh can create.
- **Also deliberately held:** publishing is irreversible. npm blocks unpublish
  after 72h; PyPI never allows reusing a version number. Shipping `1.0.0` burns
  it permanently, so this wants an explicit go, not a silent push.
- **Do not publish until** the `baseUrl` default bug below is fixed — otherwise
  every install ships a default pointing at a domain that does not exist.
- **Where:** `packages/`, `.github/workflows/publish-sdks.yml`
- **To unblock:** add the two secrets, then push a tag (`sdk-ts-v1.0.0`,
  `sdk-py-v1.0.0`, `cli-v1.0.0`). The workflow's `dry_run` path works today
  without any secrets if you want to see it pack first.

### No registered domain (P1 for anything public)

Neither domain resolves. Verified against Google DNS (`8.8.8.8`), not just a
local resolver:

```
kangqore.com                 NXDOMAIN
kangqoreview.com             NXDOMAIN
app.kangqoreview.com         NXDOMAIN
developers.kangqoreview.com  NXDOMAIN
```

The platform is entirely local Docker today; nothing is on the public internet.
This is the root cause of several items below, not a Phase 5 gap.

### Third-party API keys still missing

Long-standing, tracked in memory. Each degrades a feature to warnings or stubs:

- `BRAVE_SEARCH_API_KEY` / `SERPER_API_KEY` / `TAVILY_API_KEY` — KIMMP Scout web
  intelligence. Currently logs `All providers failed` on every cycle.
- `PAGESPEED_API_KEY` (or any of the six others) — VIS Outcome Ledger has no
  real data source.
- Anthropic API credits — exhausted; AEGIS debate phase fails with a billing
  error, butler falls back to the local 3B model.
- ElevenLabs — account is on the free plan, so TTS is blocked pending upgrade or
  a vendor swap.

---

## Known defects (wrong, not merely missing)

### SDK `baseUrl` defaults to a non-existent host (P1)

All three packages default to `https://app.kangqoreview.com`, which is NXDOMAIN.
Anyone installing without explicitly passing `baseUrl` gets an opaque DNS
failure.

```
packages/kangqore-sdk-ts/src/index.ts:301   options.baseUrl ?? 'https://app.kangqoreview.com'
packages/kangqore-sdk-py/kangqore_view/__init__.py:39   DEFAULT_BASE_URL = "https://app.kangqoreview.com"
packages/kangqore-cli/bin/kangqore.js:18    process.env.KANGQORE_URL || 'https://app.kangqoreview.com'
```

**Recommended fix:** make `baseUrl` required with no default. An explicit
"baseUrl is required" beats a silent DNS error against a host that may never
exist. Same string also appears in all three READMEs and both package manifests.

### Dependabot: 70 vulnerabilities, 29 high (P1)

Reported on every push, across `/backend`, `/frontend`, `/desktop`. Predates all
recent work and is unaddressed. Mostly `axios`, `electron`, `body-parser`,
`brace-expansion`, `fast-uri`. Shows as a red run on `main` that is easy to
mistake for a build failure — which is exactly how red CI stops being read.

### Webhook delivery has no retry (P2)

`AppWebhookService.dispatch()` attempts once and records the outcome. A target
that is briefly down loses the event permanently; the failure is visible in
`app_webhook_deliveries` but nothing replays it.

- **Where:** `backend/src/kangqore-view/developer/AppWebhookService.ts`
- **Wants:** backoff retry, or a replay endpoint over the recorded rows.

---

## Deliberate scope cuts

### `developers.kangqoreview.com` — Phase 5.1 (P2)

The public developer site was never built. The portal exists but is
internal-only, at `/kangqore-view/admin/developer`.

- **Blocked by:** the domain not existing (above). There is no DNS to point and
  no host to deploy to.
- **Wants, when unblocked:** public docs hosting, self-serve signup, and the
  OAuth consent screen on a public origin.

### Third marketplace surface not unified (P2)

Phase 5 unified published `DeveloperApp`s with the 13 legacy `MarketplaceListing`
rows into one catalog. The existing admin UI still reads a *different* endpoint,
`/admin/kangqore-immp/marketplace`, so two storefronts remain.

- **Where:** `frontend/src/os/features/marketplace/pages/MarketplacePage.tsx:76`
- **Why skipped:** folding it in blind risked breaking a working screen mid-PR.

### Agent missions bypass the Action Engine for schedule changes (P2)

`UPDATE_PROJECT_SCHEDULE` is not one of the 1,090 registered `OntologyAction`s,
so when an approved mission changes a project's due date the executor falls back
to writing `prisma.project.update()` directly. The change is still gated by
approval and recorded on the `AgentProposedAction` row, but it does **not** get
the Action Engine's validation rules, effects, or `ActionExecution` audit trail.

- **Where:** `backend/src/kangqore-view/kimmp/agents/AgentMissionEngine.ts`, the
  `else if (a.targetType === 'Project' …)` branch in `execute()`.
- **Fix:** register `UPDATE_PROJECT_SCHEDULE` as a real action; the engine
  already prefers the registered path when one exists, so no code change needed.

### Only one agent objective is implemented (P2)

`interpretIntent` recognises `RECOVER_AT_RISK_PROJECTS` and `REPORT_STATUS`.
Everything else classifies as `UNKNOWN` and the mission stops cleanly with
`NO_ACTION` rather than guessing — correct behaviour, but it means the agentic
surface currently answers one family of question.

- **Where:** `backend/src/kangqore-view/kimmp/agents/AgentMissionEngine.ts`
- **Note:** parsing is rule-based on purpose — the classification decides whether
  a mission may mutate anything, so it must be inspectable and deterministic. An
  LLM pass belongs *after* that gate, enriching an already-classified goal, not
  deciding the safety question. Preserve that boundary when extending.

### 13 grandfathered ontology gateway bypasses (P2)

`scripts/audit-ontology-write-path.mjs` now blocks new direct writes to
`OntologyObject` / `OntologyRelationship`, but six files were allowlisted so the
gate could be switched on immediately rather than after a large refactor. Five
carry real debt, 13 writes in total:

| File | Writes | Why |
| --- | --- | --- |
| `eof/OntologyPipeline.ts` | 4 | bulk pipeline writes |
| `eof/CanvasOntologyBridge.ts` | 3 | canvas sync |
| `eof/OntologyVersioning.ts` | 3 | version snapshots |
| `eof/OntologyCsvImport.ts` | 2 | bulk CSV import |
| `eof/OntologyBranch.ts` | 2 | branch materialisation |
| `automation/ActionEngine.ts` | 2 | action effects write objects directly |

Each skips data markings, the AEGIS policy gate, cardinality, and CDC emission.
`ActionEngine` is the most significant — it is the main execution path, so an
action effect can currently write an object the schema would reject.

- **Run** `npm run audit:ontology-writes -- --list` to see the current state.
- **Fix:** route through `OntologyGateway` and delete the allowlist entry. The
  gateway now has `deleteObject`, `deleteRelationships`, and
  `retireRelationship`, which is what most of these were missing.

### Legacy listings have no certification path (P3)

The 13 `MarketplaceListing` rows surface with `governanceScore: 0` and no
certified badge, deliberately — they predate certification scoring and inventing
a score would repeat the facade pattern Phase 5 removed. But there is currently
no route for a legacy listing to *earn* a real score.

### `PendingApproval` can't be created for unregistered actions (P3)

`PendingApproval.actionId` is a required FK to `OntologyAction`. When a policy
returns `REQUIRE_APPROVAL` for an app action that isn't in the ontology, no
approval row can be created — the `AppAuditEvent` remains the only record that
execution was held. Correct but asymmetric.

- **Where:** `backend/src/kangqore-view/developer/GovernanceKernel.ts`

---

## Decisions needed before anything ships publicly

### Which domain? (blocks packaging metadata)

The spec says `kangqoreview.com`; the codebase says `kangqore.com` (70
references vs 3). **Neither is registered.** This is baked into package
`homepage`/`Documentation` fields, all three READMEs, and the SDK defaults, so
it wants settling before a publish rather than after.

### CI runtime disagreement (P3)

`os-smoke.yml` pins Node 20 while `deploy.yml` deliberately moved to 22.x with a
comment explaining Node 20 broke the frontend build (`vite@8` needs
`^20.19.0 || >=22.12.0`). Node 20 currently resolves recent enough to work, so
this hasn't bitten — but two workflows disagreeing about the supported runtime
is a trap waiting to spring.

---

## Notes

Standing per-feature blockers also live in the memory index
(`pending-*.md` entries). This file is for work we chose to defer; those are for
environment state. When something moves from "we skipped it" to "it's done,"
delete the entry here rather than marking it complete.
