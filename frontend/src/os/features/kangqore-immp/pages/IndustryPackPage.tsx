import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Package, CheckCircle2, Zap, Brain, Target, FileText, Users,
  TrendingUp, Shield, Globe2, ChevronDown, ChevronRight,
  ArrowRight, Sparkles, BookOpen, Layers, Heart, Factory, Wrench,
  AlertTriangle, Activity,
} from 'lucide-react'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const T3   = 'var(--os-text-3)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const PURP = '#7c3aed'
const TEAL = '#10b981'
const BLUE = '#3b82f6'
const AMB  = '#f59e0b'
const RED  = '#f43f5e'
const ROSE = '#ec4899'

// ── PS Pack ───────────────────────────────────────────────────────────────────
const PS_PILLARS = [
  { id: 'engagement', label: 'Engagement Intelligence', bids: 'P3',  desc: 'Track deal progress from first contact through SOW sign-off with KIMMP-guided engagement scoring.', coverage: 92 },
  { id: 'delivery',   label: 'Delivery Excellence',     bids: 'P5',  desc: 'Milestone-driven project delivery with automated escalation, capacity tracking, and quality gates.',  coverage: 88 },
  { id: 'knowledge',  label: 'Knowledge Fabric',        bids: 'P8',  desc: 'Capture and reuse engagement learnings across proposals, delivery playbooks, and team wikis.',          coverage: 76 },
  { id: 'revenue',    label: 'Revenue Operations',      bids: 'P11', desc: 'End-to-end revenue tracking: proposal→SOW→invoice→renewal with WAANDA revenue signal detection.',      coverage: 85 },
  { id: 'governance', label: 'Delivery Governance',     bids: 'P14', desc: 'Risk scoring, escalation protocols, and QBR automation baked into every active engagement.',           coverage: 80 },
]

const PS_WORKFLOWS = [
  { id: 'proposal',  name: 'Proposal Builder',       icon: FileText,   color: BLUE, eta: '5–7 days',         agents: ['RESEARCH', 'EXECUTION'],           steps: ['Qualification → KIMMP scoring', 'Scope definition + AI draft', 'Pricing model + approval gate', 'Client review → finalise', 'Sent → track open + respond'] },
  { id: 'sow',       name: 'SOW Execution',           icon: BookOpen,   color: PURP, eta: '2–3 days',         agents: ['EXECUTION', 'DIAGNOSTICS'],        steps: ['SOW signed → project created', 'Team assignment + capacity check', 'Kickoff checklist (KIMMP-guided)', 'Sprint 0 planning + tooling setup', 'WAANDA missions activated'] },
  { id: 'milestone', name: 'Milestone Management',    icon: Target,     color: TEAL, eta: 'Ongoing',           agents: ['DIAGNOSTICS', 'COACH'],            steps: ['Milestone due date tracking', 'Risk flag if slipping (−3d warning)', 'Auto-escalation to engagement lead', 'Stakeholder status briefing', 'Completion gate + sign-off capture'] },
  { id: 'invoice',   name: 'Invoice Lifecycle',       icon: TrendingUp, color: AMB,  eta: '1–2 days',         agents: ['EXECUTION', 'DIAGNOSTICS'],        steps: ['Milestone completion → invoice trigger', 'Finance approval gate', 'Invoice sent + delivery confirmation', 'OVERDUE detection (+7d auto-flag)', 'Payment confirmed → COIG credit'] },
  { id: 'closeout',  name: 'Engagement Closeout',     icon: CheckCircle2, color: TEAL, eta: '3–5 days',       agents: ['COACH', 'RESEARCH', 'EXECUTION'],  steps: ['Final delivery sign-off', 'Retrospective capture → knowledge base', 'BIDS™ PS pillar score update', 'Renewal signal to CRM pipeline', 'Case study trigger + COIG snapshot'] },
]

const PS_STATS = [
  { label: 'Workflows',      count: 17, icon: Zap,        color: BLUE },
  { label: 'Agents',         count: 80, icon: Brain,      color: PURP },
  { label: 'Goals',          count: 5,  icon: Target,     color: TEAL },
  { label: 'KPI Templates',  count: 12, icon: TrendingUp, color: AMB  },
  { label: 'Ontology Types', count: 24, icon: Layers,     color: BLUE },
  { label: 'Policies',       count: 9,  icon: Shield,     color: PURP },
]

// ── Healthcare Edition ────────────────────────────────────────────────────────
const HC_PILLARS = [
  { id: 'patient',     label: 'Patient Lifecycle',       bids: 'P2',  desc: 'KIMMP tracks referral → assessment → treatment → discharge → follow-up. Every stage generates intelligence signals.', coverage: 90, hipaa: true },
  { id: 'quality',     label: 'Quality & Compliance',    bids: 'P7',  desc: 'HIPAA compliance markers on all ontology types. Automated audit trails. Privacy-first data handling.',             coverage: 95, hipaa: true },
  { id: 'capacity',    label: 'Capacity Intelligence',   bids: 'P5',  desc: 'Bed occupancy, staffing ratios, department throughput — KIMMP flags capacity risks 48h ahead.',                    coverage: 83, hipaa: false },
  { id: 'clinical',    label: 'Clinical Operations',     bids: 'P8',  desc: 'Care pathway optimisation, protocol adherence scoring, readmission risk detection.',                               coverage: 78, hipaa: true },
  { id: 'nps',         label: 'Patient Experience',      bids: 'P10', desc: 'NPS collection, complaint categorisation, KIMMP follow-up signals for at-risk patients.',                          coverage: 72, hipaa: false },
  { id: 'billing',     label: 'Revenue Cycle',           bids: 'P11', desc: 'Charge capture, denial rate, A/R aging, prior auth tracking — connected to KIMMP billing intelligence.',            coverage: 80, hipaa: true },
]

