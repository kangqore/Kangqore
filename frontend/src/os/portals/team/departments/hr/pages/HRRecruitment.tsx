import { useState } from 'react'
import { UserPlus } from 'lucide-react'

type Stage = 'SOURCING' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'CLOSED'

const JOBS = [
  {
    id: 'JOB-018', title: 'Senior Backend Engineer', dept: 'Engineering', level: 'Senior', openedDays: 94, candidates: [
      { name: 'Ananya B.',  stage: 'OFFER'     as Stage, notes: 'Offer accepted — verbal' },
      { name: 'Vikram S.', stage: 'INTERVIEW'  as Stage, notes: 'Final round Fri' },
    ]
  },
  {
    id: 'JOB-019', title: 'DevOps Engineer', dept: 'Engineering', level: 'Mid', openedDays: 61, candidates: [
      { name: 'Ravi P.',   stage: 'SCREENING'  as Stage, notes: 'Technical screen Mon' },
      { name: 'Preethi K.',stage: 'SOURCING'   as Stage, notes: 'Reached out via LinkedIn' },
    ]
  },
  {
    id: 'JOB-020', title: 'Product Designer', dept: 'Product & Design', level: 'Mid', openedDays: 28, candidates: [
      { name: 'Meera N.',  stage: 'INTERVIEW'  as Stage, notes: 'Portfolio review Thu' },
      { name: 'Samir T.', stage: 'INTERVIEW'  as Stage, notes: 'First round complete' },
      { name: 'Leila M.', stage: 'SCREENING'  as Stage, notes: 'CV shortlisted' },
    ]
  },
  {
    id: 'JOB-021', title: 'Customer Success Manager', dept: 'Customer Support', level: 'Senior', openedDays: 14, candidates: [
      { name: 'Deepa R.',  stage: 'SOURCING'  as Stage, notes: '3 candidates in pipeline' },
    ]
  },
]

const STAGE_COLOR: Record<Stage, string> = {
  SOURCING:  '#6B7280',
  SCREENING: '#8B5CF6',
  INTERVIEW: '#F59E0B',
  OFFER:     '#10B981',
  CLOSED:    'var(--os-text-2)',
}

const STAGES: Stage[] = ['SOURCING', 'SCREENING', 'INTERVIEW', 'OFFER', 'CLOSED']

export function HRRecruitment() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          <UserPlus className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Recruitment</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Open roles, candidate pipelines, and stage tracking.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Open Roles',         value: JOBS.length.toString(), color: '#8B5CF6' },
          { label: 'Total Candidates',   value: JOBS.reduce((s, j) => s + j.candidates.length, 0).toString(), color: '#F59E0B' },
          { label: 'Offers Extended',    value: '1',   color: '#10B981' },
          { label: 'Avg Days Open',      value: Math.round(JOBS.reduce((s, j) => s + j.openedDays, 0) / JOBS.length) + 'd', color: '#EF4444' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Jobs */}
      <div className="space-y-3">
        {JOBS.map(job => (
          <div key={job.id} className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
            <button
              className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.02] transition-colors"
              onClick={() => setExpanded(expanded === job.id ? null : job.id)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{job.title}</p>
                <p className="text-xs text-[var(--os-text-2)] mt-0.5">{job.id} · {job.dept} · {job.level} · Open {job.openedDays} days</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {STAGES.slice(0, 4).map(s => {
                  const count = job.candidates.filter(c => c.stage === s).length
                  return count > 0 ? (
                    <span key={s} className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${STAGE_COLOR[s]}22`, color: STAGE_COLOR[s] }}>
                      {s.toLowerCase()}: {count}
                    </span>
                  ) : null
                })}
              </div>
            </button>
            {expanded === job.id && (
              <div className="px-4 pb-4 pt-0 border-t border-white/10">
                <div className="mt-3 space-y-2">
                  {job.candidates.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-white/[0.05] last:border-0">
                      <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] font-bold text-purple-300 flex-shrink-0">
                        {c.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="flex-1 text-sm text-[var(--os-text-1)]">{c.name}</span>
                      <span className="text-xs text-[var(--os-text-2)]">{c.notes}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${STAGE_COLOR[c.stage]}22`, color: STAGE_COLOR[c.stage] }}>
                        {c.stage}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
