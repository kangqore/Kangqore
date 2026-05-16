# Phase G — Legacy Service Page Extraction Audit (G1)

**Date:** 2026-05-16
**Phase:** G1 (audit + extraction sheet — no code)
**Decision lock:** see [project memory: Phase G depth migration](../../Users/maheshkumar/.claude/projects/-Volumes-MKS-MacBook-Kangqore/memory/project_kangqore_phase_g_depth_migration.md)
**Goal:** Catalog every legacy `pages/services/*/*.jsx`, map to its canonical slug in `frontend/src/data/servicesData.js`, classify lift value, and define the Cognition pilot scope for G2.

---

## Executive Summary

| Metric | Count |
|---|---:|
| Legacy top-level service page files | 70 |
| Legacy dept-scoped `*CustomSections.jsx` component files | 22 |
| Legacy nested routes registered in `serviceRoutes.jsx` | 65 |
| Canonical services in new structure (`servicesData.js`) | 61 |
| **Premium-tier services (worth full asset lift)** | **27** |
| **Mid-tier services (bespoke copy, no CustomSections — modest lift)** | **~10** |
| **Standard-tier services (true skeleton, no lift value)** | **~24** |
| Bespoke standalone subpages (TT pillars — special handling) | 2 (of 7 routed; 5 are 29-line stubs) |
| Orphan page files (exist on disk, not routed) | 5+ |

**Headline:** Premium-lift coverage is **higher than initial estimate (27 vs ~22)**. Two entire canonical departments — **Platforms (8/8) and Growth (8/8)** — are fully premium in legacy. The Cognition pilot scope is clean: 5 AI services share a single `AICustomSections.jsx` file, making it the lowest-friction first lift.

---

## Tier Classification

Each legacy page is classified into one of four tiers based on a directly observable pattern:

| Tier | Definition | Detected By |
|---|---|---|
| **T1 — Premium** | Imports `ServicePageTemplate` + dept-scoped `*CustomSections.jsx` + carries `highFidelity` data shape (narrative/philosophy/matrix/schematic). | `grep` for `CustomSections` import in the page file. |
| **T2 — Bespoke Standalone** | No `ServicePageTemplate` — entirely custom React component (e.g., inline `AccordionItem`, custom scroll sections). | No `ServicePageTemplate` import + page is non-trivial (>150 lines). |
| **T3 — Mid-tier** | Uses `ServicePageTemplate`, no `*CustomSections.jsx`, but carries bespoke `service` data with JSX `fullDescription`, custom `stats`, `videoBackground`. | `ServicePageTemplate` import present, no `CustomSections` import. |
| **T4 — Standard / Skeleton** | Either an empty stub (~30 lines) or a thin wrapper that would not look meaningfully different from the canonical `ServicePageReal` template. | Line count < 50 OR generic template-only structure. |

**Sampled and confirmed:**
- T1 confirmed: `AgenticAI` (298L), `FinanceRiskManagement`, `SEOOrganicGrowthStrategy`, `Salesforce`, `ConversionRateOptimization`, `InternetOfThings`, `APIMicroservicesEngineering`, `QualityEngineeringAssurance`, `SupplyChain`, `SocialMediaManagement`, `EnterprisePlatformIntegration`, `UnifiedServicesManagement`.
- T2 confirmed: `TechnologyLedGrowthStrategy` (358L), `TechValueOptimization` (174L).
- T3 confirmed: `Analytics` (rich JSX `fullDescription` + glassmorphism card, no CustomSections), `AWS` (rich JSX, no CustomSections), `TechnologyConsulting` (GSAP + bespoke data, no CustomSections).
- T4 confirmed: 5 of 7 TT detail subpages (`AIStrategyEmbedding`, `CloudPlatformModernization`, `DigitalCoreArchitecture`, `OperatingModelReinvention`, `TransformationGovernance`) — each exactly 29-30 lines = placeholder stubs.

---

## CustomSections → Importers Map (T1 Coverage)

Every `*CustomSections.jsx` file and the services that consume it. Validates 1:1 ownership and identifies the single-file shared-component case (AI).

