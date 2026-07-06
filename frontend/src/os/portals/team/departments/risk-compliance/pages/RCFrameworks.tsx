import { Sparkles } from 'lucide-react'
import { ShieldCheck } from '@phosphor-icons/react'

const ACCENT = '#B91C1C'

interface Framework {
  name:     string
  score:    number | null
  scoreLabel: string
  status:   string
  statusColor: string
  description: string
}

const FRAMEWORKS: Framework[] = [
  { name: 'ISO 27001',    score: 87,   scoreLabel: '87% Compliant', status: 'In Progress',  statusColor: '#F59E0B', description: 'Information security management system — 18 controls outstanding, primarily in A.12 (Operations) and A.15 (Supplier relationships).' },
  { name: 'SOC 2 Type II',score: 100,  scoreLabel: 'Certified',     status: 'Certified',    statusColor: '#10B981', description: 'Service Organization Controls — Type II audit completed May 2026. Next audit due May 2027. Report available for client NDA requests.' },
  { name: 'GDPR',         score: 92,   scoreLabel: '92% Compliant', status: 'In Progress',  statusColor: '#F59E0B', description: 'General Data Protection Regulation — ROPA complete. DPA review in progress. Cookie consent update required (see RC-006).' },
  { name: 'DPDP',         score: 34,   scoreLabel: '34% — In Progress', status: 'At Risk',  statusColor: '#EF4444', description: 'India Digital Personal Data Protection Act — consent mechanism and data principal rights not yet implemented. Enforcement risk from Q3 2026.' },
  { name: 'HIPAA',        score: null, scoreLabel: 'N/A',           status: 'N/A',          statusColor: '#6B7280', description: 'Health Insurance Portability and Accountability Act — not a primary obligation. PHI handling policy required for HealthGroup project (see RC-007).' },
]

export function RCFrameworks() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <ShieldCheck size={24} weight="duotone" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Compliance Frameworks</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Status across all regulatory and certification frameworks tracked by Risk &amp; Compliance.</p>
        </div>
      </div>

      <div className="rounded-2xl border p-5 flex gap-4" style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}08` }}>
        <Sparkles size={18} style={{ color: ACCENT }} className="mt-0.5 shrink-0" />
        <p className="text-sm text-[var(--os-text-1)]">
          <span className="font-semibold" style={{ color: ACCENT }}>KIMMP: </span>
          DPDP at 34% is the highest enforcement risk heading into Q3. ISO 27001 A.15 supplier relationship controls are
          blocking full certification — link this directly to the vendor risk remediation programme. SOC 2 Type II is clean;
          retain evidence artefacts monthly to reduce next audit prep time by an estimated 40%.
        </p>
      </div>

      <div className="space-y-4">
        {FRAMEWORKS.map(fw => (
          <div key={fw.name} className="p-6 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-white">{fw.name}</h3>
                <span
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ background: `${fw.statusColor}22`, color: fw.statusColor }}
                >
                  {fw.status}
                </span>
              </div>
              <span className="text-sm font-bold" style={{ color: fw.statusColor }}>{fw.scoreLabel}</span>
            </div>
            {fw.score !== null && (
              <div className="space-y-1">
                <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${fw.score}%`, backgroundColor: fw.statusColor }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[var(--os-text-2)]">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            )}
            <p className="text-sm text-[var(--os-text-2)] leading-relaxed">{fw.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
