# RGS Specification — RGS/1.0

**Kangqore Release Governance Specification**
**Document Status:** FROZEN — Release Governance Standard
**Schema Version:** RGS/1.0
**Issued:** 2026-07-02
**Frozen:** 2026-07-03
**Supersedes:** None (inaugural version)
**Relationship to QEF:** RGS/1.0 depends on QEF/1.0. A valid QEF certificate is a prerequisite for any production deployment decision. RGS does not replace or modify QEF.

> RGS/1.0 is a stable internal governance standard. Changes to the deployment decision model, approval policy, blocker list, API contracts, or provenance schema require a new schema version (RGS/1.1 or RGS/2.0). Bug fixes and documentation clarifications do not require a version bump.

---

## 1. Purpose and Scope

### 1.1 Purpose

The Kangqore Release Governance Specification (RGS) governs deployment decisions for certified Kangqore View builds.

RGS answers one question:

> **Should this certified build be deployed into this environment right now?**

That is the only question RGS answers. It does not re-evaluate engineering quality — that is QEF's domain. It does not measure business outcomes — that is Gate 8's domain. It evaluates the operational context of a specific deployment moment against a specific environment's policy, and produces an immutable, auditable verdict.

### 1.2 Scope

RGS applies to all deployments of Kangqore View to any managed environment. It covers:

- Pre-deployment decision evaluation (preflight + formal evaluation)
- Deployment authorization and electronic sign-off
- Deployment record creation with provenance chain
- Rollback authorization and readiness verification
- Emergency override policy (two-approver requirement)
- Change window enforcement
- Flight Recorder integration for full event replay
- Executive Release Gate — 6-domain executive summary

RGS does not cover:
- Engineering quality assessment (see QEF-SPEC)
- Feature flags and partial rollouts
- Infrastructure provisioning
- CI/CD pipeline configuration (RGS is a gate within the pipeline, not the pipeline itself)
- Business outcome measurement (planned — Gate 8)

### 1.3 Position in the Certification Flow

```
QEF Certification                      ← QEF/1.0
(engineering standard — is this build good?)
        ↓
Release Governance                     ← RGS/1.0 (this document)
(operational decision — should it ship right now, to this environment?)
        ↓
Deployment Record
(immutable evidence — what was deployed, by whom, when, with what outcome)
        ↓
Platform Flight Recorder               ← integrated at RGS/1.0
(replay — every deployment event replayable in chronological order)
        ↓
Operational Intelligence               ← Gate 8 (planned)
(business outcomes — did shipping this improve the enterprise?)
```

A build can be QEF Certified while simultaneously receiving an RGS BLOCK verdict (e.g. during a change freeze or active P0 incident). These are orthogonal verdicts from separate governance layers.

### 1.4 Relationship to the Six Platform Standards

RGS is the sixth and outermost layer of the Kangqore platform governance stack:

```
WAANDA Intelligence Studio
        ↓
WAOE
        ↓
WAANDA Runtime
        ↓
AEGIS
        ↓
QEF
        ↓
RGS                                    ← RGS/1.0
```

Every other system — industry packs, connectors, dashboards, agents, templates — operates inside this governance envelope rather than above or around it.

---

## 2. Deployment Decision Model

### 2.1 Verdicts

Every release evaluation produces exactly one of three verdicts:

| Verdict | Meaning | Required Action |
|---|---|---|
| `DEPLOY` | All checks pass. Deployment is authorized. | Proceed to deployment |
| `REVIEW` | No blockers, but warnings require human review. | Escalate to authorized reviewer before deploying |
| `BLOCK` | One or more blockers are present. Deployment is not authorized. | Do not proceed. Resolve blockers and re-evaluate. |

### 2.2 Verdict Determination

```
if any BLOCKER factor is present:
    verdict = BLOCK

else if any WARNING factor is present:
    verdict = REVIEW

else:
    verdict = DEPLOY
```

Verdicts are **deterministic**. The same inputs always produce the same verdict. Human judgment enters through the approval process — which is an input to evaluation, not a post-hoc override of the algorithm.

Unlike QEF, RGS does not produce a numeric score. The decision is binary at the blocker level. This is deliberate: a deployment decision must be unambiguous. Scores invite negotiation; DEPLOY/REVIEW/BLOCK does not.

### 2.3 Decision Record Schema

Every evaluation produces an immutable `DeploymentDecision` record, regardless of verdict. A BLOCK is as important to audit as a DEPLOY.

