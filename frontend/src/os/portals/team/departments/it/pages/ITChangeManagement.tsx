import { useState } from 'react'
import { Wrench, AlertCircle, Clock, CheckCircle2, AlertTriangle, Calendar, User, ArrowRight } from 'lucide-react'

type ChangeType   = 'Standard' | 'Normal' | 'Emergency'
type ChangeStatus = 'PLANNED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED'

interface ChangeItem {
  id:     string
  title:  string
  type:   ChangeType
  status: ChangeStatus
  risk:   number
  owner:  string
  window: string
  kimmp:  string
}

const CHANGES: ChangeItem[] = [
  { id: 'CHG-0118', title: 'Deploy Kangqore OS v2.4 to production',   type: 'Normal',    status: 'APPROVED',    risk: 72, owner: 'Arjun S.', window: 'Tonight 22:00', kimmp: 'High risk — 3 open incidents on same service. Consider postponing.' },
  { id: 'CHG-0117', title: 'Patch VPN gateway firmware — EU region',  type: 'Emergency', status: 'IN_PROGRESS', risk: 88, owner: 'Rohan M.', window: 'Now',          kimmp: 'Emergency: linked to 3 active P2 incidents. Approve with urgency.' },
  { id: 'CHG-0116', title: 'Upgrade PostgreSQL 15 → 16 — prod-db-01', type: 'Normal',    status: 'PLANNED',     risk: 60, owner: 'Priya N.', window: '28 Jun 01:00', kimmp: 'Moderate risk. Recommend full backup verification before window.' },
  { id: 'CHG-0115', title: 'Add BRAVE_SEARCH_API_KEY to prod env',    type: 'Standard',  status: 'APPROVED',    risk: 12, owner: 'Arjun S.', window: '25 Jun 14:00', kimmp: 'Low risk. Standard change — pre-approved.' },
  { id: 'CHG-0114', title: 'Rotate all prod API keys — quarterly',    type: 'Standard',  status: 'COMPLETED',   risk: 20, owner: 'Rohan M.', window: '22 Jun',       kimmp: 'Completed successfully. No incidents post-change.' },
  { id: 'CHG-0113', title: 'Replace SSL cert — legacy dashboard',     type: 'Standard',  status: 'COMPLETED',   risk: 15, owner: 'Sneha G.', window: '20 Jun',       kimmp: 'Completed. Cert valid until Jun 2026.' },
]

const T_COLOR: Record<ChangeType,   string> = { Standard: '#30d158', Normal: '#ff9f0a', Emergency: '#ff453a' }
const S_COLOR: Record<ChangeStatus, string> = { PLANNED: '#86868b', APPROVED: '#0071e3', IN_PROGRESS: '#ff9f0a', COMPLETED: '#30d158', REJECTED: '#ff453a' }

function RiskDial({ score }: { score: number }) {
  const color = score > 75 ? '#ff453a' : score > 50 ? '#ff9f0a' : '#30d158'
  const radius = 16
  const circ = 2 * Math.PI * radius
  const offset = circ * (1 - score / 100)

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10 flex items-center justify-center flex-shrink-0">
        <svg className="w-10 h-10 transform -rotate-90">
          <circle cx="20" cy="20" r={radius} className="stroke-white/5 fill-none" strokeWidth="3" />
          <circle 
            cx="20" 
            cy="20" 
            r={radius} 
            className="fill-none transition-all duration-500" 
            stroke={color} 
            strokeWidth="3.5" 
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-[10px] font-mono font-bold text-white">{score}</span>
      </div>
      <div className="hidden sm:block">
        <span className="block text-[8px] text-[var(--os-text-2)] uppercase tracking-widest font-bold">KIMMP Risk</span>
        <span className="text-[10px] font-bold" style={{ color }}>{score > 75 ? 'Critical' : score > 50 ? 'Medium' : 'Low'}</span>
      </div>
    </div>
  )
}

