// ---------------------------------------------------------------------------
// HANUMANAS Agent Registration — all 80 agents across 10 engines.
//
// Phase 1:  Governance Operations Engine — 8 agents  ✓ COMPLETE
// Phase 2:  Sovereignty, Audit Ledger, Autonomy Boundary — 24 agents  ✓ COMPLETE
// Phase 3:  Access Sentinel, Intelligence Registry, Egress Control — 24 agents  ✓ COMPLETE
// Phase 4:  Policy, Trust & Compliance, Risk Intelligence — 24 agents  ✓ COMPLETE
//
// Import this file once (from hanumanasEngineDispatcher.ts) for the side effects.
// ---------------------------------------------------------------------------

import { registerAgent }   from './agentRegistry'

// ── Phase 1: GovernanceOps ────────────────────────────────────────────────────
import { runCoordinatorAgent }   from '../engines/governance-ops/agents/coordinatorAgent'
import { runEngineHealthAgent }  from '../engines/governance-ops/agents/engineHealthAgent'
import { runWorkflowAgent }      from '../engines/governance-ops/agents/workflowAgent'
import { runAlertingAgent }      from '../engines/governance-ops/agents/alertingAgent'
import { runEscalationAgent }    from '../engines/governance-ops/agents/escalationAgent'
import { runInvestigationAgent } from '../engines/governance-ops/agents/investigationAgent'
import { runAnalyticsAgent }     from '../engines/governance-ops/agents/analyticsAgent'
import { runReportingAgent }     from '../engines/governance-ops/agents/reportingAgent'

// ── Phase 2: Sovereignty ─────────────────────────────────────────────────────
import { runOwnershipAgent }       from '../engines/sovereignty/agents/ownershipAgent'
import { runCustodyAgent }         from '../engines/sovereignty/agents/custodyAgent'
import { runClassificationAgent }  from '../engines/sovereignty/agents/classificationAgent'
import { runApprovalAgent }        from '../engines/sovereignty/agents/approvalAgent'
import { runVerifierAgent }        from '../engines/sovereignty/agents/verifierAgent'
import { runAttributionAgent }     from '../engines/sovereignty/agents/attributionAgent'
import { runChainOfCustodyAgent }  from '../engines/sovereignty/agents/chainOfCustodyAgent'
import { runLifecycleAgent }       from '../engines/sovereignty/agents/lifecycleAgent'

// ── Phase 2: Audit Ledger ────────────────────────────────────────────────────
import { runLoggerAgent }              from '../engines/audit-ledger/agents/loggerAgent'
import { runDecisionRecorderAgent }    from '../engines/audit-ledger/agents/decisionRecorderAgent'
import { runExecutionTrackerAgent }    from '../engines/audit-ledger/agents/executionTrackerAgent'
import { runPromptRecorderAgent }      from '../engines/audit-ledger/agents/promptRecorderAgent'
import { runOutcomeRecorderAgent }     from '../engines/audit-ledger/agents/outcomeRecorderAgent'
import { runCostTrackingAgent }        from '../engines/audit-ledger/agents/costTrackingAgent'
import { runModelUsageAgent }          from '../engines/audit-ledger/agents/modelUsageAgent'
import { runComplianceEvidenceAgent }  from '../engines/audit-ledger/agents/complianceEvidenceAgent'

// ── Phase 3: Access Sentinel ─────────────────────────────────────────────────
import { runRoleValidatorAgent }         from '../engines/access-sentinel/agents/roleValidatorAgent'
import { runPermissionEvaluatorAgent }   from '../engines/access-sentinel/agents/permissionEvaluatorAgent'
import { runSessionGuardianAgent }       from '../engines/access-sentinel/agents/sessionGuardianAgent'
import { runAuthenticationAgent }        from '../engines/access-sentinel/agents/authenticationAgent'
import { runAuthorizationAgent }         from '../engines/access-sentinel/agents/authorizationAgent'
import { runThreatDetectionAgent }       from '../engines/access-sentinel/agents/threatDetectionAgent'
import { runTrustScoreAgent }            from '../engines/access-sentinel/agents/trustScoreAgent'
import { runGeoValidationAgent }         from '../engines/access-sentinel/agents/geoValidationAgent'

// ── Phase 3: Intelligence Registry ───────────────────────────────────────────
import { runAssetCatalogAgent }            from '../engines/intelligence-registry/agents/assetCatalogAgent'
import { runKnowledgeRegistrationAgent }   from '../engines/intelligence-registry/agents/knowledgeRegistrationAgent'
import { runVersionControlAgent }          from '../engines/intelligence-registry/agents/versionControlAgent'
import { runMetadataAgent }                from '../engines/intelligence-registry/agents/metadataAgent'
import { runKnowledgeLineageAgent }        from '../engines/intelligence-registry/agents/knowledgeLineageAgent'
import { runRetentionAgent }               from '../engines/intelligence-registry/agents/retentionAgent'
import { runClassificationRegistryAgent }  from '../engines/intelligence-registry/agents/classificationRegistryAgent'
import { runArchiveAgent }                 from '../engines/intelligence-registry/agents/archiveAgent'

