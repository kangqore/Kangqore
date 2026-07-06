import { Sparkles } from 'lucide-react'
import { WarningCircle } from '@phosphor-icons/react'

const ACCENT = '#B91C1C'

type ResidualRisk = 'High' | 'Med' | 'Low'

interface RiskException {
  id:           string
  risk:         string
  rationale:    string
  approver:     string
  approvedDate: string
  expiryDate:   string
  residual:     ResidualRisk
}

const EXCEPTIONS: RiskException[] = [
  { id: 'EXC-001', risk: 'Legacy backup servers without encryption at rest', rationale: 'Encryption retrofit requires 3-month migration window; mitigated by network segmentation', approver: 'CISO', approvedDate: '2026-03-01', expiryDate: '2026-09-01', residual: 'High' },
  { id: 'EXC-002', risk: 'MFA not enforced on legacy internal application', rationale: 'Application cannot support MFA — migration to replacement system in Q3', approver: 'Maya Nair', approvedDate: '2026-04-15', expiryDate: '2026-09-30', residual: 'Med' },
  { id: 'EXC-003', risk: 'Security awareness training below 80% completion', rationale: 'Onboarding backlog — new hire cohort training in progress', approver: 'Arjun Singh', approvedDate: '2026-06-01', expiryDate: '2026-07-31', residual: 'Low' },
  { id: 'EXC-004', risk: 'DPDP consent mechanism not in production', rationale: 'Development in sprint — live date 2026-08-01', approver: 'CISO', approvedDate: '2026-06-10', expiryDate: '2026-08-15', residual: 'High' },
  { id: 'EXC-005', risk: 'Penetration test remediation items not fully closed', rationale: '3 medium findings deferred to infrastructure refresh cycle Q4', approver: 'Maya Nair', approvedDate: '2026-05-20', expiryDate: '2026-12-01', residual: 'Med' },
  { id: 'EXC-006', risk: 'Cookie consent banner partial coverage', rationale: 'Analytics vendor change in progress — new banner deployed with updated vendor', approver: 'Arjun Singh', approvedDate: '2026-06-05', expiryDate: '2026-07-15', residual: 'Low' },
  { id: 'EXC-007', risk: 'PHI handling policy not documented for HealthGroup project', rationale: 'Policy drafting in progress — interim controls via contractual DPA in place', approver: 'CISO', approvedDate: '2026-06-12', expiryDate: '2026-08-01', residual: 'Med' },
]

const RESIDUAL_COLOR: Record<ResidualRisk, string> = { High: '#EF4444', Med: '#F59E0B', Low: '#10B981' }

export function RCExceptions() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <WarningCircle size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Exceptions Register</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Approved risk exceptions with expiry dates and residual risk ratings.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Exceptions', value: String(EXCEPTIONS.length),                                          color: ACCENT },
          { label: 'High Residual',     value: String(EXCEPTIONS.filter(e => e.residual === 'High').length),    color: '#EF4444' },
          { label: 'Med Residual',      value: String(EXCEPTIONS.filter(e => e.residual === 'Med').length),     color: '#F59E0B' },
          { label: 'Low Residual',      value: String(EXCEPTIONS.filter(e => e.residual === 'Low').length),     color: '#10B981' },
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
          EXC-001 and EXC-004 both carry High residual risk with CISO-level approval — these should be escalated to the Risk
          Committee monthly. EXC-003 expires 31 July; if training completion is still below 80%, do not renew — enforce mandatory
          completion with line manager accountability. Total 7 exceptions active is above the 5-exception control threshold in the policy.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['ID', 'Risk', 'Rationale', 'Approver', 'Approved', 'Expires', 'Residual Risk'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {EXCEPTIONS.map(e => {
                const rc = RESIDUAL_COLOR[e.residual]
                return (
                  <tr key={e.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3"><span className="text-xs font-mono text-[var(--os-text-2)]">{e.id}</span></td>
                    <td className="px-4 py-3 text-white max-w-xs">{e.risk}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] text-xs max-w-xs">{e.rationale}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{e.approver}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{e.approvedDate}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{e.expiryDate}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${rc}22`, color: rc }}>{e.residual}</span>
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
