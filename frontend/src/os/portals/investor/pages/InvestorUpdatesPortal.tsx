import { useState } from 'react'
import { Send, TrendingUp, TrendingDown, Users, CheckCircle2, AlertCircle } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { useInvestorsStore } from '@features/investors/store'

import { useInvestorUpdates } from '../useInvestorData'
import { isDemo } from '@lib/api'
import { Spinner } from '@design-system/components/Spinner'

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

function MetricTile({ label, value, sub, trend }: { label: string; value: string | number; sub?: string; trend?: 'up' | 'down' }) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'var(--os-surface)', border: '1px solid var(--os-border)' }}>
      <p className="text-xs text-[var(--os-text-2)] mb-1">{label}</p>
      <div className="flex items-end gap-1.5">
        <p className="text-xl font-bold" style={{ color: 'var(--os-text-1)' }}>{value}</p>
        {trend === 'up'   && <TrendingUp   className="w-4 h-4 text-green-500 mb-0.5" />}
        {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500 mb-0.5"   />}
      </div>
      {sub && <p className="text-xs text-[var(--os-text-2)] mt-0.5">{sub}</p>}
    </div>
  )
}

export function InvestorUpdatesPortal() {
  const { data: updatesData, isLoading } = useInvestorUpdates()
  const { updates: mockUpdates } = useInvestorsStore()

  const updates: RichUpdate[] = Array.isArray(updatesData) && updatesData.length
    ? updatesData.map((u: any, i: number) => mapInvestorUpdate(u, i))
    : mockUpdates.map((u: any, i: number) => mapInvestorUpdate(u, i))

  const [openId, setOpenId] = useState<string>(updates[0]?.id ?? '')

  return (
    <div className="space-y-6">
      <KIMMPSignalBar module="Investor Updates" />
      {isLoading && !isDemo() && (
        <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)] mb-4">
          <Spinner size="sm" /> Loading announcements…
        </div>
      )}
      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Investor Updates</h2>
        <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: 'var(--os-text-2)' }}>Monthly and milestone updates from the Kangqore team</p>
      </div>

      <div className="space-y-4">
        {updates.map(u => {
          const m = u.metrics
          const isOpen = openId === u.id
          return (
            <Card key={u.id} className="overflow-hidden">
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[var(--os-surface)] transition-colors"
                onClick={() => setOpenId(isOpen ? '' : u.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Send className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--os-text-1)' }}>{u.title}</p>
                    <p className="text-xs text-[var(--os-text-2)]">Sent {u.sentDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>£{(m.mrr / 1000).toFixed(0)}k MRR</p>
                    <p className="text-xs text-green-600">+{m.mrrGrowth}% MoM</p>
                  </div>
                  <Badge variant={isOpen ? 'brand' : 'neutral'} size="sm">{isOpen ? 'Reading' : 'View'}</Badge>
                </div>
              </div>

              {isOpen && (
                <div className="px-5 pb-5 pt-4 space-y-5" style={{ borderTop: '1px solid var(--os-border)' }}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <MetricTile label="MRR"       value={`£${(m.mrr / 1000).toFixed(1)}k`} sub={`+${m.mrrGrowth}% MoM`} trend="up" />
                    <MetricTile label="ARR"       value={`£${(m.arr / 1000).toFixed(0)}k`} sub="Annualised" trend="up" />
                    <MetricTile label="Customers" value={m.customers}                       sub={`NRR ${m.nrr}%`} trend={m.nrr >= 100 ? 'up' : 'down'} />
                    <MetricTile label="Runway"    value={`${m.runway}mo`}                   sub={`£${m.cashOnHand}k cash`} trend={m.runway >= 12 ? 'up' : 'down'} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <p className="text-sm font-semibold text-[var(--os-text-1)]">Highlights</p>
                      </div>
                      <ul className="space-y-1.5">
                        {u.highlights.map((h, i) => (
                          <li key={i} className="text-sm text-[var(--os-text-2)] flex gap-2">
                            <span className="text-green-500 flex-shrink-0">•</span>{h}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        <p className="text-sm font-semibold text-[var(--os-text-1)]">Challenges</p>
                      </div>
                      <ul className="space-y-1.5">
                        {u.challenges.map((c, i) => (
                          <li key={i} className="text-sm text-[var(--os-text-2)] flex gap-2">
                            <span className="text-orange-500 flex-shrink-0">•</span>{c}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <p className="text-sm font-semibold text-[var(--os-text-1)]">Ask</p>
                      </div>
                      <ul className="space-y-1.5">
                        {u.askItems.map((a, i) => (
                          <li key={i} className="text-sm text-[var(--os-text-2)] flex gap-2">
                            <span className="text-blue-500 flex-shrink-0">•</span>{a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
