// ---------------------------------------------------------------------------
// Seed WAANDA Training Data — synthetic REASON phase examples
//
// Bootstraps the Gen 2 corpus with realistic agent-selection scenarios across
// all 5 KIMMP systems. These are replaced over time by real captured data,
// but allow us to verify the fine-tune pipeline immediately.
//
// Run:  npx ts-node -P scripts/tsconfig.json scripts/seed_training_data.ts
// ---------------------------------------------------------------------------

import { prisma } from '../src/lib/prisma'

const REASON_SYSTEM_PROMPT = 'You are an intelligent system making agent selection decisions. Return only valid JSON.'

// ── Synthetic training examples ────────────────────────────────────────────────

const EXAMPLES: {
  system:         string
  trigger:        string
  priority:       'CRITICAL' | 'HIGH' | 'NORMAL'
  agentsUsed:     string[]
  userPrompt:     string
  completion:     string
}[] = [

  // ── LEAD_INTEL ─────────────────────────────────────────────────────────────

  {
    system: 'LEAD_INTEL', trigger: 'NEW_LEAD_CREATED', priority: 'NORMAL',
    agentsUsed: ['SCOUT', 'LEAD_ANALYSIS', 'OPPORTUNITY_SCAN'],
    userPrompt: `System: LEAD INTEL — Scoring\nAvailable agents: SCOUT, LEAD_ANALYSIS, OPPORTUNITY_SCAN, COMPETITOR_INTEL, FORECAST, DECISION_ENGINE\nTrigger: NEW_LEAD_CREATED\nContext: A new lead "Apex Manufacturing" has submitted a consultation form. Industry: Manufacturing. Estimated value: ₹18L.\nSelect which agents to activate.`,
    completion: `{"selectedAgents":["SCOUT","LEAD_ANALYSIS","OPPORTUNITY_SCAN"],"reasoning":"New lead requires intelligence gathering (SCOUT), fit scoring (LEAD_ANALYSIS), and deal size estimation (OPPORTUNITY_SCAN). FORECAST and DECISION_ENGINE are premature without initial analysis.","priority":"NORMAL"}`,
  },
  {
    system: 'LEAD_INTEL', trigger: 'LEAD_STALLED', priority: 'HIGH',
    agentsUsed: ['LEAD_ANALYSIS', 'FORECAST', 'DECISION_ENGINE'],
    userPrompt: `System: LEAD INTEL — Scoring\nAvailable agents: SCOUT, LEAD_ANALYSIS, OPPORTUNITY_SCAN, COMPETITOR_INTEL, FORECAST, DECISION_ENGINE\nTrigger: LEAD_STALLED\nContext: "NovaTech Solutions" has been in Discovery stage for 21 days with no response. Last contact 14 days ago. Deal value ₹32L.\nSelect which agents to activate.`,
    completion: `{"selectedAgents":["LEAD_ANALYSIS","FORECAST","DECISION_ENGINE"],"reasoning":"Stalled lead needs re-qualification (LEAD_ANALYSIS), churn probability forecast (FORECAST), and a recommended re-engagement action (DECISION_ENGINE). No new intel gathering needed — the problem is engagement, not information.","priority":"HIGH"}`,
  },
  {
    system: 'LEAD_INTEL', trigger: 'CHURN_RISK_DETECTED', priority: 'CRITICAL',
    agentsUsed: ['LEAD_ANALYSIS', 'COMPETITOR_INTEL', 'FORECAST', 'DECISION_ENGINE'],
    userPrompt: `System: LEAD INTEL — Scoring\nAvailable agents: SCOUT, LEAD_ANALYSIS, OPPORTUNITY_SCAN, COMPETITOR_INTEL, FORECAST, DECISION_ENGINE\nTrigger: CHURN_RISK_DETECTED\nContext: Multi-signal alert — "Meridian Logistics" has 30d overdue invoice, missed delivery milestone, and no executive engagement in 22 days. KIMMP churn probability: 87%.\nSelect which agents to activate.`,
    completion: `{"selectedAgents":["LEAD_ANALYSIS","COMPETITOR_INTEL","FORECAST","DECISION_ENGINE"],"reasoning":"Critical churn risk requires full escalation stack: re-score the account (LEAD_ANALYSIS), check if competitor is engaged (COMPETITOR_INTEL), forecast revenue impact (FORECAST), and generate urgent recommended action (DECISION_ENGINE). SCOUT and OPPORTUNITY_SCAN not needed — this is retention, not acquisition.","priority":"CRITICAL"}`,
  },
  {
    system: 'LEAD_INTEL', trigger: 'PIPELINE_REVIEW', priority: 'NORMAL',
    agentsUsed: ['OPPORTUNITY_SCAN', 'FORECAST'],
    userPrompt: `System: LEAD INTEL — Scoring\nAvailable agents: SCOUT, LEAD_ANALYSIS, OPPORTUNITY_SCAN, COMPETITOR_INTEL, FORECAST, DECISION_ENGINE\nTrigger: PIPELINE_REVIEW\nContext: Weekly pipeline review. 12 active leads. 3 in Proposal stage. Pipeline total ₹2.4Cr. No specific risk flags.\nSelect which agents to activate.`,
    completion: `{"selectedAgents":["OPPORTUNITY_SCAN","FORECAST"],"reasoning":"Routine pipeline review needs deal health scan (OPPORTUNITY_SCAN) and revenue forecast update (FORECAST). No specific lead anomalies warrant individual scoring or competitive analysis this cycle.","priority":"NORMAL"}`,
  },
  {
    system: 'LEAD_INTEL', trigger: 'HIGH_VALUE_LEAD', priority: 'HIGH',
    agentsUsed: ['SCOUT', 'LEAD_ANALYSIS', 'COMPETITOR_INTEL', 'OPPORTUNITY_SCAN', 'DECISION_ENGINE'],
    userPrompt: `System: LEAD INTEL — Scoring\nAvailable agents: SCOUT, LEAD_ANALYSIS, OPPORTUNITY_SCAN, COMPETITOR_INTEL, FORECAST, DECISION_ENGINE\nTrigger: HIGH_VALUE_LEAD\nContext: Inbound from "Tata Steel Digital" — CTO-level contact. Estimated project scope ₹1.2Cr. BIDS™ implementation + ongoing retainer. Strategic account.\nSelect which agents to activate.`,
    completion: `{"selectedAgents":["SCOUT","LEAD_ANALYSIS","COMPETITOR_INTEL","OPPORTUNITY_SCAN","DECISION_ENGINE"],"reasoning":"High-value strategic account warrants near-full activation: deep background research (SCOUT), fit and risk scoring (LEAD_ANALYSIS), competitive landscape (COMPETITOR_INTEL), deal structure analysis (OPPORTUNITY_SCAN), and immediate recommended next action (DECISION_ENGINE). FORECAST deferred until after initial discovery call.","priority":"HIGH"}`,
  },

  // ── EQORE ──────────────────────────────────────────────────────────────────

  {
    system: 'EQORE', trigger: 'CLIENT_QUERY', priority: 'NORMAL',
    agentsUsed: ['KNOWLEDGE_ENGINE', 'ADVISOR'],
    userPrompt: `System: EQORE — Conversations\nAvailable agents: MEETING_INTEL, CLIENT_INTEL, MEMORY_RECALL, KNOWLEDGE_ENGINE, RESEARCH, ADVISOR\nTrigger: CLIENT_QUERY\nContext: Client "Synapse Health" asks via portal: "What is the BIDS™ Delivery Confidence Engine and how does it track milestone risk?"\nSelect which agents to activate.`,
    completion: `{"selectedAgents":["KNOWLEDGE_ENGINE","ADVISOR"],"reasoning":"A factual product question needs the knowledge base (KNOWLEDGE_ENGINE) and a synthesised advisory response (ADVISOR). No meeting context (MEETING_INTEL), client background needed (CLIENT_INTEL), or research (RESEARCH) required for a product explanation query.","priority":"NORMAL"}`,
  },
  {
    system: 'EQORE', trigger: 'POST_MEETING', priority: 'HIGH',
    agentsUsed: ['MEETING_INTEL', 'CLIENT_INTEL', 'MEMORY_RECALL', 'ADVISOR'],
    userPrompt: `System: EQORE — Conversations\nAvailable agents: MEETING_INTEL, CLIENT_INTEL, MEMORY_RECALL, KNOWLEDGE_ENGINE, RESEARCH, ADVISOR\nTrigger: POST_MEETING\nContext: QBR completed with "Meridian Logistics". 45-minute executive call. Client raised concerns about delivery velocity and budget overrun risk. Transcript available.\nSelect which agents to activate.`,
    completion: `{"selectedAgents":["MEETING_INTEL","CLIENT_INTEL","MEMORY_RECALL","ADVISOR"],"reasoning":"Post-meeting processing needs transcript analysis (MEETING_INTEL), account relationship context (CLIENT_INTEL), prior commitment recall (MEMORY_RECALL), and recommended follow-up actions (ADVISOR). RESEARCH and KNOWLEDGE_ENGINE not needed — the signal is relationship, not information.","priority":"HIGH"}`,
  },
  {
    system: 'EQORE', trigger: 'ESCALATION', priority: 'CRITICAL',
    agentsUsed: ['CLIENT_INTEL', 'MEMORY_RECALL', 'ADVISOR'],
    userPrompt: `System: EQORE — Conversations\nAvailable agents: MEETING_INTEL, CLIENT_INTEL, MEMORY_RECALL, KNOWLEDGE_ENGINE, RESEARCH, ADVISOR\nTrigger: ESCALATION\nContext: Client "Project Phoenix" team has sent a formal escalation email citing 2 missed milestones. SLA breach imminent. Executive intervention required within 4 hours.\nSelect which agents to activate.`,
    completion: `{"selectedAgents":["CLIENT_INTEL","MEMORY_RECALL","ADVISOR"],"reasoning":"Escalation requires immediate context assembly: full account relationship history (CLIENT_INTEL), all prior commitments and SLA terms (MEMORY_RECALL), and escalation response recommended actions (ADVISOR). No meeting to process (MEETING_INTEL) and no external research needed (RESEARCH, KNOWLEDGE_ENGINE) — speed is critical.","priority":"CRITICAL"}`,
  },
  {
    system: 'EQORE', trigger: 'RESEARCH_REQUEST', priority: 'NORMAL',
    agentsUsed: ['RESEARCH', 'KNOWLEDGE_ENGINE', 'ADVISOR'],
    userPrompt: `System: EQORE — Conversations\nAvailable agents: MEETING_INTEL, CLIENT_INTEL, MEMORY_RECALL, KNOWLEDGE_ENGINE, RESEARCH, ADVISOR\nTrigger: RESEARCH_REQUEST\nContext: Internal team asks EQORE: "Can you research the current market for GCC (Global Capability Centre) services in India and how Kangqore's proposition compares?"\nSelect which agents to activate.`,
    completion: `{"selectedAgents":["RESEARCH","KNOWLEDGE_ENGINE","ADVISOR"],"reasoning":"Market research query needs external data gathering (RESEARCH), Kangqore knowledge base for positioning comparison (KNOWLEDGE_ENGINE), and a synthesised advisory output (ADVISOR). No client context or meeting data involved.","priority":"NORMAL"}`,
  },

  // ── ALIS ───────────────────────────────────────────────────────────────────

  {
    system: 'ALIS', trigger: 'DEMAND_SPIKE', priority: 'HIGH',
    agentsUsed: ['SIGNAL_READ', 'WORKFLOW_ORCHESTRATOR', 'STRATEGIST'],
    userPrompt: `System: ALIS — Demand Ops\nAvailable agents: SIGNAL_READ, WORKFLOW_ORCHESTRATOR, TASK_MANAGER, FINANCIAL_SNAPSHOT, ORGANIZATION_HEALTH, STRATEGIST\nTrigger: DEMAND_SPIKE\nContext: Visitor volume up 340% in 48h following a LinkedIn campaign. eQORE queries spiked 5x. 7 new consultation requests.\nSelect which agents to activate.`,
    completion: `{"selectedAgents":["SIGNAL_READ","WORKFLOW_ORCHESTRATOR","STRATEGIST"],"reasoning":"Demand spike needs signal validation and source analysis (SIGNAL_READ), resource and workflow readiness check (WORKFLOW_ORCHESTRATOR), and strategic response recommendation (STRATEGIST). TASK_MANAGER and FINANCIAL_SNAPSHOT not needed yet — capacity, not finance, is the immediate concern.","priority":"HIGH"}`,
  },
  {
    system: 'ALIS', trigger: 'PIPELINE_GAP', priority: 'HIGH',
    agentsUsed: ['SIGNAL_READ', 'FINANCIAL_SNAPSHOT', 'STRATEGIST'],
    userPrompt: `System: ALIS — Demand Ops\nAvailable agents: SIGNAL_READ, WORKFLOW_ORCHESTRATOR, TASK_MANAGER, FINANCIAL_SNAPSHOT, ORGANIZATION_HEALTH, STRATEGIST\nTrigger: PIPELINE_GAP\nContext: Q3 revenue forecast shows ₹45L shortfall against target. Pipeline coverage 1.2x (target: 3x). 2 deals expected to close slipped to Q4.\nSelect which agents to activate.`,
    completion: `{"selectedAgents":["SIGNAL_READ","FINANCIAL_SNAPSHOT","STRATEGIST"],"reasoning":"Pipeline gap is a financial and strategic problem: read all incoming demand signals for opportunities (SIGNAL_READ), model the revenue shortfall impact (FINANCIAL_SNAPSHOT), and generate a demand generation strategy (STRATEGIST). Workflow and task management deferred until strategy is defined.","priority":"HIGH"}`,
  },
  {
    system: 'ALIS', trigger: 'OPERATIONS_ALERT', priority: 'NORMAL',
    agentsUsed: ['SIGNAL_READ', 'TASK_MANAGER', 'ORGANIZATION_HEALTH'],
    userPrompt: `System: ALIS — Demand Ops\nAvailable agents: SIGNAL_READ, WORKFLOW_ORCHESTRATOR, TASK_MANAGER, FINANCIAL_SNAPSHOT, ORGANIZATION_HEALTH, STRATEGIST\nTrigger: OPERATIONS_ALERT\nContext: 3 active deliverables are overdue by more than 3 days. Team utilization at 94%. One team member on unplanned leave.\nSelect which agents to activate.`,
    completion: `{"selectedAgents":["SIGNAL_READ","TASK_MANAGER","ORGANIZATION_HEALTH"],"reasoning":"Operational stress needs signal context (SIGNAL_READ), task reassignment and prioritization (TASK_MANAGER), and team capacity health check (ORGANIZATION_HEALTH). No financial modeling or strategy pivot needed for operational overdue issues.","priority":"NORMAL"}`,
  },

  // ── VIS ────────────────────────────────────────────────────────────────────

  {
    system: 'VIS', trigger: 'WEEKLY_REPORT', priority: 'NORMAL',
    agentsUsed: ['REPORT_GENERATE', 'EXEC_SUMMARY', 'GOAL_CHECK'],
    userPrompt: `System: VIS — Visibility\nAvailable agents: REPORT_GENERATE, EXEC_SUMMARY, SIMULATION_ENGINE, GOAL_CHECK, RISK_ANALYSIS\nTrigger: WEEKLY_REPORT\nContext: Monday 08:00 — scheduled weekly intelligence report for Mahesh. All systems have run. Previous week's signals available.\nSelect which agents to activate.`,
    completion: `{"selectedAgents":["REPORT_GENERATE","EXEC_SUMMARY","GOAL_CHECK"],"reasoning":"Weekly report needs structured data compilation (REPORT_GENERATE), executive-level narrative (EXEC_SUMMARY), and progress-against-goals tracking (GOAL_CHECK). SIMULATION_ENGINE and RISK_ANALYSIS are reserved for strategic planning sessions, not routine reporting.","priority":"NORMAL"}`,
  },
  {
    system: 'VIS', trigger: 'STRATEGIC_REVIEW', priority: 'HIGH',
    agentsUsed: ['SIMULATION_ENGINE', 'RISK_ANALYSIS', 'GOAL_CHECK', 'EXEC_SUMMARY'],
    userPrompt: `System: VIS — Visibility\nAvailable agents: REPORT_GENERATE, EXEC_SUMMARY, SIMULATION_ENGINE, GOAL_CHECK, RISK_ANALYSIS\nTrigger: STRATEGIC_REVIEW\nContext: Board meeting in 5 days. Q3 close. Need scenario modeling for Q4 revenue targets under 3 growth assumptions. Risk register update required.\nSelect which agents to activate.`,
    completion: `{"selectedAgents":["SIMULATION_ENGINE","RISK_ANALYSIS","GOAL_CHECK","EXEC_SUMMARY"],"reasoning":"Board-prep strategic review needs scenario modeling (SIMULATION_ENGINE), updated risk register (RISK_ANALYSIS), Q3 goal completion status (GOAL_CHECK), and an executive summary narrative (EXEC_SUMMARY). REPORT_GENERATE produces the container but the analysis engines drive the content.","priority":"HIGH"}`,
  },
  {
    system: 'VIS', trigger: 'RISK_FLAG', priority: 'CRITICAL',
    agentsUsed: ['RISK_ANALYSIS', 'EXEC_SUMMARY'],
    userPrompt: `System: VIS — Visibility\nAvailable agents: REPORT_GENERATE, EXEC_SUMMARY, SIMULATION_ENGINE, GOAL_CHECK, RISK_ANALYSIS\nTrigger: RISK_FLAG\nContext: SENTINEL has flagged a critical compliance breach. SOC 2 control CC6.3 failed audit test. Evidence required within 24h.\nSelect which agents to activate.`,
    completion: `{"selectedAgents":["RISK_ANALYSIS","EXEC_SUMMARY"],"reasoning":"Critical compliance flag needs immediate risk impact assessment (RISK_ANALYSIS) and a concise executive communication (EXEC_SUMMARY). SIMULATION_ENGINE, GOAL_CHECK, and REPORT_GENERATE are not appropriate for an urgent compliance response requiring targeted action within 24h.","priority":"CRITICAL"}`,
  },

  // ── SENTINEL ───────────────────────────────────────────────────────────────

  {
    system: 'SENTINEL', trigger: 'ROUTINE_SCAN', priority: 'NORMAL',
    agentsUsed: ['SECURITY_POSTURE', 'COMPLIANCE_GUARD', 'VULNERABILITY_MANAGER'],
    userPrompt: `System: Sentinel Layer — Security\nAvailable agents: THREAT_DETECTOR, VULNERABILITY_MANAGER, SECURITY_POSTURE, RISK_MANAGER, COMPLIANCE_GUARD, ATTACK_ANALYZER, ACCESS_GOVERNOR, ASSET_GUARDIAN, THIRD_PARTY_RISK, RESILIENCE_MONITOR, SHADOW_AI_DETECTOR, AGENT_GUARDIAN\nTrigger: ROUTINE_SCAN\nContext: Daily 06:00 SENTINEL sweep. No active incidents. Last scan: 24h ago. All systems nominal.\nSelect which agents to activate.`,
    completion: `{"selectedAgents":["SECURITY_POSTURE","COMPLIANCE_GUARD","VULNERABILITY_MANAGER"],"reasoning":"Routine daily scan focuses on posture baseline (SECURITY_POSTURE), compliance control status (COMPLIANCE_GUARD), and known CVE/vulnerability delta (VULNERABILITY_MANAGER). Incident-response agents (THREAT_DETECTOR, ATTACK_ANALYZER) are reserved for active signals. Third-party and resilience checks run weekly.","priority":"NORMAL"}`,
  },
  {
    system: 'SENTINEL', trigger: 'THREAT_DETECTED', priority: 'CRITICAL',
    agentsUsed: ['THREAT_DETECTOR', 'ATTACK_ANALYZER', 'ACCESS_GOVERNOR', 'RISK_MANAGER'],
    userPrompt: `System: Sentinel Layer — Security\nAvailable agents: THREAT_DETECTOR, VULNERABILITY_MANAGER, SECURITY_POSTURE, RISK_MANAGER, COMPLIANCE_GUARD, ATTACK_ANALYZER, ACCESS_GOVERNOR, ASSET_GUARDIAN, THIRD_PARTY_RISK, RESILIENCE_MONITOR, SHADOW_AI_DETECTOR, AGENT_GUARDIAN\nTrigger: THREAT_DETECTED\nContext: AEGIS flagged 14 failed authentication attempts against admin portal in 3 minutes from IP 185.220.x.x (Tor exit node). SENTINEL escalated.\nSelect which agents to activate.`,
    completion: `{"selectedAgents":["THREAT_DETECTOR","ATTACK_ANALYZER","ACCESS_GOVERNOR","RISK_MANAGER"],"reasoning":"Active threat requires immediate triage: classify and validate the threat (THREAT_DETECTOR), analyse attack pattern and TTPs (ATTACK_ANALYZER), lock down access paths (ACCESS_GOVERNOR), and assess business risk (RISK_MANAGER). Compliance and vulnerability agents are not relevant to active incident response.","priority":"CRITICAL"}`,
  },
  {
    system: 'SENTINEL', trigger: 'THIRD_PARTY_AUDIT', priority: 'NORMAL',
    agentsUsed: ['THIRD_PARTY_RISK', 'COMPLIANCE_GUARD', 'ASSET_GUARDIAN'],
    userPrompt: `System: Sentinel Layer — Security\nAvailable agents: THREAT_DETECTOR, VULNERABILITY_MANAGER, SECURITY_POSTURE, RISK_MANAGER, COMPLIANCE_GUARD, ATTACK_ANALYZER, ACCESS_GOVERNOR, ASSET_GUARDIAN, THIRD_PARTY_RISK, RESILIENCE_MONITOR, SHADOW_AI_DETECTOR, AGENT_GUARDIAN\nTrigger: THIRD_PARTY_AUDIT\nContext: Monthly third-party vendor risk review. 8 active SaaS integrations. 2 new vendors added this month (Intercom, Sentry). SOC 2 compliance check due.\nSelect which agents to activate.`,
    completion: `{"selectedAgents":["THIRD_PARTY_RISK","COMPLIANCE_GUARD","ASSET_GUARDIAN"],"reasoning":"Vendor audit needs third-party risk scoring for all integrations (THIRD_PARTY_RISK), compliance posture for each (COMPLIANCE_GUARD), and data asset exposure mapping (ASSET_GUARDIAN). Incident-response agents not needed for a scheduled review.","priority":"NORMAL"}`,
  },
  {
    system: 'SENTINEL', trigger: 'COMPLIANCE_BREACH', priority: 'CRITICAL',
    agentsUsed: ['COMPLIANCE_GUARD', 'RISK_MANAGER', 'ACCESS_GOVERNOR', 'RESILIENCE_MONITOR'],
    userPrompt: `System: Sentinel Layer — Security\nAvailable agents: THREAT_DETECTOR, VULNERABILITY_MANAGER, SECURITY_POSTURE, RISK_MANAGER, COMPLIANCE_GUARD, ATTACK_ANALYZER, ACCESS_GOVERNOR, ASSET_GUARDIAN, THIRD_PARTY_RISK, RESILIENCE_MONITOR, SHADOW_AI_DETECTOR, AGENT_GUARDIAN\nTrigger: COMPLIANCE_BREACH\nContext: 12 user accounts identified with access review SLA exceeded by >90 days. This violates SOC 2 CC6.3, ISO A.9.4.1, and NIST PR.AC-1 simultaneously. Audit in 47 days.\nSelect which agents to activate.`,
    completion: `{"selectedAgents":["COMPLIANCE_GUARD","RISK_MANAGER","ACCESS_GOVERNOR","RESILIENCE_MONITOR"],"reasoning":"Multi-framework compliance failure requires: full compliance impact mapping (COMPLIANCE_GUARD), business risk quantification (RISK_MANAGER), immediate access remediation (ACCESS_GOVERNOR), and audit readiness resilience check (RESILIENCE_MONITOR). No active threat so attack/threat agents not needed.","priority":"CRITICAL"}`,
  },
  {
    system: 'SENTINEL', trigger: 'SHADOW_AI_DETECTED', priority: 'HIGH',
    agentsUsed: ['SHADOW_AI_DETECTOR', 'AGENT_GUARDIAN', 'RISK_MANAGER'],
    userPrompt: `System: Sentinel Layer — Security\nAvailable agents: THREAT_DETECTOR, VULNERABILITY_MANAGER, SECURITY_POSTURE, RISK_MANAGER, COMPLIANCE_GUARD, ATTACK_ANALYZER, ACCESS_GOVERNOR, ASSET_GUARDIAN, THIRD_PARTY_RISK, RESILIENCE_MONITOR, SHADOW_AI_DETECTOR, AGENT_GUARDIAN\nTrigger: SHADOW_AI_DETECTED\nContext: Network monitor flagged an employee using an unapproved LLM API (Gemini Pro) with company data. Potential data exfiltration via AI prompt. No malicious intent confirmed.\nSelect which agents to activate.`,
    completion: `{"selectedAgents":["SHADOW_AI_DETECTOR","AGENT_GUARDIAN","RISK_MANAGER"],"reasoning":"Shadow AI usage requires: classify and scope the AI tool usage pattern (SHADOW_AI_DETECTOR), check if any KIMMP/WAANDA agents were compromised or data leaked (AGENT_GUARDIAN), and assess data exfiltration risk (RISK_MANAGER). No need for attack analysis or access lockdown until risk is confirmed.","priority":"HIGH"}`,
  },
]

