import { useState, useMemo } from 'react'
import { Trash2, Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { Avatar } from '@design-system/components/Avatar'
import { Input } from '@design-system/components/Input'
import { cn } from '@design-system/cn'
import { useResourcesStore } from '../store'
import type { TeamMember } from '../types'

const PRESETS = [
  { label: 'Small project (8h/wk)',   hoursPerWeek: 8,  duration: 12, skills: ['React', 'Node.js'] },
  { label: 'Medium project (20h/wk)', hoursPerWeek: 20, duration: 16, skills: ['React', 'Python', 'PostgreSQL'] },
  { label: 'Large project (40h/wk)',  hoursPerWeek: 40, duration: 24, skills: ['Architecture', 'React', 'Node.js', 'PostgreSQL', 'CI/CD'] },
  { label: 'AI/ML engagement',        hoursPerWeek: 16, duration: 20, skills: ['Python', 'AI/ML', 'FastAPI', 'RAG'] },
]

const FALLBACK_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'FastAPI', 'Docker',
  'AI/ML', 'RAG', 'LangChain', 'AWS', 'Kubernetes', 'CI/CD',
  'Architecture', 'Design Systems', 'Figma', 'UX Research',
  'Product Strategy', 'Agile', 'B2B Sales',
]

interface ScenarioConfig {
  name:         string
  hoursPerWeek: number
  duration:     number
  skills:       string[]
}

const EMPTY: ScenarioConfig = { name: '', hoursPerWeek: 16, duration: 12, skills: [] }

function analyseScenario(team: TeamMember[], cfg: ScenarioConfig) {
  const neededSkills = cfg.skills
  return team.map(member => {
    const freeHours     = member.availability * (1 - member.utilization / 100)
    const canContribute = Math.min(freeHours, cfg.hoursPerWeek)
    const pctOfNeeded   = cfg.hoursPerWeek > 0 ? Math.round((canContribute / cfg.hoursPerWeek) * 100) : 0
    const skillMatch    = neededSkills.length === 0
      ? 100
      : Math.round((neededSkills.filter(s => member.skills.includes(s)).length / neededSkills.length) * 100)
    const matchedSkills = neededSkills.filter(s => member.skills.includes(s))
    const missingSkills = neededSkills.filter(s => !member.skills.includes(s))
    const newUtil       = Math.min(100, member.utilization + Math.round((canContribute / member.availability) * 100))
    return {
      member, freeHours: Math.round(freeHours * 10) / 10, canContribute: Math.round(canContribute * 10) / 10,
      pctOfNeeded, skillMatch, matchedSkills, missingSkills, newUtil,
      viable: freeHours >= cfg.hoursPerWeek * 0.5 && skillMatch >= 50,
    }
  }).sort((a, b) => {
    if (a.viable !== b.viable) return a.viable ? -1 : 1
    if (b.skillMatch !== a.skillMatch) return b.skillMatch - a.skillMatch
    return b.freeHours - a.freeHours
  })
}

