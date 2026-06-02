import { useEffect } from 'react'
import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Activity, Shield } from 'lucide-react'
import { cn } from '@design-system/cn'
import { api, isDemo } from '@lib/api'
import { useDeliveryStore } from './store'
import { DeliveryHealthPage } from './pages/DeliveryHealthPage'
import { RiskRegisterPage }   from './pages/RiskRegisterPage'
import type { Risk } from './types'

const TABS = [
  { path: '',      label: 'Health',        icon: Activity },
  { path: 'risks', label: 'Risk Register', icon: Shield   },
]

function toRisk(r: Record<string, unknown>): Risk {
  return {
    id:               String(r.id ?? ''),
    title:            String(r.title ?? ''),
    description:      r.description ? String(r.description) : undefined,
    severity:         String(r.severity ?? 'MEDIUM') as Risk['severity'],
    status:           String(r.status ?? 'OPEN') as Risk['status'],
    probability:      r.probability ? String(r.probability) as Risk['probability'] : undefined,
    impact:           r.impact ? String(r.impact) as Risk['impact'] : undefined,
    owner:            r.owner ? String(r.owner) : undefined,
    riskOwner:        r.riskOwner ? String(r.riskOwner) : undefined,
    trend:            r.trend ? String(r.trend) as Risk['trend'] : undefined,
    mitigationPlan:   r.mitigationPlan ? String(r.mitigationPlan) : undefined,
    contingencyPlan:  r.contingencyPlan ? String(r.contingencyPlan) : undefined,
    isClientVisible:  Boolean(r.isClientVisible),
    projectId:        r.projectId ? String(r.projectId) : undefined,
    clientId:         r.clientId ? String(r.clientId) : undefined,
    project:          r.project ? { title: String((r.project as any).title ?? '') } : undefined,
    client:           r.client
      ? { name: String((r.client as any).name ?? ''), company: String((r.client as any).company ?? '') }
      : undefined,
    createdAt:        String(r.createdAt ?? new Date().toISOString()),
    updatedAt:        String(r.updatedAt ?? new Date().toISOString()),
  }
}

export function DeliveryModule() {
  const { hydrate } = useDeliveryStore()

  const { data } = useQuery({
    queryKey: ['risks'],
    queryFn: () => api.get('/risks').then(r => (r.data.risks ?? r.data ?? []) as Record<string, unknown>[]),
    staleTime: 1000 * 60 * 3,
    enabled: !isDemo(),
  })

  useEffect(() => {
    if (data?.length) hydrate(data.map(toRisk))
  }, [data, hydrate])

  return (
    <div>
      <div className="flex items-center gap-1 border-b border-slate-200 mb-6 -mt-2">
        {TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/os/delivery' : `/os/delivery/${tab.path}`}
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
        <Route index       element={<DeliveryHealthPage />} />
        <Route path="risks" element={<RiskRegisterPage />}  />
        <Route path="*"    element={<Navigate to="/os/delivery" replace />} />
      </Routes>
    </div>
  )
}