```typescript
interface DeploymentDecision {
  decisionId:       string   // RGS-{YEAR}-{NNNNNN} — sequential, unique, permanent
  rgsVersion:       string   // "RGS/1.0"
  verdict:          'DEPLOY' | 'REVIEW' | 'BLOCK'
  certId:           string   // QEF certificate that authorized this evaluation
  certLevel:        string   // certification level at evaluation time
  environmentId:    string   // target environment (FK → DeploymentEnvironment)
  blockers:         DecisionFactor[]
  warnings:         DecisionFactor[]
  approvals:        Approval[]
  emergencyOverride: boolean
  overrideReason?:  string
  evaluatedBy:      string   // "WAANDA Release Engine"
  evaluatedAt:      string   // ISO 8601
  validUntil:       string   // ISO 8601 — decision expires; must re-evaluate after
  sha256:           string   // SHA-256 of decision data at issuance — tamper-evident
}

interface DecisionFactor {
  id:          string   // stable factor identifier (e.g. "CERT_REQUIRED")
  category:    'CERTIFICATION' | 'RUNTIME' | 'ENVIRONMENT' | 'POLICY' | 'APPROVAL'
  severity:    'BLOCKER' | 'WARNING'
  description: string
  evidence?:   Record<string, unknown>
}
```

### 2.4 Decision Expiry

Release decisions are time-bound. A DEPLOY verdict issued at 09:00 does not authorize a deployment at 23:00 — the environment may have changed.

| Environment | Decision Validity Window |
|---|---|
| Development | 8 hours |
| Staging | 4 hours |
| Production | 2 hours |

An expired decision must not be used to authorize a deployment. Re-evaluation is required. The `DeploymentRecord` service enforces this at write time.

### 2.5 Decision Sequential ID Format

`RGS-{YYYY}-{NNNNNN}` — year-scoped, padded to six digits, incrementing from 000001 per year. IDs are assigned at write time and never reused.

---

## 3. Environment Model

### 3.1 Environment Definitions

Three environments are defined at RGS/1.0:

| Environment | Code | Purpose |
|---|---|---|
| Development | `dev` | Local / dev server; fast iteration; minimal governance |
| Staging | `staging` | Pre-production validation; moderate governance |
| Production | `production` | Live system; strictest governance |

### 3.2 Environment Policy Matrix

| Rule | Development | Staging | Production |
|---|---|---|---|
| QEF certificate required | No | Yes | Yes |
| Minimum certificate level | — | CERTIFIED (≥ 75) | ADVANCED_CERTIFIED (≥ 85) |
| Recommended certificate level | — | ADVANCED_CERTIFIED | ENTERPRISE_CERTIFIED |
| Human approval required | No | No | Yes |
| Change window enforced | No | No | Yes |
| P0/P1 incident check | No | Yes | Yes |
| Rollback readiness required | No | Warning | Warning |
| Decision validity | 8 hours | 4 hours | 2 hours |

### 3.3 Environment Record Schema

```typescript
interface DeploymentEnvironment {
  id:                  string
  name:                string         // "Production"
  code:                string         // "production" | "staging" | "dev"
  certRequired:        boolean
  minCertLevel:        string | null  // "CERTIFIED" | "ADVANCED_CERTIFIED" | "ENTERPRISE_CERTIFIED"
  approvalRequired:    boolean
  changeWindowEnabled: boolean
  changeWindows:       ChangeWindow[]
  criticalServices:    string[]       // service identifiers that BLOCK if unavailable
  decisionValidityMs:  number
  enabled:             boolean
}

interface ChangeWindow {
  daysOfWeek: number[]   // 0 = Sun, 1 = Mon … 6 = Sat (UTC)
  startHour:  number     // UTC hour (0–23)
  endHour:    number     // UTC hour (exclusive)
  timezone?:  string     // IANA identifier (informational; evaluation uses UTC)
}
```

Environments are persisted records, not configuration files. Policy changes require updating the `DeploymentEnvironment` record, which is audited.

---

## 4. Approval Model

### 4.1 Approval Requirement by Environment

| Approval Scenario | Environments | Who May Approve |
|---|---|---|
| Standard deployment to dev | None | — |
| Standard deployment to staging | None | — |
| Standard deployment to production | 1 approver required | Release Authority |
| Emergency override (any BLOCK) | 2 approvers required | Release Authority + Release Authority |

### 4.2 Electronic Sign-off

Every approval is an electronically recorded attestation with the following schema:

```typescript
interface Approval {
  approver:   string   // full name of the approving person
  role:       string   // e.g. "CTO", "Release Authority", "Engineering Lead"
  approvedAt: string   // ISO 8601 timestamp at sign-off
}
```

Approvals are stored as an immutable array on the `DeploymentDecision` record. They cannot be removed or modified after the decision is created.

### 4.3 Approval as an Input, Not an Override

