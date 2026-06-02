import { Mail, Phone, MapPin, Globe, ChevronRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Avatar } from '@design-system/components/Avatar'
import { useInvestorsStore } from '../store'

const STATUS_BADGE: Record<string, 'success' | 'info' | 'warning' | 'neutral' | 'danger'> = {
  committed: 'success', engaged: 'info', prospect: 'neutral', passed: 'danger', active: 'success',
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
  const { investors, selectedId, setSelected } = useInvestorsStore()
  const investor = investors.find(i => i.id === selectedId) ?? investors[0]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Investor list */}
      <Card className="lg:col-span-1 h-fit">
        <CardHeader>
          <CardTitle>Investors</CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-slate-100">
            {investors.map(inv => (
              <button
                key={inv.id}
                onClick={() => setSelected(inv.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                  inv.id === selectedId ? 'bg-blue-50' : ''
                }`}
              >
                <Avatar name={inv.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{inv.name}</p>
                  <p className="text-xs text-slate-500 truncate">{inv.firm}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant={STATUS_BADGE[inv.status] ?? 'neutral'} size="sm" dot />
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </div>
              </button>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Profile detail */}
      <div className="lg:col-span-2 space-y-5">
        {/* Header */}
        <Card>
          <CardBody className="flex items-start gap-5 p-6">
            <Avatar name={investor.name} size="xl" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{investor.name}</h2>
                  <p className="text-sm text-slate-500 mt-0.5">{investor.firm} · {TYPE_LABEL[investor.type]}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant={STATUS_BADGE[investor.status] ?? 'neutral'} size="sm" dot>
                    {investor.status.charAt(0).toUpperCase() + investor.status.slice(1)}
                  </Badge>
                  {investor.leadInvestor && <Badge variant="brand" size="sm">Lead Investor</Badge>}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{investor.email}</span>
                {investor.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{investor.phone}</span>}
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{investor.country}</span>
                <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" />{investor.portfolio} portfolio cos.</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Investment details */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Check Size', value: `£${investor.checkSize.min}k – £${investor.checkSize.max > 999 ? `${(investor.checkSize.max / 1000).toFixed(0)}M` : `${investor.checkSize.max}k`}` },
            { label: 'Committed', value: investor.committed > 0 ? `£${investor.committed}k` : '—' },
            { label: 'Ownership', value: investor.ownership ? `${investor.ownership}%` : '—' },
            { label: 'Last Contact', value: investor.lastContact },
            { label: 'Next Follow-up', value: investor.nextFollowUp ?? '—' },
            { label: 'Preferred Stages', value: investor.preferredStage.map(s => STAGE_LABEL[s]).join(', ') },
          ].map(item => (
            <div key={item.label} className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">{item.label}</p>
              <p className="text-sm font-semibold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-slate-700 leading-relaxed">{investor.notes}</p>
          </CardBody>
        </Card>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {investor.tags.map(tag => (
            <Badge key={tag} variant="neutral" size="sm">{tag}</Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
