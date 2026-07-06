import { useQuery } from '@tanstack/react-query'
import { Mail, Edit2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { Spinner } from '@design-system/components/Spinner'
import { api, isDemo } from '@lib/api'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  category: string
  lastModified?: string
  isActive: boolean
}

// Fallback templates matching what the scheduling system uses
const FALLBACK_TEMPLATES: EmailTemplate[] = [
  { id: 't1', name: 'Booking Confirmation',  subject: 'Your booking is confirmed — {{event_name}}',    category: 'Scheduling', isActive: true  },
  { id: 't2', name: 'Booking Reminder',      subject: 'Reminder: {{event_name}} in {{time_until}}',    category: 'Scheduling', isActive: true  },
  { id: 't3', name: 'Booking Cancellation',  subject: 'Your booking has been cancelled',               category: 'Scheduling', isActive: true  },
  { id: 't4', name: 'Booking Rescheduled',   subject: 'Your booking has been rescheduled',             category: 'Scheduling', isActive: true  },
  { id: 't5', name: 'Invoice Issued',        subject: 'Invoice {{invoice_number}} from Kangqore',      category: 'Finance',    isActive: true  },
  { id: 't6', name: 'Invoice Overdue',       subject: 'Reminder: Invoice {{invoice_number}} overdue',  category: 'Finance',    isActive: true  },
  { id: 't7', name: 'Welcome — New Client',  subject: 'Welcome to Kangqore, {{name}}',                 category: 'Onboarding', isActive: true  },
  { id: 't8', name: 'Investor Update',       subject: '{{period}} Update — Kangqore',                  category: 'Investors',  isActive: true  },
]

const CATEGORY_COLOR: Record<string, string> = {
  Scheduling: 'bg-blue-50 text-blue-700',
  Finance:    'bg-green-50 text-green-700',
  Onboarding: 'bg-purple-50 text-purple-700',
  Investors:  'bg-orange-50 text-orange-700',
}

export function EmailTemplatesPage() {
  const { data: apiTemplates, isLoading } = useQuery<EmailTemplate[]>({
    queryKey: ['email-templates'],
    queryFn: () => api.get('/scheduling/email-templates').then(r => r.data.templates ?? []),
    enabled: !isDemo(),
    staleTime: 1000 * 60 * 5,
  })

  const templates = apiTemplates?.length ? apiTemplates : FALLBACK_TEMPLATES

  const byCategory = templates.reduce<Record<string, EmailTemplate[]>>((acc, t) => {
    ;(acc[t.category] = acc[t.category] ?? []).push(t)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[22px] font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Email Templates</h2>
        <p className="text-sm text-[var(--os-text-2)] mt-1">
          Manage automated email templates sent to clients, partners, and investors.
        </p>
      </div>

      {isLoading && <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)]"><Spinner size="sm" /> Loading…</div>}

      <div className="space-y-6">
        {Object.entries(byCategory).map(([category, items]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                {category}
              </CardTitle>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-[var(--os-border)]">
                {items.map(t => (
                  <div key={t.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--os-surface-0)] transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--os-text-1)]">{t.name}</p>
                      <p className="text-xs text-[var(--os-text-2)] truncate font-mono mt-0.5">{t.subject}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLOR[t.category] ?? 'bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[var(--os-text-2)]'}`}>
                        {t.category}
                      </span>
                      <Badge variant={t.isActive ? 'success' : 'neutral'} size="sm" dot>
                        {t.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button variant="ghost" size="icon" title="Edit template">
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}
