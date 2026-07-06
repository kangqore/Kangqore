# QEF Specification — QEF/1.0

**Kangqore Quality Engineering Framework**
**Document Status:** FROZEN — Engineering Standard
**Schema Version:** QEF/1.0
**Issued:** 2026-07-02
**Frozen:** 2026-07-02
**Supersedes:** None (inaugural version)

> QEF/1.0 is a stable internal engineering standard. Changes to certification logic, gate weights, scoring formula, certificate schema, or lifecycle rules require a new schema version (QEF/1.1 or QEF/2.0). Bug fixes and documentation corrections do not require a version bump.

---

## 1. Purpose

The Kangqore Quality Engineering Framework (QEF) is the governance layer of Kangqore View. It defines how engineering quality is measured, certified, and preserved across releases.

QEF answers three questions:

| Question | System |
|---|---|
| Did this build satisfy Kangqore's engineering standards? | QEF Certification |
| Is the platform healthy enough to deploy right now? | Release Readiness |
| Why? | Quality Gates |

QEF is not a testing framework. It is a quality governance system that produces **immutable, versioned, auditable engineering evidence**. Every build either earns a certificate or doesn't.

### 1.1 Certification Flow

The official QEF governance lifecycle:

```
Define Criteria
       ↓
Verify Evidence         ← gate runners collect verification evidence
       ↓
Issue Draft Certificate ← assembled, awaiting approval
       ↓
Approve                 ← human sign-off (approvedBy field)
       ↓
Active Certificate      ← immutable ledger entry, previous cert SUPERSEDED
       ↓
Release Readiness       ← dynamic: runtime health, incidents, windows
       ↓
Deploy
       ↓
Operational Intelligence ← Gate 8 (planned): outcomes, ROI, learning velocity
       ↓
Next Certification      ← loop closes
```

Note: QEF Certification and Release Readiness are deliberately separated. Certification answers "did this build meet our standards?" (historical, immutable). Readiness answers "should we deploy right now?" (dynamic, not stored in the ledger).

### 1.2 Controlled Vocabulary

QEF uses precise language to distinguish certification governance from general software testing.

| Term | Definition |
|---|---|
| Verification Criteria | The formal conditions a build must satisfy (formerly "tests") |
| Verify Evidence | The act of a verification engine collecting evidence for a criterion |
| Verification Evidence | The machine-readable output of a gate run (formerly "test results") |
| Verification Engine | The software component that collects evidence for a gate (formerly "runner") |
| Verification Status | The gate outcome: Verified / Criterion Not Met / Partially Verified / Awaiting Verification |
| Certification Score | The weighted quality score produced by the gate ensemble (0–100) |
| Verified | Gate passed — evidence confirms the criterion is met |
| Criterion Not Met | Gate failed — evidence shows the criterion is not satisfied |
| Awaiting Verification | No evidence collected yet for this gate |
| Partially Verified | Evidence collected but criterion not fully satisfied |
| QEF-G{n} | Identifier for gate n (e.g. QEF-G1, QEF-G3.5) |

---

## 2. Quality Maturity Levels

QEF organises gates into four maturity levels. Higher levels build on lower ones.

| Level | Code | Scope |
|---|---|---|
| L1 Engineering | `ENGINEERING` | Correctness and resilience of the platform foundation |
| L2 AI | `AI` | Benchmark quality, runtime routing, and autonomous operations |
| L3 Experience | `EXPERIENCE` | End-to-end interaction quality and studio integrity |
| L4 Enterprise | `ENTERPRISE` | Security, compliance, operations, governance, documentation |

---

## 3. Quality Gates

### 3.1 Gate Definitions

| Gate | ID | Name | Maturity | Weight |
|---|---|---|---|---|
| G1 | `gate1` | Platform Correctness | L1 Engineering | 10% |
| G2 | `gate2` | Platform Resilience | L1 Engineering | 15% |
| G3 | `gate3` | Intelligence Quality | L2 AI | 20% |
| G3.5 | `gate35` | Runtime Intelligence | L2 AI | 10% |
| G4 | `gate4` | Autonomous Operations | L2 AI | 15% |
| G5 | `gate5` | Interaction Quality | L3 Experience | 15% |
| G6 | `gate6` | Enterprise Readiness | L4 Enterprise | 15% |
| G7 | `gate7` | Release Readiness | L4 Enterprise | 0% (planned) |

The total of active gate weights must equal 100%.

### 3.2 Gate Status Values

Each gate produces one status value:

