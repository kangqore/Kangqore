import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GraduationCap, Users, Clock, CheckCircle2, Plus } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { StatCard } from '@design-system/components/StatCard'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Avatar } from '@design-system/components/Avatar'
import { Button } from '@design-system/components/Button'
import { Input } from '@design-system/components/Input'
import { Textarea } from '@design-system/components/Textarea'
import { Modal } from '@design-system/components/Modal'
import { api } from '@lib/api'
import { useCareersStore } from '../store'

const STATUS_BADGE: Record<string, 'success' | 'info' | 'warning' | 'neutral' | 'danger'> = {
  open: 'success', interview: 'info', offer: 'warning', closed: 'neutral', 'on-hold': 'danger',
}

const STAGE_BADGE: Record<string, 'success' | 'info' | 'warning' | 'neutral' | 'danger'> = {
  hired: 'success', offer: 'warning', final: 'info', technical: 'info',
  screening: 'neutral', applied: 'neutral', rejected: 'danger',
}

const DEPT_COLOR: Record<string, string> = {
  engineering: 'bg-blue-50 text-blue-700',
  product: 'bg-purple-50 text-purple-700',
  sales: 'bg-green-50 text-green-700',
  delivery: 'bg-orange-50 text-orange-700',
  ops: 'bg-slate-100 text-slate-600',
  design: 'bg-pink-50 text-pink-700',
}

const EMPTY_FORM = { title: '', department: 'engineering', type: 'full-time', location: 'London, UK / Remote', description: '', salaryRange: '', requirements: '' }

export function CareersOverview() {
  const { roles, candidates, setSelectedRole } = useCareersStore()
  const queryClient = useQueryClient()
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const set = (k: keyof typeof EMPTY_FORM, v: string) => setForm(f => ({ ...f, [k]: v }))

  const { mutate: createJob, isPending } = useMutation({
    mutationFn: () => api.post('/careers/jobs', {
      ...form,
      requirements: form.requirements.split('\n').map(r => r.trim()).filter(Boolean),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs-all'] })
      setShowNew(false)
      setForm(EMPTY_FORM)
    },
  })

  const openRoles   = roles.filter(r => ['open', 'interview', 'offer'].includes(r.status))
  const totalApps   = roles.reduce((s, r) => s + r.applications, 0)
  const activeOffer = candidates.filter(c => c.stage === 'offer')

  return (
    <div className="space-y-8">
      <KIMMPSignalBar module="Careers" />

      {/* New role modal */}
      <Modal open={showNew} onClose={() => setShowNew(false)} title="Post a new role" size="md">
        <div className="space-y-4 p-6">
          <Input label="Job title" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Senior Backend Engineer" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Department</label>
              <select value={form.department} onChange={e => set('department', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                {['engineering','product','sales','delivery','ops','design'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                {['full-time','part-time','contract','freelance'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <Input label="Location" value={form.location} onChange={e => set('location', e.target.value)} placeholder="London, UK / Remote" />
          <Input label="Salary range (optional)" value={form.salaryRange} onChange={e => set('salaryRange', e.target.value)} placeholder="e.g. £80k–£100k" />
          <Textarea label="Description" value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Role overview…" />
          <Textarea label="Requirements (one per line)" value={form.requirements} onChange={e => set('requirements', e.target.value)} rows={4} placeholder={"5+ years Node.js\nPostgreSQL experience\nRemote working experience"} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setShowNew(false)}>Cancel</Button>
            <Button variant="primary" size="sm" loading={isPending} disabled={!form.title || !form.description} onClick={() => createJob()}>Post role</Button>
          </div>
        </div>
      </Modal>

      <div className="flex items-center justify-between">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
          <StatCard label="Open Roles"   value={openRoles.length}                              icon={<GraduationCap className="w-5 h-5" />} changeLabel={`${roles.filter(r => r.status === 'on-hold').length} on hold`} />
          <StatCard label="Applications" value={totalApps}                                     icon={<Users         className="w-5 h-5" />} changeLabel="All open roles" />
          <StatCard label="In Pipeline"  value={roles.reduce((s, r) => s + r.inPipeline, 0)}  icon={<Clock         className="w-5 h-5" />} changeLabel="Active candidates" />
          <StatCard label="Offers Out"   value={activeOffer.length}                            icon={<CheckCircle2  className="w-5 h-5" />} changeLabel="Awaiting response" />
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setShowNew(true)}>Post a role</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role cards */}
        <div className="lg:col-span-2 space-y-4">
          {roles.map(role => (
            <Card
              key={role.id}
              className="cursor-pointer hover:border-blue-200 transition-colors"
              onClick={() => setSelectedRole(role.id)}
            >
              <CardBody className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-900">{role.title}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DEPT_COLOR[role.department]}`}>
                        {role.department}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {role.location} · {role.remote ? 'Remote OK' : 'On-site'} · {role.type} · £{role.salaryMin}k–£{role.salaryMax}k
                    </p>
                  </div>
                  <Badge variant={STATUS_BADGE[role.status]} size="sm" dot>
                    {role.status.charAt(0).toUpperCase() + role.status.slice(1)}
                  </Badge>
                </div>

                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{role.description}</p>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex gap-4">
                    <span><span className="font-semibold text-slate-800">{role.applications}</span> applications</span>
                    <span><span className="font-semibold text-slate-800">{role.inPipeline}</span> in pipeline</span>
                    {role.targetStartDate && (
                      <span>Target start: <span className="font-semibold text-slate-800">{role.targetStartDate}</span></span>
                    )}
                  </div>
                  <span>HM: {role.hiringManager}</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Active candidates */}
        <Card>
          <CardHeader>
            <CardTitle>Active Candidates</CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-slate-100">
              {candidates
                .filter(c => !['rejected'].includes(c.stage))
                .sort((a, b) => (b.cvScore ?? 0) - (a.cvScore ?? 0))
                .map(c => {
                  const role = roles.find(r => r.id === c.roleId)
                  return (
                    <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                      <Avatar name={c.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{c.name}</p>
                        <p className="text-xs text-slate-500 truncate">{role?.title}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={STAGE_BADGE[c.stage] ?? 'neutral'} size="sm">{c.stage}</Badge>
                        {c.cvScore && (
                          <span className={`text-xs font-semibold ${c.cvScore >= 80 ? 'text-green-600' : c.cvScore >= 65 ? 'text-orange-600' : 'text-slate-500'}`}>
                            {c.cvScore}pts
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
