import { ArrowUpRight, Layers, Cpu, FileText, Building2, Loader2, Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api } from '@lib/api'

interface BidsEngagement {
  id: string
  clientName: string
  industry: string
  status: string
  deliverables: { n: number; name: string; status: string }[]
}

interface BidsStats {
  total: number
  byStatus: Record<string, number>
}

function useBidsEngagements() {
  return useQuery<{ engagements: BidsEngagement[]; stats: BidsStats }>({
    queryKey: ['bids-engagements'],
    queryFn: () => api.get('/admin/bids/engagements').then(r => r.data),
    staleTime: 60_000,
  })
}

const PILLARS = [
  { n: 1,  name: 'Business Strategy Intelligence™',      score: 'Strategy Maturity Score™',         accent: '#579bfc' },
  { n: 2,  name: 'Leadership Intelligence™',             score: 'Leadership Effectiveness Score™',   accent: '#579bfc' },
  { n: 3,  name: 'Financial Intelligence™',              score: 'Financial Health Score™',           accent: '#579bfc' },
  { n: 4,  name: 'Operational Intelligence™',            score: 'Operational Efficiency Score™',     accent: '#7c3aed' },
  { n: 5,  name: 'Workforce Intelligence™',              score: 'Workforce Readiness Score™',        accent: '#7c3aed' },
  { n: 6,  name: 'Customer Intelligence™',               score: 'Customer Experience Score™',        accent: '#7c3aed' },
  { n: 7,  name: 'Sales Intelligence™',                  score: 'Revenue Engine Score™',             accent: '#00c875' },
  { n: 8,  name: 'Growth Intelligence™',                 score: 'Digital Growth Score™',             accent: '#00c875' },
  { n: 9,  name: 'Technology Intelligence™',             score: 'Technology Maturity Score™',        accent: '#fdab3d' },
  { n: 10, name: 'Cloud & Infrastructure Intelligence™', score: 'Infrastructure Readiness Score™',   accent: '#fdab3d' },
  { n: 11, name: 'Data Intelligence™',                   score: 'Data Maturity Score™',              accent: '#fdab3d' },
  { n: 12, name: 'AI Intelligence™',                     score: 'AI Readiness Score™',               accent: '#7c3aed' },
  { n: 13, name: 'Automation Intelligence™',             score: 'Automation Maturity Score™',        accent: '#7c3aed' },
  { n: 14, name: 'Cybersecurity Intelligence™',          score: 'Cyber Resilience Score™',           accent: '#e2445c' },
  { n: 15, name: 'Governance & Risk Intelligence™',      score: 'Governance Maturity Score™',        accent: '#e2445c' },
  { n: 16, name: 'Transformation Intelligence™',         score: 'Transformation Readiness Score™',   accent: '#fdab3d' },
]

const ENGINES = [
  { name: 'Cognition Intelligence Engine™', accent: '#7c3aed', desc: 'AI & GenAI readiness, data maturity for AI, automation potential, AI governance' },
  { name: 'Foundry Intelligence Engine™',   accent: '#579bfc', desc: 'Infrastructure health, cloud readiness, engineering maturity, platform resilience' },
  { name: 'Reimagine Intelligence Engine™', accent: '#fdab3d', desc: 'Modernisation priority, legacy debt exposure, transformation readiness, change capability' },
  { name: 'Shield Intelligence Engine™',    accent: '#e2445c', desc: 'Security posture, risk & compliance gap, AI governance coverage, operational trust' },
  { name: 'Platforms Intelligence Engine™', accent: '#00c875', desc: 'Enterprise platform utilisation, integration complexity, process maturity, consolidation opportunity' },
  { name: 'Growth Intelligence Engine™',    accent: '#fdab3d', desc: 'Revenue engine score, marketing performance gaps, conversion bottlenecks, digital visibility' },
]

const DELIVERABLES = [
  'Diagnostic Scorecard™',
  'Executive Intelligence Report™',
  'Transformation Blueprint™',
  'Risk Register™',
  'Opportunity Register™',
  'Service Prescription Matrix™',
  '30/60/90/180-Day Roadmap™',
  'Executive Board Presentation™',
  'Executive Workshop™',
  'ROI Projection Report™',
]

