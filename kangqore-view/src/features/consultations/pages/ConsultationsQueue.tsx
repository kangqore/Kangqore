import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { StaggerTableBody, StaggerRow } from '@components/animations/Stagger'
import { EmptyState } from '@design-system/components/EmptyState'
import {
  Search, Phone, Mail, Building2, Calendar,
  MessageSquare, Clock, ExternalLink, AlertCircle,
} from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { InlineSelect } from '@components/InlineSelect'
import { EditDrawer } from '@components/EditDrawer'
import { StatCard } from '@design-system/components/StatCard'
import { Badge } from '@design-system/components/Badge'
import { Card } from '@design-system/components/Card'
import { Button } from '@design-system/components/Button'
import { Input } from '@design-system/components/Input'
import { Textarea } from '@design-system/components/Textarea'
import { Divider } from '@design-system/components/Divider'
import { api, isDemo } from '@lib/api'
import { useConsultationsStore } from '../store'
import type { Consultation, ConsultationStatus } from '../types'

// ─── constants ───────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: ConsultationStatus; label: string; variant: 'warning' | 'info' | 'success' | 'brand' | 'neutral' | 'danger' }[] = [
  { value: 'PENDING',     label: 'Pending',     variant: 'warning' },
  { value: 'CONTACTED',   label: 'Contacted',   variant: 'info'    },
  { value: 'SCHEDULED',   label: 'Scheduled',   variant: 'success' },
  { value: 'RESCHEDULED', label: 'Rescheduled', variant: 'brand'   },
  { value: 'COMPLETED',   label: 'Completed',   variant: 'neutral' },
  { value: 'CANCELLED',   label: 'Cancelled',   variant: 'danger'  },
]

const STATUS_FILTERS: (ConsultationStatus | 'ALL')[] = [
  'ALL', 'PENDING', 'CONTACTED', 'SCHEDULED', 'RESCHEDULED', 'COMPLETED',
]

const fmtDate  = (s?: string) => s ? new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
const fmtTime  = (s?: string) => s ? new Date(s).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''
const timeAgo  = (s: string)  => {
  const h = Math.floor((Date.now() - new Date(s).getTime()) / 3_600_000)
  if (h < 1)  return 'just now'
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}
const isOverdue = (c: Consultation) => {
  if (['COMPLETED', 'CANCELLED'].includes(c.status)) return false
  if (c.status === 'PENDING') {
    const h = (Date.now() - new Date(c.createdAt).getTime()) / 3_600_000
    return h > 48
  }
  if (c.scheduledAt && new Date(c.scheduledAt) < new Date()) return true
  return false
}

// ─── detail drawer ───────────────────────────────────────────────────────────

