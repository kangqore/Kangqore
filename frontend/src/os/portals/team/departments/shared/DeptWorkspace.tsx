import { useState } from 'react'
import { Brain, Zap, Circle, Wifi } from 'lucide-react'
import type { DeptConfig } from '../../deptConfigs'

interface Stat  { label: string; value: string; color: string }
interface Signal { text: string; confidence: number }
interface Activity { action: string; time: string; actor: string }

interface WorkspaceData {
  stats:    Stat[]
  signal:   Signal
  activity: Activity[]
}

const DATA: Record<string, WorkspaceData> = {
  it: {
    stats: [
      { label: 'Open Incidents',   value: '7',     color: '#EF4444' },
      { label: 'Changes This Week',value: '12',    color: '#F59E0B' },
      { label: 'Uptime (30d)',     value: '99.7%', color: '#10B981' },
      { label: 'Assets Tracked',   value: '438',   color: '#2564ea' },
    ],
    signal: { text: '3 P2 incidents this week share a VPN gateway root cause. 91% probability of a P1 within 48h if not resolved. Recommend patching gateway during tonight\'s maintenance window.', confidence: 91 },
    activity: [
      { action: 'P2 incident #IT-0047 opened — VPN latency spike',    time: '30m ago',    actor: 'System' },
      { action: 'Change #CHG-0112 approved by CAB',                   time: '2h ago',     actor: 'Rohan' },
      { action: 'Sprint Board — 4 tickets moved to Done',             time: '4h ago',     actor: 'Arjun' },
      { action: 'KB article updated: Zero-trust network config',      time: 'Yesterday',  actor: 'Priya' },
      { action: 'Server rack B-04 patched — 17 CVEs resolved',       time: '2 days ago', actor: 'Rohan' },
    ],
  },
  hr: {
    stats: [
      { label: 'Headcount',        value: '94',    color: '#8B5CF6' },
      { label: 'Open Roles',       value: '8',     color: '#F59E0B' },
      { label: 'Avg Time-to-Hire', value: '22d',   color: '#10B981' },
      { label: 'Attrition (YTD)',  value: '4.2%',  color: '#EF4444' },
    ],
    signal: { text: 'Engineering attrition is 3× the company average this quarter. Two senior roles have been open for 90+ days, increasing delivery risk. Recommend expedited hiring pipeline review.', confidence: 88 },
    activity: [
      { action: 'Offer accepted — Senior Backend Engineer (Kavya R.)',  time: '1h ago',     actor: 'HR' },
      { action: 'Onboarding checklist completed — Rohan Mehta',         time: '3h ago',     actor: 'Rohan' },
      { action: 'Performance review cycle opened — Q2 Engineering',     time: 'Yesterday',  actor: 'System' },
      { action: 'Leave approved — Sneha Gupta (5 days)',                time: '2 days ago', actor: 'Manager' },
      { action: 'Policy updated: Remote work expense policy v3.1',      time: '3 days ago', actor: 'HR' },
    ],
  },
  finance: {
    stats: [
      { label: 'Budget Utilisation', value: '67%',    color: '#10B981' },
      { label: 'Overdue Invoices',   value: '3',      color: '#EF4444' },
      { label: 'Pending Approvals',  value: '11',     color: '#F59E0B' },
      { label: 'Expense Reports',    value: '24',     color: '#6366F1' },
    ],
    signal: { text: 'Month-end close is 40% behind schedule. If current velocity holds, the Friday deadline will be missed by 2 days. 3 unsigned CFO approvals are on the critical path.', confidence: 84 },
    activity: [
      { action: 'Invoice INV-0291 paid — Acme Corp (£42,000)',      time: '2h ago',     actor: 'Finance' },
      { action: 'Expense report submitted — Arjun Sharma (£1,240)', time: '4h ago',     actor: 'Arjun' },
      { action: 'Budget variance alert — Marketing over by 12%',    time: 'Yesterday',  actor: 'System' },
      { action: 'Vendor contract renewed — AWS (3yr, £180K)',       time: '2 days ago', actor: 'Finance' },
      { action: 'Q2 forecast updated — revenue +8% vs plan',       time: '3 days ago', actor: 'CFO' },
    ],
  },
  security: {
    stats: [
      { label: 'Open Risks',       value: '14',   color: '#EF4444' },
      { label: 'Critical CVEs',    value: '17',   color: '#EF4444' },
      { label: 'Controls Passing', value: '89%',  color: '#10B981' },
      { label: 'Days to Audit',    value: '84',   color: '#F59E0B' },
    ],
    signal: { text: '17 critical CVEs unpatched beyond SLA. Access review is 6 days overdue. SOC 2 audit is in 12 weeks — 3 controls are currently failing. Immediate action required on CVE remediation.', confidence: 95 },
    activity: [
      { action: 'Critical CVE-2024-1182 flagged — patch available',  time: '1h ago',     actor: 'Scanner' },
      { action: 'Security incident #SEC-0023 resolved — phishing',   time: '3h ago',     actor: 'Team' },
      { action: 'Access review reminder — 14 users pending',         time: 'Yesterday',  actor: 'System' },
      { action: 'Pen test finding #PT-008 closed — SQL injection',   time: '2 days ago', actor: 'Rohan' },
      { action: 'SOC 2 control CC6.1 evidence uploaded',             time: '3 days ago', actor: 'Priya' },
    ],
  },
  legal: {
    stats: [
      { label: 'Active Contracts', value: '47',  color: '#F59E0B' },
      { label: 'Expiring (30d)',   value: '4',   color: '#EF4444' },
      { label: 'Pending Review',   value: '6',   color: '#F59E0B' },
      { label: 'Active Matters',   value: '9',   color: '#6366F1' },
    ],
    signal: { text: '4 contracts expire in the next 30 days with no renewal action started. One involves your second-largest client — revenue at risk: £240K. Recommend escalating to commercial team today.', confidence: 93 },
    activity: [
      { action: 'NDA signed — Venture Partners Ltd',                  time: '2h ago',     actor: 'Legal' },
      { action: 'Contract redline returned — GlobalTech MSA',        time: '4h ago',     actor: 'Client' },
      { action: 'GDPR compliance deadline added — ICO filing 30 Jul',time: 'Yesterday',  actor: 'System' },
      { action: 'Matter #LGL-0018 closed — employment dispute',      time: '2 days ago', actor: 'Legal' },
      { action: 'New entity registered — Kangqore Labs Ltd',         time: '4 days ago', actor: 'Solicitor' },
    ],
  },
  support: {
    stats: [
      { label: 'Open Tickets',     value: '34',   color: '#06B6D4' },
      { label: 'SLA Breached',     value: '3',    color: '#EF4444' },
      { label: 'Avg CSAT',         value: '4.6★', color: '#10B981' },
      { label: 'Escalations',      value: '2',    color: '#F59E0B' },
    ],
    signal: { text: 'Client Acme Corp has opened 9 tickets this month — 3× their historical average. Two are unresolved past SLA. Churn risk is elevated. Escalate to CSM immediately.', confidence: 87 },
    activity: [
      { action: 'Ticket #SUP-0341 escalated to Engineering — API bug', time: '1h ago',     actor: 'Support' },
      { action: '12 tickets resolved today — CSAT avg 4.8',           time: '3h ago',     actor: 'Team' },
      { action: 'KB article published: SSO configuration guide',      time: 'Yesterday',  actor: 'Sneha' },
      { action: 'SLA breach — ticket #SUP-0328 (Acme Corp)',          time: 'Yesterday',  actor: 'System' },
      { action: 'Agent performance review — Kavya top performer',     time: '2 days ago', actor: 'Manager' },
    ],
  },
  facilities: {
    stats: [
      { label: 'Open Work Orders', value: '11',   color: '#F97316' },
      { label: 'Overdue',          value: '3',    color: '#EF4444' },
      { label: 'Occupancy Rate',   value: '78%',  color: '#10B981' },
      { label: 'Assets Tracked',   value: '204',  color: '#6366F1' },
    ],
    signal: { text: '3 overdue maintenance work orders. Fire inspection was due 14 days ago with no completion recorded. This is a compliance exposure — escalate to Facilities Manager immediately.', confidence: 96 },
    activity: [
      { action: 'Work order #WO-0089 completed — HVAC filter replacement', time: '2h ago',     actor: 'Contractor' },
      { action: 'Space request approved — Marketing floor expansion',       time: '4h ago',     actor: 'Facilities' },
      { action: 'Lease renewal reminder — London HQ (expires Sep 2026)',    time: 'Yesterday',  actor: 'System' },
      { action: 'Vendor contract renewed — CleanPro Services',             time: '2 days ago', actor: 'Facilities' },
      { action: 'Annual fire safety inspection scheduled — 15 Jul',        time: '3 days ago', actor: 'HSE' },
    ],
  },
  'supply-chain': {
    stats: [
      { label: 'Production Orders', value: '28',   color: '#6366F1' },
      { label: 'Stock Alerts',      value: '4',    color: '#EF4444' },
      { label: 'On-Time Delivery',  value: '94%',  color: '#10B981' },
      { label: 'Active Suppliers',  value: '37',   color: '#818CF8' },
    ],
    signal: { text: 'Component X is at 6 days of stock remaining. Supplier lead time is 14 days. You will hit a production stoppage in 6 days unless you expedite. Recommend emergency PO today.', confidence: 97 },
    activity: [
      { action: 'Production order #PO-0412 completed — Batch A47',    time: '2h ago',     actor: 'Factory' },
      { action: 'Supplier alert — Component X reorder triggered',     time: '3h ago',     actor: 'System' },
      { action: 'QC hold released — Batch A45 (passed inspection)',   time: 'Yesterday',  actor: 'QC Team' },
      { action: 'Logistics update — Shipment SHP-0083 delayed 2 days',time: 'Yesterday',  actor: 'Carrier' },
      { action: 'New supplier approved — Vertex Components Ltd',      time: '3 days ago', actor: 'Procurement' },
    ],
  },
}