const INDUSTRIES = [
  'Manufacturing', 'Education', 'Healthcare', 'Financial Services',
  'Retail & Commerce', 'SaaS & Technology', 'Government', 'Startup', 'Enterprise', 'Non-Profit',
]

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  ACTIVE:    { label: 'Active',     color: '#00c875' },
  COMPLETED: { label: 'Completed',  color: '#579bfc' },
  PAUSED:    { label: 'Paused',     color: '#fdab3d' },
  DRAFT:     { label: 'Draft',      color: 'var(--os-text-2)' },
}

export function BidsOverviewPage() {
  const navigate = useNavigate()
  const { data, isLoading } = useBidsEngagements()
  const engagements: BidsEngagement[] = data?.engagements ?? []
  const stats: BidsStats = data?.stats ?? { total: 0, byStatus: {} }
  const activeCount    = stats.byStatus['ACTIVE']    ?? 0
  const completedCount = stats.byStatus['COMPLETED'] ?? 0

  return (
    <div className="space-y-10">
      {/* Page header */}
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full"
              style={{ background: '#579bfc18', color: '#579bfc', border: '1px solid #579bfc30' }}>
              Flagship Product
            </span>
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" style={{ color: 'var(--os-text-3)' }} />
            ) : stats.total > 0 ? (
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
                style={{ background: '#00c87518', color: '#00c875', border: '1px solid #00c87530' }}>
                {stats.total} engagement{stats.total !== 1 ? 's' : ''} · {activeCount} active
              </span>
            ) : null}
          </div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>BIDS™</h1>
          <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--os-text-2)' }}>Business Diagnostic Intelligence System™</p>
          <p className="text-sm mt-3 max-w-lg leading-relaxed" style={{ color: 'var(--os-text-3)' }}>
            The Enterprise MRI for Business, Technology, Operations, AI, Security, and Growth.
            Diagnose before you transform — find invisible constraints, not just visible symptoms.
          </p>
          <p className="text-xs font-semibold tracking-wide mt-4 italic" style={{ color: '#579bfc' }}>
            "Diagnose the Enterprise. Unlock the Potential."
          </p>
        </div>
        <button
          onClick={() => navigate('/kangqore-view/admin/bids/engagements')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity flex-shrink-0"
          style={{ background: '#579bfc' }}
        >
          <Plus className="w-4 h-4" />
          New Diagnostic Assessment
        </button>
      </div>

      {/* Framework stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Diagnostic Pillars',   value: '16', bg: 'linear-gradient(135deg,#2564ea 0%,#579bfc 100%)', glow: '#2564ea' },
          { label: 'Intelligence Engines', value: '6',  bg: 'linear-gradient(135deg,#7c3aed 0%,#9d4edd 100%)', glow: '#7c3aed' },
          { label: 'Deliverables',         value: '10', bg: 'linear-gradient(135deg,#00c875 0%,#00a86b 100%)', glow: '#00c875' },
          { label: 'Industry Editions',    value: '10', bg: 'linear-gradient(135deg,#fdab3d 0%,#f59e0b 100%)', glow: '#fdab3d' },
        ].map(t => (
          <div key={t.label} className="rounded-2xl p-5 relative overflow-hidden" style={{ background: t.bg, boxShadow: `0 4px 20px ${t.glow}40` }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.30) 0%, transparent 60%)' }} />
            <p className="relative text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{t.label}</p>
            <p className="relative text-3xl font-black tracking-tight" style={{ color: '#ffffff' }}>{t.value}</p>
          </div>
        ))}
      </div>

      {/* Live engagement snapshot */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="os-card px-4 py-3 animate-pulse">
              <div className="h-7 w-8 rounded mb-1" style={{ background: 'var(--os-surface-0)' }} />
              <div className="h-3 w-24 rounded" style={{ background: 'var(--os-surface-0)' }} />
            </div>
          ))}
        </div>
      )}
      {!isLoading && stats.total > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {([
            { s: 'ACTIVE',    bg: 'linear-gradient(135deg,#00c875 0%,#00a86b 100%)', glow: '#00c875' },
            { s: 'DRAFT',     bg: 'linear-gradient(135deg,#64748b 0%,#94a3b8 100%)', glow: '#64748b' },
            { s: 'PAUSED',    bg: 'linear-gradient(135deg,#fdab3d 0%,#f59e0b 100%)', glow: '#fdab3d' },
            { s: 'COMPLETED', bg: 'linear-gradient(135deg,#2564ea 0%,#579bfc 100%)', glow: '#2564ea' },
          ] as const).map(({ s, bg, glow }) => {
            const m = STATUS_MAP[s]
            return (
              <div key={s} className="rounded-2xl p-5 relative overflow-hidden" style={{ background: bg, boxShadow: `0 4px 20px ${glow}40` }}>
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.28) 0%, transparent 60%)' }} />
                <p className="relative text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{m.label}</p>
                <p className="relative text-3xl font-black tabular-nums" style={{ color: '#ffffff' }}>{stats.byStatus?.[s] ?? 0}</p>
                <p className="relative text-[11px] mt-2" style={{ color: 'rgba(255,255,255,0.72)' }}>engagements</p>
              </div>
            )
          })}
        </div>
      )}

      {/* Recent engagements strip */}
      {!isLoading && engagements.length > 0 && (
        <div className="os-card p-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--os-text-2)' }}>Recent Engagements</p>
          <div className="space-y-1">
            {engagements.slice(0, 4).map(e => {
              const done  = (e.deliverables ?? []).filter(d => d.status === 'COMPLETE').length
              const total = (e.deliverables ?? []).length
              const pct   = total > 0 ? Math.round((done / total) * 100) : 0
              const sm    = STATUS_MAP[e.status] ?? { label: e.status, color: 'var(--os-text-2)' }
              return (
                <div key={e.id} className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-[var(--os-surface-0)] transition-colors border-b border-[var(--os-border)] last:border-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: '#579bfc18', border: '1px solid #579bfc30' }}>
                    <Building2 className="w-4 h-4" style={{ color: '#579bfc' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--os-text-1)' }}>{e.clientName}</p>
                    <p className="text-[11px]" style={{ color: 'var(--os-text-3)' }}>{e.industry}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--os-surface-0)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: '#00c875' }} />
                    </div>
                    <span className="text-[11px] tabular-nums" style={{ color: 'var(--os-text-3)' }}>{done}/{total}</span>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: sm.color + '18', color: sm.color, border: `1px solid ${sm.color}30` }}>
                    {sm.label}
                  </span>
                </div>
              )
            })}
          </div>
          {completedCount > 0 && (
            <p className="text-[11px] mt-3 pt-3 border-t border-[var(--os-border)]" style={{ color: 'var(--os-text-3)' }}>
              {completedCount} diagnostic{completedCount !== 1 ? 's' : ''} completed · {activeCount} in progress
            </p>
          )}
        </div>
      )}

      {/* 16 Pillars */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--os-text-2)' }}>
          The 16 Diagnostic Intelligence Pillars™
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PILLARS.map(p => (
            <div key={p.n} className="os-card p-4" style={{ borderLeft: `3px solid ${p.accent}` }}>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--os-text-3)' }}>Pillar {p.n}</span>
              <p className="text-sm font-semibold mt-1" style={{ color: p.accent }}>{p.name}</p>
              <p className="text-[11px] mt-1.5" style={{ color: 'var(--os-text-3)' }}>{p.score}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6 Engines */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--os-text-2)' }}>
          The 6 Intelligence Engines™
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ENGINES.map(e => (
            <div key={e.name} className="os-card p-5" style={{ borderTop: `3px solid ${e.accent}` }}>
              <p className="text-sm font-semibold" style={{ color: e.accent }}>{e.name}</p>
              <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--os-text-3)' }}>{e.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Deliverables + Industries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="os-card p-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--os-text-2)' }}>
            Standard Deliverables (every engagement)
          </p>
          <ol className="space-y-2">
            {DELIVERABLES.map((d, i) => (
              <li key={d} className="flex items-center gap-3 text-sm" style={{ color: 'var(--os-text-1)' }}>
                <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0"
                  style={{ background: '#579bfc18', color: '#579bfc' }}>
                  {i + 1}
                </span>
                {d}
              </li>
            ))}
          </ol>
        </div>

        <div className="os-card p-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--os-text-2)' }}>
            Industry Editions
          </p>
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map(ind => (
              <span key={ind} className="px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', color: 'var(--os-text-2)' }}>
                {ind}
              </span>
            ))}
          </div>
          <div className="mt-6 pt-5 border-t border-[var(--os-border)]">
            <p className="text-xs leading-relaxed" style={{ color: 'var(--os-text-3)' }}>
              Each industry edition adapts the 16 pillars and 6 engines with sector-specific benchmarks,
              regulatory contexts, and maturity thresholds — ensuring every diagnostic is precisely
              calibrated to the client's operating environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