// ── Phase 3: Egress Control ───────────────────────────────────────────────────
import { runExportMonitorAgent }           from '../engines/egress-control/agents/exportMonitorAgent'
import { runDistributionTrackerAgent }     from '../engines/egress-control/agents/distributionTrackerAgent'
import { runExternalShareAuditorAgent }    from '../engines/egress-control/agents/externalShareAuditorAgent'
import { runLeakDetectionAgent }           from '../engines/egress-control/agents/leakDetectionAgent'
import { runDataMovementAgent }            from '../engines/egress-control/agents/dataMovementAgent'
import { runTransmissionMonitorAgent }     from '../engines/egress-control/agents/transmissionMonitorAgent'
import { runDestinationVerificationAgent } from '../engines/egress-control/agents/destinationVerificationAgent'
import { runDisclosureTrackerAgent }       from '../engines/egress-control/agents/disclosureTrackerAgent'

// ── Phase 4: Policy ───────────────────────────────────────────────────────────
import { runPolicyEvaluatorAgent }    from '../engines/policy/agents/policyEvaluatorAgent'
import { runApprovalGatekeeperAgent } from '../engines/policy/agents/approvalGatekeeperAgent'
import { runEnforcementAgent }        from '../engines/policy/agents/enforcementAgent'
import { runRiskPolicyAgent }         from '../engines/policy/agents/riskPolicyAgent'
import { runDecisionValidatorAgent }  from '../engines/policy/agents/decisionValidatorAgent'
import { runRestrictionAgent }        from '../engines/policy/agents/restrictionAgent'
import { runComplianceRuleAgent }     from '../engines/policy/agents/complianceRuleAgent'
import { runExceptionHandlerAgent }   from '../engines/policy/agents/exceptionHandlerAgent'

// ── Phase 4: Trust & Compliance ───────────────────────────────────────────────
import { runIsoComplianceAgent }       from '../engines/trust-compliance/agents/isoComplianceAgent'
import { runSoc2ComplianceAgent }      from '../engines/trust-compliance/agents/soc2ComplianceAgent'
import { runDpdpComplianceAgent }      from '../engines/trust-compliance/agents/dpdpComplianceAgent'
import { runGdprComplianceAgent }      from '../engines/trust-compliance/agents/gdprComplianceAgent'
import { runEvidenceCollectionAgent }  from '../engines/trust-compliance/agents/evidenceCollectionAgent'
import { runTrustScoringAgent }        from '../engines/trust-compliance/agents/trustScoringAgent'
import { runControlValidationAgent }   from '../engines/trust-compliance/agents/controlValidationAgent'
import { runAuditReadinessAgent }      from '../engines/trust-compliance/agents/auditReadinessAgent'

// ── Phase 4: Risk Intelligence ────────────────────────────────────────────────
import { runRiskAssessmentAgent }      from '../engines/risk-intelligence/agents/riskAssessmentAgent'
import { runAnomalyDetectionAgent }    from '../engines/risk-intelligence/agents/anomalyDetectionAgent'
import { runThreatForecastAgent }      from '../engines/risk-intelligence/agents/threatForecastAgent'
import { runViolationPredictorAgent }  from '../engines/risk-intelligence/agents/violationPredictorAgent'
import { runBehaviorAnalysisAgent }    from '../engines/risk-intelligence/agents/behaviorAnalysisAgent'
import { runIntelligenceRiskAgent }    from '../engines/risk-intelligence/agents/intelligenceRiskAgent'
import { runOperationalRiskAgent }     from '../engines/risk-intelligence/agents/operationalRiskAgent'
import { runExecutiveAlertAgent }      from '../engines/risk-intelligence/agents/executiveAlertAgent'

// ── Phase 2: Autonomy Boundary ───────────────────────────────────────────────
import { runDetectorAgent }           from '../engines/autonomy-boundary/agents/detectorAgent'
import { runSchedulerMonitorAgent }   from '../engines/autonomy-boundary/agents/schedulerMonitorAgent'
import { runWakeUpTrackerAgent }      from '../engines/autonomy-boundary/agents/wakeUpTrackerAgent'
import { runActionRecorderAgent }     from '../engines/autonomy-boundary/agents/actionRecorderAgent'
import { runRunawayDetectorAgent }    from '../engines/autonomy-boundary/agents/runawayDetectorAgent'
import { runSelfInitiationAgent }     from '../engines/autonomy-boundary/agents/selfInitiationAgent'
import { runActivityMonitorAgent }    from '../engines/autonomy-boundary/agents/activityMonitorAgent'
import { runBehaviorDriftAgent }      from '../engines/autonomy-boundary/agents/behaviorDriftAgent'

