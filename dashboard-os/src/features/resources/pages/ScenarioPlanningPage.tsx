import { useState, useMemo } from 'react'
import { Plus, Trash2, Lightbulb, AlertTriangle, CheckCircle2, Users } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Avatar } from '@design-system/components/Avatar'
import { Button } from '@design-system/components/Button'
import { Input } from '@design-system/components/Input'
import { Progress } from '@design-system/components/Progress'
import { Divider } from '@design-system/components/Divider'
import { cn } from '@design-system/cn'
import { useResourcesStore } from '../store'

// ─── preset scenarios ─────────────────────────────────────────────────────────

const PRESETS = [
  { label: 'Small project (8h/wk)', hoursPerWeek: 8,  duration: 12, skills: ['React', 'Node.js'] },
  { label: 'Medium project (20h/wk)', hoursPerWeek: 20, duration: 16, skills: ['React', 'Python', 'PostgreSQL'] },
  { label: 'Large project (40h/wk)', hoursPerWeek: 40, duration: 24, skills: ['Architecture', 'React', 'Node.js', 'PostgreSQL', 'CI/CD'] },
  { label: 'AI/ML engagement',       hoursPerWeek: 16, duration: 20, skills: ['Python', 'AI/ML', 'FastAPI', 'RAG'] },
]

const ALL_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'FastAPI', 'Docker',
  'AI/ML', 'RAG', 'LangChain', 'AWS', 'Kubernetes', 'CI/CD',
  'Architecture', 'Design Systems', 'Figma', 'UX Research',
  'Product Strategy', 'Agile', 'B2B Sales',
]

interface ScenarioConfig {
  name:         string
  hoursPerWeek: number
  duration:     number   // weeks
  skills:       string[]
}

const EMPTY: ScenarioConfig = { name: '', hoursPerWeek: 16, duration: 12, skills: [] }

// ─── analysis engine ──────────────────────────────────────────────────────────

function analyseScenario(team: ReturnType<typeof useResourcesStore>['team'], cfg: ScenarioConfig) {
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
      member,
      freeHours:     Math.round(freeHours * 10) / 10,
      canContribute: Math.round(canContribute * 10) / 10,
      pctOfNeeded,
      skillMatch,
      matchedSkills,
      missingSkills,
      newUtil,
      viable:        freeHours >= cfg.hoursPerWeek * 0.5 && skillMatch >= 50,
    }
  }).sort((a, b) => {
    // Sort: viable first, then by skill match desc, then by free hours desc
    if (a.viable !== b.viable) return a.viable ? -1 : 1
    if (b.skillMatch !== a.skillMatch) return b.skillMatch - a.skillMatch
    return b.freeHours - a.freeHours
  })
}

// ─── page ─────────────────────────────────────────────────────────────────────

