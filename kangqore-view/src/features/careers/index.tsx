import { useEffect } from 'react'
import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { LayoutGrid, KanbanSquare } from 'lucide-react'
import { cn } from '@design-system/cn'
import { api, isDemo } from '@lib/api'
import { useCareersStore } from './store'
import { CareersOverview } from './pages/CareersOverview'
import { PipelinePage }    from './pages/PipelinePage'
import type { Candidate, JobRole } from './types'
import { AnimatePresence, motion } from 'framer-motion'

const TABS = [
  { path: '',         label: 'Overview', icon: LayoutGrid    },
  { path: 'pipeline', label: 'Pipeline', icon: KanbanSquare  },
]

// Backend JobApplication → kangqore-view Candidate
// roleMap: lowercase title → id, built from live or static roles
function toCandidate(a: Record<string, unknown>, i: number, roleMap: Map<string, string>): Candidate {
  const stages: Candidate['stage'][] = ['applied','screening','technical','final','offer','hired','rejected']
  const position = String(a.position ?? a.title ?? '').toLowerCase().trim()
  const roleId = roleMap.get(position)
    ?? [...roleMap.entries()].find(([k]) => k.includes(position) || position.includes(k))?.[1]
    ?? 'j1'
  return {
    id:           String(a.id ?? `ca${i}`),
    roleId,
    name:         String(a.name ?? ''),
    email:        String(a.email ?? ''),
    location:     String(a.location ?? 'Unknown'),
    stage:        stages.includes(String(a.status ?? 'applied').toLowerCase() as Candidate['stage'])
                    ? String(a.status).toLowerCase() as Candidate['stage']
                    : 'applied',
    appliedDate:  String(a.createdAt ?? '').slice(0, 10),
    lastActivity: String(a.updatedAt ?? a.createdAt ?? '').slice(0, 10),
    notes:        String(a.coverLetter ?? '').slice(0, 200),
    tags:         [],
    source:       (['linkedin','referral','careers-page','agency','direct'].includes(String(a.source ?? '').toLowerCase())
                    ? String(a.source).toLowerCase()
                    : 'careers-page') as Candidate['source'],
  }
}

function toRole(j: Record<string, unknown>, i: number): JobRole {
  const VALID_DEPTS = ['engineering','product','sales','delivery','ops','design']
  const VALID_TYPES = ['full-time','part-time','contract','freelance']
  const VALID_STATUSES = ['open','interview','offer','closed','on-hold']
  return {
    id:            String(j.id ?? `jr${i}`),
    title:         String(j.title ?? ''),
    department:    (VALID_DEPTS.includes(String(j.department ?? '').toLowerCase())
                     ? String(j.department).toLowerCase()
                     : 'engineering') as JobRole['department'],
    type:          (VALID_TYPES.includes(String(j.type ?? '').toLowerCase())
                     ? String(j.type).toLowerCase()
                     : 'full-time') as JobRole['type'],
    location:      String(j.location ?? 'Remote'),
    remote:        String(j.location ?? '').toLowerCase().includes('remote'),
    salaryMin:     0,
    salaryMax:     0,
    salaryRange:   String(j.salaryRange ?? ''),
    description:   String(j.description ?? ''),
    requirements:  (j.requirements as string[]) ?? [],
    status:        (VALID_STATUSES.includes(String(j.status ?? '').toLowerCase())
                     ? String(j.status).toLowerCase()
                     : 'open') as JobRole['status'],
    applications:  Number(j.applications ?? 0),
    inPipeline:    0,
    hiringManager: '',
    tags:          [],
    postedDate:    String(j.createdAt ?? '').slice(0, 10),
  }
}

export function CareersModule() {
  const { hydrateCandidates, hydrateRoles, roles } = useCareersStore()
  const roleMap = new Map(roles.map(r => [r.title.toLowerCase().trim(), r.id]))

  const { data: jobs } = useQuery({
    queryKey: ['jobs-all'],
    queryFn: () => api.get('/careers/jobs/all').then(r => (r.data.jobs ?? []) as Record<string, unknown>[]),
    staleTime: 1000 * 60 * 5,
    enabled: !isDemo(),
  })
  useEffect(() => {
    if (jobs?.length) hydrateRoles(jobs.map((j, i) => toRole(j, i)))
  }, [jobs, hydrateRoles])

  const { data: applications } = useQuery({
    queryKey: ['job-applications'],
    queryFn: () => api.get('/careers/applications').then(r =>
      (r.data.applications ?? r.data ?? []) as Record<string, unknown>[]
    ),
    staleTime: 1000 * 60 * 5,
    enabled: !isDemo(),
  })
  useEffect(() => {
    if (applications?.length) hydrateCandidates(applications.map((a, i) => toCandidate(a, i, roleMap)))
  }, [applications, hydrateCandidates, roles])

  const { pathname } = useLocation()

  return (
    <div>
      <div className="flex items-center gap-1 border-b border-os-border mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/kangqore-view/admin/careers' : `/kangqore-view/admin/careers/${tab.path}`}
            end={tab.path === ''}
            className={({ isActive }) => cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all',
              isActive
                ? 'border-os-blue text-os-blue'
                : 'border-transparent text-slate-500 hover:text-slate-200 hover:border-os-border'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </NavLink>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={pathname} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.15,ease:'easeOut'}}>

        <Routes>
          <Route index           element={<CareersOverview />} />
          <Route path="pipeline" element={<PipelinePage />}    />
          <Route path="*"        element={<Navigate to="/kangqore-view/admin/careers" replace />} />
        </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
