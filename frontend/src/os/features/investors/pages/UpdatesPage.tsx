import { useState } from 'react'
import { Send, TrendingUp, TrendingDown, Users, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@design-system/components/Button'
import { useInvestorsStore } from '../store'
import type { InvestorUpdate } from '../types'

function MetricTile({ label, value, sub, trend }: { label: string; value: string | number; sub?: string; trend?: 'up' | 'down' | 'neutral' }) {
  return (
    <div className="os-card p-4">
      <p className="text-[10px] text-[var(--os-text-2)] uppercase tracking-widest font-semibold mb-1">{label}</p>
      <div className="flex items-end gap-1.5">
        <p className="text-xl font-black text-[var(--os-text-1)]">{value}</p>
        {trend && trend !== 'neutral' && (
          trend === 'up'
            ? <TrendingUp className="w-4 h-4 mb-0.5" style={{ color: '#00c875' }} />
            : <TrendingDown className="w-4 h-4 mb-0.5" style={{ color: '#e2445c' }} />
        )}
      </div>
      {sub && <p className="text-xs text-[var(--os-text-2)] mt-0.5">{sub}</p>}
    </div>
  )
}

// Update status badge colors per spec
const UPDATE_STATUS_COLOR = {
  sent:      '#00c875',
  draft:     '#fdab3d',
  scheduled: '#579bfc',
}

function UpdateCard({ update, isOpen, onToggle }: { update: InvestorUpdate; isOpen: boolean; onToggle: () => void }) {
  const m = update.metrics
  // Infer status from update: if sentDate is in the past treat as sent
  const today = new Date().toISOString().slice(0, 10)
  const status = update.sentDate <= today ? 'sent' : 'scheduled'
  const sc = UPDATE_STATUS_COLOR[status]

  return (
    <div className="os-card overflow-hidden">
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[var(--os-surface-0)] transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: '#579bfc18' }}>
            <Send className="w-4 h-4" style={{ color: '#579bfc' }} />
          </div>
          <div>
            <p className="font-semibold text-[var(--os-text-1)]">{update.title}</p>
            <p className="text-xs text-[var(--os-text-2)]">Sent {update.sentDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-[var(--os-text-1)]">₹{(m.mrr / 1000).toFixed(0)}k MRR</p>
            <p className="text-xs font-semibold" style={{ color: '#00c875' }}>+{m.mrrGrowth}% MoM</p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: `${sc}20`, color: sc }}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-[var(--os-border)] px-5 pb-5 pt-4 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricTile label="MRR" value={`₹${(m.mrr / 1000).toFixed(1)}k`} sub={`+${m.mrrGrowth}% MoM`} trend="up" />
            <MetricTile label="ARR" value={`₹${(m.arr / 1000).toFixed(0)}k`} sub="Annualised" trend="up" />
            <MetricTile label="Customers" value={m.customers} sub={`NRR ${m.nrr}%`} trend={m.nrr >= 100 ? 'up' : 'down'} />
            <MetricTile label="Runway" value={`${m.runway}mo`} sub={`₹${m.cashOnHand}k cash`} trend={m.runway >= 12 ? 'up' : 'down'} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Highlights */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4" style={{ color: '#00c875' }} />
                <p className="text-sm font-semibold text-[var(--os-text-1)]">Highlights</p>
              </div>
              <ul className="space-y-1.5">
                {update.highlights.map((h, i) => (
                  <li key={i} className="text-sm text-[var(--os-text-2)] flex gap-2">
                    <span className="mt-0.5 flex-shrink-0" style={{ color: '#00c875' }}>•</span>{h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Challenges */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4" style={{ color: '#fdab3d' }} />
                <p className="text-sm font-semibold text-[var(--os-text-1)]">Challenges</p>
              </div>
              <ul className="space-y-1.5">
                {update.challenges.map((c, i) => (
                  <li key={i} className="text-sm text-[var(--os-text-2)] flex gap-2">
                    <span className="mt-0.5 flex-shrink-0" style={{ color: '#fdab3d' }}>•</span>{c}
                  </li>
                ))}
              </ul>
            </div>

            {/* Asks */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4" style={{ color: '#579bfc' }} />
                <p className="text-sm font-semibold text-[var(--os-text-1)]">Asks</p>
              </div>
              <ul className="space-y-1.5">
                {update.askItems.map((a, i) => (
                  <li key={i} className="text-sm text-[var(--os-text-2)] flex gap-2">
                    <span className="mt-0.5 flex-shrink-0" style={{ color: '#579bfc' }}>•</span>{a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function UpdatesPage() {
  const { updates, isLoading } = useInvestorsStore()
  const [openId, setOpenId] = useState<string>(updates[0]?.id ?? '')

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5 animate-pulse">
            <div className="h-5 w-40 rounded bg-slate-700" />
            <div className="h-3.5 w-64 rounded bg-slate-800" />
          </div>
          <div className="h-8 w-28 rounded-2xl bg-slate-700 animate-pulse" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="os-card p-5 h-20 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (updates.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[var(--os-text-2)] font-semibold mb-1">Investor Relations</p>
            <h2 className="text-lg font-bold text-[var(--os-text-1)]">Investor Updates</h2>
            <p className="text-sm text-[var(--os-text-2)] mt-0.5">Monthly and milestone updates sent to shareholders</p>
          </div>
          <Button size="sm" leftIcon={<Send className="w-3.5 h-3.5" />}>Draft Update</Button>
        </div>
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Send className="w-10 h-10 text-[var(--os-text-2)]" />
          <p className="text-[var(--os-text-2)] font-medium">No updates sent yet</p>
          <p className="text-[var(--os-text-2)] text-sm">Draft your first investor update to share progress.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[var(--os-text-2)] font-semibold mb-1">Investor Relations</p>
          <h2 className="text-lg font-bold text-[var(--os-text-1)]">Investor Updates</h2>
          <p className="text-sm text-[var(--os-text-2)] mt-0.5">Monthly and milestone updates sent to shareholders</p>
        </div>
        <Button size="sm" leftIcon={<Send className="w-3.5 h-3.5" />}>Draft Update</Button>
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
