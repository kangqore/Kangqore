import { Mail, Phone, MapPin, Globe, ChevronRight, Users } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Avatar } from '@design-system/components/Avatar'
import { useInvestorsStore } from '../store'

const STATUS_COLOR: Record<string, string> = {
  committed: '#00c875', engaged: '#579bfc', prospect: '#9aa0b0', passed: '#e2445c', active: '#00c875',
}

const TYPE_LABEL: Record<string, string> = {
  vc: 'Venture Capital', angel: 'Angel Investor', pe: 'Private Equity',
  'family-office': 'Family Office', corporate: 'Corporate VC', accelerator: 'Accelerator',
}

const STAGE_LABEL: Record<string, string> = {
  'pre-seed': 'Pre-Seed', seed: 'Seed', 'series-a': 'Series A',
  'series-b': 'Series B', growth: 'Growth', bridge: 'Bridge',
}

export function InvestorProfile() {
  const { investors, isLoading, selectedId, setSelected } = useInvestorsStore()
  const investor = investors.find(i => i.id === selectedId) ?? investors[0]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
        <div className="os-card p-5 h-96" />
        <div className="lg:col-span-2 space-y-5">
          <div className="os-card p-5 h-40" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="os-card p-4 h-16" />)}
          </div>
          <div className="os-card p-5 h-32" />
        </div>
      </div>
    )
  }

  if (!investor) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Users className="w-12 h-12 text-[var(--os-text-2)]" />
        <p className="text-[var(--os-text-2)] font-medium">No investor selected</p>
        <p className="text-[var(--os-text-2)] text-sm">Select an investor from the list to view their profile.</p>
      </div>
    )
  }

  const sc = STATUS_COLOR[investor.status] ?? '#9aa0b0'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Investor selector list */}
      <Card className="lg:col-span-1 h-fit">
        <CardHeader>
          <CardTitle>Investors</CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-[var(--os-border)]">
            {investors.map(inv => {
              const isc = STATUS_COLOR[inv.status] ?? '#9aa0b0'
              return (
                <button
                  key={inv.id}
                  onClick={() => setSelected(inv.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--os-surface-0)] ${
                    inv.id === selectedId ? 'bg-[#579bfc]/10 border-l-2 border-[#579bfc]' : ''
                  }`}
                >
                  <Avatar name={inv.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--os-text-1)] truncate">{inv.name}</p>
                    <p className="text-xs text-[var(--os-text-2)] truncate">{inv.firm}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: isc }} />
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--os-text-2)]" />
                  </div>
                </button>
              )
            })}
          </div>
        </CardBody>
      </Card>

      {/* Profile detail */}
      <div className="lg:col-span-2 space-y-5">
        {/* Header */}
        <div className="os-card p-6">
          <div className="flex items-start gap-5">
            <Avatar name={investor.name} size="xl" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-xl font-bold text-[var(--os-text-1)]">{investor.name}</h2>
                  <p className="text-sm text-[var(--os-text-2)] mt-0.5">{investor.firm} · {TYPE_LABEL[investor.type]}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5" style={{ background: `${sc}20`, color: sc }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc }} />
                    {investor.status.charAt(0).toUpperCase() + investor.status.slice(1)}
                  </span>
                  {investor.leadInvestor && (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: '#579bfc20', color: '#579bfc' }}>Lead Investor</span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-[var(--os-text-2)]">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{investor.email}</span>
                {investor.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{investor.phone}</span>}
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{investor.country}</span>
                <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" />{investor.portfolio} portfolio cos.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Investment details grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Check Size', value: `₹${investor.checkSize.min}k – ₹${investor.checkSize.max > 999 ? `${(investor.checkSize.max / 1000).toFixed(0)}M` : `${investor.checkSize.max}k`}` },
            { label: 'Committed', value: investor.committed > 0 ? `₹${investor.committed}k` : '—' },
            { label: 'Ownership', value: investor.ownership ? `${investor.ownership}%` : '—' },
            { label: 'Last Contact', value: investor.lastContact },
            { label: 'Next Follow-up', value: investor.nextFollowUp ?? '—' },
            { label: 'Preferred Stages', value: investor.preferredStage.map(s => STAGE_LABEL[s]).join(', ') || '—' },
          ].map(item => (
            <div key={item.label} className="os-card p-4">
              <p className="text-[10px] text-[var(--os-text-2)] uppercase tracking-widest font-semibold mb-1">{item.label}</p>
              <p className="text-sm font-semibold text-[var(--os-text-1)]">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-[var(--os-text-1)] leading-relaxed">{investor.notes || <span className="text-[var(--os-text-2)] italic">No notes yet.</span>}</p>
          </CardBody>
        </Card>

        {/* Tags */}
        {investor.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {investor.tags.map(tag => (
              <span key={tag} className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: '#7c3aed20', color: '#7c3aed' }}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
