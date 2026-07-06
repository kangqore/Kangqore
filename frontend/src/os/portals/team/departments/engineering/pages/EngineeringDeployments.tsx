import { Rocket, CheckCircle, XCircle, Activity, Brain } from 'lucide-react'

const ACCENT = '#84CC16'

type DeployStatus = 'Success' | 'Failed' | 'Rollback'
type EnvType = 'Production' | 'Staging' | 'Dev'

interface Environment {
  name:       EnvType
  version:    string
  health:     'Healthy' | 'Degraded'
  lastDeploy: string
}

interface Deploy {
  id:          string
  timestamp:   string
  version:     string
  env:         EnvType
  status:      DeployStatus
  triggeredBy: string
  note?:       string
}

const ENVIRONMENTS: Environment[] = [
  { name: 'Production', version: 'v2.4.1',      health: 'Healthy', lastDeploy: '2026-06-20 14:32' },
  { name: 'Staging',    version: 'v2.5.0-beta',  health: 'Healthy', lastDeploy: '2026-06-23 09:15' },
  { name: 'Dev',        version: 'latest main',   health: 'Healthy', lastDeploy: 'Continuous' },
]

const DEPLOYS: Deploy[] = [
  { id: 'D-0041', timestamp: '2026-06-23 09:15', version: 'v2.5.0-beta', env: 'Staging',    status: 'Success',  triggeredBy: 'Kavya N' },
  { id: 'D-0040', timestamp: '2026-06-22 16:48', version: 'v2.4.1',      env: 'Production', status: 'Success',  triggeredBy: 'Siddharth R' },
  { id: 'D-0039', timestamp: '2026-06-22 14:30', version: 'v2.4.1-rc2',  env: 'Staging',    status: 'Success',  triggeredBy: 'Aryan M' },
  { id: 'D-0038', timestamp: '2026-06-21 11:20', version: 'v2.4.0-rc3',  env: 'Production', status: 'Failed',   triggeredBy: 'Siddharth R', note: 'Rolled back — DB migration conflict' },
  { id: 'D-0037', timestamp: '2026-06-21 11:28', version: 'v2.4.0-rc2',  env: 'Production', status: 'Rollback', triggeredBy: 'Siddharth R' },
  { id: 'D-0036', timestamp: '2026-06-20 15:05', version: 'v2.4.0-rc2',  env: 'Staging',    status: 'Success',  triggeredBy: 'Kavya N' },
  { id: 'D-0035', timestamp: '2026-06-20 10:00', version: 'v2.3.9',      env: 'Production', status: 'Success',  triggeredBy: 'Aryan M' },
  { id: 'D-0034', timestamp: '2026-06-19 14:22', version: 'v2.3.9-rc1',  env: 'Staging',    status: 'Success',  triggeredBy: 'Kavya N' },
]

const STATUS_COLOR: Record<DeployStatus, string> = {
  Success:  '#10B981',
  Failed:   '#EF4444',
  Rollback: '#F59E0B',
}

const ENV_COLOR: Record<EnvType, string> = {
  Production: '#84CC16',
  Staging:    '#6366F1',
  Dev:        '#06B6D4',
}

export function EngineeringDeployments() {
  const successes  = DEPLOYS.filter(d => d.status === 'Success').length
  const rollbacks  = DEPLOYS.filter(d => d.status === 'Rollback').length

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Rocket className="w-6 h-6" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Deployments</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Pipeline status, environment health, and deployment history.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Deploys This Week', value: `${DEPLOYS.length}`,  color: ACCENT },
          { label: 'Success Rate',      value: '97.5%',               color: '#10B981' },
          { label: 'Avg Deploy Time',   value: '4.2m',                color: '#6366F1' },
          { label: 'Rollbacks',         value: `${rollbacks}`,        color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Environment status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {ENVIRONMENTS.map(env => (
          <div
            key={env.name}
            className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: `${ENV_COLOR[env.name]}18`, color: ENV_COLOR[env.name] }}
              >
                {env.name}
              </span>
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-green-400" />
                <span className="text-xs text-green-400 font-medium">{env.health}</span>
              </div>
            </div>
            <p className="text-lg font-bold text-white font-mono">{env.version}</p>
            <p className="text-xs text-[var(--os-text-2)] mt-1">Last deploy: {env.lastDeploy}</p>
          </div>
        ))}
      </div>

      {/* Deployment history */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Deployment History</h2>
          <span className="text-xs text-[var(--os-text-2)]">{successes} successful this week</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider w-24">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider w-40">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider w-32">Version</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider w-28">Env</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider w-28">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider">Triggered by</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {DEPLOYS.map(d => (
                <tr
                  key={d.id}
                  className={`transition-colors ${d.status === 'Failed' ? 'bg-red-500/5' : d.status === 'Rollback' ? 'bg-yellow-500/5' : 'hover:bg-white/[0.02]'}`}
                >
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-[var(--os-text-2)]">{d.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-[var(--os-text-2)]">{d.timestamp}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-white">{d.version}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: `${ENV_COLOR[d.env]}18`, color: ENV_COLOR[d.env] }}
                    >
                      {d.env}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {d.status === 'Success'  && <CheckCircle className="w-3.5 h-3.5 text-green-400" />}
                      {d.status === 'Failed'   && <XCircle className="w-3.5 h-3.5 text-red-400" />}
                      {d.status === 'Rollback' && <Activity className="w-3.5 h-3.5 text-yellow-400" />}
                      <span
                        className="text-xs font-medium"
                        style={{ color: STATUS_COLOR[d.status] }}
                      >
                        {d.status}
                      </span>
                    </div>
                    {d.note && <p className="text-xs text-red-400 mt-0.5">{d.note}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[var(--os-text-2)]">{d.triggeredBy}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KIMMP insight */}
      <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5 flex gap-4">
        <div className="w-9 h-9 rounded-xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
          <Brain className="w-4 h-4 text-yellow-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-yellow-400 mb-1">KIMMP · Deployment Intelligence</p>
          <p className="text-sm text-[var(--os-text-1)] leading-relaxed">
            Staging has 3 unverified breaking changes from ENG-201. Recommend QA sign-off before promoting to production on 2026-07-01.
          </p>
        </div>
      </div>
    </div>
  )
}