const HC_WORKFLOWS = [
  { id: 'referral',   name: 'Referral Intake',           icon: ArrowRight, color: BLUE, eta: '1–2 days', agents: ['EXECUTION', 'DIAGNOSTICS'], steps: ['Referral received → KIMMP triage', 'Insurance verification + pre-auth', 'Specialist assignment', 'Appointment scheduled → patient notified', 'Day-before reminder + instructions'] },
  { id: 'assessment', name: 'Clinical Assessment',       icon: Activity,   color: ROSE, eta: '1 day',    agents: ['DIAGNOSTICS', 'RESEARCH'],  steps: ['Patient check-in → EHR pull', 'KIMMP care pathway assigned', 'Assessment recorded + risk scored', 'Care team briefed on KIMMP flags', 'Treatment plan generated'] },
  { id: 'treatment',  name: 'Treatment Management',      icon: Heart,      color: TEAL, eta: 'Ongoing',   agents: ['COACH', 'DIAGNOSTICS'],     steps: ['Treatment plan → task queue', 'Daily adherence tracking', 'Readmission risk flagged at discharge −2d', 'Outcome gate: target metrics hit?', 'Discharge + follow-up scheduled'] },
  { id: 'discharge',  name: 'Discharge & Follow-up',     icon: CheckCircle2, color: AMB, eta: '2–3 days', agents: ['EXECUTION', 'COACH'],       steps: ['Discharge summary generated (KIMMP)', 'Follow-up appointment set', 'Patient education materials sent', '7-day check-in trigger', 'NPS survey dispatch + response tracking'] },
  { id: 'compliance', name: 'HIPAA Compliance Audit',    icon: Shield,     color: PURP, eta: 'Continuous', agents: ['AEGIS', 'DIAGNOSTICS'],    steps: ['Ontology PII markers active', 'Access log to AEGIS Shield', 'Anomalous data access → HIGH signal', 'Monthly privacy audit report', 'KIMMP policy violation → block + alert'] },
]

const HC_STATS = [
  { label: 'Workflows',   count: 12, icon: Zap,        color: ROSE },
  { label: 'Agents',      count: 80, icon: Brain,      color: PURP },
  { label: 'Goals',       count: 6,  icon: Target,     color: TEAL },
  { label: 'KPI Templates', count: 18, icon: TrendingUp, color: AMB },
  { label: 'HIPAA Types', count: 31, icon: Shield,     color: RED  },
  { label: 'Policies',    count: 14, icon: Shield,     color: PURP },
]

const HC_KPIS = [
  { label: 'Bed Occupancy Rate',       target: '≥ 85%',   kimmpSignal: 'OEE equivalent for inpatient capacity' },
  { label: 'Average Length of Stay',   target: '≤ 4.2d',  kimmpSignal: 'Flag if ALOS > benchmark by department' },
  { label: 'Readmission Rate (30d)',    target: '< 8%',    kimmpSignal: 'HIGH signal when patient re-presents within 30d' },
  { label: 'Patient NPS',              target: '≥ 72',     kimmpSignal: 'LOW: detractor responses trigger care review' },
  { label: 'Prior Auth Approval Rate', target: '≥ 90%',   kimmpSignal: 'Denial spike → KIMMP billing intelligence alert' },
  { label: 'Charge Capture Rate',      target: '≥ 98%',   kimmpSignal: 'Missing charges → MEDIUM signal to Revenue Cycle' },
]

// ── Manufacturing Edition ─────────────────────────────────────────────────────
const MFG_PILLARS = [
  { id: 'ops',      label: 'Operational Intelligence', bids: 'P1',  desc: 'OEE tracking, production scheduling intelligence, shift performance scoring.',                              coverage: 88 },
  { id: 'quality',  label: 'Quality Management',       bids: 'P5',  desc: 'Defect rate, first-pass yield, non-conformance tracking — KIMMP root-cause analysis pipeline.',             coverage: 82 },
  { id: 'decision', label: 'Decision Intelligence',    bids: 'P12', desc: 'WAANDA decision engine pre-configured for make/buy, capacity, and maintenance decisions.',                   coverage: 79 },
]

const MFG_WORKFLOWS = [
  { id: 'oee',     name: 'OEE Monitoring',             icon: Activity,  color: BLUE, eta: 'Real-time', agents: ['DIAGNOSTICS', 'EXECUTION'], steps: ['Production data → KIMMP OEE compute', 'OEE < 75% → MEDIUM signal', 'Root-cause analysis: availability vs quality vs performance', 'Maintenance work order triggered', 'Post-maintenance OEE delta recorded'] },
  { id: 'quality', name: 'Quality Gate Workflow',      icon: Shield,    color: TEAL, eta: 'Per batch', agents: ['DIAGNOSTICS', 'COACH'],     steps: ['Batch produced → quality gate check', 'Defect rate computed vs SLA', 'NON-CONFORMANCE record created in KORE', 'Root-cause assigned to operator/machine/material', 'Corrective action workflow triggered'] },
  { id: 'maint',   name: 'Predictive Maintenance',     icon: Wrench,    color: AMB,  eta: 'Continuous', agents: ['DIAGNOSTICS', 'EXECUTION'], steps: ['Machine telemetry → KIMMP signal scoring', 'Vibration / temp / cycle count thresholds', 'MEDIUM signal: anomaly detected', 'HIGH signal: failure probability > 60%', 'Work order auto-raised, parts checked in inventory'] },
]

const MFG_STATS = [
  { label: 'Workflows',   count: 8,  icon: Zap,        color: BLUE },
  { label: 'Agents',      count: 80, icon: Brain,      color: PURP },
  { label: 'Goals',       count: 3,  icon: Target,     color: TEAL },
  { label: 'KPI Templates', count: 10, icon: TrendingUp, color: AMB },
  { label: 'Ontology Types', count: 18, icon: Layers,  color: BLUE },
  { label: 'Policies',    count: 7,  icon: Shield,     color: PURP },
]