export function ITChangeManagement() {
  const [expanded, setExpanded] = useState<string | null>(null)

  const activeChanges = CHANGES.filter(c => c.status !== 'COMPLETED' && c.status !== 'REJECTED')
  const emergencies   = CHANGES.filter(c => c.type === 'Emergency')
  const highRisk      = CHANGES.filter(c => c.risk > 75)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-10">
      
      {/* Immersive Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center flex-shrink-0 shadow-md">
            <Wrench className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Change Registry</h1>
            <p className="text-[var(--os-text-2)] mt-1.5 text-sm max-w-xl">
              System change advisory list, active releases, and live risk scores evaluated by KIMMP model weights.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <p className="text-[10px] text-[var(--os-text-2)] font-semibold uppercase tracking-wider">Active Rollouts</p>
            <p className="text-xl font-bold text-amber-400 mt-0.5">{activeChanges.length}</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <p className="text-[10px] text-[var(--os-text-2)] font-semibold uppercase tracking-wider">Critical Risk</p>
            <p className="text-xl font-bold text-red-500 mt-0.5">{highRisk.length}</p>
          </div>
        </div>
      </div>

      {/* Visual Timeline change register */}
      <div className="relative pl-6 sm:pl-10 space-y-6">
        
        {/* Continuous Timeline vertical line */}
        <div className="absolute left-[11px] sm:left-[19px] top-4 bottom-4 w-px bg-white/5 z-0">
          <div className="absolute top-0 w-full h-[60%] bg-gradient-to-b from-blue-500 via-amber-500 to-transparent" />
        </div>

        {CHANGES.map(c => {
          const isExpanded = expanded === c.id
          const typeColor = T_COLOR[c.type]
          const statusColor = S_COLOR[c.status]

          return (
            <div 
              key={c.id} 
              className={`relative rounded-3xl border transition-all duration-500 overflow-hidden ${
                isExpanded 
                  ? 'bg-slate-900 border-white/15 shadow-2xl scale-[1.01]' 
                  : 'bg-slate-950/20 border-white/5 shadow-md hover:bg-slate-900/40 hover:border-white/10'
              }`}
            >
              
              {/* Timeline dot beacon */}
              <div 
                className="absolute left-[-18px] sm:left-[-26px] top-6 w-3 h-3 rounded-full border-2 border-slate-950 z-10 transition-all duration-300"
                style={{ 
                  background: statusColor, 
                  boxShadow: c.status === 'IN_PROGRESS' ? `0 0 10px ${statusColor}` : undefined 
                }}
              />

              <div
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 cursor-pointer select-none"
                onClick={() => setExpanded(isExpanded ? null : c.id)}
              >
                
                {/* Change Code & Badge */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[10px] font-mono font-bold text-[var(--os-text-2)]">{c.id}</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider h-fit" 
                    style={{ background: `${typeColor}15`, color: typeColor, border: `1px solid ${typeColor}25` }}>
                    {c.type}
                  </span>
                </div>

                {/* Title & metadata */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate group-hover:text-[var(--os-text-1)]">{c.title}</h3>
                  <div className="flex items-center gap-4 mt-1.5 text-[11px] text-[var(--os-text-2)] font-medium">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {c.owner}</span>
                    <span className="flex items-center gap-1 font-mono"><Calendar className="w-3 h-3" /> {c.window}</span>
                  </div>
                </div>

                {/* Risk & Status indicator */}
                <div className="flex items-center justify-between sm:justify-end gap-6 flex-shrink-0 pt-3 sm:pt-0 border-t border-white/5 sm:border-0">
                  <RiskDial score={c.risk} />
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-inner" 
                    style={{ background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}25` }}>
                    {c.status.replace('_', ' ')}
                  </span>
                </div>

              </div>

              {/* Collapsed KIMMP context panel */}
              <div className={`transition-all duration-500 overflow-hidden ${
                isExpanded ? 'max-h-60 border-t border-white/5 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
              }`}>
                <div className="p-5 bg-white/[0.01]">
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-500/[0.02] border border-blue-500/10">
                    <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">KIMMP Risk Analytics Context</p>
                      <p className="text-xs sm:text-sm text-[var(--os-text-1)] leading-relaxed font-medium">{c.kimmp}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )
        })}
      </div>
      
    </div>
  )
}
