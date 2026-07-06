import { useState } from 'react'
import { Brain, TrendingUp } from 'lucide-react'
import type { DeptConfig } from '../../deptConfigs'

export interface SkillEntry {
  id:       string
  name:     string
  category: string
  experts:  number
  mid:      number
  beginners:number
  demand:   number
}

export interface MemberSkill {
  memberId: string
  name:     string
  level:    'EXPERT' | 'INTERMEDIATE' | 'BEGINNER'
}

export interface SkillMember {
  id:       string
  name:     string
  initials: string
  role:     string
  color:    string
  skills:   MemberSkill[]
  kimmLine: string
}

interface Props {
  config:  DeptConfig
  skills:  SkillEntry[]
  members: SkillMember[]
}

const L_COLOR = { EXPERT: '#10B981', INTERMEDIATE: '#F59E0B', BEGINNER: 'var(--os-text-2)' }
const L_LABEL = { EXPERT: 'Expert', INTERMEDIATE: 'Mid', BEGINNER: 'Beginner' }

export function SharedSkills({ config, skills, members }: Props) {
  const [tab, setTab] = useState<'catalog' | 'members' | 'gaps'>('catalog')
  const accent = config.accentColor

  const cats = Array.from(new Set(skills.map(s => s.category)))
  const totalExperts  = skills.reduce((s, e) => s + e.experts, 0)
  const totalGaps     = skills.filter(s => s.experts === 0).length
  const coveredSkills = skills.filter(s => s.experts > 0).length

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Skills',     value: skills.length.toString(),     color: accent },
          { label: 'Fully Covered',    value: coveredSkills.toString(),      color: '#10B981' },
          { label: 'Gaps',             value: totalGaps.toString(),          color: totalGaps > 0 ? '#EF4444' : '#10B981' },
          { label: 'Members Profiled', value: members.length.toString(),     color: '#6366F1' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-xs text-[var(--os-text-2)] font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Tab selector */}
      <div className="flex gap-1 p-1 rounded-xl bg-slate-900/50 border border-white/10 w-fit">
        {([
          { id: 'catalog', label: 'Skills Catalog' },
          { id: 'members', label: 'Member Cards' },
          { id: 'gaps',    label: 'Gap Analysis' },
        ] as const).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-4 py-2 rounded-lg text-xs font-semibold transition-all"
            style={tab === t.id ? { background: accent, color: '#fff' } : { color: 'var(--os-text-2)' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Catalog */}
      {tab === 'catalog' && (
        <div className="space-y-2">
          {cats.map(cat => (
            <div key={cat}>
              <p className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider mb-2 mt-4">{cat}</p>
              <div className="rounded-2xl border border-white/10 bg-slate-900/30 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      {['Skill', 'Expert', 'Intermediate', 'Beginner', 'Demand', 'Gap'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {skills.filter(s => s.category === cat).map(s => {
                      const gap = s.experts === 0 && s.demand > 0
                      return (
                        <tr key={s.id} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02]">
                          <td className="px-4 py-3 text-sm font-medium text-white">{s.name}</td>
                          <td className="px-4 py-3">
                            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md" style={{ background: '#10B98120', color: '#10B981' }}>
                              {s.experts}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md" style={{ background: '#F59E0B20', color: '#F59E0B' }}>
                              {s.mid}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-[var(--os-text-2)]">{s.beginners}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${Math.min(100, s.demand * 10)}%`, background: accent }} />
                              </div>
                              <span className="text-xs text-[var(--os-text-2)]">{s.demand}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {gap
                              ? <span className="text-xs font-semibold text-red-400 px-1.5 py-0.5 rounded-md bg-red-500/10">Gap</span>
                              : <span className="text-xs text-emerald-500">✓</span>}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Member Cards */}
      {tab === 'members' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map(m => (
            <div key={m.id} className="p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: `${m.color}25`, color: m.color }}>
                  {m.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{m.name}</p>
                  <p className="text-xs text-[var(--os-text-2)]">{m.role}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {m.skills.map(sk => (
                  <span
                    key={sk.name}
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${L_COLOR[sk.level]}18`, color: L_COLOR[sk.level] }}
                  >
                    {sk.name} · {L_LABEL[sk.level]}
                  </span>
                ))}
              </div>
              <div className="flex items-start gap-1.5 p-2.5 rounded-xl border" style={{ background: `${accent}08`, borderColor: `${accent}25` }}>
                <Brain className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: accent }} />
                <p className="text-xs text-[var(--os-text-1)] leading-relaxed">{m.kimmLine}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gap Analysis */}
      {tab === 'gaps' && (
        <div className="space-y-4">
          <p className="text-xs text-[var(--os-text-2)]">Demand vs. Expert coverage per category</p>
          {cats.map(cat => {
            const catSkills = skills.filter(s => s.category === cat)
            const demand    = catSkills.reduce((s, e) => s + e.demand, 0)
            const coverage  = catSkills.reduce((s, e) => s + e.experts, 0)
            const pct       = demand > 0 ? Math.min(100, Math.round((coverage / demand) * 100)) : 100
            const ok        = pct >= 80
            return (
              <div key={cat} className="p-4 rounded-2xl border border-white/10 bg-slate-900/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-white">{cat}</p>
                  <span className="text-xs font-bold" style={{ color: ok ? '#10B981' : '#EF4444' }}>{pct}% covered</span>
                </div>
                <div className="flex gap-3 mb-3">
                  <div className="flex-1">
                    <p className="text-xs text-[var(--os-text-2)] mb-1">Demand</p>
                    <div className="h-2 rounded-full bg-slate-700/60">
                      <div className="h-full rounded-full bg-slate-500" style={{ width: '100%' }} />
                    </div>
                    <p className="text-xs text-[var(--os-text-2)] mt-1">{demand} items/wk</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-[var(--os-text-2)] mb-1">Expert Coverage</p>
                    <div className="h-2 rounded-full bg-slate-700/60">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: ok ? '#10B981' : '#EF4444' }} />
                    </div>
                    <p className="text-xs text-[var(--os-text-2)] mt-1">{coverage} experts</p>
                  </div>
                </div>
                {!ok && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-red-400" />
                    <p className="text-xs text-red-400">
                      {catSkills.filter(s => s.experts === 0).map(s => s.name).join(', ')} — no expert coverage
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
