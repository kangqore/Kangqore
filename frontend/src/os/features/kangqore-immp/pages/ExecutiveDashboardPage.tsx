import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BarChart3, TrendingUp, Users, FileText, Plus, Calendar, Download, RefreshCw, Printer, Mail, Check } from 'lucide-react'
import { api } from '@lib/api'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'
const GRN  = '#10b981'
const AMB  = '#f59e0b'
const RED  = '#ef4444'
const BLUE = '#579bfc'
const PURP = '#7c3aed'

interface DashboardData {
  customerCount: number; avgHealthScore: number | null; npsScore: number | null
  signalCount: number; decisionCount: number
  tierBreakdown: { GREEN: number; AMBER: number; RED: number }
  customers: Array<{ customerId: string; latest: any; sparkline: number[] }>
}

interface ReportDoc {
  id: string; customerId: string; title: string; status: string
  dateFrom: string; dateTo: string; generatedBy: string | null; createdAt: string
  data: any
}

interface ScheduledReport {
  id: string; title: string; customerId: string | null; cronExpr: string
  recipients: string[]; template: string; active: boolean; lastRunAt: string | null; nextRunAt: string | null
}

type Tab = 'overview' | 'reports' | 'scheduled'

export function ExecutiveDashboardPage() {
  const qc = useQueryClient()
  const [tab, setTab] = useState<Tab>('overview')
  const [showBuilder, setShowBuilder] = useState(false)
  const [showScheduleForm, setShowScheduleForm] = useState(false)

  const { data: dash, isLoading: dashLoading, refetch } = useQuery<DashboardData>({
    queryKey: ['exec-dashboard'],
    queryFn: () => api.get('/admin/kangqore-immp/reports/executive-dashboard').then(r => r.data),
    staleTime: 60_000,
  })

  const { data: reports = [] } = useQuery<ReportDoc[]>({
    queryKey: ['reports-list'],
    queryFn: () => api.get('/admin/kangqore-immp/reports/customer/list').then(r => r.data),
    staleTime: 30_000,
    enabled: tab === 'reports',
  })

  const { data: scheduled = [] } = useQuery<ScheduledReport[]>({
    queryKey: ['reports-scheduled'],
    queryFn: () => api.get('/admin/kangqore-immp/reports/scheduled').then(r => r.data),
    staleTime: 30_000,
    enabled: tab === 'scheduled',
  })

  const TABS: Array<[Tab, string]> = [['overview', 'Overview'], ['reports', 'Generated Reports'], ['scheduled', 'Scheduled']]

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Header */}
      <div className="rounded-2xl p-5 border" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(87,155,252,0.1)', border: '1px solid rgba(87,155,252,0.2)' }}>
              <BarChart3 className="w-6 h-6" style={{ color: BLUE }} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-base font-bold" style={{ color: T1 }}>Executive Dashboard</p>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'rgba(87,155,252,0.1)', color: BLUE }}>S72</span>
              </div>
              <p className="text-xs" style={{ color: T2 }}>Cross-customer OIS overview, COIG aggregates, platform health, and report generation.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => refetch()} className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg border" style={{ color: T2, borderColor: BDR }}><RefreshCw className="w-3 h-3" /></button>
            <button onClick={() => setShowBuilder(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold" style={{ background: BLUE, color: '#fff' }}><Plus className="w-3.5 h-3.5" /> Build Report</button>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0.5 border-b" style={{ borderColor: BDR }}>
        {TABS.map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all"
            style={tab === t ? { borderColor: BLUE, color: BLUE } : { borderColor: 'transparent', color: T2 }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          {/* KPI grid */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'Active Customers', value: dash?.customerCount ?? '—', color: BLUE, icon: Users },
              { label: 'Avg Health Score', value: dash?.avgHealthScore != null ? `${dash.avgHealthScore}/100` : '—', color: GRN, icon: TrendingUp },
              { label: 'NPS Score', value: dash?.npsScore != null ? dash.npsScore : '—', color: PURP, icon: BarChart3 },
              { label: 'KIMMP Signals', value: dash?.signalCount ?? '—', color: AMB, icon: FileText },
            ].map(s => (
              <div key={s.label} className="rounded-2xl border p-4" style={{ background: CARD, borderColor: BDR }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: T2 }}>{s.label}</p>
                  <s.icon className="w-4 h-4 opacity-50" style={{ color: s.color }} />
                </div>
                <p className="text-2xl font-black" style={{ color: s.color }}>{dashLoading ? '—' : s.value}</p>
              </div>
            ))}
          </div>

          {/* Tier breakdown */}
          {dash?.tierBreakdown && (
            <div className="rounded-2xl border p-5" style={{ background: CARD, borderColor: BDR }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: T2 }}>Customer Health Tiers</p>
              <div className="flex gap-6">
                {([['GREEN', GRN], ['AMBER', AMB], ['RED', RED]] as const).map(([tier, color]) => (
                  <div key={tier} className="flex-1 rounded-xl p-4 text-center" style={{ background: `${color}10`, border: `1px solid ${color}30` }}>
                    <p className="text-3xl font-black mb-1" style={{ color }}>{dash.tierBreakdown[tier]}</p>
                    <p className="text-[10px] font-bold" style={{ color }}>{tier}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer sparklines */}
          {(dash?.customers ?? []).length > 0 && (
            <div className="rounded-2xl border p-5" style={{ background: CARD, borderColor: BDR }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: T2 }}>Customer OIS Sparklines</p>
              <div className="space-y-3">
                {dash!.customers.map(c => {
                  const score = c.latest?.totalScore ?? 0
                  const tier  = c.latest?.tier ?? 'GREEN'
                  const clr   = tier === 'RED' ? RED : tier === 'AMBER' ? AMB : GRN
                  const max   = Math.max(...(c.sparkline.length ? c.sparkline : [100]))
                  return (
                    <div key={c.customerId} className="flex items-center gap-4">
                      <p className="text-xs font-mono w-32 truncate" style={{ color: T1 }}>{c.customerId.slice(0, 12)}…</p>
                      <div className="flex-1 flex items-end gap-1 h-8">
                        {(c.sparkline.length ? c.sparkline : [score]).map((v, i) => (
                          <div key={i} className="flex-1 rounded-t" style={{ height: `${Math.round((v / max) * 32)}px`, background: clr + '80' }} />
                        ))}
                      </div>
                      <span className="text-xs font-bold w-12 text-right font-mono" style={{ color: clr }}>{Math.round(score)}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full w-14 text-center" style={{ background: `${clr}15`, color: clr }}>{tier}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {!dashLoading && !dash?.customers?.length && (
            <div className="py-16 text-center rounded-2xl border" style={{ borderColor: BDR }}>
              <BarChart3 className="w-8 h-8 mx-auto mb-3 opacity-30" style={{ color: T2 }} />
              <p className="text-sm font-medium" style={{ color: T2 }}>No customer health data yet — compute health scores on the Churn Risk page to populate this dashboard.</p>
            </div>
          )}
        </>
      )}

      {tab === 'reports' && (
        <div className="space-y-3">
          {showBuilder && <CustomerReportBuilder qc={qc} onClose={() => setShowBuilder(false)} />}
          {reports.length === 0 && !showBuilder ? (
            <div className="py-16 text-center rounded-2xl border" style={{ borderColor: BDR }}>
              <FileText className="w-8 h-8 mx-auto mb-3 opacity-30" style={{ color: T2 }} />
              <p className="text-sm font-medium mb-3" style={{ color: T2 }}>No reports generated yet</p>
              <button onClick={() => setShowBuilder(true)} className="px-4 py-2 rounded-xl text-xs font-bold" style={{ background: BLUE, color: '#fff' }}>Build First Report</button>
            </div>
          ) : (
            reports.map(r => <ReportCard key={r.id} report={r} />)
          )}
        </div>
      )}

      {tab === 'scheduled' && (
        <div className="space-y-3">
          {showScheduleForm && <ScheduleForm qc={qc} onClose={() => setShowScheduleForm(false)} />}
          <button onClick={() => setShowScheduleForm(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold" style={{ background: PURP, color: '#fff' }}>
            <Plus className="w-3.5 h-3.5" /> Schedule Report
          </button>
          {scheduled.map(s => (
            <div key={s.id} className="rounded-2xl border p-4 flex items-center justify-between" style={{ background: CARD, borderColor: BDR }}>
              <div>
                <p className="text-sm font-bold" style={{ color: T1 }}>{s.title}</p>
                <p className="text-xs mt-0.5" style={{ color: T2 }}>{s.cronExpr} · {s.recipients.join(', ')}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={s.active ? { background: `${GRN}15`, color: GRN } : { background: SURF, color: T2 }}>{s.active ? 'Active' : 'Paused'}</span>
                <span className="text-[10px]" style={{ color: T2 }}>{s.template}</span>
              </div>
            </div>
          ))}
          {scheduled.length === 0 && !showScheduleForm && (
            <div className="py-12 text-center rounded-2xl border" style={{ borderColor: BDR }}>
              <Calendar className="w-8 h-8 mx-auto mb-3 opacity-30" style={{ color: T2 }} />
              <p className="text-sm" style={{ color: T2 }}>No scheduled reports</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ReportCard({ report }: { report: ReportDoc }) {
  const [expanded, setExpanded] = useState(false)
  const d = report.data as any
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: CARD, borderColor: BDR }}>
      <div className="flex items-center justify-between px-5 py-4 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div>
          <p className="text-sm font-bold" style={{ color: T1 }}>{report.title}</p>
          <p className="text-xs mt-0.5" style={{ color: T2 }}>{report.customerId} · {new Date(report.dateFrom).toLocaleDateString()} – {new Date(report.dateTo).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${GRN}15`, color: GRN }}>{report.status}</span>
          <button onClick={e => { e.stopPropagation(); window.print() }} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border" style={{ color: T2, borderColor: BDR }}><Printer className="w-3 h-3" /></button>
        </div>
      </div>
      {expanded && d && (
        <div className="px-5 pb-5 border-t" style={{ borderColor: BDR }}>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {[
              { label: 'OIS Baseline', value: d.oisBaseline != null ? Math.round(d.oisBaseline) : '—', color: BLUE },
              { label: 'OIS Current', value: d.oisCurrent != null ? Math.round(d.oisCurrent) : '—', color: GRN },
              { label: 'OIS Delta', value: d.oisDelta != null ? (d.oisDelta > 0 ? `+${d.oisDelta.toFixed(1)}` : d.oisDelta.toFixed(1)) : '—', color: d.oisDelta > 0 ? GRN : RED },
              { label: 'Avg NPS', value: d.avgNps != null ? d.avgNps : '—', color: PURP },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: SURF }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: T2 }}>{s.label}</p>
                <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>
          {d.topSignals?.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: T2 }}>Top 5 Signals</p>
              <div className="space-y-1">
                {d.topSignals.map((s: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: SURF }}>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: AMB + '20', color: AMB }}>{s.priority?.toUpperCase()}</span>
                    <span className="text-xs flex-1" style={{ color: T1 }}>{s.title}</span>
                    <span className="text-[10px]" style={{ color: T2 }}>{new Date(s.date).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CustomerReportBuilder({ qc, onClose }: { qc: any; onClose: () => void }) {
  const [form, setForm] = useState({ customerId: '', dateFrom: '', dateTo: '', title: '' })
  const [generated, setGenerated] = useState<ReportDoc | null>(null)

  const generate = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/reports/customer/generate', form).then(r => r.data),
    onSuccess: (doc: ReportDoc) => {
      setGenerated(doc)
      qc.invalidateQueries({ queryKey: ['reports-list'] })
    },
  })

  if (generated) {
    return (
      <div className="rounded-2xl border p-5" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${GRN}15` }}><Check className="w-4 h-4" style={{ color: GRN }} /></div>
          <p className="text-sm font-bold" style={{ color: T1 }}>Report generated: {generated.title}</p>
        </div>
        <p className="text-xs mb-4" style={{ color: T2 }}>Switch to "Generated Reports" tab to view and print.</p>
        <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold" style={{ background: SURF, color: T1 }}>Close</button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border p-5 space-y-4" style={{ background: CARD, borderColor: BDR }}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold" style={{ color: T1 }}>Customer Report Builder</p>
        <button onClick={onClose} className="text-xs" style={{ color: T2 }}>Cancel</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {([['customerId', 'Customer ID', 'cust_01'], ['title', 'Report Title (optional)', 'Q3 Review']] as const).map(([field, label, ph]) => (
          <div key={field}>
            <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>{label}</p>
            <input value={(form as any)[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
              placeholder={ph} className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-none"
              style={{ borderColor: BDR, background: SURF, color: T1 }} />
          </div>
        ))}
        <div>
          <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>Date From</p>
          <input type="date" value={form.dateFrom} onChange={e => setForm(f => ({ ...f, dateFrom: e.target.value }))}
            className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-none" style={{ borderColor: BDR, background: SURF, color: T1 }} />
        </div>
        <div>
          <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>Date To</p>
          <input type="date" value={form.dateTo} onChange={e => setForm(f => ({ ...f, dateTo: e.target.value }))}
            className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-none" style={{ borderColor: BDR, background: SURF, color: T1 }} />
        </div>
      </div>
      <button disabled={!form.customerId || !form.dateFrom || !form.dateTo || generate.isPending}
        onClick={() => generate.mutate()}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40"
        style={{ background: BLUE, color: '#fff' }}>
        <Download className="w-4 h-4" />
        {generate.isPending ? 'Generating…' : 'Generate Report'}
      </button>
      {generate.isError && <p className="text-xs" style={{ color: RED }}>Failed to generate report. Ensure customer has health scores recorded.</p>}
    </div>
  )
}

function ScheduleForm({ qc, onClose }: { qc: any; onClose: () => void }) {
  const [form, setForm] = useState({ title: '', cronExpr: '0 9 * * MON', recipients: '', template: 'EXECUTIVE', customerId: '' })

  const create = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/reports/scheduled', { ...form, recipients: form.recipients.split(',').map(r => r.trim()).filter(Boolean) }).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['reports-scheduled'] }); onClose() },
  })

  return (
    <div className="rounded-2xl border p-5 space-y-4" style={{ background: CARD, borderColor: BDR }}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold" style={{ color: T1 }}>Schedule Recurring Report</p>
        <button onClick={onClose} className="text-xs" style={{ color: T2 }}>Cancel</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {([['title', 'Report Title', 'Weekly Executive Summary'], ['cronExpr', 'Cron Expression', '0 9 * * MON'], ['recipients', 'Recipients (comma-separated)', 'ceo@co.com, coo@co.com'], ['customerId', 'Customer ID (optional)', '']] as const).map(([f, label, ph]) => (
          <div key={f}>
            <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>{label}</p>
            <input value={(form as any)[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
              placeholder={ph} className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-none"
              style={{ borderColor: BDR, background: SURF, color: T1 }} />
          </div>
        ))}
        <div>
          <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>Template</p>
          <select value={form.template} onChange={e => setForm(p => ({ ...p, template: e.target.value }))}
            className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-none" style={{ borderColor: BDR, background: SURF, color: T1 }}>
            {['EXECUTIVE', 'HEALTH', 'COMPLIANCE'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <button disabled={!form.title || !form.cronExpr || !form.recipients || create.isPending}
        onClick={() => create.mutate()}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40"
        style={{ background: PURP, color: '#fff' }}>
        <Mail className="w-4 h-4" />
        {create.isPending ? 'Scheduling…' : 'Schedule Report'}
      </button>
    </div>
  )
}
