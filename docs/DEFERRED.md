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
- Anthropic API credits — exhausted; HANUMANAS debate phase fails with a billing
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

Each skips data markings, the HANUMANAS policy gate, cardinality, and CDC emission.
`ActionEngine` is the most significant — it is the main execution path, so an
action effect can currently write an object the schema would reject.

- **Run** `npm run audit:ontology-writes -- --list` to see the current state.
- **Fix:** route through `OntologyGateway` and delete the allowlist entry. The
  gateway now has `deleteObject`, `deleteRelationships`, and
  `retireRelationship`, which is what most of these were missing.

### The Synapse Mesh is dormant (P2)

`kangqore-view/kimmp/synapse/` defines a subsystem signal bus — `SynapseMesh`,
eight registered perceptron nodes (HATHAWAY, NOLAN, HANUMANAS, ALIS, HCIP, EQORE,
VIS, KIMMP) — and **none of it runs**:

- `bootPerceptronNetwork()` is exported and **never called** from anywhere.
- `synapseMesh` has **zero callers** outside its own directory, so no signal is
  ever emitted.

So no node is registered at runtime and no callback ever executes. It reads as
a working neural mesh across subsystems and is inert.

- **Where:** `backend/src/kangqore-view/kimmp/synapse/`
- **Note:** booting it from `index.ts` alone would *not* make it real —
  registration without emitters still does nothing, and would look active while
  being inert. Making it live means both calling `bootPerceptronNetwork()` at
  startup **and** having subsystems actually emit signals at the points where
  cross-subsystem intelligence matters.
- **Discovered:** while naming HATHAWAY (2026-08-30). The `SubsystemType` entry
  and `keos.ts` manifest are real and audited; the mesh registration is not.

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

### Delivery work is not connected to revenue (P1)

Discovered while projecting real records into the enterprise object model
(`EnterpriseProjection.ts`). The two client key spaces are not merely
"unreconciled" — in this database they share **nothing**:

| Check | Result |
|---|---|
| `ClientCRM.projectIds` populated | 0 of 6 rows |
| `ClientCRM.userId` populated | 0 of 6 rows |
| `Project.clientId` matching any CRM row | 0 of 15 |
| CRM company names overlapping project account names | 0 |

So no code can answer "which late project threatens which contract" — not
because the traversal is missing, but because the edge does not exist in the
data. The projection therefore builds two separate sub-graphs (delivery from
`Project`, revenue from `ClientCRM`) and leaves the gap visible rather than
inventing a join, which would make every exposure figure fiction.

Unblocking it is a data decision, not an engineering one: either backfill
`ClientCRM.userId` / `projectIds`, or pick one of the two as canonical. Until
then, project exposure is priced from `Project.budget` (which is real) and
contract exposure from `ClientCRM.arr` (also real), but the two never meet.

### Recovery actions are four, not forty (P3)

`RecoveryActionSeeder.ts` registers only `REBASELINE_TIMELINE`, `ESCALATE_ITEM`,
`FLAG_CAPACITY_REQUEST` and `REVIEW_ITEM`, because those are the only changes
the assessment carries enough information to make. Notably absent is a real
reassignment: nothing in the graph knows who is free, and `StaffMember` has no
FK to `User`, so "reassign to X" cannot be computed. `FLAG_CAPACITY_REQUEST`
deliberately flags the need instead of guessing the person. Any recommendation
that maps to nothing lands on the non-mutating `REVIEW_ITEM`.

Widening this set needs the ownership model resolved first (see the
`StaffMember` ↔ `User` note above).

### Two orphaned legacy Project objects (P4)

An earlier ontology sync mirrored `Project` rows into the graph keyed on the
bare Project id. Seventeen of those objects survive; **fifteen** match live
`Project` rows and are now the authoritative mirror (`EnterpriseProjection`
adopts them rather than creating a parallel set). The remaining **two** point at
Project rows that no longer exist, carry no `title`, and will render as blank
rows on any board over `Project`.

They are pre-existing data, not something the projection created, so they have
been left alone rather than deleted. Removing them is a one-line `deleteMany` on
`externalId` values that match no `Project.id` — worth doing, but it is business
data and should be a deliberate call.


### `Process` as an object type (P3)

§2A of the Monday analysis asks for `Portfolio` and `Process`. Portfolio was
added (tier 4). **Process was deliberately not**, because a repeatable procedure
with steps, owners and dependencies is what `WorkTemplate` already is, and a
parallel type would give two answers to "where is our onboarding process
defined" — the same duplicate-concept problem as `Client`/`Customer` and
`Goal`/`EnterpriseGoal`.

Unblocks when someone can state what a Process holds that a template does not —
a running instance with state, most likely, which would make it an *instance of*
a template rather than a sibling of one.

### Work OS smoke-test fixtures can drift (P3)

`frontend/e2e/work-os.spec.ts` now opens every Work OS screen, but it serves
responses from `work-os.fixtures.json`, captured from the live backend. If an
endpoint's shape changes and the fixtures are not recaptured, the spec keeps
passing against a shape that no longer exists.

Mitigated rather than solved: `api-contract-e2e` asserts the backend still
returns these shapes, so a change there fails the backend probe. The gap is a
change to both sides that leaves the fixtures stale. Recapture with the
snippet in the spec's header comment whenever a Work OS endpoint changes.

### `POST /api/admin/hanumanas/engines/:engine/run` ignores hyphenated slugs (P2)

Found while verifying the HANUMANAS rename — pre-existing, unchanged by it
(the same code shipped as `aegisRoutes.ts` on `main`).

`hanumanasRoutes.ts` does `HanumanasEngineDispatcher.runEngine(engine.toUpperCase())`,
but the registered engine ids use underscores (`GOVERNANCE_OPS`). A request for
`governance-ops` becomes `GOVERNANCE-OPS`, matches nothing, and returns
`{ ran: 0 }` with a 200. The single-agent route (`/agents/:agentId/run`) and the
scheduler are unaffected — they don't go through this path.

Fix: `engine.toUpperCase().replace(/-/g, '_')` in the route handler, or accept
the underscore form. Code: `backend/src/kangqore-view/esf/hanumanas/hanumanasRoutes.ts` ~line 258.


---

## Notes

Standing per-feature blockers also live in the memory index
(`pending-*.md` entries). This file is for work we chose to defer; those are for
environment state. When something moves from "we skipped it" to "it's done,"
delete the entry here rather than marking it complete.