export function ScenarioPlanningPage() {
  const { team, allSkills } = useResourcesStore()
  const ALL_SKILLS = allSkills().length > 0 ? allSkills() : FALLBACK_SKILLS
  const [cfg, setCfg] = useState<ScenarioConfig>({ ...EMPTY })

  const set = <K extends keyof ScenarioConfig>(k: K, v: ScenarioConfig[K]) => {
    setCfg(c => ({ ...c, [k]: v }))
  }

  const toggleSkill = (skill: string) => {
    set('skills', cfg.skills.includes(skill)
      ? cfg.skills.filter(s => s !== skill)
      : [...cfg.skills, skill]
    )
  }

  const results          = useMemo(() => analyseScenario(team, cfg), [team, cfg])
  const viable           = results.filter(r => r.viable)
  const totalCoverable   = results.reduce((s, r) => s + r.canContribute, 0)
  const coveragePct      = cfg.hoursPerWeek > 0 ? Math.min(100, Math.round((totalCoverable / cfg.hoursPerWeek) * 100)) : 0
  const uncoveredSkills  = cfg.skills.filter(s => !team.some(m => m.skills.includes(s)))
  const coverageColor    = coveragePct >= 80 ? '#00c875' : coveragePct >= 50 ? '#fdab3d' : '#e2445c'

  function applyPreset(p: typeof PRESETS[0]) {
    setCfg({ name: p.label, hoursPerWeek: p.hoursPerWeek, duration: p.duration, skills: p.skills })
  }

  return (
    <div className="space-y-6">
      <KIMMPSignalBar module="Scenario Planning" />

      {/* Header */}
      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Scenario Planning</h2>
        <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: 'var(--os-text-2)' }}>
          Model a new engagement and see who can staff it — before committing.
        </p>
      </div>

      {/* Config card */}
      <div className="os-card p-5">
        <div className="flex items-center justify-between gap-3 mb-5">
          <p className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>Define scenario</p>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESETS.map(p => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                className="px-2.5 py-1 text-[11px] font-bold rounded-full transition-all"
                style={{ background: 'var(--os-surface-0)', color: 'var(--os-text-2)', border: '1px solid var(--os-border)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#579bfc20'
                  ;(e.currentTarget as HTMLButtonElement).style.color = '#579bfc'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--os-surface-0)'
                  ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--os-text-2)'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold mb-1.5" style={{ color: 'var(--os-text-2)' }}>
              Project / engagement name
            </label>
            <Input value={cfg.name} onChange={e => set('name', e.target.value)} placeholder="e.g. GCC Market Entry" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold mb-1.5" style={{ color: 'var(--os-text-2)' }}>
              Hours per week needed
            </label>
            <Input type="number" value={cfg.hoursPerWeek} onChange={e => set('hoursPerWeek', Number(e.target.value))} min={1} max={200} />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold mb-1.5" style={{ color: 'var(--os-text-2)' }}>
              Duration (weeks)
            </label>
            <Input type="number" value={cfg.duration} onChange={e => set('duration', Number(e.target.value))} min={1} max={104} />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--os-text-2)' }}>
            Required skills
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_SKILLS.map(skill => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className="px-3 py-1.5 text-xs font-bold rounded-full transition-all"
                style={cfg.skills.includes(skill)
                  ? { background: '#579bfc', color: '#fff' }
                  : { background: 'var(--os-surface-0)', color: 'var(--os-text-2)', border: '1px solid var(--os-border)' }
                }
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Capacity coverage',  value: `${coveragePct}%`,                                                      accent: coverageColor },
            { label: 'Viable contributors', value: viable.length,                                                          accent: '#579bfc'    },
            { label: 'Skill gaps',          value: uncoveredSkills.length,                                                 accent: uncoveredSkills.length > 0 ? '#e2445c' : '#00c875' },
            { label: 'Est. cost / week',    value: `₹${Math.round(viable.reduce((s, r) => s + r.canContribute * r.member.billableRate, 0) / 1000)}k`, accent: 'var(--os-text-1)' },
          ].map(c => (
            <div key={c.label} className="os-card p-5 text-center">
              <p className="text-3xl font-black tracking-tight mb-1" style={{ color: c.accent }}>{c.value}</p>
              <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--os-text-2)' }}>{c.label}</p>
            </div>
          ))}
        </div>

        {/* Skill gap alert */}
        {uncoveredSkills.length > 0 && (
          <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: '#e2445c10', border: '1px solid #e2445c40' }}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#e2445c' }} />
            <div>
              <p className="text-sm font-bold mb-1.5" style={{ color: '#e2445c' }}>Hiring required for these skills</p>
              <div className="flex flex-wrap gap-1.5">
                {uncoveredSkills.map(s => (
                  <span key={s} className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: '#e2445c20', color: '#e2445c' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Capacity coverage bar */}
        <div className="os-card p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold" style={{ color: 'var(--os-text-2)' }}>
              Capacity coverage — {Math.round(totalCoverable * 10) / 10}h available / {cfg.hoursPerWeek}h needed per week
            </p>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: coverageColor + '20', color: coverageColor }}>
              {coveragePct}%
            </span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: 'var(--os-surface-0)' }}>
            <div
              className="h-1.5 rounded-full transition-all"
              style={{ width: `${coveragePct}%`, background: coverageColor }}
            />
          </div>
          {coveragePct < 80 && (
            <p className="text-xs mt-2 flex items-center gap-1.5" style={{ color: '#fdab3d' }}>
              <Lightbulb className="w-3.5 h-3.5" />
              You may need contractor support or to reduce scope to {Math.round(totalCoverable)}h/wk.
            </p>
          )}
        </div>

        {/* Per-person breakdown */}
        <div className="os-card" style={{ padding: 0 }}>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--os-border)' }}>
            <p className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>Team capacity breakdown</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--os-text-2)' }}>Sorted by viability — skill match + available hours</p>
          </div>
          <div>
            {results.map(r => {
              const newUtilColor = r.newUtil >= 100 ? '#e2445c' : r.newUtil >= 85 ? '#fdab3d' : '#00c875'
              return (
                <div
                  key={r.member.id}
                  className="flex items-start gap-4 px-5 py-4 transition-colors"
                  style={{
                    borderBottom: '1px solid var(--os-border)',
                    opacity: r.viable ? 1 : 0.45,
                  }}
                >
                  <Avatar name={r.member.name} size="sm" className="flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>{r.member.name}</span>
                      <span className="text-xs" style={{ color: 'var(--os-text-2)' }}>{r.member.role}</span>
                      <span
                        className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                        style={r.viable
                          ? { background: '#00c87520', color: '#00c875' }
                          : { background: 'var(--os-surface-0)', color: 'var(--os-text-2)' }
                        }
                      >
                        {r.viable ? 'Viable' : 'Low capacity'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs mb-2 flex-wrap" style={{ color: 'var(--os-text-2)' }}>
                      <span>{r.freeHours}h free / week</span>
                      <span>Can give {r.canContribute}h ({r.pctOfNeeded}% of need)</span>
                      <span style={{ color: r.skillMatch >= 75 ? '#00c875' : r.skillMatch >= 50 ? '#fdab3d' : '#e2445c', fontWeight: 600 }}>
                        {r.skillMatch}% skill match
                      </span>
                    </div>
                    {cfg.skills.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {r.matchedSkills.map(s => (
                          <span key={s} className="flex items-center gap-1 text-[11px]" style={{ color: '#00c875' }}>
                            <CheckCircle2 className="w-3 h-3" />{s}
                          </span>
                        ))}
                        {r.missingSkills.map(s => (
                          <span key={s} className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--os-text-2)' }}>
                            <Trash2 className="w-3 h-3" />{s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'var(--os-text-2)' }}>New util</div>
                    <div className="text-sm font-black" style={{ color: newUtilColor }}>{r.newUtil}%</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