| Status | Meaning |
|---|---|
| `PASS` | Gate criteria met at full score |
| `PARTIAL` | Gate partially met (e.g. pending attestations) |
| `DEGRADED` | Gate passed with reduced confidence |
| `FAIL` | Gate criteria not met |
| `PENDING` | No evidence collected yet for this gate |

### 3.3 Gate Definitions (normative)

**G1 — Platform Correctness (10%)**
Verifies database connectivity and basic API integrity. The simplest gate; failure here means nothing else can be trusted.
- Pass criteria: database reachable and responsive
- Runner: `gate1Runner` v1.0.0
- Evidence: DB query response

**G2 — Platform Resilience (15%)**
Verifies infrastructure health: Redis cache layer, database under load, and fallback behaviour.
- Pass criteria: all infrastructure components reachable or within acceptable degraded range
- Runner: `gate2Runner` v1.0.0
- Evidence: health check responses

**G3 — Intelligence Quality (20%)**
Executes the KIMMP benchmark suite against the live AI layer. Tests correctness, relevance, and confidence calibration.
- Pass criteria: benchmark score ≥ 80/100
- Runner: `gate3BenchmarkRunner` (see runner version on each certificate)
- Evidence: `KimmpBenchmarkRun` record — passCount, failCount, totalScore, driftAlert
- Note: highest weight because AI quality is the core differentiator of Kangqore View

**G3.5 — Runtime Intelligence (10%)**
Verifies WAANDA's routing layer: that the correct LLM provider is selected for each request category and that fallback routing behaves correctly.
- Pass criteria: runtime score ≥ 75/100
- Runner: `gate35Runner`
- Evidence: `WaandaGate35Run` record

**G4 — Autonomous Operations (15%)**
Runs the WAOE (WAANDA Autonomous Operations Engine) scenario suite against a live database. Tests that KIMMP can correctly assess situations and propose valid actions without human prompting.
- Pass criteria: autonomy score ≥ 80/100
- Runner: `gate4Runner`
- Evidence: `KimmpGate4Run` record — 7 standard scenarios

**G5 — Interaction Quality (15%)**
Executes the Playwright end-to-end suite against a running frontend. Tests are split into two deterministic categories:
- **Empty State Tests**: DB-agnostic, always runnable, verify empty states render correctly
- **Seeded Tests**: Require `QEF_SEED_TOKEN` — skipped if not present, never cause gate failure
- Pass criteria: score ≥ 75/100 AND fail rate ≤ 20%
- Runner: `gate5Runner` (Playwright)
- Evidence: `WaandaGate5Run` record

**G6 — Enterprise Readiness (15%)**
The largest gate. 28 automated checks across five domains, designed to answer the question enterprise customers and CIOs ask: *"Is this safe to operate at enterprise scale?"*

| Domain | Checks |
|---|---|
| Security | RBAC, JWT configuration, rate limiting, security headers, CORS, secrets hygiene, audit trail, session management |
| Compliance | GDPR logging, data retention, right to erasure, consent, data classification, GDPR posture, DPDP readiness, SOC 2 readiness |
| Operations | Database connectivity, backup readiness, observability, Redis availability, error handling, disaster recovery, health endpoint |
| Governance | Policy engine, AEGIS audit coverage, AI governance model, explainability routes, intelligence registry |
| Documentation | Architecture docs, API documentation, runbook, failure scenarios |

- Pass criteria: totalScore ≥ 70 AND passCount ≥ 18 AND failCount ≤ 5
- Verdicts: `PASS` / `PARTIAL` / `FAIL`
- Check types: `AUTOMATED` (code/DB inspection → 100 or 0), `ATTESTATION` (human review required → 50 while pending)
- Runner: `gate6Runner` v1.0.0
- Evidence: `WaandaGate6Run` + `WaandaGate6Check` records

**G7 — Release Readiness (planned)**
Will verify that a certified build is safe to deploy to a specific environment at a specific time. Takes into account runtime health, active incidents, deployment windows, and change freezes. Unlike G1–G6 (which measure the build), G7 measures the environment and moment of deployment. Weight and pass criteria TBD.

---

## 4. Scoring Methodology

### 4.1 Gate Score Contribution

For each gate, the score contribution to the overall platform quality is:

```
gate_contribution = (effective_score / 100) × weight
```

Where `effective_score` is derived from gate status:

| Gate Status | Effective Score |
|---|---|
| `PASS` | gate.score (0–100) |
| `PARTIAL` | gate.score × 0.75 |
| `DEGRADED` | gate.score × 0.65 |
| `PENDING` | 50 (neutral — does not reward or penalise) |
| `FAIL` | 0 |

### 4.2 Overall Platform Quality

```
overall = Σ (gate_contribution for each gate)
```

With current weights:

