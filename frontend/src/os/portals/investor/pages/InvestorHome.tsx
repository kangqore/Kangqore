import { TrendingUp, DollarSign, PieChart, ArrowUpRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'
import { Spinner } from '@design-system/components/Spinner'
import { useInvestorsStore } from '@features/investors/store'
import { useAuthStore } from '@store/auth'
import { useInvestorStats, useInvestorUpdates } from '../useInvestorData'
import { isDemo } from '@lib/api'

interface RichUpdate {
  id: string
  type: string
  title: string
  period: string
  sentDate: string
  metrics: {
    mrr: number
    mrrGrowth: number
    arr: number
    customers: number
    nrr: number
    runway: number
    headcount: number
    cashOnHand: number
  }
  highlights: string[]
  challenges: string[]
  askItems: string[]
}

function mapInvestorUpdate(u: any, i: number): RichUpdate {
  return {
    id: u.id ?? `u-${i}`,
    type: u.type?.toLowerCase() ?? 'monthly',
    title: u.title ?? 'Investor Update',
    period: u.period ?? (u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'May 2026'),
    sentDate: u.sentDate ?? (u.createdAt ? u.createdAt.slice(0, 10) : '2026-06-01'),
    metrics: u.metrics ?? {
      mrr: 48500 - (i * 6000),
      mrrGrowth: 14 - i,
      arr: (48500 - (i * 6000)) * 12,
      customers: 23 - (i * 2),
      nrr: 118 - (i * 6),
      runway: 16 + (i * 2),
      headcount: 12 - i,
      cashOnHand: 920 + (i * 130),
    },
    highlights: u.highlights ?? [
      u.content || 'Project delivered — reference case live',
      'eQORE scoring model v2 deployed successfully',
      'Active operations review completed successfully'
    ],
    challenges: u.challenges ?? [
      'AWS cloud usage cost optimization sprint scheduled',
      'Hiring pipeline quality review underway'
    ],
    askItems: u.askItems ?? [
      'Warm intros to growth stage venture investors'
    ]
  }
}

export function InvestorHome() {
  const { user } = useAuthStore()
  const { investors, rounds, updates: mockUpdates } = useInvestorsStore()

  const { isLoading: statsLoading } = useInvestorStats()
  const { data: updatesData, isLoading: updatesLoading } = useInvestorUpdates()

  const myInvestor = investors.find(i => i.status === 'committed') ?? investors[0] ?? { name: 'Investor' }
  const activeRound = rounds.find(r => r.status === 'open')

  const updatesList: RichUpdate[] = Array.isArray(updatesData) && updatesData.length
    ? updatesData.map((u: any, i: number) => mapInvestorUpdate(u, i))
    : mockUpdates.map((u: any, i: number) => mapInvestorUpdate(u, i))

  const latestUpdate = updatesList[0] ?? {
    metrics: { mrr: 0, mrrGrowth: 0, arr: 0, customers: 0, nrr: 0, runway: 0, headcount: 0, cashOnHand: 0 },
    period: 'June 2026',
    highlights: [],
    challenges: [],
    askItems: []
  }
  const m = latestUpdate.metrics

  const MONTHLY_MRR = updatesList.length > 0
    ? updatesList.slice(0, 5).reverse().map(u => ({
        month: u.period.split(' ')[0].slice(0, 3),
        mrr: u.metrics.mrr
      }))
    : [{ month: 'Jun', mrr: 0 }]
  const maxMRR = Math.max(...MONTHLY_MRR.map(m => m.mrr), 1)

  const isLoading = (statsLoading || updatesLoading) && !isDemo()

  return (
    <div className="space-y-8">
      <KIMMPSignalBar module="Investor Dashboard" />
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)]">
          <Spinner size="sm" /> Loading investor data…
        </div>
      )}

      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Welcome back, {user?.name ?? myInvestor.name}</h2>
        <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: 'var(--os-text-2)' }}>Kangqore company overview — as of {latestUpdate.period}</p>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'MRR',    value: `£${(m.mrr / 1000).toFixed(1)}k`, sub: `+${m.mrrGrowth}% MoM`,  bg: 'bg-blue-50',   text: 'text-blue-700'   },
          { label: 'ARR',    value: `£${(m.arr / 1000).toFixed(0)}k`, sub: 'Annualised',             bg: 'bg-green-50',  text: 'text-green-700'  },
          { label: 'NRR',    value: `${m.nrr}%`,                       sub: 'Net Revenue Retention',  bg: 'bg-purple-50', text: 'text-purple-700' },
          { label: 'Runway', value: `${m.runway} mo`,                   sub: `£${m.cashOnHand}k cash`, bg: 'bg-orange-50', text: 'text-orange-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border border-white/60 p-6 ${s.bg}`}>
            <p className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wide mb-2">{s.label}</p>
            <p className={`text-3xl font-bold tracking-tight ${s.text}`}>{s.value}</p>
            <p className="text-xs text-[var(--os-text-2)] mt-1.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MRR chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              MRR Growth
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex items-end gap-3 h-36">
              {MONTHLY_MRR.map((m, i) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-xs font-semibold text-[var(--os-text-1)]">£{(m.mrr / 1000).toFixed(0)}k</span>
                  <div
                    className={`w-full rounded-t-lg ${i === MONTHLY_MRR.length - 1 ? 'bg-blue-500' : 'bg-blue-200'}`}
                    style={{ height: `${(m.mrr / maxMRR) * 110}px` }}
                  />
                  <span className="text-xs text-[var(--os-text-2)]">{m.month}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* My position */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-500" />
              Your Position
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-3">
              {[
                { label: 'Committed',  value: `£${myInvestor.committed}k` },
                { label: 'Ownership', value: `${myInvestor.ownership ?? '—'}%` },
                { label: 'Round',     value: 'Seed' },
                { label: 'Share class', value: 'Series A Preferred' },
              ].map(item => (
                <div key={item.label} className="flex justify-between text-sm pb-2 [&:not(:last-child)]:border-b" style={{ borderColor: 'var(--os-border)' }}>
                  <span className="text-[var(--os-text-2)]">{item.label}</span>
                  <span className="font-semibold" style={{ color: 'var(--os-text-1)' }}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
              Pro-rata rights on next round ✓
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Highlights from latest update */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Latest Update Highlights</CardTitle>
              <Badge variant="info" size="sm">{latestUpdate.period}</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <ul className="space-y-2">
              {latestUpdate.highlights.map((h, i) => (
                <li key={i} className="flex gap-2 text-sm text-[var(--os-text-1)]">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>{h}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        {/* Active fundraise */}
        {activeRound && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-500" />
                {activeRound.name}
                <Badge variant="success" size="sm" dot className="ml-auto">Open</Badge>
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-[var(--os-text-2)]">Target</span>
                  <span className="font-semibold">£{(activeRound.targetAmount / 1000).toFixed(1)}M</span>
                </div>
                <Progress value={Math.round((activeRound.raisedAmount / activeRound.targetAmount) * 100)} color="brand" size="md" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl p-3" style={{ background: 'var(--os-surface)', border: '1px solid var(--os-border)' }}>
                  <p className="text-xs text-[var(--os-text-2)]">Post-Money Val.</p>
                  <p className="font-bold" style={{ color: 'var(--os-text-1)' }}>£{(activeRound.valuation / 1000).toFixed(1)}M</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: 'var(--os-surface)', border: '1px solid var(--os-border)' }}>
                  <p className="text-xs text-[var(--os-text-2)]">Lead Investor</p>
                  <p className="font-bold" style={{ color: 'var(--os-text-1)' }}>TechForward</p>
                </div>
              </div>
              <a href="#" className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-800">
                <ArrowUpRight className="w-3.5 h-3.5" />
                View Series A deck
              </a>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  )
}
