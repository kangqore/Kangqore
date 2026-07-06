import { TrendingUp } from 'lucide-react'

const ACCENT = '#0EA5E9'

interface RepTarget {
  id:       string
  name:     string
  initials: string
  color:    string
  role:     string
  target:   string
  achieved: string
  unit:     string
  pct:      number
}

const REPS: RepTarget[] = [
  { id: 'r1', name: 'Arjun Shah',    initials: 'AS', color: '#0EA5E9', role: 'Account Executive', target: '£380k', achieved: '£320k', unit: '£',   pct: 84 },
  { id: 'r2', name: 'Meera Nair',    initials: 'MN', color: '#8B5CF6', role: 'Account Executive', target: '£340k', achieved: '£260k', unit: '£',   pct: 76 },
  { id: 'r3', name: 'Dev Patel',     initials: 'DP', color: '#10B981', role: 'Account Executive', target: '£240k', achieved: '£160k', unit: '£',   pct: 67 },
  { id: 'r4', name: 'Priya Kapoor',  initials: 'PK', color: '#F59E0B', role: 'SDR',               target: '40 SQLs', achieved: '29',  unit: 'SQLs',pct: 72 },
]

function attainmentColor(pct: number): string {
  if (pct >= 85) return '#10B981'
  if (pct >= 70) return '#F59E0B'
  return '#EF4444'
}

export function SalesTargets() {
  const overallPct = 78

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <TrendingUp size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Targets</h1>
          <p className="text-sm text-[var(--os-text-2)]">Q2 quota attainment — individual rep progress vs target</p>
        </div>
      </div>

      {/* Overall Q2 */}
      <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[var(--os-text-2)] text-sm font-medium">Q2 Overall Attainment</p>
            <p className="text-4xl font-bold text-white mt-1">{overallPct}%</p>
            <p className="text-[var(--os-text-2)] text-xs mt-1">£840k of £1.08M target</p>
          </div>
          <div className="text-right">
            <p className="text-[var(--os-text-2)] text-xs">Remaining to target</p>
            <p className="text-xl font-bold text-amber-400 mt-1">£240k</p>
            <p className="text-[var(--os-text-2)] text-xs mt-0.5">8 days to Q2 close</p>
          </div>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${overallPct}%`, background: attainmentColor(overallPct) }}
          />
        </div>
      </div>

      {/* KIMMP Insight */}
      <div className="flex items-start gap-3 p-4 rounded-2xl border border-sky-500/30 bg-sky-500/10">
        <div className="w-6 h-6 rounded-full bg-sky-500/30 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-xs font-bold text-sky-400">K</span>
        </div>
        <p className="text-sm text-sky-300">
          <span className="font-semibold">KIMMP:</span> Dev Patel is 33% behind target. Last 3 deals lost on pricing — recommend a pricing flexibility conversation before next proposal.
        </p>
      </div>

      {/* Rep Targets */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-[var(--os-text-2)] uppercase tracking-wider">Individual Attainment</h2>
        {REPS.map(rep => {
          const ac = attainmentColor(rep.pct)
          return (
            <div key={rep.id} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: `${rep.color}33` }}>
                  {rep.initials}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">{rep.name}</p>
                  <p className="text-xs text-[var(--os-text-2)]">{rep.role}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-[var(--os-text-2)]">Achieved / Target</p>
                  <p className="text-sm font-bold text-white mt-0.5">{rep.achieved} / {rep.target}</p>
                </div>
                <div className="w-14 text-right shrink-0">
                  <p className="text-2xl font-bold" style={{ color: ac }}>{rep.pct}%</p>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${Math.min(rep.pct, 100)}%`, background: ac }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