Production approval is a **required input** to the release evaluator. Providing a named approver when submitting the evaluation to `POST /admin/release/evaluate` satisfies the `APPROVAL_REQUIRED` factor before the verdict is computed — it does not override a verdict already computed without approval. This means the approval is embedded in the evidence chain, not layered on top of it.

### 4.4 Approval History

The `GET /admin/release/decisions` endpoint returns the full `approvals` array for every decision. The Executive Release Gate UI surfaces the approval chain with approver name, role, and timestamp per signatory, making the sign-off history permanently visible without requiring access to raw database records.

---

## 5. Change Window Rules

### 5.1 Change Window Definition

A change window is a recurring time period during which deployments to a specific environment are permitted. Outside of declared change windows, deployment is blocked.

Change windows are declared per-environment on the `DeploymentEnvironment` record (see §3.3).

The Production environment in RGS/1.0 declares:

```
Monday through Friday, 04:00–14:00 UTC
(09:30–19:30 IST)
```

### 5.2 Change Window Evaluation

Change window compliance is evaluated at the moment of `POST /admin/release/evaluate`. If the current UTC time does not fall within any declared window for the environment, the factor `OUTSIDE_CHANGE_WINDOW` is added as a BLOCKER.

```
factor: OUTSIDE_CHANGE_WINDOW
category: POLICY
severity: BLOCKER
description: "Deployment is outside the declared change window for {env}"
evidence: { windows: ChangeWindow[] }
```

### 5.3 Change Freeze

A change freeze is distinct from the change window schedule. A freeze is an out-of-band declaration that overrides the standard change window schedule, blocking all deployments regardless of whether the current time would otherwise be in-window. Freezes are declared as a separate policy record (`CHANGE_FREEZE_ACTIVE` factor).

Common freeze triggers:
- Mobile release branch cut (downstream dependency)
- Major client go-live (blackout period)
- Regulatory audit in progress
- Confirmed security incident under active investigation

### 5.4 Change Freeze Indicator (UI)

The Executive Release Gate page renders a live indicator showing whether the current moment is inside or outside the active change window. When outside, the indicator displays the time until the next window opens, computed from the `changeWindows` configuration on the environment record.

---

## 6. Blocking Criteria

### 6.1 Blocking Factors (any one = BLOCK)

| Factor ID | Category | Condition |
|---|---|---|
| `CERT_REQUIRED` | CERTIFICATION | No active QEF certificate found for this certId |
| `CERT_REVOKED` | CERTIFICATION | Certificate status is REVOKED |
| `CERT_NOT_ACTIVE` | CERTIFICATION | Certificate is in DRAFT status — not yet approved |
| `CERT_LEVEL_INSUFFICIENT` | CERTIFICATION | Certificate level below environment minimum |
| `P0_INCIDENT_ACTIVE` | RUNTIME | A P1-CRITICAL incident is open (mapped to P0 in RGS) |
| `P1_INCIDENT_ACTIVE` | RUNTIME | A P2-HIGH incident is open (mapped to P1 in RGS) |
| `OUTSIDE_CHANGE_WINDOW` | POLICY | Deployment is outside the declared change window |
| `CHANGE_FREEZE_ACTIVE` | POLICY | A change freeze is declared for this environment |
| `APPROVAL_REQUIRED` | APPROVAL | Environment requires human approval — none provided |
| `ENVIRONMENT_CRITICAL_DOWN` | ENVIRONMENT | Critical infrastructure component unavailable |

### 6.2 Warning Factors (any one without blockers = REVIEW)

| Factor ID | Category | Condition |
|---|---|---|
| `CERT_LEVEL_ADVISORY` | CERTIFICATION | Level meets minimum but is below recommended |
| `CERT_SUPERSEDED` | CERTIFICATION | Certificate has been superseded by a newer one |
| `CERT_AGE_ADVISORY` | CERTIFICATION | Certificate is older than 72 hours |
| `RUNTIME_DEGRADED` | RUNTIME | Runtime health score below target threshold |
| `ROLLBACK_UNKNOWN` | ENVIRONMENT | No prior successful deployment exists in this environment |
| `ROLLBACK_DEGRADED` | ENVIRONMENT | Prior deployment's certificate has been REVOKED |
| `P2_INCIDENT_ACTIVE` | RUNTIME | A P3-MEDIUM incident is open (P2 in RGS terms) |

### 6.3 Incident Priority Mapping

The Incident registry uses a different priority scale from RGS. The mapping is:

| Incident Priority | RGS Factor | Severity |
|---|---|---|
| P1-CRITICAL | `P0_INCIDENT_ACTIVE` | BLOCKER |
| P2-HIGH | `P1_INCIDENT_ACTIVE` | BLOCKER |
| P3-MEDIUM | `P2_INCIDENT_ACTIVE` | WARNING |
| P4-LOW | Not evaluated | — |