export function ScenarioPlanningPage() {
  const { team } = useResourcesStore()
  const [cfg, setCfg]     = useState<ScenarioConfig>({ ...EMPTY })
  const [analysed, setAnalysed] = useState(false)

  const set = <K extends keyof ScenarioConfig>(k: K, v: ScenarioConfig[K]) => {
    setCfg(c => ({ ...c, [k]: v }))
    setAnalysed(false)
  }

  const toggleSkill = (skill: string) => {
    set('skills', cfg.skills.includes(skill)
      ? cfg.skills.filter(s => s !== skill)
      : [...cfg.skills, skill]
    )
  }

  const results = useMemo(() => analyseScenario(team, cfg), [team, cfg])
  const viable  = results.filter(r => r.viable)
  const totalCoverable = results.reduce((s, r) => s + r.canContribute, 0)
  const coveragePct    = cfg.hoursPerWeek > 0
    ? Math.min(100, Math.round((totalCoverable / cfg.hoursPerWeek) * 100))
    : 0

  // Missing skills — no one on team has them
  const uncoveredSkills = cfg.skills.filter(s => !team.some(m => m.skills.includes(s)))

  function applyPreset(p: typeof PRESETS[0]) {
    setCfg({ name: p.label, hoursPerWeek: p.hoursPerWeek, duration: p.duration, skills: p.skills })
    setAnalysed(false)
  }

  return (
    <div className="space-y-6">
      <KIMMPSignalBar module="Scenario Planning" />

      <div>
        <h2 className="text-xl font-bold text-slate-900">Scenario Planning</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Model a new engagement and see who can staff it — before committing.
        </p>
      </div>

      {/* Config card */}
      <Card>
        <div className="flex items-center justify-between gap-3 mb-4">
          <p className="text-sm font-semibold text-slate-700">Define scenario</p>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESETS.map(p => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Project / engagement name</label>
            <Input value={cfg.name} onChange={e => set('name', e.target.value)} placeholder="e.g. GCC Market Entry" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Hours per week needed</label>
            <Input
              type="number"
              value={cfg.hoursPerWeek}
              onChange={e => set('hoursPerWeek', Number(e.target.value))}
              min={1} max={200}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Duration (weeks)</label>
            <Input
              type="number"
              value={cfg.duration}
              onChange={e => set('duration', Number(e.target.value))}
              min={1} max={104}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2">Required skills</label>
          <div className="flex flex-wrap gap-2">
            {ALL_SKILLS.map(skill => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                  cfg.skills.includes(skill)
                    ? 'bg-[#2564ea] text-white border-[#2564ea]'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300'
                )}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="text-center py-4">
            <div className={cn('text-2xl font-bold', coveragePct >= 80 ? 'text-green-600' : coveragePct >= 50 ? 'text-amber-600' : 'text-red-600')}>
              {coveragePct}%
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Capacity coverage</div>
          </Card>
          <Card className="text-center py-4">
            <div className="text-2xl font-bold text-[#2564ea]">{viable.length}</div>
            <div className="text-xs text-slate-400 mt-0.5">Viable contributors</div>
          </Card>
          <Card className="text-center py-4">
            <div className={cn('text-2xl font-bold', uncoveredSkills.length > 0 ? 'text-red-600' : 'text-green-600')}>
              {uncoveredSkills.length}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Skill gaps</div>
          </Card>
          <Card className="text-center py-4">
            <div className="text-2xl font-bold text-slate-700">
              £{Math.round(viable.reduce((s, r) => s + r.canContribute * r.member.billableRate, 0) / 1000)}k
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Est. cost / week</div>
          </Card>
        </div>

        {/* Skill gap alert */}
        {uncoveredSkills.length > 0 && (
          <div className="flex items-start gap-2.5 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">Hiring required for these skills</p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {uncoveredSkills.map(s => <Badge key={s} variant="danger" size="sm">{s}</Badge>)}
              </div>
            </div>
          </div>
        )}

        {/* Capacity coverage bar */}
        <Card>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-500">
              Capacity coverage — {Math.round(totalCoverable * 10) / 10}h available / {cfg.hoursPerWeek}h needed per week
            </p>
            <span className={cn('text-xs font-bold', coveragePct >= 80 ? 'text-green-600' : 'text-amber-600')}>
              {coveragePct}%
            </span>
          </div>
          <Progress
            value={coveragePct}
            color={coveragePct >= 80 ? 'success' : coveragePct >= 50 ? 'warning' : 'danger'}
          />
          {coveragePct < 80 && (
            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" />
              You may need contractor support or to reduce scope to {Math.round(totalCoverable)}h/wk.
            </p>
          )}
        </Card>

        {/* Per-person breakdown */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-700">Team capacity breakdown</p>
            <p className="text-xs text-slate-400 mt-0.5">Sorted by viability — skill match + available hours</p>
          </div>
          <div className="divide-y divide-slate-50">
            {results.map(r => (
              <div key={r.member.id} className={cn('flex items-start gap-4 px-5 py-4', !r.viable && 'opacity-50')}>
                <Avatar name={r.member.name} size="sm" className="flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold text-slate-900">{r.member.name}</span>
                    <span className="text-xs text-slate-400">{r.member.role}</span>
                    {r.viable
                      ? <Badge variant="success" size="sm">Viable</Badge>
                      : <Badge variant="neutral" size="sm">Low capacity</Badge>
                    }
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-2 flex-wrap">
                    <span>{r.freeHours}h free / week</span>
                    <span>Can give {r.canContribute}h ({r.pctOfNeeded}% of need)</span>
                    <span className={cn(r.skillMatch >= 75 ? 'text-green-600' : r.skillMatch >= 50 ? 'text-amber-600' : 'text-red-600')}>
                      {r.skillMatch}% skill match
                    </span>
                  </div>
                  {cfg.skills.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {r.matchedSkills.map(s => (
                        <span key={s} className="flex items-center gap-1 text-[11px] text-green-700">
                          <CheckCircle2 className="w-3 h-3" />{s}
                        </span>
                      ))}
                      {r.missingSkills.map(s => (
                        <span key={s} className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Trash2 className="w-3 h-3" />{s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-xs font-semibold text-slate-500 mb-1">New util</div>
                  <div className={cn('text-sm font-bold', r.newUtil >= 100 ? 'text-red-600' : r.newUtil >= 85 ? 'text-amber-600' : 'text-green-600')}>
                    {r.newUtil}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