const MFG_KPIS = [
  { label: 'OEE',                target: '≥ 85%',   kimmpSignal: 'OEE < 75% → KIMMP MEDIUM signal; < 60% → HIGH' },
  { label: 'Defect Rate',        target: '< 0.5%',  kimmpSignal: 'Spike in defect rate → root-cause workflow triggered' },
  { label: 'Throughput',         target: 'Plan ±5%', kimmpSignal: 'Throughput deviation → capacity decision flagged' },
  { label: 'MTBF (Mean Time Between Failures)', target: '> 720h', kimmpSignal: 'MTBF declining → predictive maintenance alert' },
  { label: 'First-Pass Yield',   target: '≥ 97%',   kimmpSignal: 'FPY drop → quality gate review triggered' },
]

// ── BFSI Edition ─────────────────────────────────────────────────────────────
const BFSI_PILLARS = [
  { id: 'credit',     label: 'Credit Intelligence',       bids: 'P3',  desc: 'Loan lifecycle (Application→Credit Check→Underwriting→Approval→Disbursement), NPA ratio tracking, KIMMP credit event signals.', coverage: 85, compliance: 'RBI' },
  { id: 'risk',       label: 'Risk & Capital Management', bids: 'P7',  desc: 'Capital adequacy ratio, liquidity coverage ratio, Basel III pillar compliance, stress-test scenario modelling.', coverage: 80, compliance: 'Basel III' },
  { id: 'kyc',        label: 'KYC / AML Intelligence',   bids: 'P8',  desc: 'Customer due diligence workflow, transaction anomaly detection, FATF compliance markers, KIMMP fraud signals.', coverage: 78, compliance: 'FATF' },
  { id: 'treasury',   label: 'Treasury Operations',       bids: 'P11', desc: 'Liquidity position tracking, FX exposure, ALM (Asset-Liability Mismatch) dashboard, WAANDA rate decision intelligence.', coverage: 74, compliance: 'RBI' },
  { id: 'regulatory', label: 'Regulatory Reporting',      bids: 'P14', desc: 'Automated RBI/SEBI reporting, Basel III pillar disclosures, regulatory calendar with KIMMP deadline signals.', coverage: 82, compliance: 'SEBI' },
]

const BFSI_WORKFLOWS = [
  { id: 'loan',     name: 'Loan Origination Lifecycle',   icon: FileText, color: BLUE, eta: '3–7 days',  agents: ['EXECUTION', 'DIAGNOSTICS'], steps: ['Application received → KIMMP credit score pull', 'Bureau data fetch + risk categorisation', 'Underwriting decision queue (WAANDA-assisted)', 'Approval gate → term sheet generation', 'Disbursement → repayment schedule activated'] },
  { id: 'npa',      name: 'NPA Risk Monitoring',          icon: AlertTriangle, color: RED, eta: 'Daily', agents: ['DIAGNOSTICS', 'COACH'],     steps: ['Daily EMI payment check → KIMMP scoring', '30d overdue → MEDIUM signal + collections queue', '90d overdue → HIGH signal + provisioning trigger', 'NPA reclassification → AEGIS compliance log', 'Recovery workflow: legal → settlement → write-off'] },
  { id: 'aml',      name: 'AML Transaction Screening',    icon: Shield,   color: PURP, eta: 'Real-time', agents: ['AEGIS', 'DIAGNOSTICS'],    steps: ['Transaction ingested → rule engine scoring', 'Threshold breach → CRITICAL KIMMP signal', 'Case file auto-created in AEGIS', 'SAR (Suspicious Activity Report) draft', 'Regulator escalation + audit trail locked'] },
  { id: 'kyc',      name: 'KYC Onboarding Workflow',      icon: Users,    color: TEAL, eta: '1–2 days',  agents: ['EXECUTION', 'RESEARCH'],   steps: ['Identity documents received', 'OCR + data validation (KIMMP)', 'PEP / sanctions screening', 'Risk rating assigned (LOW/MEDIUM/HIGH)', 'Account activated or EDD triggered'] },
]

const BFSI_STATS = [
  { label: 'Workflows',   count: 14, icon: Zap,        color: BLUE },
  { label: 'Agents',      count: 80, icon: Brain,      color: PURP },
  { label: 'Goals',       count: 5,  icon: Target,     color: TEAL },
  { label: 'KPI Templates', count: 22, icon: TrendingUp, color: AMB },
  { label: 'Compliance Markers', count: 41, icon: Shield, color: RED },
  { label: 'Policies',    count: 18, icon: Shield,     color: PURP },
]

const BFSI_KPIS = [
  { label: 'NPA Ratio',                  target: '< 2%',    kimmpSignal: 'Portfolio NPA > 2% → HIGH signal, > 5% → CRITICAL' },
  { label: 'Capital Adequacy Ratio',     target: '≥ 15%',   kimmpSignal: 'CAR approaching regulatory minimum → WAANDA capital decision' },
  { label: 'Liquidity Coverage Ratio',   target: '≥ 100%',  kimmpSignal: 'LCR < 110% → MEDIUM signal to Treasury' },
  { label: 'Loan-to-Deposit Ratio',      target: '< 85%',   kimmpSignal: 'LDR breach → ALM decision trigger' },
  { label: 'CASA Ratio',                 target: '≥ 40%',   kimmpSignal: 'CASA erosion → branch strategy signal' },
  { label: 'Cost of Funds',              target: '< 5.5%',  kimmpSignal: 'CoF spike → WAANDA rate-setting analysis' },
]

