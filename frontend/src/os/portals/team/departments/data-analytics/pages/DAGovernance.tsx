import { Sparkles } from 'lucide-react'
import { ShieldCheck } from '@phosphor-icons/react'

const ACCENT = '#0284C7'

type Classification = 'Public' | 'Internal' | 'Confidential' | 'Restricted'
type GovStatus = 'Active' | 'Review Due' | 'Deprecated'

interface DataAsset {
  asset:           string
  classification:  Classification
  owner:           string
  retention:       string
  gdpr:            boolean
  status:          GovStatus
}

const ASSETS: DataAsset[] = [
  { asset: 'Customer PII (CRM)',         classification: 'Restricted',   owner: 'Vikram Rao',  retention: '7 years',  gdpr: true,  status: 'Active' },
  { asset: 'Financial Transactions',     classification: 'Confidential', owner: 'Vikram Rao',  retention: '7 years',  gdpr: false, status: 'Active' },
  { asset: 'Employee Records',           classification: 'Confidential', owner: 'Deepa Menon', retention: '7 years',  gdpr: true,  status: 'Active' },
  { asset: 'Marketing Contact Database', classification: 'Restricted',   owner: 'Deepa Menon', retention: '3 years',  gdpr: true,  status: 'Review Due' },
  { asset: 'Support Ticket Data',        classification: 'Confidential', owner: 'Vikram Rao',  retention: '3 years',  gdpr: true,  status: 'Active' },
  { asset: 'Application Logs',           classification: 'Internal',     owner: 'Cyrus Irani', retention: '90 days',  gdpr: false, status: 'Active' },
  { asset: 'Product Usage Analytics',    classification: 'Internal',     owner: 'Cyrus Irani', retention: '2 years',  gdpr: true,  status: 'Active' },
  { asset: 'Website Traffic Data',       classification: 'Public',       owner: 'Deepa Menon', retention: '26 months',gdpr: true,  status: 'Review Due' },
  { asset: 'Legacy CRM Export (2021)',   classification: 'Restricted',   owner: 'Vikram Rao',  retention: 'Review',   gdpr: true,  status: 'Deprecated' },
]

const CLASS_COLOR: Record<Classification, string> = {
  Public:       '#6B7280',
  Internal:     '#6366F1',
  Confidential: '#F59E0B',
  Restricted:   '#EF4444',
}

const STATUS_COLOR: Record<GovStatus, string> = {
  Active:      '#10B981',
  'Review Due':'#F59E0B',
  Deprecated:  '#EF4444',
}

export function DAGovernance() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <ShieldCheck size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Data Governance</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Data asset register — classification, ownership, retention and GDPR applicability.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Restricted Assets',  value: String(ASSETS.filter(a => a.classification === 'Restricted').length),   color: '#EF4444' },
          { label: 'Confidential',       value: String(ASSETS.filter(a => a.classification === 'Confidential').length), color: '#F59E0B' },
          { label: 'GDPR Applicable',    value: String(ASSETS.filter(a => a.gdpr).length),                              color: ACCENT },
          { label: 'Review Due',         value: String(ASSETS.filter(a => a.status === 'Review Due').length),            color: '#F97316' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border p-5 flex gap-4" style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}08` }}>
        <Sparkles size={18} style={{ color: ACCENT }} className="mt-0.5 shrink-0" />
        <p className="text-sm text-[var(--os-text-1)]">
          <span className="font-semibold" style={{ color: ACCENT }}>KIMMP: </span>
          Legacy CRM Export (2021) is deprecated but still stored — this is a GDPR Article 5(e) storage limitation
          violation. Delete or anonymise immediately. Marketing Contact Database review is overdue — GDPR consent
          lawful basis should be re-validated. Website Traffic data uses Google Analytics; with DPDP in scope, verify
          that the consent banner covers Indian visitors and that data residency requirements are met.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Data Asset', 'Classification', 'Owner', 'Retention', 'GDPR', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {ASSETS.map(a => {
                const cc = CLASS_COLOR[a.classification]
                const sc = STATUS_COLOR[a.status]
                return (
                  <tr key={a.asset} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{a.asset}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${cc}22`, color: cc }}>{a.classification}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{a.owner}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{a.retention}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${a.gdpr ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700/40 text-[var(--os-text-2)]'}`}>
                        {a.gdpr ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>{a.status}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
