import { useEffect } from 'react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { useQuery } from '@tanstack/react-query'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'
import { api, isDemo } from '@lib/api'
import { useLeadsStore } from '../store'
import { LEADS, EQORE_SIGNALS } from '../data'
import type { SignalCategory } from '../types'

const CATEGORY_COLOR: Record<SignalCategory, string> = {
  intent:       '#e2445c',
  fit:          '#579bfc',
  engagement:   '#00c875',
  firmographic: '#7c3aed',
}

function ScoreRing({ score, size = 100 }: { score: number; size?: number }) {
  const color = score >= 80 ? '#00c875' : score >= 60 ? '#fdab3d' : 'var(--os-text-2)'
  const cx = size / 2, cy = size / 2
  const r = size * 0.4
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  const sw = size * 0.1
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--os-border)" strokeWidth={sw} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.5s ease' }} />
      </svg>
      <div className="absolute text-center">
        <span className="font-black text-white" style={{ fontSize: size * 0.2 }}>{score}</span>
        <p className="font-semibold uppercase tracking-wider leading-none mt-0.5" style={{ fontSize: size * 0.09, color: 'var(--os-text-2)' }}>score</p>
      </div>
    </div>
  )
}

export function ScoringPage() {
  const { leads, isLoading, signals, hydrate } = useLeadsStore()

  const { data: rawLeads } = useQuery({
    queryKey: ['leads-pipeline'],
    queryFn: () => api.get('/admin/eqore/leads').then(r => r.data.leads ?? r.data ?? []),
    staleTime: 60_000,
    enabled: !isDemo(),
  })

  useEffect(() => {
    if (isDemo()) {
      if (leads.length === 0) hydrate(LEADS)
      if (signals.length === 0) useLeadsStore.setState({ signals: EQORE_SIGNALS })
    } else if (rawLeads !== undefined && leads.length === 0) {
      hydrate(rawLeads)
    }
  }, [rawLeads, leads.length, signals.length, hydrate])

  if (isLoading && leads.length === 0) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-56 bg-[var(--os-surface-0)] rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="h-48 bg-[var(--os-surface-0)] rounded-xl animate-pulse" />
          <div className="lg:col-span-2 h-48 bg-[var(--os-surface-0)] rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-[var(--os-surface-0)] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const scoredLeads = [...leads]
    .filter(l => signals.some(s => s.leadId === l.id) || l.score > 0)
    .sort((a, b) => b.score - a.score)

  // Radar data: avg score per category across all signals
  const categories: SignalCategory[] = ['intent','fit','engagement','firmographic']
  const radarData = categories.map(cat => {
    const catSigs = signals.filter(s => s.category === cat)
    const avg     = catSigs.length ? Math.round(catSigs.reduce((s, sig) => s + sig.rawScore, 0) / catSigs.length) : 0
    return { category: cat.charAt(0).toUpperCase() + cat.slice(1), score: avg }
  })

  // Distribution buckets
  const hot     = leads.filter(l => l.score >= 80).length
  const warm    = leads.filter(l => l.score >= 60 && l.score < 80).length
  const cold    = leads.filter(l => l.score < 60).length

  const avgScore = leads.length ? Math.round(leads.reduce((s,l)=>s+l.score,0)/leads.length) : 0

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: '#579bfc' }}>
            <span className="text-white text-xs font-bold">eQ</span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">eQORE Lead Scoring</h2>
        </div>
        <p className="text-sm" style={{ color: 'var(--os-text-2)' }}>{leads.length} leads scored · AI-powered signal engine</p>
      </div>

      {/* Top summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Hot Leads',  value: hot,  color: '#00c875', sub: '80+ score' },
          { label: 'Warm Leads', value: warm, color: '#fdab3d', sub: '60–79 score' },
          { label: 'Cold Leads', value: cold, color: 'var(--os-text-2)', sub: '<60 score' },
          { label: 'Avg Score',  value: avgScore, color: '#579bfc', sub: 'across all' },
        ].map(s => (
          <div key={s.label} className="os-card p-5">
            <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--os-text-2)' }}>{s.label}</p>
            <p className="text-3xl font-black tracking-tight text-white mt-1">{s.value}</p>
            <div className="mt-2 flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
              <span className="text-[11px]" style={{ color: 'var(--os-text-2)' }}>{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Distribution + radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Score Distribution</CardTitle></CardHeader>
          <div className="space-y-4 mt-2">
            {[
              { label: 'Hot (80+)',    count: hot,  color: '#00c875', pct: leads.length ? Math.round(hot/leads.length*100)  : 0 },
              { label: 'Warm (60–79)', count: warm, color: '#fdab3d', pct: leads.length ? Math.round(warm/leads.length*100) : 0 },
              { label: 'Cold (<60)',   count: cold, color: '#579bfc', pct: leads.length ? Math.round(cold/leads.length*100) : 0 },
            ].map(d => (
              <div key={d.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-white">{d.label}</span>
                  <span className="text-xs font-bold" style={{ color: d.color }}>{d.count}</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'var(--os-border)' }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${d.pct}%`, background: d.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-[var(--os-border)] flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: 'var(--os-text-2)' }}>Average score</span>
            <span className="text-2xl font-black text-white">{avgScore}</span>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Signal Category Averages</CardTitle></CardHeader>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--os-border)" />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: 'var(--os-text-2)' }} />
              <Radar name="Score" dataKey="score" stroke="#579bfc" fill="#579bfc" fillOpacity={0.15} strokeWidth={2} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--os-border)', fontSize: 12, background: 'var(--os-card)' }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Per-lead score cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scoredLeads.map(lead => {
          const leadSigs = signals.filter(s => s.leadId === lead.id)
          const byCategory = categories.map(cat => ({
            cat,
            avg: (() => {
              const cs = leadSigs.filter(s => s.category === cat)
              return cs.length ? Math.round(cs.reduce((s,sig)=>s+sig.rawScore,0)/cs.length) : 0
            })(),
          })).filter(c => c.avg > 0)

          return (
            <Card key={lead.id}>
              <div className="flex items-start gap-4">
                <ScoreRing score={lead.score} size={90} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-white">{lead.company}</h3>
                    <Badge variant={lead.source === 'eQORE' ? 'brand' : 'neutral'} size="sm">{lead.source}</Badge>
                  </div>
                  <p className="text-xs mb-3" style={{ color: 'var(--os-text-2)' }}>{lead.contactName} · {lead.industry}</p>
                  {/* Top positives — Salesforce style */}
                  <div className="space-y-2">
                    {byCategory.map(c => (
                      <div key={c.cat} className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full capitalize text-white w-16 text-center flex-shrink-0"
                          style={{ background: CATEGORY_COLOR[c.cat] }}>
                          {c.cat.slice(0,4)}
                        </span>
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--os-border)' }}>
                          <div className="h-full rounded-full" style={{ width: `${c.avg}%`, background: c.avg >= 80 ? '#00c875' : c.avg >= 60 ? '#fdab3d' : '#579bfc' }} />
                        </div>
                        <span className="text-[10px] font-bold w-7 text-right" style={{ color: 'var(--os-text-2)' }}>{c.avg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
