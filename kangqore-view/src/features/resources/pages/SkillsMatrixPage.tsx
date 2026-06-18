import { useState } from 'react'
import { Search, CheckCircle2, Circle, AlertCircle } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Avatar } from '@design-system/components/Avatar'
import { Input } from '@design-system/components/Input'
import { StatCard } from '@design-system/components/StatCard'
import { cn } from '@design-system/cn'
import { useResourcesStore } from '../store'

// ─── skill categories ─────────────────────────────────────────────────────────

const SKILL_GROUPS: { label: string; skills: string[] }[] = [
  {
    label: 'Frontend',
    skills: ['React', 'TypeScript', 'Design Systems', 'Figma', 'Prototyping'],
  },
  {
    label: 'Backend',
    skills: ['Node.js', 'Python', 'PostgreSQL', 'FastAPI', 'Docker'],
  },
  {
    label: 'AI / Data',
    skills: ['AI/ML', 'ML', 'LangChain', 'RAG', 'Pinecone', 'Analytics'],
  },
  {
    label: 'Infrastructure',
    skills: ['AWS', 'Terraform', 'Kubernetes', 'CI/CD', 'Monitoring'],
  },
  {
    label: 'Product & Strategy',
    skills: ['Product Strategy', 'Roadmapping', 'Agile', 'Architecture', 'Strategy'],
  },
  {
    label: 'Design & Research',
    skills: ['UX Research', 'JIRA'],
  },
  {
    label: 'Business',
    skills: ['B2B Sales', 'CRM', 'Proposal Writing', 'Negotiation', 'Financial Modelling'],
  },
]

// Skills that are needed but no single person owns them strongly
const SKILL_GAPS = ['Kubernetes', 'Terraform', 'Pinecone', 'Financial Modelling', 'Negotiation']

// ─── page ─────────────────────────────────────────────────────────────────────

export function SkillsMatrixPage() {
  const { team } = useResourcesStore()
  const [search,     setSearch]     = useState('')
  const [filterSkill, setFilterSkill] = useState<string | null>(null)

  // All unique skills across the team
  const allSkills = [...new Set(team.flatMap(m => m.skills))].sort()

  // Search / filter
  const filteredTeam = filterSkill
    ? team.filter(m => m.skills.includes(filterSkill))
    : team

  const searchedTeam = search
    ? filteredTeam.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.role.toLowerCase().includes(search.toLowerCase())
      )
    : filteredTeam

  // Coverage stats
  const totalSkills    = allSkills.length
  const coveredSkills  = allSkills.filter(s => team.some(m => m.skills.includes(s))).length
  const gapSkills      = SKILL_GAPS.filter(s => team.filter(m => m.skills.includes(s)).length <= 1).length
  const avgSkillsPerPerson = Math.round(team.reduce((s, m) => s + m.skills.length, 0) / team.length)

  return (
    <div className="space-y-5">
      <KIMMPSignalBar module="Skills" />

      <div>
        <h2 className="text-xl font-bold text-white">Skills Matrix</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {team.length} team members · {coveredSkills} skills mapped
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total skills"      value={totalSkills}         icon={<CheckCircle2 className="w-5 h-5" />} iconColor="bg-blue-100 text-blue-600" />
        <StatCard label="Avg per person"    value={avgSkillsPerPerson}  icon={<CheckCircle2 className="w-5 h-5" />} iconColor="bg-green-100 text-green-600" />
        <StatCard label="Single point risk" value={gapSkills}           icon={<AlertCircle  className="w-5 h-5" />} iconColor={gapSkills > 0 ? 'bg-amber-100 text-amber-600' : 'bg-os-s1 text-slate-300'} />
        <StatCard label="Team size"         value={team.length}         icon={<Circle       className="w-5 h-5" />} iconColor="bg-os-s1 text-slate-300" />
      </div>

      {/* Skill gap alerts */}
      {gapSkills > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <p className="text-sm font-semibold text-amber-800">Single-person dependency risks</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {SKILL_GAPS.filter(s => team.filter(m => m.skills.includes(s)).length <= 1).map(skill => (
              <Badge key={skill} variant="warning" size="sm">{skill}</Badge>
            ))}
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !filterSkill ? 'bg-os-blue text-white' : 'bg-os-s1 border border-os-border text-slate-300 hover:border-blue-300'
            }`}
          >
            All skills
          </button>
          {SKILL_GAPS.map(skill => (
            <button
              key={skill}
              onClick={() => setFilterSkill(filterSkill === skill ? null : skill)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterSkill === skill ? 'bg-amber-500 text-white' : 'bg-os-s1 border border-os-border text-slate-300 hover:border-amber-300'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Matrix — grouped by skill category */}
      <div className="space-y-6">
        {SKILL_GROUPS.map(group => {
          // Only show skills that at least one team member has
          const activeSkills = group.skills.filter(s =>
            filterSkill ? s === filterSkill : team.some(m => m.skills.includes(s))
          )
          if (!activeSkills.length) return null

          return (
            <Card key={group.label} padding="none">
              <div className="px-5 pt-4 pb-2 border-b border-os-border">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{group.label}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-os-border">
                      <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-500 w-48">Person</th>
                      {activeSkills.map(skill => (
                        <th key={skill} className="px-3 py-2.5 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className={cn(
                              'text-[10px] font-semibold whitespace-nowrap',
                              SKILL_GAPS.includes(skill) ? 'text-amber-600' : 'text-slate-500'
                            )}>
                              {skill}
                            </span>
                            {SKILL_GAPS.includes(skill) && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2E2854]">
                    {searchedTeam.map(member => (
                      <tr key={member.id} className="hover:bg-slate-900 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={member.name} size="xs" />
                            <div>
                              <p className="text-xs font-semibold text-slate-200">{member.name}</p>
                              <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{member.role}</p>
                            </div>
                          </div>
                        </td>
                        {activeSkills.map(skill => {
                          const hasSkill = member.skills.includes(skill)
                          return (
                            <td key={skill} className="px-3 py-3 text-center">
                              {hasSkill ? (
                                <div className="flex justify-center">
                                  <div className="w-5 h-5 rounded-full bg-os-blue flex items-center justify-center">
                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                  </div>
                                </div>
                              ) : (
                                <div className="flex justify-center">
                                  <div className="w-5 h-5 rounded-full bg-os-s1" />
                                </div>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )
        })}
      </div>

      {searchedTeam.length === 0 && (
        <div className="py-16 text-center text-sm text-slate-500">No team members match your search.</div>
      )}
    </div>
  )
}
