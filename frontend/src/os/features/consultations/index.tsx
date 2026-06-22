import { useEffect } from 'react'
import { useLocation, Routes, Route, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api, isDemo } from '@lib/api'
import { useConsultationsStore } from './store'
import { ConsultationsQueue } from './pages/ConsultationsQueue'
import type { Consultation } from './types'
import { AnimatePresence, motion } from 'framer-motion'

function toConsultation(r: Record<string, unknown>): Consultation {
  return {
    id:                   String(r.id ?? ''),
    name:                 String(r.name ?? ''),
    email:                String(r.email ?? ''),
    phone:                r.phone ? String(r.phone) : undefined,
    company:              r.company ? String(r.company) : undefined,
    service:              r.service ? String(r.service) : undefined,
    services:             Array.isArray(r.services) ? r.services as string[] : [],
    topic:                r.topic ? String(r.topic) : undefined,
    preferredDate:        r.preferredDate ? String(r.preferredDate) : undefined,
    message:              r.message ? String(r.message) : undefined,
    source:               String(r.source ?? 'website'),
    status:               String(r.status ?? 'PENDING') as Consultation['status'],
    notes:                r.notes ? String(r.notes) : undefined,
    scheduledAt:          r.scheduledAt ? String(r.scheduledAt) : undefined,
    previousScheduledAt:  r.previousScheduledAt ? String(r.previousScheduledAt) : undefined,
    meetingMode:          r.meetingMode ? String(r.meetingMode) : undefined,
    meetingLink:          r.meetingLink ? String(r.meetingLink) : undefined,
    location:             r.location ? String(r.location) : undefined,
    assignedTo:           r.assignedTo ? String(r.assignedTo) : undefined,
    contactedAt:          r.contactedAt ? String(r.contactedAt) : undefined,
    createdAt:            String(r.createdAt ?? new Date().toISOString()),
    updatedAt:            String(r.updatedAt ?? new Date().toISOString()),
  }
}

export function ConsultationsModule() {
  const { hydrate } = useConsultationsStore()

  const { data } = useQuery({
    queryKey: ['consultations'],
    queryFn: () => api.get('/consultations', { params: { limit: 100 } })
      .then(r => (r.data.consultations ?? r.data ?? []) as Record<string, unknown>[]),
    staleTime: 1000 * 60 * 2,
    enabled: !isDemo(),
  })

  useEffect(() => {
    if (data !== undefined) hydrate(data.map(toConsultation))
  }, [data, hydrate])

  const { pathname } = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={pathname} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.15,ease:'easeOut'}}>

      <Routes>
        <Route index element={<ConsultationsQueue />} />
        <Route path="*" element={<Navigate to="/kangqore-view/admin/consultations" replace />} />
      </Routes>
      </motion.div>
    </AnimatePresence>
  )
}
