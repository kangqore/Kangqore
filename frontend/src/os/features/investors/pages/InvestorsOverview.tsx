import { TrendingUp, Users, DollarSign, Target, CheckCircle2, Clock, UserCheck } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Avatar } from '@design-system/components/Avatar'
import { Progress } from '@design-system/components/Progress'
import { useInvestorsStore } from '../store'

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-1/3 rounded bg-slate-700" />
        <div className="h-2.5 w-1/4 rounded bg-slate-800" />
      </div>
      <div className="h-5 w-16 rounded-full bg-slate-700" />
    </div>
  )
}

const STATUS_COLOR: Record<string, string> = {
  committed: '#00c875', engaged: '#579bfc', prospect: '#9aa0b0', passed: '#e2445c', active: '#00c875',
}

const TYPE_LABEL: Record<string, string> = {
  vc: 'VC', angel: 'Angel', pe: 'PE', 'family-office': 'Family Office',
  corporate: 'Corporate', accelerator: 'Accelerator',
}

export function InvestorsOverview() {
  const { investors, rounds, isLoading } = useInvestorsStore()

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="os-card p-5 h-24 animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="os-card p-5 h-64 animate-pulse" />
          <Card className="lg:col-span-2">
            <CardBody className="p-0 divide-y divide-[var(--os-border)]">
              {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }

  if (investors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Users className="w-12 h-12 text-[var(--os-text-2)]" />
        <p className="text-[var(--os-text-2)] font-medium">No investors yet</p>
        <p className="text-[var(--os-text-2)] text-sm">Investor records will appear here once added.</p>
      </div>
    )
  }

  const committed   = investors.filter(i => i.status === 'committed')
  const engaged     = investors.filter(i => i.status === 'engaged')
  const prospects   = investors.filter(i => i.status === 'prospect')
  const totalRaised = committed.reduce((s, i) => s + i.committed, 0)
  const activeRound = rounds.find(r => r.status === 'open')
  const seriesAProgress = activeRound
    ? Math.round((activeRound.raisedAmount / activeRound.targetAmount) * 100)
    : 0

  return (
    <div className="space-y-8">
      {/* Stat header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Invested',   value: `₹${(totalRaised / 1000).toFixed(1)}M`,  sub: 'Seed closed',              bg: 'linear-gradient(135deg,#00c875 0%,#00a86b 100%)', glow: '#00c875' },
          { label: 'Active Investors', value: committed.length,                          sub: `${engaged.length} engaged`, bg: 'linear-gradient(135deg,#2564ea 0%,#4ab6d4 100%)', glow: '#2564ea' },
          { label: 'Active Round',     value: activeRound ? `₹${(activeRound.targetAmount / 1000).toFixed(1)}M` : '—', sub: activeRound?.name ?? 'None open', bg: 'linear-gradient(135deg,#7c3aed 0%,#9d4edd 100%)', glow: '#7c3aed' },
          { label: 'Prospects',        value: investors.filter(i => i.status !== 'passed').length,                       sub: `${prospects.length} prospects`,  bg: 'linear-gradient(135deg,#fdab3d 0%,#f59e0b 100%)', glow: '#fdab3d' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-5 relative overflow-hidden" style={{ background: s.bg, boxShadow: `0 4px 20px ${s.glow}40` }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.30) 0%, transparent 60%)' }} />
            <p className="relative text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{s.label}</p>
            <p className="relative text-3xl font-black tracking-tight" style={{ color: '#ffffff' }}>{s.value}</p>
            <p className="relative text-[11px] mt-1.5" style={{ color: 'rgba(255,255,255,0.72)' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active fundraising round */}
        {activeRound && (
          <div className="os-card p-5 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4" style={{ color: '#579bfc' }} />
              <h3 className="font-semibold text-[var(--os-text-1)]">{activeRound.name}</h3>
              <span className="ml-auto text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: '#579bfc20', color: '#579bfc' }}>Open</span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-[var(--os-text-2)]">Raised</span>
                  <span className="font-semibold text-[var(--os-text-1)]">
                    ₹{(activeRound.raisedAmount / 1000).toFixed(1)}M / ₹{(activeRound.targetAmount / 1000).toFixed(1)}M
                  </span>
                </div>
                <Progress value={seriesAProgress} color="brand" size="md" showValue />
              </div>
              <div className="text-sm text-[var(--os-text-2)]">
                Post-money valuation: <span className="font-semibold text-[var(--os-text-1)]">₹{(activeRound.valuation / 1000).toFixed(1)}M</span>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-widest">Use of Funds</p>
                {activeRound.useOfFunds.map(uf => (
                  <div key={uf.category} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#579bfc' }} />
                    <span className="text-sm text-[var(--os-text-1)] flex-1">{uf.category}</span>
                    <span className="text-sm font-medium text-[var(--os-text-1)]">{uf.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Investor list */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>All Investors & Pipeline</CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-[var(--os-border)]">
              {investors.map(inv => {
                const sc = STATUS_COLOR[inv.status] ?? '#9aa0b0'
                return (
                  <div key={inv.id} className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--os-surface-0)] transition-colors">
                    <Avatar name={inv.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[var(--os-text-1)] truncate">{inv.name}</p>
                        {inv.leadInvestor && (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: '#579bfc20', color: '#579bfc' }}>Lead</span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--os-text-2)] truncate">{inv.firm} · {TYPE_LABEL[inv.type]}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      {inv.committed > 0 ? (
                        <p className="text-sm font-semibold text-[var(--os-text-1)]">₹{inv.committed}k</p>
                      ) : (
                        <p className="text-sm text-[var(--os-text-2)]">—</p>
                      )}
                      <p className="text-xs text-[var(--os-text-2)]">
                        ₹{inv.checkSize.min}k–{inv.checkSize.max > 999
                          ? `${(inv.checkSize.max / 1000).toFixed(0)}M`
                          : `${inv.checkSize.max}k`} range
                      </p>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0" style={{ background: `${sc}20`, color: sc }}>
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent touchpoints */}
      <div className="os-card overflow-hidden">
        <div className="px-5 pt-5 pb-3 border-b border-[var(--os-border)]">
          <h3 className="font-semibold text-[var(--os-text-1)]">Recent Touchpoints</h3>
        </div>
        <div className="divide-y divide-[var(--os-border)]">
          {investors
            .filter(i => i.status !== 'passed')
            .sort((a, b) => b.lastContact.localeCompare(a.lastContact))
            .slice(0, 6)
            .map(inv => (
              <div key={inv.id} className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--os-surface-0)]">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: inv.status === 'committed' ? '#00c87520' : '#9aa0b020' }}>
                  {inv.status === 'committed'
                    ? <CheckCircle2 className="w-4 h-4" style={{ color: '#00c875' }} />
                    : <Clock className="w-4 h-4 text-[var(--os-text-2)]" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--os-text-1)]">{inv.name} — {inv.firm}</p>
                  <p className="text-xs text-[var(--os-text-2)] truncate line-clamp-1">{inv.notes}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-[var(--os-text-2)]">Last: {inv.lastContact}</p>
                  {inv.nextFollowUp && (
                    <p className="text-xs font-medium" style={{ color: '#579bfc' }}>Next: {inv.nextFollowUp}</p>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
