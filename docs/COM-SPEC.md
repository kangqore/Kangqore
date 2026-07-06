# Kangqore View — Commercial Operating Model

**Document:** COM v1.0
**Document Status:** ACTIVE — Commercial Standard
**Issued:** 2026-07-03
**Relationship to Engineering Standards:** COM v1.0 sits above QEF/1.0 and RGS/1.0. It describes how the platform is delivered, deployed, and measured commercially. It does not modify any engineering standard.

> COM v1.0 is the bridge between engineering and go-to-market. It answers the question that QEF and RGS do not: what does a successful Kangqore View deployment look like for a customer?

---

## 1. Context

Kangqore View has completed three phases:

| Phase | Name | Status |
|---|---|---|
| 1 | Platform Engineering — build the operating system | Complete |
| 2 | Governance Engineering — prove and govern the operating system | Complete |
| 3 | Commercial Engineering — deliver measurable enterprise outcomes | Active |

COM v1.0 governs Phase 3.

**The central shift:**

Until Phase 2, engineering success meant more capabilities, better architecture, more automation, and better governance.

From Phase 3, engineering success means faster customer time-to-value, higher COIG, shorter deployment time, higher customer adoption, and lower operational risk.

The platform is the means. The enterprise outcome is the end.

---

## 2. Foundation Offering

Every customer deployment begins with the same base. Everything else is optional and additive.

### Kangqore View Foundation

The Foundation is the enterprise operating platform. It includes:

| Component | What it provides |
|---|---|
| Identity | Authentication, roles, access control |
| Ontology | Semantic graph — the enterprise knowledge layer |
| WAANDA | Intelligence engine — decisions, goals, agents, memory |
| Mission Control | Executive operational dashboard |
| QEF | Engineering quality certification |
| RGS | Release governance |
| OIS | Operational Intelligence Score — the north-star metric |

The Foundation is the same for every customer, every industry, every deployment. It does not change per vertical. Industry-specific behaviour lives in packs.

### What the Foundation is not

The Foundation is not a CRM, an ERP, or a workflow tool. It is the intelligence and governance layer that sits above those systems — connecting them, reasoning about them, and improving outcomes across them.

---

## 3. Industry Pack Structure

An Industry Pack is a proven operating model for a specific vertical, distilled from real deployments. Packs are not hypothetical templates. Each pack is released only after it has been validated in a live deployment.

### Pack Contents

Every Industry Pack contains the following components:

```
Industry Pack

Ontology        — entity types, relationships, and properties for this vertical
KPIs            — the metrics that matter in this industry
Goals           — pre-built strategic goal definitions
Policies        — governance rules specific to this vertical
Agents          — WAANDA agents pre-configured for vertical workflows
Workflows       — standard operating procedures as executable DAGs
Dashboards      — Mission Control views tuned for this industry
OIS Templates   — pillar weightings and thresholds for this vertical's context
Executive Reports — QBR and board-level report templates
RGS Policies    — deployment governance rules for regulated environments
QEF Profiles    — certification thresholds appropriate for this vertical
```

### Pack Release Criteria

A pack is not released as a product until:
1. It has been deployed internally or at one live customer
2. A COIG measurement has been completed (before/after OIS with 90-day minimum)
3. At least one case study has been documented

### Pack Roadmap

| Pack | Source | Status |
|---|---|---|
| Professional Services | Distilled from Kangqore Global's own operations | In progress (Mission 1 feeds Mission 2) |
| Manufacturing | — | Planned Phase 3 |
| Healthcare | — | Planned Phase 3 |
| BFSI | — | Planned Phase 3 |
| Logistics | — | Planned Phase 3 |
| Education | — | Planned Phase 3 |
| Government | — | Planned Phase 3 |

---

## 4. Customer Deployment Lifecycle

Every deployment follows the same sequence, regardless of industry.

```
Discovery
    ↓
Baseline OIS Assessment
    ↓
Foundation Deployment
    ↓
Pack Activation
    ↓
WAANDA Calibration
    ↓
Go-Live
    ↓
30-Day COIG Measurement
    ↓
90-Day COIG Measurement
    ↓
Quarterly Business Review
    ↓
Expansion or Pack Addition
```