---

## 7. Override and Emergency Release Policy

### 7.1 Standard REVIEW Path

When the verdict is REVIEW, an authorized reviewer may approve the deployment after reviewing the warnings. This is the designed approval path — not an override. The approver's identity and timestamp are embedded in the decision record.

### 7.2 Emergency Override (BLOCK → DEPLOY)

A BLOCK verdict cannot be overridden by a single approver. Emergency deployment is only permitted when all of the following are simultaneously true:

1. **Two named approvers** sign the override — their names and timestamps are embedded in the new decision record
2. **A written reason** is provided explaining which blocker is being overridden and why it is safe to proceed
3. **The blocking factor must be overridable** — see §7.3
4. The override is recorded in AEGIS as `DEPLOYMENT_EMERGENCY_OVERRIDE` immediately, before any deployment begins

The emergency override creates a new `DeploymentDecision` with verdict `DEPLOY`, `emergencyOverride: true`, and the original blockers preserved as warnings in the audit trail. The original BLOCK decision is never modified.

### 7.3 Non-Overridable Blockers

The following blockers cannot be overridden under any circumstances:

| Factor ID | Reason |
|---|---|
| `CERT_REVOKED` | Deploying a revoked certificate knowingly deploys invalidated engineering evidence — no human authorization can legitimize this |
| `CERT_REQUIRED` | No evidence baseline exists; any deployment would be completely ungoverned |

Attempting to override a decision containing either factor will fail with a descriptive error referencing this section.

### 7.4 Post-Override Review

Every emergency override triggers a mandatory post-release review within 48 hours. The review must:
- Confirm the override reason was valid
- Record the deployment outcome
- Determine whether the blocker that was overridden has since been resolved
- Identify whether process changes are needed to prevent the emergency pattern recurring

---

## 8. Rollback Policy

### 8.1 A Rollback is a Deployment

A rollback is a deployment of a previous build to a managed environment. It is therefore subject to the same RGS evaluation as any other deployment. There is no "rollback mode" that bypasses governance.

The `DeploymentRecord` for a rollback sets `rollbackOf` to the `deployId` of the deployment being reversed.

### 8.2 Rollback Readiness Pre-check

Before a rollback is authorized, RGS verifies:

1. The deployment being rolled back exists in the ledger
2. A prior successful deployment (`outcome: 'SUCCESS'`) exists in the same environment — this is the state being restored
3. The prior deployment's QEF certificate has not been REVOKED — restoring it would redeploy invalidated evidence

If any of these checks fails, the rollback is rejected with a descriptive error. There is no bypass path.

### 8.3 Fast-Track Rollback

When the readiness pre-check passes, a rollback proceeds on a fast-track basis:

- A new `DeploymentDecision` with verdict `DEPLOY` is created automatically
- The prior successful deployment's certId is used as the certificate reference
- The single `authorizedBy` name is recorded as the approver
- Change window enforcement is bypassed (rollbacks are urgent by definition)
- AEGIS receives a `DEPLOYMENT_ROLLBACK_INITIATED` event

### 8.4 Rollback Triggers

RGS governs rollback authorization; it does not trigger rollbacks autonomously. Human judgment is required to decide when to roll back. Common triggers:

- Deployed build generating P0 or P1 incidents
- Material metric regression detected within 2 hours of deployment
- Critical security vulnerability identified post-deployment

---

## 9. Deployment Provenance Model

### 9.1 Chain of Custody

Every deployment creates an immutable, traceable chain from engineering evidence to operational event:

```
Build artifact
  → QEF Certificate (certId: QEF-{YEAR}-{NNNNNN})
      → Git Commit (gitCommit: sha)
      → Docker Image (dockerImage: image:tag)
      → Gate Evidence (gateSnapshot: per-gate scores)
    → RGS Decision (decisionId: RGS-{YEAR}-{NNNNNN})
        → Approvals (name, role, timestamp per signatory)
      → Deployment Record (deployId: DEP-{YEAR}-{NNNNNN})
          → Outcome (SUCCESS | FAILED | ROLLED_BACK)
          → Outcome Note
        → AEGIS Audit Log (every event, immutable)
        → Platform Flight Recorder (replay timeline)
```

### 9.2 Deployment Record Schema

```typescript
interface DeploymentRecord {
  deployId:      string   // DEP-{YEAR}-{NNNNNN}
  rgsVersion:    string   // "RGS/1.0"
  decisionId:    string   // FK → DeploymentDecision
  certId:        string   // FK → QEFCertificate
  certLevel:     string   // level at deployment time
  environmentId: string   // FK → DeploymentEnvironment
  deployedBy:    string   // named person who initiated the deployment
  deployedAt:    string   // ISO 8601
  rollbackOf?:   string   // deployId of the deployment this reverses
  outcome?:      'SUCCESS' | 'FAILED' | 'ROLLED_BACK'
  outcomeAt?:    string   // ISO 8601
  outcomeNote?:  string
  sha256:        string   // tamper-evident hash of record content
}
```

