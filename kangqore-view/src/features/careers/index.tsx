import { useEffect } from 'react'
import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { LayoutGrid, KanbanSquare } from 'lucide-react'
import { cn } from '@design-system/cn'
import { api, isDemo } from '@lib/api'
import { useCareersStore } from './store'
import { CareersOverview } from './pages/CareersOverview'
import { PipelinePage }    from './pages/PipelinePage'
import type { Candidate } from './types'

const TABS = [
  { path: '',         label: 'Overview', icon: LayoutGrid    },
  { path: 'pipeline', label: 'Pipeline', icon: KanbanSquare  },
]

// Backend JobApplication → kangqore-view Candidate
function toCandidate(a: Record<string, unknown>, i: number): Candidate {
  const stages: Candidate['stage'][] = ['applied','screening','technical','final','offer','hired','rejected']
  return {
    id:           String(a.id ?? `ca${i}`),
    roleId:       'j1',   // mapped by position below
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

export function CareersModule() {
  const { hydrateCandidates } = useCareersStore()

  const { data: applications } = useQuery({
    queryKey: ['job-applications'],
    queryFn: () => api.get('/careers/applications').then(r =>
      (r.data.applications ?? r.data ?? []) as Record<string, unknown>[]
    ),
    staleTime: 1000 * 60 * 5,
    enabled: !isDemo(),
  })
  useEffect(() => {
    if (applications?.length) hydrateCandidates(applications.map((a, i) => toCandidate(a, i)))
  }, [applications, hydrateCandidates])

  return (
    <div>
      <div className="flex items-center gap-1 border-b border-slate-200 mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/os/careers' : `/os/careers/${tab.path}`}
            end={tab.path === ''}
            className={({ isActive }) => cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all',
              isActive
                ? 'border-[#2564ea] text-[#2564ea]'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Routes>
        <Route index           element={<CareersOverview />} />
        <Route path="pipeline" element={<PipelinePage />}    />
        <Route path="*"        element={<Navigate to="/os/careers" replace />} />
      </Routes>
    </div>
  )
}