| Dept folder | Component file | Importers | Notes |
|---|---|---|---|
| ai-cognitive | `AICustomSections.jsx` | AgenticAI, AICognitiveComputing, AIGovernance, DataScienceAI, GenAIBusinessServices, MLOps (**6**) | **Shared across all 6 — single-file pilot win.** |
| business-operations | `FinanceRiskCustomSections.jsx` | FinanceRiskManagement (1) | |
| business-operations | `GlobalCapabilityCentersCustomSections.jsx` | GlobalCapabilityCenters (1) | |
| business-operations | `TalentOrgCustomSections.jsx` | TalentOrganization (1) | |
| business-operations | `SupplyChainCustomSections.jsx` | SupplyChain (1) | |
| business-operations | `USMCustomSections.jsx` | UnifiedServicesManagement (1) | |
| digital-marketing | `SEOCustomSections.jsx` | SEOOrganicGrowthStrategy (1) | |
| digital-marketing | `SocialMediaCustomSections.jsx` | SocialMediaManagement (1) | |
| digital-marketing | `PerformanceMarketingCustomSections.jsx` | PerformanceMarketing (1) | |
| digital-marketing | `CDPCustomSections.jsx` | CDPStrategy (1) | |
| digital-marketing | `MarketingAISections.jsx` | MarketingAIReadiness (1) | |
| enterprise-applications | `EPICustomSections.jsx` | EnterprisePlatformIntegration (1) | |
| enterprise-applications | `PimcoreCustomSections.jsx` | Pimcore (1) | |
| enterprise-applications | `SalesforceCustomSections.jsx` | Salesforce (1) | |
| enterprise-applications | `ServicenowCustomSections.jsx` | Servicenow (1) | |
| conversion-engineering | `CROCustomSections.jsx` | ConversionRateOptimization (1) | |
| conversion-engineering | `CampaignPlanningCustomSections.jsx` | CampaignPlanning (1) | |
| conversion-engineering | `FunnelCustomSections.jsx` | GrowthFunnelsConversion (1) | |
| emerging-technologies | `IoTCustomSections.jsx` | InternetOfThings (1) | |
| emerging-technologies | `BlockchainCustomSections.jsx` | Blockchain (1) | |
| digital-engineering | `APICustomSections.jsx` | APIMicroservicesEngineering (1) | **Only premium in this dept.** |
| product-engineering | `QECustomSections.jsx` | QualityEngineeringAssurance (1) | **Only premium in this dept.** |

**Total: 22 CustomSections files serving 27 services.**

---

## Canonical Mapping — All 61 Services

Legacy page → canonical slug → tier → confidence. Confidence is **H/M/L** (High = sampled directly, Medium = inferred from CustomSections pattern, Low = unread file).

### Cognition (11 services) — **5 T1, 2 T3, 4 T4** — *Pilot dept*

| Canonical slug | Legacy file | Tier | Confidence |
|---|---|---|---|
| agentic-ai | `ai-cognitive/AgenticAI.jsx` | T1 | H |
| ai-cognitive-computing | `ai-cognitive/AICognitiveComputing.jsx` | T1 | M |
| data-science-ai | `ai-cognitive/DataScienceAI.jsx` | T1 | M |
| genai-business-services | `ai-cognitive/GenAIBusinessServices.jsx` | T1 | M |
| mlops | `ai-cognitive/MLOps.jsx` | T1 | M |
| analytics | `analytics-insights/Analytics.jsx` | T3 | H |
| big-data | `analytics-insights/BigData.jsx` | T3 | L |
| digital-process-automation | `automation/DigitalProcessAutomation.jsx` | T4 | L |
| robotic-process-automation | `automation/RoboticProcessAutomation.jsx` | T4 | L |
| business-process-management | `automation/BusinessProcessManagement.jsx` | T4 | L |
| intelligent-automation | `automation/IntelligentAutomation.jsx` | T4 | L |

### Foundry (17 services) — **2 T1, 5 T3, 10 T4**