function ConsultationDrawer({
  consultation,
  onPatch,
  onClose,
}: {
  consultation: Consultation
  onPatch: (id: string, data: Record<string, unknown>) => void
  onClose: () => void
}) {
  const [notes,       setNotes]       = useState(consultation.notes ?? '')
  const [scheduledAt, setScheduledAt] = useState(consultation.scheduledAt?.slice(0, 16) ?? '')
  const [meetingMode, setMeetingMode] = useState(consultation.meetingMode ?? '')
  const [meetingLink, setMeetingLink] = useState(consultation.meetingLink ?? '')

  function save() {
    onPatch(consultation.id, {
      notes,
      scheduledAt: scheduledAt || undefined,
      meetingMode: meetingMode || undefined,
      meetingLink: meetingLink || undefined,
    })
    onClose()
  }

  const overdue = isOverdue(consultation)

  return (
    <EditDrawer
      open
      onClose={onClose}
      title={consultation.name}
      description={[consultation.company, consultation.service].filter(Boolean).join(' · ')}
      width="lg"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={save}>Save changes</Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Overdue alert */}
        {overdue && (
          <div className="flex items-center gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-700 font-medium">
              {consultation.status === 'PENDING'
                ? 'Pending for more than 48 hours — needs immediate follow-up.'
                : 'Scheduled time has passed — update status or reschedule.'}
            </p>
          </div>
        )}

        {/* Status */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1.5">Status</p>
            <InlineSelect
              value={consultation.status}
              options={STATUS_OPTIONS}
              onChange={status => onPatch(consultation.id, { status })}
              size="md"
              dot
            />
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Received</p>
            <p className="text-sm font-medium text-slate-300">{fmtDate(consultation.createdAt)}</p>
          </div>
        </div>

        <Divider />

        {/* Contact */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Contact</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <a href={`mailto:${consultation.email}`} className="text-sm text-blue-600 hover:underline">{consultation.email}</a>
            </div>
            {consultation.phone && (
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span className="text-sm text-slate-300">{consultation.phone}</span>
              </div>
            )}
            {consultation.company && (
              <div className="flex items-center gap-2.5">
                <Building2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span className="text-sm text-slate-300">{consultation.company}</span>
              </div>
            )}
          </div>
        </div>

        <Divider />

        {/* Request */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Request</p>
          <div className="space-y-2.5">
            {consultation.service && (
              <div>
                <span className="text-xs text-slate-500">Service</span>
                <p className="text-sm font-medium text-slate-200">{consultation.service}</p>
              </div>
            )}
            {consultation.topic && (
              <div>
                <span className="text-xs text-slate-500">Topic</span>
                <p className="text-sm text-slate-300">{consultation.topic}</p>
              </div>
            )}
            {consultation.services && consultation.services.length > 1 && (
              <div className="flex flex-wrap gap-1.5">
                {consultation.services.map(s => (
                  <Badge key={s} variant="info" size="sm">{s}</Badge>
                ))}
              </div>
            )}
            {consultation.preferredDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs text-slate-500">Preferred date:</span>
                <span className="text-xs font-medium text-slate-300">{fmtDate(consultation.preferredDate)}</span>
              </div>
            )}
            {consultation.message && (
              <div className="p-3 bg-slate-900 rounded-xl">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <MessageSquare className="w-3 h-3 text-slate-500" />
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Message</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{consultation.message}</p>
              </div>
            )}
          </div>
        </div>

        <Divider />

        {/* Scheduling */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Scheduling</p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Scheduled date & time</label>
              <Input
                type="datetime-local"
                value={scheduledAt}
                onChange={e => setScheduledAt(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Meeting mode</label>
              <select
                value={meetingMode}
                onChange={e => setMeetingMode(e.target.value)}
                className="w-full border border-os-border rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
              >
                <option value="">Select…</option>
                <option value="VIDEO">Video call</option>
                <option value="PHONE">Phone call</option>
                <option value="IN_PERSON">In person</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Meeting link / location</label>
              <Input
                placeholder="https://zoom.us/j/…"
                value={meetingLink}
                onChange={e => setMeetingLink(e.target.value)}
              />
              {meetingLink && (
                <a href={meetingLink} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1 mt-1 text-xs text-blue-600 hover:underline">
                  <ExternalLink className="w-3 h-3" /> Open link
                </a>
              )}
            </div>
          </div>
        </div>

        <Divider />

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Internal notes</label>
          <Textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Add notes about this consultation…"
            rows={4}
          />
        </div>

        {/* Source + timestamps */}
        <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
          <span>Source: <span className="capitalize text-slate-500">{consultation.source}</span></span>
          {consultation.contactedAt && <span>Contacted: {fmtDate(consultation.contactedAt)}</span>}
        </div>
      </div>
    </EditDrawer>
  )
}

// ─── main queue ──────────────────────────────────────────────────────────────

export function ConsultationsQueue() {
  const { consultations, stats, updateConsultation } = useConsultationsStore()
  const queryClient = useQueryClient()

  const [statusFilter, setStatusFilter] = useState<ConsultationStatus | 'ALL'>('ALL')
  const [search,       setSearch]       = useState('')
  const [openId,       setOpenId]       = useState<string | null>(null)

  const openConsultation = consultations.find(c => c.id === openId)

  // Mutation — PATCH /api/consultations/:id
  const { mutate: patchConsultation } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      if (!isDemo()) await api.patch(`/consultations/${id}`, data)
    },
    onSuccess: (_, { id, data }) => {
      updateConsultation(id, data as Partial<Consultation>)
      queryClient.invalidateQueries({ queryKey: ['consultations'] })
    },
  })

  function onPatch(id: string, data: Record<string, unknown>) {
    patchConsultation({ id, data })
    updateConsultation(id, data as Partial<Consultation>)
  }

  const visible = consultations.filter(c => {
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter
    const q = search.toLowerCase()
    const matchSearch = !q
      || c.name.toLowerCase().includes(q)
      || (c.company ?? '').toLowerCase().includes(q)
      || c.email.toLowerCase().includes(q)
      || (c.service ?? '').toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const overdueCount = consultations.filter(isOverdue).length

  return (
    <div className="space-y-5">
      <KIMMPSignalBar module="Consultations" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-white">Consultations</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {stats.total} requests · {stats.pending} pending
            {overdueCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-amber-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {overdueCount} overdue
              </span>
            )}
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard label="Total"       value={stats.total}       icon={<MessageSquare className="w-5 h-5" />} iconColor="bg-os-s1 text-slate-300"   />
        <StatCard label="Pending"     value={stats.pending}     icon={<Clock         className="w-5 h-5" />} iconColor={stats.pending > 0 ? 'bg-amber-100 text-amber-600' : 'bg-os-s1 text-slate-300'}  />
        <StatCard label="Contacted"   value={stats.contacted}   icon={<Phone         className="w-5 h-5" />} iconColor="bg-blue-100 text-blue-600"      />
        <StatCard label="Scheduled"   value={stats.scheduled + stats.rescheduled} icon={<Calendar className="w-5 h-5" />} iconColor="bg-green-100 text-green-600"    />
        <StatCard label="Completed"   value={stats.completed}   icon={<Mail          className="w-5 h-5" />} iconColor="bg-purple-100 text-purple-600"  />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input
          placeholder="Search by name, company, email…"
          prefix={<Search className="w-3.5 h-3.5" />}
          className="w-64"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === s
                  ? 'bg-os-blue text-white'
                  : 'bg-os-s1 border border-os-border text-slate-300 hover:border-blue-300'
              }`}
            >
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <span className="ml-auto text-sm text-slate-500">{visible.length} requests</span>
      </div>

      {/* Table */}
      <Card padding="none">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-os-border bg-slate-900">
              {['Name', 'Company', 'Service / Topic', 'Received', 'Preferred', 'Status', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <StaggerTableBody className="divide-y divide-[#2E2854]">
            {visible.map(c => {
              const overdue = isOverdue(c)
              return (
                <StaggerRow
                  key={c.id}
                  className="hover:bg-slate-900 transition-colors cursor-pointer group"
                  onClick={() => setOpenId(c.id)}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-os-blue to-os-cyan flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-[10px] font-bold">{c.name.charAt(0)}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate">{c.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{c.email}</p>
                      </div>
                      {overdue && <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 text-xs">{c.company ?? '—'}</td>
                  <td className="px-4 py-3.5 max-w-[200px]">
                    <p className="text-xs font-medium text-slate-300 truncate">{c.service ?? '—'}</p>
                    {c.topic && <p className="text-[11px] text-slate-500 truncate">{c.topic}</p>}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{timeAgo(c.createdAt)}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{fmtDate(c.preferredDate)}</td>
                  <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                    <InlineSelect
                      value={c.status}
                      options={STATUS_OPTIONS}
                      onChange={status => onPatch(c.id, { status })}
                      dot
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    {c.scheduledAt && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 whitespace-nowrap">
                        <Calendar className="w-3 h-3" />
                        {fmtTime(c.scheduledAt)}
                      </div>
                    )}
                  </td>
                </StaggerRow>
              )
            })}
          </StaggerTableBody>
        </table>
        {visible.length === 0 && (
          <EmptyState
            icon={<Search className="w-6 h-6" />}
            title="No consultations match"
            description="Try adjusting your status filter or search term."
          />
        )}
      </Card>

      {/* Detail drawer */}
      {openConsultation && (
        <ConsultationDrawer
          consultation={openConsultation}
          onPatch={onPatch}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  )
}