// ── Logistics Edition ─────────────────────────────────────────────────────────
const LOGI_PILLARS = [
  { id: 'shipment',  label: 'Shipment Intelligence',   bids: 'P2',  desc: 'POD→In-Transit→Delivered→Returned lifecycle, real-time ETD tracking, KIMMP delay triggers.', coverage: 86 },
  { id: 'fleet',     label: 'Fleet Management',         bids: 'P5',  desc: 'Vehicle telemetry, driver scoring, fuel efficiency, maintenance scheduling — WAANDA fleet intelligence.', coverage: 80 },
  { id: 'warehouse', label: 'Warehouse Operations',     bids: 'P8',  desc: 'Inventory accuracy, pick rate, dock scheduling, KIMMP capacity signals when utilisation > 90%.', coverage: 75 },
  { id: 'carbon',    label: 'Carbon & Sustainability', bids: 'P14', desc: 'Scope 1 & 2 emission tracking per shipment, route carbon footprint, ESG reporting (GHG Protocol).', coverage: 68 },
]

const LOGI_WORKFLOWS = [
  { id: 'shipment', name: 'Shipment Lifecycle',         icon: ArrowRight, color: BLUE, eta: 'Per shipment', agents: ['EXECUTION', 'DIAGNOSTICS'], steps: ['Booking created → route optimisation (KIMMP)', 'POD dispatch → in-transit tracking activated', 'ETA miss > 2h → MEDIUM delay signal', 'Delivered confirmation → POD capture', 'Return initiated → reverse logistics workflow'] },
  { id: 'fleet',    name: 'Fleet Maintenance Workflow', icon: Wrench,     color: AMB,  eta: 'Continuous',   agents: ['DIAGNOSTICS', 'EXECUTION'],  steps: ['Odometer + engine hours → KIMMP scoring', 'Service due in < 500km → pre-emptive alert', 'Breakdown event → HIGH signal + roadside dispatch', 'Driver behaviour scoring (harsh braking/acceleration)', 'Vehicle cost-per-km tracking vs fleet benchmark'] },
  { id: 'otif',     name: 'OTIF Performance Tracking',  icon: TrendingUp, color: TEAL, eta: 'Daily',        agents: ['DIAGNOSTICS', 'COACH'],       steps: ['Daily OTIF compute (On-Time In-Full)', 'OTIF < 90% → MEDIUM signal to ops manager', 'Root-cause: carrier/route/weather/customs', 'SLA breach report auto-generated', 'Carrier performance scorecard updated'] },
  { id: 'carbon',   name: 'Carbon Footprint Workflow',  icon: Globe2,     color: TEAL, eta: 'Per shipment', agents: ['RESEARCH', 'EXECUTION'],      steps: ['Distance + load weight → tCO₂e compute', 'Mode: road/rail/air/sea emission factors applied', 'Monthly Scope 1+2 roll-up for ESG report', 'Carbon offset recommendation (KIMMP)', 'Emission reduction action: route/modal shift'] },
]

const LOGI_STATS = [
  { label: 'Workflows',   count: 11, icon: Zap,        color: BLUE },
  { label: 'Agents',      count: 80, icon: Brain,      color: PURP },
  { label: 'Goals',       count: 4,  icon: Target,     color: TEAL },
  { label: 'KPI Templates', count: 16, icon: TrendingUp, color: AMB },
  { label: 'ESG Metrics', count: 12, icon: Globe2,     color: TEAL },
  { label: 'Policies',    count: 9,  icon: Shield,     color: PURP },
]

const LOGI_KPIS = [
  { label: 'OTIF Rate',                  target: '≥ 95%',   kimmpSignal: 'OTIF < 90% → MEDIUM signal; < 80% → HIGH escalation' },
  { label: 'On-Time Delivery Rate',      target: '≥ 97%',   kimmpSignal: 'OTD decline → carrier performance review signal' },
  { label: 'Fleet Utilisation',          target: '≥ 82%',   kimmpSignal: 'Low utilisation → fleet right-sizing recommendation' },
  { label: 'Fuel Efficiency (km/L)',     target: '> 12',    kimmpSignal: 'FE drop → driver coaching signal or maintenance alert' },
  { label: 'Carbon Intensity (gCO₂/tkm)', target: '< 55',  kimmpSignal: 'Emission spike → route/mode optimisation trigger' },
  { label: 'Return Rate',               target: '< 3%',    kimmpSignal: 'High return cluster → damage root-cause workflow' },
]

// ── Government Edition ────────────────────────────────────────────────────────
const GOV_PILLARS = [
  { id: 'procurement', label: 'Procurement Intelligence',    bids: 'P3',  desc: 'RFP→Tender→Evaluation→Award→Contract lifecycle, KIMMP bid scoring, transparency audit trail to AEGIS.', coverage: 84 },
  { id: 'service',     label: 'Public Service Delivery',     bids: 'P5',  desc: 'Citizen service request tracking, SLA compliance, multi-channel intake (portal/walk-in/call), WAANDA triage.', coverage: 80 },
  { id: 'budget',      label: 'Budget & Fund Management',    bids: 'P11', desc: 'Scheme-wise expenditure tracking, utilisation vs allocation, lapse detection, KIMMP underspend signals.', coverage: 78 },
  { id: 'compliance',  label: 'Regulatory & Audit',          bids: 'P14', desc: 'Every decision logged to AEGIS compliance. CAG-ready audit trail. Policy violation → CRITICAL signal.', coverage: 90 },
]