| Canonical slug | Legacy file | Tier | Confidence |
|---|---|---|---|
| api-microservices-engineering | `digital-engineering/APIMicroservicesEngineering.jsx` | T1 | H |
| internet-of-things | `emerging-technologies/InternetOfThings.jsx` | T1 | H |
| managed-cloud-services | `cloud-engineering/ManagedCloudServices.jsx` | T3 | L |
| aws | `cloud-engineering/AWS.jsx` | T3 | H |
| microsoft-services | `cloud-engineering/MicrosoftServices.jsx` | T3 | L |
| google-cloud-services | `cloud-engineering/GoogleCloudServices.jsx` | T3 | L |
| cloud-computing | `cloud-engineering/CloudComputing.jsx` | T3 | L |
| embedded-design-systems | `product-engineering/EmbeddedDesignSystems.jsx` | T4 | L |
| engineering-foundry | `product-engineering/EngineeringFoundry.jsx` | T4 | L |
| engineering-rd-services | `product-engineering/EngineeringRDServices.jsx` | T4 | L |
| product-digital-engineering | `product-engineering/ProductDigitalEngineering.jsx` | T4 | L |
| devops-as-a-service | `product-engineering/DevopsAsAService.jsx` | T4 | L |
| managed-infrastructure-services | `infrastructure-networks-operations/ManagedInfrastructureServices.jsx` | T4 | L |
| modernization-infrastructure | `infrastructure-networks-operations/ModernizationInfrastructure.jsx` | T4 | L |
| managed-services | `infrastructure-networks-operations/ManagedServices.jsx` | T4 | L |
| support-maintenance | `infrastructure-networks-operations/SupportMaintenance.jsx` | T4 | L |
| software-development | `digital-engineering/SoftwareDevelopment.jsx` | T4 | L |

### Reimagine (12 services) — **1 T1, 2 T2 (subpages), 3 T3, 6 T4**

| Canonical slug | Legacy file | Tier | Confidence |
|---|---|---|---|
| blockchain | `emerging-technologies/Blockchain.jsx` | T1 | M |
| technology-transformation | `digital-transformation-modernization/TechnologyTransformation.jsx` + 7 detail subpages | T3 + 2×T2 + 5×T4 | H |
| application-modernization | `digital-transformation-modernization/ApplicationModernization.jsx` | T4 | L |
| digital-transformation | `digital-transformation-modernization/DigitalTransformation.jsx` | T4 | L |
| legacy-modernization | `digital-transformation-modernization/LegacyModernization.jsx` | T4 | L |
| technology-modernization | `digital-transformation-modernization/TechnologyModernization.jsx` | T4 | L |
| digital-business-transformation | `digital-transformation-modernization/DigitalBusinessTransformation.jsx` | T4 | L |
| technology-consulting | `consulting-advisory/TechnologyConsulting.jsx` | T3 | H |
| strategy-consulting | `consulting-advisory/StrategyConsulting.jsx` | T3 | L |
| discover-frame-workshops | `consulting-advisory/DiscoverFrameWorkshops.jsx` | T3 | L |
| mvp-acceleration | `digital-engineering/MVPAcceleration.jsx` | T4 | L |
| product-strategy-experience-design | `digital-engineering/ProductStrategyExperienceDesign.jsx` | T4 | L |

### Shield (5 services) — **3 T1, 2 T4**

| Canonical slug | Legacy file | Tier | Confidence |
|---|---|---|---|
| ai-governance | `ai-cognitive/AIGovernance.jsx` | T1 | M |
| finance-risk-management | `business-operations/FinanceRiskManagement.jsx` | T1 | H |
| quality-engineering-assurance | `product-engineering/QualityEngineeringAssurance.jsx` | T1 | H |
| it-security-services | `cybersecurity/ITSecurityServices.jsx` | T4 | L |
| operation-technology | `infrastructure-networks-operations/OperationTechnology.jsx` | T4 | L |

### Platforms (8 services) — **8 T1 (entire dept premium)**