interface Props { config: DeptConfig }

export function DeptWorkspace({ config }: Props) {
  const [expandKIMMP, setExpandKIMMP] = useState(false)
  const data = DATA[config.id] ?? DATA.it

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 drop-shadow-sm" style={{ fontFamily: 'var(--font-display)' }}>{config.name} — Workspace</h1>
          <p className="text-[var(--os-text-2)] mt-2 text-sm max-w-2xl leading-relaxed font-medium">{config.description}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border flex-shrink-0"
          style={{ background: `${config.accentColor}11`, borderColor: `${config.accentColor}33` }}>
          <Wifi className="w-3 h-3" style={{ color: config.accentColor }} />
          <span className="text-[11px] font-bold" style={{ color: config.accentColor }}>Live</span>
        </div>
      </div>

      {/* Massive Vibrant Stats Blocks */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {data.stats.map(s => {
          // Map standard colors to the monday.com super vibrant colors
          const bgColor = s.color === '#EF4444' ? '#e2445c' :
                          s.color === '#F59E0B' || s.color === '#F97316' ? '#fdab3d' :
                          s.color === '#10B981' ? '#00c875' :
                          s.color === '#2564ea' || s.color === '#06B6D4' ? '#579bfc' :
                          s.color;
          return (
            <div key={s.label} className="group relative p-8 rounded-2xl overflow-hidden transition-transform duration-200 hover:-translate-y-1 shadow-sm"
              style={{ backgroundColor: bgColor }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-black pointer-events-none" />
              <p className="text-[52px] font-black leading-none text-white tracking-tighter mb-4 drop-shadow-sm">{s.value}</p>
              <div className="flex items-center justify-between border-t border-white/20 pt-4 mt-auto">
                <p className="text-white font-bold text-sm">{s.label}</p>
                <div className="px-3 py-1 rounded-full bg-black/10 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">View All</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* KIMMP Signal */}
      <div
        className="relative rounded-2xl bg-white border border-slate-200 p-6 space-y-4 cursor-pointer transition-shadow duration-200 hover:shadow-md overflow-hidden"
        onClick={() => setExpandKIMMP(x => !x)}
      >
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${config.accentColor}, transparent)` }} />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 animate-pulse" style={{ color: config.accentColor }} />
            <span className="text-[13px] font-bold uppercase tracking-[0.2em] text-slate-800">KIMMP Signal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${config.accentColor}15`, color: config.accentColor }}>
              {data.signal.confidence}% confidence
            </span>
            <Zap className="w-4 h-4 text-[var(--os-text-2)]" />
          </div>
        </div>
        <p className={`relative z-10 text-sm text-[var(--os-text-2)] font-medium leading-relaxed ${!expandKIMMP ? 'line-clamp-2' : ''}`}>
          {data.signal.text}
        </p>
        <p className="relative z-10 text-xs font-bold uppercase tracking-wider" style={{ color: config.accentColor }}>{expandKIMMP ? 'Click to collapse' : 'Click to expand'}</p>
      </div>

      {/* Recent Activity */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
        <h2 className="text-xs font-bold text-[var(--os-text-2)] uppercase tracking-widest">Recent Activity</h2>
        <ul className="space-y-3">
          {data.activity.map((a, i) => (
            <li key={i} className="flex items-start gap-3">
              <Circle className="w-1.5 h-1.5 mt-2 flex-shrink-0 text-[var(--os-text-1)]" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--os-text-2)] font-medium leading-snug">{a.action}</p>
                <p className="text-xs text-[var(--os-text-2)] mt-0.5">{a.actor} · {a.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