### 9.3 Provenance API

The full provenance chain for any deployment is available via:

```
GET /admin/release/deployments/:deployId/provenance

Returns: {
  deployId, rgsVersion, decisionId, verdict, emergencyOverride, approvals,
  certId, certLevel, certScore, certIssuedAt, certifiedBy,
  gitCommit, dockerImage,
  environment, deployedBy, deployedAt, outcome,
  rollbackOf,
  sha256Deploy, sha256Decision
}
```

### 9.4 SHA-256 Integrity

Every `DeploymentDecision` and `DeploymentRecord` is issued with a SHA-256 hash of its content at creation time. This hash is stored on the record and exposed in the provenance API, enabling independent verification that records have not been modified after issuance.

### 9.5 Sequential ID Format

- Release decisions: `RGS-{YYYY}-{NNNNNN}`
- Deployment records: `DEP-{YYYY}-{NNNNNN}`

Year-scoped, padded to six digits, incrementing from 000001 per year. IDs are assigned at write time and never reused or recycled.

---

## 10. Certificate Requirements

### 10.1 QEF Certificate as a Prerequisite

Every RGS evaluation requires a QEF certificate reference (`certId`). This links the operational deployment decision to its engineering evidence.

The certificate must satisfy:

| Check | Rule |
|---|---|
| Exists | A certificate with the given `certId` must exist in the QEF ledger |
| Status | Certificate status must be `ACTIVE` — `DRAFT`, `REVOKED`, `SUPERSEDED`, and `EXPIRED` are all blocking |
| Level | Certificate level must meet or exceed the environment's `minCertLevel` |
| Age | Certificates older than 72 hours generate a `CERT_AGE_ADVISORY` warning |

### 10.2 Certificate Level Requirements by Environment

| Environment | Minimum Level | Recommended Level |
|---|---|---|
| Development | None (no cert required) | — |
| Staging | `CERTIFIED` (score ≥ 75) | `ADVANCED_CERTIFIED` |
| Production | `ADVANCED_CERTIFIED` (score ≥ 85) | `ENTERPRISE_CERTIFIED` |

### 10.3 Certificate Immutability Contract

RGS never modifies a QEF certificate. It only references certificates by `certId`. The certificate is owned by QEF/1.0; RGS has read-only access to it.

---

## 11. Flight Recorder Integration

### 11.1 RGS as an Event Source

Every RGS operation emits structured events to the Platform Flight Recorder — the platform-wide chronological event replay system. Events from RGS are tagged with `source: 'RGS'` and appear in the unified timeline alongside KIMMP, AEGIS, QEF, Workflow, and Incident events.

### 11.2 RGS Event Types in the Flight Recorder

| Flight Event Type | Trigger | Key Data |
|---|---|---|
| `DEPLOYMENT_AUTHORIZED` | Evaluation completes with DEPLOY verdict | decisionId, certId, environment, approver |
| `DEPLOYMENT_BLOCKED` | Evaluation completes with BLOCK verdict | decisionId, certId, environment, blockers |
| `DEPLOYMENT_EXECUTED` | DeploymentRecord created | deployId, certId, deployedBy, environment |
| `DEPLOYMENT_COMPLETED` | Outcome recorded (success/fail) | deployId, outcome, outcomeNote |
| `DEPLOYMENT_EMERGENCY_OVERRIDE` | Override applied to BLOCK decision | decisionId, approvers, reason |
| `DEPLOYMENT_ROLLBACK_INITIATED` | Rollback authorized | deployId, rollbackOf, authorizedBy, reason |

### 11.3 AEGIS Audit Layer

All Flight Recorder events from RGS are written through the AEGIS ledger (`AegisLedger.logDeployment()`), which guarantees:
- Immutability — audit entries cannot be deleted or modified
- Real-time broadcast — live AEGIS feed surfaces events immediately to admin sockets
- Query surface — all events are queryable by `system: 'RGS'`, `eventType`, and time range

### 11.4 Replay

The Platform Flight Recorder enables chronological replay of all RGS events. A release manager can replay the full sequence of a production deployment — evaluation, approval, deployment, and outcome — as a timestamped event stream, enabling post-incident analysis without relying on memory or informal logs.

### 11.5 Eventual Event Bus Architecture