| Canonical slug | Legacy file | Tier | Confidence |
|---|---|---|---|
| enterprise-platform-integration | `enterprise-applications/EnterprisePlatformIntegration.jsx` | T1 | H |
| pimcore | `enterprise-applications/Pimcore.jsx` | T1 | M |
| salesforce | `enterprise-applications/Salesforce.jsx` | T1 | H |
| servicenow | `enterprise-applications/Servicenow.jsx` | T1 | M |
| global-capability-centers | `business-operations/GlobalCapabilityCenters.jsx` | T1 | M |
| talent-organization | `business-operations/TalentOrganization.jsx` | T1 | M |
| supply-chain | `business-operations/SupplyChain.jsx` | T1 | H |
| unified-services-management | `business-operations/UnifiedServicesManagement.jsx` | T1 | H |

### Growth (8 services) — **8 T1 (entire dept premium)**

| Canonical slug | Legacy file | Tier | Confidence |
|---|---|---|---|
| cdp-strategy | `digital-marketing/CDPStrategy.jsx` | T1 | M |
| marketing-ai-readiness | `digital-marketing/MarketingAIReadiness.jsx` | T1 | M |
| social-media-management | `digital-marketing/SocialMediaManagement.jsx` | T1 | H |
| performance-marketing | `digital-marketing/PerformanceMarketing.jsx` | T1 | M |
| seo-organic-growth-strategy | `digital-marketing/SEOOrganicGrowthStrategy.jsx` | T1 | H |
| growth-funnels-conversion-engineering | `conversion-engineering/GrowthFunnelsConversion.jsx` | T1 | M |
| conversion-rate-optimization | `conversion-engineering/ConversionRateOptimization.jsx` | T1 | H |
| campaign-planning | `conversion-engineering/CampaignPlanning.jsx` | T1 | M |

---

## Rollup by Canonical Department

| Dept | Total | T1 | T2 | T3 | T4 |
|---|---:|---:|---:|---:|---:|
| Cognition | 11 | 5 | 0 | 2 | 4 |
| Foundry | 17 | 2 | 0 | 5 | 10 |
| Reimagine | 12 | 1 | 2 | 3 | 6 |
| Shield | 5 | 3 | 0 | 0 | 2 |
| Platforms | 8 | 8 | 0 | 0 | 0 |
| Growth | 8 | 8 | 0 | 0 | 0 |
| **Total** | **61** | **27** | **2** | **10** | **22** |

**Reading the table:**
- **Platforms and Growth are fully premium** — when their PRs land (G5/G4 respectively), every service in those depts upgrades simultaneously.
- **Foundry and Reimagine have low premium density** — most services there stay on the standard template; lift is targeted.
- **Cognition is the right pilot** — mixed tiers (5 T1 + 2 T3 + 4 T4), all 5 T1 share one component file, manageable scope (~11 services touched, ~5 deeply migrated).

---

## TT Detail Subpages — Special Handling

The legacy `digital-transformation-modernization/details/` folder contains 7 subpages under `/services/digital-transformation-modernization/technology-transformation/<pillar>`. These have **no canonical slot** in the 6-dept structure — `technology-transformation` is one canonical service, not seven.

| Subpage | Lines | Status | Recommendation |
|---|---:|---|---|
| TechnologyLedGrowthStrategy | 358 | T2 — bespoke standalone | Lift into `technology-transformation` as a `richContent.pillar` block |
| TechValueOptimization | 174 | T2 — bespoke standalone | Lift into `technology-transformation` as a `richContent.pillar` block |
| AIStrategyEmbedding | 29 | T4 — placeholder stub | **Drop** — no content |
| CloudPlatformModernization | 29 | T4 — placeholder stub | **Drop** |
| DigitalCoreArchitecture | 30 | T4 — placeholder stub | **Drop** |
| OperatingModelReinvention | 29 | T4 — placeholder stub | **Drop** |
| TransformationGovernance | 29 | T4 — placeholder stub | **Drop** |

**Net for TT:** harvest 2 of 7 pillar subpages into the canonical `technology-transformation` service as nested content blocks. Drop the other 5. All 7 nested URLs `301` to the canonical `technology-transformation` slug.

---

