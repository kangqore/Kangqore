import { useState } from 'react'
import { Bug } from 'lucide-react'

const ACCENT = '#EF4444'

type Severity  = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
type VulnStatus = 'UNPATCHED' | 'PATCHING' | 'PATCHED'

interface Vulnerability {
  cveId: string
  title: string
  severity: Severity
  cvss: number
  system: string
  patchAvailable: boolean
  daysOverdue: number | null
  status: VulnStatus
}

const VULNS: Vulnerability[] = [
  { cveId: 'CVE-2025-4471', title: 'VPN gateway remote code execution',          severity: 'CRITICAL', cvss: 9.8, system: 'VPN Gateway',        patchAvailable: true,  daysOverdue: 21,  status: 'UNPATCHED' },
  { cveId: 'CVE-2025-3891', title: 'OpenSSL buffer overflow in TLS handshake',   severity: 'CRITICAL', cvss: 9.1, system: 'All Linux servers',    patchAvailable: true,  daysOverdue: 14,  status: 'PATCHING'  },
  { cveId: 'CVE-2025-3204', title: 'Apache HTTP Server path traversal',           severity: 'HIGH',     cvss: 8.2, system: 'Web servers (×4)',      patchAvailable: true,  daysOverdue: 7,   status: 'UNPATCHED' },
  { cveId: 'CVE-2025-2987', title: 'PostgreSQL privilege escalation',             severity: 'HIGH',     cvss: 7.8, system: 'Production DB',         patchAvailable: true,  daysOverdue: 5,   status: 'PATCHING'  },
  { cveId: 'CVE-2025-2441', title: 'Node.js SSRF via undici fetch',               severity: 'HIGH',     cvss: 7.3, system: 'API service v2',        patchAvailable: true,  daysOverdue: null, status: 'PATCHING' },
  { cveId: 'CVE-2025-1802', title: 'Redis ACL bypass — unauthenticated commands', severity: 'MEDIUM',   cvss: 6.1, system: 'Cache layer',           patchAvailable: true,  daysOverdue: null, status: 'PATCHED'  },
  { cveId: 'CVE-2024-9812', title: 'curl certificate validation bypass',          severity: 'MEDIUM',   cvss: 5.4, system: 'Build agents (×6)',      patchAvailable: true,  daysOverdue: null, status: 'PATCHED'  },
  { cveId: 'CVE-2024-8734', title: 'SSH weak key exchange — Diffie-Hellman 1024', severity: 'LOW',      cvss: 3.7, system: 'Legacy SSH endpoints',  patchAvailable: false, daysOverdue: null, status: 'UNPATCHED' },
]

const SEV_COLOR: Record<Severity, string> = {
  CRITICAL: '#EF4444',
  HIGH:     '#F97316',
  MEDIUM:   '#F59E0B',
  LOW:      '#60A5FA',
}

const STATUS_COLOR: Record<VulnStatus, string> = {
  UNPATCHED: '#EF4444',
  PATCHING:  '#F59E0B',
  PATCHED:   '#10B981',
}

export function SecurityVulnerabilities() {
  const [filter, setFilter] = useState<'ALL' | Severity>('ALL')

  const criticalUnpatched = VULNS.filter(v => v.severity === 'CRITICAL' && v.status !== 'PATCHED').length
  const overdueSLA        = VULNS.filter(v => v.daysOverdue !== null).length
  const avgCVSS           = +(VULNS.reduce((a, v) => a + v.cvss, 0) / VULNS.length).toFixed(1)

  const visible = filter === 'ALL' ? VULNS : VULNS.filter(v => v.severity === filter)

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: 'ALL',      label: 'All' },
    { key: 'CRITICAL', label: 'Critical' },
    { key: 'HIGH',     label: 'High' },
    { key: 'MEDIUM',   label: 'Medium' },
    { key: 'LOW',      label: 'Low' },
  ]

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${ACCENT}22` }}>
          <Bug size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Vulnerabilities</h1>
          <p className="text-sm text-[var(--os-text-2)]">CVE tracking — patch status and SLA breach monitoring</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total CVEs',        value: '47',                    sub: 'in scope'              },
          { label: 'Critical Unpatched', value: String(criticalUnpatched + 15), sub: 'immediate remediation' },
          { label: 'Avg CVSS',          value: String(avgCVSS),         sub: 'across open CVEs'      },
          { label: 'Overdue SLA',       value: String(overdueSLA + 18), sub: 'breached patch window' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-xs text-[var(--os-text-2)] mb-1">{k.label}</p>
            <p className="text-2xl font-bold text-white">{k.value}</p>
            <p className="text-xs text-[var(--os-text-2)] mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filter === t.key
                ? 'text-white'
                : 'text-[var(--os-text-2)] bg-slate-800/60 hover:bg-slate-700/60'
            }`}
            style={filter === t.key ? { background: ACCENT } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* CVE List */}
      <div className="space-y-2">
        {visible.map(v => {
          const sc  = SEV_COLOR[v.severity]
          const stc = STATUS_COLOR[v.status]
          return (
            <div
              key={v.cveId}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs text-[var(--os-text-2)] font-mono">{v.cveId}</p>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: `${sc}22`, color: sc }}
                  >
                    {v.severity}
                  </span>
                </div>
                <p className="text-sm font-semibold text-white">{v.title}</p>
                <p className="text-xs text-[var(--os-text-2)]">{v.system}</p>
              </div>
              <div className="text-center w-16 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">CVSS</p>
                <p className="text-lg font-bold" style={{ color: sc }}>{v.cvss}</p>
              </div>
              <div className="text-center w-24 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Patch</p>
                <p className="text-xs font-semibold" style={{ color: v.patchAvailable ? '#10B981' : '#EF4444' }}>
                  {v.patchAvailable ? 'Available' : 'None yet'}
                </p>
              </div>
              <div className="text-right w-28 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">SLA</p>
                <p className="text-xs font-medium" style={{ color: v.daysOverdue ? '#EF4444' : '#94A3B8' }}>
                  {v.daysOverdue ? `${v.daysOverdue}d overdue` : 'Within SLA'}
                </p>
              </div>
              <div className="w-28 text-right shrink-0">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${stc}22`, color: stc }}
                >
                  {v.status.charAt(0) + v.status.slice(1).toLowerCase().replace('_', ' ')}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
