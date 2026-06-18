import { Avatar } from '@design-system/components/Avatar'
import { Badge } from '@design-system/components/Badge'
import { useCareersStore } from '../store'
import type { CandidateStage } from '../types'

const STAGES: { id: CandidateStage; label: string; color: string }[] = [
  { id: 'applied',   label: 'Applied',   color: '#94a3b8' },
  { id: 'screening', label: 'Screening', color: '#3b82f6' },
  { id: 'technical', label: 'Technical', color: '#8b5cf6' },
  { id: 'final',     label: 'Final',     color: '#f59e0b' },
  { id: 'offer',     label: 'Offer',     color: '#22c55e' },
  { id: 'hired',     label: 'Hired',     color: '#16a34a' },
]

const SOURCE_LABEL: Record<string, string> = {
  linkedin: 'LinkedIn', referral: 'Referral', 'careers-page': 'Careers Page',
  agency: 'Agency', direct: 'Direct',
}

export function PipelinePage() {
  const { roles, candidates, selectedRoleId, setSelectedRole } = useCareersStore()
  const filtered = candidates.filter(c => c.roleId === selectedRoleId && c.stage !== 'rejected')
  const role = roles.find(r => r.id === selectedRoleId)

  return (
    <div className="space-y-5">
      {/* Role selector */}
      <div className="flex gap-2 flex-wrap">
        {roles.filter(r => r.status !== 'on-hold').map(r => (
          <button
            key={r.id}
            onClick={() => setSelectedRole(r.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              r.id === selectedRoleId
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-os-s1 text-slate-300 border-os-border hover:border-blue-300'
            }`}
          >
            {r.title}
          </button>
        ))}
      </div>

      {role && (
        <p className="text-sm text-slate-500">
          {role.title} · {role.location} · {filtered.length} active candidates
        </p>
      )}

      {/* Kanban pipeline */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[900px]">
          {STAGES.map(stage => {
            const stageCandidates = filtered.filter(c => c.stage === stage.id)
            return (
              <div key={stage.id} className="flex-1 min-w-[160px]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{stage.label}</span>
                  <span className="ml-auto text-xs bg-os-s1 text-slate-300 rounded-full px-1.5 py-0.5">
                    {stageCandidates.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {stageCandidates.map(c => (
                    <div key={c.id} className="bg-os-s1 border border-os-border rounded-xl p-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar name={c.name} size="xs" />
                        <p className="text-sm font-medium text-white truncate">{c.name}</p>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{c.location}</p>
                      {c.cvScore && (
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-slate-500">KIMMP Score</span>
                          <span className={`text-xs font-bold ${c.cvScore >= 80 ? 'text-green-600' : c.cvScore >= 65 ? 'text-orange-600' : 'text-slate-500'}`}>
                            {c.cvScore}/100
                          </span>
                        </div>
                      )}
                      <div className="flex gap-1 flex-wrap">
                        <Badge variant="neutral" size="sm">{SOURCE_LABEL[c.source]}</Badge>
                        {c.tags.slice(0, 1).map(t => (
                          <Badge key={t} variant="neutral" size="sm">{t}</Badge>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 mt-2">{c.lastActivity}</p>
                    </div>
                  ))}
                  {stageCandidates.length === 0 && (
                    <div className="border-2 border-dashed border-os-border rounded-xl p-4 text-center">
                      <p className="text-xs text-slate-500">No candidates</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