// ---------------------------------------------------------------------------
// ── 1. GOVERNANCE_OPS — Phase 1, fully implemented ──────────────────────────
// ---------------------------------------------------------------------------

registerAgent({ id: 'govops.coordinator',   name: 'Governance Coordinator Agent', engine: 'GOVERNANCE_OPS', phase: 1, usesLLM: true,  triggers: ['schedule.6h', 'on-demand'],                              description: 'Top-level synthesis of all engine health and governance state', run: runCoordinatorAgent   })
registerAgent({ id: 'govops.engine-health', name: 'Engine Health Agent',          engine: 'GOVERNANCE_OPS', phase: 1, usesLLM: false, triggers: ['schedule.1h'],                                           description: 'Checks all 10 engines have run recently — flags stale or silent engines', run: runEngineHealthAgent  })
registerAgent({ id: 'govops.workflow',      name: 'Workflow Agent',                engine: 'GOVERNANCE_OPS', phase: 1, usesLLM: false, triggers: ['schedule.6h', 'on-demand'],                              description: 'Tracks open investigations, pending escalations, and governance workflow state', run: runWorkflowAgent      })
registerAgent({ id: 'govops.alerting',      name: 'Alerting Agent',               engine: 'GOVERNANCE_OPS', phase: 1, usesLLM: false, triggers: ['schedule.1h', 'event.POLICY_VIOLATION'],                  description: 'Scans for alert conditions — CRITICAL verdicts, burst violations, denial spikes', run: runAlertingAgent      })
registerAgent({ id: 'govops.escalation',    name: 'Escalation Agent',             engine: 'GOVERNANCE_OPS', phase: 1, usesLLM: false, triggers: ['schedule.6h'],                                           description: 'Identifies WARN findings unresolved for >6h and escalates to CRITICAL', run: runEscalationAgent    })
registerAgent({ id: 'govops.investigation', name: 'Investigation Agent',          engine: 'GOVERNANCE_OPS', phase: 1, usesLLM: true,  triggers: ['event.POLICY_VIOLATION', 'event.ACCESS_DENIED'],         description: 'Assembles context and writes investigation reports on triggered governance events', run: runInvestigationAgent })
registerAgent({ id: 'govops.analytics',     name: 'Governance Analytics Agent',   engine: 'GOVERNANCE_OPS', phase: 1, usesLLM: true,  triggers: ['schedule.24h'],                                          description: '7-day trend analysis of governance health across all engines', run: runAnalyticsAgent     })
registerAgent({ id: 'govops.reporting',     name: 'Reporting Agent',              engine: 'GOVERNANCE_OPS', phase: 1, usesLLM: true,  triggers: ['schedule.24h'],                                          description: 'Daily executive governance report with health score for ADMIN', run: runReportingAgent     })

// ---------------------------------------------------------------------------
// ── 2. SOVEREIGNTY — Phase 2, fully implemented ─────────────────────────────
// ---------------------------------------------------------------------------

registerAgent({ id: 'sovereignty.ownership',        name: 'Ownership Agent',          engine: 'SOVEREIGNTY', phase: 2, usesLLM: false, triggers: ['schedule.6h'],                description: 'Verifies ADMIN ownership on all intelligence assets',                                    run: runOwnershipAgent       })
registerAgent({ id: 'sovereignty.custody',          name: 'Custody Agent',            engine: 'SOVEREIGNTY', phase: 2, usesLLM: false, triggers: ['schedule.6h'],                description: 'Tracks chain of custody completeness for all KIMMP intelligence assets',                run: runCustodyAgent         })
registerAgent({ id: 'sovereignty.classification',   name: 'Classification Agent',     engine: 'SOVEREIGNTY', phase: 2, usesLLM: false, triggers: ['schedule.6h'],                description: 'Enforces classification levels: PUBLIC | INTERNAL | CONFIDENTIAL | RESTRICTED',          run: runClassificationAgent  })
registerAgent({ id: 'sovereignty.approval',         name: 'Approval Agent',           engine: 'SOVEREIGNTY', phase: 2, usesLLM: false, triggers: ['schedule.6h'],                description: 'Validates ADMIN approval on sovereignty-sensitive operations',                            run: runApprovalAgent        })
registerAgent({ id: 'sovereignty.verifier',         name: 'Asset Verifier Agent',     engine: 'SOVEREIGNTY', phase: 2, usesLLM: false, triggers: ['schedule.24h'],               description: 'Verifies integrity and provenance of all registered intelligence assets',                  run: runVerifierAgent        })
registerAgent({ id: 'sovereignty.attribution',      name: 'Attribution Agent',        engine: 'SOVEREIGNTY', phase: 2, usesLLM: false, triggers: ['schedule.24h'],               description: 'Validates attribution completeness: system, assetType, actor, source on every asset',     run: runAttributionAgent     })
registerAgent({ id: 'sovereignty.chain-of-custody', name: 'Chain of Custody Agent',   engine: 'SOVEREIGNTY', phase: 2, usesLLM: false, triggers: ['schedule.24h'],               description: 'Maintains immutable chain of custody via dispatchId + assetSource linkage',               run: runChainOfCustodyAgent  })
registerAgent({ id: 'sovereignty.lifecycle',        name: 'Lifecycle Agent',          engine: 'SOVEREIGNTY', phase: 2, usesLLM: true,  triggers: ['schedule.24h'],               description: 'Manages retention, expiry, and archival of intelligence assets',                          run: runLifecycleAgent       })