RGS/1.0 writes directly to AEGIS and the Flight Recorder aggregation layer. A future version may introduce a dedicated event bus between source systems and the Flight Recorder store, enabling:
- Lower-latency event indexing
- Cross-source event correlation (e.g. "this deployment caused this incident")
- Real-time streaming to Mission Control and Analytics

This migration, when it happens, will be backward-compatible: existing events will remain queryable, and the `source: 'RGS'` tag will remain stable.

---

## 12. Executive Release Gate

### 12.1 Purpose

The Executive Release Gate is the primary UI surface of RGS. It is designed for CTOs, release managers, and engineering leaders — not for engineers reading individual gate scores.

It answers:
- **Should we deploy?** — DEPLOY / REVIEW / BLOCK, recommended action
- **How confident are we?** — Deploy Confidence % (0–100)
- **Why?** — Primary Positive Factors and Primary Risks
- **Across what dimensions?** — 6-domain executive summary

### 12.2 Six Executive Domains

| Domain | Gates | Signals |
|---|---|---|
| Architecture | G1 (Architecture) · G2 (API Contract) | Gate scores averaged |
| Quality | QEF Overall Score | Cert level + score |
| Security | G5 (Security Clearance) | Gate score |
| Performance | G3 (Performance) · G3.5 (Data Integrity) | Gate scores averaged |
| Operational | G4 (Reliability) · G6 (Operational Readiness) · Runtime | Gate scores + incident factors |
| Enterprise | G8 (Enterprise Readiness) · Policy | Gate score + policy factors |

Each domain shows `PASS`, `WARN`, or `FAIL`.

### 12.3 Deploy Confidence Formula

```
confidence = certScore
           - (domainFails × 12)
           - (domainWarns × 4)
           - (domainUnknowns × 6)
           - (blockerCount × 8)
           - (warningCount × 2)

clamped to [0, 100]
```

Where `certScore` is the QEF overall score (0–100). A perfect build with no factors → 100% confidence. A build with a BLOCK blocker typically produces < 70%.

### 12.4 Why? Panel

The Executive Release Gate includes a "Why?" panel that explains the confidence score in plain language:

- **Primary Positive Factors** — derived from what is present and passing (cert level, runtime health, policy compliance, domain passes)
- **Primary Risks** — derived from active factors (blockers and warnings) and domain failures

This panel is the primary output for executive communication. The percentage is a signal; the explanation is the substance.

---

## 13. Public API Contracts (Stable — RGS/1.0)

The following endpoints are declared stable as of RGS/1.0. They may not be changed in a backward-incompatible way without incrementing to RGS/1.1 or RGS/2.0.

```
POST /admin/release/evaluate
     Body:    { certId: string, environment: string, approver?: string }
     Returns: DeploymentDecision
     Purpose: Evaluate whether to deploy. Does not start deployment.
              If environment requires approval and approver is absent,
              APPROVAL_REQUIRED blocker is included in the verdict.

POST /admin/release/deploy
     Body:    { decisionId: string, deployedBy: string }
     Returns: DeploymentRecord
     Purpose: Record that a deployment happened against a valid, non-expired decision.
              Fails if decision is expired, verdict is not DEPLOY, or decision not found.

POST /admin/release/outcome
     Body:    { deployId: string, outcome: 'SUCCESS'|'FAILED'|'ROLLED_BACK', outcomeNote?: string }
     Returns: DeploymentRecord (updated)
     Purpose: Record the outcome of a deployment after it completes.

POST /admin/release/rollback
     Body:    { rollbackOfDeployId: string, authorizedBy: string, reason: string }
     Returns: DeploymentRecord (rollback record)
     Purpose: Authorize and record a rollback. Readiness pre-check is enforced.
              Fails if no prior successful deployment exists, or if its cert is REVOKED.

POST /admin/release/override
     Body:    { decisionId: string, approver1: string, approver2: string, reason: string }
     Returns: DeploymentDecision (verdict=DEPLOY, emergencyOverride=true)
     Purpose: Emergency override of a BLOCK verdict. Two approvers required.
              Fails if either blocker is CERT_REQUIRED or CERT_REVOKED (non-overridable — §7.3).

GET  /admin/release/environments
     Returns: DeploymentEnvironment[]
     Purpose: List configured environments and their policy rules.

GET  /admin/release/environments/:code/status
     Query:   ?certId=
     Returns: { environment, factors: DecisionFactor[], previewVerdict, cert }
     Purpose: Live preflight — evaluate factors without creating a decision record.
              Refreshed every 30 seconds in the UI.

GET  /admin/release/decisions
     Query:   ?environment=&limit=20
     Returns: DeploymentDecision[] (most recent first, includes approvals)

GET  /admin/release/deployments
     Query:   ?environment=&limit=20
     Returns: DeploymentRecord[] (most recent first, includes decision and environment)

GET  /admin/release/deployments/:deployId/provenance
     Returns: Full provenance record (see §9.3)
     Purpose: Complete chain of custody: deploy → decision → cert → git → docker → integrity hashes

GET  /admin/release/incidents
     Returns: Incident[] (active and recently resolved)

POST /admin/release/incidents
     Body:    { title, priority, description? }
     Returns: Incident
     Purpose: Declare a new incident. P1-CRITICAL and P2-HIGH automatically block deployment.

PATCH /admin/release/incidents/:id/resolve
     Body:    { resolution }
     Returns: Incident (updated)
     Purpose: Resolve an incident. Immediately clears corresponding RGS blockers on next preflight.
```

