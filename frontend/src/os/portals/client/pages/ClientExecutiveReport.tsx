import { Printer, TrendingUp, AlertTriangle, CheckCircle2, FileText, Calendar } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { Progress } from '@design-system/components/Progress'
import { Divider } from '@design-system/components/Divider'
import { useClientProjects, useClientInvoices } from '../useClientData'

// ─── mock data ────────────────────────────────────────────────────────────────

const MOCK_PROJECTS = [
  { id: 'p1', name: 'Patient Portal v2',      progress: 68, status: 'on-track',  health: 'on-track', budget: 180000, spent: 98000,  nextMilestone: 'Beta release',   milestoneDate: '2026-06-20' },
  { id: 'p2', name: 'HIPAA Compliance Layer', progress: 91, status: 'on-track',  health: 'on-track', budget: 95000,  spent: 87000,  nextMilestone: 'Sign-off',       milestoneDate: '2026-06-10' },
  { id: 'p3', name: 'Analytics Dashboard',    progress: 32, status: 'at-risk',   health: 'at-risk',  budget: 140000, spent: 45000,  nextMilestone: 'Design review',  milestoneDate: '2026-06-08' },
]

const MOCK_RISKS = [
  { id: 'r1', title: 'HIPAA compliance gap — audit logging incomplete', severity: 'CRITICAL', status: 'OPEN' },
  { id: 'r2', title: 'Analytics dashboard client milestone sign-off delayed', severity: 'MEDIUM', status: 'OPEN' },
]

const RECENT_ACTIVITY = [
  { id: 'a1', type: 'delivery',  label: 'Sprint 13 build deployed to staging',  date: '2026-06-02' },
  { id: 'a2', type: 'document',  label: 'HIPAA audit Phase 2 report shared',    date: '2026-05-30' },
  { id: 'a3', type: 'meeting',   label: 'Monthly steering committee completed', date: '2026-05-28' },
  { id: 'a4', type: 'invoice',   label: 'Invoice INV-2026-043 issued (£24,500)', date: '2026-05-25' },
  { id: 'a5', type: 'milestone', label: 'Patient Portal beta scope finalised',  date: '2026-05-20' },
]

const ACTIVITY_ICON: Record<string, React.ReactNode> = {
  delivery:  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />,
  document:  <FileText    className="w-3.5 h-3.5 text-blue-500"  />,
  meeting:   <Calendar    className="w-3.5 h-3.5 text-purple-500"/>,
  invoice:   <FileText    className="w-3.5 h-3.5 text-amber-500" />,
  milestone: <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />,
}

const SEV_V: Record<string, 'danger' | 'warning' | 'info' | 'neutral'> = {
  CRITICAL: 'danger', HIGH: 'warning', MEDIUM: 'info', LOW: 'neutral',
}
const HEALTH_V: Record<string, 'success' | 'warning' | 'danger'> = {
  'on-track': 'success', 'at-risk': 'warning', 'behind': 'danger', 'completed': 'info' as any,
}

const fmt     = (n: number) => `£${n.toLocaleString()}`
const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
const today   = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

// ─── page ─────────────────────────────────────────────────────────────────────