// ---------------------------------------------------------------------------
// ── 3. AUDIT_LEDGER — Phase 2, fully implemented ────────────────────────────
// ---------------------------------------------------------------------------

registerAgent({ id: 'audit.logger',            name: 'Activity Logger Agent',      engine: 'AUDIT_LEDGER', phase: 2, usesLLM: false, triggers: ['schedule.1h'],  description: 'Checks all 6 HANUMANAS event types have ledger entries — flags logging gaps',                    run: runLoggerAgent              })
registerAgent({ id: 'audit.decision-recorder', name: 'Decision Recorder Agent',    engine: 'AUDIT_LEDGER', phase: 2, usesLLM: false, triggers: ['schedule.6h'],  description: 'Verifies ACTIVATION events have complete decision metadata: trigger, system, priority',        run: runDecisionRecorderAgent    })
registerAgent({ id: 'audit.execution-tracker', name: 'Execution Tracker Agent',    engine: 'AUDIT_LEDGER', phase: 2, usesLLM: false, triggers: ['schedule.1h'],  description: 'Tracks durationMs on activations — flags slow (>30s) or suspiciously fast (<100ms) runs',    run: runExecutionTrackerAgent    })
registerAgent({ id: 'audit.prompt-recorder',   name: 'Prompt Recorder Agent',      engine: 'AUDIT_LEDGER', phase: 2, usesLLM: false, triggers: ['schedule.24h'], description: 'Verifies agentsRun roster is recorded on every KIMMP activation',                             run: runPromptRecorderAgent      })
registerAgent({ id: 'audit.outcome-recorder',  name: 'Outcome Recorder Agent',     engine: 'AUDIT_LEDGER', phase: 2, usesLLM: false, triggers: ['schedule.6h'],  description: 'Validates outcome fields: priority, confidence, dispatchId on ACTIVATION events',               run: runOutcomeRecorderAgent     })
registerAgent({ id: 'audit.cost-tracking',     name: 'Cost Tracking Agent',        engine: 'AUDIT_LEDGER', phase: 2, usesLLM: false, triggers: ['schedule.24h'], description: 'Tracks autonomous vs ADMIN-triggered activation ratio — flags high autonomous rates',            run: runCostTrackingAgent        })
registerAgent({ id: 'audit.model-usage',       name: 'Model Usage Agent',          engine: 'AUDIT_LEDGER', phase: 2, usesLLM: false, triggers: ['schedule.24h'], description: 'Breaks down KIMMP activations by system — proxy for model usage distribution',                 run: runModelUsageAgent          })
registerAgent({ id: 'audit.compliance-evidence',name:'Compliance Evidence Agent',  engine: 'AUDIT_LEDGER', phase: 2, usesLLM: true,  triggers: ['schedule.24h'], description: 'LLM-compiled audit evidence coverage report across all 6 HANUMANAS event types',                    run: runComplianceEvidenceAgent  })

// ---------------------------------------------------------------------------
// ── 4. AUTONOMY_BOUNDARY — Phase 2, fully implemented ───────────────────────
// ---------------------------------------------------------------------------

