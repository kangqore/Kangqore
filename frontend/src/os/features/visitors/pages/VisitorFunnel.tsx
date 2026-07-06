import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { api } from '@lib/api'

interface FunnelData {
  total:            number
  engaged:          number
  stitched:         number
  withConsultation: number
  converted:        number
}

interface Stage {
  label:    string
  key:      keyof FunnelData
  color:    string
  dimColor: string
  desc:     string
}

const STAGES: Stage[] = [
  { label: 'Total visitors',   key: 'total',            color: '#2564ea', dimColor: 'rgba(37,100,234,0.12)', desc: 'All anonymous visitors tracked' },
  { label: 'Engaged',          key: 'engaged',          color: '#8B5CF6', dimColor: 'rgba(139,92,246,0.12)', desc: '3+ sessions or ran an eQORE query' },
  { label: 'Registered',       key: 'stitched',         color: '#F59E0B', dimColor: 'rgba(245,158,11,0.12)', desc: 'Signed up and identity stitched' },
  { label: 'Consultation',     key: 'withConsultation', color: '#10B981', dimColor: 'rgba(16,185,129,0.12)', desc: 'Booked a consultation' },
  { label: 'Converted',        key: 'converted',        color: '#EF4444', dimColor: 'rgba(239,68,68,0.12)',  desc: 'Became a client' },
]

export function VisitorFunnel() {
  const navigate = useNavigate()
  const { data, isLoading } = useQuery<FunnelData>({
    queryKey: ['visitor-funnel'],
    queryFn:  () => api.get('/admin/visitor/funnel').then(r => r.data),
    staleTime: 1000 * 60 * 5,
  })

  const top = data?.total ?? 1

  return (
    <div className="os-card p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-widest font-semibold text-[var(--os-text-2)] mb-1">Conversion funnel</p>
          <p className="text-xs text-[var(--os-text-2)]">Visitor → Lead → Client pipeline</p>
        </div>
        <button
          onClick={() => navigate('/kangqore-view/admin/visitors')}
          className="text-[11px] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] flex items-center gap-1 transition-colors"
        >
          All visitors <ArrowRight size={12} />
        </button>
      </div>

      <div className="space-y-3">
        {STAGES.map((stage, i) => {
          const value = data?.[stage.key] ?? 0
          const pct   = top > 0 ? Math.round((value / top) * 100) : 0
          const dropPct = i > 0 && data
            ? Math.round(((data[STAGES[i - 1].key] - value) / Math.max(data[STAGES[i - 1].key], 1)) * 100)
            : null

          return (
            <div key={stage.key}>
              {/* Drop-off indicator */}
              {dropPct !== null && dropPct > 0 && (
                <div className="flex items-center gap-2 py-1 pl-2">
                  <span className="text-[9px] text-red-400 font-semibold">▼ {dropPct}% drop-off</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                {/* Stage number */}
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0"
                  style={{ background: stage.dimColor, color: stage.color }}
                >
                  {i + 1}
                </div>

                {/* Bar */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-[var(--os-text-1)]">{stage.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[var(--os-text-2)]">{pct}%</span>
                      <span className="text-[13px] font-black" style={{ color: stage.color }}>
                        {isLoading ? '—' : value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--os-surface-0)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: stage.color }}
                    />
                  </div>
                  <p className="text-[9px] text-[var(--os-text-2)] mt-0.5">{stage.desc}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