const GOV_WORKFLOWS = [
  { id: 'procurement', name: 'Procurement Lifecycle',        icon: FileText, color: BLUE, eta: '30–90d',    agents: ['EXECUTION', 'DIAGNOSTICS', 'COACH'], steps: ['RFP published → KIMMP market intelligence pull', 'Tender evaluation: WAANDA scoring matrix', 'L1 determination + policy compliance check', 'Award decision → AEGIS audit log entry', 'Contract execution → milestone tracking'] },
  { id: 'service',     name: 'Citizen Service Request',      icon: Users,    color: TEAL, eta: '1–5 days',  agents: ['EXECUTION', 'COACH'],               steps: ['Request ingested (portal/offline)', 'KIMMP category + priority assignment', 'Department routing + officer assignment', 'SLA clock starts → KIMMP tracking', 'Resolution → citizen notification + satisfaction survey'] },
  { id: 'budget',      name: 'Fund Utilisation Monitoring',  icon: TrendingUp, color: AMB, eta: 'Monthly',  agents: ['DIAGNOSTICS', 'RESEARCH'],           steps: ['Monthly expenditure data pull', 'Utilisation vs allocation per scheme', 'Underspend > 30% → MEDIUM signal', 'Q3 lapse risk → WAANDA reallocation recommendation', 'Annual CAG audit data export from AEGIS'] },
  { id: 'audit',       name: 'AEGIS Compliance Audit',       icon: Shield,   color: PURP, eta: 'Continuous', agents: ['AEGIS', 'DIAGNOSTICS'],             steps: ['Every decision auto-logged to AEGIS AuditLog', 'Policy violation scan (daily)', 'CRITICAL finding → immediate escalation', 'Monthly compliance score computed', 'CAG-ready PDF export with decision provenance'] },
]

const GOV_STATS = [
  { label: 'Workflows',   count: 13, icon: Zap,        color: BLUE },
  { label: 'Agents',      count: 80, icon: Brain,      color: PURP },
  { label: 'Goals',       count: 5,  icon: Target,     color: TEAL },
  { label: 'KPI Templates', count: 19, icon: TrendingUp, color: AMB },
  { label: 'Audit Types', count: 28, icon: Shield,     color: PURP },
  { label: 'Policies',    count: 22, icon: Shield,     color: RED  },
]

const GOV_KPIS = [
  { label: 'Service Delivery SLA',          target: '≥ 95%',   kimmpSignal: 'SLA breach → MEDIUM signal; repeat breach → HIGH escalation' },
  { label: 'Fund Utilisation Rate',          target: '≥ 80%',   kimmpSignal: 'Utilisation < 60% at Q3 → underspend signal + reallocation trigger' },
  { label: 'Procurement Cycle Time',         target: '< 45d',   kimmpSignal: 'Cycle > 60d → MEDIUM signal to procurement head' },
  { label: 'Citizen Satisfaction (NPS)',     target: '≥ 60',    kimmpSignal: 'NPS < 50 → service design review signal' },
  { label: 'Policy Compliance Rate',         target: '100%',    kimmpSignal: 'Any violation → CRITICAL AEGIS alert + immediate escalation' },
  { label: 'Audit Findings Resolved',        target: '≥ 90%',   kimmpSignal: 'Unresolved CAG findings → WAANDA escalation decision' },
]

// ── Shared sub-components ─────────────────────────────────────────────────────

