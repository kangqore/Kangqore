import { useState } from 'react'
import { Search, CheckCircle2, Circle, AlertCircle } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { Avatar } from '@design-system/components/Avatar'
import { Input } from '@design-system/components/Input'
import { cn } from '@design-system/cn'
import { useResourcesStore } from '../store'

const SKILL_GROUPS: { label: string; skills: string[] }[] = [
  { label: 'Frontend',           skills: ['React', 'TypeScript', 'Design Systems', 'Figma', 'Prototyping'] },
  { label: 'Backend',            skills: ['Node.js', 'Python', 'PostgreSQL', 'FastAPI', 'Docker'] },
  { label: 'AI / Data',          skills: ['AI/ML', 'ML', 'LangChain', 'RAG', 'Pinecone', 'Analytics'] },
  { label: 'Infrastructure',     skills: ['AWS', 'Terraform', 'Kubernetes', 'CI/CD', 'Monitoring'] },
  { label: 'Product & Strategy', skills: ['Product Strategy', 'Roadmapping', 'Agile', 'Architecture', 'Strategy'] },
  { label: 'Design & Research',  skills: ['UX Research', 'JIRA'] },
  { label: 'Business',           skills: ['B2B Sales', 'CRM', 'Proposal Writing', 'Negotiation', 'Financial Modelling'] },
]

// All skills the organisation considers part of its desired capability set
const DESIRED_SKILLS = SKILL_GROUPS.flatMap(g => g.skills)