### Stage Definitions

**Discovery** — understand the customer's operating model, primary pain points, and existing systems. Identify which OIS pillars have the most headroom.

**Baseline OIS Assessment** — measure the customer's current operational state across all 8 pillars before any deployment. This is the COIG baseline. Without it, no improvement can be claimed.

**Foundation Deployment** — deploy the platform core. Establish identity, seed the ontology with the customer's entities, configure WAANDA agents, set up Mission Control.

**Pack Activation** — activate the appropriate industry pack. Configure workflows, policies, and agents for the customer's specific operating context.

**WAANDA Calibration** — run the platform for 2–4 weeks with the customer's actual data and workflows. Adjust agent behaviour, policy thresholds, and OIS pillar weights for the customer's context.

**Go-Live** — formal transition to live operations. All critical workflows running through the platform.

**COIG Measurement** — measure OIS at 30 days and 90 days. Compare to baseline. Document the delta as the COIG score.

**Quarterly Business Review** — present COIG to customer leadership. Review which pillars improved, which need attention, and what the next 90 days should target.

**Expansion** — add more departments, more workflows, or additional packs based on what generated the strongest COIG in the first deployment.

---

## 5. COIG Methodology

### Definition

**COIG (Customer Operational Intelligence Gain)** measures the improvement in a customer's OIS attributable to Kangqore View, over a defined measurement period.

```
COIG = OIS(after) − OIS(before)
```

This is a business outcome, not a feature claim.

### Why COIG matters more than OIS

OIS measures a customer's current operational state. COIG measures the value Kangqore View created. OIS is the instrument. COIG is the proof.

A customer with a baseline OIS of 45 who reaches 68 has a COIG of +23. A customer with a baseline OIS of 80 who reaches 84 has a COIG of +4. Both are valid deployments; COIG makes the improvement legible in commercial terms.

### COIG Measurement Standard

| Measurement | Timing | Purpose |
|---|---|---|
| Baseline | Before Foundation deployment | Establishes the before state |
| 30-day | 30 days after go-live | Early signal — leading indicators |
| 90-day | 90 days after go-live | Primary COIG measurement |
| 180-day | 6 months after go-live | Sustained improvement verification |

The 90-day measurement is the commercial standard. It is the number cited in case studies, sales conversations, and QBRs.

### COIG Report Format

```
Customer:           [Company Name]
Industry:           [Vertical]
Pack:               [Pack Name]
Baseline OIS:       [X]
OIS After 90 Days:  [Y]
COIG:               [+delta]

Key Drivers:
  ↑ Decision Intelligence   (pillar score change)
  ↑ Workflow Completion     (pillar score change)
  ↓ Enterprise Risk         (pillar score change — improvement = lower risk)

Business Value:
  Hours saved (est.):       [N]
  Operational savings (est.):  [₹X Cr]
  Workflows automated:      [N]
  Manual approvals eliminated: [N]

Verified by: Gate 8 OIS Engine
```

### Attribution Standard

COIG only includes improvements that can be traced to platform usage. Exogenous factors (market conditions, headcount changes, competitor events) are excluded or noted. The Gate 8 OIS engine provides the measurement infrastructure; attribution is validated by the customer in the QBR.

---

## 6. Success Metrics

These are the metrics that define commercial success from Phase 3 forward. They replace feature counts and capability gates as primary measures.

### Customer-Level Metrics

| Metric | Target | Measurement Point |
|---|---|---|
| COIG at 90 days | +8 or above | 90-day OIS measurement |
| Time to baseline OIS | < 2 weeks | Foundation deployment completion |
| Time to go-live | < 6 weeks | From contract to live operations |
| Workflow automation coverage | > 60% within 90 days | Gate 8 Business Value pillar |
| Customer Mission Control adoption | Daily use by leadership | Measured via session frequency |

### Portfolio Metrics

| Metric | Target |
|---|---|
| Average COIG across active deployments | +10 or above |
| Deployments with COIG > 8 | > 80% of portfolio |
| Pack reuse rate | Each customer activates ≥ 1 pack |
| Customer expansion rate | > 40% add a second department or pack within 6 months |