```
overall = G1×0.10 + G2×0.15 + G3×0.20 + G3.5×0.10 + G4×0.15 + G5×0.15 + G6×0.15
```

Score is expressed as a single decimal (e.g. 78.7).

### 4.3 Score Interpretation

| Range | Meaning |
|---|---|
| 95–100 | Platform operating at enterprise standard |
| 85–94 | Platform operating at advanced standard |
| 75–84 | Platform operating at baseline certified standard |
| 50–74 | Platform degraded — review required |
| < 50 | Platform not certifiable |

---

## 5. Certification Levels

### 5.1 Level Thresholds

| Level | Minimum Score | Additional Requirement |
|---|---|---|
| 🥇 Enterprise Certified | ≥ 95 | No pending critical gates (G3, G3.5, G4, G5, G6 must all have evidence) |
| 🥈 Advanced Certified | ≥ 85 | None |
| 🥉 Certified | ≥ 75 | None |
| ✗ Not Certified | < 75 | — |

### 5.2 Enterprise Tier Rationale

A build that scores 96 but has a critical gate in `PENDING` status cannot be Enterprise Certified. The Enterprise tier certifies that every critical subsystem has been actively verified, not merely skipped. A build with pending evidence remains at Advanced Certified until all gates produce real results.

Critical gates for Enterprise tier: `gate3`, `gate35`, `gate4`, `gate5`, `gate6`.

### 5.3 Certification Status vs. Level

The certification document has two distinct fields:

- `status`: `CERTIFIED` or `NOT_CERTIFIED` — whether the build met any certification threshold
- `level`: the specific tier achieved if certified

---

## 6. Certificate Schema (QEF/1.0)

The following fields constitute the canonical QEF/1.0 certificate. This schema is a **stable contract**. Fields marked `(required)` must be present. Fields marked `(optional)` may be absent for older certificates or specific issuance contexts.

```
certId            (required)  Sequential identifier: QEF-{YEAR}-{XXXXXX}
version           (required)  Certificate version string: "1.0"
qefSchemaVersion  (required)  QEF schema contract: "QEF/1.0"
status            (required)  CERTIFIED | NOT_CERTIFIED
level             (required)  ENTERPRISE_CERTIFIED | ADVANCED_CERTIFIED | CERTIFIED | NOT_CERTIFIED
certificateStatus (required)  DRAFT | ACTIVE | SUPERSEDED | REVOKED | EXPIRED
overallScore      (required)  Numeric score 0–100 to one decimal place
issuedAt          (required)  ISO 8601 timestamp
sha256            (required)  SHA-256 hash of certId+version+status+level+overallScore+gateSnapshot+issuedAt
previousCertId    (optional)  certId of the certificate this one supersedes
gitCommit         (optional)  Short git SHA of the build
schemaVersion     (optional)  Database schema migration identifier
migrationStatus   (optional)  "Applied" | "Unknown"
environment       (optional)  Target environment descriptor, default "Production Candidate"
certifiedBy       (required)  Issuing authority, default "WAANDA Quality Engine"
reviewedBy        (optional)  Human reviewer name
approvedBy        (optional)  Human approver name (required for DRAFT → ACTIVE transition)
revokedAt         (optional)  ISO 8601 timestamp of revocation
revokedReason     (optional)  Human-readable reason for revocation

gateSnapshot      (required)  Object. Keys are gate IDs (gate1, gate2, gate3, gate35, gate4, gate5, gate6).
                              Each value:
                                name           (required)  Gate display name
                                status         (required)  PASS | PARTIAL | DEGRADED | FAIL | PENDING
                                score          (required)  0–100
                                passCount      (required)  Number of passing checks
                                failCount      (required)  Number of failing checks
                                detail         (required)  Human-readable evidence summary
                                runnerVersion  (required)  Semantic version of the gate runner
                                executionMs    (required)  Wall-clock time of gate verification in milliseconds
                                at             (optional)  ISO 8601 timestamp of most recent gate run

scope             (required)  Array of scope items:
                                id         (required)  Stable identifier
                                label      (required)  Display name
                                gate       (required)  Gate ID that covers this scope item
                                certified  (required)  boolean
```

### 6.1 SHA-256 Computation

The tamper-evident hash is computed as:

```
SHA-256(JSON.stringify({
  certId, qefSchemaVersion, version, status, level, overallScore,
  hasPendingCritical, gitCommit, dbSchemaVersion, environment,
  gateSnapshot, previousCertId, issuedAt
}))
```

The hash is computed before the record is stored. Any modification to the above fields after issuance will produce a different hash, making tampering detectable.

### 6.2 Sequential Certificate IDs

