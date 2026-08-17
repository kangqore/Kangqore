import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Mail, Edit2, X, Save, ChevronDown, ChevronRight, Code2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { Spinner } from '@design-system/components/Spinner'
import { api, isDemo } from '@lib/api'

interface EmailTemplate {
  id:           string
  type:         string
  name?:        string
  subject:      string
  bodyHtml?:    string
  category?:    string
  isActive?:    boolean
  lastModified?: string
}

function safeSanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return html
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const badElements = doc.querySelectorAll('script, iframe, object, embed')
  badElements.forEach(el => el.remove())
  const allElements = doc.querySelectorAll('*')
  allElements.forEach(el => {
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.startsWith('on') || attr.value.trim().toLowerCase().startsWith('javascript:')) {
        el.removeAttribute(attr.name)
      }
    }
  })
  return doc.body.innerHTML
}

// Fallback templates for demo mode
const FALLBACK_TEMPLATES: EmailTemplate[] = [
  { id: 't1', type: 'booking.confirmation', name: 'Booking Confirmation', subject: 'Your booking is confirmed — {{event_name}}',   bodyHtml: '<p>Hi {{attendee_name}},</p>\n<p>Your booking for <strong>{{event_name}}</strong> is confirmed.</p>\n<p>Date: {{date}}<br>Time: {{time}}<br>Location: {{location}}</p>\n<p>See you there!</p>', category: 'Scheduling', isActive: true },
  { id: 't2', type: 'booking.reminder',     name: 'Booking Reminder',     subject: 'Reminder: {{event_name}} in {{time_until}}',   bodyHtml: '<p>Hi {{attendee_name}},</p>\n<p>Just a reminder that your booking for <strong>{{event_name}}</strong> is coming up.</p>\n<p>Date: {{date}}<br>Time: {{time}}</p>', category: 'Scheduling', isActive: true },
  { id: 't3', type: 'booking.cancellation', name: 'Booking Cancellation', subject: 'Your booking has been cancelled',               bodyHtml: '<p>Hi {{attendee_name}},</p>\n<p>Your booking for <strong>{{event_name}}</strong> has been cancelled.</p>', category: 'Scheduling', isActive: true },
  { id: 't4', type: 'booking.rescheduled',  name: 'Booking Rescheduled',  subject: 'Your booking has been rescheduled',             bodyHtml: '<p>Hi {{attendee_name}},</p>\n<p>Your booking has been rescheduled to {{new_date}} at {{new_time}}.</p>', category: 'Scheduling', isActive: true },
  { id: 't5', type: 'invoice.issued',       name: 'Invoice Issued',       subject: 'Invoice {{invoice_number}} from Kangqore',      bodyHtml: '<p>Hi {{client_name}},</p>\n<p>Please find invoice {{invoice_number}} for {{amount}} attached.</p>', category: 'Finance', isActive: true },
  { id: 't6', type: 'invoice.overdue',      name: 'Invoice Overdue',      subject: 'Reminder: Invoice {{invoice_number}} overdue',  bodyHtml: '<p>Hi {{client_name}},</p>\n<p>Invoice {{invoice_number}} ({{amount}}) is now overdue. Please arrange payment.</p>', category: 'Finance', isActive: true },
  { id: 't7', type: 'onboarding.welcome',   name: 'Welcome — New Client', subject: 'Welcome to Kangqore, {{name}}',                 bodyHtml: '<p>Hi {{name}},</p>\n<p>Welcome to Kangqore. We\'re excited to work with you.</p>', category: 'Onboarding', isActive: true },
  { id: 't8', type: 'investor.update',      name: 'Investor Update',      subject: '{{period}} Update — Kangqore',                  bodyHtml: '<p>Hi {{name}},</p>\n<p>Please find the {{period}} update below.</p>', category: 'Investors', isActive: true },
]