---

## 7. Adoption Milestones

Every deployment has four adoption milestones. These are tracked in the customer's Mission Control instance and reviewed at every QBR.

### Milestone 1 — Platform Live

```
Foundation deployed
WAANDA agents active
At least one workflow running end-to-end
OIS baseline established
```

### Milestone 2 — Operations Connected

```
Primary department running through WAANDA
Decisions being tracked in KimmpStrategicDecision
Goals set and being measured
OIS updating with live data
```

### Milestone 3 — Intelligence Active

```
WAANDA making recommendations
At least 3 automated workflow completions per week
Mission Control used by ≥ 1 executive daily
30-day COIG measured and reviewed
```

### Milestone 4 — Measurable Improvement

```
90-day COIG ≥ 8
Enterprise Forecast showing positive trajectory
At least 1 recommendation from Gate 8.2 implemented
QBR completed with documented business value
```

Milestone 4 is the definition of a successful deployment.

---

## 8. Quarterly Business Review

The QBR is the primary commercial touchpoint. It happens every 90 days and covers exactly four things:

1. **COIG Report** — OIS before vs now, delta, key drivers, business value in plain language
2. **Pillar Review** — which pillars improved, which need focus, what's blocking higher scores
3. **Recommendation Review** — which Gate 8.2 recommendations were acted on, what they produced
4. **Next 90 Days** — one or two specific OIS targets, what WAANDA will be configured to pursue

The QBR is not a feature demo. It is an operational review. The customer's leadership is shown their own data, their own improvement, their own next steps — all computed by the platform they are running.

---

## 9. Expansion Strategy

Expansion follows a proven pattern. Each deployment starts with one department and one pack. Expansion adds departments and packs after Milestone 4 is reached.

### Expansion Triggers

| Signal | Expansion Move |
|---|---|
| COIG > 10 at 90 days | Propose second department |
| Workflow automation > 70% | Propose additional pack |
| Executive QBR positive | Introduce ecosystem integrations |
| COIG plateaus | Diagnose lowest-scoring pillar, propose targeted intervention |

### Department Activation Order (recommended for Professional Services customers)

1. Projects & Delivery — highest workflow density, most measurable outcomes
2. Finance — invoice approvals, collections, budget workflows
3. Sales — lead qualification, pipeline, proposals
4. HR — hiring workflow, onboarding, performance
5. Leadership — Mission Control, OIS, Enterprise Forecast

Projects first because it generates the richest combination of decisions, risks, approvals, and timeline data. That data feeds WAANDA's intelligence across all subsequent departments.

### Pack Expansion Order

Foundation → Professional Services Pack → vertical-specific pack (if applicable) → ecosystem connectors

---

## 10. The Continuous Improvement Loop

The Commercial Operating Model runs on a loop that connects internal operations to customer deployments:

```
Run Kangqore Global
        ↓
Measure COIG
        ↓
Improve WAANDA
        ↓
Standardize
        ↓
Professional Services Pack
        ↓
Deploy to Customer
        ↓
Learn Again
        ↓
(back to top)
```

This loop has a specific property: the Professional Services Pack is not designed, it is distilled. It is extracted from how Kangqore actually runs, which makes it a proven operating model rather than a hypothetical template. Every improvement to internal operations becomes an improvement to the pack, which becomes an improvement to every customer deployment.

This is the compounding mechanism. It means the platform becomes more valuable with each deployment, not more complex.

---

## 11. What COM v1.0 Does Not Cover

COM v1.0 does not cover:

- Engineering architecture (see QEF-SPEC and RGS-SPEC)
- Agent configuration and WAANDA orchestration (engineering domain)
- Specific industry pack contents (each pack has its own specification)
- Pricing and commercial terms (separate commercial document)
- SDK and ecosystem developer programme (Mission 5, future)

---

*COM v1.0 — Kangqore Commercial — 2026-07-03*
*This document defines how Kangqore View is deployed, measured, and expanded commercially. It is a living document; updates reflect lessons from active deployments.*
*Companion documents: QEF-SPEC QEF/1.0 · RGS-SPEC RGS/1.0 · Gate 8 OIS Engine*