Certificate IDs follow the format `QEF-{YEAR}-{SEQ}` where `SEQ` is a zero-padded 6-digit sequence number scoped to the calendar year.

Example: `QEF-2026-000001`

Year resets the sequence. Certificates from different years are compared by `issuedAt`, not by sequence number.

---

## 7. Certificate Lifecycle

```
                 DRAFT
                   │
          ┌────────┴────────┐
          │                 │
     [approve]          [abandon]
          │                 │
          ▼                 ▼
        ACTIVE           (deleted)
          │
   ┌──────┴──────┐
   │             │
[new cert     [revoke]
 issued]         │
   │             ▼
   ▼           REVOKED
 SUPERSEDED
   │
   ▼
(archive — immutable, readable forever)
```

### 7.1 Lifecycle Rules

**DRAFT**
- Created when `issue` is called with `draft: true`
- Does not supersede any ACTIVE certificate
- Links `previousCertId` to the current ACTIVE certificate for lineage
- Transitions to ACTIVE only via explicit approval (requires `approver` field)
- If abandoned (new cert issued without approving this draft), remains DRAFT indefinitely — does not block future certificates

**ACTIVE**
- The current valid certificate for the platform
- At most one certificate may be ACTIVE at any time
- Superseded automatically when a new certificate is issued and becomes ACTIVE
- May be manually REVOKED if a critical defect is discovered post-issuance

**SUPERSEDED**
- No longer the active certificate but remains valid as historical evidence
- Must not be modified after supersession
- Retained in the ledger indefinitely

**REVOKED**
- The certificate has been invalidated
- Records `revokedAt` and `revokedReason`
- Revocation does not delete the evidence — it remains in the ledger with REVOKED status
- A revocation implies that deployments authorised by this certificate should be reviewed

**EXPIRED** (reserved)
- For future use when time-based validity windows are introduced
- Not currently assigned by the system

### 7.2 Lineage

Every certificate (except the first) references `previousCertId`. This forms an unbroken chain from the first certificate issued to the current one. The chain is called the **QEF Ledger**.

Lineage allows:
- Certificate diff computation (evidence comparison between two points)
- Quality trend analysis (score evolution over multiple releases)
- Audit trail reconstruction

---

## 8. QEF Ledger™

The QEF Ledger is the persistent, append-only record of all certificates issued under this QEF instance. Each entry in the ledger represents a point-in-time assessment of the entire platform.

The ledger provides:

| Capability | How |
|---|---|
| Immutable evidence | gateSnapshot is written once at issuance, never updated |
| Lineage | previousCertId chain |
| Reproducibility | runnerVersion + gitCommit + dbSchemaVersion per certificate |
| Auditability | sha256 hash, issuedAt, certifiedBy, approvedBy |
| Diff | computeCertificateDiff(from, to) generates release notes from evidence |
| Trend | overallScore across last N certificates |

---

## 9. Evidence Requirements

### 9.1 Minimum Evidence for Certification

A gate must have produced at least one run before its evidence can be included in a certificate. Gates with no prior run receive status `PENDING` and score 50 in the overall calculation. A build **cannot** achieve Enterprise Certified tier while any critical gate has `PENDING` evidence.

### 9.2 Evidence Staleness

Evidence is captured at the moment the certificate is issued. The certificate records the most recent run for each gate, regardless of when that run occurred. It is the responsibility of the release process to ensure gate runs are recent before issuing a certificate.

Future versions of QEF may introduce evidence staleness policies (e.g. "G5 must have been run within 24 hours of issuance").

### 9.3 Runner Versioning

Every gate evidence record includes `runnerVersion`. This allows future auditors to answer: *"Which version of the benchmark produced this evidence?"*

When gate logic changes in a way that affects score comparability, the runner version must be bumped. Diffs between certificates that crossed a runner version boundary should be interpreted with caution.

---

## 10. Compatibility Policy

### 10.1 Schema Versions

QEF schema versions follow the format `QEF/{major}.{minor}`.

**QEF/1.x** — backward-compatible changes:
- Adding optional fields to the certificate schema
- Adding new gate status values that do not affect scoring
- Adding new scope items
- Extending the gateSnapshot with additional optional fields

**QEF/2.x** — breaking changes (require migration rules):
- Changing the scoring formula
- Changing gate weights
- Removing or renaming certificate fields
- Changing the SHA-256 computation inputs
- Changing certification level thresholds

### 10.2 Older Certificate Interpretation

Certificates issued under an older schema version are permanently interpretable under the schema version they were issued with. If a QEF/2.0 system reads a QEF/1.0 certificate, it must interpret it using QEF/1.0 rules, not QEF/2.0 rules.