// ── Insert into DB ─────────────────────────────────────────────────────────────

async function seed() {
  console.log(`\n[SEED] Inserting ${EXAMPLES.length} synthetic REASON training examples...\n`)

  let inserted = 0
  let skipped  = 0

  for (const ex of EXAMPLES) {
    try {
      await (prisma as any).waandaTrainingExample.create({
        data: {
          exampleType:  'REASON',
          system:       ex.system,
          trigger:      ex.trigger,
          systemPrompt: REASON_SYSTEM_PROMPT,
          userPrompt:   ex.userPrompt,
          completion:   ex.completion,
          agentsUsed:   ex.agentsUsed,
          priority:     ex.priority,
          confidence:   null,
          feedback:     'ACCEPTED',   // pre-labelled as high quality
          qualityScore: 0.85,
          correction:   null,
          exported:     false,
          dispatchId:   `seed-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        },
      })
      console.log(`  ✓ ${ex.system} / ${ex.trigger}`)
      inserted++
    } catch (err: any) {
      console.log(`  ✗ ${ex.system} / ${ex.trigger}: ${err.message?.slice(0, 60)}`)
      skipped++
    }
  }

  console.log(`\n[SEED] Done — ${inserted} inserted, ${skipped} skipped.`)

  const total = await (prisma as any).waandaTrainingExample.count()
  const byType = await (prisma as any).waandaTrainingExample.groupBy({
    by: ['exampleType'],
    _count: { id: true },
  })
  console.log(`\n[CORPUS] Total examples: ${total}`)
  for (const t of byType) {
    console.log(`  ${t.exampleType}: ${t._count.id}`)
  }

  await prisma.$disconnect()
}

seed().catch(e => { console.error(e); process.exit(1) })