export function SkillsMatrixPage() {
  const { team } = useResourcesStore()
  const [search, setSearch]         = useState('')
  const [filterSkill, setFilterSkill] = useState<string | null>(null)

  const allSkills = [...new Set(team.flatMap(m => m.skills))].sort()

  // Desired skills with ≤1 team member — single-point-of-failure or completely absent
  const SKILL_GAPS = team.length > 0
    ? DESIRED_SKILLS.filter(s => team.filter(m => m.skills.includes(s)).length <= 1)
    : []

  const filteredTeam = filterSkill
    ? team.filter(m => m.skills.includes(filterSkill))
    : team

  const searchedTeam = search
    ? filteredTeam.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.role.toLowerCase().includes(search.toLowerCase())
      )
    : filteredTeam

  const totalSkills        = allSkills.length
  const coveredSkills      = allSkills.filter(s => team.some(m => m.skills.includes(s))).length
  const gapSkills          = SKILL_GAPS.filter(s => team.filter(m => m.skills.includes(s)).length <= 1).length
  const avgSkillsPerPerson = team.length > 0 ? Math.round(team.reduce((s, m) => s + m.skills.length, 0) / team.length) : 0

  const statCards = [
    { label: 'Total Skills',       value: totalSkills,         accent: '#579bfc' },
    { label: 'Avg per Person',     value: avgSkillsPerPerson,  accent: '#00c875' },
    { label: 'Single Point Risk',  value: gapSkills,           accent: gapSkills > 0 ? '#fdab3d' : '#00c875' },
    { label: 'Team Size',          value: team.length,         accent: '#579bfc' },
  ]

  return (
    <div className="space-y-5">
      <KIMMPSignalBar module="Skills" />

      {/* Header */}
      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Skills Matrix</h2>
        <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: 'var(--os-text-2)' }}>
          {team.length} team members · {coveredSkills} skills mapped
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map(c => (
          <div key={c.label} className="os-card p-5">
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--os-text-2)' }}>{c.label}</p>
            <p className="text-3xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>{c.value}</p>
            <div className="mt-3 h-1 rounded-full" style={{ background: 'var(--os-surface-0)' }}>
              <div className="h-1 rounded-full w-1/2" style={{ background: c.accent }} />
            </div>
          </div>
        ))}
      </div>

      {/* Skill gap alert */}
      {gapSkills > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: '#fdab3d10', border: '1px solid #fdab3d40' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#fdab3d' }} />
          <div>
            <p className="text-sm font-bold mb-2" style={{ color: '#fdab3d' }}>Single-person dependency risks</p>
            <div className="flex items-center gap-2 flex-wrap">
              {SKILL_GAPS.filter(s => team.filter(m => m.skills.includes(s)).length <= 1).map(skill => (
                <span
                  key={skill}
                  className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                  style={{ background: '#fdab3d20', color: '#fdab3d' }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input
          placeholder="Search by name or role…"
          prefix={<Search className="w-3.5 h-3.5" />}
          className="w-56"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterSkill(null)}
            className="px-3 py-1.5 text-xs font-bold rounded-full transition-all"
            style={!filterSkill
              ? { background: '#579bfc', color: '#fff' }
              : { background: 'var(--os-surface-0)', color: 'var(--os-text-2)', border: '1px solid var(--os-border)' }
            }
          >
            All skills
          </button>
          {SKILL_GAPS.map(skill => (
            <button
              key={skill}
              onClick={() => setFilterSkill(filterSkill === skill ? null : skill)}
              className="px-3 py-1.5 text-xs font-bold rounded-full transition-all"
              style={filterSkill === skill
                ? { background: '#fdab3d', color: '#fff' }
                : { background: 'var(--os-surface-0)', color: 'var(--os-text-2)', border: '1px solid var(--os-border)' }
              }
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Matrix grouped by category */}
      <div className="space-y-5">
        {SKILL_GROUPS.map(group => {
          const activeSkills = group.skills.filter(s =>
            filterSkill ? s === filterSkill : team.some(m => m.skills.includes(s))
          )
          if (!activeSkills.length) return null

          return (
            <div key={group.label} className="os-card" style={{ padding: 0 }}>
              <div
                className="px-5 pt-4 pb-2"
                style={{ borderBottom: '1px solid var(--os-border)' }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--os-text-2)' }}>{group.label}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--os-border)' }}>
                      <th className="text-left px-5 py-2.5 w-48" style={{ color: 'var(--os-text-2)' }}>
                        <span className="text-xs font-semibold">Person</span>
                      </th>
                      {activeSkills.map(skill => (
                        <th key={skill} className="px-3 py-2.5 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span
                              className={cn('text-[10px] font-semibold whitespace-nowrap')}
                              style={{ color: SKILL_GAPS.includes(skill) ? '#fdab3d' : 'var(--os-text-2)' }}
                            >
                              {skill}
                            </span>
                            {SKILL_GAPS.includes(skill) && (
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#fdab3d' }} />
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {searchedTeam.map(member => (
                      <tr
                        key={member.id}
                        className="transition-colors"
                        style={{ borderBottom: '1px solid var(--os-border)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--os-surface-0)')}
                        onMouseLeave={e => (e.currentTarget.style.background = '')}
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={member.name} size="xs" />
                            <div>
                              <p className="text-xs font-semibold" style={{ color: 'var(--os-text-1)' }}>{member.name}</p>
                              <p className="text-[10px] truncate max-w-[120px]" style={{ color: 'var(--os-text-2)' }}>{member.role}</p>
                            </div>
                          </div>
                        </td>
                        {activeSkills.map(skill => {
                          const hasSkill = member.skills.includes(skill)
                          return (
                            <td key={skill} className="px-3 py-3 text-center">
                              <div className="flex justify-center">
                                {hasSkill ? (
                                  <div
                                    className="w-5 h-5 rounded-full flex items-center justify-center"
                                    style={{ background: '#00c875' }}
                                  >
                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                  </div>
                                ) : (
                                  <div
                                    className="w-5 h-5 rounded-full"
                                    style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)' }}
                                  />
                                )}
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </div>

      {searchedTeam.length === 0 && (
        <div className="py-16 text-center text-sm" style={{ color: 'var(--os-text-2)' }}>No team members match your search.</div>
      )}
    </div>
  )
}