## Orphan / Routing Inconsistencies

Files on disk that may not be routed (worth a sweep in G7):

- `digital-engineering/` has 7 top-level page files but `serviceRoutes.jsx` only registers 4 (MVPAcceleration, ProductStrategyExperienceDesign, SoftwareDevelopment, APIMicroservicesEngineering). 3 files potentially orphaned.
- `enterprise-applications/` has 6 page files but only 4 are routed (EPI, Pimcore, Salesforce, Servicenow). 2 files potentially orphaned.
- `product-engineering/` has 7 page files but 6 are routed. 1 file potentially orphaned.

These are not blockers for G1–G6 but should be deleted in G7 along with the rest of the legacy tree. Flagging now so they're not mistaken for hidden premium content.

---

## Cognition Pilot Scope (G2 Target)

**Services to migrate (11):**

| Slug | Tier | G2 work |
|---|---|---|
| agentic-ai | T1 | Lift `richContent` from `AgenticAI.jsx` data + `AICustomSections` |
| ai-cognitive-computing | T1 | Same |
| data-science-ai | T1 | Same |
| genai-business-services | T1 | Same |
| mlops | T1 | Same |
| analytics | T3 | Lift bespoke `service` data (incl. JSX `fullDescription`) — no CustomSections to lift |
| big-data | T3 (assumed) | Same |
| digital-process-automation | T4 | Light hardening pass (copy/imagery tightening) — stays on `ServicePageReal` |
| robotic-process-automation | T4 | Same |
| business-process-management | T4 | Same |
| intelligent-automation | T4 | Same |

**G2 deliverables:**

1. Extend `frontend/src/data/servicesData.js` schema with optional `richContent` field.
2. Create `frontend/src/components/services/cognition/` folder. Move `AICustomSections.jsx` there (or import from current location during pilot; relocate in G7).
3. Upgrade `frontend/src/pages/ServicePageReal.jsx` to detect `richContent` and render the premium path (lifted `ServicePageTemplate` patterns) vs. existing skeleton path.
4. Wire all 5 T1 AI services to render via the premium path.
5. Wire 2 T3 services with their bespoke `fullDescription` JSX.
6. Confirm 4 T4 services still render correctly via the unchanged skeleton path.
7. Update one CI gate or add a quick test: `richContent`-bearing services must successfully resolve their referenced section components.

**Out of scope for G2:**
- Touching any non-Cognition service.
- Retiring legacy routes or deleting files (that's G7).
- Authoring new content for T4 services.

---

## Open Questions for User

1. **AI Governance allocation.** AI Governance is canonically in Shield (per the architecture lock), but its legacy page lives in `ai-cognitive/` and shares the AI `CustomSections`. Should it migrate as part of the **Cognition pilot** (since the assets are AI-flavored) or wait for the **Shield rollout** (since canonically it lives there)? Recommendation: **Cognition pilot** — co-locate the AI asset lift with the AI services, since the CustomSections file is shared.

2. **Quality Engineering allocation.** Same pattern — QE is canonically Shield but legacy lives in `product-engineering/`. Suggest: migrate during **Foundry** PR (G4 or G5), since most other product-engineering services land in Foundry and a single PR for that whole legacy folder is cleaner.

3. **Mid-tier handling.** Should T3 services (Analytics, AWS, etc.) get full asset lift in G2 (more work), or just have their bespoke `service` data + JSX `fullDescription` ported (less work, less polish)? Recommendation: **port the data only** in their respective dept's PR. Defer full visual polish to a future track.

4. **Orphan files.** Confirm you want the 5+ orphan page files deleted in G7 alongside the rest of the legacy tree (no special treatment).

5. **TT pillar subpages.** Confirm the recommendation: harvest 2 of 7 into `technology-transformation`, drop 5, redirect all 7 nested URLs to canonical `technology-transformation`.

---

## Next Step

Awaiting answers to questions 1–5 (especially #1 — AI Governance pilot inclusion). Once decided, **G2 can begin**: schema extension + Cognition pilot wiring. Estimate 1–2 working days for G2 once started.
