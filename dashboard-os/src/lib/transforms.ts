// Maps backend API shapes → dashboard-os types.
// Backend field names don't always match the OS types, so every
// module store goes through a transform before hydrating.

import type { Project } from '@features/projects/types'
import type { Invoice } from '@features/finance/types'

// ─── Projects ────────────────────────────────────────────────────────────────

interface ApiProject {
  id: string
  title: string
  description?: string
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  client?: { id: string; name: string; company?: string }
  partner?: { id: string; name: string }
  deliverables?: { id: string; title: string; status: string }[]
  tasks?: { id: string; title: string; status: string }[]
  _count?: { deliverables: number; tasks: number }
  createdAt: string
}

const PILLAR_COLORS = ['#2564ea', '#7c3aed', '#059669', '#d97706', '#dc2626']

export function toProject(p: ApiProject, index = 0): Project {
  const done    = p.deliverables?.filter(d => d.status === 'COMPLETED').length ?? 0
  const total   = p._count?.deliverables ?? p.deliverables?.length ?? 1
  const status  = p.status === 'ACTIVE' ? 'active' : p.status === 'COMPLETED' ? 'completed' : 'on-hold'

  return {
    id:          p.id,
    name:        p.title,
    client:      p.client?.company ?? p.client?.name ?? 'Internal',
    status,
    health:      status === 'active' ? 'on-track' : status === 'completed' ? 'completed' : 'at-risk',
    owner:       'Kangqore',
    team:        [],
    startDate:   p.createdAt.slice(0, 10),
    endDate:     '',
    budget:      0,
    spent:       0,
    progress:    total > 0 ? Math.round((done / total) * 100) : 0,
    description: p.description ?? '',
    pillarColor: PILLAR_COLORS[index % PILLAR_COLORS.length],
    taskCount:   p._count?.deliverables ?? 0,
    openIssues:  0,
  }
}

export function toProjects(raw: ApiProject[]): Project[] {
  return raw.map((p, i) => toProject(p, i))
}

// ─── Invoices ─────────────────────────────────────────────────────────────────

interface ApiInvoice {
  id: string
  invoiceNumber: string
  amount: number | string
  currency?: string
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED'
  dueDate: string
  issueDate?: string
  project?: { id: string; title: string }
  clientId?: string
  notes?: string
}

const INVOICE_STATUS_MAP: Record<string, Invoice['status']> = {
  DRAFT: 'draft', SENT: 'sent', PAID: 'paid', OVERDUE: 'overdue', CANCELLED: 'cancelled',
}

export function toInvoice(i: ApiInvoice): Invoice {
  return {
    id:          i.id,
    number:      i.invoiceNumber ?? `INV-${i.id.slice(-6).toUpperCase()}`,
    client:      i.project?.title ?? '—',
    projectId:   i.project?.id ?? '',
    projectName: i.project?.title ?? '—',
    amount:      typeof i.amount === 'string' ? parseFloat(i.amount) : (i.amount ?? 0),
    currency:    (i.currency ?? 'GBP') as Invoice['currency'],
    status:      INVOICE_STATUS_MAP[i.status] ?? 'sent',
    issueDate:   i.issueDate?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    dueDate:     i.dueDate?.slice(0, 10) ?? '',
    items:       [],
  }
}

export function toInvoices(raw: ApiInvoice[]): Invoice[] {
  return raw.map(toInvoice)
}