function WorkflowCard({ wf }: { wf: { id: string; name: string; icon: React.ElementType; color: string; eta: string; agents: string[]; steps: string[] } }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, overflow: 'hidden' }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', cursor: 'pointer' }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: wf.color + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <wf.icon size={13} style={{ color: wf.color }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 800, color: T1, flex: 1 }}>{wf.name}</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {wf.agents.map(a => (
            <span key={a} style={{ fontSize: 8, fontWeight: 700, color: PURP, background: PURP + '12', padding: '1px 5px', borderRadius: 3 }}>{a}</span>
          ))}
        </div>
        <span style={{ fontSize: 9, color: T3, marginLeft: 4 }}>{wf.eta}</span>
        {open ? <ChevronDown size={12} style={{ color: T3 }} /> : <ChevronRight size={12} style={{ color: T3 }} />}
      </div>
      {open && (
        <div style={{ padding: '0 14px 14px 14px', borderTop: `1px solid ${BDR}` }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
            {wf.steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: wf.color, background: wf.color + '12', width: 18, height: 18, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 11, color: T2 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatsGrid({ stats }: { stats: { label: string; count: number; icon: React.ElementType; color: string }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: 8 }}>
      {stats.map(s => (
        <div key={s.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 10, padding: '12px 10px', textAlign: 'center' }}>
          <s.icon size={14} style={{ color: s.color, margin: '0 auto 6px' }} />
          <div style={{ fontSize: 22, fontWeight: 900, color: s.color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{s.count}</div>
          <div style={{ fontSize: 8, fontWeight: 700, color: T3, marginTop: 4, textTransform: 'uppercase', letterSpacing: '.06em' }}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
type PackId = 'ps' | 'healthcare' | 'manufacturing' | 'bfsi' | 'logistics' | 'government'

const PACK_CONFIG: Record<PackId, { label: string; shortLabel: string; color: string; icon: React.ElementType; status: 'live' | 'beta' | 'preview' }> = {
  ps:            { label: 'Professional Services', shortLabel: 'PS Pack',       color: PURP, icon: Package,      status: 'live'    },
  healthcare:    { label: 'Healthcare Edition',    shortLabel: 'Healthcare',    color: ROSE, icon: Heart,        status: 'beta'    },
  manufacturing: { label: 'Manufacturing Edition', shortLabel: 'Manufacturing', color: BLUE, icon: Factory,      status: 'beta'    },
  bfsi:          { label: 'BFSI Edition',          shortLabel: 'BFSI',          color: AMB,  icon: TrendingUp,   status: 'preview' },
  logistics:     { label: 'Logistics Edition',     shortLabel: 'Logistics',     color: TEAL, icon: Globe2,       status: 'preview' },
  government:    { label: 'Government Edition',    shortLabel: 'Government',    color: '#6366f1', icon: Shield,  status: 'preview' },
}

export function IndustryPackPage() {
  const navigate = useNavigate()
  const [activePack, setActivePack] = useState<PackId>('ps')
  const cfg = PACK_CONFIG[activePack]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Pack selector */}
      <div style={{ display: 'flex', gap: 8, padding: '4px', background: 'var(--os-surface-0)', borderRadius: 12, width: 'fit-content', border: `1px solid ${BDR}` }}>
        {(Object.entries(PACK_CONFIG) as [PackId, typeof PACK_CONFIG[PackId]][]).map(([id, c]) => (
          <button
            key={id}
            onClick={() => setActivePack(id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 8,
              fontSize: 11, fontWeight: 800, cursor: 'pointer', border: 'none', transition: 'all .15s',
              background: activePack === id ? c.color : 'transparent',
              color: activePack === id ? '#fff' : T2,
            }}
          >
            <c.icon size={12} />
            {c.shortLabel}
            {c.status === 'beta' && (
              <span style={{ fontSize: 8, fontWeight: 700, opacity: 0.8, letterSpacing: '.05em' }}>BETA</span>
            )}
          </button>
        ))}
      </div>

      {/* ── PS Pack ── */}
      {activePack === 'ps' && (
        <>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: PURP + '15', border: `1px solid ${PURP}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Package size={20} style={{ color: PURP }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <h1 style={{ fontSize: 18, fontWeight: 900, color: T1, letterSpacing: '-.02em' }}>Professional Services Pack</h1>
                <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: TEAL, background: TEAL + '12', padding: '3px 8px', borderRadius: 4 }}>v1.0 · Live</span>
                <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: PURP, background: PURP + '12', padding: '3px 8px', borderRadius: 4 }}>Industry Pack</span>
              </div>
              <p style={{ fontSize: 11, color: T2 }}>Pre-built Blueprint for Consulting · Systems Integration · Advisory firms — engagement → delivery → renewal lifecycle</p>
            </div>
            <button onClick={() => navigate('/kangqore-view/admin/kangqore-immp/blueprint-customize')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#fff', background: PURP, padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', flexShrink: 0 }}>
              <Sparkles size={12} /> Deploy as Blueprint
            </button>
          </div>
          <StatsGrid stats={PS_STATS} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', borderBottom: `1px solid ${BDR}` }}>
                <Globe2 size={13} style={{ color: PURP }} /><span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>BIDS™ Pillars Mapped</span>
                <span style={{ fontSize: 9, color: T3, marginLeft: 'auto' }}>5 of 16 PS-specific pillars</span>
              </div>
              <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {PS_PILLARS.map(p => (
                  <div key={p.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 9, fontWeight: 800, color: PURP, background: PURP + '12', padding: '1px 6px', borderRadius: 4 }}>BIDS™ {p.bids}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: T1 }}>{p.label}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: TEAL, marginLeft: 'auto' }}>{p.coverage}%</span>
                    </div>
                    <div style={{ height: 3, background: 'var(--os-surface-0)', borderRadius: 2, marginBottom: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${p.coverage}%`, background: TEAL, borderRadius: 2 }} />
                    </div>
                    <p style={{ fontSize: 10, color: T2 }}>{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: PURP + '06', border: `1.5px solid ${PURP}25`, borderRadius: 14, padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Sparkles size={14} style={{ color: PURP }} />
                  <span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>One-click Blueprint Deployment</span>
                </div>
                <p style={{ fontSize: 11, color: T2, marginBottom: 14, lineHeight: 1.6 }}>
                  Select this pack in the Blueprint Wizard and Kangqore will pre-configure all 17 workflows, 80 agents, 5 goals, and 12 KPI templates for a new customer instance in seconds.
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => navigate('/kangqore-view/admin/kangqore-immp/blueprint-customize')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#fff', background: PURP, padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
                    New Deployment <ArrowRight size={12} />
                  </button>
                  <Link to="/kangqore-view/admin/kangqore-immp/blueprint"
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: PURP, background: PURP + '12', padding: '8px 14px', borderRadius: 8, textDecoration: 'none' }}>
                    View Blueprints
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', borderBottom: `1px solid ${BDR}` }}>
              <Zap size={13} style={{ color: BLUE }} /><span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>Consulting Workflow Templates</span>
              <span style={{ fontSize: 9, color: T3, marginLeft: 'auto' }}>5 core templates · click to expand</span>
            </div>
            <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PS_WORKFLOWS.map(wf => <WorkflowCard key={wf.id} wf={wf} />)}
            </div>
          </div>
        </>
      )}

      {/* ── Healthcare Edition ── */}
      {activePack === 'healthcare' && (
        <>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: ROSE + '15', border: `1px solid ${ROSE}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Heart size={20} style={{ color: ROSE }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <h1 style={{ fontSize: 18, fontWeight: 900, color: T1, letterSpacing: '-.02em' }}>Healthcare Edition</h1>
                <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: ROSE, background: ROSE + '12', padding: '3px 8px', borderRadius: 4 }}>BETA</span>
                <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: PURP, background: PURP + '12', padding: '3px 8px', borderRadius: 4 }}>Industry Pack</span>
              </div>
              <p style={{ fontSize: 11, color: T2 }}>Hospital Systems · Clinics · Healthcare Networks — patient lifecycle, HIPAA compliance, clinical KPIs, and revenue cycle intelligence</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700, color: RED, background: RED + '10', padding: '6px 12px', borderRadius: 8, flexShrink: 0, border: `1px solid ${RED}20` }}>
              <Shield size={11} /> HIPAA-Ready
            </div>
          </div>

          <StatsGrid stats={HC_STATS} />

          {/* HIPAA notice */}
          <div style={{ background: RED + '05', border: `1px solid ${RED}25`, borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertTriangle size={14} style={{ color: RED, flexShrink: 0 }} />
            <p style={{ fontSize: 11, color: T2 }}>
              HIPAA compliance markers are automatically applied to all patient-related ontology types. KIMMP signal metadata strips PHI before transit. AEGIS Shield enforces access controls and generates audit logs.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* BIDS Pillars */}
            <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', borderBottom: `1px solid ${BDR}` }}>
                <Globe2 size={13} style={{ color: ROSE }} /><span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>BIDS™ Pillars Mapped</span>
                <span style={{ fontSize: 9, color: T3, marginLeft: 'auto' }}>6 healthcare pillars</span>
              </div>
              <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {HC_PILLARS.map(p => (
                  <div key={p.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 9, fontWeight: 800, color: ROSE, background: ROSE + '12', padding: '1px 6px', borderRadius: 4 }}>BIDS™ {p.bids}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: T1 }}>{p.label}</span>
                      {p.hipaa && <span style={{ fontSize: 7, fontWeight: 800, color: RED, background: RED + '12', padding: '1px 5px', borderRadius: 3, marginLeft: 'auto', marginRight: 4 }}>HIPAA</span>}
                      <span style={{ fontSize: 9, fontWeight: 700, color: TEAL, marginLeft: p.hipaa ? 0 : 'auto' }}>{p.coverage}%</span>
                    </div>
                    <div style={{ height: 3, background: 'var(--os-surface-0)', borderRadius: 2, marginBottom: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${p.coverage}%`, background: ROSE, borderRadius: 2 }} />
                    </div>
                    <p style={{ fontSize: 10, color: T2 }}>{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical KPIs */}
            <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', borderBottom: `1px solid ${BDR}` }}>
                <Activity size={13} style={{ color: ROSE }} /><span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>Clinical KPIs + KIMMP Signals</span>
              </div>
              <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {HC_KPIS.map(k => (
                  <div key={k.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: T1 }}>{k.label}</span>
                      <span style={{ fontSize: 10, fontWeight: 800, color: ROSE }}>{k.target}</span>
                    </div>
                    <p style={{ fontSize: 10, color: T2 }}>{k.kimmpSignal}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Workflow templates */}
          <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', borderBottom: `1px solid ${BDR}` }}>
              <Zap size={13} style={{ color: ROSE }} /><span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>Clinical Workflow Templates</span>
              <span style={{ fontSize: 9, color: T3, marginLeft: 'auto' }}>5 templates · click to expand</span>
            </div>
            <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {HC_WORKFLOWS.map(wf => <WorkflowCard key={wf.id} wf={wf} />)}
            </div>
          </div>
        </>
      )}

      {/* ── Manufacturing Edition ── */}
      {activePack === 'manufacturing' && (
        <>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: BLUE + '15', border: `1px solid ${BLUE}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Factory size={20} style={{ color: BLUE }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <h1 style={{ fontSize: 18, fontWeight: 900, color: T1, letterSpacing: '-.02em' }}>Manufacturing Edition</h1>
                <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: BLUE, background: BLUE + '12', padding: '3px 8px', borderRadius: 4 }}>BETA</span>
                <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: PURP, background: PURP + '12', padding: '3px 8px', borderRadius: 4 }}>Industry Pack</span>
              </div>
              <p style={{ fontSize: 11, color: T2 }}>Discrete + Process Manufacturing — OEE intelligence, predictive maintenance, quality gates, and supply chain signal monitoring</p>
            </div>
          </div>

          <StatsGrid stats={MFG_STATS} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* BIDS Pillars */}
            <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', borderBottom: `1px solid ${BDR}` }}>
                <Globe2 size={13} style={{ color: BLUE }} /><span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>BIDS™ Pillars Mapped</span>
                <span style={{ fontSize: 9, color: T3, marginLeft: 'auto' }}>3 ops pillars</span>
              </div>
              <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {MFG_PILLARS.map(p => (
                  <div key={p.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 9, fontWeight: 800, color: BLUE, background: BLUE + '12', padding: '1px 6px', borderRadius: 4 }}>BIDS™ {p.bids}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: T1 }}>{p.label}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: TEAL, marginLeft: 'auto' }}>{p.coverage}%</span>
                    </div>
                    <div style={{ height: 3, background: 'var(--os-surface-0)', borderRadius: 2, marginBottom: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${p.coverage}%`, background: BLUE, borderRadius: 2 }} />
                    </div>
                    <p style={{ fontSize: 10, color: T2 }}>{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Production KPIs */}
            <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', borderBottom: `1px solid ${BDR}` }}>
                <TrendingUp size={13} style={{ color: BLUE }} /><span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>Production KPIs + KIMMP Signals</span>
              </div>
              <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {MFG_KPIS.map(k => (
                  <div key={k.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: T1 }}>{k.label}</span>
                      <span style={{ fontSize: 10, fontWeight: 800, color: BLUE }}>{k.target}</span>
                    </div>
                    <p style={{ fontSize: 10, color: T2 }}>{k.kimmpSignal}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Workflow templates */}
          <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', borderBottom: `1px solid ${BDR}` }}>
              <Zap size={13} style={{ color: BLUE }} /><span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>Manufacturing Workflow Templates</span>
              <span style={{ fontSize: 9, color: T3, marginLeft: 'auto' }}>3 core templates · click to expand</span>
            </div>
            <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {MFG_WORKFLOWS.map(wf => <WorkflowCard key={wf.id} wf={wf} />)}
            </div>
          </div>

          {/* OEE trigger callout */}
          <div style={{ background: AMB + '06', border: `1.5px solid ${AMB}25`, borderRadius: 14, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <Wrench size={16} style={{ color: AMB, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 800, color: T1, marginBottom: 2 }}>Predictive Maintenance Trigger: <span style={{ color: AMB }}>OEE &lt; 75% → KIMMP Signal</span></p>
              <p style={{ fontSize: 11, color: T2 }}>When OEE drops below 75%, KIMMP automatically generates a MEDIUM signal, triggers the predictive maintenance workflow, and raises a work order in the connected ERP / CMMS. No manual intervention required.</p>
            </div>
          </div>
        </>
      )}

      {/* ── BFSI Edition ── */}
      {activePack === 'bfsi' && (
        <>
          <PreviewBanner packLabel="BFSI Edition" color={AMB} icon={TrendingUp} />
          <GenericPackView
            icon={TrendingUp} label="BFSI Edition" color={AMB} sprint="S73"
            pillars={BFSI_PILLARS} workflows={BFSI_WORKFLOWS} stats={BFSI_STATS} kpis={BFSI_KPIS}
            pillarsLabel="5 pillars · RBI/Basel III/SEBI/FATF compliance markers"
            workflowsLabel="4 core templates · click to expand"
            kpisLabel="Regulatory KPI framework"
            complianceField="compliance"
          />
        </>
      )}

      {/* ── Logistics Edition ── */}
      {activePack === 'logistics' && (
        <>
          <PreviewBanner packLabel="Logistics Edition" color={TEAL} icon={Globe2} />
          <GenericPackView
            icon={Globe2} label="Logistics Edition" color={TEAL} sprint="S73"
            pillars={LOGI_PILLARS} workflows={LOGI_WORKFLOWS} stats={LOGI_STATS} kpis={LOGI_KPIS}
            pillarsLabel="4 pillars · GHG Protocol / ESG compliance"
            workflowsLabel="4 core templates · click to expand"
            kpisLabel="Supply chain KPI framework"
          />
        </>
      )}

      {/* ── Government Edition ── */}
      {activePack === 'government' && (
        <>
          <PreviewBanner packLabel="Government Edition" color="#6366f1" icon={Shield} />
          <GenericPackView
            icon={Shield} label="Government Edition" color="#6366f1" sprint="S73"
            pillars={GOV_PILLARS} workflows={GOV_WORKFLOWS} stats={GOV_STATS} kpis={GOV_KPIS}
            pillarsLabel="4 pillars · AEGIS full audit trail on every decision"
            workflowsLabel="4 core templates · click to expand"
            kpisLabel="Public service KPI framework"
          />
        </>
      )}

    </div>
  )
}

function PreviewBanner({ packLabel, color, icon: Icon }: { packLabel: string; color: string; icon: React.ElementType }) {
  return (
    <div style={{ background: color + '08', border: `1.5px solid ${color}30`, borderRadius: 14, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <Icon size={15} style={{ color, flexShrink: 0 }} />
      <div>
        <p style={{ fontSize: 12, fontWeight: 800, color, marginBottom: 2 }}>{packLabel} — Preview</p>
        <p style={{ fontSize: 11, color: T2 }}>This pack ships in S73. Workflows, KPIs, and KIMMP signals are defined. Blueprint deployment available at GA.</p>
      </div>
    </div>
  )
}

function GenericPackView({ icon: Icon, label, color, sprint, pillars, workflows, stats, kpis, pillarsLabel, workflowsLabel, kpisLabel, complianceField }: {
  icon: React.ElementType; label: string; color: string; sprint: string
  pillars: any[]; workflows: any[]; stats: any[]; kpis: any[]
  pillarsLabel: string; workflowsLabel: string; kpisLabel: string; complianceField?: string
}) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: color + '15', border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={20} style={{ color }} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <h1 style={{ fontSize: 18, fontWeight: 900, color: T1, letterSpacing: '-.02em' }}>{label}</h1>
            <span style={{ fontSize: 8, fontWeight: 800, color: '#fff', background: color, padding: '2px 7px', borderRadius: 20 }}>{sprint}</span>
          </div>
          <p style={{ fontSize: 12, color: T2 }}>Industry-specific KIMMP intelligence pre-configured for this vertical.</p>
        </div>
      </div>

      <StatsGrid stats={stats} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', borderBottom: `1px solid ${BDR}` }}>
            <Globe2 size={13} style={{ color }} /><span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>BIDS™ Pillars Mapped</span>
            <span style={{ fontSize: 9, color: T3, marginLeft: 'auto' }}>{pillarsLabel}</span>
          </div>
          <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pillars.map((p: any) => (
              <div key={p.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color, background: color + '12', padding: '1px 6px', borderRadius: 4 }}>BIDS™ {p.bids}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: T1 }}>{p.label}</span>
                  {complianceField && p[complianceField] && <span style={{ fontSize: 8, fontWeight: 700, color: RED, background: RED + '12', padding: '1px 5px', borderRadius: 3, marginLeft: 'auto' }}>{p[complianceField]}</span>}
                  <span style={{ fontSize: 9, fontWeight: 700, color: TEAL, marginLeft: complianceField ? 0 : 'auto' }}>{p.coverage}%</span>
                </div>
                <div style={{ height: 3, background: 'var(--os-surface-0)', borderRadius: 2, marginBottom: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p.coverage}%`, background: color, borderRadius: 2 }} />
                </div>
                <p style={{ fontSize: 10, color: T2 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', borderBottom: `1px solid ${BDR}` }}>
            <TrendingUp size={13} style={{ color }} /><span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>KPIs + KIMMP Signals</span>
            <span style={{ fontSize: 9, color: T3, marginLeft: 'auto' }}>{kpisLabel}</span>
          </div>
          <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {kpis.map((k: any) => (
              <div key={k.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: T1 }}>{k.label}</span>
                  <span style={{ fontSize: 10, fontWeight: 800, color }}>{k.target}</span>
                </div>
                <p style={{ fontSize: 10, color: T2 }}>{k.kimmpSignal}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', borderBottom: `1px solid ${BDR}` }}>
          <Zap size={13} style={{ color }} /><span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>{label} Workflow Templates</span>
          <span style={{ fontSize: 9, color: T3, marginLeft: 'auto' }}>{workflowsLabel}</span>
        </div>
        <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {workflows.map((wf: any) => <WorkflowCard key={wf.id} wf={wf} />)}
        </div>
      </div>
    </>
  )
}