registerAgent({ id: 'autonomy.detector',          name: 'Autonomy Detector Agent',      engine: 'AUTONOMY_BOUNDARY', phase: 2, usesLLM: false, triggers: ['schedule.1h', 'event.AUTONOMOUS'], description: 'Detects autonomous/total activation ratio — warns on excessive autonomy',              run: runDetectorAgent         })
registerAgent({ id: 'autonomy.scheduler-monitor', name: 'Scheduler Monitor Agent',      engine: 'AUTONOMY_BOUNDARY', phase: 2, usesLLM: false, triggers: ['schedule.1h'],                     description: 'Verifies all autonomous events have SCHEDULER/KIMMP actor — CRITICAL if not',         run: runSchedulerMonitorAgent })
registerAgent({ id: 'autonomy.wake-up-tracker',   name: 'Wake-Up Tracker Agent',        engine: 'AUTONOMY_BOUNDARY', phase: 2, usesLLM: false, triggers: ['schedule.6h'],                     description: 'Tracks scheduler vs event-triggered vs ADMIN-direct activation breakdown',              run: runWakeUpTrackerAgent    })
registerAgent({ id: 'autonomy.action-recorder',   name: 'Action Recorder Agent',        engine: 'AUTONOMY_BOUNDARY', phase: 2, usesLLM: false, triggers: ['event.AUTONOMOUS'],                description: 'Verifies autonomous events have complete metadata: system, durationMs, agentsRun',      run: runActionRecorderAgent   })
registerAgent({ id: 'autonomy.runaway-detector',  name: 'Runaway Loop Detector Agent',  engine: 'AUTONOMY_BOUNDARY', phase: 2, usesLLM: false, triggers: ['schedule.1h'],                     description: 'Detects >20 autonomous events in any 1h window — CRITICAL runaway detection',          run: runRunawayDetectorAgent  })
registerAgent({ id: 'autonomy.self-initiation',   name: 'Self-Initiation Tracker Agent',engine: 'AUTONOMY_BOUNDARY', phase: 2, usesLLM: false, triggers: ['schedule.6h'],                     description: 'Flags autonomous events from unapproved actors or trigger patterns — CRITICAL',        run: runSelfInitiationAgent   })
registerAgent({ id: 'autonomy.activity-monitor',  name: 'Activity Monitor Agent',       engine: 'AUTONOMY_BOUNDARY', phase: 2, usesLLM: false, triggers: ['schedule.1h'],                     description: 'Breaks down autonomous actions per KIMMP system — flags high-activity systems',         run: runActivityMonitorAgent  })
registerAgent({ id: 'autonomy.behavior-drift',    name: 'Behavior Drift Agent',         engine: 'AUTONOMY_BOUNDARY', phase: 2, usesLLM: true,  triggers: ['schedule.24h'],                    description: 'LLM analysis of 7-day autonomous behavior trend — detects drift or instability',       run: runBehaviorDriftAgent    })

// ---------------------------------------------------------------------------
// ── 5. ACCESS_SENTINEL — Phase 3, fully implemented ─────────────────────────
// ---------------------------------------------------------------------------

registerAgent({ id: 'sentinel.role-validator',       name: 'Role Validator Agent',       engine: 'ACCESS_SENTINEL', phase: 3, usesLLM: false, triggers: ['schedule.1h', 'event.ACCESS_DENIED'], description: 'Validates every KIMMP activation comes from an approved actor — CRITICAL if unapproved',     run: runRoleValidatorAgent       })
registerAgent({ id: 'sentinel.permission-evaluator', name: 'Permission Evaluator Agent', engine: 'ACCESS_SENTINEL', phase: 3, usesLLM: false, triggers: ['schedule.6h'],                          description: 'Evaluates actor permission distribution on all KIMMP activations — flags unpermitted actors', run: runPermissionEvaluatorAgent })
registerAgent({ id: 'sentinel.session-guardian',     name: 'Session Guardian Agent',     engine: 'ACCESS_SENTINEL', phase: 3, usesLLM: false, triggers: ['schedule.1h'],                          description: 'Detects burst denial patterns per actor — flags session probing or credential attacks',        run: runSessionGuardianAgent     })
registerAgent({ id: 'sentinel.authentication',       name: 'Authentication Agent',       engine: 'ACCESS_SENTINEL', phase: 3, usesLLM: false, triggers: ['schedule.6h'],                          description: 'Audits authentication failure rate across KIMMP systems — CRITICAL if >20 denials/6h',        run: runAuthenticationAgent      })
registerAgent({ id: 'sentinel.authorization',        name: 'Authorization Agent',        engine: 'ACCESS_SENTINEL', phase: 3, usesLLM: false, triggers: ['schedule.6h'],                          description: 'Detects repeated actor/system authorization failures (≥3 denials) — flags boundary breach',   run: runAuthorizationAgent       })
registerAgent({ id: 'sentinel.threat-detection',     name: 'Threat Detection Agent',     engine: 'ACCESS_SENTINEL', phase: 3, usesLLM: false, triggers: ['schedule.1h'],                          description: 'Sliding-window brute-force detection — CRITICAL if ≥10 denials in any 10-minute window',      run: runThreatDetectionAgent     })
registerAgent({ id: 'sentinel.trust-score',          name: 'Trust Score Agent',          engine: 'ACCESS_SENTINEL', phase: 3, usesLLM: false, triggers: ['schedule.6h'],                          description: 'Computes composite access trust score (0-100) from denial rate and autonomy ratio',           run: runTrustScoreAgent          })
registerAgent({ id: 'sentinel.geo-validation',       name: 'Geo Validation Agent',       engine: 'ACCESS_SENTINEL', phase: 3, usesLLM: false, triggers: ['schedule.24h'],                         description: 'Flags dual-state actors (activated + denied in same 24h) as access origin anomalies',         run: runGeoValidationAgent       })

// ---------------------------------------------------------------------------
// ── 6. INTELLIGENCE_REGISTRY — Phase 3, fully implemented ───────────────────
// ---------------------------------------------------------------------------

