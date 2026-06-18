import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'
import { useLeadsStore } from '../store'
import type { SignalCategory } from '../types'

const CATEGORY_COLOR: Record<SignalCategory, string> = {
  intent:       'bg-red-100   text-red-600',
  fit:          'bg-[#2564ea]/10 text-[#2564ea]',
  engagement:   'bg-green-100 text-green-600',
  firmographic: 'bg-[#151C2F] text-slate-300',
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#94a3b8'
  const r = 40, circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <div className="relative flex items-center justify-center">
      <svg width={100} height={100} className="-rotate-90">
        <circle cx={50} cy={50} r={r} fill="none" stroke="#f1f3f7" strokeWidth={10} />
        <circle cx={50} cy={50} r={r} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.5s ease' }} />
      </svg>
      <div className="absolute text-center">
        <span className="text-xl font-bold text-white">{score}</span>
        <p className="text-[9px] text-slate-500 leading-none mt-0.5">score</p>
      </div>
    </div>
  )
}

export function ScoringPage() {
  const { leads, signals } = useLeadsStore()

  const scoredLeads = [...leads]
    .filter(l => signals.some(s => s.leadId === l.id))
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

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#2564ea] to-[#4ab6d4] flex items-center justify-center">
            <span className="text-white text-xs font-bold">eQ</span>
          </div>
          <h2 className="text-xl font-bold text-white">eQORE Lead Scoring</h2>
        </div>
        <p className="text-sm text-slate-500">{leads.length} leads scored · AI-powered signal engine</p>
      </div>

      {/* Distribution + radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardHeader><CardTitle>Score Distribution</CardTitle></CardHeader>
          <div className="space-y-3">
            {[
              { label: '🔥 Hot (80+)',    count: hot,  color: 'success', pct: Math.round(hot/leads.length*100) },
              { label: '🌡 Warm (60–79)', count: warm, color: 'warning', pct: Math.round(warm/leads.length*100) },
              { label: '❄ Cold (<60)',    count: cold, color: 'brand',   pct: Math.round(cold/leads.length*100) },
            ].map(d => (
              <div key={d.label} className="flex items-center gap-3">
                <span className="text-sm w-28 text-left text-slate-300">{d.label}</span>
                <Progress value={d.pct} size="sm" color={d.color as 'success'|'warning'|'brand'} className="flex-1" />
                <span className="text-sm font-bold text-slate-200 w-6">{d.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[#2E2854] text-xs text-slate-500">
            Avg score: <span className="font-bold text-slate-300">{Math.round(leads.reduce((s,l)=>s+l.score,0)/leads.length)}</span>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Signal Category Averages</CardTitle></CardHeader>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e4e8f0" />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: '#4b5368' }} />
              <Radar name="Score" dataKey="score" stroke="#2564ea" fill="#2564ea" fillOpacity={0.15} strokeWidth={2} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e4e8f0', fontSize: 12 }} />
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
                <ScoreRing score={lead.score} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-white">{lead.company}</h3>
                    <Badge variant={lead.source === 'eQORE' ? 'brand' : 'neutral'} size="sm">{lead.source}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{lead.contactName} · {lead.industry}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {byCategory.map(c => (
                      <div key={c.cat} className="flex items-center gap-2">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded capitalize ${CATEGORY_COLOR[c.cat]}`}>{c.cat.slice(0,3)}</span>
                        <Progress value={c.avg} size="sm" color={c.avg >= 80 ? 'success' : c.avg >= 60 ? 'warning' : 'brand'} className="flex-1" />
                        <span className="text-[10px] font-bold text-slate-500 w-6">{c.avg}</span>
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