---

## 14. Compatibility Policy

### 14.1 Schema Versions

RGS schema versions follow the format `RGS/{major}.{minor}`.

**RGS/1.x — backward-compatible changes (no migration required):**
- Adding optional fields to `DeploymentDecision` or `DeploymentRecord`
- Adding new `DecisionFactor` identifiers (new warnings or blockers)
- Adding new environment codes
- Extending `ChangeWindow` configuration
- Adding new Flight Recorder event types
- Adding new API endpoints

**RGS/2.x — breaking changes (migration required):**
- Changing verdict values or their semantics
- Changing the SHA-256 computation inputs
- Removing or renaming fields on `DeploymentDecision` or `DeploymentRecord`
- Changing the non-overridable blocker list (§7.3)
- Changing environment minimum certification level defaults
- Changing the `DEP-` or `RGS-` ID formats

### 14.2 Relationship to QEF Versioning

RGS/1.0 depends on QEF/1.0 certificate schema. If QEF moves to a breaking schema version, RGS must be reviewed for compatibility. The `certId` reference in deployment records must always be interpretable against the QEF schema version that was current at deployment time. Both versions are recorded: `rgsVersion` on every RGS record, `qefSchemaVersion` on every certificate.

### 14.3 Older Record Interpretation

Deployment decisions and records issued under an older RGS version are permanently interpretable under the schema version they were issued with. The `rgsVersion` field on every record identifies which rule set applies. No record is ever deleted or migrated to a newer format.

---

## 15. Lifecycle and Versioning

### 15.1 RGS/1.0 Freeze Declaration

RGS/1.0 is declared **FROZEN** as of 2026-07-03. The following are permanently fixed and may not be changed without a new schema version:

| Component | Frozen |
|---|---|
| Verdict values: `DEPLOY`, `REVIEW`, `BLOCK` | ✅ |
| Factor categories: `CERTIFICATION`, `RUNTIME`, `ENVIRONMENT`, `POLICY`, `APPROVAL` | ✅ |
| Factor severities: `BLOCKER`, `WARNING` | ✅ |
| Blocker factor IDs (§6.1) | ✅ |
| Warning factor IDs (§6.2) | ✅ |
| Non-overridable blockers: `CERT_REQUIRED`, `CERT_REVOKED` | ✅ |
| Decision ID format: `RGS-{YYYY}-{NNNNNN}` | ✅ |
| Deployment ID format: `DEP-{YYYY}-{NNNNNN}` | ✅ |
| Environment codes: `dev`, `staging`, `production` | ✅ |
| SHA-256 computation inputs | ✅ |
| Deploy Confidence formula (§12.3) | ✅ |
| API contracts (§13) | ✅ |
| Incident priority mapping (§6.3) | ✅ |

### 15.2 Milestone Record

| Milestone | Status | Date |
|---|---|---|
| QEF v1.0 — Frozen Engineering Standard | ✅ Complete | 2026-07-02 |
| RGS v1.0 — Frozen Release Governance Standard | ✅ Complete | 2026-07-03 |

### 15.3 Implementation Status

| Component | Status |
|---|---|
| `DeploymentEnvironment` model + seeded defaults | ✅ Complete |
| `DeploymentDecision` service + evaluator | ✅ Complete |
| `DeploymentRecord` service + outcome tracking | ✅ Complete |
| Non-overridable blocker enforcement | ✅ Complete |
| Emergency override (2-approver) | ✅ Complete |
| Change window policy + live indicator | ✅ Complete |
| Rollback authorization + readiness pre-check | ✅ Complete |
| Incident registry integration (P0/P1 blocking) | ✅ Complete |
| AEGIS audit integration (5 event types) | ✅ Complete |
| Executive Release Gate UI (6 domains) | ✅ Complete |
| Deploy Confidence % | ✅ Complete |
| Why? panel (positive factors + risks) | ✅ Complete |
| Electronic sign-off form (named approver) | ✅ Complete |
| Approval history panel | ✅ Complete |
| Deployment provenance chain + API | ✅ Complete |
| SHA-256 integrity on all records | ✅ Complete |
| Platform Flight Recorder integration | ✅ Complete |
| G7 Mission Control page (G7Page) | ✅ Complete |
| Canary / partial rollout governance | Future (RGS/1.1) |
| Dependency health monitoring | Future (RGS/1.1) |
| ECDSA digital signature on decisions | Future (RGS/2.0) |
| Gate 8 — Operational Intelligence | Planned |