const CATEGORY_COLOR: Record<string, string> = {
  Scheduling: 'bg-blue-950/60 text-blue-400 border border-blue-800/40',
  Finance:    'bg-green-950/60 text-green-400 border border-green-800/40',
  Onboarding: 'bg-purple-950/60 text-purple-400 border border-purple-800/40',
  Investors:  'bg-orange-950/60 text-orange-400 border border-orange-800/40',
}

// ── Edit Drawer ───────────────────────────────────────────────────────────────

function EditDrawer({
  template,
  onClose,
  onSaved,
}: {
  template: EmailTemplate
  onClose: () => void
  onSaved: () => void
}) {
  const qc = useQueryClient()
  const [subject,  setSubject]  = useState(template.subject)
  const [bodyHtml, setBodyHtml] = useState(template.bodyHtml ?? '')
  const [tab,      setTab]      = useState<'subject' | 'body'>('subject')
  const [preview,  setPreview]  = useState(false)

  const save = useMutation({
    mutationFn: () => api.patch(`/scheduling/email-templates/${template.id}`, { subject, bodyHtml }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['email-templates'] })
      onSaved()
      onClose()
    },
  })

  const dirty = subject !== template.subject || bodyHtml !== (template.bodyHtml ?? '')

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-[var(--os-card)] border-l border-[var(--os-border)] z-50 flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--os-border)]">
          <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--os-text-1)] truncate">{template.name ?? template.type}</p>
            <p className="text-xs text-[var(--os-text-3)] font-mono">{template.type}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-2xl hover:bg-[var(--os-border)] transition-colors">
            <X className="w-4 h-4 text-[var(--os-text-2)]" />
          </button>
        </div>

        {/* Tab strip */}
        <div className="flex border-b border-[var(--os-border)] px-5">
          {(['subject', 'body'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-2.5 px-1 mr-5 text-sm font-medium border-b-2 -mb-px transition-all capitalize ${
                tab === t
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-[var(--os-text-3)] hover:text-[var(--os-text-2)]'
              }`}
            >
              {t === 'body' ? 'HTML Body' : 'Subject Line'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {tab === 'subject' ? (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider">
                Subject Line
              </label>
              <input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-[var(--os-bg2)] border border-[var(--os-border)] text-[var(--os-text-1)] text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                placeholder="Subject line with {{variables}}"
              />
              <p className="text-xs text-[var(--os-text-3)]">
                Use <span className="font-mono text-blue-400">{`{{variable_name}}`}</span> for dynamic values.
              </p>
              <div className="mt-4 p-3 rounded-2xl bg-[var(--os-bg2)] border border-[var(--os-border)]">
                <p className="text-xs font-semibold text-[var(--os-text-3)] mb-2 uppercase tracking-wider">Available Variables</p>
                <div className="flex flex-wrap gap-1.5">
                  {['event_name', 'attendee_name', 'date', 'time', 'location', 'time_until', 'invoice_number', 'amount', 'name', 'period', 'client_name', 'new_date', 'new_time'].map(v => (
                    <span key={v} className="font-mono text-xs px-2 py-0.5 rounded bg-blue-900/30 text-blue-400 border border-blue-800/40">
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 h-full">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider">
                  HTML Body
                </label>
                <button
                  onClick={() => setPreview(p => !p)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-2xl transition-all ${
                    preview ? 'bg-blue-900/30 text-blue-400' : 'text-[var(--os-text-3)] hover:text-[var(--os-text-2)]'
                  }`}
                >
                  <Code2 className="w-3 h-3" />
                  {preview ? 'Code' : 'Preview'}
                </button>
              </div>
              {preview ? (
                <div
                  className="min-h-64 p-4 rounded-2xl bg-white text-[#1a1a2e] text-sm leading-relaxed border border-[var(--os-border)] overflow-auto"
                  dangerouslySetInnerHTML={{ __html: safeSanitizeHtml(bodyHtml) }}
                />
              ) : (
                <textarea
                  value={bodyHtml}
                  onChange={e => setBodyHtml(e.target.value)}
                  rows={18}
                  className="w-full px-3 py-2.5 rounded-2xl bg-[var(--os-bg2)] border border-[var(--os-border)] text-[var(--os-text-1)] text-xs font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all resize-none leading-relaxed"
                  placeholder="<p>Hi {{attendee_name}},</p>&#10;<p>Your booking is confirmed...</p>"
                  spellCheck={false}
                />
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-5 py-4 border-t border-[var(--os-border)]">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            size="sm"
            disabled={!dirty || save.isPending}
            onClick={() => save.mutate()}
            className="flex items-center gap-2"
          >
            {save.isPending ? <Spinner size="xs" /> : <Save className="w-3.5 h-3.5" />}
            Save Template
          </Button>
          {save.isError && (
            <p className="text-xs text-red-400">Save failed</p>
          )}
        </div>
      </div>
    </>
  )
}

// ── Collapsible category group ────────────────────────────────────────────────

function CategoryGroup({ category, items, onEdit }: {
  category: string
  items:    EmailTemplate[]
  onEdit:   (t: EmailTemplate) => void
}) {
  const [open, setOpen] = useState(true)
  const colorCls = CATEGORY_COLOR[category] ?? 'bg-[var(--os-bg2)] text-[var(--os-text-2)] border border-[var(--os-border)]'

  return (
    <Card>
      <CardHeader>
        <button
          className="flex items-center gap-2 w-full text-left"
          onClick={() => setOpen(o => !o)}
        >
          {open ? <ChevronDown className="w-4 h-4 text-[var(--os-text-3)]" /> : <ChevronRight className="w-4 h-4 text-[var(--os-text-3)]" />}
          <CardTitle className="flex items-center gap-2 flex-1">
            <Mail className="w-4 h-4 text-blue-400" />
            {category}
          </CardTitle>
          <span className="text-xs text-[var(--os-text-3)] font-medium">{items.length} templates</span>
        </button>
      </CardHeader>

      {open && (
        <CardBody className="p-0">
          <div className="divide-y divide-[var(--os-border)]">
            {items.map(t => (
              <div key={t.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--os-bg2)] transition-colors group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--os-text-1)]">{t.name ?? t.type}</p>
                  <p className="text-xs text-[var(--os-text-2)] truncate font-mono mt-0.5">{t.subject}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorCls}`}>
                    {category}
                  </span>
                  <Badge variant={t.isActive !== false ? 'success' : 'neutral'} size="sm" dot>
                    {t.isActive !== false ? 'Active' : 'Inactive'}
                  </Badge>
                  <button
                    onClick={() => onEdit(t)}
                    title="Edit template"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-2xl hover:bg-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      )}
    </Card>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function EmailTemplatesPage() {
  const { data: apiTemplates, isLoading } = useQuery<EmailTemplate[]>({
    queryKey: ['email-templates'],
    queryFn:  () => api.get('/scheduling/email-templates').then(r => r.data.templates ?? []),
    enabled:  !isDemo(),
    staleTime: 1000 * 60 * 5,
  })

  const [editTemplate, setEditTemplate] = useState<EmailTemplate | null>(null)

  const templates = (apiTemplates?.length ? apiTemplates : FALLBACK_TEMPLATES)
  const byCategory = templates.reduce<Record<string, EmailTemplate[]>>((acc, t) => {
    const cat = t.category ?? 'General'
    ;(acc[cat] = acc[cat] ?? []).push(t)
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

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)]">
          <Spinner size="sm" /> Loading templates…
        </div>
      )}

      <div className="space-y-4">
        {Object.entries(byCategory).map(([category, items]) => (
          <CategoryGroup
            key={category}
            category={category}
            items={items}
            onEdit={t => setEditTemplate(t)}
          />
        ))}
      </div>

      {editTemplate && (
        <EditDrawer
          template={editTemplate}
          onClose={() => setEditTemplate(null)}
          onSaved={() => setEditTemplate(null)}
        />
      )}
    </div>
  )
}
