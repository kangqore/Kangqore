import { useState } from 'react'
import { Brain, TrendingUp, TrendingDown, Minus, Award, Star, Clock, Flame, ShieldAlert, Sparkles } from 'lucide-react'
import type { DeptConfig } from '../../deptConfigs'

export interface AnalyticsKPI {
  label:   string
  value:   string
  subtext: string
  color:   string
  trend:   'up' | 'down' | 'flat'
  trendPct:string
}

export interface AgentStat {
  id:           string
  name:         string
  initials:     string
  color:        string
  resolved:     number
  avgHandle:    string
  csat:         number
  slaBreaches:  number
  trendVsLast:  'up' | 'down' | 'flat'
  kimmCoaching: string
}

export interface WeekTrend {
  label:  string
  value:  number
  target: number
}

interface Props {
  config:    DeptConfig
  kpis:      AnalyticsKPI[]
  agents:    AgentStat[]
  weekTrend: WeekTrend[]
  kimmInsight: string
}

type Period = '7d' | '30d' | '90d'

const DAYS   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS  = Array.from({ length: 24 }, (_, i) => `${i}`)

const HEATMAP_DATA = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => {
    const base = (day < 5 && hour >= 9 && hour <= 17) ? 60 + Math.random() * 40 : Math.random() * 20
    return Math.round(base)
  })
)

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'flat' }) {
  if (trend === 'up')   return <TrendingUp   className="w-3.5 h-3.5 text-emerald-400" />
  if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-red-400" />
  return <Minus className="w-3.5 h-3.5 text-[var(--os-text-2)]" />
}

const PODIUM_MEDAL = ['🥇', '🥈', '🥉']
const PODIUM_BORDER = [
  'border-amber-400/50 shadow-amber-400/10 ring-amber-400/20',
  'border-slate-300/50 shadow-slate-300/10 ring-slate-300/20',
  'border-amber-600/50 shadow-amber-600/10 ring-amber-600/20'
]

