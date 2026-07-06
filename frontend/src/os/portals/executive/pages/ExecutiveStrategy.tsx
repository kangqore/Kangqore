import { Target, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'

const okrs = [
  {
    objective: 'Become the category-defining Business OS for enterprises',
    keyResults: [
      { kr: 'Close 3 enterprise pilots (>$500K ACV each)',        progress: 33, status: 'AT_RISK'    },
      { kr: 'BIDS™ deployed to 2 FTSE 500 clients',              progress: 0,  status: 'NOT_STARTED' },
      { kr: 'KIMMP daily active sessions > 50 per client',       progress: 60, status: 'ON_TRACK'   },
    ]
  },
  {
    objective: 'Build a compliance-ready, enterprise-grade platform',
    keyResults: [
      { kr: 'SOC 2 Type I report issued by end Q3 2026',         progress: 61, status: 'AT_RISK'    },
      { kr: 'SAML SSO live for all enterprise tiers',            progress: 80, status: 'ON_TRACK'   },
      { kr: 'Zero critical security findings in pen test',       progress: 0,  status: 'NOT_STARTED' },
    ]
  },
  {
    objective: 'Scale revenue to $10M ARR',
    keyResults: [
      { kr: 'Q2 ARR target: $2.8M',                             progress: 78, status: 'ON_TRACK'   },
      { kr: 'Average deal size > $280K',                        progress: 85, status: 'ON_TRACK'   },
      { kr: 'CAC payback < 14 months',                          progress: 55, status: 'AT_RISK'    },
    ]
  },
]

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  ON_TRACK:    { label: 'On Track',    color: '#10B981', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  AT_RISK:     { label: 'At Risk',     color: '#F59E0B', icon: <AlertCircle className="w-3.5 h-3.5" /> },
  NOT_STARTED: { label: 'Not Started', color: '#6B7280', icon: <Clock className="w-3.5 h-3.5" /> },
}

export function ExecutiveStrategy() {
  return (
    <div className="space-y-10">
      <KIMMPSignalBar module="Strategy & OKRs" />
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
          <Target className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Strategy & OKRs</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Company objectives and key results — Q2/Q3 2026.</p>
        </div>
      </div>

      <div className="space-y-6">
        {okrs.map(({ objective, keyResults }) => (
          <div key={objective} className="os-card p-6">
            <h3 className="font-bold text-[15px] mb-5" style={{ color: 'var(--os-text-1)' }}>{objective}</h3>
            <div className="space-y-4">
              {keyResults.map(({ kr, progress, status }) => {
                const cfg = STATUS_CONFIG[status]
                return (
                  <div key={kr}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-[var(--os-text-1)] flex-1">{kr}</p>
                      <div className="flex items-center gap-1.5 ml-4 flex-shrink-0" style={{ color: cfg.color }}>
                        {cfg.icon}
                        <span className="text-[11px] font-bold">{cfg.label}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--os-surface)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: cfg.color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
