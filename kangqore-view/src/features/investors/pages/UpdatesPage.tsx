import { useState } from 'react'
import { Send, TrendingUp, TrendingDown, Users, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { useInvestorsStore } from '../store'
import type { InvestorUpdate } from '../types'

function MetricTile({ label, value, sub, trend }: { label: string; value: string | number; sub?: string; trend?: 'up' | 'down' | 'neutral' }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <div className="flex items-end gap-1.5">
        <p className="text-xl font-bold text-slate-900">{value}</p>
        {trend && trend !== 'neutral' && (
          trend === 'up'
            ? <TrendingUp className="w-4 h-4 text-green-500 mb-0.5" />
            : <TrendingDown className="w-4 h-4 text-red-500 mb-0.5" />
        )}
      </div>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  )
}

function UpdateCard({ update, isOpen, onToggle }: { update: InvestorUpdate; isOpen: boolean; onToggle: () => void }) {
  const m = update.metrics
  return (
    <Card className="overflow-hidden">
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <Send className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{update.title}</p>
            <p className="text-xs text-slate-500">Sent {update.sentDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900">£{(m.mrr / 1000).toFixed(0)}k MRR</p>
            <p className="text-xs text-green-600">+{m.mrrGrowth}% MoM</p>
          </div>
          <Badge variant={isOpen ? 'brand' : 'neutral'} size="sm">{isOpen ? 'Open' : 'View'}</Badge>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-5">
          {/* Metrics grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricTile label="MRR" value={`£${(m.mrr / 1000).toFixed(1)}k`} sub={`+${m.mrrGrowth}% MoM`} trend="up" />
            <MetricTile label="ARR" value={`£${(m.arr / 1000).toFixed(0)}k`} sub="Annualised" trend="up" />
            <MetricTile label="Customers" value={m.customers} sub={`NRR ${m.nrr}%`} trend={m.nrr >= 100 ? 'up' : 'down'} />
            <MetricTile label="Runway" value={`${m.runway}mo`} sub={`£${m.cashOnHand}k cash`} trend={m.runway >= 12 ? 'up' : 'down'} />
            <MetricTile label="Headcount" value={m.headcount} sub="FTE" trend="neutral" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Highlights */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <p className="text-sm font-semibold text-slate-700">Highlights</p>
              </div>
              <ul className="space-y-1.5">
                {update.highlights.map((h, i) => (
                  <li key={i} className="text-sm text-slate-600 flex gap-2">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>{h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Challenges */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <p className="text-sm font-semibold text-slate-700">Challenges</p>
              </div>
              <ul className="space-y-1.5">
                {update.challenges.map((c, i) => (
                  <li key={i} className="text-sm text-slate-600 flex gap-2">
                    <span className="text-orange-500 mt-0.5 flex-shrink-0">•</span>{c}
                  </li>
                ))}
              </ul>
            </div>

            {/* Ask items */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-500" />
                <p className="text-sm font-semibold text-slate-700">Asks</p>
              </div>
              <ul className="space-y-1.5">
                {update.askItems.map((a, i) => (
                  <li key={i} className="text-sm text-slate-600 flex gap-2">
                    <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>{a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

export function UpdatesPage() {
  const { updates } = useInvestorsStore()
  const [openId, setOpenId] = useState<string>(updates[0]?.id ?? '')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Investor Updates</h2>
          <p className="text-sm text-slate-500 mt-0.5">Monthly and milestone updates sent to shareholders</p>
        </div>
        <Button size="sm" leftIcon={<Send className="w-3.5 h-3.5" />}>
          Draft Update
        </Button>
      </div>

      <div className="space-y-4">
        {updates.map(u => (
          <UpdateCard
            key={u.id}
            update={u}
            isOpen={openId === u.id}
            onToggle={() => setOpenId(openId === u.id ? '' : u.id)}
          />
        ))}
      </div>
    </div>
  )
}