export function SharedAnalytics({ config, kpis, agents, weekTrend, kimmInsight }: Props) {
  const [period, setPeriod] = useState<Period>('30d')
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null)
  
  const accent = config.accentColor
  const sorted = [...agents].sort((a, b) => b.resolved - a.resolved)
  const maxVol = Math.max(...HEATMAP_DATA.flatMap(r => r))

  // Plot custom SVG Area Line Chart coordinates
  const svgW = 600
  const svgH = 180
  const padL = 40
  const padR = 20
  const padT = 30
  const padB = 30
  const plotW = svgW - padL - padR
  const plotH = svgH - padT - padB

  // Scale data: find min and max values
  const values = weekTrend.map(w => w.value)
  const minVal = 80 // Base percentage
  const maxVal = 100
  const valRange = maxVal - minVal

  const pts = weekTrend.map((w, i) => {
    const x = padL + (i * plotW) / (weekTrend.length - 1)
    const y = padT + plotH - ((w.value - minVal) / valRange) * plotH
    return { x, y, label: w.label, value: w.value, target: w.target }
  })

  // Line path string
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  // Area path string
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${padT + plotH} L ${pts[0].x} ${padT + plotH} Z`
  
  // Target value line (constant 92%)
  const targetY = padT + plotH - ((92 - minVal) / valRange) * plotH

  // CSAT circular ring config
  const csatKpi = kpis.find(k => k.label.includes('CSAT'))
  const csatValue = csatKpi ? parseFloat(csatKpi.value) : 4.6
  const csatPct = csatValue / 5
  const ringR = 34
  const ringC = 2 * Math.PI * ringR
  const ringOffset = ringC * (1 - csatPct)

  return (
    <div className="space-y-8 max-w-6xl">

      {/* Header period tabs */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-white/5">
        <h2 className="text-sm font-bold text-[var(--os-text-2)] uppercase tracking-widest">Performance Dashboard</h2>
        <div className="flex gap-1 p-0.5 rounded-xl bg-slate-900/50 border border-white/10 w-fit">
          {(['7d', '30d', '90d'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                period === p ? 'bg-white/10 text-white shadow-sm' : 'text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => {
          const isCsat = k.label.includes('CSAT')
          
          if (isCsat) {
            return (
              <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl relative overflow-hidden flex items-center justify-between">
                <div className="space-y-1 z-10">
                  <p className="text-xs text-[var(--os-text-2)] font-medium uppercase tracking-wider">{k.label}</p>
                  <p className="text-2xl font-bold text-white">{k.value}</p>
                  <p className="text-[10px] text-[var(--os-text-2)] mt-0.5">{k.subtext}</p>
                </div>
                <div className="relative flex items-center justify-center flex-shrink-0 z-10 w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r={ringR} className="stroke-white/5 fill-none" strokeWidth="6" />
                    <circle 
                      cx="40" 
                      cy="40" 
                      r={ringR} 
                      className="fill-none transition-all duration-1000" 
                      stroke={k.color} 
                      strokeWidth="6" 
                      strokeDasharray={ringC}
                      strokeDashoffset={ringOffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-white leading-none">{csatValue}</span>
                    <span className="text-[8px] text-[var(--os-text-2)] font-semibold uppercase mt-0.5">Rating</span>
                  </div>
                </div>
              </div>
            )
          }

          return (
            <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-1 relative overflow-hidden">
              <p className="text-xs text-[var(--os-text-2)] font-medium uppercase tracking-wider">{k.label}</p>
              <p className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</p>
              <div className="flex items-center gap-1.5 pt-1.5">
                <TrendIcon trend={k.trend} />
                <p className="text-[10px] text-[var(--os-text-2)] font-semibold tracking-wide uppercase">{k.trendPct} trend</p>
              </div>
              <p className="text-[10px] text-[var(--os-text-2)] mt-0.5">{k.subtext}</p>
            </div>
          )
        })}
      </div>

      {/* KIMMP Coaching Insight */}
      <div className="flex items-start gap-4 p-5 rounded-2xl border bg-white/[0.01] border-white/5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none opacity-5" style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }} />
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
          <Brain className="w-5 h-5 text-violet-400" />
        </div>
        <div className="space-y-1.5 z-10">
          <p className="text-xs font-bold uppercase tracking-widest text-violet-400">KIMMP Brief & Coaching Recommendation</p>
          <p className="text-xs md:text-sm text-[var(--os-text-1)] leading-relaxed font-medium">{kimmInsight}</p>
        </div>
      </div>

      {/* Trend Area SVG Chart */}
      <div className="p-6 rounded-3xl border border-white/10 bg-slate-950/20 backdrop-blur-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[var(--os-text-2)] uppercase tracking-widest">Resolution Rate Weekly Index</h3>
          <div className="flex items-center gap-4 text-xs text-[var(--os-text-2)]">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: accent }} /> Actual Uptime</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-px border-t border-dashed border-red-500" /> Target (92%)</span>
          </div>
        </div>

        <div className="relative w-full">
          <svg className="w-full h-44 overflow-visible" viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity={0.25} />
                <stop offset="100%" stopColor={accent} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            {[80, 90, 100].map(v => {
              const y = padT + plotH - ((v - minVal) / valRange) * plotH
              return (
                <g key={v}>
                  <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="var(--os-surface-0)" strokeWidth="1" />
                  <text x={padL - 10} y={y + 4} textAnchor="end" className="text-[10px] fill-slate-600 font-mono">{v}%</text>
                </g>
              )
            })}

            {/* Target dashed line */}
            <line 
              x1={padL} y1={targetY} 
              x2={svgW - padR} y2={targetY} 
              stroke="#ef4444" 
              strokeWidth="1" 
              strokeDasharray="4 4" 
              opacity="0.8"
            />

            {/* Area path */}
            <path d={areaPath} fill="url(#area-gradient)" className="transition-all duration-500" />
            {/* Line path */}
            <path d={linePath} fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" className="transition-all duration-500" />

            {/* Value nodes */}
            {pts.map((p, idx) => {
              const isHovered = hoveredWeek === idx
              return (
                <g key={idx} onMouseEnter={() => setHoveredWeek(idx)} onMouseLeave={() => setHoveredWeek(null)} className="cursor-pointer">
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r={isHovered ? 6 : 4} 
                    fill={p.value >= p.target ? '#30d158' : '#ff9f0a'} 
                    className="transition-all duration-150" 
                    stroke="#050810"
                    strokeWidth="1.5"
                  />
                  <text 
                    x={p.x} 
                    y={padT + plotH + 18} 
                    textAnchor="middle" 
                    className="text-[10px] fill-slate-500 font-semibold"
                  >
                    {p.label}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Hover Tooltip */}
          {hoveredWeek !== null && pts[hoveredWeek] && (
            <div 
              className="absolute p-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-white text-xs shadow-xl pointer-events-none transition-all duration-200"
              style={{ 
                left: `${(pts[hoveredWeek].x / svgW) * 100}%`,
                top: `${(pts[hoveredWeek].y / svgH) * 100 - 30}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <p className="font-bold">{pts[hoveredWeek].label}</p>
              <p className="text-[10px] text-[var(--os-text-2)] mt-0.5">Value: <strong className="text-emerald-400">{pts[hoveredWeek].value}%</strong></p>
              <p className="text-[10px] text-[var(--os-text-2)]">Target: <strong>{pts[hoveredWeek].target}%</strong></p>
            </div>
          )}
        </div>
      </div>

      {/* Custom 3D Leaderboard podiums */}
      <div className="space-y-6">
        <h3 className="text-xs font-bold text-[var(--os-text-2)] uppercase tracking-widest">Agent Standings</h3>
        
        {/* Podium Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sorted.slice(0, 3).map((a, idx) => {
            // Rank order: 1st, 2nd, 3rd. But visual order is 2nd (left), 1st (center), 3rd (right)
            const orderClass = idx === 0 ? 'order-1 md:order-2 md:-translate-y-3' : idx === 1 ? 'order-2 md:order-1' : 'order-3 md:order-3'
            
            return (
              <div 
                key={a.id} 
                className={`p-5 rounded-3xl border bg-white/[0.015] flex flex-col items-center justify-between text-center transition-all duration-300 hover:scale-[1.03] hover:bg-white/[0.03] ring-1 relative ${orderClass} ${PODIUM_BORDER[idx]}`}
              >
                <div className="absolute top-4 right-4 text-lg font-bold">{PODIUM_MEDAL[idx]}</div>
                <div className="flex flex-col items-center mt-2">
                  <div className="w-12 h-12 rounded-2xl text-base font-bold flex items-center justify-center shadow-inner border border-white/5 mb-3"
                    style={{ background: `${a.color}20`, color: a.color }}>
                    {a.initials}
                  </div>
                  <h4 className="text-sm font-bold text-white">{a.name}</h4>
                  <p className="text-[10px] text-[var(--os-text-2)] uppercase tracking-wider font-semibold mt-1">CSAT: <strong className="text-emerald-400">{a.csat}%</strong></p>
                </div>
                <div className="w-full mt-6 pt-4 border-t border-white/5 flex justify-around text-xs font-mono text-[var(--os-text-2)]">
                  <div>
                    <span className="block text-[10px] text-[var(--os-text-2)]">RESOLVED</span>
                    <strong className="text-[var(--os-text-1)] text-sm" style={{ color: accent }}>{a.resolved}</strong>
                  </div>
                  <div className="w-px bg-white/5" />
                  <div>
                    <span className="block text-[10px] text-[var(--os-text-2)]">HANDLE TIME</span>
                    <strong className="text-[var(--os-text-1)] text-sm">{a.avgHandle}</strong>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Regular Leaderboard list */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/30 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  {['Rank', 'Agent', 'Resolved', 'Avg Handle', 'CSAT', 'SLA Breaches', 'KIMMP Coaching'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {sorted.map((a, i) => (
                  <tr key={a.id} className="hover:bg-white/[0.015] transition-colors">
                    <td className="px-4 py-3 font-bold text-xs text-[var(--os-text-2)] font-mono">
                      #{i + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center"
                          style={{ background: `${a.color}20`, color: a.color }}>{a.initials}</div>
                        <span className="text-xs font-bold text-white">{a.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-bold" style={{ color: accent }}>{a.resolved}</td>
                    <td className="px-4 py-3 text-xs text-[var(--os-text-1)] font-mono">{a.avgHandle}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold" style={{ color: a.csat >= 90 ? '#30d158' : a.csat >= 75 ? '#ff9f0a' : '#ff453a' }}>
                        {a.csat}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold font-mono ${a.slaBreaches > 2 ? 'text-red-400' : 'text-[var(--os-text-2)]'}`}>
                        {a.slaBreaches}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <span className="text-[11px] text-[var(--os-text-2)] line-clamp-1">{a.kimmCoaching}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="p-6 rounded-3xl border border-white/10 bg-slate-950/20 backdrop-blur-2xl space-y-4">
        <p className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider">Volume Heatmap (7×24)</p>
        <div className="overflow-x-auto">
          <div className="min-w-[600px] pr-2">
            <div className="flex gap-0.5 mb-1.5">
              <div className="w-8 flex-shrink-0" />
              {HOURS.map(h => (
                <div key={h} className="flex-1 text-center text-[9px] text-[var(--os-text-2)] font-mono"
                  style={{ opacity: parseInt(h) % 3 === 0 ? 1 : 0.3 }}>
                  {h}
                </div>
              ))}
            </div>
            {HEATMAP_DATA.map((row, day) => (
              <div key={day} className="flex items-center gap-0.5 mb-0.5">
                <div className="w-8 flex-shrink-0 text-[10px] text-[var(--os-text-2)] font-semibold pr-1.5 text-right">{DAYS[day]}</div>
                {row.map((val, hour) => {
                  const intensity = val / maxVol
                  return (
                    <div
                      key={hour}
                      className="flex-1 h-3.5 rounded-sm hover:scale-[1.1] transition-transform cursor-pointer"
                      style={{ 
                        background: intensity > 0.05 ? `${accent}${Math.round(intensity * 255).toString(16).padStart(2, '0')}` : 'var(--os-surface-0)',
                        border: intensity > 0.05 ? 'none' : '1px solid rgba(255,255,255,0.01)'
                      }}
                      title={`${DAYS[day]} ${hour}:00 — ${val} tickets`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
