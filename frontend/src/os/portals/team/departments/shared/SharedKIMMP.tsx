import { Brain, Zap, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { DeptConfig } from '../../deptConfigs'

interface Signal {
  title:      string
  body:       string
  confidence: number
  type:       'alert' | 'insight' | 'recommendation'
}

const SIGNALS: Record<string, Signal[]> = {
  it: [
    { title: 'P1 Risk — VPN Gateway', body: '3 P2 incidents this week share the VPN gateway as a root cause. 91% probability of a P1 within 48h. Patch during tonight\'s maintenance window.', confidence: 91, type: 'alert' },
    { title: 'Sprint Velocity Up 18%', body: 'Team velocity is 18% above baseline this sprint. Current trajectory puts Sprint 12 delivery ahead of schedule by 2 days.', confidence: 85, type: 'insight' },
    { title: 'Asset Refresh Overdue', body: '23 assets have exceeded their 3-year refresh cycle. Recommend budgeting hardware refresh in Q3 to avoid reliability risk.', confidence: 78, type: 'recommendation' },
  ],
  hr: [
    { title: 'Engineering Attrition Risk', body: 'Engineering attrition is 3× the company average. Two senior roles unfilled for 90+ days. Delivery risk is elevated. Consider retention bonuses or role restructure.', confidence: 88, type: 'alert' },
    { title: 'Recruitment Pipeline Strong', body: '8 candidates in final-round interviews across 5 open roles. Projected time-to-hire for senior engineer is 12 days, down from 34 days last quarter.', confidence: 82, type: 'insight' },
    { title: 'Training Completion Low', body: 'Security awareness training completion is at 67% — below the 90% compliance target. Deadline is 30 Jun. 31 employees have not yet completed.', confidence: 95, type: 'alert' },
  ],
  finance: [
    { title: 'Month-End Close At Risk', body: 'Close is 40% behind schedule. 3 CFO approvals on the critical path. If current velocity holds, Friday deadline will be missed by 2 days.', confidence: 84, type: 'alert' },
    { title: 'Q2 Revenue Tracking +8%', body: 'Q2 revenue is tracking 8% above plan based on current AR data. Cash position is healthy. Recommend updating board forecast.', confidence: 79, type: 'insight' },
    { title: 'Overdue Invoice Recovery', body: '3 invoices are overdue totalling £87K. Acme Corp invoice (£42K, 28 days overdue) is the largest. Recommend direct CFO escalation.', confidence: 92, type: 'recommendation' },
  ],
  security: [
    { title: 'Critical CVE Exposure', body: '17 critical CVEs are unpatched beyond SLA. The top 3 have public exploits available. Immediate patching required — P1 risk to production.', confidence: 97, type: 'alert' },
    { title: 'SOC 2 Audit Readiness', body: '3 controls are currently failing with 84 days to audit. Controls CC6.1, CC7.2, CC8.1 require immediate evidence collection. On current trajectory, you\'ll be ready in 90 days — 6 days late.', confidence: 89, type: 'alert' },
    { title: 'Access Review Overdue', body: '14 users have not completed their quarterly access certification. This is a SOC 2 CC6 requirement. Deadline was 6 days ago.', confidence: 96, type: 'recommendation' },
  ],
  legal: [
    { title: 'Contract Expiry Risk', body: '4 contracts expire in 30 days with no renewal started. One is your second-largest client (£240K ARR). Escalate to commercial today.', confidence: 93, type: 'alert' },
    { title: 'Approval Queue Backlog', body: '6 contracts are pending legal review with an average age of 9 days. Standard SLA is 5 days. Two clients have flagged delays.', confidence: 87, type: 'insight' },
    { title: 'GDPR Filing Deadline', body: 'ICO annual filing is due 30 Jul — 37 days from now. Last year\'s filing took 18 working days. Recommend starting collection this week.', confidence: 98, type: 'recommendation' },
  ],
  support: [
    { title: 'Acme Corp Churn Risk', body: 'Acme Corp has 9 open tickets this month — 3× historical average. 2 are past SLA. Churn probability is elevated. Immediate CSM escalation required.', confidence: 87, type: 'alert' },
    { title: 'SLA Breach Rate Elevated', body: 'SLA breach rate is 8.8% this week, above the 5% target. Root cause: 3 P2 tickets assigned to agents who were out without coverage.', confidence: 82, type: 'insight' },
    { title: 'KB Gap Detected', body: 'SSO configuration questions account for 23% of tickets this month. A published KB article could deflect ~18 tickets per week. KIMMP recommends prioritising this article.', confidence: 79, type: 'recommendation' },
  ],
  facilities: [
    { title: 'Compliance Exposure — Fire Inspection', body: 'Fire safety inspection was due 14 days ago with no completion recorded. This creates a legal compliance exposure. Escalate to Facilities Manager immediately.', confidence: 97, type: 'alert' },
    { title: '3 Maintenance Orders Overdue', body: 'Work orders WO-0074, WO-0081, WO-0083 are overdue by 7, 4, and 2 days respectively. WO-0074 involves HVAC — risk of equipment damage.', confidence: 91, type: 'alert' },
    { title: 'Lease Renewal Window', body: 'London HQ lease expires Sep 2026. Based on typical negotiation timelines (6 months), you should begin renewal conversations by Mar 2026. Consider whether to expand footprint given 78% occupancy.', confidence: 84, type: 'recommendation' },
  ],
  'supply-chain': [
    { title: 'Production Stoppage Risk — 6 Days', body: 'Component X has 6 days of stock remaining. Supplier lead time is 14 days. Without an expedited order today, production will stop in 6 days. Emergency PO required.', confidence: 97, type: 'alert' },
    { title: 'On-Time Delivery Strong', body: 'OTD rate is 94% — above the 90% target. Carrier delays on route UK→EU have been mitigated by 2-day buffer stock introduced last quarter.', confidence: 88, type: 'insight' },
    { title: 'Supplier Concentration Risk', body: '43% of critical components come from a single supplier region. A geopolitical disruption would halt production within 21 days. Recommend qualifying a secondary supplier.', confidence: 80, type: 'recommendation' },
  ],
}

const TYPE_STYLE: Record<string, { color: string; icon: typeof AlertCircle; label: string }> = {
  alert:          { color: '#EF4444', icon: AlertCircle,   label: 'Alert' },
  insight:        { color: '#2564ea', icon: TrendingUp,    label: 'Insight' },
  recommendation: { color: '#10B981', icon: CheckCircle2,  label: 'Recommendation' },
}

interface Props { config: DeptConfig }

export function SharedKIMMP({ config }: Props) {
  const signals = SIGNALS[config.id] ?? SIGNALS.it

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${config.accentColor}22` }}>
          <Brain className="w-6 h-6" style={{ color: config.accentColor }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">KIMMP Brief — {config.label}</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Department-scoped intelligence signals synthesised by KIMMP across your operational data.</p>
        </div>
      </div>

      {/* Signal cards */}
      <div className="space-y-4">
        {signals.map((s, i) => {
          const style = TYPE_STYLE[s.type]
          const Icon = style.icon
          return (
            <div
              key={i}
              className="p-5 rounded-2xl border space-y-3"
              style={{ background: `${style.color}08`, borderColor: `${style.color}30` }}
            >
              <div className="flex items-start gap-3">
                <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: style.color }} />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-white">{s.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: `${style.color}22`, color: style.color }}>
                        {style.label}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-[var(--os-text-2)] font-medium">
                        <Zap className="w-3 h-3" />
                        {s.confidence}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--os-text-1)] mt-2 leading-relaxed">{s.body}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-[var(--os-text-2)] text-center pt-2">
        KIMMP synthesises signals every 4 hours from your operational data, standups, incidents, and cross-module events.
      </p>
    </div>
  )
}
