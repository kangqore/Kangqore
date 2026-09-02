import { Activity, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react'

const ACCENT = '#84CC16'

interface ServiceHealth {
  name:       string
  status:     'UP' | 'DEGRADED' | 'DOWN'
  uptime:     string
  latency:    string
  errorRate:  string
  lastCheck:  string
}

const SERVICES: ServiceHealth[] = [
  { name: 'API Gateway',       status: 'UP',       uptime: '99.97%', latency: '142ms', errorRate: '0.06%', lastCheck: '30s ago' },
  { name: 'Auth Service',      status: 'UP',       uptime: '99.99%', latency: '88ms',  errorRate: '0.02%', lastCheck: '30s ago' },
  { name: 'Database (prod)',   status: 'UP',       uptime: '99.94%', latency: '24ms',  errorRate: '0.00%', lastCheck: '30s ago' },
  { name: 'KIMMP Engine',      status: 'UP',       uptime: '99.91%', latency: '310ms', errorRate: '0.11%', lastCheck: '30s ago' },
  { name: 'HANUMANAS Audit Log',   status: 'UP',       uptime: '100%',   latency: '18ms',  errorRate: '0.00%', lastCheck: '30s ago' },
  { name: 'File Storage (S3)', status: 'UP',       uptime: '99.99%', latency: '220ms', errorRate: '0.01%', lastCheck: '30s ago' },
  { name: 'Email Service',     status: 'DEGRADED', uptime: '98.4%',  latency: '1.2s',  errorRate: '3.20%', lastCheck: '30s ago' },
  { name: 'TTS (macOS say)',   status: 'UP',       uptime: '99.82%', latency: '640ms', errorRate: '0.18%', lastCheck: '30s ago' },
]

const STATUS_COLOR = { UP: '#10B981', DEGRADED: '#F59E0B', DOWN: '#EF4444' }

export function EngineeringMonitoring() {
  const up       = SERVICES.filter(s => s.status === 'UP').length
  const degraded = SERVICES.filter(s => s.status === 'DEGRADED').length
  const down     = SERVICES.filter(s => s.status === 'DOWN').length

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Activity size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">System Monitoring</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Live service health · 99.94% platform uptime · 1 active alert</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Platform Uptime',  value: '99.94%', color: ACCENT },
          { label: 'Avg Response',     value: '142ms',  color: '#10B981' },
          { label: 'Error Rate',       value: '0.08%',  color: '#6366F1' },
          { label: 'Services Up',      value: `${up}/${SERVICES.length}`, color: '#10B981' },
          { label: 'Active Alerts',    value: String(degraded + down),    color: degraded + down > 0 ? '#F59E0B' : '#10B981' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {degraded > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 flex gap-4">
          <AlertTriangle size={18} className="text-amber-400 mt-0.5 shrink-0" />
          <p className="text-sm text-[var(--os-text-1)]">
            <span className="font-semibold text-amber-400">ACTIVE ALERT: </span>
            Email Service degraded — latency 1.2s (target &lt; 500ms), error rate 3.2%. Siddharth investigating SMTP relay timeout. ETA: 30 min.
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-lime-500/30 bg-lime-500/5 p-5 flex gap-4">
        <Sparkles size={18} className="text-lime-400 mt-0.5 shrink-0" />
        <p className="text-sm text-[var(--os-text-1)]">
          <span className="font-semibold text-lime-400">KIMMP: </span>
          Email service degradation matches pattern from 2026-04-18 SMTP relay incident (TTR: 48 min). Check Postmark API status first — 3 of 4 prior occurrences resolved at provider level.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Service Status</h2>
          <span className="text-xs text-[var(--os-text-2)]">Updated 30s ago</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Service', 'Status', 'Uptime', 'Latency', 'Error Rate', 'Last Check'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {SERVICES.map(s => {
                const sc = STATUS_COLOR[s.status]
                return (
                  <tr key={s.name} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-white font-medium whitespace-nowrap">{s.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${sc}18`, color: sc }}>
                        {s.status === 'UP' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--os-text-1)] whitespace-nowrap font-mono text-xs">{s.uptime}</td>
                    <td className="px-6 py-4 text-[var(--os-text-1)] whitespace-nowrap font-mono text-xs">{s.latency}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs" style={{ color: parseFloat(s.errorRate) > 1 ? '#F59E0B' : '#10B981' }}>{s.errorRate}</td>
                    <td className="px-6 py-4 text-[var(--os-text-2)] whitespace-nowrap text-xs">{s.lastCheck}</td>
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