### 15.4 Addition Rules for Post-Freeze

Any addition to this platform after the RGS/1.0 freeze must improve one of:
- **Outcomes** — measurably better business or engineering results
- **User experience** — meaningfully simpler or more powerful for the operator
- **Reliability** — meaningfully more stable or trustworthy

Additions that do not improve any of these three dimensions will not be approved, regardless of technical interest.

---

## 16. Stable Contracts (Summary)

The following are declared **stable** as of RGS/1.0:

### Verdict Values
`DEPLOY`, `REVIEW`, `BLOCK`

### Factor Categories
`CERTIFICATION`, `RUNTIME`, `ENVIRONMENT`, `POLICY`, `APPROVAL`

### Factor Severities
`BLOCKER`, `WARNING`

### Blocker Factor IDs
`CERT_REQUIRED`, `CERT_REVOKED`, `CERT_NOT_ACTIVE`, `CERT_LEVEL_INSUFFICIENT`, `P0_INCIDENT_ACTIVE`, `P1_INCIDENT_ACTIVE`, `OUTSIDE_CHANGE_WINDOW`, `CHANGE_FREEZE_ACTIVE`, `APPROVAL_REQUIRED`, `ENVIRONMENT_CRITICAL_DOWN`

### Warning Factor IDs
`CERT_LEVEL_ADVISORY`, `CERT_SUPERSEDED`, `CERT_AGE_ADVISORY`, `RUNTIME_DEGRADED`, `ROLLBACK_UNKNOWN`, `ROLLBACK_DEGRADED`, `P2_INCIDENT_ACTIVE`

### Non-Overridable Blockers
`CERT_REVOKED`, `CERT_REQUIRED`

### Record ID Formats
`RGS-{YYYY}-{NNNNNN}` (decisions), `DEP-{YYYY}-{NNNNNN}` (deployments)

### Environment Codes
`dev`, `staging`, `production`

### Deploy Confidence Formula
`clamp(certScore − (domainFails×12) − (domainWarns×4) − (unknowns×6) − (blockers×8) − (warnings×2), 0, 100)`

### Executive Domain Names
`Architecture`, `Quality`, `Security`, `Performance`, `Operational`, `Enterprise`

---

## 17. Glossary

**Release Decision** — the immutable verdict (DEPLOY/REVIEW/BLOCK) produced by evaluating a build and environment against RGS criteria at a specific moment in time

**Deployment Record** — the immutable record of an actual deployment event, linked to both a QEF certificate and an RGS decision, with tamper-evident SHA-256 hash

**Decision Factor** — a single signal contributing to the release evaluation, classified as BLOCKER (prevents deployment) or WARNING (requires review)

**Change Window** — a recurring time period during which deployments to a specific environment are permitted

**Change Freeze** — an out-of-band declaration blocking all deployments to an environment regardless of the standard change window schedule

**Emergency Override** — the two-approver process by which a BLOCK verdict is overridden; permanently logged to AEGIS; subject to 48-hour post-release review

**Rollback** — a deployment of a previous build to reverse the current deployment; governed by full RGS evaluation with readiness pre-check

**Fast-Track Rollback** — a rollback against a known-good prior deployment, bypassing change window enforcement with reduced approval requirements

**Release Authority** — a designated role with permission to authorize production deployments and emergency overrides

**WAANDA Release Engine** — the automated evaluator that collects inputs and computes the release verdict

**Deployment Provenance** — the complete chain of custody from build artifact through QEF certification through RGS decision through deployment outcome and AEGIS audit

**Platform Flight Recorder** — the chronological event replay system that aggregates RGS events alongside KIMMP, AEGIS, QEF, Workflow, and Incident events into a replayable timeline

**Executive Release Gate** — the CTO-facing dashboard showing 6-domain status, Deploy Confidence %, and the "Why?" explanation panel

**Deploy Confidence %** — a single numeric signal (0–100) derived from the QEF certification score adjusted for domain failures, policy blockers, and active warnings

---

*RGS-SPEC RGS/1.0 — Kangqore Engineering — 2026-07-03*
*This document is a stable release governance standard. Changes to the decision model, approval policy, blocker list, provenance schema, or API contracts require a new RGS schema version.*
*Milestone: RGS v1.0 — Frozen Release Governance Standard — 2026-07-03*