registerAgent({ id: 'registry.asset-catalog',           name: 'Asset Catalog Agent',           engine: 'INTELLIGENCE_REGISTRY', phase: 3, usesLLM: false, triggers: ['schedule.6h'],          description: 'Full catalog of intelligence assets by system and type — master registry view',              run: runAssetCatalogAgent           })
registerAgent({ id: 'registry.knowledge-registration',  name: 'Knowledge Registration Agent',  engine: 'INTELLIGENCE_REGISTRY', phase: 3, usesLLM: false, triggers: ['event.KNOWLEDGE_ASSET'], description: 'Validates new asset registrations have all required fields — WARN if incomplete',                   run: runKnowledgeRegistrationAgent  })
registerAgent({ id: 'registry.version-control',         name: 'Version Control Agent',         engine: 'INTELLIGENCE_REGISTRY', phase: 3, usesLLM: false, triggers: ['schedule.24h'],         description: 'Counts unique assets and versioned assets (same assetId registered multiple times)',          run: runVersionControlAgent         })
registerAgent({ id: 'registry.metadata',                name: 'Metadata Agent',                engine: 'INTELLIGENCE_REGISTRY', phase: 3, usesLLM: false, triggers: ['schedule.6h'],          description: 'Enforces metadata completeness across all 6 required fields — WARN if any below 70%',         run: runMetadataAgent               })
registerAgent({ id: 'registry.knowledge-lineage',       name: 'Knowledge Lineage Agent',       engine: 'INTELLIGENCE_REGISTRY', phase: 3, usesLLM: false, triggers: ['schedule.24h'],         description: 'Audits assetSource + dispatchId lineage completeness — WARN if full lineage <70%',            run: runKnowledgeLineageAgent       })
registerAgent({ id: 'registry.retention',               name: 'Retention Agent',               engine: 'INTELLIGENCE_REGISTRY', phase: 3, usesLLM: false, triggers: ['schedule.24h'],         description: 'Age-buckets all assets (fresh/mature/ageing/stale) — WARN if stale count >10',               run: runRetentionAgent              })
registerAgent({ id: 'registry.classification-registry', name: 'Classification Registry Agent', engine: 'INTELLIGENCE_REGISTRY', phase: 3, usesLLM: false, triggers: ['schedule.6h'],          description: 'Audits classification label coverage — WARN if any assets lack valid classification',         run: runClassificationRegistryAgent })
registerAgent({ id: 'registry.archive',                 name: 'Archive Agent',                 engine: 'INTELLIGENCE_REGISTRY', phase: 3, usesLLM: false, triggers: ['schedule.24h'],         description: 'Identifies assets beyond 180-day retention threshold eligible for archival',                  run: runArchiveAgent                })

// ---------------------------------------------------------------------------
// ── 7. EGRESS_CONTROL — Phase 3, fully implemented ──────────────────────────
// ---------------------------------------------------------------------------

registerAgent({ id: 'egress.export-monitor',           name: 'Export Monitor Agent',           engine: 'EGRESS_CONTROL', phase: 3, usesLLM: false, triggers: ['schedule.1h', 'event.EGRESS'], description: 'Monitors EGRESS volume per hour — WARN at 10, CRITICAL at 50 exports',                      run: runExportMonitorAgent           })
registerAgent({ id: 'egress.distribution-tracker',    name: 'Distribution Tracker Agent',     engine: 'EGRESS_CONTROL', phase: 3, usesLLM: false, triggers: ['schedule.6h'],                  description: 'Tracks egress distribution breadth — WARN if >5 unique actors receive intelligence',         run: runDistributionTrackerAgent     })
registerAgent({ id: 'egress.external-share-auditor',  name: 'External Share Auditor Agent',   engine: 'EGRESS_CONTROL', phase: 3, usesLLM: false, triggers: ['schedule.6h'],                  description: 'Validates egress actors — CRITICAL if any unauthorized actor initiates egress',               run: runExternalShareAuditorAgent    })
registerAgent({ id: 'egress.leak-detection',          name: 'Leak Detection Agent',           engine: 'EGRESS_CONTROL', phase: 3, usesLLM: false, triggers: ['schedule.1h'],                  description: 'CRITICAL on RESTRICTED asset egress; WARN on rapid-burst (>5 events in 5 min) pattern',      run: runLeakDetectionAgent           })
registerAgent({ id: 'egress.data-movement',           name: 'Data Movement Agent',            engine: 'EGRESS_CONTROL', phase: 3, usesLLM: false, triggers: ['schedule.6h'],                  description: 'Maps EGRESS distribution across systems — WARN if single system >70% of all outbound data',  run: runDataMovementAgent            })
registerAgent({ id: 'egress.transmission-monitor',    name: 'Transmission Monitor Agent',     engine: 'EGRESS_CONTROL', phase: 3, usesLLM: false, triggers: ['schedule.1h'],                  description: 'Checks metadata completeness on EGRESS events — WARN if any missing system/actor/assetId',   run: runTransmissionMonitorAgent     })
registerAgent({ id: 'egress.destination-verification',name: 'Destination Verification Agent', engine: 'EGRESS_CONTROL', phase: 3, usesLLM: false, triggers: ['schedule.6h'],                  description: 'Verifies destination metadata on EGRESS events — WARN if destination field missing',         run: runDestinationVerificationAgent })
registerAgent({ id: 'egress.disclosure-tracker',      name: 'Disclosure Tracker Agent',       engine: 'EGRESS_CONTROL', phase: 3, usesLLM: true,  triggers: ['schedule.24h'],                 description: 'LLM 7-day EGRESS trend analysis — WARN on increasing disclosure volume',                     run: runDisclosureTrackerAgent       })