export function ClientExecutiveReport() {
  const { data: apiProjects } = useClientProjects()
  const { data: apiInvoices } = useClientInvoices()

  const projects = (apiProjects as typeof MOCK_PROJECTS | undefined)?.length ? apiProjects as typeof MOCK_PROJECTS : MOCK_PROJECTS
  const invoices = (apiInvoices as any[] | undefined) ?? []

  const totalInvoiced  = invoices.length
    ? invoices.reduce((s: number, i: any) => s + Number(i.amount ?? 0), 0)
    : 346500
  const totalCollected = invoices.length
    ? invoices.filter((i: any) => i.status === 'paid').reduce((s: number, i: any) => s + Number(i.amount ?? 0), 0)
    : 230000
  const outstanding    = totalInvoiced - totalCollected

  const onTrack   = projects.filter(p => p.health === 'on-track').length
  const atRisk    = projects.filter(p => p.health === 'at-risk').length
  const openRisks = MOCK_RISKS.filter(r => r.status === 'OPEN').length

  return (
    <div className="space-y-6 max-w-3xl" id="executive-report">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Executive Report</h2>
          <p className="text-sm text-slate-500 mt-0.5">Kangqore × GlobeMed Group · Generated {today}</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Printer className="w-4 h-4" />}
          onClick={() => window.print()}
        >
          Print / Export
        </Button>
      </div>

      {/* Portfolio summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="text-center py-4">
          <div className="text-2xl font-bold text-white">{projects.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Active projects</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-2xl font-bold text-green-600">{onTrack}</div>
          <div className="text-xs text-slate-500 mt-0.5">On track</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-2xl font-bold text-amber-600">{atRisk}</div>
          <div className="text-xs text-slate-500 mt-0.5">At risk</div>
        </Card>
        <Card className="text-center py-4">
          <div className={`text-2xl font-bold ${openRisks > 0 ? 'text-red-600' : 'text-slate-500'}`}>{openRisks}</div>
          <div className="text-xs text-slate-500 mt-0.5">Open risks</div>
        </Card>
      </div>

      {/* Projects */}
      <Card>
        <CardHeader><CardTitle>Projects</CardTitle></CardHeader>
        <div className="space-y-4 mt-2">
          {projects.map(p => (
            <div key={p.id}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-slate-200">{p.name}</span>
                    <Badge variant={HEALTH_V[p.health] ?? 'neutral'} dot size="sm">{p.health}</Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    Budget: {fmt(p.spent)} spent / {fmt(p.budget)} approved ·{' '}
                    Next: <span className="font-medium">{p.nextMilestone}</span> by {fmtDate(p.milestoneDate)}
                  </p>
                </div>
                <span className="text-sm font-bold text-slate-300 flex-shrink-0">{p.progress}%</span>
              </div>
              <Progress value={p.progress} size="sm" color={p.health === 'at-risk' ? 'warning' : p.health === 'behind' ? 'danger' : 'brand'} />
            </div>
          ))}
        </div>
      </Card>

      {/* Finance */}
      <Card>
        <CardHeader><CardTitle>Financial summary</CardTitle></CardHeader>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div className="text-center p-3 bg-[#0F172A] rounded-xl">
            <TrendingUp className="w-4 h-4 text-blue-500 mx-auto mb-1" />
            <div className="text-lg font-bold text-slate-200">{fmt(totalInvoiced)}</div>
            <div className="text-[11px] text-slate-500">Total invoiced</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-700">{fmt(totalCollected)}</div>
            <div className="text-[11px] text-slate-500">Collected</div>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-xl">
            <FileText className="w-4 h-4 text-amber-500 mx-auto mb-1" />
            <div className="text-lg font-bold text-amber-700">{fmt(outstanding)}</div>
            <div className="text-[11px] text-slate-500">Outstanding</div>
          </div>
        </div>
      </Card>

      {/* Open risks */}
      {MOCK_RISKS.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Open Risks
          </CardTitle></CardHeader>
          <div className="space-y-2 mt-2">
            {MOCK_RISKS.map(r => (
              <div key={r.id} className="flex items-center gap-3 py-2">
                <Badge variant={SEV_V[r.severity]} size="sm">{r.severity}</Badge>
                <span className="text-sm text-slate-300 flex-1">{r.title}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent activity */}
      <Card>
        <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
        <div className="space-y-0 mt-2">
          {RECENT_ACTIVITY.map((item, i) => (
            <div key={item.id}>
              {i > 0 && <Divider className="my-0" />}
              <div className="flex items-center gap-3 py-3">
                {ACTIVITY_ICON[item.type]}
                <span className="flex-1 text-sm text-slate-300">{item.label}</span>
                <span className="text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">{fmtDate(item.date)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