The `qefSchemaVersion` field identifies which rule set applies to any given certificate.

### 10.3 Migration Rules

When introducing QEF/2.x:
1. Publish migration rules documenting how each QEF/1.x field maps to QEF/2.x
2. All new certificates are issued under QEF/2.x
3. Existing QEF/1.x certificates remain in the ledger unchanged
4. Diff operations across a schema version boundary must explicitly handle field mapping

---

## 11. Revocation Policy

### 11.1 Grounds for Revocation

A certificate should be revoked when:

1. A critical security vulnerability is discovered in the certified build
2. Evidence is found to have been invalid at time of issuance
3. The gate runner is found to have been producing incorrect results
4. A compliance failure is discovered post-certification

### 11.2 Revocation Does Not Delete

Revocation marks a certificate as invalid but does not remove it from the ledger. The evidence remains visible and auditable. This is intentional — the ability to audit *why* a certificate was revoked is as important as the revocation itself.

### 11.3 Post-Revocation

After revocation, a new certificate should be issued immediately. If the underlying issue has not been resolved, the new certificate will reflect the failure through its gate scores.

---

## 12. Release Readiness vs. Certification

These are two distinct concepts that must not be conflated.

**QEF Certification** answers: *Has this build satisfied Kangqore's engineering standards?*
- Static at issuance
- Historical — does not change after the build is assessed
- Evidence-backed
- Suitable for audit

**Release Readiness** answers: *Should we deploy this build right now?*
- Dynamic — recalculated continuously
- Depends on runtime health, provider availability, active incidents, deployment windows, and change freezes
- Not stored in the ledger

A build can be QEF Certified but not Release Ready (e.g. during an OpenAI outage or a production change freeze). The release decision considers both the certification and the current runtime state.

---

## 13. Stable Contracts

The following interfaces are declared **stable** as of QEF/1.0. They may not be changed without incrementing the schema version.

### Gate IDs
`gate1`, `gate2`, `gate3`, `gate35`, `gate4`, `gate5`, `gate6`, `gate7`

### Gate Status Values
`PASS`, `PARTIAL`, `DEGRADED`, `FAIL`, `PENDING`

### Certificate Status Values
`DRAFT`, `ACTIVE`, `SUPERSEDED`, `REVOKED`, `EXPIRED`

### Certification Levels
`ENTERPRISE_CERTIFIED`, `ADVANCED_CERTIFIED`, `CERTIFIED`, `NOT_CERTIFIED`

### Score Formula
`overall = G1×0.10 + G2×0.15 + G3×0.20 + G3.5×0.10 + G4×0.15 + G5×0.15 + G6×0.15`

### Release Readiness Verdicts
`Deploy`, `Review`, `Block`

### Certificate ID Format
`QEF-{YYYY}-{NNNNNN}`

---

## 14. Roadmap

| Item | Status |
|---|---|
| G1–G6 gate runners | ✅ Complete |
| Certificate issuance and ledger | ✅ Complete |
| Schema versioning (QEF/1.0) | ✅ Complete |
| DRAFT → ACTIVE lifecycle | ✅ Complete |
| Revocation | ✅ Complete |
| Certificate diff / release notes | ✅ Complete |
| Lineage chain | ✅ Complete |
| G7 Release Readiness | Planned |
| G8 | Planned |
| ECDSA digital signature | Future |
| Evidence staleness policy | Future |
| Deployment history linkage | Future |
| QEF as a self-improving system (trend → recommendation) | Future |
| Customer-facing Trust Certificate (WAANDA external identity) | Future |

---

## 15. Glossary

**QEF** — Kangqore Quality Engineering Framework

**Quality Gate** — a defined set of verification criteria for a specific engineering domain

**Certificate** — an immutable evidence artifact produced when a build is assessed against all quality gates

**QEF Ledger™** — the persistent, append-only chain of all certificates issued under a QEF instance

**Certification Level** — the tier achieved by a build based on its overall quality score (Not Certified / Certified / Advanced / Enterprise)

**Evidence** — the machine-readable record produced by a gate runner: scores, pass/fail counts, runner version, execution time

**Lineage** — the chain of `previousCertId` references connecting every certificate issued under this QEF instance

**Release Readiness** — the dynamic assessment of whether a certified build should be deployed to a specific environment at a specific time

**DRAFT** — a certificate that has been prepared but not yet approved as the active certification

**Runner Version** — the semantic version of the gate runner that produced a specific piece of evidence, enabling reproducibility

---

*QEF-SPEC QEF/1.0 — Kangqore Engineering — 2026-07-02*
*This document is a stable engineering contract. Changes require a new QEF schema version.*
