import { Sparkles } from 'lucide-react'
import { Buildings } from '@phosphor-icons/react'

const ACCENT = '#16A34A'

type VendorHealth = 'Good' | 'At Risk' | 'Critical'

interface OpsVendor {
  vendor:          string
  category:        string
  spendPA:         string
  slaAdherence:    number
  relationshipOwner: string
  contractExpiry:  string
  health:          VendorHealth
}

const VENDORS: OpsVendor[] = [
  { vendor: 'AWS',                 category: 'Cloud',            spendPA: '£148k',  slaAdherence: 99.9, relationshipOwner: 'Suresh Nambiar', contractExpiry: '2027-12-31', health: 'Good' },
  { vendor: 'Salesforce',          category: 'CRM',              spendPA: '£64k',   slaAdherence: 98.2, relationshipOwner: 'Leela Krishnan', contractExpiry: '2026-03-31', health: 'At Risk' },
  { vendor: 'NCC Group',           category: 'Security',         spendPA: '£18k',   slaAdherence: 95.0, relationshipOwner: 'Suresh Nambiar', contractExpiry: '2026-07-31', health: 'Good' },
  { vendor: 'Slack Technologies',  category: 'Collaboration',    spendPA: '£8k',    slaAdherence: 99.5, relationshipOwner: 'Leela Krishnan', contractExpiry: '2026-05-31', health: 'At Risk' },
  { vendor: 'Dell Technologies',   category: 'Hardware',         spendPA: '£24k',   slaAdherence: 96.4, relationshipOwner: 'Suresh Nambiar', contractExpiry: '2028-08-31', health: 'Good' },
  { vendor: 'Herman Miller',       category: 'Facilities',       spendPA: '£12k',   slaAdherence: 84.2, relationshipOwner: 'Leela Krishnan', contractExpiry: '2027-01-31', health: 'At Risk' },
  { vendor: 'Legacy Print Co.',    category: 'Print',            spendPA: '£1.8k',  slaAdherence: 71.0, relationshipOwner: 'Suresh Nambiar', contractExpiry: '2026-12-31', health: 'Critical' },
  { vendor: 'Datadog',             category: 'Monitoring',       spendPA: '£4.8k',  slaAdherence: 99.8, relationshipOwner: 'Leela Krishnan', contractExpiry: '2027-04-01', health: 'Good' },
]

const HEALTH_COLOR: Record<VendorHealth, string> = { Good: '#10B981', 'At Risk': '#F59E0B', Critical: '#EF4444' }

export function OpsVendors() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Buildings size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Vendor Management</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Operational vendor health, SLA adherence and contract expiry tracking.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Good',     value: String(VENDORS.filter(v => v.health === 'Good').length),     color: '#10B981' },
          { label: 'At Risk',  value: String(VENDORS.filter(v => v.health === 'At Risk').length),  color: '#F59E0B' },
          { label: 'Critical', value: String(VENDORS.filter(v => v.health === 'Critical').length), color: '#EF4444' },
          { label: 'Avg SLA',  value: `${(VENDORS.reduce((acc, v) => acc + v.slaAdherence, 0) / VENDORS.length).toFixed(1)}%`, color: ACCENT },
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
          Legacy Print Co. at 71% SLA adherence is Critical — initiate a formal performance improvement notice and
          put the contract to competitive tender immediately. Salesforce and Slack are At Risk due to expired/expiring
          contracts (not performance) — raise as procurement priority. Herman Miller at 84.2% SLA is below threshold;
          investigate delivery delays and issue a formal notice if not resolved by month-end.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Vendor', 'Category', 'Spend pa', 'SLA Adherence', 'Owner', 'Contract Expiry', 'Health'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {VENDORS.map(v => {
                const hc = HEALTH_COLOR[v.health]
                const slaColor = v.slaAdherence >= 98 ? '#10B981' : v.slaAdherence >= 90 ? '#F59E0B' : '#EF4444'
                return (
                  <tr key={v.vendor} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{v.vendor}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{v.category}</td>
                    <td className="px-4 py-3 text-white font-semibold whitespace-nowrap">{v.spendPA}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-bold" style={{ color: slaColor }}>{v.slaAdherence}%</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{v.relationshipOwner}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{v.contractExpiry}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${hc}22`, color: hc }}>{v.health}</span>
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