// ---------------------------------------------------------------------------
// ── 8. POLICY — Phase 4, fully implemented ──────────────────────────────────
// ---------------------------------------------------------------------------

registerAgent({ id: 'policy.evaluator',           name: 'Policy Evaluator Agent',       engine: 'POLICY', phase: 4, usesLLM: false, triggers: ['schedule.1h', 'event.POLICY_VIOLATION'], description: 'Counts policy violations vs prior 24h; CRITICAL if >5, WARN if any',                           run: runPolicyEvaluatorAgent    })
registerAgent({ id: 'policy.approval-gatekeeper', name: 'Approval Gatekeeper Agent',    engine: 'POLICY', phase: 4, usesLLM: false, triggers: ['schedule.6h'],                          description: 'Checks HIGH-priority activations originated from ADMIN/SCHEDULER approval chain',             run: runApprovalGatekeeperAgent })
registerAgent({ id: 'policy.enforcement',         name: 'Enforcement Agent',             engine: 'POLICY', phase: 4, usesLLM: false, triggers: ['schedule.1h'],                          description: 'Measures enforcement rate (activations vs violations) — CRITICAL if any CRITICAL agent runs', run: runEnforcementAgent        })
registerAgent({ id: 'policy.risk-policy',         name: 'Risk Policy Agent',             engine: 'POLICY', phase: 4, usesLLM: false, triggers: ['schedule.6h'],                          description: 'CRITICAL compound risk when violations + CRITICAL agent findings coincide in 6h',            run: runRiskPolicyAgent         })
registerAgent({ id: 'policy.decision-validator',  name: 'Decision Validator Agent',      engine: 'POLICY', phase: 4, usesLLM: false, triggers: ['schedule.6h'],                          description: 'Validates HIGH-priority activations have complete trigger/confidence/dispatchId metadata',    run: runDecisionValidatorAgent  })
registerAgent({ id: 'policy.restriction',         name: 'Restriction Agent',             engine: 'POLICY', phase: 4, usesLLM: false, triggers: ['schedule.24h'],                         description: 'CRITICAL when autonomous actions co-occur with policy violations within ±5min window',        run: runRestrictionAgent        })
registerAgent({ id: 'policy.compliance-rule',     name: 'Compliance Rule Agent',         engine: 'POLICY', phase: 4, usesLLM: true,  triggers: ['schedule.24h'],                         description: 'LLM evaluation of whether active policies are achieving their goals — 7-day violation trend', run: runComplianceRuleAgent     })
registerAgent({ id: 'policy.exception-handler',   name: 'Exception Handler Agent',       engine: 'POLICY', phase: 4, usesLLM: false, triggers: ['on-demand'],                            description: 'Tracks autonomous HIGH-priority activations that pass policy but warrant oversight',          run: runExceptionHandlerAgent   })

// ---------------------------------------------------------------------------
// ── 9. TRUST_COMPLIANCE — Phase 4, fully implemented ────────────────────────
// ---------------------------------------------------------------------------

registerAgent({ id: 'compliance.iso',                name: 'ISO Compliance Agent',           engine: 'TRUST_COMPLIANCE', phase: 4, usesLLM: false, triggers: ['schedule.24h'], description: 'ISO 27001/42001 control coverage check across 6 HANUMANAS event domains — WARN if any gap',         run: runIsoComplianceAgent       })
registerAgent({ id: 'compliance.soc2',               name: 'SOC2 Compliance Agent',          engine: 'TRUST_COMPLIANCE', phase: 4, usesLLM: false, triggers: ['schedule.24h'], description: 'SOC2 Type II: Security, Operations, Risk, Privacy, Availability — 5 criteria evidenced',          run: runSoc2ComplianceAgent      })
registerAgent({ id: 'compliance.dpdp',               name: 'DPDP Compliance Agent',          engine: 'TRUST_COMPLIANCE', phase: 4, usesLLM: false, triggers: ['schedule.24h'], description: 'India DPDP Act 2023: lawful processing, purpose limitation, data transfer monitoring',            run: runDpdpComplianceAgent      })
registerAgent({ id: 'compliance.gdpr',               name: 'GDPR Compliance Agent',          engine: 'TRUST_COMPLIANCE', phase: 4, usesLLM: false, triggers: ['schedule.24h'], description: 'GDPR Art. 5/25/32/44: data minimisation, security measures, restricted transfer checks',          run: runGdprComplianceAgent      })
registerAgent({ id: 'compliance.evidence',           name: 'Evidence Collection Agent',      engine: 'TRUST_COMPLIANCE', phase: 4, usesLLM: true,  triggers: ['schedule.24h'], description: 'LLM-compiled audit evidence package summary across all 6 HANUMANAS event types (30d)',                run: runEvidenceCollectionAgent  })
registerAgent({ id: 'compliance.trust-scoring',      name: 'Trust Scoring Agent',            engine: 'TRUST_COMPLIANCE', phase: 4, usesLLM: false, triggers: ['schedule.6h'],  description: 'Multi-factor KIMMP trust score (0-100): denial rate, violations, CRITICAL/WARN findings, autonomy', run: runTrustScoringAgent        })
registerAgent({ id: 'compliance.control-validation', name: 'Control Validation Agent',       engine: 'TRUST_COMPLIANCE', phase: 4, usesLLM: false, triggers: ['schedule.24h'], description: 'Validates 5 governance controls are active: scheduler, shield, egress, policy, audit ledger',      run: runControlValidationAgent   })
registerAgent({ id: 'compliance.audit-readiness',    name: 'Audit Readiness Agent',          engine: 'TRUST_COMPLIANCE', phase: 4, usesLLM: true,  triggers: ['schedule.24h'], description: 'LLM audit readiness score (0-100) with gap analysis for external compliance review',              run: runAuditReadinessAgent      })

// ---------------------------------------------------------------------------
// ── 10. RISK_INTELLIGENCE — Phase 4, fully implemented ──────────────────────
// ---------------------------------------------------------------------------

registerAgent({ id: 'risk.assessment',          name: 'Risk Assessment Agent',           engine: 'RISK_INTELLIGENCE', phase: 4, usesLLM: false, triggers: ['schedule.6h'],  description: 'Multi-factor risk score (0-100): CRITICAL×10 + WARN×3 + violations×5 + denials×2 + autonomy', run: runRiskAssessmentAgent      })
registerAgent({ id: 'risk.anomaly-detection',   name: 'Anomaly Detection Agent',         engine: 'RISK_INTELLIGENCE', phase: 4, usesLLM: false, triggers: ['schedule.1h'],  description: 'Compares current-hour event rates to 7-day baseline — CRITICAL if ≥2 event types spike >2×',   run: runAnomalyDetectionAgent    })
registerAgent({ id: 'risk.threat-forecast',     name: 'Threat Forecast Agent',           engine: 'RISK_INTELLIGENCE', phase: 4, usesLLM: true,  triggers: ['schedule.24h'], description: 'LLM 7-day trend analysis — forecasts next-24h risk level and primary risk driver',             run: runThreatForecastAgent      })
registerAgent({ id: 'risk.violation-predictor', name: 'Policy Violation Predictor Agent',engine: 'RISK_INTELLIGENCE', phase: 4, usesLLM: false, triggers: ['schedule.6h'],  description: 'Predictive signal analysis: high-autonomous + denial-spike + CRITICAL = HIGH violation risk',  run: runViolationPredictorAgent  })
registerAgent({ id: 'risk.behavior-analysis',   name: 'Behavior Analysis Agent',         engine: 'RISK_INTELLIGENCE', phase: 4, usesLLM: true,  triggers: ['schedule.24h'], description: 'LLM 7-day behaviour signature: autonomy drift, denial trends, violation patterns',              run: runBehaviorAnalysisAgent    })
registerAgent({ id: 'risk.intelligence-risk',   name: 'Intelligence Risk Agent',         engine: 'RISK_INTELLIGENCE', phase: 4, usesLLM: false, triggers: ['schedule.6h'],  description: 'CRITICAL on RESTRICTED asset egress; risk score from unclassified assets and asset exposure',  run: runIntelligenceRiskAgent    })
registerAgent({ id: 'risk.operational-risk',    name: 'Operational Risk Agent',          engine: 'RISK_INTELLIGENCE', phase: 4, usesLLM: false, triggers: ['schedule.6h'],  description: 'CRITICAL if HANUMANAS scheduler silent >2h; WARN if any of 10 engines silent >24h',              run: runOperationalRiskAgent     })
registerAgent({ id: 'risk.executive-alert',     name: 'Executive Alert Agent',           engine: 'RISK_INTELLIGENCE', phase: 4, usesLLM: true,  triggers: ['schedule.1h'],  description: 'LLM executive risk brief: 6h CRITICAL/WARN count, risk level, top findings for ADMIN',        run: runExecutiveAlertAgent      })
